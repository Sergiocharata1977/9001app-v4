import { EventEmitter } from 'events';
import type {
    AgentBase,
    AgentConfig,
    AgentEvent,
    AgentHealth,
    AgentMetrics,
    AgentStatus,
    AgentType,
    AgentPriority,
    EventType
} from '../types/agent.types';
import { Logger } from '../utils/Logger';

export abstract class BaseAgent extends EventEmitter implements AgentBase {
  public id: string;
  public name: string;
  public type: AgentType;
  public status: AgentStatus = 'idle';
  public priority: AgentPriority = 'medium';
  public capabilities: string[] = [];
  public dependencies: string[] = [];
  public health: AgentHealth;
  public metrics: AgentMetrics;
  public config: AgentConfig;

  protected logger: Logger;
  protected startTime: number = Date.now();
  protected isRunning: boolean = false;

  constructor(
    name: string,
    type: AgentType,
    priority: AgentPriority = 'medium',
    config: Partial<AgentConfig> = {}
  ) {
    super();
    
    this.id = `${type}-${Date.now()}`;
    this.name = name;
    this.type = type;
    this.priority = priority;
    this.logger = new Logger(`Agent:${name}`);
    
    // Configuración por defecto
    this.config = {
      maxRetries: 3,
      timeout: 30000,
      autoRestart: true,
      logLevel: 'info',
      notifications: true,
      ...config
    };

    // Inicializar métricas
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecutionTime: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };

    // Inicializar salud
    this.health = {
      isHealthy: true,
      lastCheck: new Date().toISOString(),
      uptime: 0,
      errorCount: 0,
      successRate: 100,
      responseTime: 0
    };

