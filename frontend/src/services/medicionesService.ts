import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/mediciones');

/**
 * Servicio para gestionar las operaciones CRUD de mediciones
 */
const medicionesService = {
  /**
   * Obtiene todas las mediciones
   * @returns {Promise<Array>} Lista de mediciones
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener mediciones:', error);
      return [];
    }
  },

  /**
   * Obtiene una medición por su ID
   * @param {string} id - ID de la medición
   * @returns {Promise<Object>} Medición encontrada
   */
  getById: async (id: string) => {
    return await apiClient.get(`/${id}`);
  },

  /**
   * Crea una nueva medición
   * @param {Object} medicionData - Datos de la medición a crear
   * @returns {Promise<Object>} Medición creada
   */
  create: async (medicionData: any) => {
    return await apiClient.post('', medicionData);
  },

  /**
   * Actualiza una medición existente
   * @param {string} id - ID de la medición a actualizar
   * @param {Object} medicionData - Nuevos datos de la medición
   * @returns {Promise<Object>} Medición actualizada
   */
  update: async (id: string, medicionData: any) => {
    return await apiClient.put(`/${id}`, medicionData);
  },

  /**
   * Elimina una medición
   * @param {string} id - ID de la medición a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: async (id: string) => {
    return await apiClient.delete(`/${id}`);
  }
};

export default medicionesService;

