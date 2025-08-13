import apiService from './apiService';

// Servicio para gestión de productos y servicios
export const productosService = {
  // Obtener todos los productos (alias para compatibilidad)
  async getProductos() {
    return this.getAll();
  },
  
  // Obtener todos los productos
  async getAll() {
    try {
      const response = await apiService.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getById(id) {
    try {
      const response = await apiService.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async create(productoData) {
    try {
      const response = await apiService.post('/productos', productoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async update(id, productoData) {
    try {
      const response = await apiService.put(`/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async delete(id) {
    try {
      const response = await apiService.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // Buscar productos
  async search(query) {
    try {
      const response = await apiService.get('/productos/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  async getByCategory(categoria) {
    try {
      const response = await apiService.get('/productos/categoria', {
        params: { categoria }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }
};

export default productosService;
