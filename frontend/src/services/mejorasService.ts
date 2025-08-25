import { createApiClient } from './apiService.js';
import type { 
  Mejora, 
  Hallazgo, 
  MejoraFormData, 
  HallazgoFormData, 
  MejoraFilters, 
  PaginationParams, 
  PaginatedResponse,
  MejoraEstado,
  MejoraPrioridad,
  MejoraTipo,
  MejoraOrigen,
  MejoraStats
} from '@/types/mejoras';

/**
 * Cliente API para el servicio de mejoras
 */
const apiClient = createApiClient('/mejoras');

/**
 * Servicio para gestionar mejoras a través de la API backend
 */
export const mejorasService = {
  /**
   * Obtiene todas las mejoras
   * @returns Promise<Mejora[]> Lista de mejoras
   */
  async getAll(): Promise<Mejora[]> {
    try {
      const data = await apiClient.get('/');
      return (data as any).data || data as Mejora[];
    } catch (error: any) {
      console.error('Error al obtener mejoras:', error);
      throw new Error(error.message || 'Error al cargar las mejoras');
    }
  },

  /**
   * Obtiene mejoras con paginación
   * @param params Parámetros de paginación y filtros
   * @returns Promise<PaginatedResponse<Mejora>> Respuesta paginada de mejoras
   */
  async getPaginated(params: PaginationParams & MejoraFilters): Promise<PaginatedResponse<Mejora>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Parámetros de paginación
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Filtros
      if (params.estado) params.estado.forEach(estado => queryParams.append('estado', estado));
      if (params.prioridad) params.prioridad.forEach(prioridad => queryParams.append('prioridad', prioridad));
      if (params.tipo) params.tipo.forEach(tipo => queryParams.append('tipo', tipo));
      if (params.origen) params.origen.forEach(origen => queryParams.append('origen', origen));
      if (params.responsable) queryParams.append('responsable', params.responsable);
      if (params.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
      if (params.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);
      if (params.procesoId) queryParams.append('procesoId', params.procesoId.toString());
      if (params.departamentoId) queryParams.append('departamentoId', params.departamentoId.toString());

      const data = await apiClient.get(`/?${queryParams.toString()}`);
      return data as PaginatedResponse<Mejora>;
    } catch (error: any) {
      console.error('Error al obtener mejoras paginadas:', error);
      throw new Error(error.message || 'Error al cargar las mejoras');
    }
  },

  /**
   * Obtiene una mejora por su ID
   * @param id ID de la mejora
   * @returns Promise<Mejora> Datos de la mejora
   */
  async getById(id: string | number): Promise<Mejora> {
    try {
      const data = await apiClient.get(`/${id}`);
      return (data as any).data || data as Mejora;
    } catch (error: any) {
      console.error(`Error al obtener mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al cargar la mejora');
    }
  },

  /**
   * Crea una nueva mejora
   * @param mejora Datos de la mejora a crear
   * @returns Promise<Mejora> Mejora creada
   */
  async create(mejora: MejoraFormData): Promise<Mejora> {
    try {
      const data = await apiClient.post('/', mejora);
      return (data as any).data || data as Mejora;
    } catch (error: any) {
      console.error('Error al crear mejora:', error);
      throw new Error(error.message || 'Error al crear la mejora');
    }
  },

  /**
   * Actualiza una mejora existente
   * @param id ID de la mejora a actualizar
   * @param mejora Datos actualizados de la mejora
   * @returns Promise<Mejora> Mejora actualizada
   */
  async update(id: string | number, mejora: Partial<MejoraFormData>): Promise<Mejora> {
    try {
      const data = await apiClient.put(`/${id}`, mejora);
      return (data as any).data || data as Mejora;
    } catch (error: any) {
      console.error(`Error al actualizar mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar la mejora');
    }
  },

  /**
   * Elimina una mejora
   * @param id ID de la mejora a eliminar
   * @returns Promise<{ success: boolean }> Resultado de la eliminación
   */
  async delete(id: string | number): Promise<{ success: boolean }> {
    try {
      const data = await apiClient.delete(`/${id}`);
      return data as { success: boolean };
    } catch (error: any) {
      console.error(`Error al eliminar mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar la mejora');
    }
  },

  /**
   * Obtiene mejoras por estado
   * @param estado Estado de las mejoras a buscar
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por estado
   */
  async getByEstado(estado: MejoraEstado): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.estado === estado);
    } catch (error: any) {
      console.error(`Error al obtener mejoras con estado ${estado}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por estado');
    }
  },

  /**
   * Obtiene mejoras por prioridad
   * @param prioridad Prioridad de las mejoras a buscar
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por prioridad
   */
  async getByPrioridad(prioridad: MejoraPrioridad): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.prioridad === prioridad);
    } catch (error: any) {
      console.error(`Error al obtener mejoras con prioridad ${prioridad}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por prioridad');
    }
  },

  /**
   * Obtiene mejoras por tipo
   * @param tipo Tipo de las mejoras a buscar
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por tipo
   */
  async getByTipo(tipo: MejoraTipo): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.tipo === tipo);
    } catch (error: any) {
      console.error(`Error al obtener mejoras con tipo ${tipo}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por tipo');
    }
  },

  /**
   * Obtiene mejoras por origen
   * @param origen Origen de las mejoras a buscar
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por origen
   */
  async getByOrigen(origen: MejoraOrigen): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.origen === origen);
    } catch (error: any) {
      console.error(`Error al obtener mejoras con origen ${origen}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por origen');
    }
  },

  /**
   * Obtiene mejoras por proceso
   * @param procesoId ID del proceso
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por proceso
   */
  async getByProceso(procesoId: number): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.procesoId === procesoId);
    } catch (error: any) {
      console.error(`Error al obtener mejoras del proceso ${procesoId}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por proceso');
    }
  },

  /**
   * Obtiene mejoras por departamento
   * @param departamentoId ID del departamento
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por departamento
   */
  async getByDepartamento(departamentoId: number): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.departamentoId === departamentoId);
    } catch (error: any) {
      console.error(`Error al obtener mejoras del departamento ${departamentoId}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por departamento');
    }
  },

  /**
   * Obtiene mejoras por responsable
   * @param responsable Nombre del responsable
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por responsable
   */
  async getByResponsable(responsable: string): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => mejora.responsable === responsable);
    } catch (error: any) {
      console.error(`Error al obtener mejoras del responsable ${responsable}:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por responsable');
    }
  },

  /**
   * Obtiene mejoras por rango de fechas
   * @param fechaDesde Fecha de inicio
   * @param fechaHasta Fecha de fin
   * @returns Promise<Mejora[]> Lista de mejoras filtradas por rango de fechas
   */
  async getByFechaRange(fechaDesde: string, fechaHasta: string): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      return allMejoras.filter(mejora => {
        const fecha = new Date(mejora.fechaDeteccion);
        const desde = new Date(fechaDesde);
        const hasta = new Date(fechaHasta);
        return fecha >= desde && fecha <= hasta;
      });
    } catch (error: any) {
      console.error(`Error al obtener mejoras por rango de fechas:`, error);
      throw new Error(error.message || 'Error al filtrar mejoras por rango de fechas');
    }
  },

  /**
   * Obtiene estadísticas de mejoras
   * @returns Promise<MejoraStats> Estadísticas de mejoras
   */
  async getStats(): Promise<MejoraStats> {
    try {
      const allMejoras = await this.getAll();
      
      const stats: MejoraStats = {
        total: allMejoras.length,
        deteccion: allMejoras.filter(m => m.estado === 'deteccion').length,
        analisis: allMejoras.filter(m => m.estado === 'analisis').length,
        planificacion: allMejoras.filter(m => m.estado === 'planificacion').length,
        ejecucion: allMejoras.filter(m => m.estado === 'ejecucion').length,
        verificacion: allMejoras.filter(m => m.estado === 'verificacion').length,
        cierre: allMejoras.filter(m => m.estado === 'cierre').length,
        porPrioridad: {
          alta: allMejoras.filter(m => m.prioridad === 'Alta').length,
          media: allMejoras.filter(m => m.prioridad === 'Media').length,
          baja: allMejoras.filter(m => m.prioridad === 'Baja').length,
        },
        porTipo: {
          hallazgo: allMejoras.filter(m => m.tipo === 'hallazgo').length,
          oportunidad: allMejoras.filter(m => m.tipo === 'oportunidad').length,
          no_conformidad: allMejoras.filter(m => m.tipo === 'no_conformidad').length,
          accion_correctiva: allMejoras.filter(m => m.tipo === 'accion_correctiva').length,
          accion_preventiva: allMejoras.filter(m => m.tipo === 'accion_preventiva').length,
        }
      };

      return stats;
    } catch (error: any) {
      console.error('Error al obtener estadísticas de mejoras:', error);
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  },

  /**
   * Busca mejoras por texto
   * @param searchTerm Término de búsqueda
   * @returns Promise<Mejora[]> Lista de mejoras que coinciden con la búsqueda
   */
  async search(searchTerm: string): Promise<Mejora[]> {
    try {
      const allMejoras = await this.getAll();
      const term = searchTerm.toLowerCase();
      
      return allMejoras.filter(mejora => 
        mejora.titulo.toLowerCase().includes(term) ||
        mejora.descripcion.toLowerCase().includes(term) ||
        (mejora.numeroMejora && mejora.numeroMejora.toLowerCase().includes(term)) ||
        (mejora.responsable && mejora.responsable.toLowerCase().includes(term))
      );
    } catch (error: any) {
      console.error(`Error al buscar mejoras con término "${searchTerm}":`, error);
      throw new Error(error.message || 'Error al buscar mejoras');
    }
  },

  /**
   * Actualiza el estado de una mejora
   * @param id ID de la mejora
   * @param nuevoEstado Nuevo estado
   * @returns Promise<Mejora> Mejora actualizada
   */
  async updateEstado(id: string | number, nuevoEstado: MejoraEstado): Promise<Mejora> {
    try {
      const data = await apiClient.patch(`/${id}/estado`, { estado: nuevoEstado });
      return (data as any).data || data as Mejora;
    } catch (error: any) {
      console.error(`Error al actualizar estado de mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el estado de la mejora');
    }
  },

  /**
   * Asigna un responsable a una mejora
   * @param id ID de la mejora
   * @param responsable Nombre del responsable
   * @returns Promise<Mejora> Mejora actualizada
   */
  async assignResponsable(id: string | number, responsable: string): Promise<Mejora> {
    try {
      const data = await apiClient.patch(`/${id}/responsable`, { responsable });
      return data as Mejora;
    } catch (error: any) {
      console.error(`Error al asignar responsable a mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al asignar responsable');
    }
  },

  /**
   * Obtiene el historial de cambios de una mejora
   * @param id ID de la mejora
   * @returns Promise<any[]> Historial de cambios
   */
  async getHistorial(id: string | number): Promise<any[]> {
    try {
      const data = await apiClient.get(`/${id}/historial`);
      return (data as any).data || data as any[];
    } catch (error: any) {
      console.error(`Error al obtener historial de mejora con ID ${id}:`, error);
      throw new Error(error.message || 'Error al obtener historial');
    }
  },

  /**
   * Exporta mejoras a diferentes formatos
   * @param format Formato de exportación ('csv', 'excel', 'pdf')
   * @param filters Filtros a aplicar
   * @returns Promise<Blob> Archivo exportado
   */
  async export(format: 'csv' | 'excel' | 'pdf', filters?: MejoraFilters): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters) {
        if (filters.estado) filters.estado.forEach(estado => queryParams.append('estado', estado));
        if (filters.prioridad) filters.prioridad.forEach(prioridad => queryParams.append('prioridad', prioridad));
        if (filters.tipo) filters.tipo.forEach(tipo => queryParams.append('tipo', tipo));
        if (filters.origen) filters.origen.forEach(origen => queryParams.append('origen', origen));
        if (filters.responsable) queryParams.append('responsable', filters.responsable);
        if (filters.fechaDesde) queryParams.append('fechaDesde', filters.fechaDesde);
        if (filters.fechaHasta) queryParams.append('fechaHasta', filters.fechaHasta);
        if (filters.procesoId) queryParams.append('procesoId', filters.procesoId.toString());
        if (filters.departamentoId) queryParams.append('departamentoId', filters.departamentoId.toString());
      }

      const response = await apiClient.get(`/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      
      return (response as any).data || response as Blob;
    } catch (error: any) {
      console.error(`Error al exportar mejoras en formato ${format}:`, error);
      throw new Error(error.message || 'Error al exportar mejoras');
    }
  }
};

export default mejorasService;
