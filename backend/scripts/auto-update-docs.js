#!/usr/bin/env node

const { updateDatabaseDocs } = require('./update-database-docs.js');

console.log('🤖 Actualización automática de documentación iniciada...');

// Ejecutar actualización
updateDatabaseDocs().then(() => {
  console.log('✅ Documentación actualizada automáticamente');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error en actualización automática:', error);
  process.exit(1);
});
