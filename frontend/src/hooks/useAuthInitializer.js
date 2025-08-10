import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * Hook para inicializar la autenticación al cargar la aplicación
 * Verifica si hay un token válido en localStorage y restaura la sesión
 */
export const useAuthInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        await initializeAuth();
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
  }, [initializeAuth]);

  return { isLoading };
};

export default useAuthInitializer;
