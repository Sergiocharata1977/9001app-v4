import { createClient } from '@libsql/client';
import { loadEnvConfig } from '../config/env-setup.js';

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
export const tursoClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

console.log('🌐 Conectado a Turso:', process.env.DATABASE_URL);
console.log('🔧 Entorno:', process.env.NODE_ENV || 'development');
