import React from 'react';
import FileStructureViewer from '../../components/database/FileStructureViewer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const FileStructure = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estructura de Archivos</h1>
          <p className="text-gray-600 mt-2">
            Visualización completa de la estructura de archivos del sistema SGC ISO 9001
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <InformationCircleIcon className="w-6 h-6 text-blue-500" />
          <span className="text-sm text-gray-500">Actualización automática cada 48 horas</span>
        </div>
      </div>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DocumentIcon className="w-5 h-5 mr-2" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Características</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Visualización en tiempo real</li>
                <li>• Filtros por sección</li>
                <li>• Búsqueda por tipo de archivo</li>
                <li>• Estados visuales (✅ ⚠️ ❌)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Funcionalidades</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Árbol de carpetas expandible</li>
                <li>• Estadísticas detalladas</li>
                <li>• Comandos de actualización</li>
                <li>• Monitoreo automático</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Actualización</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Frecuencia: 48 horas</li>
                <li>• Logs completos</li>
                <li>• Recuperación automática</li>
                <li>• Soporte PM2</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente Principal */}
      <FileStructureViewer />
    </div>
  );
};

export default FileStructure;
