import { createApiClient } from './apiService.js';

const apiClient = createApiClient('/auditorias');

// Datos de ejemplo para auditorías mientras probamos
const mockAuditorias = [
  {
    id: 'aud_001',
    codigo: 'AUD-2024-001',
    titulo: 'Auditoría Interna de Gestión de Calidad',
    descripcion: 'Auditoría integral del sistema de gestión de calidad según ISO 9001:2015',
    estado: 'planificacion',
    fecha_programada: '2024-02-15T09:00:00Z',
    fecha_realizacion: null,
    auditor_lider: 'María Elena González',
    auditores: ['Roberto David Ramirez', 'Javier Antonio Ramirez'],
    alcance: 'Procesos de producción y control de calidad',
    criterios: 'ISO 9001:2015 cláusulas 4, 5, 6, 7, 8',
    tipo: 'interna',
    areas: ['Producción', 'Calidad', 'Almacén'],
    duracion_estimada: '8 horas',
    total_aspectos: 0,
    total_relaciones: 0
  },
  {
    id: 'aud_002',
    codigo: 'AUD-2024-002',
    titulo: 'Auditoría de Recursos Humanos',
    descripcion: 'Revisión de procesos de gestión del talento humano y competencias',
    estado: 'ejecucion',
    fecha_programada: '2024-02-20T10:30:00Z',
    fecha_realizacion: '2024-02-20T10:30:00Z',
    auditor_lider: 'Sergio De Filippi',
    auditores: ['María Elena González'],
    alcance: 'Gestión de recursos humanos y capacitaciones',
    criterios: 'ISO 9001:2015 cláusula 7.1.2, 7.2, 7.3',
    tipo: 'interna',
    areas: ['Recursos Humanos', 'Capacitación'],
    duracion_estimada: '6 horas',
    total_aspectos: 3,
    total_relaciones: 2
  },
  {
    id: 'aud_003',
    codigo: 'AUD-2024-003',
    titulo: 'Auditoría Externa de Certificación',
    descripcion: 'Auditoría de seguimiento para mantenimiento de certificación ISO 9001',
    estado: 'informe',
    fecha_programada: '2024-01-25T08:00:00Z',
    fecha_realizacion: '2024-01-25T08:00:00Z',
    auditor_lider: 'Auditor Externo - SGS',
    auditores: ['Equipo SGS'],
    alcance: 'Sistema completo de gestión de calidad',
    criterios: 'ISO 9001:2015 todos los requisitos',
    tipo: 'externa',
    areas: ['Todas las áreas'],
    duracion_estimada: '16 horas',
    total_aspectos: 8,
    total_relaciones: 5
  },
  {
    id: 'aud_004',
    codigo: 'AUD-2024-004',
    titulo: 'Auditoría de Procesos de Producción',
    descripcion: 'Evaluación específica de la eficacia de los procesos productivos',
    estado: 'seguimiento',
    fecha_programada: '2024-01-10T13:00:00Z',
    fecha_realizacion: '2024-01-10T13:00:00Z',
    auditor_lider: 'Roberto David Ramirez',
    auditores: ['Javier Antonio Ramirez', 'Sergio De Filippi'],
    alcance: 'Líneas de producción y control de procesos',
    criterios: 'ISO 9001:2015 cláusula 8.1, 8.2, 8.3, 8.4, 8.5',
    tipo: 'interna',
    areas: ['Producción', 'Control de Calidad'],
    duracion_estimada: '12 horas',
    total_aspectos: 6,
    total_relaciones: 4
  },
  {
    id: 'aud_005',
    codigo: 'AUD-2024-005',
    titulo: 'Auditoría de Gestión Documental',
    descripcion: 'Verificación del sistema de control de documentos y registros',
    estado: 'programacion',
    fecha_programada: '2024-03-10T14:00:00Z',
    fecha_realizacion: null,
    auditor_lider: 'Ana García López',
    auditores: ['Carlos Mendoza', 'Laura Vásquez'],
    alcance: 'Control de documentos y registros',
    criterios: 'ISO 9001:2015 cláusula 7.5',
    tipo: 'interna',
    areas: ['Administración', 'Calidad'],
    duracion_estimada: '4 horas',
    total_aspectos: 2,
    total_relaciones: 1
  },
  {
    id: 'aud_006',
    codigo: 'AUD-2024-006',
    titulo: 'Auditoría de Mejora Continua',
    descripcion: 'Evaluación de procesos de mejora continua y no conformidades',
    estado: 'cerrada',
    fecha_programada: '2024-01-05T09:00:00Z',
    fecha_realizacion: '2024-01-05T09:00:00Z',
    auditor_lider: 'Miguel Rodríguez',
    auditores: ['Patricia Suárez', 'Diego Morales'],
    alcance: 'Procesos de mejora continua',
    criterios: 'ISO 9001:2015 cláusula 10',
    tipo: 'interna',
    areas: ['Calidad', 'Dirección'],
    duracion_estimada: '6 horas',
    total_aspectos: 4,
    total_relaciones: 3
  }
];

