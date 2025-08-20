// ===============================================
// SERVICIOS PARA MÓDULO CRM
// Agente: CRM CON VENDEDORES
// ===============================================

import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/crm');

// ========== SERVICIOS DE CLIENTES ==========

export const crmService = {
  // Obtener todos los clientes
  async getClientes(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/clientes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  async getCliente(id) {
    try {
      const response = await apiClient.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      throw error;
    }
  },

  // Crear nuevo cliente
  async createCliente(clienteData) {
    try {
      const response = await apiClient.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  },

  // Actualizar cliente
  async updateCliente(id, clienteData) {
    try {
      const response = await apiClient.put(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  },

  // Eliminar cliente
  async deleteCliente(id) {
    try {
      const response = await apiClient.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  },

  // ========== SERVICIOS DE OPORTUNIDADES ==========

  // Obtener todas las oportunidades
  async getOportunidades(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/oportunidades?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo oportunidades:', error);
      throw error;
    }
  },

  // Obtener oportunidad por ID
  async getOportunidad(id) {
    try {
      const response = await apiClient.get(`/oportunidades/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo oportunidad:', error);
      throw error;
    }
  },

  // Crear nueva oportunidad
  async createOportunidad(oportunidadData) {
    try {
      const response = await apiClient.post('/oportunidades', oportunidadData);
      return response.data;
    } catch (error) {
      console.error('Error creando oportunidad:', error);
      throw error;
    }
  },

  // Actualizar oportunidad
  async updateOportunidad(id, oportunidadData) {
    try {
      const response = await apiClient.put(`/oportunidades/${id}`, oportunidadData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando oportunidad:', error);
      throw error;
    }
  },

  // ========== SERVICIOS DE ACTIVIDADES ==========

  // Obtener todas las actividades
  async getActividades(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/actividades?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo actividades:', error);
      throw error;
    }
  },

  // Crear nueva actividad
  async createActividad(actividadData) {
    try {
      const response = await apiClient.post('/actividades', actividadData);
      return response.data;
    } catch (error) {
      console.error('Error creando actividad:', error);
      throw error;
    }
  },

  // ========== SERVICIOS DE ESTADÍSTICAS ==========

  // Obtener estadísticas generales
  async getEstadisticas() {
    try {
      const response = await apiClient.get('/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Obtener vendedores con métricas
  async getVendedores() {
    try {
      const response = await apiClient.get('/vendedores');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo vendedores:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS ESPECÍFICOS PARA VENDEDORES ==========

export const vendedoresService = {
  // Obtener vendedores de la tabla personal
  async getVendedoresPersonal() {
    try {
      const response = await apiClient.get('/personal/comercial');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo vendedores del personal:', error);
      throw error;
    }
  },

  // Obtener vendedores por zona
  async getVendedoresPorZona(zona) {
    try {
      const response = await apiClient.get(`/personal/comercial/zona/${zona}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo vendedores por zona:', error);
      throw error;
    }
  },

  // Obtener vendedores por especialidad
  async getVendedoresPorEspecialidad(especialidad) {
    try {
      const response = await apiClient.get(`/personal/comercial/especialidad/${especialidad}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo vendedores por especialidad:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS DE INTEGRACIÓN CON SGC ==========

export const crmSgcService = {
  // Obtener hallazgos relacionados con un vendedor
  async getHallazgosVendedor(vendedorId) {
    try {
      const response = await apiClient.get(`/hallazgos/vendedor/${vendedorId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo hallazgos del vendedor:', error);
      throw error;
    }
  },

  // Obtener auditorías relacionadas con un vendedor
  async getAuditoriasVendedor(vendedorId) {
    try {
      const response = await apiClient.get(`/auditorias/vendedor/${vendedorId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo auditorías del vendedor:', error);
      throw error;
    }
  },

  // Obtener acciones relacionadas con un vendedor
  async getAccionesVendedor(vendedorId) {
    try {
      const response = await apiClient.get(`/acciones/vendedor/${vendedorId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo acciones del vendedor:', error);
      throw error;
    }
  }
};

// ========== FUNCIONES UTILITARIAS ==========

export const crmUtils = {
  // Formatear moneda
  formatearMoneda(valor, moneda = 'MXN') {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: moneda
    }).format(valor);
  },

  // Calcular tiempo de cierre
  calcularTiempoCierre(fechaInicio, fechaCierre) {
    const inicio = new Date(fechaInicio);
    const cierre = new Date(fechaCierre);
    const diffTime = Math.abs(cierre.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // días
  },

  // Calcular probabilidad por etapa
  calcularProbabilidadEtapa(etapa) {
    const probabilidades = {
      'prospeccion': 10,
      'calificacion': 25,
      'propuesta': 50,
      'negociacion': 75,
      'cerrada_ganada': 100,
      'cerrada_perdida': 0
    };
    return probabilidades[etapa] || 0;
  },

  // Obtener color por tipo de cliente
  getTipoClienteColor(tipo) {
    const colores = {
      'potencial': 'blue',
      'activo': 'green',
      'inactivo': 'gray'
    };
    return colores[tipo] || 'gray';
  },

  // Obtener color por etapa de oportunidad
  getEtapaOportunidadColor(etapa) {
    const colores = {
      'prospeccion': 'gray',
      'calificacion': 'blue',
      'propuesta': 'yellow',
      'negociacion': 'orange',
      'cerrada_ganada': 'green',
      'cerrada_perdida': 'red'
    };
    return colores[etapa] || 'gray';
  },

  // Obtener color por tipo de actividad
  getTipoActividadColor(tipo) {
    const colores = {
      'llamada': 'blue',
      'email': 'green',
      'reunion': 'purple',
      'visita': 'orange',
      'propuesta': 'yellow',
      'seguimiento': 'cyan',
      'otro': 'gray'
    };
    return colores[tipo] || 'gray';
  },

  // Validar datos de cliente
  validarCliente(cliente) {
    const errores = [];
    
    if (!cliente.nombre || cliente.nombre.trim() === '') {
      errores.push('El nombre del cliente es requerido');
    }
    
    if (cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      errores.push('El email no tiene un formato válido');
    }
    
    if (cliente.telefono && !/^[\d\s\-\+\(\)]+$/.test(cliente.telefono)) {
      errores.push('El teléfono no tiene un formato válido');
    }
    
    return errores;
  },

  // Validar datos de oportunidad
  validarOportunidad(oportunidad) {
    const errores = [];
    
    if (!oportunidad.titulo || oportunidad.titulo.trim() === '') {
      errores.push('El título de la oportunidad es requerido');
    }
    
    if (!oportunidad.cliente_id) {
      errores.push('Debe seleccionar un cliente');
    }
    
    if (!oportunidad.vendedor_id) {
      errores.push('Debe asignar un vendedor');
    }
    
    if (oportunidad.valor_estimado < 0) {
      errores.push('El valor estimado no puede ser negativo');
    }
    
    if (oportunidad.probabilidad < 0 || oportunidad.probabilidad > 100) {
      errores.push('La probabilidad debe estar entre 0 y 100');
    }
    
    return errores;
  },

  // Validar datos de actividad
  validarActividad(actividad) {
    const errores = [];
    
    if (!actividad.titulo || actividad.titulo.trim() === '') {
      errores.push('El título de la actividad es requerido');
    }
    
    if (!actividad.vendedor_id) {
      errores.push('Debe asignar un vendedor');
    }
    
    if (!actividad.fecha_actividad) {
      errores.push('La fecha de la actividad es requerida');
    }
    
    if (actividad.duracion_minutos < 0) {
      errores.push('La duración no puede ser negativa');
    }
    
    return errores;
  }
};

export default crmService;
