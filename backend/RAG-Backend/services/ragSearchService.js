/**
 * Servicio de Búsqueda RAG
 * Responsable de realizar búsquedas semánticas en los datos indexados
 */

class RAGSearchService {
  constructor(db, config) {
    this.db = db;
    this.config = config;
  }

  /**
   * Realiza búsqueda semántica
   */
  async searchSemantic(query, organizationId, options = {}) {
    try {
      console.log(`🔍 Búsqueda semántica: "${query}" para organización ${organizationId}`);
      
      const startTime = Date.now();
      
      // Por ahora implementamos búsqueda por texto simple
      // En una implementación completa, aquí se usarían embeddings reales
      const results = await this.searchByText(query, organizationId, options);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Búsqueda completada en ${processingTime}ms, ${results.length} resultados`);

      return {
        query,
        results,
        processingTime,
        totalResults: results.length
      };
    } catch (error) {
      console.error('Error en búsqueda semántica:', error);
      throw error;
    }
  }

  /**
   * Búsqueda por texto simple (placeholder para embeddings reales)
   */
  async searchByText(query, organizationId, options = {}) {
    try {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
      
      if (searchTerms.length === 0) {
        return [];
      }

      // Construir consulta SQL dinámica
      const conditions = searchTerms.map(term => 
        `LOWER(chunk_text) LIKE '%${term}%'`
      ).join(' AND ');

      const sql = `
        SELECT 
          e.*,
          json_extract(e.metadata, '$.titulo') as titulo,
          json_extract(e.metadata, '$.nombre') as nombre,
          json_extract(e.metadata, '$.codigo') as codigo,
          json_extract(e.metadata, '$.source') as source
        FROM rag_embeddings e
        WHERE e.organization_id = ? 
        AND (${conditions})
        ORDER BY 
          CASE 
            WHEN LOWER(chunk_text) LIKE '%${query.toLowerCase()}%' THEN 1
            ELSE 2
          END,
          content_type ASC,
          chunk_index ASC
        LIMIT 20
      `;

      const results = await this.db.all(sql, [organizationId]);
      
      // Procesar y enriquecer resultados
      return results.map(result => ({
        id: result.id,
        content: result.chunk_text,
        contentType: result.content_type,
        contentId: result.content_id,
        metadata: JSON.parse(result.metadata || '{}'),
        score: this.calculateScore(query, result.chunk_text),
        source: {
          type: result.content_type,
          id: result.content_id,
          name: result.titulo || result.nombre || result.codigo || `ID: ${result.content_id}`,
          source: result.source
        }
      }));
    } catch (error) {
      console.error('Error en búsqueda por texto:', error);
      return [];
    }
  }

  /**
   * Calcula score de relevancia
   */
  calculateScore(query, text) {
    const queryTerms = query.toLowerCase().split(' ');
    const textLower = text.toLowerCase();
    
    let score = 0;
    let exactMatches = 0;
    
    for (const term of queryTerms) {
      if (term.length > 2) {
        const regex = new RegExp(term, 'gi');
        const matches = (textLower.match(regex) || []).length;
        score += matches;
        
        if (textLower.includes(term)) {
          exactMatches++;
        }
      }
    }
    
    // Bonus por coincidencias exactas
    if (exactMatches === queryTerms.length) {
      score *= 2;
    }
    
    // Bonus por longitud del texto (preferir textos más largos)
    score += Math.min(text.length / 100, 5);
    
    return score;
  }

  /**
   * Obtiene estadísticas de búsqueda
   */
  async getSearchStats(organizationId) {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_embeddings,
          COUNT(DISTINCT content_type) as content_types,
          COUNT(DISTINCT content_id) as unique_sources
        FROM rag_embeddings 
        WHERE organization_id = ?
      `, [organizationId]);

      return {
        total_embeddings: stats.total_embeddings || 0,
        content_types: stats.content_types || 0,
        unique_sources: stats.unique_sources || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        total_embeddings: 0,
        content_types: 0,
        unique_sources: 0
      };
    }
  }

  /**
   * Búsqueda por tipo de contenido específico
   */
  async searchByContentType(query, organizationId, contentType) {
    try {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
      
      if (searchTerms.length === 0) {
        return [];
      }

      const conditions = searchTerms.map(term => 
        `LOWER(chunk_text) LIKE '%${term}%'`
      ).join(' AND ');

      const sql = `
        SELECT 
          e.*,
          json_extract(e.metadata, '$.titulo') as titulo,
          json_extract(e.metadata, '$.nombre') as nombre,
          json_extract(e.metadata, '$.codigo') as codigo,
          json_extract(e.metadata, '$.source') as source
        FROM rag_embeddings e
        WHERE e.organization_id = ? 
        AND e.content_type = ?
        AND (${conditions})
        ORDER BY 
          CASE 
            WHEN LOWER(chunk_text) LIKE '%${query.toLowerCase()}%' THEN 1
            ELSE 2
          END,
          chunk_index ASC
        LIMIT 10
      `;

      const results = await this.db.all(sql, [organizationId, contentType]);
      
      return results.map(result => ({
        id: result.id,
        content: result.chunk_text,
        contentType: result.content_type,
        contentId: result.content_id,
        metadata: JSON.parse(result.metadata || '{}'),
        score: this.calculateScore(query, result.chunk_text),
        source: {
          type: result.content_type,
          id: result.content_id,
          name: result.titulo || result.nombre || result.codigo || `ID: ${result.content_id}`,
          source: result.source
        }
      }));
    } catch (error) {
      console.error(`Error en búsqueda por tipo ${contentType}:`, error);
      return [];
    }
  }

  /**
   * Búsqueda avanzada con filtros
   */
  async advancedSearch(query, organizationId, filters = {}) {
    try {
      let sql = `
        SELECT 
          e.*,
          json_extract(e.metadata, '$.titulo') as titulo,
          json_extract(e.metadata, '$.nombre') as nombre,
          json_extract(e.metadata, '$.codigo') as codigo,
          json_extract(e.metadata, '$.source') as source
        FROM rag_embeddings e
        WHERE e.organization_id = ?
      `;
      
      const params = [organizationId];
      
      // Aplicar filtros
      if (filters.contentType) {
        sql += ` AND e.content_type = ?`;
        params.push(filters.contentType);
      }
      
      if (filters.dateFrom) {
        sql += ` AND e.created_at >= ?`;
        params.push(filters.dateFrom);
      }
      
      if (filters.dateTo) {
        sql += ` AND e.created_at <= ?`;
        params.push(filters.dateTo);
      }
      
      // Aplicar búsqueda de texto
      if (query && query.trim()) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
        if (searchTerms.length > 0) {
          const conditions = searchTerms.map(term => 
            `LOWER(chunk_text) LIKE '%${term}%'`
          ).join(' AND ');
          sql += ` AND (${conditions})`;
        }
      }
      
      sql += ` ORDER BY e.created_at DESC LIMIT 50`;
      
      const results = await this.db.all(sql, params);
      
      return results.map(result => ({
        id: result.id,
        content: result.chunk_text,
        contentType: result.content_type,
        contentId: result.content_id,
        metadata: JSON.parse(result.metadata || '{}'),
        score: this.calculateScore(query || '', result.chunk_text),
        source: {
          type: result.content_type,
          id: result.content_id,
          name: result.titulo || result.nombre || result.codigo || `ID: ${result.content_id}`,
          source: result.source
        }
      }));
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
      return [];
    }
  }
}

module.exports = RAGSearchService; 