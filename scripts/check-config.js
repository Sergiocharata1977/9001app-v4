#!/usr/bin/env node

/**
 * Script para verificar configuración antes del despliegue
 * Verifica que las variables de entorno estén correctamente configuradas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del proyecto...\n');

// Verificar archivos de configuración
const configFiles = [
  'frontend/.env.production',
  'frontend/env-config.js',
  'backend/.env',
  'backend/config/env-setup.js'
];

let hasErrors = false;

configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Existe`);
    
    // Verificar contenido específico
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.includes('frontend') && file.includes('env')) {
      if (content.includes('localhost:5000')) {
        console.log(`⚠️  ${file} - Contiene localhost, verificar configuración de producción`);
        hasErrors = true;
      }
      if (content.includes('31.97.162.229')) {
        console.log(`✅ ${file} - Configuración de producción detectada`);
      }
    }
  } else {
    console.log(`❌ ${file} - No existe`);
    hasErrors = true;
  }
});

// Verificar configuración de API
console.log('\n🌐 Verificando configuración de API...');

const apiConfigPath = path.join(process.cwd(), 'frontend/src/services/api/index.js');
if (fs.existsSync(apiConfigPath)) {
  const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
  
  if (apiConfig.includes('localhost:5000')) {
    console.log('⚠️  API configurada para localhost - Verificar variables de entorno');
  } else {
    console.log('✅ API configurada correctamente');
  }
}

// Verificar rutas
console.log('\n🛣️ Verificando configuración de rutas...');

const routesPath = path.join(process.cwd(), 'frontend/src/routes/AppRoutes.jsx');
if (fs.existsSync(routesPath)) {
  const routes = fs.readFileSync(routesPath, 'utf8');
  
  if (routes.includes('/login')) {
    console.log('✅ Ruta /login configurada');
  } else {
    console.log('❌ Ruta /login no encontrada');
    hasErrors = true;
  }
  
  if (routes.includes('/app/')) {
    console.log('✅ Rutas protegidas configuradas');
  } else {
    console.log('❌ Rutas protegidas no encontradas');
    hasErrors = true;
  }
}

// Resumen
console.log('\n📊 RESUMEN:');
if (hasErrors) {
  console.log('❌ Se encontraron problemas de configuración');
  console.log('💡 Soluciones:');
  console.log('   1. Crear archivo frontend/.env.production con VITE_API_URL=http://31.97.162.229:5000/api');
  console.log('   2. Verificar que el build use las variables de entorno correctas');
  console.log('   3. Ejecutar npm run build con NODE_ENV=production');
  process.exit(1);
} else {
  console.log('✅ Configuración correcta');
  console.log('🚀 Listo para despliegue');
}
