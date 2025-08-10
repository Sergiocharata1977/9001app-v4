import React from 'react';

const Auditorias = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Auditorías</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de auditorías en desarrollo...</p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-green-700">
            <li>• Programación de auditorías</li>
            <li>• Ejecución de auditorías</li>
            <li>• Reportes de auditoría</li>
            <li>• Seguimiento de hallazgos</li>
            <li>• Gestión de auditores</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Auditorias; 