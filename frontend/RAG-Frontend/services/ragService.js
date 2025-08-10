/**
 * Servicio RAG Frontend
 * Maneja todas las comunicaciones con la API RAG
 */

import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api/rag',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class RAGService {
  /**
   * Obtiene el estado de RAG para una organización
   */
  async getStatus(organizationId) {
    try {
      const response = await api.get(`/status/${organizationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting RAG status:', error);
      throw new Error(error.response?.data?.message || 'Error obteniendo estado de RAG');
    }
  }

  /**
   * Activa/desactiva RAG para una organización
   */
  async toggleRAG(organizationId, enabled) {
    try {
      const response = await api.post('/toggle', {
        organizationId,
        enabled
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling RAG:', error);
      throw new Error(error.response?.data?.message || 'Error cambiando estado de RAG');
    }
  }

  /**
   * Envía una consulta RAG
   */
  async sendQuery(query, organizationId) {
    try {
      const response = await api.post('/query', {
        query,
        organizationId
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending RAG query:', error);
      throw new Error(error.response?.data?.message || 'Error procesando consulta RAG');
    }
  }

  /**
   * Realiza búsqueda semántica
   */
  async search(query, organizationId, options = {}) {
    try {
      const response = await api.post('/search', {
        query,
        organizationId,
        options
      });
      return response.data.data;
    } catch (error) {
      console.error('Error in RAG search:', error);
      throw new Error(error.response?.data?.message || 'Error en búsqueda RAG');
    }
  }

  /**
   * Obtiene sugerencias de consultas
   */
  async getSuggestions(organizationId) {
    try {
      const response = await api.get(`/suggestions/${organizationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw new Error(error.response?.data?.message || 'Error obteniendo sugerencias');
    }
  }

  /**
   * Obtiene historial de consultas
   */
  async getQueryHistory(organizationId, options = {}) {
    try {
      const { limit = 20, offset = 0 } = options;
      const response = await api.get(`/history/${organizationId}`, {
        params: { limit, offset }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error getting query history:', error);
      throw new Error(error.response?.data?.message || 'Error obteniendo historial');
    }
  }

  /**
   * Reindexa datos de una organización
   */
  async reindex(organizationId) {
    try {
      const response = await api.post('/reindex', {
        organizationId
      });
      return response.data;
    } catch (error) {
      console.error('Error reindexing:', error);
      throw new Error(error.response?.data?.message || 'Error iniciando reindexación');
    }
  }

  /**
   * Obtiene estadísticas de RAG
   */
  async getStats(organizationId) {
    try {
      const response = await api.get(`/stats/${organizationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting RAG stats:', error);
      throw new Error(error.response?.data?.message || 'Error obteniendo estadísticas');
    }
  }

  /**
   * Valida una consulta antes de enviarla
   */
  validateQuery(query) {
    const errors = [];

    if (!query || typeof query !== 'string') {
      errors.push('La consulta debe ser una cadena de texto');
    }

    if (query.trim().length === 0) {
      errors.push('La consulta no puede estar vacía');
    }

    if (query.length > 1000) {
      errors.push('La consulta es demasiado larga (máximo 1000 caracteres)');
    }

    if (query.trim().length < 3) {
      errors.push('La consulta es demasiado corta (mínimo 3 caracteres)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitiza una consulta
   */
  sanitizeQuery(query) {
    if (typeof query !== 'string') {
      return '';
    }

    return query
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .substring(0, 1000);
  }

  /**
   * Formatea una respuesta RAG para mostrar
   */
  formatResponse(response) {
    if (!response) {
      return {
        text: 'No se pudo procesar la consulta',
        sources: [],
        confidence: 0
      };
    }

    return {
      text: response.response || response.text || 'Sin respuesta',
      sources: response.sources || [],
      confidence: response.confidence || 0,
      processingTime: response.processingTime || 0,
      timestamp: response.timestamp || new Date().toISOString()
    };
  }

  /**
   * Formatea fuentes para mostrar
   */
  formatSources(sources) {
    if (!Array.isArray(sources)) {
      return [];
    }

    return sources.map(source => ({
      id: source.id,
      type: source.type || 'unknown',
      table: source.table || source.source?.table,
      content: source.content || source.text || '',
      similarity: source.similarity || 0,
      metadata: source.metadata || {}
    }));
  }

  /**
   * Obtiene sugerencias contextuales basadas en la consulta actual
   */
  async getContextualSuggestions(query, organizationId) {
    try {
      // Si la consulta está vacía, devolver sugerencias generales
      if (!query || query.trim().length === 0) {
        return await this.getSuggestions(organizationId);
      }

      // Filtrar sugerencias basadas en la consulta actual
      const allSuggestions = await this.getSuggestions(organizationId);
      const queryLower = query.toLowerCase();

      return allSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(queryLower)
      ).slice(0, 5);
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      return [];
    }
  }

  /**
   * Guarda una consulta en el historial local
   */
  saveToLocalHistory(query, response) {
    try {
      const history = this.getLocalHistory();
      const newEntry = {
        id: Date.now(),
        query,
        response: this.formatResponse(response),
        timestamp: new Date().toISOString()
      };

      // Agregar al inicio y mantener solo los últimos 50
      history.unshift(newEntry);
      if (history.length > 50) {
        history.splice(50);
      }

      localStorage.setItem('rag_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to local history:', error);
    }
  }

  /**
   * Obtiene historial local
   */
  getLocalHistory() {
    try {
      const history = localStorage.getItem('rag_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting local history:', error);
      return [];
    }
  }

  /**
   * Limpia historial local
   */
  clearLocalHistory() {
    try {
      localStorage.removeItem('rag_history');
    } catch (error) {
      console.error('Error clearing local history:', error);
    }
  }

  /**
   * Verifica si RAG está disponible
   */
  async isRAGAvailable(organizationId) {
    try {
      const status = await this.getStatus(organizationId);
      return status.enabled;
    } catch (error) {
      console.error('Error checking RAG availability:', error);
      return false;
    }
  }
}

// Instancia singleton del servicio
export const ragService = new RAGService();

// Exportar la clase para testing
export { RAGService }; 