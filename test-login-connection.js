const axios = require('axios');

// Configuración del cliente API
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testLogin() {
  try {
    console.log('🧪 Probando conexión con el backend...');
    
    // 1. Probar health check
    const healthResponse = await apiClient.get('/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // 2. Probar login
    const loginData = {
      email: 'test@test.com',
      password: '123456'
    };
    
    console.log('🔐 Intentando login con:', loginData);
    const loginResponse = await apiClient.post('/auth/login', loginData);
    console.log('✅ Login exitoso:', loginResponse.data);
    
    // 3. Probar con token
    if (loginResponse.data.data?.tokens?.accessToken) {
      const token = loginResponse.data.data.tokens.accessToken;
      console.log('🔑 Token obtenido:', token.substring(0, 20) + '...');
      
      // Probar endpoint protegido
      const profileResponse = await apiClient.get('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Perfil obtenido:', profileResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();
