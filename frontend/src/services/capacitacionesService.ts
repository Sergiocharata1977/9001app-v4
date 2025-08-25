import { createApiClient } from './apiService';
import { Capacitacion, CapacitacionFormData } from '@/types/capacitaciones';

const apiClient = createApiClient('/capacitaciones');

export const capacitacionesService = {
  // Obtener todas las capacitaciones
  getAll: async (): Promise<Capacitacion[]> => {
    try {
      const response = await apiClient.get('/');
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error al obtener capacitaciones:', error);
      throw error;
    }
  },

  // Obtener una capacitación por ID
  getById: async (id: number): Promise<Capacitacion> => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error al obtener capacitación ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva capacitación
  create: async (formData: CapacitacionFormData): Promise<Capacitacion> => {
    try {
      const response = await apiClient.post('/', formData);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear capacitación:', error);
      throw error;
    }
  },

  // Actualizar una capacitación
  update: async (id: number, formData: CapacitacionFormData): Promise<Capacitacion> => {
    try {
      const response = await apiClient.put(`/${id}`, formData);
      return response.data || response;
    } catch (error) {
      console.error(`Error al actualizar capacitación ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una capacitación
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error(`Error al eliminar capacitación ${id}:`, error);
      throw error;
    }
  },

  // --- TEMAS DE CAPACITACIÓN ---
  
  // Obtener temas de una capacitación
  getTemas: async (capacitacionId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/${capacitacionId}/temas`);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error(`Error al obtener temas de capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Crear un tema para una capacitación
  createTema: async (capacitacionId: number, temaData: { titulo: string; descripcion?: string; orden?: number }): Promise<any> => {
    try {
      const response = await apiClient.post(`/${capacitacionId}/temas`, temaData);
      return response.data || response;
    } catch (error) {
      console.error(`Error al crear tema para capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Actualizar un tema
  updateTema: async (capacitacionId: number, temaId: string, temaData: { titulo: string; descripcion?: string; orden?: number }): Promise<any> => {
    try {
      const response = await apiClient.put(`/${capacitacionId}/temas/${temaId}`, temaData);
      return response.data || response;
    } catch (error) {
      console.error(`Error al actualizar tema ${temaId}:`, error);
      throw error;
    }
  },

  // Eliminar un tema
  deleteTema: async (capacitacionId: number, temaId: string): Promise<void> => {
    try {
      await apiClient.delete(`/${capacitacionId}/temas/${temaId}`);
    } catch (error) {
      console.error(`Error al eliminar tema ${temaId}:`, error);
      throw error;
    }
  },

  // --- ASISTENTES DE CAPACITACIÓN ---

  // Obtener asistentes de una capacitación
  getAsistentes: async (capacitacionId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/${capacitacionId}/asistentes`);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error(`Error al obtener asistentes de capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Agregar un asistente a una capacitación
  addAsistente: async (capacitacionId: number, empleadoId: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/${capacitacionId}/asistentes`, { empleado_id: empleadoId });
      return response.data || response;
    } catch (error) {
      console.error(`Error al agregar asistente a capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Remover un asistente de una capacitación
  removeAsistente: async (capacitacionId: number, asistenteId: string): Promise<void> => {
    try {
      await apiClient.delete(`/${capacitacionId}/asistentes/${asistenteId}`);
    } catch (error) {
      console.error(`Error al remover asistente ${asistenteId}:`, error);
      throw error;
    }
  },

  // --- EVALUACIONES DE CAPACITACIÓN ---

  // Obtener evaluaciones de una capacitación
  getEvaluaciones: async (capacitacionId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/${capacitacionId}/evaluaciones`);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error(`Error al obtener evaluaciones de capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Crear una evaluación
  addEvaluacion: async (capacitacionId: number, evaluacionData: {
    empleado_id: number;
    tema_id: string;
    calificacion?: number;
    comentarios?: string;
    fecha_evaluacion?: string;
  }): Promise<any> => {
    try {
      const response = await apiClient.post(`/${capacitacionId}/evaluaciones`, evaluacionData);
      return response.data || response;
    } catch (error) {
      console.error(`Error al crear evaluación para capacitación ${capacitacionId}:`, error);
      throw error;
    }
  },

  // Actualizar una evaluación
  updateEvaluacion: async (capacitacionId: number, evaluacionId: string, evaluacionData: {
    calificacion?: number;
    comentarios?: string;
    fecha_evaluacion?: string;
  }): Promise<any> => {
    try {
      const response = await apiClient.put(`/${capacitacionId}/evaluaciones/${evaluacionId}`, evaluacionData);
      return response.data || response;
    } catch (error) {
      console.error(`Error al actualizar evaluación ${evaluacionId}:`, error);
      throw error;
    }
  },

  // Eliminar una evaluación
  deleteEvaluacion: async (capacitacionId: number, evaluacionId: string): Promise<void> => {
    try {
      await apiClient.delete(`/${capacitacionId}/evaluaciones/${evaluacionId}`);
    } catch (error) {
      console.error(`Error al eliminar evaluación ${evaluacionId}:`, error);
      throw error;
    }
  }
};

export default capacitacionesService;
