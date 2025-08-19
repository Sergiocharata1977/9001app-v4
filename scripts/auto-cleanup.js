const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AutoCleanup {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/cleanup.log');
    this.stats = {
      filesRemoved: 0,
      spaceFreed: 0,
      duplicatesFound: 0,
      errors: 0,
      startTime: new Date()
    };
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Console output
    console.log(message);
    
    // File output
    fs.appendFileSync(this.logFile, logMessage);
  }

  getFileHash(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
      return null;
    }
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  findDuplicates(directory) {
    const fileHashes = new Map();
    const duplicates = [];

    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Skip node_modules and other large directories
            if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
              scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const hash = this.getFileHash(fullPath);
            if (hash) {
              if (fileHashes.has(hash)) {
                duplicates.push({
                  original: fileHashes.get(hash),
                  duplicate: fullPath,
                  size: stat.size
                });
              } else {
                fileHashes.set(hash, fullPath);
              }
            }
          }
        }
      } catch (error) {
        this.log(`Error scanning directory ${dir}: ${error.message}`);
        this.stats.errors++;
      }
    };

    scanDirectory(directory);
    return duplicates;
  }

  cleanOldLogs() {
    const logsDir = path.join(__dirname, '../logs');
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    let cleaned = 0;

    try {
      if (fs.existsSync(logsDir)) {
        const files = fs.readdirSync(logsDir);
        const now = Date.now();

        for (const file of files) {
          const filePath = path.join(logsDir, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            const size = this.getFileSize(filePath);
            fs.unlinkSync(filePath);
            this.stats.filesRemoved++;
            this.stats.spaceFreed += size;
            cleaned++;
            this.log(`Removed old log: ${file} (${this.formatBytes(size)})`);
          }
        }
      }
    } catch (error) {
      this.log(`Error cleaning logs: ${error.message}`);
      this.stats.errors++;
    }

    return cleaned;
  }

  cleanTempFiles() {
    const tempDirs = [
      path.join(__dirname, '../frontend/temp'),
      path.join(__dirname, '../backend/temp'),
      path.join(__dirname, '../uploads/temp')
    ];

    let cleaned = 0;

    for (const tempDir of tempDirs) {
      try {
        if (fs.existsSync(tempDir)) {
          const files = fs.readdirSync(tempDir);
          
          for (const file of files) {
            const filePath = path.join(tempDir, file);
            const size = this.getFileSize(filePath);
            
            fs.unlinkSync(filePath);
            this.stats.filesRemoved++;
            this.stats.spaceFreed += size;
            cleaned++;
            this.log(`Removed temp file: ${file} (${this.formatBytes(size)})`);
          }
        }
      } catch (error) {
        this.log(`Error cleaning temp directory ${tempDir}: ${error.message}`);
        this.stats.errors++;
      }
    }

    return cleaned;
  }

  cleanBackupFiles() {
    const backupDir = path.join(__dirname, '../backups');
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    let cleaned = 0;

    try {
      if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir);
        const now = Date.now();

        for (const file of files) {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            const size = this.getFileSize(filePath);
            fs.unlinkSync(filePath);
            this.stats.filesRemoved++;
            this.stats.spaceFreed += size;
            cleaned++;
            this.log(`Removed old backup: ${file} (${this.formatBytes(size)})`);
          }
        }
      }
    } catch (error) {
      this.log(`Error cleaning backups: ${error.message}`);
      this.stats.errors++;
    }

    return cleaned;
  }

  removeDuplicates() {
    const projectRoot = path.join(__dirname, '..');
    const duplicates = this.findDuplicates(projectRoot);
    
    this.stats.duplicatesFound = duplicates.length;
    let removed = 0;

    for (const dup of duplicates) {
      try {
        const size = this.getFileSize(dup.duplicate);
        fs.unlinkSync(dup.duplicate);
        this.stats.filesRemoved++;
        this.stats.spaceFreed += size;
        removed++;
        this.log(`Removed duplicate: ${dup.duplicate} (${this.formatBytes(size)})`);
      } catch (error) {
        this.log(`Error removing duplicate ${dup.duplicate}: ${error.message}`);
        this.stats.errors++;
      }
    }

    return removed;
  }

  generateReport() {
    const duration = Date.now() - this.stats.startTime.getTime();
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${Math.round(duration / 1000)}s`,
      filesRemoved: this.stats.filesRemoved,
      spaceFreed: this.formatBytes(this.stats.spaceFreed),
      duplicatesFound: this.stats.duplicatesFound,
      errors: this.stats.errors
    };

    const reportPath = path.join(__dirname, '../logs/cleanup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  async run() {
    this.log('🚀 Iniciando limpieza automática del proyecto...');
    
    // Crear directorio de logs si no existe
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    try {
      // 1. Limpiar logs antiguos
      this.log('📋 Limpiando logs antiguos...');
      const logsCleaned = this.cleanOldLogs();
      this.log(`✅ Logs limpiados: ${logsCleaned} archivos`);

      // 2. Limpiar archivos temporales
      this.log('🗂️ Limpiando archivos temporales...');
      const tempCleaned = this.cleanTempFiles();
      this.log(`✅ Archivos temporales limpiados: ${tempCleaned} archivos`);

      // 3. Limpiar backups antiguos
      this.log('💾 Limpiando backups antiguos...');
      const backupCleaned = this.cleanBackupFiles();
      this.log(`✅ Backups limpiados: ${backupCleaned} archivos`);

      // 4. Remover duplicados
      this.log('🔍 Buscando archivos duplicados...');
      const duplicatesRemoved = this.removeDuplicates();
      this.log(`✅ Duplicados removidos: ${duplicatesRemoved} archivos`);

      // 5. Generar reporte
      const report = this.generateReport();
      this.log('📊 Reporte generado');
      
      this.log('🎉 Limpieza completada exitosamente!');
      this.log(`📈 Resumen:`);
      this.log(`   - Archivos removidos: ${report.filesRemoved}`);
      this.log(`   - Espacio liberado: ${report.spaceFreed}`);
      this.log(`   - Duplicados encontrados: ${report.duplicatesFound}`);
      this.log(`   - Errores: ${report.errors}`);
      this.log(`   - Duración: ${report.duration}`);

    } catch (error) {
      this.log(`❌ Error durante la limpieza: ${error.message}`);
      this.stats.errors++;
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const cleanup = new AutoCleanup();
  cleanup.run();
}

module.exports = AutoCleanup;
