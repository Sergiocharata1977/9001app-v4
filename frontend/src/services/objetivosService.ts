import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/objetivos-calidad');

/**
 * Servicio para gestionar las operaciones CRUD de objetivos de calidad
 */
const objetivosService = {
  /**
   * Obtiene todos los objetivos de calidad
   * @returns {Promise<Array>} Lista de objetivos
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener objetivos de calidad:', error);
      return [];
    }
  },

  /**
   * Obtiene un objetivo por su ID
   * @param {string} id - ID del objetivo
   * @returns {Promise<Object>} Objetivo encontrado
   */
  getById: async (id: string) => {
    return await apiClient.get(`/${id}`);
  },

  /**
   * Crea un nuevo objetivo
   * @param {Object} objetivoData - Datos del objetivo a crear
   * @returns {Promise<Object>} Objetivo creado
   */
  create: async (objetivoData: any) => {
    return await apiClient.post('', objetivoData);
  },

  /**
   * Actualiza un objetivo existente
   * @param {string} id - ID del objetivo a actualizar
   * @param {Object} objetivoData - Nuevos datos del objetivo
   * @returns {Promise<Object>} Objetivo actualizado
   */
  update: async (id: string, objetivoData: any) => {
    return await apiClient.put(`/${id}`, objetivoData);
  },

  /**
   * Elimina un objetivo
   * @param {string} id - ID del objetivo a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: async (id: string) => {
    return await apiClient.delete(`/${id}`);
  }
};

export default objetivosService;
