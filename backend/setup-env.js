#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fileURLToPath  } = require('url');




console.log('🔧 Configurando archivo .env...');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

// Verificar si ya existe .env
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env ya existe');
  process.exit(0);
}

// Leer el archivo de ejemplo
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ No se encuentra env.example');
  process.exit(1);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Configuración por defecto para desarrollo
const defaultConfig = {
  'DATABASE_URL': 'libsql://isoflow-sergiocharata1977.turso.io',
  'TURSO_AUTH_TOKEN': 'TU_AUTH_TOKEN_AQUI',
  'JWT_SECRET': 'tu-super-secure-jwt-secret-para-desarrollo',
  'JWT_EXPIRES_IN': '24h',
  'PORT': '5000',
  'NODE_ENV': 'development',
  'CORS_ORIGIN': 'http://localhost:3000',
  'ALLOWED_ORIGINS': 'http://localhost:3000',
  'RATE_LIMIT_WINDOW_MS': '900000',
  'RATE_LIMIT_MAX_REQUESTS': '100',
  'SUPER_ADMIN_EMAIL': 'admin@isoflow.com',
  'SUPER_ADMIN_PASSWORD': 'admin123',
  'HELMET_ENABLED': 'true',
  'CSP_ENABLED': 'true',
  'HSTS_ENABLED': 'true',
  'LOG_LEVEL': 'info',
  'ENABLE_LOGGING': 'true'
};

// Reemplazar valores en el archivo de ejemplo
let envContent = envExample;
Object.entries(defaultConfig).forEach(([key, value]) => {
  const regex = new RegExp(`${key}=.*`, 'g');
  envContent = envContent.replace(regex, `${key}=${value}`);
});

// Escribir el archivo .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Archivo .env creado exitosamente');
console.log('⚠️  IMPORTANTE: Configura TURSO_AUTH_TOKEN con tu token real');
console.log('📝 Archivo creado en:', envPath); 