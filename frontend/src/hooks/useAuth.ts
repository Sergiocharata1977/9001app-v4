import useAuthStore from '@/store/authStore';

/**
 * Hook personalizado para acceder al estado de autenticación
 * Proporciona una interfaz consistente para el manejo de autenticación
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  
  return {
    // Estado de autenticación
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    
    // Métodos de autenticación
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    
    // Métodos de actualización
    updateUser: authStore.updateUser,
    refreshToken: authStore.refreshToken,
    
    // Estado de permisos
    hasPermission: authStore.hasPermission,
    hasRole: authStore.hasRole,
    
    // Información de organización (multi-tenancy)
    organization: authStore.user?.organization,
    organizationId: authStore.user?.organization_id,
    organizationName: authStore.user?.organization_name,
    organizationPlan: authStore.user?.organization_plan,
    
    // Roles y permisos
    isAdmin: authStore.user?.role === 'admin',
    isManager: authStore.user?.role === 'manager',
    isUser: authStore.user?.role === 'user',
    
    // Métodos de verificación
    checkAuth: authStore.checkAuth,
    clearAuth: authStore.clearAuth
  };
};

export default useAuth;
