import apiService from './apiService';

export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'en_produccion' | 'descontinuado';
  tipo: 'producto' | 'servicio';
  categoria: string;
  responsable: string;
  fecha_creacion: string;
  fecha_revision: string;
  version: string;
  especificaciones: string;
  requisitos_calidad: string;
  proceso_aprobacion: string;
  documentos_asociados: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductoData {
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'en_produccion' | 'descontinuado';
  tipo: 'producto' | 'servicio';
  categoria: string;
  responsable: string;
  fecha_creacion: string;
  fecha_revision: string;
  version: string;
  especificaciones?: string;
  requisitos_calidad?: string;
  proceso_aprobacion?: string;
  documentos_asociados?: string;
  observaciones?: string;
}

export interface UpdateProductoData extends Partial<CreateProductoData> {
  id: number;
}

class ProductosService {
  private baseUrl = '/api/productos';

  async getAll(): Promise<Producto[]> {
    try {
      const response = await apiService.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Producto> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching producto by ID:', error);
      throw error;
    }
  }

  async create(data: CreateProductoData): Promise<Producto> {
    try {
      const response = await apiService.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating producto:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProductoData): Promise<Producto> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating producto:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting producto:', error);
      throw error;
    }
  }

  async updateEstado(id: number, estado: string): Promise<Producto> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error updating estado de producto:', error);
      throw error;
    }
  }

  async getByEstado(estado: string): Promise<Producto[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos by estado:', error);
      throw error;
    }
  }

  async getByTipo(tipo: string): Promise<Producto[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos by tipo:', error);
      throw error;
    }
  }

  async getByCategoria(categoria: string): Promise<Producto[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/categoria/${categoria}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos by categoria:', error);
      throw error;
    }
  }

  async getEstadisticas(): Promise<{
    total: number;
    porEstado: Record<string, number>;
    porTipo: Record<string, number>;
    porCategoria: Record<string, number>;
  }> {
    try {
      const response = await apiService.get(`${this.baseUrl}/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error fetching estadísticas de productos:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Producto[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching productos:', error);
      throw error;
    }
  }

  // Métodos legacy para compatibilidad
  async getProductos(): Promise<Producto[]> {
    return this.getAll();
  }

  async getProducto(id: number): Promise<Producto> {
    return this.getById(id);
  }

  async createProducto(data: CreateProductoData): Promise<Producto> {
    return this.create(data);
  }

  async updateProducto(id: number, data: UpdateProductoData): Promise<Producto> {
    return this.update(id, data);
  }

  async deleteProducto(id: number): Promise<void> {
    return this.delete(id);
  }

  async getHistorial(id: number): Promise<any[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error fetching historial de producto:', error);
      throw error;
    }
  }
}

const productosService = new ProductosService();
export default productosService;