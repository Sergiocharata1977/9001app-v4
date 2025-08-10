#!/usr/bin/env node

const http = require('http');
const https = require('https');

// Configuración
const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost';
const API_PORT = process.env.SMOKE_API_PORT || '5000';
const FRONTEND_PORT = process.env.SMOKE_FRONTEND_PORT || '3000';
const TIMEOUT = parseInt(process.env.SMOKE_TIMEOUT || '10000');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function makeRequest(url, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${timeout}ms`));
    }, timeout);

    const req = protocol.get(url, (res) => {
      clearTimeout(timer);
      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        url: url
      });
    });

    req.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function checkEndpoint(url, expectedStatus = 200, description = '') {
  try {
    console.log(`${colors.blue}🔍 Verificando: ${description || url}${colors.reset}`);
    const result = await makeRequest(url);
    
    if (result.statusCode === expectedStatus) {
      console.log(`${colors.green}✅ OK: ${url} - ${result.statusCode} ${result.statusMessage}${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  Inesperado: ${url} - ${result.statusCode} ${result.statusMessage} (esperaba ${expectedStatus})${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error: ${url} - ${error.message}${colors.reset}`);
    return false;
  }
}

async function runSmokeTests() {
  console.log(`${colors.blue}🚀 Iniciando smoke tests...${colors.reset}\n`);
  
  const tests = [
    // Backend health check
    {
      url: `${BASE_URL}:${API_PORT}/api/health`,
      status: 200,
      description: 'Backend health check'
    },
    // Backend test endpoint
    {
      url: `${BASE_URL}:${API_PORT}/api/test`,
      status: 200,
      description: 'Backend test endpoint'
    },
    // Frontend (puede estar sirviendo HTML)
    {
      url: `${BASE_URL}:${FRONTEND_PORT}/`,
      status: 200,
      description: 'Frontend home page'
    },
    // API endpoints críticos
    {
      url: `${BASE_URL}:${API_PORT}/api/auth/verify`,
      status: 401, // Sin token debe dar 401
      description: 'Auth verify endpoint (sin token)'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await checkEndpoint(test.url, test.status, test.description);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\n${colors.blue}📊 Resultados:${colors.reset}`);
  console.log(`${colors.green}✅ Pasaron: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Fallaron: ${failed}${colors.reset}`);

  if (failed > 0) {
    console.log(`\n${colors.red}💥 Algunos tests fallaron. Revisa los servicios.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}🎉 Todos los smoke tests pasaron!${colors.reset}`);
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runSmokeTests().catch(error => {
    console.error(`${colors.red}💥 Error fatal en smoke tests:${colors.reset}`, error.message);
    process.exit(1);
  });
}

module.exports = { runSmokeTests, checkEndpoint };
