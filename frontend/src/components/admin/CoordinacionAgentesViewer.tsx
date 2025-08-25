import coordinacionService from '@/services/coordinacionService';
import { AlertTriangle, Clock, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CoordinacionAgentesViewer = () => {
  const [content, setContent] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Función para cargar el contenido del documento
  const loadDocument = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await coordinacionService.leerLogTareas();

      if (response.success) {
        setContent(response.data.content);
        setLastUpdate(new Date(response.data.lastModified).toLocaleString('es-ES'));
      } else {
        setError('Error cargando el documento');
      }
    } catch (error) {
      console.error('Error cargando documento:', error);
      setError('Error de conexión al cargar el documento');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para convertir Markdown a HTML simple
  const renderMarkdown = (markdown) => {
    if (!markdown) return '';

    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-purple-600 mt-6 mb-3 border-b border-purple-200 pb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-purple-700 mt-8 mb-4 border-b border-purple-300 pb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-purple-800 mt-8 mb-6 border-b border-purple-400 pb-4">$1</h1>')

      // Estados y badges
      .replace(/✅/g, '<span class="inline-block w-4 h-4 text-green-600">✅</span>')
      .replace(/❌/g, '<span class="inline-block w-4 h-4 text-red-600">❌</span>')
      .replace(/🔄/g, '<span class="inline-block w-4 h-4 text-yellow-600">🔄</span>')
      .replace(/🎯/g, '<span class="inline-block w-4 h-4 text-blue-600">🎯</span>')
      .replace(/📅/g, '<span class="inline-block w-4 h-4 text-gray-600">📅</span>')
      .replace(/📋/g, '<span class="inline-block w-4 h-4 text-gray-600">📋</span>')
      .replace(/🚀/g, '<span class="inline-block w-4 h-4 text-purple-600">🚀</span>')
      .replace(/📊/g, '<span class="inline-block w-4 h-4 text-indigo-600">📊</span>')
      .replace(/📝/g, '<span class="inline-block w-4 h-4 text-green-600">📝</span>')

      // Estados de texto
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Listas con mejor formato para el log de tareas
      .replace(/^- \*\*Agente:\*\* (.*$)/gim, '<li class="ml-4 mb-2 flex items-center"><span class="text-blue-600 mr-2">🤖</span> <strong>Agente:</strong> <span class="font-medium">$1</span></li>')
      .replace(/^- \*\*Tarea realizada:\*\* (.*$)/gim, '<li class="ml-4 mb-2 flex items-center"><span class="text-green-600 mr-2">📋</span> <strong>Tarea realizada:</strong> <span class="font-medium">$1</span></li>')
      .replace(/^- \*\*Documentos trabajados:\*\* (.*$)/gim, '<li class="ml-4 mb-2 flex items-center"><span class="text-purple-600 mr-2">📁</span> <strong>Documentos trabajados:</strong> <span class="font-medium">$1</span></li>')
      .replace(/^- \*\*Estado:\*\* (.*$)/gim, '<li class="ml-4 mb-2 flex items-center"><span class="text-orange-600 mr-2">📊</span> <strong>Estado:</strong> <span class="font-medium">$1</span></li>')
      .replace(/^- \*\*Contexto:\*\* (.*$)/gim, '<li class="ml-4 mb-2 flex items-center"><span class="text-indigo-600 mr-2">💡</span> <strong>Contexto:</strong> <span class="font-medium">$1</span></li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')

      // Separadores
      .replace(/^---$/gim, '<hr class="my-8 border-gray-300">')

      // Párrafos con mejor espaciado
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/^(.+)$/gm, '<p class="mb-4 leading-relaxed">$1</p>');
  };

  // Cargar documento al montar el componente
  useEffect(() => {
    loadDocument();
  }, []);

  // Auto-refresh cada 20 minutos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDocument();
    }, 20 * 60 * 1000); // 20 minutos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-purple-600 flex items-center gap-3">
                  <RefreshCw className="w-8 h-8" />
                  Log de Tareas - Agentes IA
                </h1>
                <p className="text-slate-600">
                  Registro cronológico de tareas realizadas por agentes IA
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Auto-refresh toggle */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-slate-600">Auto-refresh</span>
                </label>

                {/* Manual refresh button */}
                <button
                  onClick={loadDocument}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  Última actualización: {lastUpdate || 'Nunca'}
                </span>
              </div>

              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cargando...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-slate-600">Cargando log de tareas...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={loadDocument}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="prose prose-purple max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinacionAgentesViewer;
