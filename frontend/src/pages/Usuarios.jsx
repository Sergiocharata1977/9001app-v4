import React from 'react';

const Usuarios = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Módulo de usuarios en desarrollo...</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-blue-700">
            <li>• Lista de usuarios</li>
            <li>• Crear nuevo usuario</li>
            <li>• Editar usuario</li>
            <li>• Eliminar usuario</li>
            <li>• Gestión de roles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Usuarios; 