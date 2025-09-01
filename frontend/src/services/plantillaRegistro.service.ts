import axios from 'axios';
import { IPlantillaRegistro, IEstado } from '../types/editorRegistros';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class PlantillaRegistroService {
  private baseURL = `${API_URL}/plantillas-registro`;

  // Obtener token del localStorage
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // CRUD básico
  async crear(plantilla: Partial<IPlantillaRegistro>): Promise<IPlantillaRegistro> {
    const response = await axios.post(this.baseURL, plantilla, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async listar(filtros?: {
    activo?: boolean;
    categoria?: string;
    modulo?: string;
    busqueda?: string;
    pagina?: number;
    limite?: number;
  }): Promise<{
    data: IPlantillaRegistro[];
    pagination: {
      total: number;
      pagina: number;
      limite: number;
      paginas: number;
    };
  }> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await axios.get(`${this.baseURL}?${params.toString()}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async obtenerPorId(id: string): Promise<IPlantillaRegistro> {
    const response = await axios.get(`${this.baseURL}/${id}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async actualizar(id: string, plantilla: Partial<IPlantillaRegistro>): Promise<IPlantillaRegistro> {
    const response = await axios.put(`${this.baseURL}/${id}`, plantilla, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async eliminar(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Operaciones especiales
  async clonar(id: string, datos?: { nombre?: string; codigo?: string }): Promise<IPlantillaRegistro> {
    const response = await axios.post(`${this.baseURL}/${id}/clonar`, datos || {}, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async toggleActivo(id: string): Promise<{ activo: boolean }> {
    const response = await axios.post(`${this.baseURL}/${id}/activar`, {}, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async validar(id: string): Promise<{
    valida: boolean;
    errores: string[];
    advertencias: string[];
  }> {
    const response = await axios.post(`${this.baseURL}/${id}/validar`, {}, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async preview(id: string, estadoId?: string): Promise<{
    plantilla: {
      nombre: string;
      descripcion?: string;
      codigo: string;
    };
    campos: any[];
  }> {
    const params = estadoId ? `?estadoId=${estadoId}` : '';
    const response = await axios.get(`${this.baseURL}/${id}/preview${params}`, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  // Gestión de estados
  async agregarEstado(plantillaId: string, estado: Partial<IEstado>): Promise<IEstado> {
    const response = await axios.post(`${this.baseURL}/${plantillaId}/estados`, estado, {
      headers: this.getHeaders()
    });
    return response.data.data;
  }

  async actualizarEstado(plantillaId: string, estadoId: string, estado: Partial<IEstado>): Promise<IEstado> {
    const response = await axios.put(
      `${this.baseURL}/${plantillaId}/estados/${estadoId}`, 
      estado, 
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  async eliminarEstado(plantillaId: string, estadoId: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${plantillaId}/estados/${estadoId}`, {
      headers: this.getHeaders()
    });
  }

  async reordenarEstados(plantillaId: string, estadosOrdenados: string[]): Promise<IEstado[]> {
    const response = await axios.put(
      `${this.baseURL}/${plantillaId}/estados/reordenar`,
      { estadosOrdenados },
      { headers: this.getHeaders() }
    );
    return response.data.data;
  }

  // Utilidades
  async obtenerTiposCampo(): Promise<any[]> {
    // Este endpoint podría implementarse en el backend para obtener los tipos de campo disponibles
    // Por ahora retornamos los tipos hardcodeados
    return Promise.resolve([
      { grupo: 'Básicos', tipos: [
        { valor: 'text', label: 'Texto' },
        { valor: 'textarea', label: 'Texto largo' },
        { valor: 'number', label: 'Número' },
        { valor: 'decimal', label: 'Decimal' }
      ]},
      // ... más tipos
    ]);
  }

  async exportarPlantilla(id: string, formato: 'json' | 'yaml' = 'json'): Promise<Blob> {
    const response = await axios.get(
      `${this.baseURL}/${id}/exportar?formato=${formato}`,
      {
        headers: this.getHeaders(),
        responseType: 'blob'
      }
    );
    return response.data;
  }

  async importarPlantilla(archivo: File): Promise<IPlantillaRegistro> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await axios.post(`${this.baseURL}/importar`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
}

export const plantillaRegistroService = new PlantillaRegistroService();