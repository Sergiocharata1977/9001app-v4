import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
  error?: Error;
}

export class Logger {
  private context: string;
  private logLevel: LogLevel;
  private logFile: string;
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogFiles: number = 5;

  constructor(context: string, logLevel: LogLevel = 'info') {
    this.context = context;
    this.logLevel = logLevel;
    this.logFile = this.getLogFilePath();
    this.ensureLogDirectory();
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log de información
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log de advertencia
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log de error
   */
  error(message: string, error?: Error | any): void {
    this.log('error', message, undefined, error);
  }

  /**
   * Método principal de logging
   */
  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
      error
    };

    // Log a consola
    this.logToConsole(entry);
    
    // Log a archivo
    this.logToFile(entry);
  }

  /**
   * Verificar si debe hacer log según el nivel
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Log a consola con colores
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = chalk.gray(entry.timestamp);
    const context = chalk.cyan(`[${entry.context}]`);
    const levelColor = this.getLevelColor(entry.level);
    const levelText = chalk[levelColor](entry.level.toUpperCase().padEnd(5));
    
    let output = `${timestamp} ${levelText} ${context} ${entry.message}`;
    
    if (entry.data) {
      output += ` ${chalk.gray(JSON.stringify(entry.data))}`;
    }
    
    if (entry.error) {
      output += `\n${chalk.red(entry.error.stack || entry.error.message)}`;
    }
    
    console.log(output);
  }

  /**
   * Log a archivo
   */
  private logToFile(entry: LogEntry): void {
    try {
      const logLine = this.formatLogLine(entry);
      fs.appendFileSync(this.logFile, logLine + '\n');
      
      // Rotar logs si es necesario
      this.rotateLogsIfNeeded();
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Formatear línea de log para archivo
   */
  private formatLogLine(entry: LogEntry): string {
    let line = `${entry.timestamp} [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}`;
    
    if (entry.data) {
      line += ` | DATA: ${JSON.stringify(entry.data)}`;
    }
    
    if (entry.error) {
      line += ` | ERROR: ${entry.error.message}`;
      if (entry.error.stack) {
        line += ` | STACK: ${entry.error.stack.replace(/\n/g, ' | ')}`;
      }
    }
    
    return line;
  }

  /**
   * Obtener color para nivel de log
   */
  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case 'debug': return 'gray';
      case 'info': return 'blue';
      case 'warn': return 'yellow';
      case 'error': return 'red';
      default: return 'white';
    }
  }

  /**
   * Obtener ruta del archivo de log
   */
  private getLogFilePath(): string {
    const logDir = path.join(process.cwd(), 'logs');
    const date = new Date().toISOString().split('T')[0];
    return path.join(logDir, `agent-coordinator-${date}.log`);
  }

  /**
   * Asegurar que existe el directorio de logs
   */
  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Rotar logs si es necesario
   */
  private rotateLogsIfNeeded(): void {
    try {
      const stats = fs.statSync(this.logFile);
      
      if (stats.size > this.maxLogSize) {
        this.rotateLogFile();
      }
    } catch (error) {
      // Archivo no existe, no hay problema
    }
  }

  /**
   * Rotar archivo de log
   */
  private rotateLogFile(): void {
    const logDir = path.dirname(this.logFile);
    const baseName = path.basename(this.logFile, '.log');
    
    // Mover archivos existentes
    for (let i = this.maxLogFiles - 1; i >= 1; i--) {
      const oldFile = path.join(logDir, `${baseName}.${i}.log`);
      const newFile = path.join(logDir, `${baseName}.${i + 1}.log`);
      
      if (fs.existsSync(oldFile)) {
        if (i === this.maxLogFiles - 1) {
          fs.unlinkSync(oldFile);
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }
    
    // Renombrar archivo actual
    const backupFile = path.join(logDir, `${baseName}.1.log`);
    fs.renameSync(this.logFile, backupFile);
  }

  /**
   * Cambiar nivel de log
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Obtener estadísticas de logs
   */
  getLogStats(): { fileSize: number; lineCount: number } {
    try {
      const stats = fs.statSync(this.logFile);
      const content = fs.readFileSync(this.logFile, 'utf8');
      const lineCount = content.split('\n').length - 1;
      
      return {
        fileSize: stats.size,
        lineCount
      };
    } catch (error) {
      return {
        fileSize: 0,
        lineCount: 0
      };
    }
  }

  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs(daysToKeep: number = 7): void {
    const logDir = path.dirname(this.logFile);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    try {
      const files = fs.readdirSync(logDir);
      
      files.forEach(file => {
        if (file.startsWith('agent-coordinator-') && file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            this.info(`Log file deleted: ${file}`);
          }
        }
      });
    } catch (error) {
      this.error('Error cleaning old logs', error);
    }
  }
}
