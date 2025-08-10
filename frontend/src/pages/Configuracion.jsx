import React from 'react';

const Configuracion = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configuración del Sistema</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de configuración en desarrollo...</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-gray-700">
            <li>• Configuración de organización</li>
            <li>• Gestión de usuarios y roles</li>
            <li>• Configuración de notificaciones</li>
            <li>• Personalización de interfaz</li>
            <li>• Configuración de seguridad</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Configuracion; 