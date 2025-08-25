import { createApiClient } from './apiService';

const apiClient = createApiClient('/diseno-desarrollo');

export interface ProyectoDisenoDesarrollo {
  id: string;
  organization_id: number;
  nombre_producto: string;
  descripcion: string;
  etapa_actual: string;
  responsable_id: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  requisitos_cliente: string;
  especificaciones_tecnicas: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProyectoData {
  nombre_producto: string;
  descripcion: string;
  etapa_actual: string;
  responsable_id: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  requisitos_cliente: string;
  especificaciones_tecnicas: string;
  observaciones: string;
}

export interface UpdateProyectoData extends Partial<CreateProyectoData> {}

export const disenoDesarrolloService = {
  // Obtener todos los proyectos
  async getProyectos(filters = {}) {
    try {
      const response = await apiClient.get('', { params: filters });
      return response;
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  },

  // Obtener proyecto específico
  async getProyecto(id: string) {
    try {
      const response = await apiClient.get(`/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      throw error;
    }
  },

  // Crear nuevo proyecto
  async createProyecto(data: CreateProyectoData) {
    try {
      const response = await apiClient.post('', data);
      return response;
    } catch (error) {
      console.error('Error creando proyecto:', error);
      throw error;
    }
  },

  // Actualizar proyecto
  async updateProyecto(id: string, data: UpdateProyectoData) {
    try {
      const response = await apiClient.put(`/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      throw error;
    }
  },

  // Eliminar proyecto
  async deleteProyecto(id: string) {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      throw error;
    }
  }
};

export default disenoDesarrolloService;
