const { tursoClient } = require('../lib/tursoClient.js');

async function checkDatabaseTables() {
  try {
    console.log('🔍 Verificando tablas en la base de datos...');
    
    // Obtener todas las tablas
    const tablesResult = await tursoClient.execute({
      sql: `
        SELECT name FROM sqlite_master 
        WHERE type='table' 
        ORDER BY name
      `
    });
    
    console.log('📋 Tablas encontradas:');
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}`);
    });
    
    // Verificar si existe la tabla organizations
    const orgTableExists = tablesResult.rows.some(row => 
      row.name.toLowerCase() === 'organizations' || 
      row.name.toLowerCase() === 'organization'
    );
    
    console.log(`\n🏢 Tabla 'organizations' existe: ${orgTableExists ? '✅ SÍ' : '❌ NO'}`);
    
    if (orgTableExists) {
      // Verificar estructura de la tabla organizations
      const orgStructure = await tursoClient.execute({
        sql: `
          PRAGMA table_info(organizations)
        `
      });
      
      console.log('\n📊 Estructura de la tabla organizations:');
      orgStructure.rows.forEach(row => {
        console.log(`  - ${row.name} (${row.type})`);
      });
      
      // Contar registros
      const orgCount = await tursoClient.execute({
        sql: `SELECT COUNT(*) as count FROM organizations`
      });
      
      console.log(`\n📈 Total de organizaciones: ${orgCount.rows[0].count}`);
    }
    
    // Verificar tabla usuarios
    const userTableExists = tablesResult.rows.some(row => 
      row.name.toLowerCase() === 'usuarios' || 
      row.name.toLowerCase() === 'users'
    );
    
    console.log(`\n👥 Tabla 'usuarios' existe: ${userTableExists ? '✅ SÍ' : '❌ NO'}`);
    
    if (userTableExists) {
      const userCount = await tursoClient.execute({
        sql: `SELECT COUNT(*) as count FROM usuarios`
      });
      
      console.log(`📈 Total de usuarios: ${userCount.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabaseTables();
