import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, RefreshCw, Activity } from 'lucide-react';

const DatabaseManagement: React.FC = () => {
  console.log('🗄️ DatabaseManagement renderizado');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Base de Datos</h1>
          <p className="text-gray-600 mt-2">Administra MongoDB Atlas y migración de Turso</p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar Estado
        </Button>
      </div>

      {/* Estado de las Bases de Datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MongoDB Atlas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              MongoDB Atlas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Estado de Conexión</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Base de Datos</span>
              <span className="text-sm font-medium">9001app-v2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Colecciones</span>
              <span className="text-sm font-medium">37</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tamaño</span>
              <span className="text-sm font-medium">2.4 GB</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Backup
              </Button>
              <Button variant="outline" size="sm">
                <Activity className="w-4 h-4 mr-2" />
                Monitorear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Turso Migration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Migración Turso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Progreso de Migración</span>
              <span className="text-sm font-medium text-blue-600">81.4%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81.4%' }}></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>✅ Módulo CRM Agro</span>
                <span className="text-green-600">100%</span>
              </div>
              <div className="flex justify-between">
                <span>✅ Módulo SGC</span>
                <span className="text-green-600">100%</span>
              </div>
              <div className="flex justify-between">
                <span>✅ Módulo Sistema</span>
                <span className="text-green-600">100%</span>
              </div>
              <div className="flex justify-between">
                <span>❌ Tabla Planes</span>
                <span className="text-red-600">0%</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Continuar Migración
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Operaciones de Base de Datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup y Restauración */}
        <Card>
          <CardHeader>
            <CardTitle>Backup y Restauración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Backups Recientes</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">backup_2024_01_29_1430.zip</span>
                  <span className="text-xs text-gray-500">2.4 GB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">backup_2024_01_28_1430.zip</span>
                  <span className="text-xs text-gray-500">2.3 GB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">backup_2024_01_27_1430.zip</span>
                  <span className="text-xs text-gray-500">2.3 GB</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Crear Backup
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Restaurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Optimización */}
        <Card>
          <CardHeader>
            <CardTitle>Optimización y Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Índices</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>usuarios.email</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between">
                  <span>organizations.name</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between">
                  <span>audit_logs.created_at</span>
                  <span className="text-green-600">✓</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Estadísticas</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Consultas por minuto</span>
                  <span>1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo promedio</span>
                  <span>45ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uso de memoria</span>
                  <span>67%</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Optimizar Base de Datos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="w-6 h-6 mb-2" />
              <span>Backup Completo</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 mb-2" />
              <span>Restaurar Datos</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <RefreshCw className="w-6 h-6 mb-2" />
              <span>Reindexar</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="w-6 h-6 mb-2" />
              <span>Análisis de Rendimiento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManagement;
