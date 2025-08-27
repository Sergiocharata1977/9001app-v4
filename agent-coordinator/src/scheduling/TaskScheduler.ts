import { EventEmitter } from 'events';
import { TaskDefinition, TaskExecution } from '../types/agent.types';
import { Logger } from '../utils/Logger';

interface ScheduledTask {
  id: string;
  taskDefinition: TaskDefinition;
  scheduledTime: Date;
  priority: number;
  retries: number;
  maxRetries: number;
}

interface TaskQueue {
  high: ScheduledTask[];
  normal: ScheduledTask[];
  low: ScheduledTask[];
}

export class TaskScheduler extends EventEmitter {
  private taskQueue: TaskQueue = {
    high: [],
    normal: [],
    low: []
  };
  
  private scheduledTasks: Map<string, ScheduledTask> = new Map();
  private runningTasks: Map<string, TaskExecution> = new Map();
  private completedTasks: Map<string, TaskExecution> = new Map();
  
  private logger: Logger;
  private isRunning: boolean = false;
  private maxConcurrentTasks: number;
  private processingInterval: NodeJS.Timeout | null = null;
  private intervalMs: number = 1000; // 1 segundo

  constructor(maxConcurrentTasks: number = 10) {
    super();
    this.maxConcurrentTasks = maxConcurrentTasks;
    this.logger = new Logger('TaskScheduler');
  }

  /**
   * Programar una tarea para ejecución
   */
  scheduleTask(taskDefinition: TaskDefinition, delayMs: number = 0): string {
    const scheduledTime = new Date(Date.now() + delayMs);
    const priority = this.getPriorityValue(taskDefinition.priority);
    
    const scheduledTask: ScheduledTask = {
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskDefinition,
      scheduledTime,
      priority,
      retries: 0,
      maxRetries: taskDefinition.priority === 'critical' ? 5 : 3
    };

    this.scheduledTasks.set(scheduledTask.id, scheduledTask);
    this.addToQueue(scheduledTask);
    
    this.logger.info(`Tarea programada: ${taskDefinition.name}`, {
      taskId: scheduledTask.id,
      scheduledTime: scheduledTime.toISOString(),
      priority: taskDefinition.priority
    });

    this.emit('task_scheduled', scheduledTask);
    return scheduledTask.id;
  }

