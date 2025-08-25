import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Database, 
  Zap,
  Save,
  RefreshCw
} from 'lucide-react';

const SystemConfig = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600">
          Configuración global del sistema ISO Flow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Modo Mantenimiento</span>
                <Badge className="bg-green-500">Desactivado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Registro de Auditoría</span>
                <Badge className="bg-blue-500">Activado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Backup Automático</span>
                <Badge className="bg-green-500">Diario</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Notificaciones</span>
                <Badge className="bg-blue-500">Activadas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Autenticación 2FA</span>
                <Badge className="bg-green-500">Opcional</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Política de Contraseñas</span>
                <Badge className="bg-blue-500">Fuerte</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sesiones Múltiples</span>
                <Badge className="bg-green-500">Permitidas</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tiempo de Sesión</span>
                <Badge className="bg-yellow-500">8 horas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Configuración de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Base de Datos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pool de Conexiones</span>
                    <Badge variant="outline">20</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Timeout de Consulta</span>
                    <Badge variant="outline">30s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Cache de Consultas</span>
                    <Badge className="bg-green-500">Activado</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Rate Limiting</span>
                    <Badge className="bg-green-500">Activado</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Compresión</span>
                    <Badge className="bg-green-500">Activada</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">CORS</span>
                    <Badge className="bg-blue-500">Configurado</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Restaurar Valores
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default SystemConfig;
