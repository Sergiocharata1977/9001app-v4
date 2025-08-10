// Servicio para el módulo de Objetivos de Calidad
import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/objetivos-calidad');

const objetivosCalidadService = {
  getAll: async () => {
    try {
      const data = await apiClient.get('');
      console.log('🎯 Objetivos response:', data);
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener objetivos:', error);
      return [];
    }
  },
  getById: (id) => apiClient.get(`/${id}`),
  create: (data) => apiClient.post('', data),
  update: (id, data) => apiClient.put(`/${id}`, data),
  delete: (id) => apiClient.delete(`/${id}`)
};

export default objetivosCalidadService;
