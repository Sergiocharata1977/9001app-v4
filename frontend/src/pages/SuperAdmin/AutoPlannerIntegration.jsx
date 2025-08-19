import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Zap,
  Database,
  Code,
  Palette,
  TestTube
} from 'lucide-react';

const AutoPlannerIntegration = () => {
  const [autoPlannerStatus, setAutoPlannerStatus] = useState('disconnected');
  const [agents, setAgents] = useState({});
  const [tasks, setTasks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Estado simulado del auto-planner (puerto 3001)
  const autoPlannerAgents = {
    refactor: { 
      name: "Agente Refactor", 
      status: "completed", 
      completed: 4, 
      icon: "🔄",
      color: "#3B82F6"
    },
    typescript: { 
      name: "Agente TypeScript", 
      status: "completed", 
      completed: 4, 
      icon: "📝",
      color: "#8B5CF6"
    },
    development: { 
      name: "Agente Desarrollo", 
      status: "idle", 
      completed: 0, 
      icon: "⚡",
      color: "#10B981"
    },
    qa: { 
      name: "Agente QA", 
      status: "idle", 
      completed: 0, 
      icon: "🧪",
      color: "#F59E0B"
    },
    forms: { 
      name: "Agente Formularios", 
      status: "idle", 
      completed: 0, 
      icon: "📋",
      color: "#EF4444"
    },
    amfe: { 
      name: "Agente AMFE", 
      status: "completed", 
      completed: 1, 
      icon: "⚠️",
      color: "#DC2626"
    }
  };

  // Tareas completadas del auto-planner
  const completedTasks = [
    {
      id: 'task-1',
      name: 'Refactorización de Capacitaciones',
      agent: 'refactor',
      status: 'completed',
      completedAt: '2024-01-15T10:30:00Z',
      duration: 45,
      description: 'Refactorización del módulo de Capacitaciones para usar DataTable genérico',
      files: ['CapacitacionesListingNEW.jsx', 'AppRoutes.jsx'],
      metrics: { linesReduced: 70, componentsReused: 1 }
    },
    {
      id: 'task-2',
      name: 'Refactorización de Auditorías',
      agent: 'refactor',
      status: 'completed',
      completedAt: '2024-01-15T11:15:00Z',
      duration: 60,
      description: 'Refactorización del módulo de Auditorías para usar DataTable genérico',
      files: ['AuditoriasListingNEW.jsx', 'AppRoutes.jsx'],
      metrics: { linesReduced: 65, componentsReused: 1 }
    },
    {
      id: 'task-3',
      name: 'Refactorización de Hallazgos',
      agent: 'refactor',
      status: 'completed',
      completedAt: '2024-01-15T12:00:00Z',
      duration: 75,
      description: 'Refactorización del módulo de Hallazgos para usar DataTable genérico',
      files: ['HallazgosListingNEW.jsx', 'AppRoutes.jsx'],
      metrics: { linesReduced: 80, componentsReused: 1 }
    },
    {
      id: 'task-4',
      name: 'Refactorización de Acciones',
      agent: 'refactor',
      status: 'completed',
      completedAt: '2024-01-15T13:30:00Z',
      duration: 90,
      description: 'Refactorización del módulo de Acciones para usar DataTable genérico',
      files: ['AccionesListingNEW.jsx', 'CrearAccionForm.jsx', 'Acciones.jsx'],
      metrics: { linesReduced: 85, componentsReused: 1 }
    },
    {
      id: 'task-5',
      name: 'Migración TypeScript - Capacitaciones',
      agent: 'typescript',
      status: 'completed',
      completedAt: '2024-01-15T14:45:00Z',
      duration: 45,
      description: 'Migración completa del módulo de Capacitaciones a TypeScript',
      files: ['capacitaciones.ts', 'CapacitacionesListingNEW.tsx', 'CapacitacionModal.tsx'],
      metrics: { typesDefined: 15, errorsFixed: 0 }
    },
    {
      id: 'task-6',
      name: 'Migración TypeScript - Auditorías',
      agent: 'typescript',
      status: 'completed',
      completedAt: '2024-01-15T15:30:00Z',
      duration: 50,
      description: 'Migración completa del módulo de Auditorías a TypeScript',
      files: ['auditorias.ts', 'AuditoriasListingNEW.tsx', 'AuditoriaModal.tsx'],
      metrics: { typesDefined: 18, errorsFixed: 0 }
    },
    {
      id: 'task-7',
      name: 'Migración TypeScript - Hallazgos',
      agent: 'typescript',
      status: 'completed',
      completedAt: '2024-01-15T16:15:00Z',
      duration: 55,
      description: 'Migración completa del módulo de Hallazgos a TypeScript',
      files: ['hallazgos.ts', 'HallazgosListingNEW.tsx', 'HallazgoModal.tsx'],
      metrics: { typesDefined: 20, errorsFixed: 0 }
    },
    {
      id: 'task-8',
      name: 'Migración TypeScript - Acciones',
      agent: 'typescript',
      status: 'completed',
      completedAt: '2024-01-15T17:00:00Z',
      duration: 60,
      description: 'Migración completa del módulo de Acciones a TypeScript',
      files: ['acciones.ts', 'AccionesListingNEW.tsx', 'AccionModal.tsx'],
      metrics: { typesDefined: 22, errorsFixed: 0 }
    },
    {
      id: 'task-9',
      name: 'Implementación Sistema AMFE',
      agent: 'amfe',
      status: 'completed',
      completedAt: '2024-01-15T18:30:00Z',
      duration: 120,
      description: 'Implementación básica del sistema de Análisis Modal de Fallos y Efectos',
      files: ['AMFEDashboard.tsx', 'AMFEMain.tsx', 'AMFEModal.tsx'],
      metrics: { componentsCreated: 3, featuresImplemented: 5 }
    }
  ];

  useEffect(() => {
    // Simular conexión al auto-planner
    setAutoPlannerStatus('connected');
    setAgents(autoPlannerAgents);
    setTasks(completedTasks);
  }, []);

  const connectToAutoPlanner = () => {
    setAutoPlannerStatus('connecting');
    setTimeout(() => {
      setAutoPlannerStatus('connected');
    }, 1000);
  };

  const openAutoPlannerDashboard = () => {
    window.open('http://localhost:3001', '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'idle': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'idle': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const totalCompletedTasks = Object.values(autoPlannerAgents).reduce((sum, agent) => sum + agent.completed, 0);
  const totalAgents = Object.keys(autoPlannerAgents).length;
  const activeAgents = Object.values(autoPlannerAgents).filter(agent => agent.status === 'completed').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Integración con Auto-Planner
        </h1>
        <p className="text-gray-600">
          Conexión con el sistema auto-planner existente (Puerto 3001)
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Estado de Conexión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  autoPlannerStatus === 'connected' ? 'bg-green-500' : 
                  autoPlannerStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium">
                  {autoPlannerStatus === 'connected' ? 'Conectado' : 
                   autoPlannerStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
                </span>
                <span className="text-sm text-gray-500">Puerto 3001</span>
              </div>
              <div className="flex gap-2">
                {autoPlannerStatus !== 'connected' && (
                  <Button onClick={connectToAutoPlanner} size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Conectar
                  </Button>
                )}
                <Button onClick={openAutoPlannerDashboard} variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agentes Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalAgents}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompletedTasks}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-gray-900">90%</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Status */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Agentes Especializados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(autoPlannerAgents).map(([key, agent]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{agent.icon}</div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.completed} tareas completadas</p>
                      </div>
                    </div>
                    <Badge 
                      variant={agent.status === 'completed' ? 'default' : 'outline'}
                      className={agent.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {getStatusText(agent.status)}
                    </Badge>
                  </div>
                  <Progress 
                    value={agent.status === 'completed' ? 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tareas Recientes Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{autoPlannerAgents[task.agent]?.icon}</div>
                      <div>
                        <h3 className="font-medium">{task.name}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Duración</div>
                      <div className="font-medium">{task.duration} min</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Agente: {autoPlannerAgents[task.agent]?.name}</span>
                    <span>Archivos: {task.files.length}</span>
                    {task.metrics && (
                      <span>
                        {task.metrics.linesReduced && `Líneas reducidas: ${task.metrics.linesReduced}`}
                        {task.metrics.typesDefined && `Tipos definidos: ${task.metrics.typesDefined}`}
                        {task.metrics.componentsCreated && `Componentes: ${task.metrics.componentsCreated}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Info */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de Integración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Sistema Auto-Planner (Puerto 3001)</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Dashboard web con WebSocket en tiempo real</li>
                  <li>• 6 agentes especializados configurados</li>
                  <li>• Sistema de planificación con fases</li>
                  <li>• Prompts contextuales inteligentes</li>
                  <li>• Reportería en JSON</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Integración con Coordinación</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Mapeo de agentes especializados a generales</li>
                  <li>• Sincronización de estados en tiempo real</li>
                  <li>• Unificación de métricas y reportes</li>
                  <li>• Control centralizado desde Super Admin</li>
                  <li>• Logs unificados y trazabilidad</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button onClick={openAutoPlannerDashboard} className="bg-indigo-600 hover:bg-indigo-700">
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir Auto-Planner Dashboard
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Integración
        </Button>
        <Button variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Ver Logs Detallados
        </Button>
      </div>
    </div>
  );
};

export default AutoPlannerIntegration;
