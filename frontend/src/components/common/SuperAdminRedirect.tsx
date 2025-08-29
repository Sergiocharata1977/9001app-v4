import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * Componente para redirección automática de Super Admins
 * Se ejecuta SOLO UNA VEZ después del login para evitar bucles
 */
const SuperAdminRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Solo ejecutar si no está cargando, está autenticado y NO se ha redirigido antes
    if (!isLoading && isAuthenticated && !hasRedirected.current) {
      const currentPath = window.location.pathname;
      
      // Si es Super Admin y está en una ruta de la aplicación principal (pero NO en super-admin)
      if (isSuperAdmin() && currentPath.startsWith('/app/') && !currentPath.startsWith('/super-admin/')) {
        hasRedirected.current = true;
        console.log('🔄 Redirigiendo Super Admin a /super-admin/dashboard');
        navigate('/super-admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isSuperAdmin, navigate]);

  return null; // Este componente no renderiza nada
};

export default SuperAdminRedirect;
