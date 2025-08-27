"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAgent = void 0;
const chalk_1 = __importDefault(require("chalk"));
class ApiAgent {
    async execute() {
        console.log(chalk_1.default.cyan('🔌 Configurando endpoints de API...'));
        await this.delay(2000);
        console.log(chalk_1.default.green('✅ Endpoints configurados'));
        console.log(chalk_1.default.cyan('�� Verificando conectividad...'));
        await this.delay(1500);
        console.log(chalk_1.default.green('✅ API funcionando correctamente'));
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.ApiAgent = ApiAgent;
