import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ToggleLeft, 
  ToggleRight,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

const SystemFeatures = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Features del Sistema
        </h1>
        <p className="text-gray-600">
          Habilitar o deshabilitar funcionalidades del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Features Principales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Sistema de Auditorías</p>
                  <p className="text-sm text-gray-600">Gestión de auditorías internas</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gestión de Hallazgos</p>
                  <p className="text-sm text-gray-600">Seguimiento de hallazgos y acciones</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">AMFE</p>
                  <p className="text-sm text-gray-600">Análisis de Modo y Efecto de Fallas</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Evaluación de Competencias</p>
                  <p className="text-sm text-gray-600">Sistema de evaluación de personal</p>
                </div>
                <Button size="sm" variant="outline">
                  <ToggleLeft className="w-4 h-4 mr-2" />
                  Desactivado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Features Avanzadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">API REST</p>
                  <p className="text-sm text-gray-600">Interfaz de programación</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notificaciones Push</p>
                  <p className="text-sm text-gray-600">Notificaciones en tiempo real</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Exportación de Datos</p>
                  <p className="text-sm text-gray-600">Exportar a Excel/PDF</p>
                </div>
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <ToggleRight className="w-4 h-4 mr-2" />
                  Activado
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Integración Externa</p>
                  <p className="text-sm text-gray-600">APIs de terceros</p>
                </div>
                <Button size="sm" variant="outline">
                  <ToggleLeft className="w-4 h-4 mr-2" />
                  Desactivado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Features por Organización
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Organización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Features Activas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">ISOFlow3 Platform</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-purple-500">Enterprise</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">28/28</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-green-500">Completo</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">Organización Demo</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Professional</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">24/28</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-500">Parcial</Badge>
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

export default SystemFeatures;
