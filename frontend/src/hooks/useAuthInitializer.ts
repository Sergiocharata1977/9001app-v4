import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Hook para inicializar la autenticación al cargar la aplicación
 * Verifica si hay un token válido en localStorage y restaura la sesión
 * Incluye redirección inteligente basada en el rol del usuario
 */
export const useAuthInitializer = () => {
  const navigate = useNavigate();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const authResult = await initializeAuth();
        
        // Si la autenticación fue exitosa y el componente sigue montado
        if (mounted && authResult && isAuthenticated) {
          // Redirección inteligente basada en el rol
          const currentPath = window.location.pathname;
          
          // Si está en la página de login y ya está autenticado, redirigir
          if (currentPath === '/app/login' || currentPath === '/login') {
            const redirectPath = isSuperAdmin() ? '/super-admin/dashboard' : '/app/menu-cards';
            navigate(redirectPath, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
      }
    };

    if (mounted) {
      initAuth();
    }

    return () => {
      mounted = false;
    };
  }, [initializeAuth, navigate, isAuthenticated, isSuperAdmin]);

  return { isLoading };
};

export default useAuthInitializer;
