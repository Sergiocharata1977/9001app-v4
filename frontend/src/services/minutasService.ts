// ========== SERVICIO API PARA MINUTAS SGC ==========

import { useState } from 'react';
import { 
  Minuta,
  SgcPersonalRelacion,
  SgcDocumentoRelacionado,
  SgcNormaRelacionada
} from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types';

// Definir tipo para import.meta.env
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configuración base para fetch
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Función helper para manejar respuestas
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Tipos específicos para minutas
interface MinutaForm {
  titulo: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  tipo: 'reunion' | 'auditoria' | 'revision' | 'capacitacion';
  organizador_id: string;
  agenda: string;
  conclusiones?: string;
  acuerdos?: string[];
  proxima_reunion?: string;
  estado?: 'programada' | 'en_proceso' | 'completada' | 'cancelada';
}

interface MinutaFiltros {
  search?: string;
  tipo?: 'reunion' | 'auditoria' | 'revision' | 'capacitacion';
  estado?: 'programada' | 'en_proceso' | 'completada' | 'cancelada';
  fecha_desde?: string;
  fecha_hasta?: string;
  organizador_id?: string;
}

interface MinutaCompleta extends Minuta {
  participantes: SgcPersonalRelacion[];
  documentos: SgcDocumentoRelacionado[];
  normas: SgcNormaRelacionada[];
  estadisticas_sgc: {
    total_participantes: number;
    total_documentos: number;
    total_normas: number;
  };
}

// ========== ENDPOINTS PRINCIPALES DE MINUTAS ==========

export const minutasService = {
  // Obtener todas las minutas
  async getMinutas(filtros?: MinutaFiltros): Promise<PaginatedResponse<Minuta>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/api/minutas${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<PaginatedResponse<Minuta>>(response);
  },

  // Obtener minuta por ID
  async getMinutaById(id: string): Promise<MinutaCompleta> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<MinutaCompleta>>(response);
    if (!result.data) {
      throw new Error('No se encontró la minuta');
    }
    return result.data;
  },

  // Crear nueva minuta
  async createMinuta(minuta: MinutaForm): Promise<Minuta> {
    const response = await fetch(`${API_BASE_URL}/api/minutas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(minuta),
    });

    const result = await handleResponse<ApiResponse<Minuta>>(response);
    if (!result.data) {
      throw new Error('Error al crear la minuta');
    }
    return result.data;
  },

  // Actualizar minuta
  async updateMinuta(id: string, minuta: Partial<MinutaForm>): Promise<Minuta> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(minuta),
    });

    const result = await handleResponse<ApiResponse<Minuta>>(response);
    if (!result.data) {
      throw new Error('Error al actualizar la minuta');
    }
    return result.data;
  },

  // Eliminar minuta (soft delete)
  async deleteMinuta(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },

  // Obtener dashboard de minutas
  async getDashboard(): Promise<{
    resumen: {
      total_minutas: number;
      programadas: number;
      en_proceso: number;
      completadas: number;
      canceladas: number;
    };
    distribucion_tipos: Array<{
      tipo: string;
      cantidad: number;
    }>;
    minutas_recientes: Minuta[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/dashboard/sgc`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<any>>(response);
    if (!result.data) {
      throw new Error('Error al cargar el dashboard');
    }
    return result.data;
  },
};

// ========== ENDPOINTS SGC PARA PARTICIPANTES ==========

