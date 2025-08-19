const { tursoClient } = require('../lib/tursoClient.js');

async function diagnoseHallazgos() {
  console.log('🔍 DIAGNÓSTICO DE HALLAZGOS - AGENTE 1');
  console.log('=====================================');

  try {
    // 1. Verificar conexión a la base de datos
    console.log('\n1️⃣ Verificando conexión a Turso...');
    const connectionTest = await tursoClient.execute('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', connectionTest.rows[0]);

    // 2. Verificar si existe la tabla hallazgos
    console.log('\n2️⃣ Verificando tabla hallazgos...');
    const tables = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='hallazgos'
    `);
    
    if (tables.rows.length === 0) {
      console.log('❌ ERROR: La tabla "hallazgos" no existe');
      return;
    }
    console.log('✅ Tabla hallazgos existe');

    // 3. Verificar estructura de la tabla
    console.log('\n3️⃣ Verificando estructura de la tabla...');
    const structure = await tursoClient.execute('PRAGMA table_info(hallazgos)');
    console.log('📋 Columnas de hallazgos:');
    structure.rows.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`);
    });

    // 4. Verificar si hay datos
    console.log('\n4️⃣ Verificando datos en la tabla...');
    const count = await tursoClient.execute('SELECT COUNT(*) as total FROM hallazgos');
    console.log('📊 Total de hallazgos:', count.rows[0].total);

    // 5. Probar la consulta que está fallando
    console.log('\n5️⃣ Probando consulta problemática...');
    try {
      const testQuery = await tursoClient.execute(`
        SELECT 
          h.*,
          COALESCE(participantes.total, 0) as total_participantes,
          COALESCE(participantes.responsables, 0) as total_responsables,
          COALESCE(participantes.auditores, 0) as total_auditores,
          COALESCE(documentos.total, 0) as total_documentos,
          COALESCE(documentos.evidencias, 0) as total_evidencias,
          COALESCE(normas.total, 0) as total_normas,
          (resp.nombres || ' ' || resp.apellidos) as responsable_nombre,
          (aud.nombres || ' ' || aud.apellidos) as auditor_nombre
        FROM hallazgos h
        LEFT JOIN (
          SELECT 
            entidad_id, 
            COUNT(*) as total,
            COUNT(CASE WHEN rol = 'responsable' THEN 1 END) as responsables,
            COUNT(CASE WHEN rol = 'auditor' THEN 1 END) as auditores
          FROM sgc_personal_relaciones 
          WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
          GROUP BY entidad_id
        ) participantes ON h.id = participantes.entidad_id
        LEFT JOIN (
          SELECT 
            entidad_id, 
            COUNT(*) as total,
            COUNT(CASE WHEN tipo_relacion = 'evidencia' THEN 1 END) as evidencias
          FROM sgc_documentos_relacionados 
          WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
          GROUP BY entidad_id
        ) documentos ON h.id = documentos.entidad_id
        LEFT JOIN (
          SELECT entidad_id, COUNT(*) as total 
          FROM sgc_normas_relacionadas 
          WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
          GROUP BY entidad_id
        ) normas ON h.id = normas.entidad_id
        LEFT JOIN personal resp ON h.responsable_id = resp.id
        LEFT JOIN personal aud ON h.auditor_id = aud.id
        WHERE h.is_active = 1
        ORDER BY h.created_at DESC
        LIMIT 5
      `);
      console.log('✅ Consulta compleja exitosa');
      console.log('📊 Resultados:', testQuery.rows.length);
    } catch (error) {
      console.log('❌ ERROR en consulta compleja:', error.message);
      
      // 6. Verificar tablas relacionadas
      console.log('\n6️⃣ Verificando tablas relacionadas...');
      const relatedTables = await tursoClient.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN (
          'sgc_personal_relaciones',
          'sgc_documentos_relacionados', 
          'sgc_normas_relacionadas',
          'personal'
        )
      `);
      
      console.log('📋 Tablas relacionadas encontradas:');
      relatedTables.rows.forEach(table => {
        console.log(`   - ${table.name}`);
      });
    }

    // 7. Verificar variables de entorno
    console.log('\n7️⃣ Verificando configuración...');
    console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ No configurado');
    console.log('🔑 TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✅ Configurado' : '❌ No configurado');
    console.log('🏷️ NODE_ENV:', process.env.NODE_ENV || 'development');

  } catch (error) {
    console.error('❌ ERROR GENERAL:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Ejecutar diagnóstico
diagnoseHallazgos()
  .then(() => {
    console.log('\n🏁 Diagnóstico completado');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
