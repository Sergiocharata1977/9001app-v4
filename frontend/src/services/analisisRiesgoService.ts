import apiService from './apiService';

export interface AnalisisRiesgo {
  id: string;
  organization_id: string;
  cliente_id: string;
  fecha_analisis: string;
  periodo_analisis: string;
  puntaje_riesgo: number;
  categoria_riesgo: 'baja' | 'media' | 'alta' | 'muy_alta';
  capacidad_pago: number;
  ingresos_mensuales: number;
  gastos_mensuales: number;
  margen_utilidad: number;
  liquidez: number;
  solvencia: number;
  endeudamiento: number;
  recomendaciones: string;
  observaciones: string;
  estado: 'identificado' | 'evaluado' | 'mitigado' | 'monitoreado' | 'cerrado';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: number;
}

export interface CreateAnalisisRiesgoData {
  organization_id: string;
  cliente_id: string;
  fecha_analisis: string;
  periodo_analisis: string;
  puntaje_riesgo: number;
  categoria_riesgo: 'baja' | 'media' | 'alta' | 'muy_alta';
  capacidad_pago?: number;
  ingresos_mensuales?: number;
  gastos_mensuales?: number;
  margen_utilidad?: number;
  liquidez?: number;
  solvencia?: number;
  endeudamiento?: number;
  recomendaciones?: string;
  observaciones?: string;
  estado?: 'identificado' | 'evaluado' | 'mitigado' | 'monitoreado' | 'cerrado';
}

export interface UpdateAnalisisRiesgoData extends Partial<CreateAnalisisRiesgoData> {
  id: string;
}

class AnalisisRiesgoService {
  private baseUrl = '/api/crm/analisis-riesgo';

  async getAll(): Promise<AnalisisRiesgo[]> {
    try {
      const response = await apiService.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching análisis de riesgo:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<AnalisisRiesgo> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching análisis de riesgo by ID:', error);
      throw error;
    }
  }

  async getByCliente(clienteId: string): Promise<AnalisisRiesgo[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching análisis de riesgo by cliente:', error);
      throw error;
    }
  }

  async create(data: CreateAnalisisRiesgoData): Promise<AnalisisRiesgo> {
    try {
      const response = await apiService.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating análisis de riesgo:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateAnalisisRiesgoData): Promise<AnalisisRiesgo> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating análisis de riesgo:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting análisis de riesgo:', error);
      throw error;
    }
  }

  async updateEstado(id: string, estado: string): Promise<AnalisisRiesgo> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error updating estado de análisis de riesgo:', error);
      throw error;
    }
  }

  async getEstadisticas(): Promise<{
    total: number;
    porCategoria: Record<string, number>;
    porEstado: Record<string, number>;
    promedioPuntaje: number;
  }> {
    try {
      const response = await apiService.get(`${this.baseUrl}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching estadísticas de análisis de riesgo:', error);
      throw error;
    }
  }

  async getRiesgosAltos(): Promise<AnalisisRiesgo[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/riesgos-altos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching riesgos altos:', error);
      throw error;
    }
  }

  async getRiesgosPorPeriodo(periodo: string): Promise<AnalisisRiesgo[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/periodo/${periodo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching análisis de riesgo por período:', error);
      throw error;
    }
  }
}

const analisisRiesgoService = new AnalisisRiesgoService();
export default analisisRiesgoService;
