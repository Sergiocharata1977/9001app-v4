import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/procesos');

/**
 * Servicio para gestionar las operaciones CRUD de procesos
 */
const procesosService = {
  /**
   * Obtiene todos los procesos
   * @returns {Promise<Array>} Lista de procesos
   */
  // Alias para mantener compatibilidad con componentes antiguos
  getAllProcesos: async () => {
    try {
      const response = await apiClient.get('');
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
   * Obtiene un proceso por su ID
   * @param {string} id - ID del proceso
   * @returns {Promise<Object>} Proceso encontrado
   */
  getProcesoById: async (id) => {
    return await apiClient.get(`/${id}`);
  },

  getById: async (id) => {
    return await apiClient.get(`/${id}`);
  },

  /**
   * Crea un nuevo proceso
   * @param {Object} procesoData - Datos del proceso a crear
   * @returns {Promise<Object>} Proceso creado
   */
  createProceso: async (procesoData) => {
    return await apiClient.post('', procesoData);
  },

  /**
   * Actualiza un proceso existente
   * @param {string} id - ID del proceso a actualizar
   * @param {Object} procesoData - Nuevos datos del proceso
   * @returns {Promise<Object>} Proceso actualizado
   */
  updateProceso: (id, data) => apiClient.put(`/${id}`, data),

  /**
   * Elimina un proceso
   * @param {string} id - ID del proceso a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  deleteProceso: async (id) => {
    return await apiClient.delete(`/${id}`);
  },

  // Métodos con nombres cortos para nuevo ProcesosListing
  create: async (procesoData) => {
    return await apiClient.post('', procesoData);
  },

  update: async (id, procesoData) => {
    return await apiClient.put(`/${id}`, procesoData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/${id}`);
  }
};

export default procesosService;