export const auditoriasService = {
  /**
   * Obtiene todas las auditorías.
   * @returns {Promise<Array>} Lista de auditorías.
   */
  async getAllAuditorias() {
    try {
      // Intentar primero con el API real
      const data = await apiClient.get('/');
      console.log('🚀 DEBUG: Auditorías obtenidas del API:', data);
      
      // Si el API devuelve datos, usarlos y normalizar estructura
      if (data?.data && Array.isArray(data.data)) {
        console.log('📡 [AuditoriasService] Usando datos del API');
        
        // Normalizar estructura de datos del API para que coincida con el formato esperado
        const normalizedData = data.data.map(auditoria => ({
          ...auditoria,
          // Normalizar campos para consistencia
          auditor_lider: auditoria.responsable_nombre || auditoria.auditor_lider || 'No asignado',
          areas: auditoria.areas || auditoria.area || [],
          // Asegurar que el estado existe
          estado: auditoria.estado || 'planificacion',
          // Campos adicionales que pueden faltar
          tipo: auditoria.tipo || 'interna',
          descripcion: auditoria.descripcion || auditoria.objetivos || '',
          duracion_estimada: auditoria.duracion_estimada || 'No especificada'
        }));
        
        console.log('📊 [AuditoriasService] Datos normalizados:', normalizedData);
        return normalizedData;
      }
      
      // Si no hay datos del API, usar mock data
      console.log('📋 [AuditoriasService] Usando datos de ejemplo');
      return mockAuditorias;
      
    } catch (error) {
      console.error('Error al obtener auditorías del API, usando datos de ejemplo:', error);
      // En caso de error, devolver datos de ejemplo
      return mockAuditorias;
    }
  },

  /**
   * Obtiene una auditoría por su ID.
   * @param {string} id - ID de la auditoría.
   * @returns {Promise<Object>} Datos de la auditoría.
   */
  async getAuditoriaById(id) {
    try {
      const data = await apiClient.get(`/${id}`);
      return data;
    } catch (error) {
      console.error(`Error al obtener la auditoría con ID ${id}, buscando en mock data:`, error);
      // Buscar en mock data como fallback
      const auditoria = mockAuditorias.find(a => a.id === id);
      if (auditoria) {
        return auditoria;
      }
      throw new Error(error.message || 'Auditoría no encontrada');
    }
  },

  /**
   * Crea una nueva auditoría.
   * @param {Object} auditoriaData - Datos de la auditoría a crear.
   * @returns {Promise<Object>} La auditoría creada.
   */
  async createAuditoria(auditoriaData) {
    try {
      const data = await apiClient.post('/', auditoriaData);
      return data;
    } catch (error) {
      console.error('Error al crear la auditoría:', error);
      throw new Error(error.message || 'Error al crear la auditoría');
    }
  },

  /**
   * Actualiza una auditoría existente.
   * @param {string} id - ID de la auditoría a actualizar.
   * @param {Object} auditoriaData - Datos actualizados de la auditoría.
   * @returns {Promise<Object>} La auditoría actualizada.
   */
  async updateAuditoria(id, auditoriaData) {
    try {
      const data = await apiClient.put(`/${id}`, auditoriaData);
      return data;
    } catch (error) {
      console.error(`Error al actualizar la auditoría con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar la auditoría');
    }
  },

  /**
   * Elimina una auditoría.
   * @param {string} id - ID de la auditoría a eliminar.
   * @returns {Promise<void>}
   */
  async deleteAuditoria(id) {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la auditoría con ID ${id}:`, error);
      throw new Error(error.message || 'Error al eliminar la auditoría');
    }
  },

  /**
   * Actualiza el estado de una auditoría.
   * @param {string} id - ID de la auditoría a actualizar.
   * @param {string} estado - Nuevo estado de la auditoría.
   * @returns {Promise<void>}
   */
  async updateAuditoriaEstado(id, estado) {
    try {
      const response = await apiClient.put(`/${id}`, { estado });
      return response;
    } catch (error) {
      console.error(`Error al actualizar el estado de la auditoría con ID ${id}:`, error);
      throw new Error(error.message || 'Error al actualizar el estado de la auditoría');
    }
  },

  /**
   * Obtiene los aspectos de una auditoría.
   * @param {string} auditoriaId - ID de la auditoría.
   * @returns {Promise<Array>} Lista de aspectos.
   */
  async getAspectos(auditoriaId) {
    try {
      const data = await apiClient.get(`/${auditoriaId}/aspectos`);
      return data;
    } catch (error) {
      console.error(`Error al obtener aspectos de la auditoría ${auditoriaId}:`, error);
      return []; // Devolver array vacío como fallback
    }
  },

  /**
   * Agrega un aspecto a una auditoría.
   * @param {string} auditoriaId - ID de la auditoría.
   * @param {Object} aspectoData - Datos del aspecto.
   * @returns {Promise<Object>} El aspecto creado.
   */
  async addAspecto(auditoriaId, aspectoData) {
    try {
      const data = await apiClient.post(`/${auditoriaId}/aspectos`, aspectoData);
      return data;
    } catch (error) {
      console.error(`Error al agregar aspecto a la auditoría ${auditoriaId}:`, error);
      throw new Error(error.message || 'Error al agregar el aspecto');
    }
  },

  /**
   * Obtiene las relaciones de una auditoría.
   * @param {string} auditoriaId - ID de la auditoría.
   * @returns {Promise<Array>} Lista de relaciones.
   */
  async getRelaciones(auditoriaId) {
    try {
      const data = await apiClient.get(`/${auditoriaId}/relaciones`);
      return data;
    } catch (error) {
      console.error(`Error al obtener relaciones de la auditoría ${auditoriaId}:`, error);
      return []; // Devolver array vacío como fallback
    }
  }
};

export default auditoriasService;