import { EventEmitter } from 'events';
import { WorkflowDefinition, TaskDefinition, TaskExecution } from '../types/agent.types';
import { Logger } from '../utils/Logger';

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  results: Map<string, any>;
  errors: Map<string, string>;
  taskExecutions: Map<string, TaskExecution>;
}

interface WorkflowStep {
  taskId: string;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  execution?: TaskExecution;
}

export class WorkflowEngine extends EventEmitter {
  private workflowExecutions: Map<string, WorkflowExecution> = new Map();
  private logger: Logger;
  private isRunning: boolean = false;
  private coordinator: any; // Referencia al coordinador de agentes

  constructor() {
    super();
    this.logger = new Logger('WorkflowEngine');
  }

  /**
   * Ejecutar un workflow completo
   */
  async executeWorkflow(
    workflow: WorkflowDefinition, 
    coordinator: any, 
    params?: any
  ): Promise<WorkflowExecution> {
    this.coordinator = coordinator;
    
    const execution: WorkflowExecution = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId: workflow.id,
      status: 'running',
      startTime: new Date().toISOString(),
      currentStep: 0,
      totalSteps: workflow.tasks.length,
      progress: 0,
      results: new Map(),
      errors: new Map(),
      taskExecutions: new Map()
    };

    this.workflowExecutions.set(execution.id, execution);
    
    this.logger.info(`Iniciando workflow: ${workflow.name}`, {
      workflowId: workflow.id,
      executionId: execution.id,
      totalTasks: workflow.tasks.length
    });

    this.emit('workflow_started', { execution, workflow });

    try {
      // Construir grafo de dependencias
      const taskGraph = this.buildTaskGraph(workflow);
      
      // Ejecutar workflow
      await this.executeWorkflowSteps(execution, workflow, taskGraph, params);
      
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
      execution.progress = 100;
      
      this.logger.info(`Workflow completado: ${workflow.name}`, {
        executionId: execution.id,
        duration: Date.now() - new Date(execution.startTime).getTime()
      });
      
      this.emit('workflow_completed', { execution, workflow });
      
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      
      this.logger.error(`Workflow falló: ${workflow.name}`, error);
      this.emit('workflow_failed', { execution, workflow, error });
      
      throw error;
    }

