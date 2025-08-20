const fs = require('fs');
const path = require('path');

class TempCleanup {
  constructor() {
    this.tempDir = path.join(__dirname, '..', 'temporales');
    this.backupDir = path.join(__dirname, '..', 'backups');
  }

  async cleanup() {
    console.log('🧹 Limpiando archivos temporales...\n');
    
    try {
      // 1. Crear directorio de backups si no existe
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
        console.log('📁 Directorio de backups creado');
      }
      
      // 2. Mover archivos temporales a backups
      await this.moveTempToBackup();
      
      // 3. Limpiar archivos temporales
      await this.cleanTempFiles();
      
      console.log('\n✅ Limpieza completada exitosamente!');
      
    } catch (error) {
      console.error('❌ Error en limpieza:', error);
      process.exit(1);
    }
  }

  async moveTempToBackup() {
    console.log('📦 Moviendo archivos temporales a backups...');
    
    if (!fs.existsSync(this.tempDir)) {
      console.log('⚠️ Directorio temporal no encontrado');
      return;
    }
    
    const tempFiles = fs.readdirSync(this.tempDir);
    
    if (tempFiles.length === 0) {
      console.log('📭 No hay archivos temporales para mover');
      return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubDir = path.join(this.backupDir, `backup-${timestamp}`);
    
    fs.mkdirSync(backupSubDir, { recursive: true });
    
    for (const file of tempFiles) {
      const sourcePath = path.join(this.tempDir, file);
      const destPath = path.join(backupSubDir, file);
      
      fs.copyFileSync(sourcePath, destPath);
      console.log(`📄 Movido: ${file}`);
    }
    
    console.log(`✅ ${tempFiles.length} archivos movidos a ${backupSubDir}`);
  }

  async cleanTempFiles() {
    console.log('🗑️ Eliminando archivos temporales...');
    
    if (!fs.existsSync(this.tempDir)) {
      console.log('⚠️ Directorio temporal no encontrado');
      return;
    }
    
    const tempFiles = fs.readdirSync(this.tempDir);
    
    if (tempFiles.length === 0) {
      console.log('📭 No hay archivos temporales para eliminar');
      return;
    }
    
    for (const file of tempFiles) {
      const filePath = path.join(this.tempDir, file);
      
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Eliminado: ${file}`);
      } catch (error) {
        console.error(`❌ Error eliminando ${file}:`, error.message);
      }
    }
    
    console.log(`✅ ${tempFiles.length} archivos temporales eliminados`);
  }

  async listBackups() {
    console.log('\n📋 Lista de backups disponibles:');
    
    if (!fs.existsSync(this.backupDir)) {
      console.log('📭 No hay directorio de backups');
      return;
    }
    
    const backups = fs.readdirSync(this.backupDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort()
      .reverse();
    
    if (backups.length === 0) {
      console.log('📭 No hay backups disponibles');
      return;
    }
    
    backups.forEach((backup, index) => {
      const backupPath = path.join(this.backupDir, backup);
      const files = fs.readdirSync(backupPath);
      console.log(`${index + 1}. ${backup} (${files.length} archivos)`);
    });
  }

  async restoreBackup(backupName) {
    console.log(`🔄 Restaurando backup: ${backupName}...`);
    
    const backupPath = path.join(this.backupDir, backupName);
    
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup ${backupName} no encontrado`);
      return;
    }
    
    const files = fs.readdirSync(backupPath);
    
    for (const file of files) {
      const sourcePath = path.join(backupPath, file);
      const destPath = path.join(this.tempDir, file);
      
      try {
        if (!fs.existsSync(this.tempDir)) {
          fs.mkdirSync(this.tempDir, { recursive: true });
        }
        
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📄 Restaurado: ${file}`);
      } catch (error) {
        console.error(`❌ Error restaurando ${file}:`, error.message);
      }
    }
    
    console.log(`✅ Backup ${backupName} restaurado`);
  }
}

// Funciones de utilidad
async function showHelp() {
  console.log(`
🧹 Temp Cleanup - Gestión de archivos temporales

Uso: node scripts/permanentes/cleanup-temp.js [comando] [opciones]

Comandos disponibles:
  cleanup  - Limpiar archivos temporales (mover a backup y eliminar)
  list     - Listar backups disponibles
  restore  - Restaurar un backup específico
  help     - Mostrar esta ayuda

Ejemplos:
  node scripts/permanentes/cleanup-temp.js cleanup
  node scripts/permanentes/cleanup-temp.js list
  node scripts/permanentes/cleanup-temp.js restore backup-2025-08-20T09-18-00-000Z
  `);
}

// Ejecución principal
async function main() {
  const command = process.argv[2] || 'help';
  const argument = process.argv[3];
  const cleanup = new TempCleanup();
  
  switch (command) {
    case 'cleanup':
      await cleanup.cleanup();
      break;
    case 'list':
      await cleanup.listBackups();
      break;
    case 'restore':
      if (!argument) {
        console.error('❌ Debes especificar el nombre del backup');
        process.exit(1);
      }
      await cleanup.restoreBackup(argument);
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

module.exports = { TempCleanup };
