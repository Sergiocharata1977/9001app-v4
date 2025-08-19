const { exec } = require('child_process');
const path = require('path');

class AutomationSystem {
  constructor() {
    this.processes = [
      {
        name: 'Agent Coordinator',
        command: 'npm run agent-monitor:start',
        description: 'Coordinación de agentes cada 15 minutos'
      },
      {
        name: 'Database Tracker',
        command: 'npm run db-tracker:start',
        description: 'Rastreador de BD cada 12 horas'
      },
      {
        name: 'Auto Cleanup',
        command: 'npm run cleanup:start',
        description: 'Limpieza automática cada 2 días'
      }
    ];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  async runCommand(command, name) {
    return new Promise((resolve, reject) => {
      this.log(`🚀 Iniciando ${name}...`);
      
      exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Error iniciando ${name}: ${error.message}`);
          reject(error);
        } else {
          this.log(`✅ ${name} iniciado exitosamente`);
          if (stdout) this.log(`📤 Output: ${stdout}`);
          if (stderr) this.log(`⚠️ Warnings: ${stderr}`);
          resolve(stdout);
        }
      });
    });
  }

  async startAll() {
    this.log('🎯 Iniciando Sistema de Automatización Completo...');
    this.log('📋 Procesos a iniciar:');
    
    this.processes.forEach((process, index) => {
      this.log(`   ${index + 1}. ${process.name} - ${process.description}`);
    });

    this.log('');

    try {
      // Iniciar todos los procesos
      for (const process of this.processes) {
        await this.runCommand(process.command, process.name);
        // Esperar un poco entre cada proceso
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      this.log('');
      this.log('🎉 ¡Sistema de Automatización iniciado completamente!');
      this.log('');
      this.log('📊 Comandos útiles:');
      this.log('   • Ver estado: pm2 status');
      this.log('   • Ver logs: pm2 logs');
      this.log('   • Parar todo: pm2 stop all');
      this.log('   • Reiniciar todo: pm2 restart all');
      this.log('');
      this.log('🔗 Acceso al Super Admin:');
      this.log('   • Estructura del Proyecto: http://localhost:3000/super-admin/database/structure');
      this.log('   • Coordinación de Agentes: http://localhost:3000/super-admin/coordinacion-documento');

    } catch (error) {
      this.log(`❌ Error iniciando el sistema: ${error.message}`);
      process.exit(1);
    }
  }

  async stopAll() {
    this.log('🛑 Deteniendo Sistema de Automatización...');
    
    try {
      await this.runCommand('pm2 stop all', 'Todos los procesos');
      this.log('✅ Sistema detenido exitosamente');
    } catch (error) {
      this.log(`❌ Error deteniendo el sistema: ${error.message}`);
    }
  }

  async restartAll() {
    this.log('🔄 Reiniciando Sistema de Automatización...');
    
    try {
      await this.runCommand('pm2 restart all', 'Todos los procesos');
      this.log('✅ Sistema reiniciado exitosamente');
    } catch (error) {
      this.log(`❌ Error reiniciando el sistema: ${error.message}`);
    }
  }

  async showStatus() {
    this.log('📊 Estado del Sistema de Automatización...');
    
    try {
      await this.runCommand('pm2 status', 'Estado de PM2');
    } catch (error) {
      this.log(`❌ Error mostrando estado: ${error.message}`);
    }
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);
const automation = new AutomationSystem();

async function main() {
  const command = args[0] || 'start';

  switch (command) {
    case 'start':
      await automation.startAll();
      break;
    case 'stop':
      await automation.stopAll();
      break;
    case 'restart':
      await automation.restartAll();
      break;
    case 'status':
      await automation.showStatus();
      break;
    case 'help':
      console.log(`
🎯 Sistema de Automatización - Comandos Disponibles:

  npm run automation:start    - Iniciar todos los procesos automáticos
  npm run automation:stop     - Detener todos los procesos
  npm run automation:restart  - Reiniciar todos los procesos
  npm run automation:status   - Mostrar estado de todos los procesos
  npm run automation:help     - Mostrar esta ayuda

📋 Procesos Incluidos:
  • Coordinación de Agentes (cada 15 min)
  • Rastreador de Base de Datos (cada 12 horas)
  • Limpieza Automática (cada 2 días)

🔗 Acceso Web:
  • Super Admin: http://localhost:3000/super-admin
  • Estructura: http://localhost:3000/super-admin/database/structure
      `);
      break;
    default:
      console.log(`❌ Comando desconocido: ${command}`);
      console.log('💡 Usa "npm run automation:help" para ver comandos disponibles');
      process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutomationSystem;
