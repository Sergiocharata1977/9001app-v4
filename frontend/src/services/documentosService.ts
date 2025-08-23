import apiService from './apiService';
import type { ApiResponse } from '../types/api';
import type { DocumentoSistema, DocumentoFormData } from '../types';

interface DocumentUploadResponse {
  id: number;
  nombre: string;
  ruta_archivo: string;
  tipo: string;
  tamaño: number;
  mime_type: string;
}

interface DocumentDownloadConfig {
  responseType: 'blob';
}

const documentosService = {
  // Obtener todos los documentos
  async getDocumentos(): Promise<DocumentoSistema[]> {
    try {
      console.log('📄 Obteniendo todos los documentos...');
      const response: ApiResponse<DocumentoSistema[]> = await apiService.get('/documentos');
      console.log(`✅ ${response?.data?.length || 0} documentos obtenidos`);
      console.log('📄 Respuesta completa:', response);
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('❌ Error al obtener documentos:', error);
      return [];
    }
  },

  // Obtener documento por ID
  async getDocumentoById(id: number): Promise<ApiResponse<DocumentoSistema>> {
    try {
      const response: ApiResponse<DocumentoSistema> = await apiService.get(`/documentos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener documento ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo documento
  async createDocumento(data: DocumentoFormData): Promise<ApiResponse<DocumentoSistema>> {
    try {
      const response: ApiResponse<DocumentoSistema> = await apiService.post('/documentos', data);
      return response;
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  // Actualizar documento
  async updateDocumento(id: number, data: Partial<DocumentoFormData>): Promise<ApiResponse<DocumentoSistema>> {
    try {
      const response: ApiResponse<DocumentoSistema> = await apiService.put(`/documentos/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error al actualizar documento ${id}:`, error);
      throw error;
    }
  },

  // Subir documento
  async uploadDocument(
    file: File, 
    tipo: 'minuta' | 'auditoria' | 'procedimiento' | 'politica' | 'registro' | 'manual' | 'otro' = 'minuta'
  ): Promise<ApiResponse<DocumentUploadResponse>> {
    const formData = new FormData();
    formData.append('documento', file);
    formData.append('tipo', tipo);
    
    return await apiService.post('/documentos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Obtener documentos por tipo
  async getDocumentosByTipo(
    tipo: 'minuta' | 'auditoria' | 'procedimiento' | 'politica' | 'registro' | 'manual' | 'otro'
  ): Promise<ApiResponse<DocumentoSistema[]>> {
    return await apiService.get(`/documentos/tipo/${tipo}`);
  },

  // Eliminar documento
  async deleteDocumento(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete(`/documentos/${id}`);
  },

  // Descargar documento
  async downloadDocumento(id: number): Promise<ApiResponse<Blob>> {
    return await apiService.get(`/documentos/${id}/download`, {
      responseType: 'blob',
    } as DocumentDownloadConfig);
  },
};

export default documentosService;