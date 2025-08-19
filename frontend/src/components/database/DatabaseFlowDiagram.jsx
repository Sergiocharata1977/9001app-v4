import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Activity
} from 'lucide-react';

const DatabaseFlowDiagram = () => {
  const flowSteps = [
    {
      id: 1,
      title: 'Rastreador Automático',
      description: 'Script que detecta cambios en BD',
      icon: <Database className="w-6 h-6 text-blue-500" />,
      status: 'active',
      frequency: 'Cada 12 horas',
      lastRun: 'Hace 2h 15m'
    },
    {
      id: 2,
      title: 'Detección de Cambios',
      description: 'Escanea tablas sgc_*',
      icon: <RefreshCw className="w-6 h-6 text-green-500" />,
      status: 'active',
      frequency: 'Automático',
      lastRun: 'Hace 2h 15m'
    },
    {
      id: 3,
      title: 'Actualización de Documento',
      description: 'Actualiza COORDINACION-AGENTES.md',
      icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
      status: 'active',
      frequency: 'Automático',
      lastRun: 'Hace 2h 15m'
    },
    {
      id: 4,
      title: 'Sincronización Frontend',
      description: 'Muestra cambios en Super Admin',
      icon: <Activity className="w-6 h-6 text-orange-500" />,
      status: 'active',
      frequency: 'Cada 15 min',
      lastRun: 'Hace 12m'
    }
  ];

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

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Diagrama de Flujo de Actualización de BD
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Descripción */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>¿Cómo funciona?</strong> El sistema automáticamente detecta cambios en la base de datos 
              y actualiza la documentación sin intervención manual. Cada agente puede ver en tiempo real 
              qué tablas y campos han sido modificados.
            </p>
          </div>

          {/* Flujo de Procesos */}
          <div className="space-y-4">
            {flowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                {/* Número del paso */}
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>

                {/* Icono */}
                <div className="flex-shrink-0">
                  {step.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <Badge className={getStatusColor(step.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(step.status)}
                        <span>{step.status === 'active' ? 'Activo' : step.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Frecuencia: {step.frequency}</span>
                    <span>Última ejecución: {step.lastRun}</span>
                  </div>
                </div>

                {/* Flecha (excepto para el último) */}
                {index < flowSteps.length - 1 && (
                  <div className="flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Tablas Monitoreadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600">Campos Rastreados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12h</div>
              <div className="text-sm text-gray-600">Ciclo de Actualización</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseFlowDiagram;
