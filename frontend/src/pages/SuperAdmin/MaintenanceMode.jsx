import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

const MaintenanceMode = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modo Mantenimiento
        </h1>
        <p className="text-gray-600">
          Gestionar el modo mantenimiento del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Estado Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Modo Mantenimiento</span>
                <Badge className="bg-green-500">Desactivado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Última Activación</span>
                <span className="text-sm text-gray-600">Nunca</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Duración Promedio</span>
                <span className="text-sm text-gray-600">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Usuarios Afectados</span>
                <Badge variant="outline">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Notificación a Usuarios</span>
                <Badge className="bg-green-500">Activada</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Acceso Super Admin</span>
                <Badge className="bg-green-500">Permitido</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Página Personalizada</span>
                <Badge className="bg-blue-500">Configurada</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tiempo Estimado</span>
                <span className="text-sm text-gray-600">30 minutos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Acciones de Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Activar Mantenimiento</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Activar Ahora
                  </Button>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Programar
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Desactivar Mantenimiento</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Desactivar Ahora
                  </Button>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Historial de Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Duración</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Motivo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuarios Afectados</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-15 02:00 - 02:30
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">30 min</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Actualización de seguridad</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">12</Badge>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-10 01:00 - 01:45
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">45 min</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Mantenimiento de base de datos</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">8</Badge>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-05 03:00 - 03:15
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">15 min</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Backup de emergencia</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completado</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">3</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceMode;
