#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { ApiAgent } from './agents/api-agent';
import { SecurityAgent } from './agents/security-agent';
import { StructureAgent } from './agents/structure-agent';
import { TypeScriptAgent } from './agents/typescript-agent';
import { WebAgent } from './agents/web-agent';

const program = new Command();

class AgentCoordinator {
  private agents = {
    security: new SecurityAgent(),
    structure: new StructureAgent(),
    typescript: new TypeScriptAgent(),
    api: new ApiAgent()
  };

  async executeFullMigration() {
    console.log(chalk.blue.bold('�� AGENTE COORDINADOR - PROYECTO ISO 9001'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    const startTime = Date.now();
    
    try {
      // 1. Seguridad (crítico)
      console.log(chalk.yellow('🔒 Ejecutando Agente Seguridad...'));
      await this.agents.security.execute();
      console.log(chalk.green('✅ Seguridad completada\n'));
      
      // 2. Estructura (crítico)
      console.log(chalk.yellow('��️ Ejecutando Agente Estructura...'));
      await this.agents.structure.execute();
      console.log(chalk.green('✅ Estructura completada\n'));
      
      // 3. TypeScript (paralelo)
      console.log(chalk.yellow('�� Ejecutando Agentes TypeScript en paralelo...'));
      await Promise.all([
        this.agents.typescript.migrateCRM(),
        this.agents.typescript.migrateRRHH(),
        this.agents.typescript.migrateProcesos()
      ]);
      console.log(chalk.green('✅ TypeScript completado\n'));
      
      // 4. API
      console.log(chalk.yellow('🔌 Ejecutando Agente API...'));
      await this.agents.api.execute();
      console.log(chalk.green('✅ API completada\n'));
      
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      
      console.log(chalk.blue.bold('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE'));
      console.log(chalk.gray(`⏱️ Tiempo total: ${duration} segundos`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error en la migración:'), error);
      process.exit(1);
    }
  }

  async executeSecurity() {
    console.log(chalk.blue.bold('🔒 AGENTE SEGURIDAD'));
    await this.agents.security.execute();
  }

  async executeStructure() {
    console.log(chalk.blue.bold('��️ AGENTE ESTRUCTURA'));
    await this.agents.structure.execute();
  }

  async executeTypeScript() {
    console.log(chalk.blue.bold('📝 AGENTE TYPESCRIPT'));
    await Promise.all([
      this.agents.typescript.migrateCRM(),
      this.agents.typescript.migrateRRHH(),
      this.agents.typescript.migrateProcesos()
    ]);
  }

  async executeApi() {
    console.log(chalk.blue.bold('�� AGENTE API'));
    await this.agents.api.execute();
  }
}

// Configurar comandos
program
  .name('agent-coordinator')
  .description('Coordinador de agentes para proyecto ISO 9001')
  .version('1.0.0');

program
  .command('full-migration')
  .description('Ejecutar migración completa')
  .action(async () => {
    const coordinator = new AgentCoordinator();
    await coordinator.executeFullMigration();
  });

program
  .command('security')
  .description('Ejecutar solo agente de seguridad')
  .action(async () => {
    const coordinator = new AgentCoordinator();
    await coordinator.executeSecurity();
  });

program
  .command('structure')
  .description('Ejecutar solo agente de estructura')
  .action(async () => {
    const coordinator = new AgentCoordinator();
    await coordinator.executeStructure();
  });

program
  .command('typescript')
  .description('Ejecutar solo agentes TypeScript')
  .action(async () => {
    const coordinator = new AgentCoordinator();
    await coordinator.executeTypeScript();
  });

program
  .command('api')
  .description('Ejecutar solo agente API')
  .action(async () => {
    const coordinator = new AgentCoordinator();
    await coordinator.executeApi();
  });

program
  .command('web')
  .description('Iniciar interfaz web del coordinador en puerto 8000')
  .action(() => {
    console.log(chalk.blue.bold('\n🌐 INICIANDO INTERFAZ WEB DEL COORDINADOR'));
    console.log(chalk.gray('═══════════════════════════════════════════\n'));
    
    const webAgent = new WebAgent();
    webAgent.start();
    
    console.log(chalk.green('✅ Interfaz web iniciada'));
    console.log(chalk.cyan('📊 Dashboard: http://localhost:8000'));
    console.log(chalk.cyan('🔌 API: http://localhost:8000/api/status'));
    console.log(chalk.yellow('\n💡 Presiona Ctrl+C para detener\n'));
  });

program.parse();