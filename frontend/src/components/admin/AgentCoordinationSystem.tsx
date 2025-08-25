import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Settings,
  Monitor,
  Send,
  Clock,
  Target,
  Zap,
  Shield,
  Package,
  Crown,
  Bot
} from 'lucide-react';

const AgentCoordinationSystem = () => {
  const [activeTab, setActiveTab] = useState('planificacion');
  const [activeSubTab, setActiveSubTab] = useState('agente1');
  const [messages, setMessages] = useState({});
  const [agentStatus, setAgentStatus] = useState({});
  const [newMessage, setNewMessage] = useState('');

  // Configuración de agentes coordinadores
  const coordinadores = [
    {
      id: 'planificacion',
      name: 'Planificación',
      icon: Target,
      color: 'blue',
      description: 'Agentes que planifican y organizan tareas',
      subAgentes: [
        { id: 'agente1', name: 'Agente Estratégico', status: 'active', role: 'Define objetivos y estrategias' },
        { id: 'agente2', name: 'Agente Táctico', status: 'active', role: 'Planifica recursos y tiempos' },
        { id: 'agente3', name: 'Agente Operativo', status: 'idle', role: 'Organiza tareas específicas' }
      ]
    },
    {
      id: 'ejecucion',
      name: 'Ejecución',
      icon: Play,
      color: 'green',
      description: 'Agentes que ejecutan las tareas planificadas',
      subAgentes: [
        { id: 'agente4', name: 'Agente Desarrollador', status: 'active', role: 'Desarrolla código y funcionalidades' },
        { id: 'agente5', name: 'Agente Tester', status: 'active', role: 'Prueba y valida resultados' },
        { id: 'agente6', name: 'Agente Despliegue', status: 'idle', role: 'Despliega y configura sistemas' }
      ]
    },
    {
      id: 'control',
      name: 'Control',
      icon: Monitor,
      color: 'orange',
      description: 'Agente que controla y coordina todo el proceso',
      subAgentes: [
        { id: 'agente7', name: 'Agente Coordinador', status: 'active', role: 'Coordina y supervisa todos los agentes' },
        { id: 'agente8', name: 'Agente Resolución', status: 'active', role: 'Resuelve conflictos y problemas' }
      ]
    },
    {
      id: 'entrega',
      name: 'Entrega',
      icon: Package,
      color: 'purple',
      description: 'Agentes que finalizan y entregan el trabajo',
      subAgentes: [
        { id: 'agente9', name: 'Agente Validación', status: 'active', role: 'Valida calidad y cumplimiento' },
        { id: 'agente10', name: 'Agente Entrega', status: 'idle', role: 'Entrega final al cliente' }
      ]
    }
  ];

  // Inicializar mensajes de chat
  useEffect(() => {
    const initialMessages = {};
    coordinadores.forEach(coordinador => {
      coordinador.subAgentes.forEach(agente => {
        initialMessages[agente.id] = [
          {
            id: 1,
            sender: agente.id,
            message: `Hola, soy ${agente.name}. ${agente.role}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'system'
          }
        ];
      });
    });
    setMessages(initialMessages);
  }, []);

  // Inicializar estado de agentes
  useEffect(() => {
    const initialStatus = {};
    coordinadores.forEach(coordinador => {
      coordinador.subAgentes.forEach(agente => {
        initialStatus[agente.id] = {
          status: agente.status,
          progress: agente.status === 'active' ? Math.floor(Math.random() * 100) : 0,
          lastActivity: new Date().toLocaleTimeString()
        };
      });
    });
    setAgentStatus(initialStatus);
  }, []);

  const sendMessage = (agentId) => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: 'user'
    };

    setMessages(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), message]
    }));

    // Simular respuesta del agente
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        sender: agentId,
        message: `Entendido. Procesando: "${newMessage}"`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'agent'
      };

      setMessages(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), agentResponse]
      }));
    }, 1000);

    setNewMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'idle': return Clock;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-blue-50';
      case 'green': return 'bg-green-500 hover:bg-green-600 text-green-50';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600 text-orange-50';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600 text-purple-50';
      default: return 'bg-gray-500 hover:bg-gray-600 text-gray-50';
    }
  };

  const getColorLight = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200';
      case 'green': return 'bg-green-50 border-green-200';
      case 'orange': return 'bg-orange-50 border-orange-200';
      case 'purple': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const currentCoordinador = coordinadores.find(c => c.id === activeTab);
  const currentAgente = currentCoordinador?.subAgentes.find(a => a.id === activeSubTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
                  <Bot className="w-8 h-8" />
                  Sistema de Coordinación de Agentes
                </h1>
                <p className="text-slate-600">
                  Gestión inteligente de agentes coordinadores y sub-agentes
                </p>
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
                Sistema Activo
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Coordinadores */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-purple-600 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Agentes Coordinadores
                </h2>
              </div>
              
              <div className="p-2">
                {coordinadores.map((coordinador) => (
                  <div key={coordinador.id} className="mb-2">
                    <button
                      onClick={() => setActiveTab(coordinador.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === coordinador.id 
                          ? getColorClasses(coordinador.color)
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <coordinador.icon className="w-5 h-5" />
                        <div>
                          <div className="font-semibold">{coordinador.name}</div>
                          <div className="text-xs opacity-75 truncate">
                            {coordinador.description}
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {activeTab === coordinador.id && (
                      <div className={`mt-2 p-2 rounded-lg border ${getColorLight(coordinador.color)}`}>
                        {coordinador.subAgentes.map((agente) => {
                          const StatusIcon = getStatusIcon(agentStatus[agente.id]?.status);
                          return (
                            <button
                              key={agente.id}
                              onClick={() => setActiveSubTab(agente.id)}
                              className={`w-full text-left p-2 rounded-md transition-colors flex items-center gap-2 ${
                                activeSubTab === agente.id 
                                  ? getColorClasses(coordinador.color)
                                  : 'hover:bg-white/50'
                              }`}
                            >
                              <StatusIcon className={`w-4 h-4 ${
                                agentStatus[agente.id]?.status === 'active' ? 'text-green-500' :
                                agentStatus[agente.id]?.status === 'idle' ? 'text-yellow-500' :
                                'text-gray-500'
                              }`} />
                              <span className="text-sm">{agente.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
              {/* Header del agente activo */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <currentCoordinador.icon className={`w-6 h-6 text-${currentCoordinador.color}-500`} />
                      <h2 className="text-xl font-bold">{currentAgente?.name}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agentStatus[activeSubTab]?.status)}`}>
                        {agentStatus[activeSubTab]?.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{currentAgente?.role}</p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="text-sm text-slate-500">
                      Última actividad: {agentStatus[activeSubTab]?.lastActivity}
                    </p>
                    <div className="w-48 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentCoordinador.color === 'blue' ? 'bg-blue-500' :
                          currentCoordinador.color === 'green' ? 'bg-green-500' :
                          currentCoordinador.color === 'orange' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${agentStatus[activeSubTab]?.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages[activeSubTab]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        <div className="text-xs font-semibold mb-1">
                          {msg.type === 'user' ? 'Tú' : currentAgente?.name}
                        </div>
                        <div className="text-sm">{msg.message}</div>
                        <div className={`text-xs mt-1 ${msg.type === 'user' ? 'text-purple-100' : 'text-slate-500'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Enviar mensaje a ${currentAgente?.name}...`}
                    className="flex-1 p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(activeSubTab);
                      }
                    }}
                  />
                  <button
                    onClick={() => sendMessage(activeSubTab)}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    Agentes Activos: {Object.values(agentStatus).filter(s => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">
                    En Espera: {Object.values(agentStatus).filter(s => s.status === 'idle').length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">
                    Total Mensajes: {Object.values(messages).flat().length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
                <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm">
                  <Play className="w-4 h-4" />
                  Iniciar Todos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCoordinationSystem;