    return execution;
  }

  /**
   * Construir grafo de dependencias de tareas
   */
  private buildTaskGraph(workflow: WorkflowDefinition): Map<string, WorkflowStep> {
    const taskGraph = new Map<string, WorkflowStep>();
    
    // Inicializar todos los pasos
    for (const task of workflow.tasks) {
      taskGraph.set(task.id, {
        taskId: task.id,
        dependencies: workflow.dependencies[task.id] || [],
        status: 'pending'
      });
    }
    
    return taskGraph;
  }

  /**
   * Ejecutar pasos del workflow
   */
  private async executeWorkflowSteps(
    execution: WorkflowExecution,
    workflow: WorkflowDefinition,
    taskGraph: Map<string, WorkflowStep>,
    params?: any
  ): Promise<void> {
    const completedTasks = new Set<string>();
    const runningTasks = new Set<string>();
    
    while (completedTasks.size < workflow.tasks.length) {
      // Encontrar tareas listas para ejecutar
      const readyTasks = this.findReadyTasks(taskGraph, completedTasks, runningTasks);
      
      if (readyTasks.length === 0 && runningTasks.size === 0) {
        // Ciclo detectado o tareas bloqueadas
        const blockedTasks = Array.from(taskGraph.values())
          .filter(step => step.status === 'pending' && !completedTasks.has(step.taskId));
        
        if (blockedTasks.length > 0) {
          throw new Error(`Workflow bloqueado: tareas sin dependencias resueltas: ${blockedTasks.map(t => t.taskId).join(', ')}`);
        }
        break;
      }
      
      // Ejecutar tareas listas
      const executionPromises = readyTasks.map(async (taskId) => {
        const task = workflow.tasks.find(t => t.id === taskId)!;
        const step = taskGraph.get(taskId)!;
        
        step.status = 'running';
        runningTasks.add(taskId);
        
        this.logger.info(`Ejecutando tarea del workflow: ${task.name}`, {
          workflowId: workflow.id,
          taskId,
          executionId: execution.id
        });
        
        try {
          // Ejecutar tarea a través del coordinador
          const taskExecution = await this.coordinator.executeTask(task);
          
          step.status = 'completed';
          step.execution = taskExecution;
          execution.taskExecutions.set(taskId, taskExecution);
          execution.results.set(taskId, taskExecution.result);
          
          completedTasks.add(taskId);
          runningTasks.delete(taskId);
          
          // Actualizar progreso
          execution.currentStep = completedTasks.size;
          execution.progress = (completedTasks.size / workflow.tasks.length) * 100;
          
          this.logger.info(`Tarea del workflow completada: ${task.name}`, {
            taskId,
            executionId: execution.id,
            progress: execution.progress.toFixed(1) + '%'
          });
          
          this.emit('workflow_task_completed', { execution, task, taskExecution });
          
        } catch (error) {
          step.status = 'failed';
          step.execution = {
            id: `failed-${taskId}`,
            taskId,
            agentId: '',
            status: 'failed',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Error desconocido',
            retries: 0,
            progress: 0
          };
          
          execution.errors.set(taskId, error instanceof Error ? error.message : 'Error desconocido');
          runningTasks.delete(taskId);
          
          this.logger.error(`Tarea del workflow falló: ${task.name}`, error);
          this.emit('workflow_task_failed', { execution, task, error });
          
          // Verificar política de reintentos
          if (workflow.retryPolicy.maxRetries > 0) {
            const retryCount = step.execution.retries || 0;
            if (retryCount < workflow.retryPolicy.maxRetries) {
              step.execution.retries = retryCount + 1;
              step.status = 'pending';
              
              const retryDelay = this.calculateRetryDelay(workflow.retryPolicy, retryCount + 1);
              this.logger.info(`Reintentando tarea del workflow: ${task.name} en ${retryDelay}ms`, {
                taskId,
                retry: retryCount + 1,
                maxRetries: workflow.retryPolicy.maxRetries
              });
              
              setTimeout(() => {
                step.status = 'pending';
                runningTasks.delete(taskId);
              }, retryDelay);
              
              continue;
            }
          }
          
          // Si no se puede reintentar, marcar como fallida definitivamente
          completedTasks.add(taskId);
          execution.currentStep = completedTasks.size;
          execution.progress = (completedTasks.size / workflow.tasks.length) * 100;
        }
      });
      
      // Esperar a que se completen las tareas actuales
      await Promise.all(executionPromises);
      
      // Pequeña pausa para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Encontrar tareas listas para ejecutar
   */
  private findReadyTasks(
    taskGraph: Map<string, WorkflowStep>,
    completedTasks: Set<string>,
    runningTasks: Set<string>
  ): string[] {
    const readyTasks: string[] = [];
    
    for (const [taskId, step] of taskGraph.entries()) {
      if (step.status === 'pending' && 
          !completedTasks.has(taskId) && 
          !runningTasks.has(taskId)) {
        
        // Verificar que todas las dependencias estén completadas
        const dependenciesMet = step.dependencies.every(depId => 
          completedTasks.has(depId)
        );
        
        if (dependenciesMet) {
          readyTasks.push(taskId);
        }
      }
    }
    
    return readyTasks;
  }

  /**
   * Calcular delay para reintento
   */
  private calculateRetryDelay(retryPolicy: any, retryCount: number): number {
    switch (retryPolicy.backoffStrategy) {
      case 'exponential':
        return Math.min(
          retryPolicy.backoffDelay * Math.pow(2, retryCount - 1),
          30000 // Máximo 30 segundos
        );
      case 'linear':
        return Math.min(
          retryPolicy.backoffDelay * retryCount,
          30000
        );
      case 'fixed':
      default:
        return retryPolicy.backoffDelay;
    }
  }

  /**
   * Cancelar workflow en ejecución
   */
  cancelWorkflow(executionId: string): boolean {
    const execution = this.workflowExecutions.get(executionId);
    if (!execution || execution.status !== 'running') {
      this.logger.warn(`Workflow no encontrado o no está ejecutándose: ${executionId}`);
      return false;
    }
    
    execution.status = 'cancelled';
    execution.endTime = new Date().toISOString();
    
    this.logger.info(`Workflow cancelado: ${executionId}`);
    this.emit('workflow_cancelled', { execution });
    
    return true;
  }

  /**
   * Obtener ejecución de workflow
   */
  getWorkflowExecution(executionId: string): WorkflowExecution | undefined {
    return this.workflowExecutions.get(executionId);
  }

  /**
   * Obtener todas las ejecuciones de workflows
   */
  getAllWorkflowExecutions(): WorkflowExecution[] {
    return Array.from(this.workflowExecutions.values());
  }

  /**
   * Obtener ejecuciones por estado
   */
  getWorkflowExecutionsByStatus(status: WorkflowExecution['status']): WorkflowExecution[] {
    return Array.from(this.workflowExecutions.values())
      .filter(execution => execution.status === status);
  }

  /**
   * Obtener estadísticas de workflows
   */
  getWorkflowStats(): {
    totalExecutions: number;
    runningExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
    cancelledExecutions: number;
    averageExecutionTime: number;
  } {
    const executions = Array.from(this.workflowExecutions.values());
    const totalExecutions = executions.length;
    const runningExecutions = executions.filter(e => e.status === 'running').length;
    const completedExecutions = executions.filter(e => e.status === 'completed').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;
    const cancelledExecutions = executions.filter(e => e.status === 'cancelled').length;
    
    const completedWithTime = executions.filter(e => 
      e.status === 'completed' && e.startTime && e.endTime
    );
    
    const averageExecutionTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, e) => {
          const duration = new Date(e.endTime!).getTime() - new Date(e.startTime).getTime();
          return sum + duration;
        }, 0) / completedWithTime.length
      : 0;
    
    return {
      totalExecutions,
      runningExecutions,
      completedExecutions,
      failedExecutions,
      cancelledExecutions,
      averageExecutionTime
    };
  }

  /**
   * Limpiar ejecuciones antiguas
   */
  cleanupOldExecutions(maxAge: number = 7 * 24 * 60 * 60 * 1000): void { // 7 días por defecto
    const cutoffTime = Date.now() - maxAge;
    let removedCount = 0;
    
    for (const [executionId, execution] of this.workflowExecutions.entries()) {
      const executionTime = new Date(execution.startTime).getTime();
      if (executionTime < cutoffTime && execution.status !== 'running') {
        this.workflowExecutions.delete(executionId);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      this.logger.info(`Limpiadas ${removedCount} ejecuciones de workflows antiguas`);
    }
  }

  /**
   * Iniciar el motor de workflows
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('WorkflowEngine ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    this.logger.info('Iniciando WorkflowEngine');
    
    // Limpiar ejecuciones antiguas al iniciar
    this.cleanupOldExecutions();
    
    this.logger.info('WorkflowEngine iniciado exitosamente');
  }

  /**
   * Detener el motor de workflows
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('WorkflowEngine no está ejecutándose');
      return;
    }

    this.isRunning = false;
    this.logger.info('Deteniendo WorkflowEngine');
    
    // Cancelar workflows en ejecución
    const runningExecutions = this.getWorkflowExecutionsByStatus('running');
    for (const execution of runningExecutions) {
      this.cancelWorkflow(execution.id);
    }
    
    this.logger.info('WorkflowEngine detenido');
  }

  /**
   * Obtener estado del motor
   */
  getStatus(): {
    isRunning: boolean;
    totalExecutions: number;
    runningExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
  } {
    const stats = this.getWorkflowStats();
    
    return {
      isRunning: this.isRunning,
      totalExecutions: stats.totalExecutions,
      runningExecutions: stats.runningExecutions,
      completedExecutions: stats.completedExecutions,
      failedExecutions: stats.failedExecutions
    };
  }
}
