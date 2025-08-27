import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Loader2, Send, Bot, User, Lightbulb, Database } from 'lucide-react';

interface RAGMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: RAGSource[];
  processingTime?: number;
}

interface RAGSource {
  tipo: string;
  titulo: string;
  codigo: string;
  relevancia: number;
  contenido: string;
}

interface RAGResponse {
  question: string;
  answer: string;
  confidence: number;
  sources: RAGSource[];
  totalResults: number;
  processingTime: number;
  timestamp: string;
}

/**
 * Componente de chat para el sistema RAG
 */
export const RAGChat: React.FC = () => {
  const [messages, setMessages] = useState<RAGMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Carga estadísticas del sistema RAG
   */
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/rag/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  /**
   * Envía una consulta al sistema RAG
   */
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para usar el asistente');
      return;
    }

    const userMessage: RAGMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: userMessage.content,
          maxResults: 10,
          includeSources: true,
          contextSize: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        const ragResponse: RAGResponse = data.data;

        const assistantMessage: RAGMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: ragResponse.answer,
          timestamp: new Date(),
          confidence: ragResponse.confidence,
          sources: ragResponse.sources,
          processingTime: ragResponse.processingTime
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Cargar sugerencias relacionadas
        loadSuggestions(userMessage.content);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la consulta RAG');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga sugerencias relacionadas
   */
  const loadSuggestions = async (query: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/rag/suggestions?query=${encodeURIComponent(query)}&limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    }
  };

  /**
   * Maneja el envío con Enter
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Usa una sugerencia
   */
  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  /**
   * Obtiene el color del badge según la confianza
   */
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      {/* Header con estadísticas */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Asistente IA - Sistema de Gestión de Calidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{stats.total || 0}</div>
                <div className="text-gray-600">Total registros</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {Object.keys(stats.porTipo || {}).length}
                </div>
                <div className="text-gray-600">Tipos de datos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">
                  {stats.porEstado?.activo || 0}
                </div>
                <div className="text-gray-600">Registros activos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">
                  {messages.length}
                </div>
                <div className="text-gray-600">Consultas realizadas</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Área de mensajes */}
      <Card className="flex-1 mb-4">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full pr-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">¡Hola! Soy tu asistente IA</p>
                <p className="text-sm">Pregúntame sobre tu Sistema de Gestión de Calidad ISO 9001</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-400">Ejemplos de consultas:</p>
                  <div className="space-y-1">
                    <p className="text-xs">• "¿Cuáles son los indicadores de calidad más importantes?"</p>
                    <p className="text-xs">• "Muéstrame los hallazgos de auditoría recientes"</p>
                    <p className="text-xs">• "¿Qué procesos están documentados?"</p>
                    <p className="text-xs">• "¿Cómo se gestionan las no conformidades?"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {message.type === 'assistant' && message.confidence !== undefined && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Badge 
                            variant="secondary" 
                            className={getConfidenceColor(message.confidence)}
                          >
                            Confianza: {message.confidence}%
                          </Badge>
                          {message.processingTime && (
                            <span className="text-gray-500">
                              {message.processingTime}ms
                            </span>
                          )}
                        </div>
                      )}
                      
                      {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-600 mb-2">
                            Fuentes consultadas:
                          </p>
                          <div className="space-y-1">
                            {message.sources.slice(0, 3).map((source, index) => (
                              <div key={index} className="text-xs bg-white p-2 rounded border">
                                <div className="font-medium">{source.titulo}</div>
                                <div className="text-gray-500">{source.tipo}</div>
                                <div className="text-gray-400">
                                  Relevancia: {source.relevancia}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Procesando consulta...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Sugerencias relacionadas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useSuggestion(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Área de entrada */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta sobre el Sistema de Gestión de Calidad..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
