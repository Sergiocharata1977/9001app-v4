const { tursoClient } = require('./backend/lib/tursoClient.js');

async function migrarCapacitaciones() {
  try {
    console.log('🚀 Iniciando migración de capacitaciones al sistema SGC...\n');

    // PASO 1: Verificar estado actual
    console.log('📊 PASO 1: Verificando estado actual...');
    
    const estadoActual = await Promise.all([
      tursoClient.execute('SELECT COUNT(*) as total FROM capacitaciones'),
      tursoClient.execute('SELECT COUNT(*) as total FROM capacitacion_asistentes'),
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_participantes WHERE entidad_tipo = 'capacitacion'"),
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_documentos_relacionados WHERE entidad_tipo = 'capacitacion'"),
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_normas_relacionadas WHERE entidad_tipo = 'capacitacion'")
    ]);

    console.log('  - Capacitaciones:', estadoActual[0].rows[0].total);
    console.log('  - Asistentes actuales:', estadoActual[1].rows[0].total);
    console.log('  - Participantes SGC:', estadoActual[2].rows[0].total);
    console.log('  - Documentos SGC:', estadoActual[3].rows[0].total);
    console.log('  - Normas SGC:', estadoActual[4].rows[0].total);

    // PASO 2: Migrar asistentes existentes (si los hay)
    console.log('\n🔄 PASO 2: Migrando asistentes a participantes SGC...');
    
    const migracionAsistentes = await tursoClient.execute(`
      INSERT INTO sgc_participantes (
          id, organization_id, entidad_tipo, entidad_id, personal_id,
          rol, asistio, datos_adicionales, created_at, updated_at, is_active
      )
      SELECT 
          'PART_CAP_' || ca.id as id,
          ca.organization_id,
          'capacitacion' as entidad_tipo,
          ca.capacitacion_id as entidad_id,
          ca.empleado_id as personal_id,
          'participante' as rol,
          ca.asistencia as asistio,
          '{"migrado_desde":"capacitacion_asistentes"}' as datos_adicionales,
          ca.created_at,
          ca.updated_at,
          1 as is_active
      FROM capacitacion_asistentes ca
      WHERE NOT EXISTS (
          SELECT 1 FROM sgc_participantes sp 
          WHERE sp.entidad_tipo = 'capacitacion' 
          AND sp.entidad_id = ca.capacitacion_id 
          AND sp.personal_id = ca.empleado_id
      )
    `);
    
    console.log('  ✅ Asistentes migrados:', migracionAsistentes.rowsAffected || 0);

    // PASO 3: Crear datos de ejemplo para las capacitaciones existentes
    console.log('\n📚 PASO 3: Creando datos de ejemplo SGC...');
    
    // Obtener capacitaciones existentes
    const capacitaciones = await tursoClient.execute('SELECT id, nombre FROM capacitaciones');
    console.log('  - Capacitaciones encontradas:', capacitaciones.rows.length);

    // Para cada capacitación, crear ejemplos de participantes, documentos y normas
    for (const cap of capacitaciones.rows) {
      console.log(`\n  📖 Procesando: ${cap.nombre} (ID: ${cap.id})`);
      
      // Agregar instructor de ejemplo
      try {
        await tursoClient.execute({
          sql: `INSERT INTO sgc_participantes (
              id, organization_id, entidad_tipo, entidad_id, personal_id,
              rol, asistio, datos_adicionales, created_at, updated_at, is_active
          ) VALUES (?, 2, 'capacitacion', ?, 'INSTRUCTOR_001', 'instructor', 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)`,
          args: [
            `PART_CAP_INST_${cap.id}`,
            cap.id,
            JSON.stringify({
              nivel_competencia: 'experto',
              certificacion: 'ISO 9001:2015',
              horas_formacion: 40
            })
          ]
        });
        console.log('    ✅ Instructor agregado');
      } catch (e) {
        console.log('    ⚠️  Instructor ya existe o error:', e.message.substring(0, 50));
      }

      // Agregar documentos de ejemplo
      const tiposDocumentos = [
        { tipo: 'material', desc: 'Material de capacitación', obligatorio: 1 },
        { tipo: 'presentacion', desc: 'Presentación PowerPoint', obligatorio: 1 },
        { tipo: 'evaluacion', desc: 'Formato de evaluación', obligatorio: 1 },
        { tipo: 'certificado', desc: 'Certificado de participación', obligatorio: 0 }
      ];

      for (const doc of tiposDocumentos) {
        try {
          await tursoClient.execute({
            sql: `INSERT INTO sgc_documentos_relacionados (
                id, organization_id, entidad_tipo, entidad_id, documento_id,
                tipo_relacion, descripcion, es_obligatorio, created_at, updated_at, is_active
            ) VALUES (?, 2, 'capacitacion', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)`,
            args: [
              `DOC_CAP_${cap.id}_${doc.tipo}`,
              cap.id,
              `DOC${cap.id}_${doc.tipo}`,
              doc.tipo,
              doc.desc,
              doc.obligatorio
            ]
          });
          console.log(`    ✅ Documento ${doc.tipo} agregado`);
        } catch (e) {
          console.log(`    ⚠️  Documento ${doc.tipo} ya existe`);
        }
      }

      // Agregar competencias/normas de ejemplo
      const competencias = [
        { norma: 'ISO9001', punto: '7.2', desc: 'Competencia del personal', tipo: 'competencia' },
        { norma: 'ISO9001', punto: '7.3', desc: 'Toma de conciencia', tipo: 'conciencia' },
        { norma: 'ISO9001', punto: '9.1', desc: 'Seguimiento y medición', tipo: 'habilidad' }
      ];

      for (const comp of competencias) {
        try {
          await tursoClient.execute({
            sql: `INSERT INTO sgc_normas_relacionadas (
                id, organization_id, entidad_tipo, entidad_id, norma_id,
                punto_norma, clausula_descripcion, tipo_relacion, nivel_cumplimiento,
                observaciones, created_at, updated_at, is_active
            ) VALUES (?, 2, 'capacitacion', ?, ?, ?, ?, ?, 'desarrolla', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)`,
            args: [
              `NOR_CAP_${cap.id}_${comp.tipo}`,
              cap.id,
              comp.norma,
              comp.punto,
              comp.desc,
              comp.tipo,
              `Desarrolla ${comp.tipo} según ${comp.norma} ${comp.punto}`
            ]
          });
          console.log(`    ✅ Competencia ${comp.tipo} agregada`);
        } catch (e) {
          console.log(`    ⚠️  Competencia ${comp.tipo} ya existe`);
        }
      }
    }

    // PASO 4: Verificación final
    console.log('\n📊 PASO 4: Verificación final...');
    
    const estadoFinal = await Promise.all([
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_participantes WHERE entidad_tipo = 'capacitacion'"),
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_documentos_relacionados WHERE entidad_tipo = 'capacitacion'"),
      tursoClient.execute("SELECT COUNT(*) as total FROM sgc_normas_relacionadas WHERE entidad_tipo = 'capacitacion'")
    ]);

    console.log('  - Participantes SGC final:', estadoFinal[0].rows[0].total);
    console.log('  - Documentos SGC final:', estadoFinal[1].rows[0].total);
    console.log('  - Normas SGC final:', estadoFinal[2].rows[0].total);

    // Resumen por capacitación
    console.log('\n📋 Resumen por capacitación:');
    const resumen = await tursoClient.execute(`
      SELECT 
          c.id,
          c.nombre as capacitacion,
          COUNT(DISTINCT sp.id) as participantes,
          COUNT(DISTINCT sdr.id) as documentos,
          COUNT(DISTINCT snr.id) as competencias
      FROM capacitaciones c
      LEFT JOIN sgc_participantes sp ON c.id = sp.entidad_id AND sp.entidad_tipo = 'capacitacion' AND sp.is_active = 1
      LEFT JOIN sgc_documentos_relacionados sdr ON c.id = sdr.entidad_id AND sdr.entidad_tipo = 'capacitacion' AND sdr.is_active = 1
      LEFT JOIN sgc_normas_relacionadas snr ON c.id = snr.entidad_id AND snr.entidad_tipo = 'capacitacion' AND snr.is_active = 1
      GROUP BY c.id, c.nombre
      ORDER BY c.id
    `);

    resumen.rows.forEach(row => {
      console.log(`  - ${row.capacitacion}: ${row.participantes} participantes, ${row.documentos} documentos, ${row.competencias} competencias`);
    });

    console.log('\n🎉 ¡Migración de capacitaciones al sistema SGC completada exitosamente!');
    console.log('📝 Próximos pasos:');
    console.log('   1. Actualizar backend para usar rutas SGC');
    console.log('   2. Actualizar frontend para mostrar datos SGC');
    console.log('   3. Verificar funcionamiento completo');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('🔍 Stack:', error.stack);
  }
}

migrarCapacitaciones();
