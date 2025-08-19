#!/usr/bin/env node

/**
 * 🧹 SISTEMA DE LIMPIEZA AUTOMÁTICA
 * Limpia documentos duplicados, obsoletos y archivos innecesarios
 * Se ejecuta automáticamente cada 2 días
 * 
 * Uso: node scripts/cleanup-system.js
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Configuración
const CONFIG = {
  COORDINATION_FILE: 'COORDINACION-AGENTES.md',
  LOG_FILE: 'logs/cleanup.log',
  BACKUP_DIR: 'backups/',
  CLEANUP_INTERVAL: 2 * 24 * 60 * 60 * 1000, // 2 días
  
  // Archivos a ignorar
  IGNORE_FILES: [
    'package.json',
    'package-lock.json',
    'README.md',
    'COORDINACION-AGENTES.md',
    '.gitignore',
    '.env',
    'data.db'
  ],
  
  // Extensiones a limpiar
  CLEANUP_EXTENSIONS: [
    '.log',
    '.tmp',
    '.bak',
    '.old',
    '.backup'
  ],
  
  // Patrones de archivos duplicados
  DUPLICATE_PATTERNS: [
    /^INFORME-.*\.md$/,
    /^FASE-.*\.md$/,
    /^SGC-.*\.md$/,
    /^migracion-.*\.sql$/,
    /^ejecutar-.*\.js$/
  ]
};

/**
 * Crear directorio de logs si no existe
 */
async function ensureLogDir() {
  try {
    await fs.mkdir('logs', { recursive: true });
  } catch (error) {
    console.log('❌ Error creando directorio de logs:', error.message);
  }
}

/**
 * Escribir log
 */
async function writeLog(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    await fs.appendFile(CONFIG.LOG_FILE, logEntry);
  } catch (error) {
    console.log('❌ Error escribiendo log:', error.message);
  }
}

/**
 * Calcular hash MD5 de un archivo
 */
async function getFileHash(filePath) {
  try {
    const content = await fs.readFile(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * Detectar archivos duplicados
 */
async function findDuplicateFiles() {
  const duplicates = [];
  const fileHashes = new Map();
  
  try {
    const files = await fs.readdir('.');
    
    for (const file of files) {
      if (CONFIG.IGNORE_FILES.includes(file)) continue;
      
      const filePath = path.join('.', file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        const hash = await getFileHash(filePath);
        if (hash) {
          if (fileHashes.has(hash)) {
            duplicates.push({
              original: fileHashes.get(hash),
              duplicate: file,
              hash: hash,
              size: stats.size
            });
          } else {
            fileHashes.set(hash, file);
          }
        }
      }
    }
  } catch (error) {
    console.log('❌ Error buscando duplicados:', error.message);
  }
  
  return duplicates;
}

/**
 * Detectar archivos obsoletos por patrón
 */
async function findObsoleteFiles() {
  const obsolete = [];
  
  try {
    const files = await fs.readdir('.');
    
    for (const file of files) {
      if (CONFIG.IGNORE_FILES.includes(file)) continue;
      
      // Verificar extensiones a limpiar
      const ext = path.extname(file);
      if (CONFIG.CLEANUP_EXTENSIONS.includes(ext)) {
        obsolete.push({
          file: file,
          reason: `Extensión obsoleta: ${ext}`,
          type: 'extension'
        });
        continue;
      }
      
      // Verificar patrones de duplicados
      for (const pattern of CONFIG.DUPLICATE_PATTERNS) {
        if (pattern.test(file)) {
          const stats = await fs.stat(file);
          const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysOld > 30) { // Archivos más de 30 días
            obsolete.push({
              file: file,
              reason: `Archivo antiguo (${Math.round(daysOld)} días)`,
              type: 'old'
            });
          }
        }
      }
    }
  } catch (error) {
    console.log('❌ Error buscando archivos obsoletos:', error.message);
  }
  
  return obsolete;
}

/**
 * Crear backup antes de eliminar
 */
async function createBackup(files) {
  const backupDir = path.join(CONFIG.BACKUP_DIR, `cleanup-${Date.now()}`);
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    
    for (const file of files) {
      const sourcePath = path.join('.', file);
      const destPath = path.join(backupDir, file);
      
      await fs.copyFile(sourcePath, destPath);
    }
    
    await writeLog(`✅ Backup creado en: ${backupDir}`);
    return backupDir;
  } catch (error) {
    console.log('❌ Error creando backup:', error.message);
    return null;
  }
}

/**
 * Eliminar archivos
 */
async function deleteFiles(files) {
  let deletedCount = 0;
  
  for (const file of files) {
    try {
      await fs.unlink(file);
      deletedCount++;
      await writeLog(`🗑️ Eliminado: ${file}`);
    } catch (error) {
      await writeLog(`❌ Error eliminando ${file}: ${error.message}`);
    }
  }
  
  return deletedCount;
}

/**
 * Limpiar logs antiguos
 */
async function cleanOldLogs() {
  try {
    const logFiles = await fs.readdir('logs');
    const oldLogs = [];
    
    for (const logFile of logFiles) {
      if (logFile.endsWith('.log')) {
        const logPath = path.join('logs', logFile);
        const stats = await fs.stat(logPath);
        const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysOld > 7) { // Logs más de 7 días
          oldLogs.push(logPath);
        }
      }
    }
    
    if (oldLogs.length > 0) {
      await deleteFiles(oldLogs);
      await writeLog(`🧹 Limpiados ${oldLogs.length} logs antiguos`);
    }
  } catch (error) {
    console.log('❌ Error limpiando logs:', error.message);
  }
}

