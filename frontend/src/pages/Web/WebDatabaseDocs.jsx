import React from 'react';
import WebLayout from '../../components/layout/WebLayout';

const WebDatabaseDocs = () => {
  return (
    <WebLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Documentación de Base de Datos
            </h1>
            <p className="text-xl text-purple-200">
              Información técnica para desarrolladores
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tablas Principales */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Tablas Principales</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">usuarios</h3>
                  <p className="text-gray-300">Usuarios del sistema con roles y organización</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">organizations</h3>
                  <p className="text-gray-300">Organizaciones del sistema</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">organization_features</h3>
                  <p className="text-gray-300">Features habilitadas por organización</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">user_feature_permissions</h3>
                  <p className="text-gray-300">Permisos específicos de usuarios</p>
                </div>
              </div>
            </div>

            {/* Notas Importantes */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Notas Importantes</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Organización ID 3: ISOFlow3 Platform (Super Admin)</li>
                <li>• Organización ID 2: Organización Demo</li>
                <li>• Tabla de features: organization_features (con "s")</li>
                <li>• Tabla de usuarios: usuarios (no "users")</li>
                <li>• Todos los datos segregados por organization_id</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
};

export default WebDatabaseDocs;
