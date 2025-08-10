/**
 * RAG Chat Interface
 * Componente principal para la interfaz de chat RAG
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  MessageCircle, 
  Bot, 
  User, 
  Loader2, 
  ChevronUp,
  ChevronDown,
  History,
  Settings,
  Trash2
} from 'lucide-react';
import { useRAG, useRAGQuery, useRAGSuggestions } from '../context/RAGContext';
import { QuerySuggestions } from './QuerySuggestions';
import { SourceDisplay } from './SourceDisplay';
import { RAGHistory } from './RAGHistory';

export const RAGChatInterface = () => {
  const {
    enabled,
    isOpen,
    isLoading,
    currentQuery,
    responses,
    error,
    toggleChat,
    setQuery,
    clearError,
    clearHistory
  } = useRAG();

  const { sendQuery } = useRAGQuery();
  const { suggestions, selectSuggestion } = useRAGSuggestions();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSources, setShowSources] = useState(false);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses]);

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Manejar envío de consulta
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentQuery.trim() && !isLoading) {
      sendQuery(currentQuery.trim());
    }
  };

  // Manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion) => {
    selectSuggestion(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Manejar teclas especiales
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  // Si RAG no está habilitado, no mostrar nada
  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Botón flotante para abrir chat */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Interfaz de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-40 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <span className="font-semibold">Asistente IA ISOFlow3</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1 hover:bg-blue-600 rounded transition-colors"
                  title="Historial"
                >
                  <History size={16} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-blue-600 rounded transition-colors"
                  title="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {responses.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Bot size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">
                      Hola, soy tu asistente IA para ISOFlow3. 
                      Puedes preguntarme sobre procesos, objetivos, indicadores y más.
                    </p>
                  </div>
                )}

                {responses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    {/* Consulta del usuario */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-800">{response.query}</p>
                      </div>
                    </div>

                    {/* Respuesta del asistente */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {response.response}
                          </p>
                        </div>
                        
                        {/* Fuentes */}
                        {response.sources && response.sources.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <button
                              onClick={() => setShowSources(!showSources)}
                              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                            >
                              {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              <span>Fuentes ({response.sources.length})</span>
                            </button>
                            
                            <AnimatePresence>
                              {showSources && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2"
                                >
                                  <SourceDisplay sources={response.sources} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Metadatos */}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Confianza: {Math.round(response.confidence * 100)}%
                          </span>
                          <span>
                            {response.processingTime}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Indicador de carga */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={16} className="animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Procesando consulta...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Área de entrada */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={currentQuery}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu consulta aquí..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      disabled={isLoading}
                    />
                    
                    <button
                      type="submit"
                      disabled={!currentQuery.trim() || isLoading}
                      className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  {/* Sugerencias */}
                  {suggestions.length > 0 && (
                    <QuerySuggestions
                      suggestions={suggestions}
                      onSelect={handleSuggestionSelect}
                      show={showSuggestions}
                      onToggle={() => setShowSuggestions(!showSuggestions)}
                    />
                  )}
                </form>
              </div>
            </div>

            {/* Historial lateral */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className="absolute top-0 right-full w-80 h-full bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <RAGHistory onClose={() => setShowHistory(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 