// ===============================================
// SERVICIOS PARA MÓDULO CRM AGRO
// Agente: CRM CON VENDEDORES
// ===============================================

import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/crm');

// ========== SERVICIOS DE CONTACTOS ==========

export const contactosService = {
  // Obtener todos los contactos
  async getContactos(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/contactos?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo contactos:', error);
      return { data: [] };
    }
  },

  // Obtener contacto por ID
  async getContacto(id) {
    try {
      const response = await apiClient.get(`/contactos/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo contacto:', error);
      return { data: null };
    }
  },

  // Crear nuevo contacto
  async createContacto(contactoData) {
    try {
      const response = await apiClient.post('/contactos', contactoData);
      return response;
    } catch (error) {
      console.error('Error creando contacto:', error);
      throw error;
    }
  },

  // Actualizar contacto
  async updateContacto(id, contactoData) {
    try {
      const response = await apiClient.put(`/contactos/${id}`, contactoData);
      return response;
    } catch (error) {
      console.error('Error actualizando contacto:', error);
      throw error;
    }
  },

  // Eliminar contacto
  async deleteContacto(id) {
    try {
      const response = await apiClient.delete(`/contactos/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS DE CLIENTES AGRO ==========

export const clientesAgroService = {
  // Obtener todos los clientes agro
  async getClientesAgro(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/clientes-agro?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo clientes agro:', error);
      return { data: [] };
    }
  },

  // Obtener cliente agro por ID
  async getClienteAgro(id) {
    try {
      const response = await apiClient.get(`/clientes-agro/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo cliente agro:', error);
      return { data: null };
    }
  },

  // Crear nuevo cliente agro
  async createClienteAgro(clienteData) {
    try {
      const response = await apiClient.post('/clientes-agro', clienteData);
      return response;
    } catch (error) {
      console.error('Error creando cliente agro:', error);
      throw error;
    }
  },

  // Actualizar cliente agro
  async updateClienteAgro(id, clienteData) {
    try {
      const response = await apiClient.put(`/clientes-agro/${id}`, clienteData);
      return response;
    } catch (error) {
      console.error('Error actualizando cliente agro:', error);
      throw error;
    }
  },

  // Eliminar cliente agro
  async deleteClienteAgro(id) {
    try {
      const response = await apiClient.delete(`/clientes-agro/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando cliente agro:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS DE CULTIVOS ==========

export const cultivosService = {
  // Obtener cultivos de un cliente
  async getCultivosCliente(clienteId) {
    try {
      const response = await apiClient.get(`/cultivos-cliente/${clienteId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo cultivos:', error);
      return { data: [] };
    }
  },

  // Crear nuevo cultivo
  async createCultivo(cultivoData) {
    try {
      const response = await apiClient.post('/cultivos-cliente', cultivoData);
      return response;
    } catch (error) {
      console.error('Error creando cultivo:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS DE OPORTUNIDADES AGRO ==========

export const oportunidadesAgroService = {
  // Obtener todas las oportunidades agro
  async getOportunidadesAgro(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/oportunidades-agro?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo oportunidades agro:', error);
      return { data: [] };
    }
  },

  // Obtener oportunidad agro por ID
  async getOportunidadAgro(id) {
    try {
      const response = await apiClient.get(`/oportunidades-agro/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo oportunidad agro:', error);
      return { data: null };
    }
  },

  // Crear nueva oportunidad agro
  async createOportunidadAgro(oportunidadData) {
    try {
      const response = await apiClient.post('/oportunidades-agro', oportunidadData);
      return response;
    } catch (error) {
      console.error('Error creando oportunidad agro:', error);
      throw error;
    }
  },

  // Actualizar oportunidad agro
  async updateOportunidadAgro(id, oportunidadData) {
    try {
      const response = await apiClient.put(`/oportunidades-agro/${id}`, oportunidadData);
      return response;
    } catch (error) {
      console.error('Error actualizando oportunidad agro:', error);
      throw error;
    }
  },

  // Eliminar oportunidad agro
  async deleteOportunidadAgro(id) {
    try {
      const response = await apiClient.delete(`/oportunidades-agro/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando oportunidad agro:', error);
      throw error;
    }
  }
};

// ========== SERVICIOS DE REFERENCIA ==========

export const referenciaService = {
  // Obtener vendedores disponibles
  async getVendedores() {
    try {
      const response = await apiClient.get('/vendedores');
      return response;
    } catch (error) {
      console.error('Error obteniendo vendedores:', error);
      return { data: [] };
    }
  },

  // Obtener técnicos disponibles
  async getTecnicos() {
    try {
      const response = await apiClient.get('/tecnicos');
      return response;
    } catch (error) {
      console.error('Error obteniendo técnicos:', error);
      return { data: [] };
    }
  }
};

// ========== SERVICIOS LEGACY (MANTENER COMPATIBILIDAD) ==========

export const crmService = {
  // Obtener todos los clientes (legacy)
  async getClientes(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/clientes?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      return { data: [] };
    }
  },

  // Obtener cliente por ID (legacy)
  async getCliente(id) {
    try {
      const response = await apiClient.get(`/clientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      return { data: null };
    }
  },

  // Crear nuevo cliente (legacy)
  async createCliente(clienteData) {
    try {
      const response = await apiClient.post('/clientes', clienteData);
      return response;
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  },

  // Actualizar cliente (legacy)
  async updateCliente(id, clienteData) {
    try {
      const response = await apiClient.put(`/clientes/${id}`, clienteData);
      return response;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  },

  // Eliminar cliente (legacy)
  async deleteCliente(id) {
    try {
      const response = await apiClient.delete(`/clientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  }
};

// ========== EXPORTAR TODOS LOS SERVICIOS ==========

export default {
  contactos: contactosService,
  clientesAgro: clientesAgroService,
  cultivos: cultivosService,
  referencia: referenciaService,
  legacy: crmService
};
