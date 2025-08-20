import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Folder, File, Code, Database, Settings, Users, Activity } from 'lucide-react';
import MermaidDiagram from '../ui/MermaidDiagram';

const FileStructureViewer = () => {
  const [lastScan, setLastScan] = useState('Hace 15 minutos');
  const [fileStats, setFileStats] = useState({
    totalFiles: 1247,
    backend: 456,
    frontend: 634,
    docs: 89,
    scripts: 68
  });

  const [fileTypes, setFileTypes] = useState({
    javascript: 561,
    typescript: 187,
    react: 312,
    documentation: 100,
    config: 87
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simular actualización de estadísticas
      setFileStats(prev => ({
        ...prev,
        totalFiles: prev.totalFiles + Math.floor(Math.random() * 3)
      }));
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setLastScan('Hace 0 minutos');
  };

  return (
    <div className="space-y-6">
      {/* Información del Sistema */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">
            Estructura del Proyecto
          </h3>
        </div>
        <p className="text-blue-700 mt-2">
          Organización del proyecto y monitoreo de archivos
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">24</p>
                <p className="text-sm text-blue-600">Tablas Monitoreadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <File className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">{fileStats.totalFiles.toLocaleString()}</p>
                <p className="text-sm text-green-600">Archivos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Folder className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">30m</p>
                <p className="text-sm text-purple-600">Ciclo de Escaneo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-800">3</p>
                <p className="text-sm text-orange-600">Procesos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagrama de Estructura de Archivos */}
      <Card>
        <CardHeader className="bg-purple-50 border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-800">
                Diagrama de Organización del Proyecto
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScan}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Activity className="h-4 w-4 mr-1" />
              Escanear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">
            Estructura jerárquica del proyecto 9001app2 mostrando la organización de archivos, carpetas y módulos principales del sistema SGC.
          </p>

          {/* Diagrama Mermaid Real */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <MermaidDiagram 
              chart={`
graph TD
    A[📦 9001app2] --> B[🔧 Backend]
    A --> C[🎨 Frontend]
    A --> D[📚 Docs]
    A --> E[🛠️ Scripts]
    A --> F[📊 Logs]
    
    B --> G[📁 Controllers]
    B --> H[📁 Routes]
    B --> I[📁 Middleware]
    B --> J[📁 Services]
    B --> K[📁 Database]
    B --> L[📁 RAG-Backend]
    
    G --> G1[🔍 authController.js]
    G --> G2[👥 personalController.js]
    G --> G3[📋 hallazgosController.js]
    G --> G4[📊 auditoriasController.js]
    
    H --> H1[🛣️ auth.routes.js]
    H --> H2[🛣️ personal.routes.js]
    H --> H3[🛣️ hallazgos.routes.js]
    H --> H4[🛣️ auditorias.routes.js]
    
    K --> K1[🗄️ Migrations]
    K --> K2[📊 data.db]
    K --> K3[🔗 Relations]
    
    C --> M[📁 Components]
    C --> N[📁 Pages]
    C --> O[📁 Services]
    C --> P[📁 Hooks]
    C --> Q[📁 Types]
    
    M --> M1[👥 Personal]
    M --> M2[📋 Hallazgos]
    M --> M3[📊 Auditorias]
    M --> M4[🎨 UI]
    M --> M5[📚 Admin]
    
    N --> N1[🏠 Dashboard]
    N --> N2[👤 Personal]
    N --> N3[⚠️ Hallazgos]
    N --> N4[🔍 Auditorias]
    N --> N5[📚 Documentacion]
    
    D --> R[📋 COORDINACION-AGENTES.md]
    D --> S[🗄️ database-flow-diagram.md]
    D --> T[📁 file-structure-diagram.md]
    D --> U[📊 INFORME-ESTADO-PROYECTO-ISO9001.md]
    
    E --> V[🤖 agent-monitor.js]
    E --> W[🔄 auto-cleanup.js]
    E --> X[📊 database-tracker.js]
    E --> Y[🚀 start-automation-system.js]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
              `}
              className="w-full"
            />
          </div>

          {/* Rastreador Automático */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Script que detecta cambios en archivos</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Frecuencia: Cada 30 minutos | Última ejecución: {lastScan}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Detección de Cambios</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Escanea estructura de archivos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <File className="h-5 w-5" />
            <span>Distribución por Tipo de Archivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{fileTypes.javascript}</p>
              <p className="text-sm text-gray-600">JavaScript (.js)</p>
              <p className="text-xs text-gray-500">45%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{fileTypes.typescript}</p>
              <p className="text-sm text-gray-600">TypeScript (.ts/.tsx)</p>
              <p className="text-xs text-gray-500">15%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{fileTypes.react}</p>
              <p className="text-sm text-gray-600">React (.jsx)</p>
              <p className="text-xs text-gray-500">25%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{fileTypes.documentation}</p>
              <p className="text-sm text-gray-600">Documentación (.md)</p>
              <p className="text-xs text-gray-500">8%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{fileTypes.config}</p>
              <p className="text-sm text-gray-600">Configuración</p>
              <p className="text-xs text-gray-500">7%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-green-800">Sistema de Archivos Operativo</span>
        </div>
        <div className="text-sm text-green-600">
          Último escaneo: {lastScan}
        </div>
      </div>
    </div>
  );
};

export default FileStructureViewer;
