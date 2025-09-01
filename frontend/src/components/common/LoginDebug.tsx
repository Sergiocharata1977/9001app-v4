import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';

/**
 * Componente de debug para monitorear el estado de autenticación
 * Solo se muestra en desarrollo y se oculta automáticamente a los 5 segundos
 */
const LoginDebug = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [isVisible, setIsVisible] = useState(true);

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  // Auto-ocultar después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs z-50 max-w-xs shadow-xl border border-gray-600"
          onClick={() => setIsVisible(false)}
        >
          <h4 className="font-bold mb-1 text-center">🔍 Debug Auth</h4>
          <div className="space-y-0.5">
            <div>Loading: {isLoading ? '✅' : '❌'}</div>
            <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
            <div>Super Admin: {isSuperAdmin ? '✅' : '❌'}</div>
            <div>User Role: {user?.role || 'N/A'}</div>
            <div>User ID: {user?.id || 'N/A'}</div>
            <div>Org ID: {user?.organization_id || 'N/A'}</div>
          </div>
          <div className="text-center mt-2 text-gray-400 text-[10px]">
            Click para cerrar • Se oculta en 5s
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginDebug;

