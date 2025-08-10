import React from 'react';
import { Button } from '../../atoms/Button';
import { useAuthStore } from '../../../store/authStore';

/**
 * @component Header
 * @description Componente orgánico de header de la aplicación
 * @returns {JSX.Element} Componente Header
 */
export const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              ISOFlow3
            </h1>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, {user?.name || 'Usuario'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 