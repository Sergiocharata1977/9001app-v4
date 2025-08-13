const { createClient } = require('@libsql/client');
const { loadEnvConfig } = require('../config/env-setup.js');

// Cargar configuración de entorno
loadEnvConfig();

// Verificar credenciales
if (!process.env.DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Error: Faltan credenciales de Turso');
  console.log('📝 Crea un archivo .env con:');
  console.log('   DATABASE_URL=libsql://tu-base-desarrollo.turso.io');
  console.log('   TURSO_AUTH_TOKEN=tu-token-aqui');
  process.exit(1);
}

// Crear el cliente de Turso
const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Función wrapper para ejecutar consultas con validación
const executeQuery = async (queryObj) => {
  try {
    const { sql, args = [] } = queryObj;
    
    // Validar que sql no sea undefined o null
    if (!sql || typeof sql !== 'string') {
      throw new Error('SQL query is required and must be a string');
    }
    
    // Validar que args sea un array
    if (!Array.isArray(args)) {
      args = [];
    }
    
    console.log('🔍 Ejecutando query:', sql.substring(0, 50) + '...');
    
    const result = await tursoClient.execute({
      sql: sql,
      args: args
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error ejecutando query:', error);
    throw error;
  }
};

console.log('🌐 Conectado a Turso:', process.env.DATABASE_URL);
console.log('🔧 Entorno:', process.env.NODE_ENV || 'development');

module.exports = { tursoClient, executeQuery };
