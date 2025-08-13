#!/usr/bin/env node

/**
 * Script de prueba para verificar el sistema de planes
 * Verifica endpoints, datos y funcionalidades básicas
 */

const axios = require('axios');

// Configuración
const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_EMAIL = 'admin@demo.com';
const TEST_PASSWORD = 'admin123';

// Colores para console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

class PlanesSystemTester {
  constructor() {
    this.token = null;
    this.user = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  async runTests() {
    log.title('\n🚀 INICIANDO PRUEBAS DEL SISTEMA DE PLANES');
    log.title('==========================================\n');

    try {
      // Test 1: Verificar que el servidor está funcionando
      await this.testServerHealth();
      
      // Test 2: Login como super admin
      await this.testSuperAdminLogin();
      
      // Test 3: Verificar endpoint de planes
      await this.testPlanesEndpoint();
      
      // Test 4: Verificar endpoint de suscripciones
      await this.testSuscripcionesEndpoint();
      
      // Test 5: Verificar datos de planes
      await this.testPlanesData();
      
      // Mostrar resumen
      this.showResults();
      
    } catch (error) {
      log.error(`Error durante las pruebas: ${error.message}`);
      process.exit(1);
    }
  }

  async testServerHealth() {
    log.info('Verificando salud del servidor...');
    
    try {
      const response = await axios.get(`${BASE_URL}/api/health`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        this.testPassed('Servidor respondiendo correctamente');
      } else {
        this.testFailed('Servidor no responde correctamente');
      }
    } catch (error) {
      this.testFailed(`Error de conexión al servidor: ${error.message}`);
    }
  }

  async testSuperAdminLogin() {
    log.info('Probando login como Super Administrador...');
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

      if (response.data.success && response.data.data?.user) {
        this.token = response.data.data.tokens?.accessToken || response.data.token;
        this.user = response.data.data.user;
        
        if (this.user.role === 'super_admin') {
          this.testPassed('Login exitoso como Super Administrador');
        } else {
          this.testFailed(`Usuario no tiene rol super_admin (rol actual: ${this.user.role})`);
        }
      } else {
        this.testFailed('Login falló - respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`Error en login: ${error.response?.data?.message || error.message}`);
    }
  }

  async testPlanesEndpoint() {
    if (!this.token) {
      this.testFailed('No hay token para probar endpoint de planes');
      return;
    }

    log.info('Probando endpoint de planes...');

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.get(`${BASE_URL}/api/planes`, { headers });
      if (response.data.success) {
        this.testPassed('GET /api/planes - Funcionando');
      } else {
        this.testFailed('GET /api/planes - Respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`GET /api/planes - Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async testSuscripcionesEndpoint() {
    if (!this.token) {
      this.testFailed('No hay token para probar endpoint de suscripciones');
      return;
    }

    log.info('Probando endpoint de suscripciones...');

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.get(`${BASE_URL}/api/suscripciones/organizacion/actual`, { headers });
      if (response.data.success) {
        this.testPassed('GET /api/suscripciones/organizacion/actual - Funcionando');
      } else {
        this.testFailed('GET /api/suscripciones/organizacion/actual - Respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`GET /api/suscripciones/organizacion/actual - Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async testPlanesData() {
    if (!this.token) {
      this.testFailed('No hay token para probar datos de planes');
      return;
    }

    log.info('Verificando datos de planes...');

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.get(`${BASE_URL}/api/planes`, { headers });
      
      if (response.data.success && response.data.data) {
        const planes = response.data.data;
        
        if (planes.length > 0) {
          this.testPassed(`Datos de planes cargados correctamente (${planes.length} planes)`);
          
          // Verificar estructura de datos
          const primerPlan = planes[0];
          const camposRequeridos = ['id', 'nombre', 'descripcion', 'precio_mensual'];
          const camposFaltantes = camposRequeridos.filter(campo => !primerPlan.hasOwnProperty(campo));
          
          if (camposFaltantes.length === 0) {
            this.testPassed('Estructura de datos de planes correcta');
          } else {
            this.testFailed(`Campos faltantes en planes: ${camposFaltantes.join(', ')}`);
          }
        } else {
          this.testFailed('No se encontraron planes');
        }
      } else {
        this.testFailed('Respuesta de planes inválida');
      }
    } catch (error) {
      this.testFailed(`Error verificando datos de planes: ${error.response?.data?.message || error.message}`);
    }
  }

  testPassed(message) {
    this.testResults.passed++;
    this.testResults.total++;
    log.success(message);
  }

  testFailed(message) {
    this.testResults.failed++;
    this.testResults.total++;
    log.error(message);
  }

  showResults() {
    log.title('\n📊 RESULTADOS DE LAS PRUEBAS DEL SISTEMA DE PLANES');
    log.title('==================================================');
    
    console.log(`\n${colors.bold}Total de pruebas: ${this.testResults.total}`);
    console.log(`${colors.green}✅ Exitosas: ${this.testResults.passed}`);
    console.log(`${colors.red}❌ Fallidas: ${this.testResults.failed}${colors.reset}`);
    
    const successRate = this.testResults.total > 0 
      ? Math.round((this.testResults.passed / this.testResults.total) * 100) 
      : 0;
    
    console.log(`\n${colors.bold}Tasa de éxito: ${successRate}%${colors.reset}`);
    
    if (this.testResults.failed === 0) {
      log.success('\n🎉 ¡Todas las pruebas pasaron! El sistema de planes está funcionando correctamente.');
      console.log('\n📋 Próximos pasos:');
      console.log('   1. Verificar la interfaz de usuario en http://localhost:3000/app/planes');
      console.log('   2. Probar la funcionalidad de cambio de planes');
      console.log('   3. Verificar que los datos se muestran correctamente');
    } else {
      log.warning('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
    }
    
    console.log('\n');
  }
}

// Execute tests
async function main() {
  const tester = new PlanesSystemTester();
  await tester.runTests();
}

// Execute if called directly
if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      log.error(`Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { PlanesSystemTester };
