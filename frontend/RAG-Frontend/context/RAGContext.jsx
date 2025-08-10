/**
 * Contexto RAG
 * Gestión centralizada del estado del módulo RAG
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ragService } from '../services/ragService';
import { toast } from 'react-hot-toast';

// Estado inicial
const initialState = {
  enabled: false,
  isOpen: false,
  isLoading: false,
  currentQuery: '',
  responses: [],
  suggestions: [],
  history: [],
  error: null,
  organizationId: null
};

// Tipos de acciones
const RAG_ACTIONS = {
  SET_ENABLED: 'SET_ENABLED',
  SET_OPEN: 'SET_OPEN',
  SET_LOADING: 'SET_LOADING',
  SET_QUERY: 'SET_QUERY',
  ADD_RESPONSE: 'ADD_RESPONSE',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_HISTORY: 'SET_HISTORY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET: 'RESET'
};

// Reducer
function ragReducer(state, action) {
  switch (action.type) {
    case RAG_ACTIONS.SET_ENABLED:
      return { ...state, enabled: action.payload };
    
    case RAG_ACTIONS.SET_OPEN:
      return { ...state, isOpen: action.payload };
    
    case RAG_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case RAG_ACTIONS.SET_QUERY:
      return { ...state, currentQuery: action.payload };
    
    case RAG_ACTIONS.ADD_RESPONSE:
      return {
        ...state,
        responses: [...state.responses, action.payload],
        currentQuery: ''
      };
    
    case RAG_ACTIONS.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload };
    
    case RAG_ACTIONS.SET_HISTORY:
      return { ...state, history: action.payload };
    
    case RAG_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case RAG_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case RAG_ACTIONS.RESET:
      return { ...initialState, organizationId: state.organizationId };
    
    default:
      return state;
  }
}

// Crear contexto
const RAGContext = createContext();

// Hook personalizado para usar el contexto
export const useRAG = () => {
  const context = useContext(RAGContext);
  if (!context) {
    throw new Error('useRAG debe usarse dentro de RAGProvider');
  }
  return context;
};

// Provider del contexto
export const RAGProvider = ({ children, organizationId }) => {
  const [state, dispatch] = useReducer(ragReducer, {
    ...initialState,
    organizationId
  });

  const queryClient = useQueryClient();

  // Query para obtener estado de RAG
  const { data: ragStatus } = useQuery({
    queryKey: ['rag-status', organizationId],
    queryFn: () => ragService.getStatus(organizationId),
    enabled: !!organizationId,
    refetchInterval: 30000, // Refetch cada 30 segundos
    onSuccess: (data) => {
      dispatch({ type: RAG_ACTIONS.SET_ENABLED, payload: data.enabled });
    },
    onError: (error) => {
      console.error('Error fetching RAG status:', error);
      dispatch({ type: RAG_ACTIONS.SET_ERROR, payload: 'Error obteniendo estado de RAG' });
    }
  });

  // Query para obtener sugerencias
  const { data: suggestions } = useQuery({
    queryKey: ['rag-suggestions', organizationId],
    queryFn: () => ragService.getSuggestions(organizationId),
    enabled: !!organizationId && state.enabled,
    onSuccess: (data) => {
      dispatch({ type: RAG_ACTIONS.SET_SUGGESTIONS, payload: data });
    }
  });

  // Query para obtener historial
  const { data: history } = useQuery({
    queryKey: ['rag-history', organizationId],
    queryFn: () => ragService.getQueryHistory(organizationId),
    enabled: !!organizationId && state.enabled,
    onSuccess: (data) => {
      dispatch({ type: RAG_ACTIONS.SET_HISTORY, payload: data });
    }
  });

  // Mutation para activar/desactivar RAG
  const toggleRAGMutation = useMutation({
    mutationFn: ({ enabled }) => ragService.toggleRAG(organizationId, enabled),
    onSuccess: (data) => {
      dispatch({ type: RAG_ACTIONS.SET_ENABLED, payload: data.enabled });
      toast.success(`RAG ${data.enabled ? 'activado' : 'desactivado'} exitosamente`);
      queryClient.invalidateQueries(['rag-status']);
    },
    onError: (error) => {
      toast.error('Error al cambiar estado de RAG');
      dispatch({ type: RAG_ACTIONS.SET_ERROR, payload: error.message });
    }
  });

  // Mutation para enviar consulta
  const sendQueryMutation = useMutation({
    mutationFn: (query) => ragService.sendQuery(query, organizationId),
    onSuccess: (data) => {
      const response = {
        id: Date.now(),
        query: state.currentQuery,
        response: data.response,
        sources: data.sources,
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
        processingTime: data.processingTime
      };
      
      dispatch({ type: RAG_ACTIONS.ADD_RESPONSE, payload: response });
      dispatch({ type: RAG_ACTIONS.SET_LOADING, payload: false });
      
      // Invalidar historial para actualizar
      queryClient.invalidateQueries(['rag-history']);
    },
    onError: (error) => {
      dispatch({ type: RAG_ACTIONS.SET_LOADING, payload: false });
      toast.error('Error al procesar consulta');
      dispatch({ type: RAG_ACTIONS.SET_ERROR, payload: error.message });
    }
  });

  // Funciones del contexto
  const toggleRAG = (enabled) => {
    if (!organizationId) {
      toast.error('No hay organización seleccionada');
      return;
    }
    toggleRAGMutation.mutate({ enabled });
  };

  const sendQuery = (query) => {
    if (!state.enabled) {
      toast.error('RAG no está habilitado');
      return;
    }

    if (!query.trim()) {
      toast.error('La consulta no puede estar vacía');
      return;
    }

    dispatch({ type: RAG_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: RAG_ACTIONS.CLEAR_ERROR });
    sendQueryMutation.mutate(query);
  };

  const setQuery = (query) => {
    dispatch({ type: RAG_ACTIONS.SET_QUERY, payload: query });
  };

  const toggleChat = () => {
    dispatch({ type: RAG_ACTIONS.SET_OPEN, payload: !state.isOpen });
  };

  const clearError = () => {
    dispatch({ type: RAG_ACTIONS.CLEAR_ERROR });
  };

  const clearHistory = () => {
    dispatch({ type: RAG_ACTIONS.RESET });
  };

  // Efecto para actualizar organizationId
  useEffect(() => {
    if (organizationId && organizationId !== state.organizationId) {
      dispatch({ type: RAG_ACTIONS.RESET });
    }
  }, [organizationId]);

  // Valor del contexto
  const value = {
    // Estado
    enabled: state.enabled,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    currentQuery: state.currentQuery,
    responses: state.responses,
    suggestions: state.suggestions,
    history: state.history,
    error: state.error,
    organizationId: state.organizationId,
    
    // Funciones
    toggleRAG,
    sendQuery,
    setQuery,
    toggleChat,
    clearError,
    clearHistory,
    
    // Mutations
    toggleRAGMutation,
    sendQueryMutation
  };

  return (
    <RAGContext.Provider value={value}>
      {children}
    </RAGContext.Provider>
  );
};

// Hook para verificar si RAG está disponible
export const useRAGAvailability = () => {
  const { enabled, organizationId } = useRAG();
  return {
    isAvailable: enabled && !!organizationId,
    isEnabled: enabled,
    hasOrganization: !!organizationId
  };
};

// Hook para manejar consultas
export const useRAGQuery = () => {
  const { sendQuery, isLoading, error } = useRAG();
  
  return {
    sendQuery,
    isLoading,
    error
  };
};

// Hook para manejar sugerencias
export const useRAGSuggestions = () => {
  const { suggestions, setQuery } = useRAG();
  
  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
  };
  
  return {
    suggestions,
    selectSuggestion
  };
}; 