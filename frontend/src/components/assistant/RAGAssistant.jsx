import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Send,
  X,
  Loader2,
  Brain,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Check,
  Search,
  FileText,
  Target,
  AlertTriangle
} from "lucide-react";

const RAGAssistant = ({ onClose, organizationId = 1 }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ragStatus, setRagStatus] = useState(null);
  
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Verificar estado de RAG al cargar
  useEffect(() => {
    checkRAGStatus();
  }, []);

  const checkRAGStatus = async () => {
    try {
      const response = await fetch(`/api/rag/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRagStatus(data.data);
      }
    } catch (error) {
      console.error('Error checking RAG status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message to conversation
    const userMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/rag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: query.trim()
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la consulta");
      }

      // Add assistant response to conversation
      setConversation(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: data.data.response,
          sources: data.data.sources,
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Reset query field
      setQuery("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "El texto se ha copiado correctamente"
    });
  };

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const renderSources = (sources) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300">
        <div className="font-medium mb-1 text-black dark:text-white">📚 Fuentes:</div>
        {sources.map((source, index) => (
          <div key={index} className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <FileText size={12} />
            <span>{source.titulo || source.tipo}</span>
          </div>
        ))}
      </div>
    );
  };

  const getSuggestions = () => [
    "¿Cuáles son los indicadores de calidad más importantes?",
    "¿Qué auditorías están programadas?",
    "¿Cuántos empleados tenemos en la organización?",
    "¿Qué procesos están activos?",
    "¿Cuáles son las normas ISO 9001 aplicables?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Asistente RAG</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 text-gray-600 dark:text-gray-400"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex-grow flex flex-col h-96">
          {/* Status Warning */}
          {ragStatus && !ragStatus.enabled && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-xs">
                <AlertTriangle size={14} />
                <span>RAG no está habilitado para esta organización</span>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-3 space-y-4 bg-white dark:bg-gray-900">
            {conversation.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                <Brain className="mx-auto h-12 w-12 opacity-20 mb-2 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-black dark:text-white">Asistente RAG ISO 9001</h3>
                <p className="text-sm mt-1 mb-4 text-gray-700 dark:text-gray-300">
                  Consulta información específica de tu organización usando IA.
                </p>
                
                {/* Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-black dark:text-white">💡 Sugerencias:</p>
                  {getSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(suggestion)}
                      className="block w-full text-left text-xs p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-black dark:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                    }`}
                  >
                    <div className="relative">
                      {msg.role === "assistant" && (
                        <button 
                          onClick={() => handleCopyToClipboard(msg.content)}
                          className="absolute top-0 right-0 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          title="Copiar respuesta"
                        >
                          <Clipboard size={14} />
                        </button>
                      )}
                      <div className="pr-6 text-black dark:text-white">
                        {renderMessageContent(msg.content)}
                      </div>
                      {msg.role === "assistant" && renderSources(msg.sources)}
                    </div>
                    <div className="text-xs mt-1 opacity-70 text-gray-600 dark:text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Consulta información de tu organización..."
                disabled={isLoading || (ragStatus && !ragStatus.enabled)}
                className="flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !query.trim() || (ragStatus && !ragStatus.enabled)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default RAGAssistant;
