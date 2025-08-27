// Tipos base para el sistema de agentes
export interface AgentBase {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  priority: AgentPriority;
  capabilities: string[];
  dependencies: string[];
  health: AgentHealth;
  metrics: AgentMetrics;
  config: AgentConfig;
}

export type AgentType = 
  | 'security'
  | 'structure' 
  | 'typescript'
  | 'api'
  | 'database'
  | 'frontend'
  | 'backend'
  | 'testing'
  | 'deployment'
  | 'monitoring';

export type AgentStatus = 
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'recovering';

export type AgentPriority = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export interface AgentHealth {
  isHealthy: boolean;
  lastCheck: string;
  uptime: number;
  errorCount: number;
  successRate: number;
  responseTime: number;
}

export interface AgentMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface AgentConfig {
  maxRetries: number;
  timeout: number;
  autoRestart: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  notifications: boolean;
}

// Tipos para coordinación
export interface CoordinatorNode {
  id: string;
  name: string;
  agents: AgentBase[];
  status: 'active' | 'inactive' | 'overloaded';
  load: number;
  capacity: number;
  location: 'local' | 'remote';
}

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  agentType: AgentType;
  priority: AgentPriority;
  dependencies: string[];
  estimatedDuration: number;
  requiredCapabilities: string[];
  config: Record<string, any>;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  result?: any;
  error?: string;
  retries: number;
  progress: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  tasks: TaskDefinition[];
  dependencies: Record<string, string[]>;
  parallelExecution: boolean;
  maxConcurrentTasks: number;
  timeout: number;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  backoffDelay: number;
  retryOnErrors: string[];
}

// Tipos para comunicación
export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: MessageType;
  payload: any;
  timestamp: string;
  priority: MessagePriority;
  correlationId?: string;
}

export type MessageType = 
  | 'task_assignment'
  | 'task_completion'
  | 'task_failure'
  | 'health_check'
  | 'status_update'
  | 'resource_request'
  | 'error_notification'
  | 'coordination_signal';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

// Tipos para monitoreo
export interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  failedAgents: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  systemHealth: number;
  resourceUtilization: ResourceUtilization;
}

export interface ResourceUtilization {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

// Tipos para eventos
export interface AgentEvent {
  id: string;
  agentId: string;
  type: EventType;
  timestamp: string;
  data: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export type EventType = 
  | 'agent_started'
  | 'agent_stopped'
  | 'task_started'
  | 'task_completed'
  | 'task_failed'
  | 'health_check'
  | 'resource_low'
  | 'error_occurred'
  | 'recovery_attempted';
