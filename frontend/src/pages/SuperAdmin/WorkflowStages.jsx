import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bot,
  User,
  Code,
  Database,
  Palette,
  TestTube,
  FileText,
  Settings,
  Zap,
  GitBranch
} from 'lucide-react';

const WorkflowStages = () => {
  const [expandedStage, setExpandedStage] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);

  const workflowStages = [
    {
      id: 0,
      name: "📥 INPUT",
      description: "Orden de Trabajo Entrante",
      icon: <FileText className="w-6 h-6" />,
      status: "completed",
      duration: "2 min",
      details: {
        input: "CRM de Clientes + Encuestas Anuales + Post-Venta",
        requirements: [
          "Gestión completa de clientes (CRUD)",
          "Encuestas anuales automáticas",
          "Encuestas post-venta",
          "Dashboard de métricas",
          "Integración con sistema ISO 9001"
        ],
        technologies: ["React", "TypeScript", "Node.js", "Turso DB"],
        estimatedHours: 80
      },
      agent: null,
      files: [],
      logs: ["✅ Orden recibida", "✅ Requisitos validados", "✅ Presupuesto aprobado"]
    },
    {
      id: 1,
      name: "🎯 ANÁLISIS",
      description: "Análisis de Requisitos y Arquitectura",
      icon: <Settings className="w-6 h-6" />,
      status: "completed",
      duration: "15 min",
      details: {
        architecture: {
          backend: ["API REST", "Base de datos Turso", "Autenticación"],
          frontend: ["React + TypeScript", "Componentes reutilizables", "Responsive design"],
          integration: ["Sistema existente", "APIs externas"]
        },
        modules: [
          "Módulo de Clientes",
          "Módulo de Encuestas",
          "Módulo de Reportes",
          "Módulo de Dashboard"
        ]
      },
      agent: "Cursor AI",
      files: ["requirements.md", "architecture.md"],
      logs: ["🤖 Cursor AI: Analizando requisitos", "✅ Arquitectura definida", "✅ Módulos identificados"]
    },
    {
      id: 2,
      name: "⚙️ BACKEND",
      description: "Desarrollo de APIs y Base de Datos",
      icon: <Database className="w-6 h-6" />,
      status: currentStage >= 2 ? "in-progress" : "pending",
      duration: "4 horas",
      details: {
        tasks: [
          "Crear modelo de datos para clientes",
          "Crear modelo de datos para encuestas",
          "Implementar API REST para clientes",
          "Implementar API REST para encuestas",
          "Configurar autenticación y autorización",
          "Implementar validaciones de negocio"
        ],
        endpoints: [
          "GET /api/clientes",
          "POST /api/clientes",
          "PUT /api/clientes/:id",
          "DELETE /api/clientes/:id",
          "GET /api/encuestas",
          "POST /api/encuestas"
        ],
        database: {
          tables: ["clientes", "encuestas", "respuestas_encuestas"],
          migrations: ["001_create_clientes", "002_create_encuestas"]
        }
      },
      agent: "AGENTE 1: STABILITY & CORE",
      files: ["backend/models/", "backend/routes/", "backend/middleware/"],
      logs: [
        "⚙️ AGENTE 1: Iniciando desarrollo backend",
        "📊 Creando modelos de datos",
        "🔧 Implementando APIs REST",
        "🔐 Configurando autenticación"
      ]
    },
    {
      id: 3,
      name: "🎨 FRONTEND",
      description: "Desarrollo de UI/UX y Componentes",
      icon: <Palette className="w-6 h-6" />,
      status: currentStage >= 3 ? "in-progress" : "pending",
      duration: "4 horas",
      details: {
        components: [
          "ClienteList.tsx - Lista de clientes",
          "ClienteForm.tsx - Formulario de cliente",
          "EncuestaList.tsx - Lista de encuestas",
          "EncuestaForm.tsx - Formulario de encuesta",
          "Dashboard.tsx - Dashboard principal",
          "MetricsChart.tsx - Gráficos de métricas"
        ],
        pages: [
          "/clientes - Gestión de clientes",
          "/encuestas - Gestión de encuestas",
          "/dashboard - Dashboard principal",
          "/reportes - Reportes y métricas"
        ],
        features: [
          "Responsive design",
          "Dark/Light mode",
          "Filtros avanzados",
          "Exportación de datos",
          "Notificaciones en tiempo real"
        ]
      },
      agent: "AGENTE 2: UX & FEATURES",
      files: ["frontend/components/", "frontend/pages/", "frontend/hooks/"],
      logs: [
        "🎨 AGENTE 2: Iniciando desarrollo frontend",
        "📱 Creando componentes React",
        "🎨 Implementando UI/UX",
        "📊 Integrando gráficos y métricas"
      ]
    },
    {
      id: 4,
      name: "🧪 TESTING",
      description: "Testing Automático y Manual",
      icon: <TestTube className="w-6 h-6" />,
      status: currentStage >= 4 ? "in-progress" : "pending",
      duration: "1 hora",
      details: {
        automated: [
          "Unit tests para APIs",
          "Unit tests para componentes",
          "Integration tests",
          "E2E tests con Cypress"
        ],
        manual: [
          "Testing de funcionalidad",
          "Testing de UI/UX",
          "Testing de encuestas",
          "Testing de integración"
        ],
        coverage: {
          backend: "85%",
          frontend: "80%",
          e2e: "70%"
        }
      },
      agent: "AGENTE 2: UX & FEATURES",
      files: ["tests/", "cypress/", "coverage/"],
      logs: [
        "🧪 AGENTE 2: Iniciando testing",
        "🔍 Ejecutando tests unitarios",
        "🌐 Ejecutando tests E2E",
        "✅ Coverage: Backend 85%, Frontend 80%"
      ]
    },
    {
      id: 5,
      name: "✅ OUTPUT",
      description: "Entregable Final y Deploy",
      icon: <CheckCircle className="w-6 h-6" />,
      status: currentStage >= 5 ? "completed" : "pending",
      duration: "30 min",
      details: {
        deliverables: [
          "Sistema CRM completo",
          "APIs documentadas",
          "Componentes reutilizables",
          "Documentación de usuario",
          "Guía de instalación"
        ],
        deployment: {
          backend: "VPS con Node.js",
          frontend: "Vercel/Netlify",
          database: "Turso DB"
        },
        metrics: {
          totalHours: 80,
          linesOfCode: 2500,
          testCoverage: 85,
          performanceScore: 92
        }
      },
      agent: null,
      files: ["dist/", "docs/", "deployment/"],
      logs: [
        "🚀 Preparando deploy",
        "📦 Build completado",
        "🌐 Deploy en producción",
        "✅ Sistema CRM activo"
      ]
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

  const toggleStage = (stageId) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const startWorkflow = () => {
    setCurrentStage(2);
  };

  const nextStage = () => {
    if (currentStage < workflowStages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔄 Etapas Detalladas del Flujo de Trabajo
        </h1>
        <p className="text-gray-600">
          Vista técnica completa de cada etapa del proceso de desarrollo
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <Button 
          onClick={startWorkflow} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Iniciar Flujo
        </Button>
        <Button 
          onClick={nextStage} 
          disabled={currentStage >= workflowStages.length - 1}
          variant="outline"
        >
          <Zap className="w-4 h-4 mr-2" />
          Siguiente Etapa
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progreso del Proyecto</span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStage + 1) / workflowStages.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentStage + 1) / workflowStages.length) * 100} />
      </div>

      {/* Workflow Stages */}
      <div className="space-y-4">
        {workflowStages.map((stage) => (
          <Card 
            key={stage.id} 
            className={`transition-all duration-300 ${
              stage.status === 'in-progress' ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
          >
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => toggleStage(stage.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${getStatusColor(stage.status)}`}>
                    {stage.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{stage.name}</CardTitle>
                    <p className="text-gray-600">{stage.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Duración</div>
                    <div className="font-medium">{stage.duration}</div>
                  </div>
                  <Badge 
                    variant={stage.status === 'completed' ? 'default' : 
                            stage.status === 'in-progress' ? 'secondary' : 'outline'}
                    className={stage.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {getStatusText(stage.status)}
                  </Badge>
                  {expandedStage === stage.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedStage === stage.id && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Agent Info */}
                  {stage.agent && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        {stage.agent === 'Cursor AI' ? (
                          <Bot className="w-4 h-4 text-blue-600" />
                        ) : (
                          <User className="w-4 h-4 text-green-600" />
                        )}
                        Agente Responsable
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">{stage.agent}</span>
                      </div>
                    </div>
                  )}

                  {/* Files */}
                  {stage.files.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Archivos Generados
                      </h4>
                      <div className="space-y-1">
                        {stage.files.map((file, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  {stage.details && (
                    <div className="space-y-3 lg:col-span-2">
                      <h4 className="font-semibold">Detalles Técnicos</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {stage.details.input && (
                          <div className="mb-3">
                            <strong>Input:</strong> {stage.details.input}
                          </div>
                        )}
                        {stage.details.requirements && (
                          <div className="mb-3">
                            <strong>Requisitos:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {stage.details.requirements.map((req, index) => (
                                <li key={index} className="text-sm">{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.details.tasks && (
                          <div className="mb-3">
                            <strong>Tareas:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {stage.details.tasks.map((task, index) => (
                                <li key={index} className="text-sm">{task}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.details.components && (
                          <div className="mb-3">
                            <strong>Componentes:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {stage.details.components.map((comp, index) => (
                                <li key={index} className="text-sm">{comp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.details.endpoints && (
                          <div className="mb-3">
                            <strong>Endpoints:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {stage.details.endpoints.map((endpoint, index) => (
                                <li key={index} className="text-sm font-mono">{endpoint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.details.deliverables && (
                          <div className="mb-3">
                            <strong>Entregables:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {stage.details.deliverables.map((deliverable, index) => (
                                <li key={index} className="text-sm">{deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Logs */}
                  <div className="space-y-3 lg:col-span-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Logs de Actividad
                    </h4>
                    <div className="space-y-2">
                      {stage.logs.map((log, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStages;
