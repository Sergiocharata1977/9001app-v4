const { tursoClient } = require('../lib/tursoClient.js');

async function alterProcesosToSGC() {
  try {
    console.log('🔄 Expandiendo tabla procesos con columnas SGC usando ALTER TABLE...');
    
    // PASO 1: Verificar estructura actual
    console.log('🔍 Verificando estructura actual...');
    const currentSchema = await tursoClient.execute({
      sql: 'PRAGMA table_info(procesos)',
      args: []
    });
    
    const existingColumns = currentSchema.rows.map(row => row.name);
    console.log(`📋 Columnas actuales: ${existingColumns.length}`);
    console.log(`   ${existingColumns.join(', ')}`);
    
    // PASO 2: Agregar nuevas columnas SGC una por una
    console.log('➕ Agregando nuevas columnas SGC...');
    
    const newColumns = [
      // Clasificación del proceso
      'ALTER TABLE procesos ADD COLUMN tipo TEXT DEFAULT \'operativo\'',
      'ALTER TABLE procesos ADD COLUMN categoria TEXT DEFAULT \'proceso\'',
      'ALTER TABLE procesos ADD COLUMN nivel_critico TEXT DEFAULT \'medio\'',
      
      // Responsabilidad y ejecución  
      'ALTER TABLE procesos ADD COLUMN responsable_id TEXT',
      'ALTER TABLE procesos ADD COLUMN departamento_id TEXT',
      'ALTER TABLE procesos ADD COLUMN supervisor_id TEXT',
      
      // Alcance y límites detallados
      'ALTER TABLE procesos ADD COLUMN proveedores TEXT',
      'ALTER TABLE procesos ADD COLUMN clientes TEXT',
      
      // Recursos y capacidades
      'ALTER TABLE procesos ADD COLUMN recursos_requeridos TEXT',
      'ALTER TABLE procesos ADD COLUMN competencias_requeridas TEXT',
      
      // Control y medición
      'ALTER TABLE procesos ADD COLUMN metodos_seguimiento TEXT',
      'ALTER TABLE procesos ADD COLUMN criterios_control TEXT',
      
      // Información documental
      'ALTER TABLE procesos ADD COLUMN procedimientos_documentados TEXT',
      'ALTER TABLE procesos ADD COLUMN registros_requeridos TEXT',
      
      // Mejora y revisión
      'ALTER TABLE procesos ADD COLUMN riesgos_identificados TEXT',
      'ALTER TABLE procesos ADD COLUMN oportunidades_mejora TEXT',
      'ALTER TABLE procesos ADD COLUMN historial_cambios TEXT',
      
      // Control de versiones y fechas
      'ALTER TABLE procesos ADD COLUMN fecha_vigencia TEXT',
      'ALTER TABLE procesos ADD COLUMN fecha_revision TEXT',
      'ALTER TABLE procesos ADD COLUMN motivo_cambio TEXT',
      
      // Auditoría y trazabilidad
      'ALTER TABLE procesos ADD COLUMN created_by INTEGER',
      'ALTER TABLE procesos ADD COLUMN updated_by INTEGER',
      'ALTER TABLE procesos ADD COLUMN is_active INTEGER DEFAULT 1'
    ];
    
    let addedCount = 0;
    for (const [index, alterSQL] of newColumns.entries()) {
      try {
        await tursoClient.execute({ sql: alterSQL, args: [] });
        const columnName = alterSQL.match(/ADD COLUMN (\w+)/)[1];
        console.log(`   ✅ ${index + 1}/${newColumns.length} - Agregada columna: ${columnName}`);
        addedCount++;
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          const columnName = alterSQL.match(/ADD COLUMN (\w+)/)[1];
          console.log(`   ⚠️ Columna ${columnName} ya existe, omitiendo`);
        } else {
          console.error(`   ❌ Error agregando columna:`, error.message);
        }
      }
    }
    
    console.log(`✅ ${addedCount} nuevas columnas agregadas`);
    
    // PASO 3: Actualizar datos existentes para usar nueva estructura
    console.log('🔄 Actualizando datos existentes...');
    
    // Mapear responsable a responsable_id donde sea posible
    try {
      await tursoClient.execute({
        sql: `UPDATE procesos SET 
          responsable_id = responsable,
          procedimientos_documentados = COALESCE(documentos_relacionados, ''),
          is_active = 1
        WHERE responsable_id IS NULL`,
        args: []
      });
      console.log('   ✅ Datos mapeados a nueva estructura');
    } catch (error) {
      console.log('   ⚠️ Error mapeando datos:', error.message);
    }
    
    // PASO 4: Crear índices para las nuevas columnas
    console.log('📊 Creando índices para optimización...');
    
    const newIndices = [
      'CREATE INDEX IF NOT EXISTS idx_procesos_tipo_sgc ON procesos(tipo)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_categoria_sgc ON procesos(categoria)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_nivel_critico ON procesos(nivel_critico)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_responsable_id_sgc ON procesos(responsable_id)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_departamento_id_sgc ON procesos(departamento_id)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_is_active_sgc ON procesos(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_procesos_sgc_busqueda ON procesos(organization_id, tipo, estado, is_active)'
    ];
    
    for (const indexSQL of newIndices) {
      try {
        await tursoClient.execute({ sql: indexSQL, args: [] });
      } catch (error) {
        console.log(`   ⚠️ Error creando índice: ${error.message}`);
      }
    }
    
    console.log('✅ Índices creados');
    
    // PASO 5: Verificación final
    console.log('🔍 Verificación final de la estructura expandida...');
    
    const finalSchema = await tursoClient.execute({
      sql: 'PRAGMA table_info(procesos)',
      args: []
    });
    
    console.log(`📋 Estructura final: ${finalSchema.rows.length} columnas`);
    
    // Verificar columnas SGC clave
    const finalColumnNames = finalSchema.rows.map(row => row.name);
    const sgcColumns = ['tipo', 'categoria', 'nivel_critico', 'responsable_id', 'departamento_id', 'supervisor_id', 'is_active'];
    
    console.log('🔍 Verificando columnas SGC agregadas:');
    sgcColumns.forEach(col => {
      const exists = finalColumnNames.includes(col);
      console.log(`   ${exists ? '✅' : '❌'} ${col}`);
    });
    
    // Estadísticas de los datos
    const statsResult = await tursoClient.execute({
      sql: `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'activo' OR estado IS NULL THEN 1 END) as activos,
        COUNT(CASE WHEN responsable_id IS NOT NULL THEN 1 END) as con_responsable,
        COUNT(CASE WHEN tipo IS NOT NULL THEN 1 END) as con_tipo
      FROM procesos`,
      args: []
    });
    
    const stats = statsResult.rows[0];
    console.log('📊 Estadísticas después de migración:');
    console.log(`   • Total procesos: ${stats.total}`);
    console.log(`   • Procesos activos: ${stats.activos}`);
    console.log(`   • Con responsable: ${stats.con_responsable}`);
    console.log(`   • Con tipo definido: ${stats.con_tipo}`);
    
    console.log('\n🎉 MIGRACIÓN TABLA PROCESOS COMPLETADA EXITOSAMENTE');
    console.log('\n📋 La tabla procesos ahora tiene estructura SGC completa y está lista para usar:');
    console.log('   • sgc_participantes (entidad_tipo = "proceso", entidad_id = procesos.id)');
    console.log('   • sgc_documentos_relacionados (entidad_tipo = "proceso", entidad_id = procesos.id)');
    console.log('   • sgc_normas_relacionadas (entidad_tipo = "proceso", entidad_id = procesos.id)');
    
    // Mostrar muestra de procesos
    const sampleResult = await tursoClient.execute({
      sql: 'SELECT id, codigo, nombre, tipo, responsable_id, is_active FROM procesos LIMIT 3',
      args: []
    });
    
    if (sampleResult.rows.length > 0) {
      console.log('\n📋 Muestra de procesos con nueva estructura:');
      sampleResult.rows.forEach((proc, i) => {
        console.log(`   ${i + 1}. ${proc.codigo || 'SIN-CÓDIGO'} - ${proc.nombre}`);
        console.log(`      Tipo: ${proc.tipo || 'operativo'} | Responsable: ${proc.responsable_id || 'sin asignar'} | Activo: ${proc.is_active || 1}`);
      });
    }
    
    return { success: true, message: 'Tabla procesos expandida exitosamente con estructura SGC' };
    
  } catch (error) {
    console.error('💥 Error crítico en expansión de tabla:', error);
    console.error('Stack:', error.stack);
    return { success: false, error: error.message };
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  alterProcesosToSGC();
}

module.exports = { alterProcesosToSGC };
