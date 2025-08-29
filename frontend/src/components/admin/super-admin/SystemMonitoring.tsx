import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Cpu, HardDrive, MemoryStick, Network, RefreshCw } from 'lucide-react';
import React from 'react';

const SystemMonitoring: React.FC = () => {
  console.log('📊 SystemMonitoring renderizado');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoreo del Sistema</h1>
          <p className="text-gray-600 mt-2">Métricas en tiempo real del rendimiento del sistema</p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar Métricas
        </Button>
      </div>

      {/* Métricas de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">23%</div>
            <p className="text-xs text-muted-foreground">
              Uso promedio
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria RAM</CardTitle>
            <MemoryStick className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">67%</div>
            <p className="text-xs text-muted-foreground">
              8.2 GB / 12 GB
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45%</div>
            <p className="text-xs text-muted-foreground">
              225 GB / 500 GB
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Red</CardTitle>
            <Network className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1.2 MB/s</div>
            <p className="text-xs text-muted-foreground">
              Tráfico promedio
            </p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600">Estable</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servicios y Procesos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estado de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Backend</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Activo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MongoDB</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Redis Cache</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600">Advertencia</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Activo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas y Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Alto uso de memoria detectado</span>
                <span className="text-xs text-muted-foreground ml-auto">5 min</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Backup completado exitosamente</span>
                <span className="text-xs text-muted-foreground ml-auto">1 hora</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Nuevo usuario registrado</span>
                <span className="text-xs text-muted-foreground ml-auto">2 horas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Intento de acceso fallido</span>
                <span className="text-xs text-muted-foreground ml-auto">3 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones de Monitoreo */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Monitoreo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="w-6 h-6 mb-2" />
              <span>Ver Logs Completos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertTriangle className="w-6 h-6 mb-2" />
              <span>Configurar Alertas</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Cpu className="w-6 h-6 mb-2" />
              <span>Análisis de Rendimiento</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <RefreshCw className="w-6 h-6 mb-2" />
              <span>Reiniciar Servicios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;