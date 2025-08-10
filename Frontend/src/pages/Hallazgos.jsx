import React from 'react';

const Hallazgos = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Hallazgos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de hallazgos en desarrollo...</p>
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-red-700">
            <li>• Registro de hallazgos</li>
            <li>• Clasificación por severidad</li>
            <li>• Asignación de responsables</li>
            <li>• Seguimiento de correcciones</li>
            <li>• Análisis de tendencias</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hallazgos; 