import React from 'react';

const Admin = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Panel de administración en desarrollo...</p>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Funcionalidades próximas:</h3>
          <ul className="mt-2 text-yellow-700">
            <li>• Gestión de organizaciones</li>
            <li>• Configuración de sistema</li>
            <li>• Monitoreo de usuarios</li>
            <li>• Logs y auditoría</li>
            <li>• Respaldo y restauración</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin; 