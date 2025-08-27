import { EventEmitter } from 'events';
import { MessageBus } from '../communication/MessageBus';
import { HealthMonitor } from '../monitoring/HealthMonitor';
import { TaskScheduler } from '../scheduling/TaskScheduler';
import {
    AgentBase,
    AgentEvent,
    AgentMessage,
    CoordinatorNode,
    SystemMetrics,
    TaskDefinition,
    TaskExecution,
    WorkflowDefinition
} from '../types/agent.types';
import { Logger } from '../utils/Logger';
import { WorkflowEngine } from '../workflow/WorkflowEngine';
import { BaseAgent } from './BaseAgent';

export class AgentCoordinator extends EventEmitter {
  private agents: Map<string, BaseAgent> = new Map();
  private nodes: Map<string, CoordinatorNode> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private taskExecutions: Map<string, TaskExecution> = new Map();
  
  private logger: Logger;
  private messageBus: MessageBus;
  private taskScheduler: TaskScheduler;
  private healthMonitor: HealthMonitor;
  private workflowEngine: WorkflowEngine;
  
  private isRunning: boolean = false;
  private maxConcurrentTasks: number = 10;
  private activeTasks: number = 0;

  constructor() {
    super();
    
    this.logger = new Logger('AgentCoordinator');
    this.messageBus = new MessageBus();
    this.taskScheduler = new TaskScheduler(this.maxConcurrentTasks);
    this.healthMonitor = new HealthMonitor();
    this.workflowEngine = new WorkflowEngine();
    
    this.setupEventHandlers();
    this.setupMessageHandlers();
  }

