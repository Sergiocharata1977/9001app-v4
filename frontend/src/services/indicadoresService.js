// src/services/indicadoresService.js

import { createService } from './serviceFactory';

// 1. Creamos un cliente de servicio para el recurso '/indicadores'
// La factory se encargará de decidir si es mock o real.
const apiClient = createService('/indicadores');

// 2. Definimos el objeto de servicio con métodos que usan el apiClient.
const indicadoresService = {
  /**
   * Obtiene todos los indicadores.
   * @returns {Promise<Array>} Lista de indicadores.
   */
  async getAll() {
    try {
      const data = await apiClient.get();
      console.log('📊 Indicadores response:', data);
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener indicadores:', error);
      return [];
    }
  },

  /**
   * Obtiene un indicador por su ID.
   * @param {string} id - ID del indicador.
   * @returns {Promise<Object>} Datos del indicador.
   */
  getById(id) {
    return apiClient.get(`/${id}`);
  },

  /**
   * Crea un nuevo indicador.
   * @param {Object} indicadorData - Datos del indicador a crear.
   * @returns {Promise<Object>} Indicador creado.
   */
  create(indicadorData) {
    return apiClient.post('', indicadorData);
  },

  /**
   * Actualiza un indicador existente.
   * @param {string} id - ID del indicador a actualizar.
   * @param {Object} indicadorData - Datos actualizados.
   * @returns {Promise<Object>} Indicador actualizado.
   */
  update(id, indicadorData) {
    return apiClient.put(`/${id}`, indicadorData);
  },

  /**
   * Elimina un indicador.
   * @param {string} id - ID del indicador a eliminar.
   * @returns {Promise<Object>} Mensaje de confirmación.
   */
  delete(id) {
    return apiClient.delete(`/${id}`);
  },
};

export default indicadoresService;

