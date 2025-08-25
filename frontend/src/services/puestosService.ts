import { createApiClient } from './apiService';
import useAuthStore from '@/store/authStore';

const apiClient = createApiClient('/puestos');

export const puestosService = {
  getAll: async (organizationId) => {
    try {
      const response = await apiClient.get('', {
        params: { organization_id: organizationId }
      });
      // apiClient.get devuelve cuerpo; backend retorna array de filas
      return Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : response?.rows || response);
    } catch (error) {
      console.error('Error en puestosService.getAll:', error);
      throw error;
    }
  },

  getById: async (id, organizationId) => {
    try {
      const response = await apiClient.get(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error(`Error en puestosService.getById ${id}:`, error);
      throw error;
    }
  },

  create: async (puestoData) => {
    try {
      const user = useAuthStore.getState()?.user;
      const organizationId = puestoData.organization_id || user?.organization_id;

      if (!organizationId) {
        throw new Error('Se requiere organization_id para crear un puesto');
      }

      const response = await apiClient.post('', {
        nombre: puestoData.nombre,
        descripcion: puestoData.descripcion,
        requisitos_experiencia: puestoData.requisitos_experiencia,
        requisitos_formacion: puestoData.requisitos_formacion,
        organization_id: organizationId
      });

      return response?.data ?? response;
    } catch (error) {
      console.error('Error en puestosService.create:', error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  update: async (id, puestoData) => {
    try {
      const user = useAuthStore.getState()?.user;
      const organizationId = puestoData.organization_id || user?.organization_id;

      if (!organizationId) {
        throw new Error('Se requiere organization_id para actualizar un puesto');
      }

      const response = await apiClient.put(`/${id}`, {
        nombre: puestoData.nombre,
        descripcion: puestoData.descripcion,
        requisitos_experiencia: puestoData.requisitos_experiencia,
        requisitos_formacion: puestoData.requisitos_formacion,
        organization_id: organizationId
      });

      return response?.data ?? response;
    } catch (error) {
      console.error(`Error en puestosService.update ${id}:`, error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  delete: async (id, organizationId) => {
    try {
      const response = await apiClient.delete(`/${id}`, {
        params: { organization_id: organizationId }
      });
      return response.data || response;
    } catch (error) {
      console.error(`Error en puestosService.delete ${id}:`, error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
};

// Export default para compatibilidad
export default puestosService;
