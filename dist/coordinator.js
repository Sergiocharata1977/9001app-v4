#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const api_agent_1 = require("./agents/api-agent");
const security_agent_1 = require("./agents/security-agent");
const structure_agent_1 = require("./agents/structure-agent");
const typescript_agent_1 = require("./agents/typescript-agent");
const web_agent_1 = require("./agents/web-agent");
const program = new commander_1.Command();
class AgentCoordinator {
    constructor() {
        this.agents = {
            security: new security_agent_1.SecurityAgent(),
            structure: new structure_agent_1.StructureAgent(),
            typescript: new typescript_agent_1.TypeScriptAgent(),
            api: new api_agent_1.ApiAgent()
        };
    }
    async executeFullMigration() {
        console.log(chalk_1.default.blue.bold('�� AGENTE COORDINADOR - PROYECTO ISO 9001'));
        console.log(chalk_1.default.gray('═══════════════════════════════════════════\n'));
        const startTime = Date.now();
        try {
            // 1. Seguridad (crítico)
            console.log(chalk_1.default.yellow('🔒 Ejecutando Agente Seguridad...'));
            await this.agents.security.execute();
            console.log(chalk_1.default.green('✅ Seguridad completada\n'));
            // 2. Estructura (crítico)
            console.log(chalk_1.default.yellow('��️ Ejecutando Agente Estructura...'));
            await this.agents.structure.execute();
            console.log(chalk_1.default.green('✅ Estructura completada\n'));
            // 3. TypeScript (paralelo)
            console.log(chalk_1.default.yellow('�� Ejecutando Agentes TypeScript en paralelo...'));
            await Promise.all([
                this.agents.typescript.migrateCRM(),
                this.agents.typescript.migrateRRHH(),
                this.agents.typescript.migrateProcesos()
            ]);
            console.log(chalk_1.default.green('✅ TypeScript completado\n'));
            // 4. API
            console.log(chalk_1.default.yellow('🔌 Ejecutando Agente API...'));
            await this.agents.api.execute();
            console.log(chalk_1.default.green('✅ API completada\n'));
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 1000);
            console.log(chalk_1.default.blue.bold('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE'));
            console.log(chalk_1.default.gray(`⏱️ Tiempo total: ${duration} segundos`));
        }
        catch (error) {
            console.error(chalk_1.default.red('❌ Error en la migración:'), error);
            process.exit(1);
        }
    }
    async executeSecurity() {
        console.log(chalk_1.default.blue.bold('🔒 AGENTE SEGURIDAD'));
        await this.agents.security.execute();
    }
    async executeStructure() {
        console.log(chalk_1.default.blue.bold('��️ AGENTE ESTRUCTURA'));
        await this.agents.structure.execute();
    }
    async executeTypeScript() {
        console.log(chalk_1.default.blue.bold('📝 AGENTE TYPESCRIPT'));
        await Promise.all([
            this.agents.typescript.migrateCRM(),
            this.agents.typescript.migrateRRHH(),
            this.agents.typescript.migrateProcesos()
        ]);
    }
    async executeApi() {
        console.log(chalk_1.default.blue.bold('�� AGENTE API'));
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
    console.log(chalk_1.default.blue.bold('\n🌐 INICIANDO INTERFAZ WEB DEL COORDINADOR'));
    console.log(chalk_1.default.gray('═══════════════════════════════════════════\n'));
    const webAgent = new web_agent_1.WebAgent();
    webAgent.start();
    console.log(chalk_1.default.green('✅ Interfaz web iniciada'));
    console.log(chalk_1.default.cyan('📊 Dashboard: http://localhost:8000'));
    console.log(chalk_1.default.cyan('🔌 API: http://localhost:8000/api/status'));
    console.log(chalk_1.default.yellow('\n💡 Presiona Ctrl+C para detener\n'));
});
program.parse();
