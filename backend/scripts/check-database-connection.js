const { createClient } = require('@libsql/client');

// Configuración directa de Turso
const tursoClient = createClient({
  url: 'libsql://iso-flow-respo-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTIwMDc3MDcsImlkIjoiNGM4NWQwY2UtNTE2OS00NTI4LTgyMmUtYzc5YTMzOTYxMDM3IiwicmlkIjoiZjM0NjI0YWItNzZhYy00N2FiLTkxY2QtYWU4NDk5ZDY5MzczIn0.b2puA6ushwN3ovDQNO4fFvrK3gcU08y59rKgUSPv7KfFNEafGfapWMd5BC2rvbI2QzXCbAcRD66UKLVH4TouBA'
});

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Listar todas las tablas
    const tablesResult = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      args: []
    });
    
    console.log('\n📋 Tablas encontradas:');
    tablesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.name}`);
    });
    
    // Verificar si existe organization_feature
    const orgFeatureExists = tablesResult.rows.some(row => row.name === 'organization_feature');
    console.log(`\n🔍 Tabla 'organization_feature' existe: ${orgFeatureExists ? '✅ SÍ' : '❌ NO'}`);
    
    // Verificar si existe user_feature_permissions
    const userPermsExists = tablesResult.rows.some(row => row.name === 'user_feature_permissions');
    console.log(`🔍 Tabla 'user_feature_permissions' existe: ${userPermsExists ? '✅ SÍ' : '❌ NO'}`);
    
    // Si existe organization_feature, mostrar algunos datos
    if (orgFeatureExists) {
      const orgFeatureData = await tursoClient.execute({
        sql: "SELECT * FROM organization_feature LIMIT 5",
        args: []
      });
      
      console.log('\n📊 Datos de organization_feature (primeros 5 registros):');
      orgFeatureData.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ID: ${row.id}, Org: ${row.organization_id}, Feature: ${row.feature_name}, Enabled: ${row.is_enabled}`);
      });
    }
    
    // Verificar organizaciones
    const orgsResult = await tursoClient.execute({
      sql: "SELECT id, name FROM organizations LIMIT 5",
      args: []
    });
    
    console.log('\n🏢 Organizaciones (primeras 5):');
    orgsResult.rows.forEach((org, index) => {
      console.log(`  ${index + 1}. ID: ${org.id}, Nombre: ${org.name}`);
    });
    
    // Verificar usuarios
    const usersResult = await tursoClient.execute({
      sql: "SELECT id, name, email, role, organization_id FROM usuarios LIMIT 5",
      args: []
    });
    
    console.log('\n👥 Usuarios (primeros 5):');
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}, Org: ${user.organization_id}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  }
}

checkDatabaseConnection();
