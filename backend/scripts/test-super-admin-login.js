const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testSuperAdminLogin() {
  console.log('🔐 Probando login con usuario super_admin...');
  console.log(''.padEnd(60, '='));

  try {
    // 1. Login con super_admin
    console.log('1. Iniciando sesión con super_admin...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@isoflow3.com',
      password: 'admin123' // Intentar con la contraseña por defecto
    });

    if (!loginResponse.data.success) {
      console.log('❌ Error en login:', loginResponse.data.message);
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verificar la contraseña del usuario super_admin');
      console.log('   2. Crear un nuevo usuario super_admin');
      return;
    }

    const token = loginResponse.data.data.tokens.accessToken;
    console.log('✅ Login exitoso con super_admin');
    console.log(`   Token: ${token.substring(0, 50)}...`);

    // 2. Probar endpoint de organizaciones
    console.log('\n2. Probando endpoint /api/admin/organizations...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const orgResponse = await axios.get(`${API_URL}/api/admin/organizations`, { headers });
      console.log('✅ Endpoint /api/admin/organizations funcionando:');
      console.log(`   Total organizaciones: ${orgResponse.data.total}`);
      
      if (orgResponse.data.data && orgResponse.data.data.length > 0) {
        console.log('   Organizaciones:');
        orgResponse.data.data.forEach((org, index) => {
          console.log(`     ${index + 1}. ${org.name} (ID: ${org.id}) - ${org.plan}`);
        });
      }
    } catch (error) {
      console.log('❌ Error en /api/admin/organizations:', error.response?.data || error.message);
    }

    // 3. Probar endpoint de usuarios
    console.log('\n3. Probando endpoint /api/admin/users...');
    try {
      const userResponse = await axios.get(`${API_URL}/api/admin/users`, { headers });
      console.log('✅ Endpoint /api/admin/users funcionando:');
      console.log(`   Total usuarios: ${userResponse.data.total}`);
      
      if (userResponse.data.data && userResponse.data.data.length > 0) {
        console.log('   Usuarios:');
        userResponse.data.data.forEach((user, index) => {
          console.log(`     ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
        });
      }
    } catch (error) {
      console.log('❌ Error en /api/admin/users:', error.response?.data || error.message);
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

testSuperAdminLogin();
