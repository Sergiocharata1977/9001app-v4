import { createApiClient } from './apiService';

const apiClient = createApiClient('/capacitaciones');
import { Capacitacion, CapacitacionFilters, CreateCapacitacionData, UpdateCapacitacionData } from '@/types/capacitaciones';

class CapacitacionesService {
  private readonly baseUrl = '/api/capacitaciones';

  /**
   * Obtiene todas las capacitaciones con filtros opcionales
   */
  async getCapacitaciones(filters: CapacitacionFilters = {}): Promise<Capacitacion[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.departamento) params.append('departamento', filters.departamento);

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones:', error);
      throw new Error('Error al obtener capacitaciones');
    }
  }

  /**
   * Obtiene una capacitación por ID
   */
  async getCapacitacionById(id: number): Promise<Capacitacion> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitacion:', error);
      throw new Error('Error al obtener la capacitación');
    }
  }

  /**
   * Crea una nueva capacitación
   */
  async createCapacitacion(data: CreateCapacitacionData): Promise<Capacitacion> {
    try {
      const response = await apiClient.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating capacitacion:', error);
      throw new Error('Error al crear la capacitación');
    }
  }

  /**
   * Actualiza una capacitación existente
   */
  async updateCapacitacion(id: number, data: UpdateCapacitacionData): Promise<Capacitacion> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating capacitacion:', error);
      throw new Error('Error al actualizar la capacitación');
    }
  }

  /**
   * Elimina una capacitación
   */
  async deleteCapacitacion(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting capacitacion:', error);
      throw new Error('Error al eliminar la capacitación');
    }
  }

  /**
   * Cambia el estado de una capacitación
   */
  async changeEstado(id: number, estado: string): Promise<Capacitacion> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error changing capacitacion estado:', error);
      throw new Error('Error al cambiar el estado de la capacitación');
    }
  }

  /**
   * Inscribe participantes a una capacitación
   */
  async inscribirParticipantes(id: number, participantes: number[]): Promise<Capacitacion> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/participantes`, { participantes });
      return response.data;
    } catch (error) {
      console.error('Error inscribing participantes:', error);
      throw new Error('Error al inscribir participantes');
    }
  }

  /**
   * Desinscribe participantes de una capacitación
   */
  async desinscribirParticipantes(id: number, participantes: number[]): Promise<Capacitacion> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${id}/participantes`, { 
        data: { participantes } 
      });
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing participantes:', error);
      throw new Error('Error al desinscribir participantes');
    }
  }

  /**
   * Obtiene estadísticas de capacitaciones
   */
  async getEstadisticas(): Promise<{
    total: number;
    programadas: number;
    en_progreso: number;
    completadas: number;
    canceladas: number;
    evaluacion_pendiente: number;
    por_tipo: Record<string, number>;
    por_departamento: Record<string, number>;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones estadisticas:', error);
      throw new Error('Error al obtener estadísticas de capacitaciones');
    }
  }

  /**
   * Exporta capacitaciones a Excel
   */
  async exportToExcel(filters: CapacitacionFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.departamento) params.append('departamento', filters.departamento);

      const response = await apiClient.get(`${this.baseUrl}/export/excel?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting capacitaciones:', error);
      throw new Error('Error al exportar capacitaciones');
    }
  }

  /**
   * Exporta capacitaciones a PDF
   */
  async exportToPDF(filters: CapacitacionFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.departamento) params.append('departamento', filters.departamento);

      const response = await apiClient.get(`${this.baseUrl}/export/pdf?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting capacitaciones to PDF:', error);
      throw new Error('Error al exportar capacitaciones a PDF');
    }
  }

  /**
   * Obtiene capacitaciones próximas (próximas 30 días)
   */
  async getCapacitacionesProximas(): Promise<Capacitacion[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/proximas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones proximas:', error);
      throw new Error('Error al obtener capacitaciones próximas');
    }
  }

  /**
   * Obtiene capacitaciones por departamento
   */
  async getCapacitacionesByDepartamento(departamentoId: number): Promise<Capacitacion[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones by departamento:', error);
      throw new Error('Error al obtener capacitaciones por departamento');
    }
  }

  /**
   * Obtiene capacitaciones por instructor
   */
  async getCapacitacionesByInstructor(instructorId: number): Promise<Capacitacion[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/instructor/${instructorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones by instructor:', error);
      throw new Error('Error al obtener capacitaciones por instructor');
    }
  }

  /**
   * Obtiene capacitaciones por participante
   */
  async getCapacitacionesByParticipante(participanteId: number): Promise<Capacitacion[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/participante/${participanteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitaciones by participante:', error);
      throw new Error('Error al obtener capacitaciones por participante');
    }
  }

  /**
   * Duplica una capacitación existente
   */
  async duplicateCapacitacion(id: number): Promise<Capacitacion> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating capacitacion:', error);
      throw new Error('Error al duplicar la capacitación');
    }
  }

  /**
   * Programa capacitaciones recurrentes
   */
  async programarCapacitacionesRecurrentes(data: {
    tipo: string;
    frecuencia: 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
    fechaInicio: string;
    fechaFin: string;
    departamentos: number[];
    instructores: number[];
  }): Promise<Capacitacion[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/programar-recurrentes`, data);
      return response.data;
    } catch (error) {
      console.error('Error programming recurrent capacitaciones:', error);
      throw new Error('Error al programar capacitaciones recurrentes');
    }
  }

  /**
   * Obtiene el historial de cambios de una capacitación
   */
  async getHistorialCambios(id: number): Promise<{
    id: number;
    capacitacion_id: number;
    campo: string;
    valor_anterior: string;
    valor_nuevo: string;
    usuario: string;
    fecha: string;
  }[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitacion historial:', error);
      throw new Error('Error al obtener historial de cambios');
    }
  }

  /**
   * Obtiene temas de capacitación disponibles
   */
  async getTemasCapacitacion(): Promise<{
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    duracion_estimada: number;
    nivel: 'basico' | 'intermedio' | 'avanzado';
  }[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/temas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching temas capacitacion:', error);
      throw new Error('Error al obtener temas de capacitación');
    }
  }

  /**
   * Obtiene instructores disponibles
   */
  async getInstructores(): Promise<{
    id: number;
    nombre: string;
    especialidad: string;
    experiencia_anos: number;
    certificaciones: string[];
    disponibilidad: string;
  }[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/instructores`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructores:', error);
      throw new Error('Error al obtener instructores');
    }
  }

  /**
   * Obtiene participantes disponibles
   */
  async getParticipantesDisponibles(capacitacionId: number): Promise<{
    id: number;
    nombre: string;
    departamento: string;
    puesto: string;
    email: string;
    telefono: string;
  }[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${capacitacionId}/participantes-disponibles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching participantes disponibles:', error);
      throw new Error('Error al obtener participantes disponibles');
    }
  }

  /**
   * Obtiene participantes inscritos
   */
  async getParticipantesInscritos(capacitacionId: number): Promise<{
    id: number;
    nombre: string;
    departamento: string;
    puesto: string;
    email: string;
    telefono: string;
    fecha_inscripcion: string;
    estado: 'inscrito' | 'asistio' | 'no_asistio' | 'cancelado';
    evaluacion?: number;
    comentarios?: string;
  }[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${capacitacionId}/participantes-inscritos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching participantes inscritos:', error);
      throw new Error('Error al obtener participantes inscritos');
    }
  }

  /**
   * Registra asistencia de participantes
   */
  async registrarAsistencia(capacitacionId: number, asistencias: {
    participante_id: number;
    asistio: boolean;
    comentarios?: string;
  }[]): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${capacitacionId}/asistencia`, { asistencias });
    } catch (error) {
      console.error('Error registering attendance:', error);
      throw new Error('Error al registrar asistencia');
    }
  }

  /**
   * Registra evaluaciones de participantes
   */
  async registrarEvaluaciones(capacitacionId: number, evaluaciones: {
    participante_id: number;
    puntuacion: number;
    comentarios?: string;
  }[]): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${capacitacionId}/evaluaciones`, { evaluaciones });
    } catch (error) {
      console.error('Error registering evaluations:', error);
      throw new Error('Error al registrar evaluaciones');
    }
  }

  /**
   * Obtiene reporte de capacitación
   */
  async getReporteCapacitacion(id: number): Promise<{
    capacitacion: Capacitacion;
    estadisticas: {
      total_inscritos: number;
      total_asistieron: number;
      total_no_asistieron: number;
      promedio_evaluacion: number;
      porcentaje_asistencia: number;
    };
    participantes: {
      inscritos: any[];
      asistencias: any[];
      evaluaciones: any[];
    };
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/reporte`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capacitacion reporte:', error);
      throw new Error('Error al obtener reporte de capacitación');
    }
  }
}

export const capacitacionesService = new CapacitacionesService();
