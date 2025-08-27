"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptAgent = void 0;
const chalk_1 = __importDefault(require("chalk"));
class TypeScriptAgent {
    async migrateCRM() {
        console.log(chalk_1.default.cyan('🔄 Migrando módulo CRM...'));
        await this.delay(3000);
        console.log(chalk_1.default.green('✅ CRM migrado a TypeScript'));
    }
    async migrateRRHH() {
        console.log(chalk_1.default.cyan('�� Migrando módulo RRHH...'));
        await this.delay(2500);
        console.log(chalk_1.default.green('✅ RRHH migrado a TypeScript'));
    }
    async migrateProcesos() {
        console.log(chalk_1.default.cyan('🔄 Migrando módulo Procesos...'));
        await this.delay(3500);
        console.log(chalk_1.default.green('✅ Procesos migrado a TypeScript'));
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.TypeScriptAgent = TypeScriptAgent;
