// Script de depuración para verificar el estado de autenticación
export const debugAuth = () => {
  console.log('🔍 DEBUG AUTH: Verificando estado de autenticación...');
  
  // Verificar localStorage
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('📦 Token en localStorage:', token ? '✅ Presente' : '❌ Ausente');
  console.log('🔄 RefreshToken en localStorage:', refreshToken ? '✅ Presente' : '❌ Ausente');
  
  if (token) {
    try {
      // Decodificar el token JWT (sin verificar firma)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔓 Token payload:', payload);
      console.log('👤 Usuario ID:', payload.id || payload.userId);
      console.log('🏢 Organización ID:', payload.organization_id);
      console.log('⏰ Expira:', new Date(payload.exp * 1000).toLocaleString());
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
    }
  }
  
  // Verificar Zustand store
  const authStore = window.__ZUSTAND_DEVTOOLS__?.stores?.authStore;
  if (authStore) {
    console.log('🏪 Auth Store State:', authStore.getState());
  }
  
  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    token,
    refreshToken
  };
};

// Función para probar una llamada a la API
export const testApiCall = async (endpoint = '/test') => {
  try {
    console.log(`🧪 Probando llamada a API: ${endpoint}`);
    
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 Status: ${response.status}`);
    console.log(`📡 Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log(`📄 Response:`, data);
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('❌ Error en llamada API:', error);
    return { success: false, error: error.message };
  }
};
