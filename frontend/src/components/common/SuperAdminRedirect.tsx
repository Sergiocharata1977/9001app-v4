import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const SuperAdminRedirect: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  // Si es super admin, redirigir al tablero de super admin
  if (user?.role === 'super_admin') {
    return <Navigate to="/app/super-admin/tablero" replace />;
  }
  
  // Si no es super admin, no redirigir
  return null;
};

export default SuperAdminRedirect;
