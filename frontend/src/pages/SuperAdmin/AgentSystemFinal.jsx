import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw,
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
  TestTube,
  Users,
  GitBranch,
  MessageSquare,
  FileText,
  Shield,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const AgentSystemFinal = () => {
  const [activeTab, setActiveTab] = useState('planificacion');
  const [selectedCoordinator, setSelectedCoordinator] = useState('coordinator1');
  const [expandedAgents, setExpandedAgents] = useState([]);
  const [chatMessages, setChatMessages] = useState({});

  // Agentes Coordinadores (Superiores)
  const coordinators = {
    coordinator1: {
      id: 'coordinator1',
      name: 'Agente Coordinador 1',
      role: 'Stability & Core Systems',
      status: 'active',
      progress: 85,
      color: '#8B5CF6',
      icon: Shield,
      subAgents: ['refactor', 'typescript', 'database']
    },
    coordinator2: {
      id: 'coordinator2',
      name: 'Agente Coordinador 2',
      role: 'UX & Features',
      status: 'active',
      progress: 72,
      color: '#10B981',
      icon: Palette,
      subAgents: ['development', 'qa', 'forms']
    },
    coordinator3: {
      id: 'coordinator3',
      name: 'Agente Coordinador 3',
      role: 'Quality & Control',
      status: 'idle',
      progress: 45,
      color: '#F59E0B',
      icon: TestTube,
      subAgents: ['amfe', 'testing', 'validation']
    }
  };

  // Sub-Agentes
  const subAgents = {
    refactor: { name: 'Agente Refactor', status: 'completed', icon: '🔄', color: '#3B82F6' },
    typescript: { name: 'Agente TypeScript', status: 'completed', icon: '📝', color: '#8B5CF6' },
    database: { name: 'Agente Database', status: 'in-progress', icon: '🗄️', color: '#6366F1' },
    development: { name: 'Agente Desarrollo', status: 'in-progress', icon: '⚡', color: '#10B981' },
    qa: { name: 'Agente QA', status: 'idle', icon: '🧪', color: '#F59E0B' },
    forms: { name: 'Agente Formularios', status: 'idle', icon: '📋', color: '#EF4444' },
    amfe: { name: 'Agente AMFE', status: 'completed', icon: '⚠️', color: '#DC2626' },
    testing: { name: 'Agente Testing', status: 'in-progress', icon: '🔍', color: '#059669' },
    validation: { name: 'Agente Validación', status: 'idle', icon: '✅', color: '#7C3AED' }
  };

  // Etapas del flujo
  const workflowStages = {
    planificacion: {
      name: 'Planificación',
      status: 'completed',
      description: 'Análisis de requisitos y planificación de tareas',
      icon: FileText,
      color: '#10B981'
    },
    ejecucion: {
      name: 'Ejecución',
      status: 'in-progress',
      description: 'Desarrollo y implementación por sub-agentes',
      icon: Code,
      color: '#3B82F6'
    },
    control: {
      name: 'Control',
      status: 'pending',
      description: 'Monitoreo y corrección de problemas',
      icon: Shield,
      color: '#F59E0B'
    },
    entrega: {
      name: 'Entrega',
      status: 'pending',
      description: 'Entrega final del trabajo completado',
      icon: CheckCircle,
      color: '#8B5CF6'
    }
  };

  // Mensajes de chat simulados
  const generateChatMessages = (agentId) => {
    const messages = [
      { id: 1, sender: 'system', message: 'Iniciando tarea de refactorización...', timestamp: '10:30' },
      { id: 2, sender: agentId, message: 'Analizando código fuente...', timestamp: '10:31' },
      { id: 3, sender: 'system', message: 'Detectados 3 archivos para refactorizar', timestamp: '10:32' },
      { id: 4, sender: agentId, message: 'Refactorización completada. Líneas reducidas: 45', timestamp: '10:35' },
      { id: 5, sender: 'coordinator', message: '✅ Tarea aprobada. Continuar con siguiente módulo.', timestamp: '10:36' }
    ];
    return messages;
  };

  useEffect(() => {
    // Generar mensajes de chat para cada agente
    const messages = {};
    Object.keys(subAgents).forEach(agentId => {
      messages[agentId] = generateChatMessages(agentId);
    });
    setChatMessages(messages);
  }, []);

  const toggleAgentExpansion = (agentId) => {
    setExpandedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-300';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'active': return 'Activo';
      case 'idle': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Sistema de Agentes Coordinadores
        </h1>
        <p className="text-gray-600">
          Gestión avanzada de agentes con coordinación jerárquica y control en tiempo real
        </p>
      </div>

      {/* Agentes Coordinadores (Pestañas Verticales) */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Sidebar con Coordinadores */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Agentes Coordinadores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.values(coordinators).map((coordinator) => (
                <div
                  key={coordinator.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCoordinator === coordinator.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedCoordinator(coordinator.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <coordinator.icon className="w-5 h-5" style={{ color: coordinator.color }} />
                      <div>
                        <h3 className="font-semibold text-sm">{coordinator.name}</h3>
                        <p className="text-xs text-gray-500">{coordinator.role}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={coordinator.status === 'active' ? 'default' : 'outline'}
                      className={coordinator.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {getStatusText(coordinator.status)}
                    </Badge>
                  </div>
                  <Progress value={coordinator.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{coordinator.progress}% completado</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Área Principal con Pestañas */}
        <div className="col-span-9">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <coordinators[selectedCoordinator].icon 
                    className="w-6 h-6" 
                    style={{ color: coordinators[selectedCoordinator].color }} 
                  />
                  <span>{coordinators[selectedCoordinator].name}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-1" />
                    Iniciar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="w-4 h-4 mr-1" />
                    Pausar
                  </Button>
                  <Button size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reiniciar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  {Object.entries(workflowStages).map(([key, stage]) => (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                      {getStageIcon(stage.status)}
                      {stage.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Contenido de Planificación */}
                <TabsContent value="planificacion" className="mt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">✅ Planificación Completada</h3>
                      <p className="text-green-700 text-sm">
                        Análisis de requisitos finalizado. Se han identificado 12 tareas principales 
                        distribuidas entre {coordinators[selectedCoordinator].subAgents.length} sub-agentes.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tareas Planificadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {coordinators[selectedCoordinator].subAgents.map((agentId) => (
                              <div key={agentId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{subAgents[agentId].name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {subAgents[agentId].status === 'completed' ? 'Listo' : 'Pendiente'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Métricas de Planificación</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Tareas Totales:</span>
                              <span className="font-semibold">12</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Tiempo Estimado:</span>
                              <span className="font-semibold">4.5h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Prioridad:</span>
                              <Badge className="bg-red-100 text-red-800">Alta</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Contenido de Ejecución */}
                <TabsContent value="ejecucion" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Sub-Agentes en Ejecución</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {coordinators[selectedCoordinator].subAgents.filter(id => 
                          subAgents[id].status === 'in-progress'
                        ).length} Activos
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {coordinators[selectedCoordinator].subAgents.map((agentId) => {
                        const agent = subAgents[agentId];
                        const isExpanded = expandedAgents.includes(agentId);
                        
                        return (
                          <Card key={agentId} className="overflow-hidden">
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-50"
                              onClick={() => toggleAgentExpansion(agentId)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{agent.icon}</span>
                                  <div>
                                    <h4 className="font-medium">{agent.name}</h4>
                                    <p className="text-sm text-gray-500">Estado: {getStatusText(agent.status)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={agent.status === 'completed' ? 'default' : 'outline'}
                                    className={agent.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                  >
                                    {getStatusText(agent.status)}
                                  </Badge>
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="border-t bg-gray-50">
                                <div className="p-4">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Chat del Agente */}
                                    <div>
                                      <h5 className="font-medium mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Chat del Agente
                                      </h5>
                                      <div className="bg-white rounded-lg border p-3 h-48 overflow-y-auto">
                                        {chatMessages[agentId]?.map((msg) => (
                                          <div key={msg.id} className="mb-2">
                                            <div className={`text-xs text-gray-500 mb-1 ${msg.sender === 'system' ? 'text-blue-600' : msg.sender === 'coordinator' ? 'text-purple-600' : 'text-green-600'}`}>
                                              {msg.sender === 'system' ? 'Sistema' : msg.sender === 'coordinator' ? 'Coordinador' : agent.name} - {msg.timestamp}
                                            </div>
                                            <div className="text-sm bg-gray-100 p-2 rounded">
                                              {msg.message}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Métricas del Agente */}
                                    <div>
                                      <h5 className="font-medium mb-3 flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        Métricas
                                      </h5>
                                      <div className="space-y-3">
                                        <div className="bg-white rounded-lg border p-3">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm">Progreso</span>
                                            <span className="text-sm font-medium">75%</span>
                                          </div>
                                          <Progress value={75} className="h-2" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="bg-white rounded-lg border p-2 text-center">
                                            <div className="text-lg font-bold text-blue-600">3</div>
                                            <div className="text-xs text-gray-500">Tareas</div>
                                          </div>
                                          <div className="bg-white rounded-lg border p-2 text-center">
                                            <div className="text-lg font-bold text-green-600">45m</div>
                                            <div className="text-xs text-gray-500">Tiempo</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                {/* Contenido de Control */}
                <TabsContent value="control" className="mt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Control y Monitoreo</h3>
                      <p className="text-yellow-700 text-sm">
                        Sistema de control activo. Monitoreando coordinación entre agentes y 
                        corrigiendo problemas automáticamente.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Problemas Detectados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="p-2 bg-red-50 border border-red-200 rounded">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-700">Conflicto de dependencias en módulo A</span>
                              </div>
                            </div>
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-yellow-700">Agente QA tardando más de lo esperado</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Acciones de Control</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="p-2 bg-green-50 border border-green-200 rounded">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-700">Dependencias resueltas automáticamente</span>
                              </div>
                            </div>
                            <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-700">Recursos reasignados a QA</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Contenido de Entrega */}
                <TabsContent value="entrega" className="mt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">📦 Entrega Final</h3>
                      <p className="text-purple-700 text-sm">
                        Preparando entrega final del trabajo completado. 
                        Validando calidad y generando documentación.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Archivos Generados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span>código_final.zip</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-green-500" />
                              <span>documentación.pdf</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-purple-500" />
                              <span>reporte_qa.json</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Métricas Finales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Tiempo Total:</span>
                              <span className="font-semibold">4.2h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tareas Completadas:</span>
                              <span className="font-semibold">12/12</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Calidad:</span>
                              <Badge className="bg-green-100 text-green-800">95%</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Estado de Entrega</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-green-700">Listo para Entrega</p>
                            <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resumen del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coordinadores Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(coordinators).filter(c => c.status === 'active').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sub-Agentes Trabajando</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(subAgents).filter(a => a.status === 'in-progress').length}
                </p>
              </div>
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia del Sistema</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentSystemFinal;
