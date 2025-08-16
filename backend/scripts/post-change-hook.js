#!/usr/bin/env node

const { updateDatabaseDocs } = require('./update-database-docs.js');

/**
 * Script que se ejecuta después de cambios importantes en la base de datos
 * Actualiza automáticamente la documentación
 */

console.log('🔄 Ejecutando post-change hook...');

async function postChangeHook() {
  try {
    console.log('📋 Actualizando documentación después de cambios...');
    
    // Actualizar documentación
    await updateDatabaseDocs();
    
    console.log('✅ Documentación actualizada exitosamente');
    console.log('📝 Archivos actualizados:');
    console.log('  - DATABASE-QUICK-REFERENCE.md');
    console.log('  - DATABASE-DOCUMENTATION.md (si es necesario)');
    
    console.log('\n🎯 Próximos pasos recomendados:');
    console.log('  1. Revisar DATABASE-QUICK-REFERENCE.md');
    console.log('  2. Si hay cambios estructurales importantes, ejecutar:');
    console.log('     node backend/scripts/generate-database-documentation.js');
    console.log('  3. Actualizar DATABASE-AGENTS-GUIDE.md si es necesario');
    
  } catch (error) {
    console.error('❌ Error en post-change hook:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  postChangeHook();
}

module.exports = { postChangeHook };
