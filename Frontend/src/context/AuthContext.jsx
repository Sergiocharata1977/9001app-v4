import React, { createContext, useContext } from 'react';
import useAuthStore from '@/store/authStore';

/**
 * Este archivo sirve como capa de compatibilidad después de la migración a Zustand.
 * Implementa un `useAuth` que delega en `useAuthStore` para que el código legado
 * que sigue importando `useAuth` continúe funcionando sin modificar todos los
 * componentes. No provee un contexto real; simplemente expone los valores que
 * muchos componentes esperan (`user`, `logout`, etc.).
 */

// Creamos un contexto vacío únicamente para mantener la API previa. No se usa
// realmente, pero evita errores si alguien intenta renderizar <AuthProvider>.
const DummyContext = createContext({});

export const AuthProvider = ({ children }) => (
  <DummyContext.Provider value={{}}>{children}</DummyContext.Provider>
);

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const verifyToken = useAuthStore((state) => state.verifyToken);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearError = useAuthStore((state) => state.clearError);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  // Funciones de utilidad para roles (si se necesitan)
  const hasRole = (role) => user?.roles?.includes(role) || false;
  const isAdmin = () => hasRole('admin') || user?.role === 'admin';
  const isManager = () => hasRole('manager') || user?.role === 'manager';

  return {
    user,
    logout,
    login,
    register,
    verifyToken,
    initializeAuth,
    updateUser,
    clearError,
    isAuthenticated,
    token,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isManager,
  };
};

// Exportación por defecto para compatibilidad (algunos imports hacían
// `import { useAuth } from '@/context/AuthContext'` y otros
// `import AuthContext from ...`).
export default {
  useAuth,
  AuthProvider,
}; 