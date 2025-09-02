#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { ApiAgent } from './agents/ApiAgent';
import { MongoDBAgent } from './agents/MongoDBAgent';
import { SecurityAgent } from './agents/SecurityAgent';
import { StructureAgent } from './agents/StructureAgent';
import { TypeScriptAgent } from './agents/TypeScriptAgent';
import { WebAgent } from './agents/WebAgent';
import { AgentCoordinator } from './core/AgentCoordinator';
import { Logger } from './utils/Logger';

const program = new Command();
const logger = new Logger('Main');

class MainCoordinator {
  public coordinator: AgentCoordinator;
  public agents: Map<string, any> = new Map();

  constructor() {
    this.coordinator = new AgentCoordinator();
    this.initializeAgents();
  }

  /**
   * Inicializar todos los agentes
   */
  private initializeAgents(): void {
    // Crear agentes
    const securityAgent = new SecurityAgent();
    const structureAgent = new StructureAgent();
    const typescriptAgent = new TypeScriptAgent();
    const apiAgent = new ApiAgent();
    const mongodbAgent = new MongoDBAgent();
    const webAgent = new WebAgent();

    // Registrar agentes en el coordinador
    this.coordinator.registerAgent(securityAgent, 'local');
    this.coordinator.registerAgent(structureAgent, 'local');
    this.coordinator.registerAgent(typescriptAgent, 'local');
    this.coordinator.registerAgent(apiAgent, 'local');
    this.coordinator.registerAgent(mongodbAgent, 'local');
    this.coordinator.registerAgent(webAgent, 'local');

    // Almacenar referencias
    this.agents.set('security', securityAgent);
    this.agents.set('structure', structureAgent);
    this.agents.set('typescript', typescriptAgent);
    this.agents.set('api', apiAgent);
    this.agents.set('mongodb', mongodbAgent);
    this.agents.set('web', webAgent);

    logger.info('Agentes inicializados y registrados');
  }

