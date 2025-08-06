import { apiClient } from './index';

/**
 * Servicio API para autenticación
 */
export const authApi = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales de usuario
   * @returns {Promise} Respuesta de la API
   */
  login: (credentials) => apiClient.post('/auth/login', credentials),

  /**
   * Cerrar sesión
   * @returns {Promise} Respuesta de la API
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Registrar usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Respuesta de la API
   */
  register: (userData) => apiClient.post('/auth/register', userData),

  /**
   * Verificar token
   * @returns {Promise} Respuesta de la API
   */
  verifyToken: () => apiClient.get('/auth/verify'),

  /**
   * Renovar token
   * @returns {Promise} Respuesta de la API
   */
  refreshToken: () => apiClient.post('/auth/refresh'),
}; 