import { createApiClient } from './apiService.js';

// Cliente para rutas MongoDB (nuevo)
const apiClientMongoDB = createApiClient('/procesos-mongodb');
// Cliente para rutas legacy (mantener compatibilidad)
const apiClient = createApiClient('/procesos');

/**
 * Servicio para gestionar las operaciones CRUD de procesos
 */
const procesosService = {
  /**
   * Obtiene todos los procesos (MongoDB)
   * @returns {Promise<Array>} Lista de procesos
   */
  getAllProcesos: async () => {
    try {
      const response = await apiClientMongoDB.get('');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener procesos:', error);
      return [];
    }
  },

  getProcesos: async () => {
    return await procesosService.getAllProcesos();
  },

  // Métodos con nombres cortos para nuevo ProcesosListing
  getAll: async () => {
    return await procesosService.getAllProcesos();
  },

  /**
   * Obtiene un proceso por su ID (MongoDB)
   * @param {string} id - ID del proceso
   * @returns {Promise<Object>} Proceso encontrado
   */
  getProcesoById: async (id) => {
    return await apiClientMongoDB.get(`/${id}`);
  },

  getById: async (id) => {
    return await apiClientMongoDB.get(`/${id}`);
  },

  /**
   * Crea un nuevo proceso (MongoDB)
   * @param {Object} procesoData - Datos del proceso a crear
   * @returns {Promise<Object>} Proceso creado
   */
  createProceso: async (procesoData) => {
    return await apiClientMongoDB.post('', procesoData);
  },

  /**
   * Actualiza un proceso existente (MongoDB)
   * @param {string} id - ID del proceso a actualizar
   * @param {Object} procesoData - Nuevos datos del proceso
   * @returns {Promise<Object>} Proceso actualizado
   */
  updateProceso: (id, data) => apiClientMongoDB.put(`/${id}`, data),

  /**
   * Elimina un proceso (MongoDB)
   * @param {string} id - ID del proceso a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  deleteProceso: async (id) => {
    return await apiClientMongoDB.delete(`/${id}`);
  },

  // Métodos con nombres cortos para nuevo ProcesosListing (MongoDB)
  create: async (procesoData) => {
    return await apiClientMongoDB.post('', procesoData);
  },

  update: async (id, procesoData) => {
    return await apiClientMongoDB.put(`/${id}`, procesoData);
  },

  delete: async (id) => {
    return await apiClientMongoDB.delete(`/${id}`);
  },

  // Métodos adicionales para funcionalidades SGC
  /**
   * Obtiene dashboard de estadísticas SGC
   * @returns {Promise<Object>} Dashboard con estadísticas
   */
  getDashboardSGC: async () => {
    try {
      const response = await apiClientMongoDB.get('/dashboard/sgc');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener dashboard SGC:', error);
      return null;
    }
  },

  /**
   * Búsqueda avanzada de procesos
   * @param {Object} filtros - Filtros de búsqueda
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  searchAdvanced: async (filtros) => {
    try {
      const response = await apiClientMongoDB.get('/search/advanced', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('❌ Error en búsqueda avanzada:', error);
      return { data: [], pagination: { total: 0 } };
    }
  },

  /**
   * Exportar procesos a CSV
   * @returns {Promise<Blob>} Archivo CSV
   */
  exportCSV: async () => {
    try {
      const response = await apiClientMongoDB.get('/export/csv', { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('❌ Error al exportar CSV:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas resumidas
   * @returns {Promise<Object>} Estadísticas de procesos
   */
  getStatsSummary: async () => {
    try {
      const response = await apiClientMongoDB.get('/stats/summary');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      return null;
    }
  }
};

export default procesosService;
