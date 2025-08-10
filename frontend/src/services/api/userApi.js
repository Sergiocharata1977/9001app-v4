import { apiClient } from './index';

/**
 * Servicio API para usuarios
 */
export const userApi = {
  /**
   * Obtener todos los usuarios
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  getAll: (params) => apiClient.get('/users', { params }),

  /**
   * Obtener usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise} Respuesta de la API
   */
  getById: (id) => apiClient.get(`/users/${id}`),

  /**
   * Crear usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Respuesta de la API
   */
  create: (userData) => apiClient.post('/users', userData),

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Respuesta de la API
   */
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise} Respuesta de la API
   */
  delete: (id) => apiClient.delete(`/users/${id}`),

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise} Respuesta de la API
   */
  getProfile: () => apiClient.get('/users/profile'),

  /**
   * Actualizar perfil del usuario actual
   * @param {Object} profileData - Datos del perfil
   * @returns {Promise} Respuesta de la API
   */
  updateProfile: (profileData) => apiClient.put('/users/profile', profileData),
}; 