import React from 'react';

const Puestos = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Puestos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de puestos en desarrollo...</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-blue-700">
            <li>• Lista de puestos</li>
            <li>• Crear nuevo puesto</li>
            <li>• Editar puesto</li>
            <li>• Eliminar puesto</li>
            <li>• Gestión de responsabilidades</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Puestos; 