const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function testLoginToken() {
  console.log('🔐 Probando login y verificación de token...');
  console.log(''.padEnd(60, '='));

  try {
    // 1. Login
    console.log('1. Iniciando sesión...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@demo.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Error en login:', loginResponse.data.message);
      return;
    }

    const token = loginResponse.data.data.tokens.accessToken;
    console.log('✅ Login exitoso');
    console.log(`   Token: ${token.substring(0, 50)}...`);

    // 2. Decodificar token sin verificar
    console.log('\n2. Decodificando token...');
    const decoded = jwt.decode(token);
    console.log('✅ Token decodificado:');
    console.log('   Payload:', JSON.stringify(decoded, null, 2));

    // 3. Verificar token con el mismo secreto
    console.log('\n3. Verificando token...');
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verificado correctamente:');
      console.log('   Verified payload:', JSON.stringify(verified, null, 2));
    } catch (error) {
      console.log('❌ Error verificando token:', error.message);
    }

    // 4. Probar endpoint con el token
    console.log('\n4. Probando endpoint con token...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const verifyResponse = await axios.get(`${API_URL}/api/auth/verify`, { headers });
      console.log('✅ Endpoint /api/auth/verify funcionando:');
      console.log('   Response:', verifyResponse.data);
    } catch (error) {
      console.log('❌ Error en /api/auth/verify:', error.response?.data || error.message);
    }

    // 5. Probar endpoint de administración
    console.log('\n5. Probando endpoint de administración...');
    try {
      const adminResponse = await axios.get(`${API_URL}/api/admin/organizations`, { headers });
      console.log('✅ Endpoint /api/admin/organizations funcionando:');
      console.log('   Total organizaciones:', adminResponse.data.total);
    } catch (error) {
      console.log('❌ Error en /api/admin/organizations:', error.response?.data || error.message);
    }

    console.log('\n🎉 Pruebas completadas');
    console.log(''.padEnd(60, '='));

  } catch (error) {
    console.error('❌ Error general:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testLoginToken();
