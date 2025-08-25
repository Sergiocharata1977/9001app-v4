import React from 'react';

const Documentacion = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Documentación</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de documentación en desarrollo...</p>
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-purple-700">
            <li>• Control de documentos</li>
            <li>• Versiones y revisiones</li>
            <li>• Aprobaciones digitales</li>
            <li>• Búsqueda avanzada</li>
            <li>• Historial de cambios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentacion; 