/**
 * Limpiar node_modules si es muy grande
 */
async function checkNodeModules() {
  try {
    const nodeModulesPath = path.join('.', 'node_modules');
    const stats = await fs.stat(nodeModulesPath);
    const sizeMB = stats.size / (1024 * 1024);
    
    if (sizeMB > 500) { // Más de 500MB
      await writeLog(`⚠️ node_modules muy grande: ${Math.round(sizeMB)}MB`);
      return true;
    }
  } catch (error) {
    // node_modules no existe
  }
  
  return false;
}

/**
 * Función principal de limpieza
 */
async function runCleanup() {
  console.log('🧹 Iniciando limpieza automática...');
  await writeLog('🧹 INICIANDO LIMPIEZA AUTOMÁTICA');
  
  // Asegurar directorio de logs
  await ensureLogDir();
  
  // 1. Detectar duplicados
  console.log('🔍 Buscando archivos duplicados...');
  const duplicates = await findDuplicateFiles();
  await writeLog(`📊 Encontrados ${duplicates.length} archivos duplicados`);
  
  // 2. Detectar obsoletos
  console.log('🔍 Buscando archivos obsoletos...');
  const obsolete = await findObsoleteFiles();
  await writeLog(`📊 Encontrados ${obsolete.length} archivos obsoletos`);
  
  // 3. Crear lista de archivos a eliminar
  const filesToDelete = [
    ...duplicates.map(d => d.duplicate),
    ...obsolete.map(o => o.file)
  ];
  
  if (filesToDelete.length === 0) {
    console.log('✅ No hay archivos para limpiar');
    await writeLog('✅ No hay archivos para limpiar');
    return;
  }
  
  // 4. Crear backup
  console.log('💾 Creando backup...');
  const backupDir = await createBackup(filesToDelete);
  
  // 5. Eliminar archivos
  console.log('🗑️ Eliminando archivos...');
  const deletedCount = await deleteFiles(filesToDelete);
  
  // 6. Limpiar logs antiguos
  console.log('🧹 Limpiando logs antiguos...');
  await cleanOldLogs();
  
  // 7. Verificar node_modules
  console.log('📦 Verificando node_modules...');
  const nodeModulesLarge = await checkNodeModules();
  
  // Resumen
  const summary = {
    duplicates: duplicates.length,
    obsolete: obsolete.length,
    deleted: deletedCount,
    backup: backupDir,
    nodeModulesLarge: nodeModulesLarge
  };
  
  console.log('📊 RESUMEN DE LIMPIEZA:');
  console.log(`   Duplicados: ${summary.duplicates}`);
  console.log(`   Obsoletos: ${summary.obsolete}`);
  console.log(`   Eliminados: ${summary.deleted}`);
  console.log(`   Backup: ${summary.backup ? 'Creado' : 'Error'}`);
  console.log(`   node_modules: ${summary.nodeModulesLarge ? 'Muy grande' : 'OK'}`);
  
  await writeLog(`📊 RESUMEN: ${summary.deleted} archivos eliminados`);
  await writeLog('✅ LIMPIEZA COMPLETADA');
}

/**
 * Modo continuo
 */
async function runContinuous() {
  console.log('🔄 Iniciando limpieza continua...');
  console.log(`⏰ Limpieza cada ${CONFIG.CLEANUP_INTERVAL / (24 * 60 * 60 * 1000)} días`);
  
  // Limpieza inicial
  await runCleanup();
  
  // Configurar intervalo
  setInterval(async () => {
    await runCleanup();
  }, CONFIG.CLEANUP_INTERVAL);
}

/**
 * Limpieza única
 */
async function runOnce() {
  console.log('🧹 Ejecutando limpieza una vez...');
  await runCleanup();
}

// Manejo de argumentos
const args = process.argv.slice(2);

if (args.includes('continuous')) {
  runContinuous();
} else {
  runOnce();
}

module.exports = {
  runCleanup,
  findDuplicateFiles,
  findObsoleteFiles,
  cleanOldLogs
};
