import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Activity,
  Settings,
  Shield,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  FileText,
  Users,
  Building2,
  BarChart3
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'data_processor' | 'notification' | 'backup' | 'monitoring' | 'migration' | 'analytics';
  status: 'active' | 'inactive' | 'running' | 'error';
  lastExecution: string;
  nextExecution: string;
  successRate: number;
  description: string;
}

const AgentCoordinator: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Data Processor Agent',
      type: 'data_processor',
      status: 'active',
      lastExecution: '2024-01-15 10:30:00',
      nextExecution: '2024-01-15 11:30:00',
      successRate: 98.5,
      description: 'Procesa y valida datos de organizaciones'
    },
    {
      id: '2',
      name: 'Notification Agent',
      type: 'notification',
      status: 'running',
      lastExecution: '2024-01-15 10:25:00',
      nextExecution: '2024-01-15 10:35:00',
      successRate: 99.2,
      description: 'Gestiona notificaciones automáticas'
    },
    {
      id: '3',
      name: 'Backup Agent',
      type: 'backup',
      status: 'active',
      lastExecution: '2024-01-15 02:00:00',
      nextExecution: '2024-01-16 02:00:00',
      successRate: 100,
      description: 'Realiza backups automáticos de la base de datos'
    },
    {
      id: '4',
      name: 'Monitoring Agent',
      type: 'monitoring',
      status: 'active',
      lastExecution: '2024-01-15 10:00:00',
      nextExecution: '2024-01-15 10:05:00',
      successRate: 99.8,
      description: 'Monitorea el estado del sistema'
    },
    {
      id: '5',
      name: 'Migration Agent',
      type: 'migration',
      status: 'inactive',
      lastExecution: '2024-01-14 15:00:00',
      nextExecution: '2024-01-16 15:00:00',
      successRate: 95.2,
      description: 'Gestiona migraciones de datos'
    },
    {
      id: '6',
      name: 'Analytics Agent',
      type: 'analytics',
      status: 'error',
      lastExecution: '2024-01-15 09:00:00',
      nextExecution: '2024-01-15 10:00:00',
      successRate: 87.3,
      description: 'Genera reportes analíticos'
    }
  ]);

  const [loading, setLoading] = useState(false);

  const getAgentTypeIcon = (type: string) => {
    const icons = {
      data_processor: Database,
      notification: Users,
      backup: Shield,
      monitoring: Activity,
      migration: RefreshCw,
      analytics: BarChart3
    };
    return icons[type as keyof typeof icons] || Bot;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Activo' },
      running: { color: 'bg-blue-100 text-blue-800', icon: Activity, label: 'Ejecutando' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Pause, label: 'Inactivo' },
      error: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Error' }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.inactive;
    const Icon = statusConfig.icon;
    
    return (
      <Badge className={statusConfig.color}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  const handleStartAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'running' as const }
        : agent
    ));
  };

  const handleStopAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'inactive' as const }
        : agent
    ));
  };

  const handleRestartAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'running' as const }
        : agent
    ));
  };

  const handleStartAllAgents = () => {
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'active' as const })));
  };

  const activeAgents = agents.filter(agent => agent.status === 'active' || agent.status === 'running');
  const runningAgents = agents.filter(agent => agent.status === 'running');
  const errorAgents = agents.filter(agent => agent.status === 'error');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Coordinator</h1>
          <p className="text-gray-600 mt-2">Gestión y monitoreo de agentes automatizados del sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleStartAllAgents}>
            <Play className="w-4 h-4 mr-2" />
            Ejecutar Todos
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Métricas de Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes Activos</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              de {agents.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Ejecución</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{runningAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              ejecutándose ahora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Sistema</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">OK</div>
            <p className="text-xs text-muted-foreground">
              {errorAgents.length} errores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.7%</div>
            <p className="text-xs text-muted-foreground">
              promedio general
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Agentes del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => {
              const TypeIcon = getAgentTypeIcon(agent.type);
              
              return (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(agent.status)}
                        <Badge variant="outline">{agent.successRate}% éxito</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Última ejecución</p>
                      <p className="text-sm font-medium">{agent.lastExecution}</p>
                    </div>
                    <div className="flex space-x-1">
                      {agent.status === 'inactive' && (
                        <Button size="sm" onClick={() => handleStartAgent(agent.id)}>
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      {agent.status === 'running' && (
                        <Button size="sm" variant="outline" onClick={() => handleStopAgent(agent.id)}>
                          <Pause className="w-3 h-3" />
                        </Button>
                      )}
                      {agent.status === 'error' && (
                        <Button size="sm" variant="outline" onClick={() => handleRestartAgent(agent.id)}>
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuración Avanzada */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Avanzada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Programación de Agentes</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup automático</span>
                  <Badge variant="outline">Diario 02:00</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monitoreo</span>
                  <Badge variant="outline">Cada 5 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notificaciones</span>
                  <Badge variant="outline">En tiempo real</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Alertas y Notificaciones</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Errores críticos</span>
                  <Badge className="bg-red-100 text-red-800">Activado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Advertencias</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Activado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Logs detallados</span>
                  <Badge variant="outline">Activado</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCoordinator;
