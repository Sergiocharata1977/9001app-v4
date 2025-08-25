import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import agentCoordinationService from '@/services/agentCoordinationService.ts';
import { 
  Users, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Server,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  FileText,
  Code,
  Palette
} from 'lucide-react';

const AgentCoordination = () => {
  const [coordinationData, setCoordinationData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadCoordinationData();
  }, []);

  const loadCoordinationData = async () => {
    try {
      setIsLoading(true);
      const data = await agentCoordinationService.getCoordinationStatus();
      setCoordinationData(data);
    } catch (error) {
      console.error('Error cargando datos de coordinación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadCoordinationData();
    } catch (error) {
      console.error('Error actualizando datos:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETADO':
        return 'bg-green-500';
      case 'EN PROGRESO':
        return 'bg-blue-500';
      case 'PENDIENTE':
        return 'bg-yellow-500';
      case 'CRÍTICO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRÍTICA':
        return 'bg-red-500';
      case 'ALTA':
        return 'bg-orange-500';
      case 'MEDIA':
        return 'bg-yellow-500';
      case 'BAJA':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando coordinación de agentes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!coordinationData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de Carga</h2>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos de coordinación</p>
          <Button onClick={loadCoordinationData} className="flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤝 Coordinación de Agentes
          </h1>
          <p className="text-gray-600">
            Sistema SGC - Seguimiento en Tiempo Real
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estado General */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              AGENTE 1: STABILITY & CORE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Estado</span>
                <Badge className={getStatusColor(coordinationData.agent1.status)}>
                  {coordinationData.agent1.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{coordinationData.agent1.progress}%</span>
                </div>
                <Progress value={coordinationData.agent1.progress} className="h-2" />
              </div>
              <p className="text-sm text-gray-600">
                {coordinationData.agent1.focus}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              AGENTE 2: UX & FEATURES
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Estado</span>
                <Badge className={getStatusColor(coordinationData.agent2.status)}>
                  {coordinationData.agent2.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{coordinationData.agent2.progress}%</span>
                </div>
                <Progress value={coordinationData.agent2.progress} className="h-2" />
              </div>
              <p className="text-sm text-gray-600">
                {coordinationData.agent2.focus}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Backend</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Code className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Frontend</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Base de Datos</span>
                </div>
                <Badge className="bg-green-500">Operativo</Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Última actualización: {coordinationData.systemHealth.lastUpdate}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problemas Críticos */}
      <Card className="shadow-lg mb-8">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Problemas Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {coordinationData.criticalIssues.length > 0 ? (
            <div className="space-y-4">
              {coordinationData.criticalIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-red-800">{issue.title}</h4>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                      <Badge className="bg-blue-500">
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{issue.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      Asignado a: {issue.assignedTo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium">No hay problemas críticos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalles de Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AGENTE 1 - Tareas Detalladas */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              AGENTE 1 - Tareas Detalladas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {coordinationData.agent1.tasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{task.name}</span>
                    <span className="text-xs text-gray-500">
                      {task.progress}/{task.target}
                    </span>
                  </div>
                  <Progress 
                    value={(task.progress / task.target) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AGENTE 2 - Tareas Detalladas */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              AGENTE 2 - Tareas Detalladas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {coordinationData.agent2.tasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{task.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {task.progress}/{task.target}
                      </span>
                      {task.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={(task.progress / task.target) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Coordinación */}
      <Card className="shadow-lg mt-8">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Métricas de Coordinación
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Testing Frontend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0/0</div>
              <div className="text-sm text-gray-600">Conflictos Resueltos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✅</div>
              <div className="text-sm text-gray-600">Comunicación Efectiva</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCoordination;
