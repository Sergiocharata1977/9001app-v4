import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSuperAdminStore from '../store/superAdminStore';
import useAuthStore from '../store/authStore';

/**
 * Hook personalizado para funcionalidades de Super Admin
 * Incluye verificación de permisos y redirección automática
 */
export const useSuperAdmin = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const superAdminStore = useSuperAdminStore();
  
  // Verificar si el usuario es super admin
  const isSuperAdmin = user?.role === 'super_admin';
  
  useEffect(() => {
    // Redirigir si no es super admin
    if (!isSuperAdmin && window.location.pathname.includes('/super-admin')) {
      navigate('/app/menu-cards');
    }
  }, [isSuperAdmin, navigate]);
  
  return {
    // Estado
    isSuperAdmin,
    dashboardStats: superAdminStore.dashboardStats,
    organizations: superAdminStore.organizations,
    selectedOrganization: superAdminStore.selectedOrganization,
    organizationUsers: superAdminStore.organizationUsers,
    isLoading: superAdminStore.isLoading,
    error: superAdminStore.error,
    
    // Acciones
    fetchDashboardStats: superAdminStore.fetchDashboardStats,
    fetchOrganizations: superAdminStore.fetchOrganizations,
    createOrganization: superAdminStore.createOrganization,
    updateOrganization: superAdminStore.updateOrganization,
    deleteOrganization: superAdminStore.deleteOrganization,
    selectOrganization: superAdminStore.selectOrganization,
    fetchOrganizationUsers: superAdminStore.fetchOrganizationUsers,
    changeUserRole: superAdminStore.changeUserRole,
    clearError: superAdminStore.clearError,
    reset: superAdminStore.reset
  };
};

export default useSuperAdmin;

