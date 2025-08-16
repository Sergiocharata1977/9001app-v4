const { tursoClient } = require('../lib/tursoClient.js');
const fs = require('fs');
const path = require('path');

async function migrateProcesosToSGC() {
  try {
    console.log('🔄 Iniciando migración de procesos al sistema SGC...');
    
    // Leer el script SQL de migración
    const sqlFile = path.join(__dirname, '../../migracion-procesos-sgc.sql');
    const migrationSQL = fs.readFileSync(sqlFile, 'utf8');
    
    // Dividir el SQL en statements individuales (filtrar comentarios y líneas vacías)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Se ejecutarán ${statements.length} statements SQL`);
    
    // Verificar tablas SGC existen antes de migrar
    console.log('🔍 Verificando que las tablas SGC genéricas existan...');
    
    const tablasSGC = ['sgc_participantes', 'sgc_documentos_relacionados', 'sgc_normas_relacionadas'];
    for (const tabla of tablasSGC) {
      try {
        const result = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          args: [tabla]
        });
        
        if (result.rows.length === 0) {
          console.error(`❌ Error: La tabla ${tabla} no existe. Ejecuta primero la implementación SGC.`);
          return;
        }
        console.log(`✅ Tabla ${tabla} encontrada`);
      } catch (error) {
        console.error(`❌ Error verificando tabla ${tabla}:`, error.message);
        return;
      }
    }
    
    // Verificar tabla procesos actual
    console.log('🔍 Verificando tabla procesos actual...');
    try {
      const result = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as count FROM procesos WHERE is_active = 1'
      });
      const currentCount = result.rows[0]?.count || 0;
      console.log(`📊 Registros actuales en tabla procesos: ${currentCount}`);
    } catch (error) {
      console.log('📝 Tabla procesos no existe o está vacía, se creará nueva estructura');
    }
    
    // Ejecutar migración step by step
    console.log('🚀 Iniciando migración...');
    
    // Ejecutar cada statement individualmente para mejor control
    let successCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Saltar statements de información y verificación
      if (statement.includes('SELECT') && statement.includes('descripcion')) {
        continue;
      }
      
      try {
        console.log(`⏳ Ejecutando statement ${i + 1}/${statements.length}...`);
        await tursoClient.execute(statement);
        successCount++;
      } catch (error) {
        console.error(`❌ Error en statement ${i + 1}:`, error.message);
        console.log('Statement que falló:', statement.substring(0, 200) + '...');
        // No detener, continuar con el siguiente
      }
    }
    
    console.log(`✅ Migración completada: ${successCount} statements ejecutados exitosamente`);
    
    // Verificación final
    console.log('🔍 Verificación final...');
    try {
      const result = await tursoClient.execute({
        sql: `SELECT 
          COUNT(*) as total_procesos,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as procesos_activos,
          COUNT(CASE WHEN tipo = 'estrategico' THEN 1 END) as estrategicos,
          COUNT(CASE WHEN tipo = 'operativo' THEN 1 END) as operativos,
          COUNT(CASE WHEN tipo = 'apoyo' THEN 1 END) as apoyo,
          COUNT(CASE WHEN responsable_id IS NOT NULL THEN 1 END) as con_responsable
        FROM procesos`
      });
      
      const stats = result.rows[0];
      console.log('📊 Estadísticas finales:');
      console.log(`   • Total procesos: ${stats.total_procesos}`);
      console.log(`   • Procesos activos: ${stats.procesos_activos}`);
      console.log(`   • Estratégicos: ${stats.estrategicos}`);
      console.log(`   • Operativos: ${stats.operativos}`);
      console.log(`   • De apoyo: ${stats.apoyo}`);
      console.log(`   • Con responsable: ${stats.con_responsable}`);
      
    } catch (error) {
      console.error('❌ Error en verificación final:', error.message);
    }
    
    // Verificar estructura de la nueva tabla
    try {
      const schemaResult = await tursoClient.execute({
        sql: "PRAGMA table_info(procesos)"
      });
      console.log(`📋 Nueva estructura tabla procesos: ${schemaResult.rows.length} columnas`);
      
      // Verificar que las columnas clave existan
      const columnNames = schemaResult.rows.map(row => row.name);
      const expectedColumns = ['tipo', 'categoria', 'nivel_critico', 'responsable_id', 'departamento_id'];
      
      for (const col of expectedColumns) {
        if (columnNames.includes(col)) {
          console.log(`   ✅ Columna ${col}: OK`);
        } else {
          console.log(`   ❌ Columna ${col}: FALTA`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error verificando estructura:', error.message);
    }
    
    console.log('🎉 Migración de procesos al sistema SGC completada');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Actualizar backend/routes/procesos.routes.js');
    console.log('2. Crear endpoints SGC para participantes, documentos y normas');
    console.log('3. Actualizar componentes frontend');
    console.log('4. Crear componentes ProcesoParticipantes, ProcesoDocumentos, ProcesoNormas');
    
  } catch (error) {
    console.error('💥 Error crítico en migración:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  migrateProcesosToSGC();
}

module.exports = { migrateProcesosToSGC };
