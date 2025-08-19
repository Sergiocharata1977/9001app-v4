import { apiClient } from './api/apiClient';
import { Auditoria, AuditoriaFilters, CreateAuditoriaData, UpdateAuditoriaData } from '@/types/auditorias';

class AuditoriasService {
  private readonly baseUrl = '/api/auditorias';

  /**
   * Obtiene todas las auditorías con filtros opcionales
   */
  async getAuditorias(filters: AuditoriaFilters = {}): Promise<Auditoria[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.auditor) params.append('auditor', filters.auditor);

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditorias:', error);
      throw new Error('Error al obtener auditorías');
    }
  }

  /**
   * Obtiene una auditoría por ID
   */
  async getAuditoriaById(id: number): Promise<Auditoria> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditoria:', error);
      throw new Error('Error al obtener la auditoría');
    }
  }

  /**
   * Crea una nueva auditoría
   */
  async createAuditoria(data: CreateAuditoriaData): Promise<Auditoria> {
    try {
      const response = await apiClient.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating auditoria:', error);
      throw new Error('Error al crear la auditoría');
    }
  }

  /**
   * Actualiza una auditoría existente
   */
  async updateAuditoria(id: number, data: UpdateAuditoriaData): Promise<Auditoria> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating auditoria:', error);
      throw new Error('Error al actualizar la auditoría');
    }
  }

  /**
   * Elimina una auditoría
   */
  async deleteAuditoria(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting auditoria:', error);
      throw new Error('Error al eliminar la auditoría');
    }
  }

  /**
   * Cambia el estado de una auditoría
   */
  async changeEstado(id: number, estado: string): Promise<Auditoria> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error changing auditoria estado:', error);
      throw new Error('Error al cambiar el estado de la auditoría');
    }
  }

  /**
   * Asigna auditores a una auditoría
   */
  async assignAuditores(id: number, auditores: number[]): Promise<Auditoria> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/auditores`, { auditores });
      return response.data;
    } catch (error) {
      console.error('Error assigning auditores:', error);
      throw new Error('Error al asignar auditores');
    }
  }

  /**
   * Obtiene estadísticas de auditorías
   */
  async getEstadisticas(): Promise<{
    total: number;
    programadas: number;
    en_proceso: number;
    completadas: number;
    canceladas: number;
    por_tipo: Record<string, number>;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditorias estadisticas:', error);
      throw new Error('Error al obtener estadísticas de auditorías');
    }
  }

  /**
   * Exporta auditorías a Excel
   */
  async exportToExcel(filters: AuditoriaFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.auditor) params.append('auditor', filters.auditor);

      const response = await apiClient.get(`${this.baseUrl}/export/excel?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting auditorias:', error);
      throw new Error('Error al exportar auditorías');
    }
  }

  /**
   * Exporta auditorías a PDF
   */
  async exportToPDF(filters: AuditoriaFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.auditor) params.append('auditor', filters.auditor);

      const response = await apiClient.get(`${this.baseUrl}/export/pdf?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting auditorias to PDF:', error);
      throw new Error('Error al exportar auditorías a PDF');
    }
  }

  /**
   * Obtiene auditorías próximas (próximas 30 días)
   */
  async getAuditoriasProximas(): Promise<Auditoria[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/proximas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditorias proximas:', error);
      throw new Error('Error al obtener auditorías próximas');
    }
  }

  /**
   * Obtiene auditorías por departamento
   */
  async getAuditoriasByDepartamento(departamentoId: number): Promise<Auditoria[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditorias by departamento:', error);
      throw new Error('Error al obtener auditorías por departamento');
    }
  }

  /**
   * Obtiene auditorías por auditor
   */
  async getAuditoriasByAuditor(auditorId: number): Promise<Auditoria[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/auditor/${auditorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching auditorias by auditor:', error);
      throw new Error('Error al obtener auditorías por auditor');
    }
  }

  /**
   * Duplica una auditoría existente
   */
  async duplicateAuditoria(id: number): Promise<Auditoria> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating auditoria:', error);
      throw new Error('Error al duplicar la auditoría');
    }
  }

  /**
   * Programa auditorías recurrentes
   */
  async programarAuditoriasRecurrentes(data: {
    tipo: string;
    frecuencia: 'mensual' | 'trimestral' | 'semestral' | 'anual';
    fechaInicio: string;
    fechaFin: string;
    departamentos: number[];
    auditores: number[];
  }): Promise<Auditoria[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/programar-recurrentes`, data);
      return response.data;
    } catch (error) {
      console.error('Error programming recurrent auditorias:', error);
      throw new Error('Error al programar auditorías recurrentes');
    }
  }

  /**
   * Obtiene el historial de cambios de una auditoría
   */
  async getHistorialCambios(id: number): Promise<{
    id: number;
    auditoria_id: number;
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
      console.error('Error fetching auditoria historial:', error);
      throw new Error('Error al obtener historial de cambios');
    }
  }
}

export const auditoriasService = new AuditoriasService();
