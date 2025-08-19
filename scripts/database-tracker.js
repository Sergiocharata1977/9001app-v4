#!/usr/bin/env node

/**
 * 🗄️ RASTREADOR AUTOMÁTICO DE BASE DE DATOS
 * Detecta cambios en tablas y campos automáticamente
 * Actualiza el documento de coordinación cada 12 horas
 * 
 * Uso: node scripts/database-tracker.js
 */

const fs = require('fs').promises;
const path = require('path');
const { TursoClient } = require('@libsql/client');

// Configuración
const CONFIG = {
  COORDINATION_FILE: 'COORDINACION-AGENTES.md',
  DB_URL: process.env.DB_URL || 'file:data.db',
  DB_TOKEN: process.env.DB_TOKEN,
  UPDATE_INTERVAL: 12 * 60 * 60 * 1000, // 12 horas
  SGC_TABLES_PREFIX: 'sgc_'
};

// Cliente de base de datos
const tursoClient = new TursoClient({
  url: CONFIG.DB_URL,
  authToken: CONFIG.DB_TOKEN
});

/**
 * Obtener todas las tablas SGC
 */
async function getSGCTables() {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '${CONFIG.SGC_TABLES_PREFIX}%' ORDER BY name`
    });
    
    return result.rows.map(row => row.name);
  } catch (error) {
    console.log('❌ Error obteniendo tablas SGC:', error.message);
    return [];
  }
}

/**
 * Obtener estructura de una tabla
 */
async function getTableStructure(tableName) {
  try {
    const result = await tursoClient.execute({
      sql: `PRAGMA table_info(${tableName})`
    });
    
    return result.rows.map(row => ({
      name: row.name,
      type: row.type,
      notNull: row.notnull,
      defaultValue: row.dflt_value,
      primaryKey: row.pk
    }));
  } catch (error) {
    console.log(`❌ Error obteniendo estructura de ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Obtener estadísticas de una tabla
 */
async function getTableStats(tableName) {
  try {
    const result = await tursoClient.execute({
      sql: `SELECT COUNT(*) as count FROM ${tableName}`
    });
    
    return result.rows[0]?.count || 0;
  } catch (error) {
    console.log(`❌ Error obteniendo estadísticas de ${tableName}:`, error.message);
    return 0;
  }
}

/**
 * Detectar cambios recientes en tablas
 */
async function detectRecentChanges() {
  const changes = [];
  const tables = await getSGCTables();
  
  for (const table of tables) {
    try {
      // Verificar si hay registros recientes (últimas 24 horas)
      const result = await tursoClient.execute({
        sql: `SELECT COUNT(*) as recent_count FROM ${table} 
              WHERE created_at >= datetime('now', '-1 day') 
              OR updated_at >= datetime('now', '-1 day')`
      });
      
      const recentCount = result.rows[0]?.recent_count || 0;
      
      if (recentCount > 0) {
        changes.push({
          table,
          action: 'MODIFICACIÓN',
          records: recentCount,
          timestamp: new Date().toLocaleString('es-ES')
        });
      }
    } catch (error) {
      // Si no hay campos de timestamp, verificar estructura
      const structure = await getTableStructure(table);
      if (structure.length > 0) {
        changes.push({
          table,
          action: 'ESTRUCTURA',
          fields: structure.length,
          timestamp: new Date().toLocaleString('es-ES')
        });
      }
    }
  }
  
  return changes;
}

/**
 * Generar estadísticas de BD
 */
async function generateDBStats() {
  const tables = await getSGCTables();
  const stats = {
    totalTables: tables.length,
    migratedTables: 0,
    standardizedTables: 0,
    totalFields: 0,
    totalRecords: 0
  };
  
  for (const table of tables) {
    const structure = await getTableStructure(table);
    const recordCount = await getTableStats(table);
    
    stats.totalFields += structure.length;
    stats.totalRecords += recordCount;
    
    // Detectar si es tabla migrada (tiene campos específicos)
    if (structure.some(field => field.name === 'organization_id')) {
      stats.migratedTables++;
    }
    
    // Detectar si es tabla estandarizada (tiene campos específicos)
    if (structure.some(field => field.name === 'is_active')) {
      stats.standardizedTables++;
    }
  }
  
  return stats;
}

/**
 * Actualizar sección de BD en el documento
 */
async function updateDatabaseSection() {
  try {
    console.log('🗄️ Actualizando seguimiento de base de datos...');
    
    // Leer documento actual
    const content = await fs.readFile(CONFIG.COORDINATION_FILE, 'utf8');
    
    // Obtener datos actualizados
    const changes = await detectRecentChanges();
    const stats = await generateDBStats();
    
    // Generar nueva sección de BD
    const newDBSection = `
## 🗄️ SEGUIMIENTO DE BASE DE DATOS

### **📋 TABLAS MODIFICADAS HOY**
| Tabla | Agente | Acción | Detalles | Estado | Timestamp |
|-------|--------|--------|----------|--------|-----------|
${changes.map(change => 
  `| \`${change.table}\` | SISTEMA | ${change.action} | ${change.records ? `${change.records} registros` : `${change.fields} campos`} | ✅ DETECTADO | ${change.timestamp} |`
).join('\n')}
${changes.length === 0 ? '| *Ninguna modificación detectada* | - | - | - | - | - |' : ''}

### **🔧 CAMBIOS PENDIENTES**
- [ ] **SISTEMA**: Optimizar índices en tablas principales
- [ ] **SISTEMA**: Revisar integridad referencial
- [ ] **SISTEMA**: Analizar rendimiento de consultas

### **📊 ESTADÍSTICAS DE BD**
- **Total de tablas SGC**: ${stats.totalTables}
- **Tablas migradas**: ${stats.migratedTables}/${stats.totalTables} (${Math.round(stats.migratedTables/stats.totalTables*100)}%)
- **Tablas estandarizadas**: ${stats.standardizedTables}/${stats.totalTables} (${Math.round(stats.standardizedTables/stats.totalTables*100)}%)
- **Total de campos**: ${stats.totalFields}
- **Total de registros**: ${stats.totalRecords}
- **Última actualización**: ${new Date().toLocaleString('es-ES')}
`;

    // Reemplazar sección de BD en el documento
    const updatedContent = content.replace(
      /## 🗄️ SEGUIMIENTO DE BASE DE DATOS[\s\S]*?(?=## |$)/m,
      newDBSection
    );
    
    await fs.writeFile(CONFIG.COORDINATION_FILE, updatedContent);
    console.log('✅ Sección de BD actualizada');
    
    return { changes: changes.length, stats };
    
  } catch (error) {
    console.log('❌ Error actualizando sección de BD:', error.message);
    return { changes: 0, stats: null };
  }
}

/**
 * Modo continuo
 */
async function runContinuous() {
  console.log('🔄 Iniciando rastreador continuo de BD...');
  console.log(`⏰ Actualización cada ${CONFIG.UPDATE_INTERVAL / (60 * 60 * 1000)} horas`);
  
  // Actualización inicial
  await updateDatabaseSection();
  
  // Configurar intervalo
  setInterval(async () => {
    await updateDatabaseSection();
  }, CONFIG.UPDATE_INTERVAL);
}

/**
 * Actualización única
 */
async function runOnce() {
  console.log('🗄️ Ejecutando rastreador de BD una vez...');
  const result = await updateDatabaseSection();
  console.log(`📊 Resultado: ${result.changes} cambios detectados`);
}

// Manejo de argumentos
const args = process.argv.slice(2);

if (args.includes('continuous')) {
  runContinuous();
} else {
  runOnce();
}

module.exports = {
  updateDatabaseSection,
  detectRecentChanges,
  generateDBStats
};
