// ========== SERVICIO API PARA PROCESOS SGC ==========

import { useState } from 'react';
import { 
  ProcesoSgc, 
  ProcesoSgcCompleto, 
  ProcesoSgcForm, 
  ProcesoSgcFiltros, 
  ProcesoSgcDashboard,
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

// ========== ENDPOINTS PRINCIPALES DE PROCESOS ==========

export const procesosService = {
  // Obtener todos los procesos
  async getProcesos(filtros?: ProcesoSgcFiltros): Promise<PaginatedResponse<ProcesoSgc>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE_URL}/api/procesos${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<PaginatedResponse<ProcesoSgc>>(response);
  },

  // Obtener proceso por ID
  async getProcesoById(id: string): Promise<ProcesoSgcCompleto> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<ProcesoSgcCompleto>>(response);
    if (!result.data) {
      throw new Error('No se encontró el proceso');
    }
    return result.data;
  },

  // Crear nuevo proceso
  async createProceso(proceso: ProcesoSgcForm): Promise<ProcesoSgc> {
    const response = await fetch(`${API_BASE_URL}/api/procesos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(proceso),
    });

    const result = await handleResponse<ApiResponse<ProcesoSgc>>(response);
    if (!result.data) {
      throw new Error('Error al crear el proceso');
    }
    return result.data;
  },

  // Actualizar proceso
  async updateProceso(id: string, proceso: Partial<ProcesoSgcForm>): Promise<ProcesoSgc> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(proceso),
    });

    const result = await handleResponse<ApiResponse<ProcesoSgc>>(response);
    if (!result.data) {
      throw new Error('Error al actualizar el proceso');
    }
    return result.data;
  },

  // Eliminar proceso (soft delete)
  async deleteProceso(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },

  // Obtener dashboard de procesos
  async getDashboard(): Promise<ProcesoSgcDashboard> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/dashboard/sgc`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<ProcesoSgcDashboard>>(response);
    if (!result.data) {
      throw new Error('Error al cargar el dashboard');
    }
    return result.data;
  },
};

// ========== ENDPOINTS SGC PARA PARTICIPANTES ==========

export const procesosParticipantesService = {
  // Obtener participantes de un proceso
  async getParticipantes(procesoId: string): Promise<SgcPersonalRelacion[]> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/participantes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcPersonalRelacion[]>>(response);
    return result.data || [];
  },

  // Agregar participante a un proceso
  async addParticipante(procesoId: string, participante: {
    personal_id: string;
    rol?: string;
    observaciones?: string;
  }): Promise<SgcPersonalRelacion> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/participantes`, {
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

  // Eliminar participante de un proceso
  async removeParticipante(procesoId: string, participanteId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/participantes/${participanteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== ENDPOINTS SGC PARA DOCUMENTOS ==========

export const procesosDocumentosService = {
  // Obtener documentos de un proceso
  async getDocumentos(procesoId: string): Promise<SgcDocumentoRelacionado[]> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/documentos`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcDocumentoRelacionado[]>>(response);
    return result.data || [];
  },

  // Agregar documento a un proceso
  async addDocumento(procesoId: string, documento: {
    documento_id: number;
    tipo_relacion?: string;
    descripcion?: string;
    es_obligatorio?: boolean;
  }): Promise<SgcDocumentoRelacionado> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/documentos`, {
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

  // Eliminar documento de un proceso
  async removeDocumento(procesoId: string, documentoId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/documentos/${documentoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== ENDPOINTS SGC PARA NORMAS ==========

export const procesosNormasService = {
  // Obtener normas de un proceso
  async getNormas(procesoId: string): Promise<SgcNormaRelacionada[]> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/normas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<ApiResponse<SgcNormaRelacionada[]>>(response);
    return result.data || [];
  },

  // Agregar norma a un proceso
  async addNorma(procesoId: string, norma: {
    norma_id: number;
    punto_norma: string;
    clausula_descripcion?: string;
    tipo_relacion?: string;
    nivel_cumplimiento?: string;
    observaciones?: string;
    evidencias?: string;
    acciones_requeridas?: string;
  }): Promise<SgcNormaRelacionada> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/normas`, {
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

  // Eliminar norma de un proceso
  async removeNorma(procesoId: string, normaId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/procesos/${procesoId}/normas/${normaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ApiResponse<void>>(response);
  },
};

// ========== FUNCIONES DE UTILIDAD ==========

export const procesosUtils = {
  // Generar código único para proceso
  generateProcesoCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `PROC-${timestamp}`;
  },

  // Validar formulario de proceso
  validateProcesoForm(proceso: ProcesoSgcForm): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!proceso.nombre?.trim()) {
      errors.push('El nombre del proceso es obligatorio');
    }

    if (proceso.nombre && proceso.nombre.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (proceso.nombre && proceso.nombre.length > 200) {
      errors.push('El nombre no puede exceder 200 caracteres');
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

  // Obtener color para estado
  getEstadoColor(estado: string): string {
    const colors = {
      activo: 'text-green-600 bg-green-100',
      inactivo: 'text-gray-600 bg-gray-100',
      obsoleto: 'text-red-600 bg-red-100',
      en_revision: 'text-yellow-600 bg-yellow-100',
    };
    return colors[estado as keyof typeof colors] || colors.inactivo;
  },

  // Obtener color para nivel crítico
  getNivelCriticoColor(nivel: string): string {
    const colors = {
      bajo: 'text-blue-600 bg-blue-100',
      medio: 'text-yellow-600 bg-yellow-100',
      alto: 'text-orange-600 bg-orange-100',
      critico: 'text-red-600 bg-red-100',
    };
    return colors[nivel as keyof typeof colors] || colors.bajo;
  },
};

// ========== HOOKS PERSONALIZADOS ==========

// Hook para manejar estados de carga y error
export const useProcesosState = () => {
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
  procesos: procesosService,
  participantes: procesosParticipantesService,
  documentos: procesosDocumentosService,
  normas: procesosNormasService,
  utils: procesosUtils,
};
