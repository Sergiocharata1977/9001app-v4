import { createApiClient } from './apiService';
import { Accion, AccionFormData, AccionUpdateData } from '@/types/acciones';

const apiClient = createApiClient('/acciones');

interface AccionData {
  titulo: string;
  descripcion: string;
  responsable: string;
  fecha_limite: string;
  estado: string;
  hallazgo_id?: string;
  prioridad?: string;
  tipo?: string;
}

interface UpdateAccionData extends Partial<AccionData> {
  id: string;
}

const accionesService = {
  // Obtener todas las acciones, opcionalmente filtradas por hallazgo_id
  getAllAcciones: async (hallazgo_id?: string | null): Promise<Accion[]> => {
    try {
      const params = hallazgo_id ? { hallazgo_id } : {};
      const response = await apiClient.get('/', { params });
      console.log('🚀 DEBUG: Acciones obtenidas del API:', response);
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error al obtener las acciones de mejora:', error);
      throw error;
    }
  },

  // Crear una nueva acción de mejora
  createAccion: async (accionData: AccionFormData): Promise<Accion> => {
    try {
      // Mapear los datos del frontend al formato del backend
      const backendData = {
        titulo: accionData.titulo,
        descripcion_accion: accionData.descripcion || '',
        responsable_accion: accionData.responsable || '',
        fecha_plan_accion: accionData.fechaVencimiento || '',
        estado: 'p1_planificacion_accion',
        hallazgo_id: accionData.hallazgo_id || null,
        prioridad: accionData.prioridad || 'media'
      };

      const response = await apiClient.post('/', backendData);
      console.log('✅ Acción de mejora creada:', response);
      return response.data || response;
    } catch (error) {
      console.error('Error al crear la acción de mejora:', error);
      throw error;
    }
  },

  // Actualizar una acción de mejora (ej: cambiar estado)
  updateAccion: async (id: string, updateData: AccionUpdateData): Promise<Accion> => {
    try {
      // Mapear los datos del frontend al formato del backend
      const backendData: any = {};
      
      if (updateData.descripcion !== undefined) {
        backendData.descripcion_accion = updateData.descripcion;
      }
      if (updateData.responsable !== undefined) {
        backendData.responsable_accion = updateData.responsable;
      }
      if (updateData.fechaVencimiento !== undefined) {
        backendData.fecha_plan_accion = updateData.fechaVencimiento;
      }
      if (updateData.estado !== undefined) {
        backendData.estado = updateData.estado;
      }
      if (updateData.prioridad !== undefined) {
        backendData.prioridad = updateData.prioridad;
      }
      
      // Campos específicos del workflow
      if (updateData.comentarios_ejecucion !== undefined) {
        backendData.comentarios_ejecucion = updateData.comentarios_ejecucion;
      }
      if (updateData.fecha_ejecucion !== undefined) {
        backendData.fecha_ejecucion = updateData.fecha_ejecucion;
      }
      if (updateData.evidencia_accion !== undefined) {
        backendData.evidencia_accion = updateData.evidencia_accion;
      }
      if (updateData.descripcion_verificacion !== undefined) {
        backendData.descripcion_verificacion = updateData.descripcion_verificacion;
      }
      if (updateData.responsable_verificacion !== undefined) {
        backendData.responsable_verificacion = updateData.responsable_verificacion;
      }
      if (updateData.fecha_plan_verificacion !== undefined) {
        backendData.fecha_plan_verificacion = updateData.fecha_plan_verificacion;
      }
      if (updateData.comentarios_verificacion !== undefined) {
        backendData.comentarios_verificacion = updateData.comentarios_verificacion;
      }
      if (updateData.fecha_verificacion_finalizada !== undefined) {
        backendData.fecha_verificacion_finalizada = updateData.fecha_verificacion_finalizada;
      }
      if (updateData.resultado_verificacion !== undefined) {
        backendData.resultado_verificacion = updateData.resultado_verificacion;
      }
      if (updateData.eficacia !== undefined) {
        backendData.eficacia = updateData.eficacia;
      }

      const response = await apiClient.put(`/${id}`, backendData);
      console.log('✅ Acción de mejora actualizada:', response);
      return response.data || response;
    } catch (error) {
      console.error(`Error al actualizar la acción de mejora ${id}:`, error);
      throw error;
    }
  },

  // Obtener el detalle de una acción específica
  getAccionById: async (id: string): Promise<Accion> => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error al obtener la acción de mejora ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una acción de mejora
  deleteAccion: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/${id}`);
      console.log('✅ Acción de mejora eliminada');
    } catch (error) {
      console.error(`Error al eliminar la acción de mejora ${id}:`, error);
      throw error;
    }
  }
};

export default accionesService;
