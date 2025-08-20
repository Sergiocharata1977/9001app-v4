const { RAGSetup } = require('./rag-setup');
const { BackendConfigUpdater } = require('./update-backend-config');
const { TempCleanup } = require('./cleanup-temp');

class RAGSystemSetup {
  constructor() {
    this.ragSetup = new RAGSetup();
    this.configUpdater = new BackendConfigUpdater();
    this.cleanup = new TempCleanup();
  }

  async setupComplete() {
    console.log('🚀 Configuración Completa del Sistema RAG\n');
    console.log('=' .repeat(60));
    
    try {
      // Paso 1: Verificar y configurar RAG
      console.log('\n📋 PASO 1: Configuración del Sistema RAG');
      console.log('-'.repeat(40));
      await this.ragSetup.initialize();
      
      // Paso 2: Actualizar configuración del backend
      console.log('\n📋 PASO 2: Actualización de Configuración del Backend');
      console.log('-'.repeat(40));
      await this.configUpdater.updateAllConfigs();
      
      // Paso 3: Mostrar estado final
      console.log('\n📋 PASO 3: Estado Final del Sistema');
      console.log('-'.repeat(40));
      await this.ragSetup.getStatus();
      
      // Paso 4: Limpiar archivos temporales
      console.log('\n📋 PASO 4: Limpieza de Archivos Temporales');
      console.log('-'.repeat(40));
      await this.cleanup.cleanup();
      
      console.log('\n🎉 ¡CONFIGURACIÓN COMPLETA EXITOSA!');
      console.log('=' .repeat(60));
      console.log('\n✅ El sistema RAG está listo para usar');
      console.log('✅ La base de datos isoflow4 está configurada');
      console.log('✅ El backend está actualizado');
      console.log('✅ Los archivos temporales han sido limpiados');
      
      console.log('\n🚀 Próximos pasos:');
      console.log('1. Reiniciar el servidor backend');
      console.log('2. Probar el chat del Asistente RAG en el frontend');
      console.log('3. Ejecutar la indexación completa de datos');
      
    } catch (error) {
      console.error('\n❌ Error en la configuración completa:', error);
      console.log('\n💡 Intenta ejecutar los pasos individualmente:');
      console.log('  node scripts/permanentes/rag-setup.js init');
      console.log('  node scripts/permanentes/update-backend-config.js update');
      console.log('  node scripts/permanentes/cleanup-temp.js cleanup');
      process.exit(1);
    }
  }

  async setupStep(step) {
    console.log(`🚀 Ejecutando paso: ${step}\n`);
    
    try {
      switch (step) {
        case 'rag':
          await this.ragSetup.initialize();
          break;
        case 'config':
          await this.configUpdater.updateAllConfigs();
          break;
        case 'cleanup':
          await this.cleanup.cleanup();
          break;
        case 'status':
          await this.ragSetup.getStatus();
          break;
        default:
          console.error(`❌ Paso desconocido: ${step}`);
          process.exit(1);
      }
      
      console.log(`✅ Paso ${step} completado exitosamente`);
      
    } catch (error) {
      console.error(`❌ Error en paso ${step}:`, error);
      process.exit(1);
    }
  }

  async showSystemInfo() {
    console.log('📊 Información del Sistema RAG\n');
    
    try {
      // Información de RAG
      console.log('🧠 Estado del Sistema RAG:');
      await this.ragSetup.getStatus();
      
      // Información de configuración
      console.log('\n⚙️ Estado de la Configuración:');
      await this.configUpdater.showCurrentConfig();
      
      // Información de archivos temporales
      console.log('\n📁 Archivos Temporales:');
      await this.cleanup.listBackups();
      
    } catch (error) {
      console.error('❌ Error mostrando información del sistema:', error);
    }
  }
}

// Funciones de utilidad
async function showHelp() {
  console.log(`
🚀 RAG System Setup - Configuración Completa del Sistema RAG

Uso: node scripts/permanentes/setup-rag-system.js [comando] [opción]

Comandos disponibles:
  complete  - Configuración completa del sistema (todos los pasos)
  rag       - Solo configuración del sistema RAG
  config    - Solo actualización de configuración del backend
  cleanup   - Solo limpieza de archivos temporales
  status    - Solo mostrar estado del sistema
  info      - Mostrar información completa del sistema
  help      - Mostrar esta ayuda

Ejemplos:
  node scripts/permanentes/setup-rag-system.js complete
  node scripts/permanentes/setup-rag-system.js rag
  node scripts/permanentes/setup-rag-system.js config
  node scripts/permanentes/setup-rag-system.js info
  `);
}

// Ejecución principal
async function main() {
  const command = process.argv[2] || 'help';
  const option = process.argv[3];
  const setup = new RAGSystemSetup();
  
  switch (command) {
    case 'complete':
      await setup.setupComplete();
      break;
    case 'rag':
    case 'config':
    case 'cleanup':
    case 'status':
      await setup.setupStep(command);
      break;
    case 'info':
      await setup.showSystemInfo();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RAGSystemSetup };
