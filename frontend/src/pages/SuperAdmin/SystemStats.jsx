import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Activity,
  BarChart3,
  Calendar
} from 'lucide-react';

const SystemStats = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estadísticas del Sistema
        </h1>
        <p className="text-gray-600">
          Métricas y estadísticas globales del sistema ISO Flow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Estadísticas Generales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Organizaciones Activas</span>
                <Badge className="bg-green-500">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Usuarios Totales</span>
                <Badge className="bg-blue-500">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Usuarios Activos (30 días)</span>
                <Badge className="bg-purple-500">89</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Nuevas Organizaciones (mes)</span>
                <Badge className="bg-orange-500">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Crecimiento Usuarios</span>
                <Badge className="bg-green-500">+15%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Crecimiento Organizaciones</span>
                <Badge className="bg-blue-500">+25%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Retención Usuarios</span>
                <Badge className="bg-purple-500">87%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Satisfacción</span>
                <Badge className="bg-yellow-500">4.8/5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Nuevo usuario registrado</p>
                    <p className="text-sm text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                <Badge variant="outline">Usuario</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Nueva organización creada</p>
                    <p className="text-sm text-gray-600">Hace 1 día</p>
                  </div>
                </div>
                <Badge variant="outline">Organización</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Backup automático completado</p>
                    <p className="text-sm text-gray-600">Hace 3 horas</p>
                  </div>
                </div>
                <Badge variant="outline">Sistema</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemStats;
