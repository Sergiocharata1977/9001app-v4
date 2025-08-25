import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Server, 
  Database, 
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const SystemMonitoring = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Monitoreo del Sistema
        </h1>
        <p className="text-gray-600">
          Estado en tiempo real de los servicios y rendimiento del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Estado de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Servidor Web</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Base de Datos</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">API Backend</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Sistema de Archivos</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">CPU</span>
                <Badge className="bg-green-500">23%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Memoria RAM</span>
                <Badge className="bg-yellow-500">67%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Almacenamiento</span>
                <Badge className="bg-green-500">45%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tiempo de Respuesta</span>
                <Badge className="bg-green-500">120ms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas y Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Backup automático completado</p>
                    <p className="text-sm text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Info</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium">Uso de memoria elevado</p>
                    <p className="text-sm text-gray-600">Hace 30 minutos</p>
                  </div>
                </div>
                <Badge className="bg-yellow-500">Advertencia</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">Error de conexión a BD</p>
                    <p className="text-sm text-gray-600">Hace 1 hora</p>
                  </div>
                </div>
                <Badge className="bg-red-500">Error</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitoring;
