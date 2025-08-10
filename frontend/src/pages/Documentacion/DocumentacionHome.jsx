import React from 'react';
import { BookOpen, FileText, Users, Settings, HelpCircle, Download, Search } from 'lucide-react';

const DocumentacionHome = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-emerald-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">Documentación del Sistema</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Bienvenido a la documentación completa de SGC Pro. Aquí encontrarás guías para usuarios, 
          documentación técnica para desarrolladores y todo lo necesario para usar el sistema eficientemente.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <Search className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Buscar en Documentación</h3>
          </div>
          <p className="text-blue-700 text-sm">Búsqueda rápida en toda la documentación</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <Download className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-800">Descargar Manual PDF</h3>
          </div>
          <p className="text-green-700 text-sm">Descargar manual completo en PDF</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center mb-3">
            <HelpCircle className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-800">Soporte Técnico</h3>
          </div>
          <p className="text-purple-700 text-sm">Contactar al equipo de soporte</p>
        </div>
      </div>

      {/* Manual del Usuario */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Users className="w-8 h-8 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Manual del Usuario</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Guías y manuales para usuarios del sistema
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Casos de Uso</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Procedimientos estándar y workflows</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
              Ver Documentación
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Manual de Usuario</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Guías paso a paso por módulo</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
              Ver Documentación
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <HelpCircle className="w-5 h-5 text-emerald-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Soporte y FAQ</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Preguntas frecuentes y solución de problemas</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
              Ver Documentación
            </button>
          </div>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Estado del Sistema - MVP</h3>
        <div className="text-yellow-700 text-sm space-y-1">
          <p>• ✅ Frontend funcionando correctamente</p>
          <p>• ✅ Navegación y routing operativo</p>
          <p>• ❌ Backend con problemas de ES Modules (en proceso de conversión)</p>
          <p>• ❌ Algunas funcionalidades pueden no estar disponibles</p>
          <p>• 🔄 Conversión a CommonJS en progreso</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentacionHome;