  /**
   * Programar tarea recurrente
   */
  scheduleRecurringTask(
    taskDefinition: TaskDefinition, 
    intervalMs: number, 
    maxExecutions: number = -1
  ): string {
    const schedulerId = `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let executionCount = 0;

    const scheduleNext = () => {
      if (maxExecutions > 0 && executionCount >= maxExecutions) {
        this.logger.info(`Tarea recurrente completada: ${taskDefinition.name} (${executionCount} ejecuciones)`);
        return;
      }

      this.scheduleTask(taskDefinition);
      executionCount++;

      setTimeout(scheduleNext, intervalMs);
    };

    // Programar primera ejecución
    setTimeout(scheduleNext, intervalMs);
    
    this.logger.info(`Tarea recurrente programada: ${taskDefinition.name}`, {
      schedulerId,
      intervalMs,
      maxExecutions
    });

    return schedulerId;
  }

  /**
   * Cancelar tarea programada
   */
  cancelScheduledTask(taskId: string): boolean {
    const task = this.scheduledTasks.get(taskId);
    if (!task) {
      this.logger.warn(`Tarea programada no encontrada: ${taskId}`);
      return false;
    }

    this.scheduledTasks.delete(taskId);
    this.removeFromQueue(task);
    
    this.logger.info(`Tarea cancelada: ${task.taskDefinition.name}`, { taskId });
    this.emit('task_cancelled', task);
    
    return true;
  }

  /**
   * Obtener próxima tarea para ejecutar
   */
  getNextTask(): ScheduledTask | null {
    // Priorizar tareas de alta prioridad
    if (this.taskQueue.high.length > 0) {
      return this.taskQueue.high.shift()!;
    }
    
    if (this.taskQueue.normal.length > 0) {
      return this.taskQueue.normal.shift()!;
    }
    
    if (this.taskQueue.low.length > 0) {
      return this.taskQueue.low.shift()!;
    }
    
    return null;
  }

  /**
   * Marcar tarea como en ejecución
   */
  markTaskAsRunning(taskId: string, execution: TaskExecution): void {
    this.runningTasks.set(taskId, execution);
    this.logger.debug(`Tarea marcada como en ejecución: ${taskId}`);
  }

  /**
   * Marcar tarea como completada
   */
  markTaskAsCompleted(taskId: string, execution: TaskExecution): void {
    this.runningTasks.delete(taskId);
    this.completedTasks.set(taskId, execution);
    this.scheduledTasks.delete(taskId);
    
    this.logger.info(`Tarea completada: ${execution.taskId}`, {
      taskId,
      duration: execution.duration,
      status: execution.status
    });
    
    this.emit('task_completed', execution);
  }

  /**
   * Marcar tarea como fallida
   */
  markTaskAsFailed(taskId: string, execution: TaskExecution): void {
    this.runningTasks.delete(taskId);
    
    const scheduledTask = this.scheduledTasks.get(taskId);
    if (scheduledTask && scheduledTask.retries < scheduledTask.maxRetries) {
      // Reintentar tarea
      scheduledTask.retries++;
      const retryDelay = this.calculateRetryDelay(scheduledTask.retries);
      
      this.logger.warn(`Reintentando tarea: ${scheduledTask.taskDefinition.name}`, {
        taskId,
        retry: scheduledTask.retries,
        maxRetries: scheduledTask.maxRetries,
        delay: retryDelay
      });
      
      setTimeout(() => {
        this.addToQueue(scheduledTask);
      }, retryDelay);
      
    } else {
      // Tarea falló definitivamente
      this.completedTasks.set(taskId, execution);
      this.scheduledTasks.delete(taskId);
      
      this.logger.error(`Tarea falló definitivamente: ${execution.taskId}`, {
        taskId,
        error: execution.error,
        retries: scheduledTask?.retries || 0
      });
      
      this.emit('task_failed', execution);
    }
  }

  /**
   * Obtener estadísticas del scheduler
   */
  getSchedulerStats(): {
    scheduledTasks: number;
    runningTasks: number;
    completedTasks: number;
    queueSizes: { high: number; normal: number; low: number };
    totalTasks: number;
  } {
    return {
      scheduledTasks: this.scheduledTasks.size,
      runningTasks: this.runningTasks.size,
      completedTasks: this.completedTasks.size,
      queueSizes: {
        high: this.taskQueue.high.length,
        normal: this.taskQueue.normal.length,
        low: this.taskQueue.low.length
      },
      totalTasks: this.scheduledTasks.size + this.runningTasks.size + this.completedTasks.size
    };
  }

  /**
   * Obtener tareas programadas
   */
  getScheduledTasks(): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values());
  }

  /**
   * Obtener tareas en ejecución
   */
  getRunningTasks(): TaskExecution[] {
    return Array.from(this.runningTasks.values());
  }

  /**
   * Obtener tareas completadas
   */
  getCompletedTasks(): TaskExecution[] {
    return Array.from(this.completedTasks.values());
  }

  /**
   * Limpiar tareas completadas antiguas
   */
  cleanupOldCompletedTasks(maxAge: number = 24 * 60 * 60 * 1000): void { // 24 horas por defecto
    const cutoffTime = Date.now() - maxAge;
    let removedCount = 0;

    for (const [taskId, execution] of this.completedTasks.entries()) {
      const completionTime = new Date(execution.endTime || execution.startTime).getTime();
      if (completionTime < cutoffTime) {
        this.completedTasks.delete(taskId);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logger.info(`Limpiadas ${removedCount} tareas completadas antiguas`);
    }
  }

  /**
   * Agregar tarea a la cola correspondiente
   */
  private addToQueue(task: ScheduledTask): void {
    if (task.priority >= 3) {
      this.taskQueue.high.push(task);
    } else if (task.priority >= 2) {
      this.taskQueue.normal.push(task);
    } else {
      this.taskQueue.low.push(task);
    }
  }

  /**
   * Remover tarea de la cola
   */
  private removeFromQueue(task: ScheduledTask): void {
    this.taskQueue.high = this.taskQueue.high.filter(t => t.id !== task.id);
    this.taskQueue.normal = this.taskQueue.normal.filter(t => t.id !== task.id);
    this.taskQueue.low = this.taskQueue.low.filter(t => t.id !== task.id);
  }

  /**
   * Obtener valor numérico de prioridad
   */
  private getPriorityValue(priority: string): number {
    const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorities[priority as keyof typeof priorities] || 2;
  }

  /**
   * Calcular delay para reintento
   */
  private calculateRetryDelay(retryCount: number): number {
    // Estrategia de backoff exponencial
    return Math.min(1000 * Math.pow(2, retryCount - 1), 30000); // Máximo 30 segundos
  }

  /**
   * Procesar cola de tareas
   */
  private processQueue(): void {
    if (this.runningTasks.size >= this.maxConcurrentTasks) {
      return; // No hay capacidad para más tareas
    }

    const now = new Date();
    const readyTasks: ScheduledTask[] = [];

    // Obtener tareas listas para ejecutar
    for (const queue of Object.values(this.taskQueue)) {
      for (let i = 0; i < queue.length; i++) {
        const task = queue[i];
        if (task.scheduledTime <= now) {
          readyTasks.push(task);
          queue.splice(i, 1);
          i--;
        }
      }
    }

    // Ordenar por prioridad y tiempo de programación
    readyTasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Mayor prioridad primero
      }
      return a.scheduledTime.getTime() - b.scheduledTime.getTime(); // Más antiguo primero
    });

    // Ejecutar tareas hasta alcanzar el límite
    for (const task of readyTasks) {
      if (this.runningTasks.size >= this.maxConcurrentTasks) {
        // Volver a agregar a la cola si no hay capacidad
        this.addToQueue(task);
        break;
      }

      this.logger.info(`Ejecutando tarea programada: ${task.taskDefinition.name}`, {
        taskId: task.id,
        priority: task.taskDefinition.priority
      });

      this.emit('task_ready', task);
    }
  }

  /**
   * Iniciar el scheduler
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('TaskScheduler ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    this.logger.info('Iniciando TaskScheduler');
    
    // Configurar procesamiento periódico
    this.processingInterval = setInterval(() => {
      if (this.isRunning) {
        this.processQueue();
      }
    }, this.intervalMs);
    
    this.logger.info('TaskScheduler iniciado exitosamente');
  }

  /**
   * Detener el scheduler
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('TaskScheduler no está ejecutándose');
      return;
    }

    this.isRunning = false;
    this.logger.info('Deteniendo TaskScheduler');
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    this.logger.info('TaskScheduler detenido');
  }

  /**
   * Obtener estado del scheduler
   */
  getStatus(): {
    isRunning: boolean;
    maxConcurrentTasks: number;
    currentRunningTasks: number;
    scheduledTasks: number;
    completedTasks: number;
  } {
    return {
      isRunning: this.isRunning,
      maxConcurrentTasks: this.maxConcurrentTasks,
      currentRunningTasks: this.runningTasks.size,
      scheduledTasks: this.scheduledTasks.size,
      completedTasks: this.completedTasks.size
    };
  }
}
