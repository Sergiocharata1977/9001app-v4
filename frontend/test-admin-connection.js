// Script para probar la conexión del frontend con el backend
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Simular un token de autenticación (necesitarás un token real)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTczNDE5NzE2NCwiZXhwIjoxNzM0MTk4NzY0fQ.example';

async function testAdminConnection() {
  console.log('🧪 Probando conexión del frontend con endpoints de administración...');
  console.log(''.padEnd(60, '='));

  try {
    // 1. Probar endpoint de health
    console.log('1. Probando endpoint /api/health...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health endpoint funcionando:', healthResponse.data);

    // 2. Probar endpoint de organizaciones (sin autenticación primero)
    console.log('\n2. Probando endpoint /api/admin/organizations (sin auth)...');
    try {
      const orgResponse = await axios.get(`${API_URL}/api/admin/organizations`);
      console.log('✅ Organizaciones obtenidas:', orgResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Endpoint protegido correctamente (401 Unauthorized)');
      } else {
        console.log('❌ Error inesperado:', error.response?.data || error.message);
      }
    }

    // 3. Probar endpoint de usuarios (sin autenticación)
    console.log('\n3. Probando endpoint /api/admin/users (sin auth)...');
    try {
      const userResponse = await axios.get(`${API_URL}/api/admin/users`);
      console.log('✅ Usuarios obtenidos:', userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Endpoint protegido correctamente (401 Unauthorized)');
      } else {
        console.log('❌ Error inesperado:', error.response?.data || error.message);
      }
    }

    // 4. Probar con headers de autenticación
    console.log('\n4. Probando con headers de autenticación...');
    const headers = {
      'Authorization': `Bearer ${TEST_TOKEN}`,
      'Content-Type': 'application/json'
    };

    try {
      const orgResponse = await axios.get(`${API_URL}/api/admin/organizations`, { headers });
      console.log('✅ Organizaciones con auth:', orgResponse.data);
    } catch (error) {
      console.log('❌ Error con autenticación:', error.response?.data || error.message);
    }

    console.log('\n🎉 Pruebas completadas');
    console.log(''.padEnd(60, '='));
    console.log('💡 Si ves errores 401, es normal - necesitas un token válido');
    console.log('💡 Si ves errores 500, hay un problema en el backend');
    console.log('💡 Si ves datos, todo está funcionando correctamente');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAdminConnection();
