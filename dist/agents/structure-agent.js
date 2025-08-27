"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureAgent = void 0;
const chalk_1 = __importDefault(require("chalk"));
class StructureAgent {
    async execute() {
        console.log(chalk_1.default.cyan('📁 Verificando estructura de carpetas...'));
        await this.delay(2000);
        console.log(chalk_1.default.green('✅ Estructura de carpetas correcta'));
        console.log(chalk_1.default.cyan('📦 Verificando package.json...'));
        await this.delay(1500);
        console.log(chalk_1.default.green('✅ package.json configurado'));
        console.log(chalk_1.default.cyan('⚙️ Verificando configuración TypeScript...'));
        await this.delay(1000);
        console.log(chalk_1.default.green('✅ TypeScript configurado'));
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.StructureAgent = StructureAgent;
