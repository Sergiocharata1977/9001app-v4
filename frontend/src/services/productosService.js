import { apiService } from './apiService';

// Datos mock para desarrollo
const mockProductos = [
  {
    id: '1',
    nombre: 'Software de Gestión ISO 9001',
    descripcion: 'Sistema integral para la gestión de calidad según ISO 9001:2015',
    codigo: 'SW-ISO-001',
    estado: 'Activo',
    tipo: 'Software',
    categoria: 'Sistemas de Gestión',
    responsable: 'Juan Pérez',
    fecha_creacion: '2024-01-15',
    fecha_revision: '2024-06-15',
    version: '2.1',
    especificaciones: 'Desarrollado en React y Node.js',
    requisitos_calidad: 'Cumple con estándares de seguridad y usabilidad',
    proceso_aprobacion: 'Aprobado por comité de calidad',
    documentos_asociados: 'Manual de usuario, Documentación técnica',
    observaciones: 'Sistema en producción estable'
  },
  {
    id: '2',
    nombre: 'Servicio de Consultoría ISO',
    descripcion: 'Asesoramiento especializado en implementación de sistemas de calidad',
    codigo: 'SERV-CON-001',
    estado: 'Aprobado',
    tipo: 'Servicio',
    categoria: 'Consultoría',
    responsable: 'María García',
    fecha_creacion: '2024-02-20',
    fecha_revision: '2024-07-20',
    version: '1.0',
    especificaciones: 'Servicio personalizado según necesidades del cliente',
    requisitos_calidad: 'Consultores certificados con experiencia mínima de 5 años',
    proceso_aprobacion: 'Aprobado por dirección general',
    documentos_asociados: 'Propuesta comercial, Contrato de servicio',
    observaciones: 'Servicio de alta demanda'
  },
  {
    id: '3',
    nombre: 'Manual de Calidad',
    descripcion: 'Documento principal del sistema de gestión de calidad',
    codigo: 'DOC-MAN-001',
    estado: 'En Revisión',
    tipo: 'Documento',
    categoria: 'Documentación',
    responsable: 'Carlos López',
    fecha_creacion: '2024-03-10',
    fecha_revision: '2024-08-10',
    version: '3.0',
    especificaciones: 'Documento en formato PDF y Word',
    requisitos_calidad: 'Debe cumplir con estructura ISO 9001:2015',
    proceso_aprobacion: 'En proceso de revisión por auditoría interna',
    documentos_asociados: 'Procedimientos, Instrucciones de trabajo',
    observaciones: 'Requiere actualización según nueva normativa'
  }
];

const productosService = {
  // Obtener todos los productos de la organización
  getProductos: async () => {
    try {
      const response = await apiService.get('/productos');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductos:', error);
      console.log('🔧 Usando datos mock para productos');
      return mockProductos;
    }
  },

  // Obtener un producto específico
  getProducto: async (id) => {
    try {
      const response = await apiService.get(`/productos/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProducto:', error);
      console.log('🔧 Usando datos mock para producto específico');
      const producto = mockProductos.find(p => p.id === id);
      if (producto) {
        return producto;
      }
      throw new Error('Producto no encontrado');
    }
  },

  // Crear un nuevo producto
  createProducto: async (productoData) => {
    try {
      const response = await apiService.post('/productos', productoData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en createProducto:', error);
      console.log('🔧 Simulando creación de producto con datos mock');
      const nuevoProducto = {
        id: Date.now().toString(),
        ...productoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockProductos.push(nuevoProducto);
      return nuevoProducto;
    }
  },

  // Actualizar un producto existente
  updateProducto: async (id, productoData) => {
    try {
      const response = await apiService.put(`/productos/${id}`, productoData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en updateProducto:', error);
      console.log('🔧 Simulando actualización de producto con datos mock');
      const index = mockProductos.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProductos[index] = {
          ...mockProductos[index],
          ...productoData,
          updated_at: new Date().toISOString()
        };
        return mockProductos[index];
      }
      throw new Error('Producto no encontrado');
    }
  },

  // Eliminar un producto
  deleteProducto: async (id) => {
    try {
      const response = await apiService.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en deleteProducto:', error);
      console.log('🔧 Simulando eliminación de producto con datos mock');
      const index = mockProductos.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProductos.splice(index, 1);
        return { success: true, message: 'Producto eliminado' };
      }
      throw new Error('Producto no encontrado');
    }
  },

  // Obtener historial de cambios de un producto
  getHistorial: async (id) => {
    try {
      const response = await apiService.get(`/productos/${id}/historial`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getHistorial:', error);
      console.log('🔧 Usando historial mock');
      return [
        {
          id: '1',
          accion: 'Creación',
          descripcion: 'Producto creado inicialmente',
          fecha: new Date().toISOString(),
          usuario: 'Sistema'
        },
        {
          id: '2',
          accion: 'Actualización',
          descripcion: 'Información básica actualizada',
          fecha: new Date(Date.now() - 86400000).toISOString(),
          usuario: 'Usuario'
        }
      ];
    }
  },

  // Obtener productos por estado
  getProductosPorEstado: async (estado) => {
    try {
      const response = await apiService.get(`/productos?estado=${estado}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorEstado:', error);
      throw error;
    }
  },

  // Obtener productos por tipo
  getProductosPorTipo: async (tipo) => {
    try {
      const response = await apiService.get(`/productos?tipo=${tipo}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorTipo:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductosPorCategoria: async (categoria) => {
    try {
      const response = await apiService.get(`/productos?categoria=${categoria}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getProductosPorCategoria:', error);
      throw error;
    }
  },

  // Buscar productos
  buscarProductos: async (termino) => {
    try {
      const response = await apiService.get(`/productos?search=${termino}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en buscarProductos:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  getEstadisticas: async () => {
    try {
      const response = await apiService.get('/productos/estadisticas');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      throw error;
    }
  },

  // Exportar productos
  exportarProductos: async (formato = 'excel') => {
    try {
      const response = await apiService.get(`/productos/exportar?formato=${formato}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error en exportarProductos:', error);
      throw error;
    }
  }
};

export default productosService;
