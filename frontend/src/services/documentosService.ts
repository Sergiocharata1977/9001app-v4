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
      const response = await apiService.get('/documentos');
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
      const response = await apiService.get(`/documentos/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Documento obtenido exitosamente'
      };
    } catch (error) {
      console.error(`Error al obtener documento ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo documento
  async createDocumento(data: DocumentoFormData): Promise<ApiResponse<DocumentoSistema>> {
    try {
      const response = await apiService.post('/documentos', data);
      return {
        success: true,
        data: response.data,
        message: 'Documento creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  // Actualizar documento
  async updateDocumento(id: number, data: Partial<DocumentoFormData>): Promise<ApiResponse<DocumentoSistema>> {
    try {
      const response = await apiService.put(`/documentos/${id}`, data);
      return {
        success: true,
        data: response.data,
        message: 'Documento actualizado exitosamente'
      };
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
    
    const response = await apiService.post('/documentos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Documento subido exitosamente'
    };
  },

  // Obtener documentos por tipo
  async getDocumentosByTipo(
    tipo: 'minuta' | 'auditoria' | 'procedimiento' | 'politica' | 'registro' | 'manual' | 'otro'
  ): Promise<ApiResponse<DocumentoSistema[]>> {
    const response = await apiService.get(`/documentos/tipo/${tipo}`);
    return {
      success: true,
      data: response.data,
      message: 'Documentos obtenidos exitosamente'
    };
  },

  // Eliminar documento
  async deleteDocumento(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await apiService.delete(`/documentos/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Documento eliminado exitosamente'
    };
  },

  // Descargar documento
  async downloadDocumento(id: number): Promise<ApiResponse<Blob>> {
    const response = await apiService.get(`/documentos/${id}/download`, {
      responseType: 'blob',
    } as DocumentDownloadConfig);
    
    return {
      success: true,
      data: response.data,
      message: 'Documento descargado exitosamente'
    };
  },
};

export default documentosService;