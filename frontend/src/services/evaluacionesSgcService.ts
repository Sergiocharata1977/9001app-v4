// ===============================================
// SERVICIO EVALUACIONES SGC ESTANDARIZADO
// Conecta con las APIs SGC del backend
// ===============================================

const API_BASE_URL = '/api/evaluaciones-sgc';

class EvaluacionesSgcService {
  
  // ===============================================
  // MÉTODOS BÁSICOS DE EVALUACIONES
  // ===============================================

  async getAll() {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener evaluaciones SGC:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al obtener evaluación SGC:', error);
      throw error;
    }
  }

  async create(evaluacionData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(evaluacionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al crear evaluación SGC:', error);
      throw error;
    }
  }

  async update(id, evaluacionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(evaluacionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error al actualizar evaluación SGC:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error al eliminar evaluación SGC:', error);
      throw error;
    }
  }

  // ===============================================
  // MÉTODOS ESPECÍFICOS SGC
  // ===============================================

  async getParticipantes(evaluacionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${evaluacionId}/participantes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      throw error;
    }
  }

  async getCompetencias(evaluacionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${evaluacionId}/competencias`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener competencias:', error);
      throw error;
    }
  }

  async getEstadisticas() {
    try {
      const response = await fetch(`${API_BASE_URL}/estadisticas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : {};
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // ===============================================
  // MÉTODOS AUXILIARES
  // ===============================================

  async getPersonal() {
    try {
      // Esta llamada se mantiene a la API de personal existente
      const response = await fetch('/api/personal', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al obtener personal:', error);
      throw error;
    }
  }

  async getCompetenciasCatalogo() {
    try {
      // Esta llamada se mantiene a la API de competencias existente
      const response = await fetch('/api/competencias', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Error al obtener catálogo de competencias:', error);
      throw error;
    }
  }

  // ===============================================
  // MÉTODOS DE COMPATIBILIDAD CON SISTEMA LEGACY
  // ===============================================

  async getLegacy() {
    try {
      const response = await fetch('/api/evaluaciones/legacy', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error al obtener evaluaciones legacy:', error);
      throw error;
    }
  }

  async getEstadisticasLegacy() {
    try {
      const response = await fetch('/api/evaluaciones/legacy/estadisticas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : {};
    } catch (error) {
      console.error('Error al obtener estadísticas legacy:', error);
      throw error;
    }
  }

  // ===============================================
  // MÉTODOS DE UTILIDAD
  // ===============================================

  formatearNivelCumplimiento(nivel) {
    const niveles = {
      'cumple_completo': { texto: 'Cumple Completo', color: 'green' },
      'cumple_parcial': { texto: 'Cumple Parcial', color: 'yellow' },
      'no_cumple': { texto: 'No Cumple', color: 'red' }
    };
    
    return niveles[nivel] || { texto: 'No Definido', color: 'gray' };
  }

  formatearRol(rol) {
    const roles = {
      'evaluado': { texto: 'Evaluado', color: 'blue' },
      'evaluador': { texto: 'Evaluador', color: 'green' },
      'supervisor': { texto: 'Supervisor', color: 'purple' },
      'coordinador': { texto: 'Coordinador', color: 'orange' }
    };
    
    return roles[rol] || { texto: 'Participante', color: 'gray' };
  }

  calcularPuntajePromedio(competencias) {
    if (!competencias || competencias.length === 0) return 0;
    
    const suma = competencias.reduce((total, comp) => {
      return total + (parseInt(comp.puntaje) || 0);
    }, 0);
    
    return Math.round((suma / competencias.length) * 10) / 10;
  }

  obtenerNivelPorPuntaje(puntaje) {
    const puntos = parseInt(puntaje) || 0;
    
    if (puntos >= 80) return 'cumple_completo';
    if (puntos >= 60) return 'cumple_parcial';
    return 'no_cumple';
  }
}

// Crear instancia única del servicio
const evaluacionesSgcService = new EvaluacionesSgcService();

export { evaluacionesSgcService };
