import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Bot, 
  User,
  ArrowRight,
  Settings,
  FileText,
  Code,
  Database,
  Palette,
  TestTube
} from 'lucide-react';

const AgentWorkflowDemo = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const stages = [
    {
      id: 0,
      name: "📥 INPUT",
      description: "Orden de Trabajo",
      icon: <FileText className="w-6 h-6" />,
      content: "CRM de Clientes + Encuestas",
      status: "completed",
      agent: null,
      duration: "2 min"
    },
    {
      id: 1,
      name: "🎯 ANÁLISIS",
      description: "Requisitos y Arquitectura",
      icon: <Settings className="w-6 h-6" />,
      content: "División en Backend + Frontend",
      status: "completed",
      agent: "Cursor AI",
      duration: "5 min"
    },
    {
      id: 2,
      name: "⚙️ BACKEND",
      description: "APIs y Base de Datos",
      icon: <Database className="w-6 h-6" />,
      content: "AGENTE 1: STABILITY & CORE",
      status: currentStage >= 2 ? "in-progress" : "pending",
      agent: "AGENTE 1",
      duration: "4 horas"
    },
    {
      id: 3,
      name: "🎨 FRONTEND",
      description: "UI/UX y Componentes",
      icon: <Palette className="w-6 h-6" />,
      content: "AGENTE 2: UX & FEATURES",
      status: currentStage >= 3 ? "in-progress" : "pending",
      agent: "AGENTE 2",
      duration: "4 horas"
    },
    {
      id: 4,
      name: "🧪 TESTING",
      description: "Validación y QA",
      icon: <TestTube className="w-6 h-6" />,
      content: "Testing Automático + Manual",
      status: currentStage >= 4 ? "in-progress" : "pending",
      agent: "AGENTE 2",
      duration: "1 hora"
    },
    {
      id: 5,
      name: "✅ OUTPUT",
      description: "Entregable Final",
      icon: <CheckCircle className="w-6 h-6" />,
      content: "Sistema CRM Completo",
      status: currentStage >= 5 ? "completed" : "pending",
      agent: null,
      duration: "0 min"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return 'Pendiente';
    }
  };

  const startWorkflow = () => {
    setIsRunning(true);
    setCurrentStage(2);
  };

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const pauseWorkflow = () => {
    setIsRunning(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Sistema de Agentes - Demo de Flujo
        </h1>
        <p className="text-gray-600">
          Visualización del flujo de trabajo desde INPUT hasta OUTPUT
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <Button 
          onClick={startWorkflow} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Iniciar Flujo
        </Button>
        <Button 
          onClick={pauseWorkflow} 
          disabled={!isRunning}
          variant="outline"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pausar
        </Button>
        <Button 
          onClick={nextStage} 
          disabled={!isRunning || currentStage >= stages.length - 1}
          variant="outline"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Siguiente Etapa
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progreso General</span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStage + 1) / stages.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentStage + 1) / stages.length) * 100} />
      </div>

      {/* Workflow Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage, index) => (
          <Card 
            key={stage.id} 
            className={`transition-all duration-300 ${
              stage.status === 'in-progress' ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusColor(stage.status)}`}>
                    {stage.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={stage.status === 'completed' ? 'default' : 
                          stage.status === 'in-progress' ? 'secondary' : 'outline'}
                  className={stage.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                >
                  {getStatusText(stage.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{stage.content}</p>
                </div>
                
                {stage.agent && (
                  <div className="flex items-center gap-2">
                    {stage.agent === 'Cursor AI' ? (
                      <Bot className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm text-gray-600">{stage.agent}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{stage.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Status */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Estado Actual del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stages.filter(s => s.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Etapas Completadas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stages.filter(s => s.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {stages.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Points */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>🔗 Puntos de Integración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Cursor AI</div>
                  <div className="text-sm text-gray-600">Revisión de código y arquitectura</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Control Humano</div>
                  <div className="text-sm text-gray-600">Aprobaciones y decisiones críticas</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Code className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Agentes Automáticos</div>
                  <div className="text-sm text-gray-600">Desarrollo y testing automatizado</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentWorkflowDemo;
