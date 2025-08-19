import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  Info,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';

const SystemLogs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Logs del Sistema
        </h1>
        <p className="text-gray-600">
          Registro de eventos y errores del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Logs Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Info className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Usuario autenticado exitosamente</p>
                  <p className="text-sm text-gray-600">super_admin@isoflow.com</p>
                  <p className="text-xs text-gray-500">Hace 2 minutos</p>
                </div>
                <Badge className="bg-green-500">Info</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Alto uso de memoria detectado</p>
                  <p className="text-sm text-gray-600">Uso: 85% de RAM</p>
                  <p className="text-xs text-gray-500">Hace 15 minutos</p>
                </div>
                <Badge className="bg-yellow-500">Warning</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Error de conexión a base de datos</p>
                  <p className="text-sm text-gray-600">Timeout en consulta</p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
                <Badge className="bg-red-500">Error</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Backup automático completado</p>
                  <p className="text-sm text-gray-600">Archivo: backup_20240816.sql</p>
                  <p className="text-xs text-gray-500">Hace 3 horas</p>
                </div>
                <Badge className="bg-blue-500">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Estadísticas de Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Logs Hoy</span>
                <Badge className="bg-blue-500">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Errores</span>
                <Badge className="bg-red-500">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Advertencias</span>
                <Badge className="bg-yellow-500">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Información</span>
                <Badge className="bg-green-500">1,179</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Historial Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nivel</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Mensaje</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">IP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:30:15
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">INFO</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Usuario autenticado</p>
                      <p className="text-sm text-gray-600">Login exitoso</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      super_admin@isoflow.com
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      192.168.1.100
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:15:22
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">WARN</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Alto uso de memoria</p>
                      <p className="text-sm text-gray-600">85% de RAM utilizada</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Sistema
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      -
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 09:45:10
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-red-500">ERROR</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Error de conexión BD</p>
                      <p className="text-sm text-gray-600">Timeout en consulta</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Sistema
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      -
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 07:30:00
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">INFO</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Backup completado</p>
                      <p className="text-sm text-gray-600">backup_20240816.sql</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Sistema
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      -
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

export default SystemLogs;
