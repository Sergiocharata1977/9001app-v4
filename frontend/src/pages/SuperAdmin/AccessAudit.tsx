import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  Clock,
  Shield,
  Eye,
  AlertTriangle
} from 'lucide-react';

const AccessAudit = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Auditoría de Accesos
        </h1>
        <p className="text-gray-600">
          Registro de accesos y actividad de usuarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Accesos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">super_admin@isoflow.com</p>
                  <p className="text-sm text-gray-600">Login exitoso</p>
                  <p className="text-xs text-gray-500">Hace 2 minutos</p>
                </div>
                <Badge className="bg-green-500">Exitoso</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">usuario@test.com</p>
                  <p className="text-sm text-gray-600">Contraseña incorrecta</p>
                  <p className="text-xs text-gray-500">Hace 5 minutos</p>
                </div>
                <Badge className="bg-red-500">Fallido</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">admin@demo.com</p>
                  <p className="text-sm text-gray-600">Login exitoso</p>
                  <p className="text-xs text-gray-500">Hace 15 minutos</p>
                </div>
                <Badge className="bg-green-500">Exitoso</Badge>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">user@test.com</p>
                  <p className="text-sm text-gray-600">Sesión expirada</p>
                  <p className="text-xs text-gray-500">Hace 30 minutos</p>
                </div>
                <Badge className="bg-yellow-500">Expirado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Estadísticas de Acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Accesos Hoy</span>
                <Badge className="bg-blue-500">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Accesos Exitosos</span>
                <Badge className="bg-green-500">142</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Accesos Fallidos</span>
                <Badge className="bg-red-500">14</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Usuarios Únicos</span>
                <Badge className="bg-purple-500">23</Badge>
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
              Historial Completo de Accesos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Evento</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">IP</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:30:15
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">super_admin@isoflow.com</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">Login exitoso</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      192.168.1.100
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Chrome/120.0.0.0
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Exitoso</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:25:30
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">usuario@test.com</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">Contraseña incorrecta</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      192.168.1.101
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Firefox/119.0.0.0
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-red-500">Fallido</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:15:45
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">admin@demo.com</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">Login exitoso</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      192.168.1.102
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Safari/17.0.0.0
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Exitoso</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      2024-08-16 10:00:20
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">user@test.com</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">Sesión expirada</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      192.168.1.103
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      Edge/120.0.0.0
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">Expirado</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
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

export default AccessAudit;
