"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAgent = void 0;
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class WebAgent {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.agents = {
            security: { status: 'idle', lastRun: null, results: [] },
            structure: { status: 'idle', lastRun: null, results: [] },
            typescript: { status: 'idle', lastRun: null, results: [] },
            api: { status: 'idle', lastRun: null, results: [] }
        };
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    setupRoutes() {
        // Dashboard principal
        this.app.get('/', (req, res) => {
            res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Agent Coordinator Dashboard</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .agent { border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .status-idle { background-color: #f0f0f0; }
            .status-running { background-color: #fff3cd; }
            .status-completed { background-color: #d4edda; }
            .status-error { background-color: #f8d7da; }
            button { padding: 10px 20px; margin: 5px; cursor: pointer; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .metric { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🤖 Agent Coordinator Dashboard</h1>
          
          <div class="metrics">
            <div class="metric">
              <h3>Agentes Activos</h3>
              <h2 id="activeAgents">0</h2>
            </div>
            <div class="metric">
              <h3>Última Ejecución</h3>
              <p id="lastExecution">Nunca</p>
            </div>
            <div class="metric">
              <h3>Tiempo Promedio</h3>
              <p id="avgTime">0s</p>
            </div>
          </div>

          <h2>Agentes Disponibles</h2>
          <div id="agentsList"></div>

          <h2>Acciones Rápidas</h2>
          <button onclick="runAllAgents()">🚀 Ejecutar Todos</button>
          <button onclick="runSecurity()">🔒 Solo Seguridad</button>
          <button onclick="runTypeScript()">📝 Solo TypeScript</button>
          <button onclick="runAPI()">🔌 Solo API</button>

          <script>
            function updateDashboard() {
              fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                  document.getElementById('agentsList').innerHTML = data.agents.map(agent => 
                    \`<div class="agent status-\${agent.status}">
                      <h3>\${agent.name}</h3>
                      <p>Estado: \${agent.status}</p>
                      <p>Última ejecución: \${agent.lastRun || 'Nunca'}</p>
                      <button onclick="runAgent('\${agent.name}')">Ejecutar</button>
                    </div>\`
                  ).join('');
                  
                  document.getElementById('activeAgents').textContent = data.activeAgents;
                  document.getElementById('lastExecution').textContent = data.lastExecution;
                  document.getElementById('avgTime').textContent = data.avgTime + 's';
                });
            }

            function runAgent(agentName) {
              fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent: agentName })
              }).then(() => updateDashboard());
            }

            function runAllAgents() {
              fetch('/api/run-all', { method: 'POST' }).then(() => updateDashboard());
            }

            function runSecurity() {
              runAgent('security');
            }

            function runTypeScript() {
              runAgent('typescript');
            }

            function runAPI() {
              runAgent('api');
            }

            // Actualizar cada 5 segundos
            setInterval(updateDashboard, 5000);
            updateDashboard();
          </script>
        </body>
        </html>
      `);
        });
        // API para obtener estado
        this.app.get('/api/status', (req, res) => {
            const activeAgents = Object.values(this.agents).filter(a => a.status === 'running').length;
            const lastExecution = this.getLastExecution();
            const avgTime = this.getAverageTime();
            res.json({
                agents: Object.entries(this.agents).map(([name, data]) => ({
                    name,
                    status: data.status,
                    lastRun: data.lastRun,
                    results: data.results
                })),
                activeAgents,
                lastExecution,
                avgTime
            });
        });
        // API para ejecutar agente específico
        this.app.post('/api/run', async (req, res) => {
            const { agent } = req.body;
            if (this.agents[agent]) {
                this.agents[agent].status = 'running';
                this.agents[agent].lastRun = new Date().toISOString();
                try {
                    const startTime = Date.now();
                    await this.runAgent(agent);
                    const endTime = Date.now();
                    this.agents[agent].status = 'completed';
                    this.agents[agent].results.push({
                        timestamp: new Date().toISOString(),
                        duration: endTime - startTime,
                        success: true
                    });
                    res.json({ success: true, message: `${agent} ejecutado exitosamente` });
                }
                catch (error) {
                    this.agents[agent].status = 'error';
                    this.agents[agent].results.push({
                        timestamp: new Date().toISOString(),
                        error: error instanceof Error ? error.message : 'Error desconocido',
                        success: false
                    });
                    res.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : 'Error desconocido'
                    });
                }
            }
            else {
                res.status(404).json({ success: false, error: 'Agente no encontrado' });
            }
        });
        // API para ejecutar todos los agentes
        this.app.post('/api/run-all', async (req, res) => {
            try {
                const startTime = Date.now();
                // Ejecutar todos los agentes en paralelo
                const promises = Object.keys(this.agents).map(agent => this.runAgent(agent));
                await Promise.all(promises);
                const endTime = Date.now();
                res.json({
                    success: true,
                    message: 'Todos los agentes ejecutados exitosamente',
                    duration: endTime - startTime
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    async runAgent(agentName) {
        // Simular ejecución del agente
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        // Aquí puedes integrar con los agentes reales
        console.log(`Ejecutando agente: ${agentName}`);
    }
    getLastExecution() {
        const executions = Object.values(this.agents)
            .map(a => a.lastRun)
            .filter(Boolean)
            .sort()
            .reverse();
        return executions[0] || 'Nunca';
    }
    getAverageTime() {
        const times = Object.values(this.agents)
            .flatMap(a => a.results)
            .filter(r => r.success && r.duration)
            .map(r => r.duration);
        if (times.length === 0)
            return 0;
        return Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`🌐 Web Agent iniciado en http://localhost:${this.port}`);
            console.log(`📊 Dashboard disponible en http://localhost:${this.port}`);
        });
    }
}
exports.WebAgent = WebAgent;
