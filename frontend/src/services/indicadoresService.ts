// src/services/indicadoresService.js

import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/indicadores');

/**
 * Servicio para gestionar las operaciones CRUD de indicadores
 */
const indicadoresService = {
  /**
   * Obtiene todos los indicadores
   * @returns {Promise<Array>} Lista de indicadores
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener indicadores:', error);
      return [];
    }
  },

  /**
   * Obtiene un indicador por su ID
   * @param {string} id - ID del indicador
   * @returns {Promise<Object>} Indicador encontrado
   */
  getById: async (id: string) => {
    return await apiClient.get(`/${id}`);
  },

  /**
   * Crea un nuevo indicador
   * @param {Object} indicadorData - Datos del indicador a crear
   * @returns {Promise<Object>} Indicador creado
   */
  create: async (indicadorData: any) => {
    return await apiClient.post('', indicadorData);
  },

  /**
   * Actualiza un indicador existente
   * @param {string} id - ID del indicador a actualizar
   * @param {Object} indicadorData - Nuevos datos del indicador
   * @returns {Promise<Object>} Indicador actualizado
   */
  update: async (id: string, indicadorData: any) => {
    return await apiClient.put(`/${id}`, indicadorData);
  },

  /**
   * Elimina un indicador
   * @param {string} id - ID del indicador a eliminar
   * @returns {Promise<Object>} Respuesta de confirmación
   */
  delete: async (id: string) => {
    return await apiClient.delete(`/${id}`);
  }
};

export default indicadoresService;

