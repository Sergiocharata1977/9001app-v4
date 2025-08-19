const fs = require('fs');
const path = require('path');

// Archivos a verificar
const archivosVerificar = [
  // Backend
  'backend/routes/procesos.routes.js',
  'backend/routes/minutas.routes.js',
  'backend/routes/hallazgos.routes.js',
  'backend/controllers/evaluacionesSgcController.js',
  'backend/scripts/verificar-tablas-sgc-estandarizado.js',
  'backend/scripts/update-database-docs.js',
  'backend/scripts/alter-procesos-sgc.js',
  
  // Frontend
  'frontend/src/services/minutasService.js',
  'frontend/src/services/evaluacionesSgcService.js',
  'frontend/src/components/procesos/ProcesoParticipantes.jsx',
  'frontend/src/components/minutas/MinutaParticipantes.jsx',
  'frontend/src/components/hallazgos/HallazgoParticipantes.jsx',
  'frontend/src/lib/schema.js',
  
  // SQL
  'migracion-hallazgos-sgc.sql',
  'migracion-hallazgos-sgc-corregida.sql',
  'migracion-evaluaciones-sgc.sql',
  'migracion-estandarizacion-sgc.sql',
  'migracion-capacitaciones-sgc.sql',
  'completar-sistema-sgc-procesos.sql',
  'renombrar-sgc-participantes.sql',
  
  // Documentación
  'SGC-SISTEMA-ESTANDARIZADO-RESUMEN.md',
  'DATABASE-AGENTS-GUIDE.md',
  'SGC-MIGRACIONES-ESTADO.md'
];

async function verificarActualizaciones() {
  console.log('🔍 Verificando actualizaciones de sgc_participantes → sgc_personal_relaciones...\n');
  
  let archivosConReferencias = [];
  let archivosActualizados = [];
  let archivosSinCambios = [];
  let archivosNoEncontrados = [];
  
  for (const archivo of archivosVerificar) {
    try {
      if (fs.existsSync(archivo)) {
        const contenido = fs.readFileSync(archivo, 'utf8');
        
        // Buscar referencias antiguas
        const tieneReferenciasAntiguas = contenido.includes('sgc_participantes') || 
                                        contenido.includes('v_sgc_participantes_completos');
        
        // Buscar referencias nuevas
        const tieneReferenciasNuevas = contenido.includes('sgc_personal_relaciones') || 
                                      contenido.includes('v_sgc_personal_relaciones_completos');
        
        if (tieneReferenciasAntiguas) {
          archivosConReferencias.push(archivo);
        } else if (tieneReferenciasNuevas) {
          archivosActualizados.push(archivo);
        } else {
          archivosSinCambios.push(archivo);
        }
      } else {
        archivosNoEncontrados.push(archivo);
      }
    } catch (error) {
      console.log(`❌ Error verificando ${archivo}: ${error.message}`);
    }
  }
  
  // Mostrar resultados
  console.log('📊 RESULTADOS DE LA VERIFICACIÓN:\n');
  
  if (archivosConReferencias.length > 0) {
    console.log('⚠️  ARCHIVOS CON REFERENCIAS ANTIGUAS (requieren actualización):');
    archivosConReferencias.forEach(archivo => {
      console.log(`   ❌ ${archivo}`);
    });
    console.log('');
  }
  
  if (archivosActualizados.length > 0) {
    console.log('✅ ARCHIVOS ACTUALIZADOS CORRECTAMENTE:');
    archivosActualizados.forEach(archivo => {
      console.log(`   ✅ ${archivo}`);
    });
    console.log('');
  }
  
  if (archivosSinCambios.length > 0) {
    console.log('⏭️  ARCHIVOS SIN CAMBIOS (no tenían referencias):');
    archivosSinCambios.forEach(archivo => {
      console.log(`   ⏭️  ${archivo}`);
    });
    console.log('');
  }
  
  if (archivosNoEncontrados.length > 0) {
    console.log('❌ ARCHIVOS NO ENCONTRADOS:');
    archivosNoEncontrados.forEach(archivo => {
      console.log(`   ❌ ${archivo}`);
    });
    console.log('');
  }
  
  // Resumen
  console.log('📋 RESUMEN:');
  console.log(`   Total archivos verificados: ${archivosVerificar.length}`);
  console.log(`   Archivos actualizados: ${archivosActualizados.length}`);
  console.log(`   Archivos con referencias antiguas: ${archivosConReferencias.length}`);
  console.log(`   Archivos sin cambios: ${archivosSinCambios.length}`);
  console.log(`   Archivos no encontrados: ${archivosNoEncontrados.length}`);
  
  if (archivosConReferencias.length === 0) {
    console.log('\n🎉 ¡TODAS LAS ACTUALIZACIONES COMPLETADAS EXITOSAMENTE!');
  } else {
    console.log('\n⚠️  HAY ARCHIVOS QUE REQUIEREN ACTUALIZACIÓN MANUAL');
  }
}

verificarActualizaciones();
