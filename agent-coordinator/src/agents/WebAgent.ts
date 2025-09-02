import { BaseAgent } from '../core/BaseAgent';
import { Logger } from '../utils/Logger';
import express from 'express';
import cors from 'cors';
import type { AgentStatus } from '../types/agent.types';

export class WebAgent extends BaseAgent {
  private app: express.Application;
  private server: any;
  private port: number = 8000;

  constructor() {
    super('WebAgent', 'frontend', 'medium');
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  override async run(): Promise<void> {
    this.logger.info('🌐 Iniciando interfaz web del coordinador...');
    
    try {
      await this.startServer();
      this.logger.info('✅ Interfaz web iniciada exitosamente');
      this.updateStatus('completed');
      
    } catch (error) {
      this.logger.error('❌ Error iniciando interfaz web:', error);
      this.updateStatus('failed');
      throw error;
    }
  }

  start(): void {
    this.run();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  private setupRoutes(): void {
    // Ruta principal
    this.app.get('/', (req, res) => {
      res.json({
        message: '🤖 Agent Coordinator - 9001app-v2',
        version: '2.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
      });
    });

    // API de estado
    this.app.get('/api/status', (req, res) => {
      res.json({
        system: 'Agent Coordinator',
        status: 'active',
        agents: this.getAgentsStatus(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });

    // API de métricas
    this.app.get('/api/metrics', (req, res) => {
      res.json({
        systemMetrics: this.getSystemMetrics(),
        timestamp: new Date().toISOString()
      });
    });
  }

  private async startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, () => {
        this.logger.info(`🚀 Servidor web iniciado en puerto ${this.port}`);
        resolve();
      });

      this.server.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  private getAgentsStatus(): any[] {
    // Simular estado de agentes
    return [
      { name: 'SecurityAgent', status: 'completed', type: 'security' },
      { name: 'StructureAgent', status: 'completed', type: 'structure' },
      { name: 'MongoDBAgent', status: 'running', type: 'database' },
      { name: 'TypeScriptAgent', status: 'idle', type: 'typescript' },
      { name: 'ApiAgent', status: 'idle', type: 'api' },
      { name: 'WebAgent', status: 'running', type: 'frontend' }
    ];
  }

  private getSystemMetrics(): any {
    return {
      totalAgents: 6,
      activeAgents: 2,
      failedAgents: 0,
      totalTasks: 12,
      completedTasks: 8,
      failedTasks: 0,
      averageResponseTime: 150,
      systemHealth: 95.8
    };
  }

  override async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.logger.info('🛑 Servidor web detenido');
    }
  }

  // Implementar métodos abstractos
  async execute(params?: any): Promise<any> {
    return this.run();
  }

  canExecute(task: any): boolean {
    return task.type === 'frontend' || task.type === 'web';
  }

  getInfo(): Record<string, any> {
    return {
      name: this.name,
      type: this.type,
      status: this.status,
      port: this.port,
      capabilities: ['web_interface', 'api_endpoints', 'metrics_dashboard']
    };
  }
}