    this.setupEventHandlers();
  }

  /**
   * Método principal de ejecución que debe ser implementado por cada agente
   */
  abstract execute(params?: any): Promise<any>;

  /**
   * Método para validar que el agente puede ejecutar una tarea
   */
  abstract canExecute(task: any): boolean;

  /**
   * Método para obtener información específica del agente
   */
  abstract getInfo(): Record<string, any>;

  /**
   * Método para actualizar el estado del agente
   */
  updateStatus(status: AgentStatus): void {
    this.status = status;
    this.emit('statusChanged', { agentId: this.id, status });
  }

  /**
   * Ejecutar el agente con manejo de errores y métricas
   */
  async run(params?: any): Promise<any> {
    if (this.isRunning) {
      throw new Error(`Agente ${this.name} ya está ejecutándose`);
    }

    const startTime = Date.now();
    this.isRunning = true;
    this.status = 'running';
    this.metrics.totalExecutions++;

    this.emitEvent('task_started', { params, startTime });

    try {
      this.logger.info(`Iniciando ejecución del agente ${this.name}`);
      
      // Verificar dependencias
      await this.checkDependencies();
      
      // Ejecutar tarea principal
      const result = await this.execute(params);
      
      // Actualizar métricas de éxito
      const executionTime = Date.now() - startTime;
      this.updateSuccessMetrics(executionTime);
      
      this.status = 'completed';
      this.logger.info(`Agente ${this.name} completado exitosamente en ${executionTime}ms`);
      
      this.emitEvent('task_completed', { result, executionTime });
      
      return result;
      
    } catch (error) {
      // Actualizar métricas de error
      const executionTime = Date.now() - startTime;
      this.updateErrorMetrics(executionTime, error);
      
      this.status = 'failed';
      this.logger.error(`Error en agente ${this.name}:`, error);
      
      this.emitEvent('task_failed', { error, executionTime });
      
      // Intentar recuperación si está configurado
      if (this.config.autoRestart && this.metrics.failedExecutions < this.config.maxRetries) {
        await this.attemptRecovery();
      }
      
      throw error;
      
    } finally {
      this.isRunning = false;
      this.updateHealth();
    }
  }

  /**
   * Verificar dependencias del agente
   */
  protected async checkDependencies(): Promise<void> {
    if (this.dependencies.length === 0) return;

    this.logger.debug(`Verificando dependencias: ${this.dependencies.join(', ')}`);
    
    // Aquí se implementaría la verificación real de dependencias
    // Por ahora es una simulación
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Actualizar métricas de éxito
   */
  protected updateSuccessMetrics(executionTime: number): void {
    this.metrics.successfulExecutions++;
    this.metrics.lastExecutionTime = executionTime;
    
    // Calcular tiempo promedio
    const totalTime = this.metrics.averageExecutionTime * (this.metrics.successfulExecutions - 1) + executionTime;
    this.metrics.averageExecutionTime = totalTime / this.metrics.successfulExecutions;
    
    this.health.successRate = (this.metrics.successfulExecutions / this.metrics.totalExecutions) * 100;
  }

  /**
   * Actualizar métricas de error
   */
  protected updateErrorMetrics(executionTime: number, error: any): void {
    this.metrics.failedExecutions++;
    this.metrics.lastExecutionTime = executionTime;
    this.health.errorCount++;
    
    this.health.successRate = (this.metrics.successfulExecutions / this.metrics.totalExecutions) * 100;
  }

  /**
   * Intentar recuperación del agente
   */
  protected async attemptRecovery(): Promise<void> {
    this.status = 'recovering';
    this.logger.warn(`Intentando recuperación del agente ${this.name}`);
    
    this.emitEvent('recovery_attempted', { retryCount: this.metrics.failedExecutions });
    
    // Simular tiempo de recuperación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.status = 'idle';
    this.logger.info(`Recuperación completada para agente ${this.name}`);
  }

  /**
   * Actualizar estado de salud del agente
   */
  protected updateHealth(): void {
    this.health.lastCheck = new Date().toISOString();
    this.health.uptime = Date.now() - this.startTime;
    this.health.isHealthy = this.health.successRate > 80 && this.health.errorCount < 5;
    
    // Simular métricas de recursos
    this.metrics.memoryUsage = Math.random() * 100;
    this.metrics.cpuUsage = Math.random() * 100;
  }

  /**
   * Emitir evento con logging
   */
  protected emitEvent(type: EventType, data: any): void {
    const event: AgentEvent = {
      id: `${this.id}-${Date.now()}`,
      agentId: this.id,
      type,
      timestamp: new Date().toISOString(),
      data,
      severity: type.includes('error') || type.includes('failed') ? 'error' : 'info'
    };

    this.emit(type, event);
    this.logger.debug(`Evento emitido: ${type}`, data);
  }

  /**
   * Configurar manejadores de eventos
   */
  private setupEventHandlers(): void {
    this.on('task_started', (event: AgentEvent) => {
      this.logger.info(`Tarea iniciada: ${event.type}`);
    });

    this.on('task_completed', (event: AgentEvent) => {
      this.logger.info(`Tarea completada: ${event.type}`);
    });

    this.on('task_failed', (event: AgentEvent) => {
      this.logger.error(`Tarea falló: ${event.type}`, event.data);
    });

    this.on('recovery_attempted', (event: AgentEvent) => {
      this.logger.warn(`Recuperación intentada: ${event.type}`);
    });
  }

  /**
   * Obtener estado completo del agente
   */
  getState(): AgentBase {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      priority: this.priority,
      capabilities: this.capabilities,
      dependencies: this.dependencies,
      health: this.health,
      metrics: this.metrics,
      config: this.config
    };
  }

  /**
   * Pausar el agente
   */
  pause(): void {
    if (this.status === 'running') {
      this.status = 'paused';
      this.logger.info(`Agente ${this.name} pausado`);
    }
  }

  /**
   * Reanudar el agente
   */
  resume(): void {
    if (this.status === 'paused') {
      this.status = 'idle';
      this.logger.info(`Agente ${this.name} reanudado`);
    }
  }

  /**
   * Detener el agente
   */
  stop(): void {
    this.isRunning = false;
    this.status = 'idle';
    this.logger.info(`Agente ${this.name} detenido`);
  }

  /**
   * Reiniciar el agente
   */
  async restart(): Promise<void> {
    this.logger.info(`Reiniciando agente ${this.name}`);
    this.stop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.status = 'idle';
    this.logger.info(`Agente ${this.name} reiniciado`);
  }
}
