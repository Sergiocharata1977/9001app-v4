import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rutas que solo pueden acceder super_admin
const SuperAdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'super_admin') {
    return <Navigate to="/documentacion" replace />;
  }

  return children;
};

// Componente para rutas que solo pueden acceder admin de organización
const OrganizationAdminRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Permitir acceso a super_admin y admin
  if (user?.role !== 'super_admin' && user?.role !== 'admin') {
    return <Navigate to="/documentacion" replace />;
  }

  return children;
};

export { SuperAdminRoute, OrganizationAdminRoute };
export default ProtectedRoute;