  /**
   * Registrar un agente en el coordinador
   */
  registerAgent(agent: BaseAgent, nodeId: string = 'local'): void {
    if (this.agents.has(agent.id)) {
      this.logger.warn(`Agente ${agent.id} ya está registrado`);
      return;
    }

    this.agents.set(agent.id, agent);
    
    // Agregar a nodo
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        id: nodeId,
        name: nodeId === 'local' ? 'Nodo Local' : `Nodo ${nodeId}`,
        agents: [],
        status: 'active',
        load: 0,
        capacity: 100,
        location: nodeId === 'local' ? 'local' : 'remote'
      });
    }
    
    const node = this.nodes.get(nodeId)!;
    node.agents.push(agent.getState());
    
    this.logger.info(`Agente ${agent.name} registrado en nodo ${nodeId}`);
    this.emit('agent_registered', { agent: agent.getState(), nodeId });
  }

  /**
   * Desregistrar un agente
   */
  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      this.logger.warn(`Agente ${agentId} no encontrado`);
      return;
    }

    this.agents.delete(agentId);
    
    // Remover de nodos
    for (const node of this.nodes.values()) {
      node.agents = node.agents.filter(a => a.id !== agentId);
    }
    
    this.logger.info(`Agente ${agent.name} desregistrado`);
    this.emit('agent_unregistered', { agentId, agentName: agent.name });
  }

  /**
   * Ejecutar una tarea específica
   */
  async executeTask(taskDefinition: TaskDefinition): Promise<TaskExecution> {
    const execution: TaskExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: taskDefinition.id,
      agentId: '',
      status: 'pending',
      startTime: new Date().toISOString(),
      retries: 0,
      progress: 0
    };

    this.taskExecutions.set(execution.id, execution);
    
    try {
      // Buscar agente disponible
      const agent = await this.findAvailableAgent(taskDefinition);
      if (!agent) {
        throw new Error(`No hay agentes disponibles para la tarea ${taskDefinition.name}`);
      }

      execution.agentId = agent.id;
      execution.status = 'running';
      
      this.activeTasks++;
      this.logger.info(`Ejecutando tarea ${taskDefinition.name} con agente ${agent.name}`);
      
      // Ejecutar tarea
      const result = await agent.run(taskDefinition.config);
      
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
      execution.duration = Date.now() - new Date(execution.startTime).getTime();
      execution.result = result;
      execution.progress = 100;
      
      this.logger.info(`Tarea ${taskDefinition.name} completada exitosamente`);
      this.emit('task_completed', { execution, result });
      
      return execution;
      
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      execution.duration = Date.now() - new Date(execution.startTime).getTime();
      execution.error = error instanceof Error ? error.message : 'Error desconocido';
      
      this.logger.error(`Tarea ${taskDefinition.name} falló`, error);
      this.emit('task_failed', { execution, error });
      
      // Reintentar si es posible
      if (execution.retries < taskDefinition.priority === 'critical' ? 5 : 3) {
        await this.retryTask(execution, taskDefinition);
      }
      
      throw error;
      
    } finally {
      this.activeTasks--;
      this.updateNodeLoads();
    }
  }

  /**
   * Ejecutar un workflow completo
   */
  async executeWorkflow(workflowId: string, params?: any): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} no encontrado`);
    }

    this.logger.info(`Iniciando workflow ${workflow.name}`);
    
    try {
      await this.workflowEngine.execute(workflow, this, params);
      this.logger.info(`Workflow ${workflow.name} completado exitosamente`);
    } catch (error) {
      this.logger.error(`Workflow ${workflow.name} falló`, error);
      throw error;
    }
  }

  /**
   * Buscar agente disponible para una tarea
   */
  private async findAvailableAgent(taskDefinition: TaskDefinition): Promise<BaseAgent | null> {
    const availableAgents = Array.from(this.agents.values()).filter(agent => {
      // Verificar que el agente esté disponible
      if (agent.status !== 'idle') return false;
      
      // Verificar que tenga las capacidades requeridas
      const hasCapabilities = taskDefinition.requiredCapabilities.every(cap => 
        agent.capabilities.includes(cap)
      );
      if (!hasCapabilities) return false;
      
      // Verificar que esté saludable
      if (!agent.health.isHealthy) return false;
      
      return true;
    });

    if (availableAgents.length === 0) return null;

    // Ordenar por prioridad y carga
    availableAgents.sort((a, b) => {
      const priorityA = this.getAgentPriority(a);
      const priorityB = this.getAgentPriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return a.metrics.memoryUsage - b.metrics.memoryUsage;
    });

    return availableAgents[0];
  }

  /**
   * Obtener prioridad numérica del agente
   */
  private getAgentPriority(agent: BaseAgent): number {
    const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorities[agent.priority as keyof typeof priorities] || 2;
  }

  /**
   * Reintentar tarea fallida
   */
  private async retryTask(execution: TaskExecution, taskDefinition: TaskDefinition): Promise<void> {
    execution.retries++;
    execution.status = 'pending';
    execution.startTime = new Date().toISOString();
    execution.progress = 0;
    
    this.logger.info(`Reintentando tarea ${taskDefinition.name} (intento ${execution.retries})`);
    
    // Esperar antes de reintentar
    await new Promise(resolve => setTimeout(resolve, 1000 * execution.retries));
    
    // Re-ejecutar
    await this.executeTask(taskDefinition);
  }

  /**
   * Actualizar cargas de nodos
   */
  private updateNodeLoads(): void {
    for (const node of this.nodes.values()) {
      const activeAgents = node.agents.filter(a => a.status === 'running').length;
      node.load = (activeAgents / node.agents.length) * 100;
      
      if (node.load > 80) {
        node.status = 'overloaded';
      } else if (node.load > 0) {
        node.status = 'active';
      } else {
        node.status = 'inactive';
      }
    }
  }

  /**
   * Obtener métricas del sistema
   */
  getSystemMetrics(): SystemMetrics {
    const agents = Array.from(this.agents.values());
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'running').length;
    const failedAgents = agents.filter(a => a.status === 'failed').length;
    
    const executions = Array.from(this.taskExecutions.values());
    const totalTasks = executions.length;
    const completedTasks = executions.filter(e => e.status === 'completed').length;
    const failedTasks = executions.filter(e => e.status === 'failed').length;
    
    const avgResponseTime = executions.length > 0 
      ? executions.reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length
      : 0;
    
    const systemHealth = this.healthMonitor.getSystemHealth();
    const resourceUtilization = this.healthMonitor.getResourceUtilization();
    
    return {
      totalAgents,
      activeAgents,
      failedAgents,
      totalTasks,
      completedTasks,
      failedTasks,
      averageResponseTime: avgResponseTime,
      systemHealth,
      resourceUtilization
    };
  }

  /**
   * Obtener estado de todos los agentes
   */
  getAgentsStatus(): AgentBase[] {
    return Array.from(this.agents.values()).map(agent => agent.getState());
  }

  /**
   * Obtener estado de todos los nodos
   */
  getNodesStatus(): CoordinatorNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Configurar manejadores de eventos
   */
  private setupEventHandlers(): void {
    // Escuchar eventos de agentes
    for (const agent of this.agents.values()) {
      agent.on('task_started', (event: AgentEvent) => {
        this.emit('agent_task_started', event);
      });
      
      agent.on('task_completed', (event: AgentEvent) => {
        this.emit('agent_task_completed', event);
      });
      
      agent.on('task_failed', (event: AgentEvent) => {
        this.emit('agent_task_failed', event);
      });
    }
  }

  /**
   * Configurar manejadores de mensajes
   */
  private setupMessageHandlers(): void {
    this.messageBus.on('task_assignment', async (message: AgentMessage) => {
      // Procesar asignación de tarea
      this.logger.debug('Procesando asignación de tarea', message);
    });
    
    this.messageBus.on('task_completion', async (message: AgentMessage) => {
      // Procesar completación de tarea
      this.logger.debug('Procesando completación de tarea', message);
    });
    
    this.messageBus.on('health_check', async (message: AgentMessage) => {
      // Procesar verificación de salud
      this.logger.debug('Procesando verificación de salud', message);
    });
  }

  /**
   * Iniciar el coordinador
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Coordinador ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    this.logger.info('Iniciando coordinador de agentes');
    
    // Iniciar componentes
    await this.messageBus.start();
    await this.healthMonitor.start();
    await this.workflowEngine.start();
    
    // Iniciar monitoreo de salud
    this.startHealthMonitoring();
    
    this.logger.info('Coordinador de agentes iniciado exitosamente');
    this.emit('coordinator_started');
  }

  /**
   * Detener el coordinador
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Coordinador no está ejecutándose');
      return;
    }

    this.isRunning = false;
    this.logger.info('Deteniendo coordinador de agentes');
    
    // Detener componentes
    await this.messageBus.stop();
    await this.healthMonitor.stop();
    await this.workflowEngine.stop();
    
    // Detener todos los agentes
    for (const agent of this.agents.values()) {
      agent.stop();
    }
    
    this.logger.info('Coordinador de agentes detenido');
    this.emit('coordinator_stopped');
  }

  /**
   * Iniciar monitoreo de salud
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      if (!this.isRunning) return;
      
      // Verificar salud de agentes
      for (const agent of this.agents.values()) {
        if (!agent.health.isHealthy && agent.config.autoRestart) {
          this.logger.warn(`Reiniciando agente no saludable: ${agent.name}`);
          agent.restart();
        }
      }
      
      // Actualizar métricas
      this.updateNodeLoads();
      
    }, 30000); // Cada 30 segundos
  }

  /**
   * Agregar workflow
   */
  addWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
    this.logger.info(`Workflow ${workflow.name} agregado`);
  }

  /**
   * Remover workflow
   */
  removeWorkflow(workflowId: string): void {
    this.workflows.delete(workflowId);
    this.logger.info(`Workflow ${workflowId} removido`);
  }

  /**
   * Obtener workflows disponibles
   */
  getWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }
}
