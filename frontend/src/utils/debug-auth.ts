import useAuthStore from '@/store/authStore';

export const debugAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  console.log('🔍 DEBUG AUTH - Estado actual:');
  console.log('   isAuthenticated:', isAuthenticated);
  console.log('   isLoading:', isLoading);
  console.log('   user:', user);
  
  if (user) {
    console.log('   user.id:', user.id);
    console.log('   user.email:', user.email);
    console.log('   user.role:', user.role);
    console.log('   user.organization_id:', user.organization_id);
    console.log('   user.organizationId:', user.organizationId);
    console.log('   user.org_id:', user.org_id);
    console.log('   Todos los campos del usuario:', Object.keys(user));
  } else {
    console.log('   ❌ No hay usuario autenticado');
  }
  
  // Verificar localStorage
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  console.log('   localStorage.token:', token ? 'Presente' : 'Ausente');
  console.log('   localStorage.refreshToken:', refreshToken ? 'Presente' : 'Ausente');
  
  return { user, isAuthenticated, isLoading };
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
