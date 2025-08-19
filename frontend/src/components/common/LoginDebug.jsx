import React from 'react';
import useAuthStore from '../../store/authStore';

/**
 * Componente de debug para monitorear el estado de autenticación
 * Solo se muestra en desarrollo
 */
const LoginDebug = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin);

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-2">🔍 Debug Auth</h4>
      <div className="space-y-1">
        <div>Loading: {isLoading ? '✅' : '❌'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>Super Admin: {isSuperAdmin() ? '✅' : '❌'}</div>
        <div>User Role: {user?.role || 'N/A'}</div>
        <div>User ID: {user?.id || 'N/A'}</div>
        <div>Org ID: {user?.organization_id || 'N/A'}</div>
      </div>
    </div>
  );
};

export default LoginDebug;

