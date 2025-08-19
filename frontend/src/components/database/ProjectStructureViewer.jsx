import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  File, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  HardDrive,
  Code,
  Database,
  Settings
} from 'lucide-react';

const ProjectStructureViewer = () => {
  const [structure, setStructure] = useState({
    lastUpdate: 'Hace 2h 15m',
    totalFiles: 1247,
    totalSize: '156.7 MB',
    directories: [
      {
        name: 'frontend',
        files: 892,
        size: '89.3 MB',
        type: 'React App',
        status: 'active'
      },
      {
        name: 'backend',
        files: 234,
        size: '45.2 MB',
        type: 'Node.js API',
        status: 'active'
      },
      {
        name: 'scripts',
        files: 89,
        size: '12.1 MB',
        type: 'Utilidades',
        status: 'active'
      },
      {
        name: 'docs',
        files: 32,
        size: '10.1 MB',
        type: 'Documentación',
        status: 'active'
      }
    ],
    automationStatus: {
      cleanup: { status: 'active', lastRun: 'Hace 1 día', nextRun: 'En 1 día' },
      backup: { status: 'active', lastRun: 'Hace 6h', nextRun: 'En 6h' },
      optimization: { status: 'active', lastRun: 'Hace 2 días', nextRun: 'En 5 días' }
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular actualización
    setTimeout(() => {
      setStructure(prev => ({
        ...prev,
        lastUpdate: 'Ahora mismo'
      }));
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDirectoryIcon = (type) => {
    switch (type) {
      case 'React App': return <Code className="w-5 h-5 text-blue-500" />;
      case 'Node.js API': return <Database className="w-5 h-5 text-green-500" />;
      case 'Utilidades': return <Settings className="w-5 h-5 text-purple-500" />;
      case 'Documentación': return <File className="w-5 h-5 text-orange-500" />;
      default: return <Folder className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Estructura del Proyecto
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white border-white hover:bg-white hover:text-indigo-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Descripción */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>¿Qué hace?</strong> Este sistema automáticamente rastrea la estructura de archivos del proyecto, 
              detecta cambios y ejecuta procesos de limpieza y optimización. Mantiene el proyecto organizado sin intervención manual.
            </p>
          </div>

          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{structure.totalFiles}</div>
              <div className="text-sm text-gray-600">Archivos Totales</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{structure.totalSize}</div>
              <div className="text-sm text-gray-600">Tamaño Total</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{structure.directories.length}</div>
              <div className="text-sm text-gray-600">Directorios Principales</div>
            </div>
          </div>

          {/* Estructura de Directorios */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Directorios Principales</h4>
            {structure.directories.map((dir, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getDirectoryIcon(dir.type)}
                  <div>
                    <div className="font-medium text-gray-900">{dir.name}</div>
                    <div className="text-sm text-gray-600">{dir.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{dir.files} archivos</div>
                    <div className="text-xs text-gray-600">{dir.size}</div>
                  </div>
                  <Badge className={getStatusColor(dir.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(dir.status)}
                      <span>{dir.status === 'active' ? 'Activo' : dir.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Procesos Automáticos */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Procesos Automáticos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(structure.automationStatus).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900 capitalize">{key}</h5>
                    <Badge className={getStatusColor(value.status)}>
                      {getStatusIcon(value.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Última ejecución: {value.lastRun}</div>
                    <div>Próxima ejecución: {value.nextRun}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de Actualización */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
            <span>Última actualización: {structure.lastUpdate}</span>
            <span>Actualización automática cada 2 días</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStructureViewer;
