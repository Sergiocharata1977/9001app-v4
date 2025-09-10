import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Funciones temporales para el bypass
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Simular login exitoso para el bypass
      const mockUser = {
        id: '1',
        nombre: 'Usuario',
        apellido: 'Temporal',
        email: credentials.email || 'usuario@temporal.com',
        roles: ['user'],
        organization: {
          id: '1',
          nombre: 'Organización Temporal',
          codigo: 'TEMP'
        }
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, message: 'Error en login temporal' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Simular registro exitoso
      const mockUser = {
        id: '1',
        nombre: userData.nombre || 'Usuario',
        apellido: userData.apellido || 'Nuevo',
        email: userData.email,
        roles: ['user'],
        organization: {
          id: '1',
          nombre: 'Organización Nueva',
          codigo: 'NEW'
        }
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, message: 'Error en registro temporal' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;