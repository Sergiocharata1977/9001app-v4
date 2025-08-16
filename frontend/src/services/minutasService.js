import apiService from './apiService';

const minutasService = {
  // Obtener todas las minutas
  async getAll() {
    return await apiService.get('/minutas');
  },

  // Obtener una minuta por ID
  async getById(id) {
    return await apiService.get(`/minutas/${id}`);
  },

  // Crear nueva minuta
  async create(minutaData) {
    return await apiService.post('/minutas', minutaData);
  },

  // Actualizar minuta
  async update(id, minutaData) {
    return await apiService.put(`/minutas/${id}`, minutaData);
  },

  // Eliminar minuta
  async delete(id) {
    return await apiService.delete(`/minutas/${id}`);
  },

  // ===============================================
  // PARTICIPANTES SGC
  // ===============================================
  
  // Obtener participantes de una minuta
  async getParticipantes(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/participantes`);
  },

  // Agregar participante a minuta
  async addParticipante(minutaId, participanteData) {
    return await apiService.post(`/minutas/${minutaId}/participantes`, participanteData);
  },

  // Actualizar participante de minuta
  async updateParticipante(minutaId, participanteId, participanteData) {
    return await apiService.put(`/minutas/${minutaId}/participantes/${participanteId}`, participanteData);
  },

  // Eliminar participante de minuta
  async removeParticipante(minutaId, participanteId) {
    return await apiService.delete(`/minutas/${minutaId}/participantes/${participanteId}`);
  },

  // ===============================================
  // DOCUMENTOS SGC
  // ===============================================

  // Obtener documentos de una minuta
  async getDocumentos(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/documentos`);
  },

  // Adjuntar documento a minuta
  async attachDocument(minutaId, documentData) {
    return await apiService.post(`/minutas/${minutaId}/documentos`, documentData);
  },

  // Eliminar documento de minuta
  async removeDocument(minutaId, documentId) {
    return await apiService.delete(`/minutas/${minutaId}/documentos/${documentId}`);
  },

  // ===============================================
  // NORMAS ISO SGC
  // ===============================================

  // Obtener normas ISO de una minuta
  async getNormas(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/normas`);
  },

  // Agregar norma ISO a minuta
  async addNorma(minutaId, normaData) {
    return await apiService.post(`/minutas/${minutaId}/normas`, normaData);
  },

  // Actualizar norma ISO de minuta
  async updateNorma(minutaId, normaId, normaData) {
    return await apiService.put(`/minutas/${minutaId}/normas/${normaId}`, normaData);
  },

  // Eliminar norma ISO de minuta
  async removeNorma(minutaId, normaId) {
    return await apiService.delete(`/minutas/${minutaId}/normas/${normaId}`);
  },

  // Obtener historial de cambios de una minuta
  async getHistorial(minutaId) {
    return await apiService.get(`/minutas/${minutaId}/historial`);
  },

  // Descargar minuta como PDF
  async downloadPDF(id) {
    return await apiService.get(`/minutas/${id}/pdf`, {
      responseType: 'blob',
    });
  },

  // Buscar minutas
  async search(query) {
    return await apiService.get(`/minutas/search?q=${encodeURIComponent(query)}`);
  },

  // Obtener estadísticas de minutas
  async getStats() {
    return await apiService.get('/minutas/stats');
  },

  // Marcar minuta como leída
  async markAsRead(id) {
    return await apiService.post(`/minutas/${id}/read`);
  },

  // Obtener minutas por responsable
  async getByResponsable(responsable) {
    return await apiService.get(`/minutas/responsable/${encodeURIComponent(responsable)}`);
  },

  // Obtener minutas recientes
  async getRecent(limit = 10) {
    return await apiService.get(`/minutas/recent?limit=${limit}`);
  },

  // Duplicar minuta
  async duplicate(id) {
    return await apiService.post(`/minutas/${id}/duplicate`);
  },

  // Exportar minutas
  async export(format = 'excel') {
    return await apiService.get(`/minutas/export?format=${format}`, {
      responseType: 'blob',
    });
  },

  // ===============================================
  // NUEVAS RUTAS SGC
  // ===============================================

  // Obtener dashboard SGC
  async getDashboardSGC() {
    return await apiService.get('/minutas/dashboard/sgc');
  },

  // Obtener lista de personal disponible
  async getPersonalDisponible() {
    return await apiService.get('/minutas/util/personal');
  },

  // Obtener lista de documentos disponibles
  async getDocumentosDisponibles() {
    return await apiService.get('/minutas/util/documentos');
  },

  // Obtener lista de normas disponibles
  async getNormasDisponibles() {
    return await apiService.get('/minutas/util/normas');
  }
};

export default minutasService;
