import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Componente para redirección automática de Super Admins
 * Se ejecuta después del login para asegurar que vayan al panel correcto
 */
const SuperAdminRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Solo ejecutar si no está cargando y está autenticado
    if (!isLoading && isAuthenticated) {
      const currentPath = window.location.pathname;
      
      // Si es Super Admin y está en una ruta de la aplicación principal
      if (isSuperAdmin() && currentPath.startsWith('/app/')) {
        // Redirigir al panel Super Admin
        navigate('/super-admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isSuperAdmin, navigate]);

  return null; // Este componente no renderiza nada
};

export default SuperAdminRedirect;
