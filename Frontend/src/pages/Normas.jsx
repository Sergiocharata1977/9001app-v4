import React from 'react';

const Normas = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Normas</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de normas en desarrollo...</p>
        <div className="mt-4 p-4 bg-teal-50 rounded-lg">
          <h3 className="font-semibold text-teal-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-teal-700">
            <li>• Catálogo de normas</li>
            <li>• Actualizaciones automáticas</li>
            <li>• Cumplimiento normativo</li>
            <li>• Alertas de cambios</li>
            <li>• Impacto en procesos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Normas; 