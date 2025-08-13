const { executeQuery } = require('../lib/tursoClient.js');

async function checkUsersTable() {
  console.log('🔍 Verificando estructura de la tabla usuarios...');
  
  try {
    // Verificar si la tabla existe
    const tableExists = await executeQuery({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'"
    });
    
    if (tableExists.rows.length === 0) {
      console.log('❌ La tabla usuarios no existe');
      return;
    }
    
    console.log('✅ La tabla usuarios existe');
    
    // Obtener estructura de la tabla
    const structure = await executeQuery({
      sql: "PRAGMA table_info(usuarios)"
    });
    
    console.log('\n📋 Estructura de la tabla usuarios:');
    structure.rows.forEach((column, index) => {
      console.log(`${index + 1}. ${column.name} (${column.type}) ${column.notnull ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Obtener algunos registros de ejemplo
    const sampleData = await executeQuery({
      sql: "SELECT * FROM usuarios LIMIT 3"
    });
    
    console.log('\n📊 Datos de ejemplo:');
    if (sampleData.rows.length > 0) {
      sampleData.rows.forEach((row, index) => {
        console.log(`\nRegistro ${index + 1}:`);
        Object.keys(row).forEach(key => {
          console.log(`  ${key}: ${row[key]}`);
        });
      });
    } else {
      console.log('No hay datos en la tabla usuarios');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsersTable();
