import React from 'react';
import useAuthStore from '../store/authStore';

const TestAuth: React.FC = () => {
  const { user, isAuthenticated, token } = useAuthStore();

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">🔍 Test de Autenticación</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Estado de Autenticación:</h3>
          <p>isAuthenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? '✅ SÍ' : '❌ NO'}</span></p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Token:</h3>
          <p>{token ? '✅ Presente' : '❌ Ausente'}</p>
          {token && <p className="text-xs text-gray-500">Token: {token.substring(0, 20)}...</p>}
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Usuario:</h3>
          {user ? (
            <div>
              <p>✅ Usuario logueado</p>
              <p>Nombre: {user.name || 'N/A'}</p>
              <p>Email: {user.email || 'N/A'}</p>
              <p>Rol: {user.role || 'N/A'}</p>
              <p>Organización: {user.organization_name || 'N/A'}</p>
            </div>
          ) : (
            <p>❌ No hay usuario</p>
          )}
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">LocalStorage:</h3>
          <p>Auth Storage: {localStorage.getItem('auth-storage') ? '✅ Presente' : '❌ Ausente'}</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold text-blue-800">🎯 Diagnóstico:</h3>
        {!isAuthenticated ? (
          <p className="text-red-600">❌ NO ESTÁS AUTENTICADO - Por eso te redirige al login/menú</p>
        ) : (
          <p className="text-green-600">✅ ESTÁS AUTENTICADO - El problema debe estar en otro lado</p>
        )}
      </div>
    </div>
  );
};

export default TestAuth;