export const minutasParticipantesService = {
  // Obtener participantes de una minuta
  async getParticipantes(minutaId: string): Promise<SgcPersonalRelacion[]> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/participantes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcPersonalRelacion[]>>(response);
    return result.data || [];
  },

  // Agregar participante a una minuta
  async addParticipante(minutaId: string, participante: {
    personal_id: string;
    rol?: string;
    observaciones?: string;
  }): Promise<SgcPersonalRelacion> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/participantes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(participante),
    });

    const result = await handleResponse<ApiResponse<SgcPersonalRelacion>>(response);
    if (!result.data) {
      throw new Error('Error al agregar participante');
    }
    return result.data;
  },

  // Actualizar asistencia de participante
  async updateAsistencia(minutaId: string, participanteId: string, asistio: boolean): Promise<SgcPersonalRelacion> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/participantes/${participanteId}/asistencia`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ asistio }),
    });

    const result = await handleResponse<ApiResponse<SgcPersonalRelacion>>(response);
    if (!result.data) {
      throw new Error('Error al actualizar asistencia');
    }
    return result.data;
  },

  // Eliminar participante de una minuta
  async removeParticipante(minutaId: string, participanteId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/participantes/${participanteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== ENDPOINTS SGC PARA DOCUMENTOS ==========

export const minutasDocumentosService = {
  // Obtener documentos de una minuta
  async getDocumentos(minutaId: string): Promise<SgcDocumentoRelacionado[]> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/documentos`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcDocumentoRelacionado[]>>(response);
    return result.data || [];
  },

  // Agregar documento a una minuta
  async addDocumento(minutaId: string, documento: {
    documento_id: number;
    tipo_relacion?: string;
    descripcion?: string;
    es_obligatorio?: boolean;
  }): Promise<SgcDocumentoRelacionado> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/documentos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(documento),
    });

    const result = await handleResponse<ApiResponse<SgcDocumentoRelacionado>>(response);
    if (!result.data) {
      throw new Error('Error al agregar documento');
    }
    return result.data;
  },

  // Eliminar documento de una minuta
  async removeDocumento(minutaId: string, documentoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/documentos/${documentoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== ENDPOINTS SGC PARA NORMAS ==========

export const minutasNormasService = {
  // Obtener normas de una minuta
  async getNormas(minutaId: string): Promise<SgcNormaRelacionada[]> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/normas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcNormaRelacionada[]>>(response);
    return result.data || [];
  },

  // Agregar norma a una minuta
  async addNorma(minutaId: string, norma: {
    norma_id: number;
    punto_norma: string;
    clausula_descripcion?: string;
    tipo_relacion?: string;
    nivel_cumplimiento?: string;
    observaciones?: string;
    evidencias?: string;
    acciones_requeridas?: string;
  }): Promise<SgcNormaRelacionada> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/normas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(norma),
    });

    const result = await handleResponse<ApiResponse<SgcNormaRelacionada>>(response);
    if (!result.data) {
      throw new Error('Error al agregar norma');
    }
    return result.data;
  },

  // Eliminar norma de una minuta
  async removeNorma(minutaId: string, normaId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/minutas/${minutaId}/normas/${normaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== FUNCIONES DE UTILIDAD ==========

export const minutasUtils = {
  // Generar código único para minuta
  generateMinutaCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `MIN-${timestamp}`;
  },

  // Validar formulario de minuta
  validateMinutaForm(minuta: MinutaForm): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!minuta.titulo?.trim()) {
      errors.push('El título de la minuta es obligatorio');
    }

    if (minuta.titulo && minuta.titulo.length < 3) {
      errors.push('El título debe tener al menos 3 caracteres');
    }

    if (minuta.titulo && minuta.titulo.length > 200) {
      errors.push('El título no puede exceder 200 caracteres');
    }

    if (!minuta.fecha) {
      errors.push('La fecha es obligatoria');
    }

    if (!minuta.hora_inicio) {
      errors.push('La hora de inicio es obligatoria');
    }

    if (!minuta.hora_fin) {
      errors.push('La hora de fin es obligatoria');
    }

    if (minuta.hora_inicio && minuta.hora_fin && minuta.hora_inicio >= minuta.hora_fin) {
      errors.push('La hora de fin debe ser posterior a la hora de inicio');
    }

    if (!minuta.lugar?.trim()) {
      errors.push('El lugar es obligatorio');
    }

    if (!minuta.tipo) {
      errors.push('El tipo de minuta es obligatorio');
    }

    if (!minuta.organizador_id) {
      errors.push('El organizador es obligatorio');
    }

    if (!minuta.agenda?.trim()) {
      errors.push('La agenda es obligatoria');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formatear fecha y hora
  formatDateTime(dateString: string, timeString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })} a las ${timeString}`;
  },

  // Obtener color para estado
  getEstadoColor(estado: string): string {
    const colors = {
      programada: 'text-blue-600 bg-blue-100',
      en_proceso: 'text-yellow-600 bg-yellow-100',
      completada: 'text-green-600 bg-green-100',
      cancelada: 'text-red-600 bg-red-100',
    };
    return colors[estado as keyof typeof colors] || colors.programada;
  },

  // Obtener color para tipo
  getTipoColor(tipo: string): string {
    const colors = {
      reunion: 'text-purple-600 bg-purple-100',
      auditoria: 'text-orange-600 bg-orange-100',
      revision: 'text-blue-600 bg-blue-100',
      capacitacion: 'text-green-600 bg-green-100',
    };
    return colors[tipo as keyof typeof colors] || colors.reunion;
  },
};

// ========== HOOKS PERSONALIZADOS ==========

// Hook para manejar estados de carga y error
export const useMinutasState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      return await asyncFn();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeWithLoading,
    clearError: () => setError(null),
  };
};

// Exportar todo como un objeto principal
export default {
  minutas: minutasService,
  participantes: minutasParticipantesService,
  documentos: minutasDocumentosService,
  normas: minutasNormasService,
  utils: minutasUtils,
};
