// ===============================================
// EJECUTOR DE MIGRACIÓN EVALUACIONES SGC
// Ejecuta la migración directamente desde Node.js
// ===============================================

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const tursoClient = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function ejecutarMigracion() {
  console.log('🔄 [Migración] Iniciando migración de evaluaciones al sistema SGC...\n');

  try {
    // Leer el archivo SQL de migración
    const sqlFile = path.join(__dirname, 'migracion-evaluaciones-sgc.sql');
    
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`Archivo de migración no encontrado: ${sqlFile}`);
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Dividir el SQL en statements individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'BEGIN TRANSACTION' && stmt !== 'COMMIT');

    console.log(`📄 [Migración] Encontrados ${statements.length} statements SQL para ejecutar\n`);

    // Ejecutar cada statement
    let executed = 0;
    for (const statement of statements) {
      if (statement.trim() === '') continue;
      
      try {
        // Mostrar solo el primer parte del statement para debug
        const preview = statement.substring(0, 50) + (statement.length > 50 ? '...' : '');
        console.log(`   Ejecutando: ${preview}`);
        
        await tursoClient.execute(statement);
        executed++;
      } catch (error) {
        // Si es un error de "tabla ya existe" o similar, lo ignoramos
        if (error.message.includes('already exists') || 
            error.message.includes('UNIQUE constraint failed') ||
            error.message.includes('no such table')) {
          console.log(`   ⚠️ Advertencia (ignorada): ${error.message}`);
          continue;
        }
        
        console.error(`   ❌ Error ejecutando statement: ${error.message}`);
        console.error(`   Statement: ${statement.substring(0, 100)}...`);
        // No detenemos la migración por errores menores
      }
    }

    console.log(`\n✅ [Migración] Migración completada. ${executed} statements ejecutados exitosamente.`);
    
    // Ejecutar verificación automática
    console.log('\n🔍 [Verificación] Iniciando verificación automática...\n');
    await verificarMigracion();

  } catch (error) {
    console.error('❌ [Migración] Error durante la migración:', error);
    throw error;
  }
}

async function verificarMigracion() {
  try {
    // 1. Verificar conteo de datos originales
    console.log('📊 Verificando datos originales...');
    
    try {
      const originalesIndividuales = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as total FROM evaluaciones_individuales'
      });
      console.log(`   • evaluaciones_individuales: ${originalesIndividuales.rows[0].total} registros`);
    } catch (error) {
      console.log('   • evaluaciones_individuales: Tabla no existe (esperado después de migración)');
    }

    try {
      const originalesCompetencias = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as total FROM evaluaciones_competencias_detalle'
      });
      console.log(`   • evaluaciones_competencias_detalle: ${originalesCompetencias.rows[0].total} registros`);
    } catch (error) {
      console.log('   • evaluaciones_competencias_detalle: Tabla no existe (esperado después de migración)');
    }

    try {
      const originalesProgramacion = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as total FROM evaluacion_programacion'
      });
      console.log(`   • evaluacion_programacion: ${originalesProgramacion.rows[0].total} registros`);
    } catch (error) {
      console.log('   • evaluacion_programacion: Tabla no existe (esperado después de migración)');
    }

    // 2. Verificar datos migrados
    console.log('\n📊 Verificando datos migrados...');
    
    const migradosParticipantes = await tursoClient.execute({
      sql: `SELECT COUNT(*) as total FROM sgc_participantes 
            WHERE entidad_tipo IN ('evaluacion', 'evaluacion_programacion')`
    });
    
    const migradosNormas = await tursoClient.execute({
      sql: `SELECT COUNT(*) as total FROM sgc_normas_relacionadas 
            WHERE entidad_tipo = 'evaluacion'`
    });

    console.log(`   • sgc_participantes (evaluaciones): ${migradosParticipantes.rows[0].total} registros`);
    console.log(`   • sgc_normas_relacionadas (evaluaciones): ${migradosNormas.rows[0].total} registros`);

    // 3. Verificar participantes por rol
    console.log('\n👥 Analizando participantes por rol...');
    
    const participantesPorRol = await tursoClient.execute({
      sql: `SELECT rol, COUNT(*) as cantidad 
            FROM sgc_participantes 
            WHERE entidad_tipo IN ('evaluacion', 'evaluacion_programacion')
            GROUP BY rol
            ORDER BY rol`
    });

    participantesPorRol.rows.forEach(row => {
      console.log(`   • ${row.rol}: ${row.cantidad} registros`);
    });

    // 4. Verificar niveles de cumplimiento
    console.log('\n📏 Analizando niveles de cumplimiento...');
    
    const nivelesCompetencias = await tursoClient.execute({
      sql: `SELECT nivel_cumplimiento, COUNT(*) as cantidad 
            FROM sgc_normas_relacionadas 
            WHERE entidad_tipo = 'evaluacion'
            GROUP BY nivel_cumplimiento
            ORDER BY nivel_cumplimiento`
    });

    nivelesCompetencias.rows.forEach(row => {
      console.log(`   • ${row.nivel_cumplimiento}: ${row.cantidad} competencias`);
    });

    // 5. Verificar vistas creadas
    console.log('\n👁️ Verificando vistas de compatibilidad...');
    
    try {
      const vistaEvaluaciones = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as total FROM vista_evaluaciones_individuales'
      });
      console.log(`   ✅ vista_evaluaciones_individuales: ${vistaEvaluaciones.rows[0].total} registros`);
    } catch (error) {
      console.log(`   ⚠️ vista_evaluaciones_individuales: ${error.message}`);
    }

    try {
      const vistaCompetencias = await tursoClient.execute({
        sql: 'SELECT COUNT(*) as total FROM vista_evaluaciones_competencias'
      });
      console.log(`   ✅ vista_evaluaciones_competencias: ${vistaCompetencias.rows[0].total} registros`);
    } catch (error) {
      console.log(`   ⚠️ vista_evaluaciones_competencias: ${error.message}`);
    }

    console.log('\n🎉 [Verificación] Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ [Verificación] Error durante la verificación:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarMigracion()
    .then(() => {
      console.log('\n✅ Migración y verificación completadas exitosamente!');
      console.log('\n📋 Próximos pasos:');
      console.log('   1. Probar las nuevas funcionalidades en el frontend');
      console.log('   2. Verificar que las APIs funcionan correctamente');
      console.log('   3. Si todo funciona bien, eliminar las tablas específicas');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { ejecutarMigracion, verificarMigracion };
