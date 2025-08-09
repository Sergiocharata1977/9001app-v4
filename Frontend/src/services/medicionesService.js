import { createService } from './serviceFactory';

const apiClient = createService('/mediciones');

const medicionesService = {
  getAll: async () => {
    try {
      const data = await apiClient.get();
      console.log('📈 Mediciones response:', data);
      return Array.isArray(data) ? data : (data?.data || []);
    } catch (error) {
      console.error('❌ Error al obtener mediciones:', error);
      return [];
    }
  },

  getById: (id) => {
    return apiClient.get(`/${id}`);
  },

  getByIndicador: (indicadorId) => {
    // Esta sintaxis de query param funciona tanto para la API real como para el mock service actualizado.
    return apiClient.get(`?indicadorId=${indicadorId}`);
  },

  create: (medicionData) => {
    return apiClient.post('', medicionData);
  },

  update: (id, medicionData) => {
    return apiClient.put(`/${id}`, medicionData);
  },

  delete: (id) => {
    return apiClient.delete(`/${id}`);
  },
};

export default medicionesService;

