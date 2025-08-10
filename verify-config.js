#!/usr/bin/env node

/**
 * Script de verificación de configuración
 * Verifica que las URLs de la API estén configuradas correctamente
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
};

// Función para verificar si una URL responde
function checkUrl(url, description) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = protocol.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        log.success(`${description}: ${url} (Status: ${res.statusCode})`);
        resolve(true);
      } else {
        log.warning(`${description}: ${url} (Status: ${res.statusCode})`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      log.error(`${description}: ${url} (Error: ${err.message})`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      log.error(`${description}: ${url} (Timeout)`);
      resolve(false);
    });

    req.end();
  });
}

// Función para verificar archivos
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    return true;
  } else {
    log.error(`${description}: ${filePath} (No encontrado)`);
    return false;
  }
}

// Función para leer y verificar contenido de archivo
function checkFileContent(filePath, searchPattern, description) {
  if (!fs.existsSync(filePath)) {
    log.error(`${description}: Archivo no encontrado`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchPattern)) {
    log.success(`${description}: Patrón encontrado`);
    return true;
  } else {
    log.warning(`${description}: Patrón no encontrado`);
    return false;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}VERIFICACIÓN DE CONFIGURACIÓN - ISO 9001 APP${colors.reset}`);
  console.log('='.repeat(60));

  let errors = 0;
  let warnings = 0;

  // Detectar entorno
  log.header('1. DETECCIÓN DE ENTORNO');
  const isProduction = process.env.NODE_ENV === 'production' || 
                      fs.existsSync('/var/www/9001app2') ||
                      process.cwd().includes('/root');
  
  const environment = isProduction ? 'PRODUCCIÓN' : 'DESARROLLO';
  log.info(`Entorno detectado: ${colors.bright}${environment}${colors.reset}`);
  log.info(`Directorio actual: ${process.cwd()}`);

  // Verificar archivos de configuración
  log.header('2. ARCHIVOS DE CONFIGURACIÓN');
  
  if (isProduction) {
    // Verificaciones para producción
    const prodFiles = [
      { path: '/var/www/9001app2/dist/runtime-config.js', desc: 'Config dinámica' },
      { path: '/var/www/9001app2/dist/runtime-config.override.js', desc: 'Config override' },
      { path: '/var/www/9001app2/dist/index.html', desc: 'HTML principal' },
      { path: '/root/9001app2/backend/.env', desc: 'Backend .env' }
    ];

    prodFiles.forEach(file => {
      if (!checkFile(file.path, file.desc)) {
        if (file.path.includes('override')) {
          warnings++;
        } else {
          errors++;
        }
      }
    });

    // Verificar contenido de configuración override
    const overridePath = '/var/www/9001app2/dist/runtime-config.override.js';
    if (fs.existsSync(overridePath)) {
      const content = fs.readFileSync(overridePath, 'utf8');
      if (content.includes('31.97.162.229:5000')) {
        log.success('Config override: URL del servidor configurada correctamente');
      } else if (content.includes('localhost:5000')) {
        log.error('Config override: Usando localhost (debe ser 31.97.162.229:5000)');
        errors++;
      }
    }
  } else {
    // Verificaciones para desarrollo
    const devFiles = [
      { path: './frontend/public/runtime-config.js', desc: 'Config dinámica' },
      { path: './frontend/public/index.html', desc: 'HTML principal' },
      { path: './frontend/src/services/api/index.js', desc: 'API service' },
      { path: './frontend/env-config.js', desc: 'Env config' }
    ];

    devFiles.forEach(file => {
      if (!checkFile(file.path, file.desc)) {
        errors++;
      }
    });
  }

  // Verificar servicios
  log.header('3. VERIFICACIÓN DE SERVICIOS');
  
  if (isProduction) {
    // Verificar servicios en producción
    await checkUrl('http://31.97.162.229:5000/api/health', 'Backend API');
    await checkUrl('http://31.97.162.229/', 'Frontend Nginx');
    await checkUrl('http://31.97.162.229:5000/api/auth/login', 'Endpoint Login');
    
    // Verificar PM2
    try {
      const pm2Status = execSync('pm2 list', { encoding: 'utf8' });
      if (pm2Status.includes('9001app2-backend') && pm2Status.includes('online')) {
        log.success('PM2: Backend ejecutándose');
      } else {
        log.error('PM2: Backend no está online');
        errors++;
      }
    } catch (err) {
      log.warning('PM2: No se pudo verificar el estado');
      warnings++;
    }

    // Verificar Nginx
    try {
      execSync('nginx -t', { encoding: 'utf8', stdio: 'pipe' });
      log.success('Nginx: Configuración válida');
    } catch (err) {
      log.error('Nginx: Configuración inválida');
      errors++;
    }
  } else {
    // Verificar servicios en desarrollo
    await checkUrl('http://localhost:3000', 'Frontend Dev Server');
    await checkUrl('http://localhost:5000/api/health', 'Backend API Local');
  }

  // Verificar que los archivos modificados incluyan la configuración dinámica
  log.header('4. VERIFICACIÓN DE INTEGRACIÓN');
  
  if (!isProduction) {
    // Verificar que index.html cargue runtime-config.js
    checkFileContent(
      './frontend/public/index.html',
      'runtime-config.js',
      'index.html carga runtime-config.js'
    );

    // Verificar que api/index.js use __RUNTIME_CONFIG__
    checkFileContent(
      './frontend/src/services/api/index.js',
      '__RUNTIME_CONFIG__',
      'API service usa config dinámica'
    );

    // Verificar que env-config.js use __RUNTIME_CONFIG__
    checkFileContent(
      './frontend/env-config.js',
      '__RUNTIME_CONFIG__',
      'env-config usa config dinámica'
    );
  }

  // Resumen final
  log.header('5. RESUMEN');
  console.log('='.repeat(60));
  
  if (errors === 0 && warnings === 0) {
    console.log(`${colors.green}${colors.bright}✅ TODAS LAS VERIFICACIONES PASARON${colors.reset}`);
    console.log(`\n${colors.green}La configuración está lista para ${environment}.${colors.reset}`);
  } else if (errors > 0) {
    console.log(`${colors.red}${colors.bright}❌ VERIFICACIÓN FALLIDA${colors.reset}`);
    console.log(`\n${colors.red}Errores: ${errors}${colors.reset}`);
    console.log(`${colors.yellow}Advertencias: ${warnings}${colors.reset}`);
    console.log(`\n${colors.yellow}Por favor, revisa los errores antes de continuar.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}${colors.bright}⚠️ VERIFICACIÓN CON ADVERTENCIAS${colors.reset}`);
    console.log(`\n${colors.yellow}Advertencias: ${warnings}${colors.reset}`);
    console.log(`\n${colors.yellow}El sistema debería funcionar, pero revisa las advertencias.${colors.reset}`);
  }

  // Sugerencias según el entorno
  if (isProduction) {
    console.log(`\n${colors.cyan}📝 NOTAS PARA PRODUCCIÓN:${colors.reset}`);
    console.log('1. Si necesitas cambiar la URL del API, edita:');
    console.log('   /var/www/9001app2/dist/runtime-config.override.js');
    console.log('2. Para aplicar cambios desde GitLab, ejecuta:');
    console.log('   bash /root/deploy-preserve-config.sh');
    console.log('3. La configuración se preservará entre despliegues');
  } else {
    console.log(`\n${colors.cyan}📝 NOTAS PARA DESARROLLO:${colors.reset}`);
    console.log('1. Para probar en local: npm run dev (en frontend y backend)');
    console.log('2. La configuración detectará automáticamente localhost');
    console.log('3. Para hacer commit a GitLab:');
    console.log('   git add -A && git commit -m "Fix: configuración dinámica" && git push');
  }

  console.log('\n' + '='.repeat(60) + '\n');
  
  // Retornar código de salida apropiado
  process.exit(errors > 0 ? 1 : 0);
}

// Ejecutar verificación
main().catch(err => {
  console.error('Error ejecutando verificación:', err);
  process.exit(1);
});
