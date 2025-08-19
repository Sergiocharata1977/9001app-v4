const { tursoClient } = require('./lib/tursoClient.js');

async function testHallazgos() {
  console.log('🔍 Probando endpoint de hallazgos...');
  
  try {
    // 1. Verificar si existen las tablas SGC
    console.log('\n1. Verificando tablas SGC...');
    const tables = await tursoClient.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name LIKE 'sgc_%'
    `);
    console.log('✅ Tablas SGC encontradas:', tables.rows.map(r => r.name));
    
    // 2. Verificar tabla sgc_personal_relaciones
    console.log('\n2. Verificando sgc_personal_relaciones...');
    try {
      const personalRel = await tursoClient.execute(`
        SELECT COUNT(*) as total FROM sgc_personal_relaciones 
        WHERE entidad_tipo = 'hallazgo' AND is_active = 1
      `);
      console.log('✅ sgc_personal_relaciones OK:', personalRel.rows[0]);
    } catch (error) {
      console.log('❌ Error en sgc_personal_relaciones:', error.message);
    }
    
    // 3. Verificar tabla sgc_documentos_relacionados
    console.log('\n3. Verificando sgc_documentos_relacionados...');
    try {
      const docsRel = await tursoClient.execute(`
        SELECT COUNT(*) as total FROM sgc_documentos_relacionados 
        WHERE entidad_tipo = 'hallazgo' AND is_active = 1
      `);
      console.log('✅ sgc_documentos_relacionados OK:', docsRel.rows[0]);
    } catch (error) {
      console.log('❌ Error en sgc_documentos_relacionados:', error.message);
    }
    
    // 4. Verificar tabla sgc_normas_relacionadas
    console.log('\n4. Verificando sgc_normas_relacionadas...');
    try {
      const normasRel = await tursoClient.execute(`
        SELECT COUNT(*) as total FROM sgc_normas_relacionadas 
        WHERE entidad_tipo = 'hallazgo' AND is_active = 1
      `);
      console.log('✅ sgc_normas_relacionadas OK:', normasRel.rows[0]);
    } catch (error) {
      console.log('❌ Error en sgc_normas_relacionadas:', error.message);
    }
    
    // 5. Probar la consulta completa de hallazgos
    console.log('\n5. Probando consulta completa de hallazgos...');
    const hallazgos = await tursoClient.execute(`
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
    `);
    
    console.log('✅ Consulta completa OK:', hallazgos.rows.length, 'hallazgos encontrados');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
    console.log('Stack:', error.stack);
  }
}

testHallazgos().then(() => {
  console.log('\n✅ Prueba completada');
  process.exit(0);
}).catch(error => {
  console.log('❌ Error fatal:', error);
  process.exit(1);
});
