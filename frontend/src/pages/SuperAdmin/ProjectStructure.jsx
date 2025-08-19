import React from 'react';
import DatabaseFlowDiagram from '@/components/database/DatabaseFlowDiagram';
import ProjectStructureViewer from '@/components/database/ProjectStructureViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  HardDrive, 
  Info,
  Clock,
  CheckCircle
} from 'lucide-react';

const ProjectStructure = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estructura del Proyecto
        </h1>
        <p className="text-gray-600">
          Monitoreo automático de la base de datos y estructura de archivos
        </p>
      </div>

      {/* Información General */}
      <div className="mb-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Tablas Monitoreadas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <HardDrive className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-600">Archivos Totales</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-purple-600">12h</div>
                <div className="text-sm text-gray-600">Ciclo de Actualización</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Procesos Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secciones Principales */}
      <div className="space-y-8">
        {/* Diagrama de Flujo de BD */}
        <DatabaseFlowDiagram />

        {/* Estructura del Proyecto */}
        <ProjectStructureViewer />

        {/* Explicación de la Sección de Base de Datos */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              ¿Qué hace la Sección "Base de Datos"?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📊 Estado de BD</h4>
                <p className="text-sm text-green-700">
                  Muestra si la base de datos está operativa y funcionando correctamente. 
                  Es como un "latido" que confirma que todo está bien.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💾 Último Backup</h4>
                <p className="text-sm text-blue-700">
                  Indica cuándo fue la última vez que se hizo una copia de seguridad de la base de datos. 
                  Es importante para la seguridad de los datos.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🔍 Ver Esquema</h4>
                <p className="text-sm text-purple-700">
                  Te permite ver la estructura de las tablas de la base de datos, 
                  como si fuera un "mapa" de cómo están organizados los datos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Operativa</div>
                  <div className="text-sm text-gray-600">Estado Actual</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Hace 2h</div>
                  <div className="text-sm text-gray-600">Último Backup</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectStructure;
