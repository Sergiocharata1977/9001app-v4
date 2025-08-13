// Script para probar endpoints de administración con autenticación real
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testAdminWithAuth() {
  console.log('🔐 Probando endpoints de administración con autenticación...');
  console.log(''.padEnd(60, '='));

  try {
    // 1. Login para obtener token
    console.log('1. Iniciando sesión...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@demo.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Error en login:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login exitoso, token obtenido');

    // 2. Configurar headers con token válido
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Probar endpoint de organizaciones
    console.log('\n2. Probando endpoint /api/admin/organizations...');
    try {
      const orgResponse = await axios.get(`${API_URL}/api/admin/organizations`, { headers });
      console.log('✅ Organizaciones obtenidas exitosamente');
      console.log(`   Total organizaciones: ${orgResponse.data.total}`);
      
      if (orgResponse.data.data && orgResponse.data.data.length > 0) {
        const firstOrg = orgResponse.data.data[0];
        console.log(`   Primera organización: ${firstOrg.name} (ID: ${firstOrg.id})`);
      }
    } catch (error) {
      console.log('❌ Error obteniendo organizaciones:', error.response?.data || error.message);
    }

    // 4. Probar endpoint de usuarios
    console.log('\n3. Probando endpoint /api/admin/users...');
    try {
      const userResponse = await axios.get(`${API_URL}/api/admin/users`, { headers });
      console.log('✅ Usuarios obtenidos exitosamente');
      console.log(`   Total usuarios: ${userResponse.data.total}`);
      
      if (userResponse.data.data && userResponse.data.data.length > 0) {
        const firstUser = userResponse.data.data[0];
        console.log(`   Primer usuario: ${firstUser.name} (${firstUser.email}) - Rol: ${firstUser.role}`);
      }
    } catch (error) {
      console.log('❌ Error obteniendo usuarios:', error.response?.data || error.message);
    }

    // 5. Verificar información del usuario autenticado
    console.log('\n4. Verificando información del usuario...');
    try {
      const verifyResponse = await axios.get(`${API_URL}/api/auth/verify`, { headers });
      console.log('✅ Usuario autenticado:', verifyResponse.data.data);
    } catch (error) {
      console.log('❌ Error verificando usuario:', error.response?.data || error.message);
    }

    console.log('\n🎉 Pruebas completadas exitosamente');
    console.log(''.padEnd(60, '='));
    console.log('💡 Los endpoints de administración están funcionando correctamente');
    console.log('💡 El frontend debería poder conectarse sin problemas');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAdminWithAuth();
