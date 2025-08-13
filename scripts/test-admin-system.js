#!/usr/bin/env node

/**
 * Script de prueba para verificar el sistema administrativo
 * Verifica endpoints, permisos y funcionalidades básicas
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

class AdminSystemTester {
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
    log.title('\n🚀 INICIANDO PRUEBAS DEL SISTEMA ADMINISTRATIVO');
    log.title('================================================\n');

    try {
      // Test 1: Verificar que el servidor está funcionando
      await this.testServerHealth();
      
      // Test 2: Login como super admin
      await this.testSuperAdminLogin();
      
      // Test 3: Verificar endpoints de super admin
      await this.testSuperAdminEndpoints();
      
      // Test 4: Verificar protección de rutas
      await this.testRouteProtection();
      
      // Test 5: Verificar funcionalidades de organización
      await this.testOrganizationFeatures();
      
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

  async testSuperAdminEndpoints() {
    if (!this.token) {
      this.testFailed('No hay token para probar endpoints');
      return;
    }

    log.info('Probando endpoints de Super Administrador...');

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    // Test: Obtener organizaciones
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/organizations`, { headers });
      if (response.data.success) {
        this.testPassed('GET /api/admin/organizations - Funcionando');
      } else {
        this.testFailed('GET /api/admin/organizations - Respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`GET /api/admin/organizations - Error: ${error.response?.data?.message || error.message}`);
    }

    // Test: Obtener usuarios globales
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/users`, { headers });
      if (response.data.success) {
        this.testPassed('GET /api/admin/users - Funcionando');
      } else {
        this.testFailed('GET /api/admin/users - Respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`GET /api/admin/users - Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async testRouteProtection() {
    log.info('Probando protección de rutas...');

    // Test: Intentar acceder sin token
    try {
      await axios.get(`${BASE_URL}/api/admin/organizations`);
      this.testFailed('Ruta no protegida - debería requerir autenticación');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.testPassed('Protección de rutas funcionando correctamente');
      } else {
        this.testFailed(`Protección de rutas falló - Status: ${error.response?.status}`);
      }
    }

    // Test: Intentar acceder con token inválido
    try {
      await axios.get(`${BASE_URL}/api/admin/organizations`, {
        headers: { 'Authorization': 'Bearer invalid_token' }
      });
      this.testFailed('Token inválido aceptado - debería rechazarse');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.testPassed('Validación de token funcionando correctamente');
      } else {
        this.testFailed(`Validación de token falló - Status: ${error.response?.status}`);
      }
    }
  }

  async testOrganizationFeatures() {
    if (!this.token || !this.user?.organization_id) {
      this.testFailed('No hay token u organización para probar features');
      return;
    }

    log.info('Probando funcionalidades de organización...');

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    // Test: Obtener usuarios de la organización
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/organization/${this.user.organization_id}/users`, 
        { headers }
      );
      if (response.data.success) {
        this.testPassed('GET usuarios de organización - Funcionando');
      } else {
        this.testFailed('GET usuarios de organización - Respuesta inválida');
      }
    } catch (error) {
      this.testFailed(`GET usuarios de organización - Error: ${error.response?.data?.message || error.message}`);
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
    log.title('\n📊 RESULTADOS DE LAS PRUEBAS');
    log.title('============================');
    
    console.log(`\n${colors.bold}Total de pruebas: ${this.testResults.total}`);
    console.log(`${colors.green}✅ Exitosas: ${this.testResults.passed}`);
    console.log(`${colors.red}❌ Fallidas: ${this.testResults.failed}${colors.reset}`);
    
    const successRate = this.testResults.total > 0 
      ? Math.round((this.testResults.passed / this.testResults.total) * 100) 
      : 0;
    
    console.log(`\n${colors.bold}Tasa de éxito: ${successRate}%${colors.reset}`);
    
    if (this.testResults.failed === 0) {
      log.success('\n🎉 ¡Todas las pruebas pasaron! El sistema administrativo está funcionando correctamente.');
    } else {
      log.warning('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
    }
    
    console.log('\n');
  }
}

// Ejecutar pruebas
async function main() {
  const tester = new AdminSystemTester();
  await tester.runTests();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      log.error(`Error fatal: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { AdminSystemTester };
