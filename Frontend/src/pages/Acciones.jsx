import React from 'react';

const Acciones = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Acciones</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de acciones en desarrollo...</p>
        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <h3 className="font-semibold text-orange-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-orange-700">
            <li>• Crear acciones correctivas</li>
            <li>• Seguimiento de acciones</li>
            <li>• Asignación de responsables</li>
            <li>• Plazos y recordatorios</li>
            <li>• Reportes de efectividad</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Acciones; 