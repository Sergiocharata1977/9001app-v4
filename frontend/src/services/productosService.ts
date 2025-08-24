import apiService from './apiService';
import type { Producto, ProductoFormData } from '../types';

// Parámetros de búsqueda para productos
interface ProductoSearchParams {
  q: string;
}

// Parámetros de filtro por categoría
interface ProductoCategoryParams {
  categoria: string;
}

// Servicio para gestión de productos y servicios
export const productosService = {
  // Obtener todos los productos (alias para compatibilidad)
  async getProductos(): Promise<Producto[]> {
    return this.getAll();
  },
  
  // Obtener todos los productos
  async getAll(): Promise<Producto[]> {
    try {
      const response = await apiService.get('/productos');
      
      // Asegurar que devolvemos un array
      if (response.data && Array.isArray(response.data)) {
        // Si el backend devuelve directamente el array en data
        return response.data;
      } else if (Array.isArray(response.data)) {
        // Si el backend devuelve directamente el array
        return response.data;
      } else {
        console.warn('Respuesta inesperada del backend:', response);
        return []; // Devolver array vacío si la respuesta no es la esperada
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getById(id: number): Promise<Producto> {
    try {
      const response = await apiService.get(`/productos/${id}`);
      if (!response.data) {
        throw new Error('Producto no encontrado');
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async create(productoData: ProductoFormData): Promise<Producto> {
    try {
      const response = await apiService.post('/productos', productoData);
      if (!response.data) {
        throw new Error('Error al crear producto');
      }
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async update(id: number, productoData: Partial<ProductoFormData>): Promise<Producto> {
    try {
      const response = await apiService.put(`/productos/${id}`, productoData);
      if (!response.data) {
        throw new Error('Error al actualizar producto');
      }
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async delete(id: number): Promise<{ message: string }> {
    try {
      const response = await apiService.delete(`/productos/${id}`);
      if (!response.data) {
        throw new Error('Error al eliminar producto');
      }
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // Buscar productos
  async search(query: string): Promise<Producto[]> {
    try {
      const response = await apiService.get('/productos/search', {
        params: { q: query } as ProductoSearchParams
      });
      if (!response.data) {
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  async getByCategory(categoria: string): Promise<Producto[]> {
    try {
      const response = await apiService.get('/productos/categoria', {
        params: { categoria } as ProductoCategoryParams
      });
      if (!response.data) {
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }
};

export default productosService;