  /**
   * Ejecutar migración completa para 9001app-v2
   */
  async executeFullMigration(): Promise<void> {
    console.log(chalk.blue.bold('🚀 MIGRACIÓN COMPLETA 9001app-v2 - MONGODB'));
    console.log(chalk.gray('═══════════════════════════════════════════════════\n'));
    
    const startTime = Date.now();
    
    try {
      // Iniciar coordinador
      await this.coordinator.start();
      
      // 1. Seguridad (crítico)
      console.log(chalk.yellow('🔒 Ejecutando Agente Seguridad...'));
      await this.agents.get('security').run();
      console.log(chalk.green('✅ Seguridad completada\n'));
      
      // 2. Estructura (crítico)
      console.log(chalk.yellow('🏗️ Ejecutando Agente Estructura...'));
      await this.agents.get('structure').run();
      console.log(chalk.green('✅ Estructura completada\n'));
      
      // 3. MongoDB (nuevo - crítico para 9001app-v2)
      console.log(chalk.yellow('🍃 Ejecutando Agente MongoDB...'));
      await this.agents.get('mongodb').run();
      console.log(chalk.green('✅ MongoDB completado\n'));
      
      // 4. TypeScript (paralelo)
      console.log(chalk.yellow('📝 Ejecutando Agentes TypeScript en paralelo...'));
      await Promise.all([
        this.agents.get('typescript').migrateCRM(),
        this.agents.get('typescript').migrateRRHH(),
        this.agents.get('typescript').migrateProcesos()
      ]);
      console.log(chalk.green('✅ TypeScript completado\n'));
      
      // 5. API
      console.log(chalk.yellow('🔌 Ejecutando Agente API...'));
      await this.agents.get('api').run();
      console.log(chalk.green('✅ API completada\n'));
      
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      
      console.log(chalk.blue.bold('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE'));
      console.log(chalk.gray(`⏱️ Tiempo total: ${duration} segundos`));
      console.log(chalk.cyan('📊 MongoDB configurado y listo para 9001app-v2'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error en la migración:'), error);
      process.exit(1);
    } finally {
      await this.coordinator.stop();
    }
  }

  /**
   * Ejecutar solo migración de MongoDB
   */
  async executeMongoDBMigration(): Promise<void> {
    console.log(chalk.blue.bold('🍃 MIGRACIÓN MONGODB - 9001app-v2'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    try {
      await this.coordinator.start();
      await this.agents.get('mongodb').run();
      console.log(chalk.green('✅ Migración MongoDB completada'));
    } catch (error) {
      console.error(chalk.red('❌ Error en migración MongoDB:'), error);
      throw error;
    } finally {
      await this.coordinator.stop();
    }
  }

  /**
   * Ejecutar solo migración TypeScript
   */
  async executeTypeScriptMigration(): Promise<void> {
    console.log(chalk.blue.bold('📝 MIGRACIÓN TYPESCRIPT - 9001app-v2'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    try {
      await this.coordinator.start();
      await Promise.all([
        this.agents.get('typescript').migrateCRM(),
        this.agents.get('typescript').migrateRRHH(),
        this.agents.get('typescript').migrateProcesos()
      ]);
      console.log(chalk.green('✅ Migración TypeScript completada'));
    } catch (error) {
      console.error(chalk.red('❌ Error en migración TypeScript:'), error);
      throw error;
    } finally {
      await this.coordinator.stop();
    }
  }

  /**
   * Mostrar estado del sistema
   */
  async showSystemStatus(): Promise<void> {
    console.log(chalk.blue.bold('📊 ESTADO DEL SISTEMA DE AGENTES'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    try {
      await this.coordinator.start();
      
      const metrics = this.coordinator.getSystemMetrics();
      const agents = this.coordinator.getAgentsStatus();
      const nodes = this.coordinator.getNodesStatus();
      
      console.log(chalk.cyan('📈 MÉTRICAS DEL SISTEMA:'));
      console.log(chalk.gray(`  • Agentes totales: ${metrics.totalAgents}`));
      console.log(chalk.gray(`  • Agentes activos: ${metrics.activeAgents}`));
      console.log(chalk.gray(`  • Agentes fallidos: ${metrics.failedAgents}`));
      console.log(chalk.gray(`  • Tareas totales: ${metrics.totalTasks}`));
      console.log(chalk.gray(`  • Tareas completadas: ${metrics.completedTasks}`));
      console.log(chalk.gray(`  • Salud del sistema: ${metrics.systemHealth.toFixed(1)}%`));
      console.log('');
      
      console.log(chalk.cyan('🤖 ESTADO DE AGENTES:'));
      for (const agent of agents) {
        const statusColor = agent.status === 'completed' ? 'green' : 
                           agent.status === 'running' ? 'yellow' : 
                           agent.status === 'failed' ? 'red' : 'gray';
        console.log(chalk[statusColor](`  • ${agent.name}: ${agent.status}`));
      }
      console.log('');
      
      console.log(chalk.cyan('🖥️ NODOS:'));
      for (const node of nodes) {
        console.log(chalk.gray(`  • ${node.name}: ${node.status} (${node.load.toFixed(1)}% carga)`));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Error obteniendo estado:'), error);
    } finally {
      await this.coordinator.stop();
    }
  }

  /**
   * Iniciar interfaz web
   */
  async startWebInterface(): Promise<void> {
    console.log(chalk.blue.bold('🌐 INICIANDO INTERFAZ WEB DEL COORDINADOR'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    try {
      await this.coordinator.start();
      this.agents.get('web').start();
      
      console.log(chalk.green('✅ Interfaz web iniciada'));
      console.log(chalk.cyan('📊 Dashboard: http://localhost:8000'));
      console.log(chalk.cyan('🔌 API: http://localhost:8000/api/status'));
      console.log(chalk.yellow('\n💡 Presiona Ctrl+C para detener\n'));
      
      // Mantener el proceso activo
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n🛑 Deteniendo sistema...'));
        await this.coordinator.stop();
        process.exit(0);
      });
      
    } catch (error) {
      console.error(chalk.red('❌ Error iniciando interfaz web:'), error);
      process.exit(1);
    }
  }
}

// Configurar comandos CLI
program
  .name('agent-coordinator')
  .description('Coordinador de agentes para migración 9001app-v2 a MongoDB')
  .version('2.0.0');

program
  .command('full-migration')
  .description('Ejecutar migración completa (Seguridad + Estructura + MongoDB + TypeScript + API)')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.executeFullMigration();
  });

program
  .command('mongodb')
  .description('Ejecutar solo migración de MongoDB')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.executeMongoDBMigration();
  });

program
  .command('typescript')
  .description('Ejecutar solo migración de TypeScript')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.executeTypeScriptMigration();
  });

program
  .command('security')
  .description('Ejecutar solo agente de seguridad')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.coordinator.start();
    await mainCoordinator.agents.get('security').run();
    await mainCoordinator.coordinator.stop();
  });

program
  .command('structure')
  .description('Ejecutar solo agente de estructura')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.coordinator.start();
    await mainCoordinator.agents.get('structure').run();
    await mainCoordinator.coordinator.stop();
  });

program
  .command('api')
  .description('Ejecutar solo agente API')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.coordinator.start();
    await mainCoordinator.agents.get('api').run();
    await mainCoordinator.coordinator.stop();
  });

program
  .command('web')
  .description('Iniciar interfaz web del coordinador')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.startWebInterface();
  });

program
  .command('status')
  .description('Mostrar estado del sistema de agentes')
  .action(async () => {
    const mainCoordinator = new MainCoordinator();
    await mainCoordinator.showSystemStatus();
  });

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Ejecutar CLI
program.parse();
