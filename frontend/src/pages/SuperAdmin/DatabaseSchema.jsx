import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Table, 
  Key, 
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const DatabaseSchema = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Esquema de Base de Datos
        </h1>
        <p className="text-gray-600">
          Documentación técnica completa de la estructura de la base de datos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tablas Principales */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Tablas Principales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">usuarios</h3>
                <p className="text-gray-600 mb-2">Usuarios del sistema con roles y organización</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">id (PK)</Badge>
                  <Badge variant="outline">organization_id (FK)</Badge>
                  <Badge variant="outline">role</Badge>
                  <Badge variant="outline">email</Badge>
                  <Badge variant="outline">name</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">organizations</h3>
                <p className="text-gray-600 mb-2">Organizaciones del sistema</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">id (PK)</Badge>
                  <Badge variant="outline">name</Badge>
                  <Badge variant="outline">plan</Badge>
                  <Badge variant="outline">status</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">organization_features</h3>
                <p className="text-gray-600 mb-2">Features habilitadas por organización</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">organization_id (FK)</Badge>
                  <Badge variant="outline">feature_name</Badge>
                  <Badge variant="outline">enabled</Badge>
                </div>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">user_feature_permissions</h3>
                <p className="text-gray-600 mb-2">Permisos específicos de usuarios</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">user_id (FK)</Badge>
                  <Badge variant="outline">feature_name</Badge>
                  <Badge variant="outline">permission</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas Importantes */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Notas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Organización ID 3: ISOFlow3 Platform</p>
                  <p className="text-sm text-gray-600">Super Admin - Acceso global</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Organización ID 2: Organización Demo</p>
                  <p className="text-sm text-gray-600">Organización de demostración</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Tabla de features: organization_features</p>
                  <p className="text-sm text-gray-600">Importante: incluye "s" al final</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Tabla de usuarios: usuarios</p>
                  <p className="text-sm text-gray-600">No "users" - nombre en español</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Key className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Segregación de Datos</p>
                  <p className="text-sm text-gray-600">Todos los datos segregados por organization_id</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
            <CardTitle className="flex items-center">
              <Table className="w-5 h-5 mr-2" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Roles del Sistema</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500">super_admin</Badge>
                    <span className="text-sm text-gray-600">Acceso global completo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500">admin</Badge>
                    <span className="text-sm text-gray-600">Administrador de organización</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500">user</Badge>
                    <span className="text-sm text-gray-600">Usuario estándar</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Características del Sistema</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Multi-tenancy por organización</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Control granular de features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Permisos por usuario</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Auditoría completa</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseSchema;
