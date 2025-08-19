import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Settings,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

const RolesPermissions = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Roles y Permisos
        </h1>
        <p className="text-gray-600">
          Configurar roles y permisos del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Super Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Acceso global completo</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Gestión de organizaciones</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Configuración del sistema</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Rol
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Gestión de usuarios</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Configuración de organización</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-700">Acceso limitado al sistema</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Rol
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Acceso a módulos asignados</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-700">Sin configuración</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-700">Sin acceso administrativo</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar Rol
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Permisos por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Módulo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Super Admin</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Admin</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Auditorías</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completo</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Gestión</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">Lectura</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Hallazgos</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completo</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Gestión</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">Lectura</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Usuarios</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completo</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Gestión</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-red-500">Sin acceso</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Configuración</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completo</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-yellow-500">Limitado</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-red-500">Sin acceso</Badge>
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

export default RolesPermissions;
