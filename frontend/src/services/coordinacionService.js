import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/coordinacion');

class CoordinacionService {
  
  // Leer el archivo de log de tareas
  async leerLogTareas() {
    try {
      const response = await apiClient.get('/api/coordinacion/log-tareas');
      return response.data;
    } catch (error) {
      console.error('Error leyendo log de tareas:', error);
      throw error;
    }
  }
  
  // Obtener todas las tareas
  async obtenerTareas(limit = 50, offset = 0) {
    try {
      const response = await apiClient.get(`/api/coordinacion/tareas?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw error;
    }
  }
  
  // Obtener tarea por número
  async obtenerTareaPorNumero(tareaNumero) {
    try {
      const response = await apiClient.get(`/api/coordinacion/tareas/${tareaNumero}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tarea:', error);
      throw error;
    }
  }
  
  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await apiClient.get('/api/coordinacion/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
  
  // Buscar tareas
  async buscarTareas(texto, limit = 20) {
    try {
      const response = await apiClient.get(`/api/coordinacion/buscar?q=${encodeURIComponent(texto)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error buscando tareas:', error);
      throw error;
    }
  }
  
  // Obtener tareas por módulo
  async obtenerTareasPorModulo(modulo, limit = 20) {
    try {
      const response = await apiClient.get(`/api/coordinacion/modulo/${modulo}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tareas por módulo:', error);
      throw error;
    }
  }
  
  // Obtener tareas por estado
  async obtenerTareasPorEstado(estado, limit = 20) {
    try {
      const response = await apiClient.get(`/api/coordinacion/estado/${estado}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tareas por estado:', error);
      throw error;
    }
  }
  
  // Crear nueva tarea
  async crearTarea(tareaData) {
    try {
      const response = await apiClient.post('/api/coordinacion/tareas', tareaData);
      return response.data;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }
  
  // Actualizar tarea
  async actualizarTarea(tareaNumero, tareaData) {
    try {
      const response = await apiClient.put(`/api/coordinacion/tareas/${tareaNumero}`, tareaData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }
  
  // Eliminar tarea
  async eliminarTarea(tareaNumero) {
    try {
      const response = await apiClient.delete(`/api/coordinacion/tareas/${tareaNumero}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }
  
  // Sincronizar desde documentación
  async sincronizarDocumentacion() {
    try {
      const response = await apiClient.post('/api/coordinacion/sincronizar');
      return response.data;
    } catch (error) {
      console.error('Error sincronizando documentación:', error);
      throw error;
    }
  }
}

export default new CoordinacionService();
