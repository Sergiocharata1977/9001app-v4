/**
 * RAG Toggle Component
 * Componente para activar/desactivar el módulo RAG
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  Power, 
  PowerOff, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useRAG } from '../context/RAGContext';
import { toast } from 'react-hot-toast';

export const RAGToggle = ({ organizationId, className = '' }) => {
  const { 
    enabled, 
    toggleRAG, 
    toggleRAGMutation,
    error 
  } = useRAG();

  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    if (!organizationId) {
      toast.error('No hay organización seleccionada');
      return;
    }

    toggleRAG(!enabled);
  };

  const getStatusColor = () => {
    if (toggleRAGMutation.isPending) return 'text-yellow-600';
    if (error) return 'text-red-600';
    return enabled ? 'text-green-600' : 'text-gray-400';
  };

  const getStatusIcon = () => {
    if (toggleRAGMutation.isPending) return <Loader2 size={16} className="animate-spin" />;
    if (error) return <AlertCircle size={16} />;
    return enabled ? <CheckCircle size={16} /> : <PowerOff size={16} />;
  };

  const getStatusText = () => {
    if (toggleRAGMutation.isPending) return 'Configurando...';
    if (error) return 'Error';
    return enabled ? 'Activado' : 'Desactivado';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón principal */}
      <motion.button
        onClick={handleToggle}
        disabled={toggleRAGMutation.isPending || !organizationId}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
          ${enabled 
            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }
          ${toggleRAGMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!organizationId ? 'opacity-30 cursor-not-allowed' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Bot size={16} />
        <span className="text-sm font-medium">RAG IA</span>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-xs">{getStatusText()}</span>
        </div>
      </motion.button>

      {/* Botón de detalles */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="absolute -top-1 -right-1 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        title="Configuración RAG"
      >
        <Settings size={12} />
      </button>

      {/* Panel de detalles */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Configuración RAG</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Estado actual */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span>{getStatusText()}</span>
                </div>
              </div>

              {organizationId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Organización:</span>
                  <span className="text-gray-800">ID {organizationId}</span>
                </div>
              )}

              {!organizationId && (
                <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  <Info size={14} />
                  <span>No hay organización seleccionada</span>
                </div>
              )}
            </div>

            {/* Información del módulo */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Funcionalidades RAG</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Búsqueda semántica en datos ISO 9001</li>
                <li>• Consultas inteligentes sobre procesos</li>
                <li>• Generación de respuestas contextualizadas</li>
                <li>• Trazabilidad de fuentes</li>
                <li>• Historial de consultas</li>
              </ul>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <button
                onClick={handleToggle}
                disabled={toggleRAGMutation.isPending || !organizationId}
                className={`
                  w-full flex items-center justify-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors
                  ${enabled
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                  }
                  ${toggleRAGMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {toggleRAGMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    {enabled ? <PowerOff size={14} /> : <Power size={14} />}
                    <span>{enabled ? 'Desactivar' : 'Activar'} RAG</span>
                  </>
                )}
              </button>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  Error: {error}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500">
                El módulo RAG procesa datos de tu organización para proporcionar 
                respuestas inteligentes basadas en la documentación ISO 9001.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay para cerrar detalles */}
      {showDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

// Variante compacta para usar en headers
export const RAGToggleCompact = ({ organizationId }) => {
  const { enabled, toggleRAG, toggleRAGMutation } = useRAG();

  return (
    <button
      onClick={() => toggleRAG(!enabled)}
      disabled={toggleRAGMutation.isPending || !organizationId}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${enabled 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${toggleRAGMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={`RAG ${enabled ? 'Activado' : 'Desactivado'}`}
    >
      <Bot size={16} />
    </button>
  );
};

// Variante para configuración avanzada
export const RAGToggleAdvanced = ({ organizationId }) => {
  const { enabled, toggleRAG, toggleRAGMutation } = useRAG();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="relative">
      <RAGToggle organizationId={organizationId} />
      
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Configuración Avanzada RAG</h3>
            
            {/* Configuraciones adicionales aquí */}
            <div className="text-xs text-gray-500">
              Configuraciones avanzadas del módulo RAG...
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 