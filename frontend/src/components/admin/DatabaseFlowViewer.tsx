import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { RefreshCw, Database, FileText, Activity } from 'lucide-react';
import MermaidDiagram from '../ui/MermaidDiagram';

const DatabaseFlowViewer = () => {
  const [lastUpdate, setLastUpdate] = useState('19/08/2025, 09:04:38');
  const [isActive, setIsActive] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRecords: 15847,
    activeOrganizations: 3,
    connectedUsers: 12,
    operationsPerMinute: 45,
    responseTime: 120
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simular actualización de métricas
      setMetrics(prev => ({
        ...prev,
        operationsPerMinute: Math.floor(Math.random() * 20) + 35,
        connectedUsers: Math.floor(Math.random() * 5) + 10
      }));
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleString('es-ES'));
  };

  return (
    <div className="space-y-6">
      {/* Información del Sistema */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">
            Información del Sistema
          </h3>
        </div>
        <p className="text-blue-700 mt-2">
          Monitoreo automático de la base de datos y estructura de archivos
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
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">1,247</p>
                <p className="text-sm text-green-600">Archivos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">12h</p>
                <p className="text-sm text-purple-600">Ciclo de Actualización</p>
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

      {/* Diagrama de Flujo de BD */}
      <Card>
        <CardHeader className="bg-purple-50 border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-800">
                Diagrama de Flujo de Actualización de BD
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">
            ¿Cómo funciona? El sistema automáticamente detecta cambios en la base de datos y actualiza la documentación sin intervención manual. Cada agente puede ver en tiempo real qué tablas y campos han sido modificados.
          </p>

          {/* Diagrama Mermaid Real */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <MermaidDiagram 
              chart={`
graph TD
    A[🔄 Trigger de Actualización] --> B{📋 Tipo de Operación}
    
    B -->|CREATE| C[➕ Crear Registro]
    B -->|UPDATE| D[✏️ Actualizar Registro]
    B -->|DELETE| E[🗑️ Eliminar Registro]
    B -->|QUERY| F[🔍 Consultar Datos]
    
    C --> G[📝 Validar Datos]
    D --> G
    E --> G
    
    G --> H{✅ Validación Exitosa?}
    H -->|SÍ| I[💾 Guardar en Base de Datos]
    H -->|NO| J[❌ Error de Validación]
    
    I --> K[📊 Actualizar Métricas]
    K --> L[🔄 Sincronizar SGC]
    
    L --> M[📋 sgc_personal_relaciones]
    L --> N[📄 sgc_documentos_relacionados]
    L --> O[📚 sgc_normas_relacionadas]
    L --> P[⚙️ sgc_procesos_relacionados]
    
    M --> Q[📈 Actualizar Vistas]
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R[🔔 Notificar Agentes]
    R --> S[📊 Log de Auditoría]
    
    F --> T[🔍 Ejecutar Query]
    T --> U[📋 Filtrar por Organización]
    U --> V[🔒 Verificar Permisos]
    V --> W[📊 Retornar Resultados]
    
    J --> X[📝 Log de Errores]
    X --> Y[🔔 Alertar Administrador]
    
    S --> Z[✅ Operación Completada]
    W --> Z
    Y --> Z
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style J fill:#ffcdd2
    style Z fill:#e8f5e8
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
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Script que detecta cambios en BD</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Frecuencia: Cada 12 horas | Última ejecución: Hace 2h 15m
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
                  <RefreshCw className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Detección de Cambios</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Escanea tablas sgc_*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Métricas de Base de Datos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.totalRecords.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total de Registros</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.activeOrganizations}</p>
              <p className="text-sm text-gray-600">Organizaciones Activas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{metrics.connectedUsers}</p>
              <p className="text-sm text-gray-600">Usuarios Conectados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{metrics.operationsPerMinute}</p>
              <p className="text-sm text-gray-600">Operaciones/Minuto</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.responseTime}ms</p>
              <p className="text-sm text-gray-600">Tiempo de Respuesta</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-green-800">Sistema Operativo</span>
        </div>
        <div className="text-sm text-green-600">
          Última actualización: {lastUpdate}
        </div>
      </div>
    </div>
  );
};

export default DatabaseFlowViewer;
