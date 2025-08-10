import React from 'react';

const Procesos = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Procesos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de procesos en desarrollo...</p>
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-semibold text-indigo-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-indigo-700">
            <li>• Mapeo de procesos</li>
            <li>• Diagramas de flujo</li>
            <li>• Indicadores de proceso</li>
            <li>• Mejora continua</li>
            <li>• Documentación de procesos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Procesos; 