/**
 * Servicio de Búsqueda Semántica RAG
 * Responsable de realizar búsquedas semánticas en los embeddings
 */

const { CONTENT_TYPES, validateQuery } = require('../models/rag.models');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { HuggingFaceTransformersEmbeddings } = require('langchain/embeddings/hf_transformers');

class RAGSearchService {
  constructor(db, config) {
    this.db = db;
    this.config = config;
    this.embeddings = this.initializeEmbeddings();
  }

  /**
   * Inicializa el modelo de embeddings
   */
  initializeEmbeddings() {
    if (this.config.modelProvider === 'openai') {
      return new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: this.config.embeddingModel
      });
    } else {
      return new HuggingFaceTransformersEmbeddings({
        modelName: this.config.embeddingModel,
        cacheFolder: './models'
      });
    }
  }

  /**
   * Realiza búsqueda semántica
   */
  async searchSemantic(query, organizationId, options = {}) {
    try {
      // Validar consulta
      const validation = validateQuery(query);
      if (!validation.isValid) {
        throw new Error(`Invalid query: ${validation.errors.join(', ')}`);
      }

      // Verificar que RAG esté habilitado para la organización
      const ragEnabled = await this.isRAGEnabled(organizationId);
      if (!ragEnabled) {
        throw new Error('RAG is not enabled for this organization');
      }

      // Generar embedding de la consulta
      const queryEmbedding = await this.embeddings.embedQuery(query);

      // Buscar embeddings similares
      const results = await this.findSimilarEmbeddings(
        queryEmbedding, 
        organizationId, 
        options
      );

      // Procesar y formatear resultados
      const processedResults = await this.processSearchResults(results, query);

      return {
        query,
        results: processedResults,
        totalResults: processedResults.length,
        searchTime: Date.now()
      };
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw error;
    }
  }

  /**
   * Verifica si RAG está habilitado para la organización
   */
  async isRAGEnabled(organizationId) {
    try {
      const result = await this.db.get(
        'SELECT is_enabled FROM rag_config WHERE organization_id = ?',
        [organizationId]
      );
      return result ? result.is_enabled : false;
    } catch (error) {
      console.error('Error checking RAG status:', error);
      return false;
    }
  }

  /**
   * Encuentra embeddings similares
   */
  async findSimilarEmbeddings(queryEmbedding, organizationId, options = {}) {
    const {
      limit = this.config.search.maxResults,
      similarityThreshold = this.config.search.similarityThreshold,
      sourceType = null,
      sourceTable = null
    } = options;

    try {
      // Obtener todos los embeddings de la organización
      let query = `
        SELECT 
          id, 
          content_text, 
          content_metadata, 
          embedding_vector,
          source_type,
          source_id
        FROM rag_embeddings 
        WHERE organization_id = ?
      `;
      
      const params = [organizationId];

      // Aplicar filtros adicionales
      if (sourceType) {
        query += ' AND source_type = ?';
        params.push(sourceType);
      }

      if (sourceTable) {
        query += ' AND content_metadata LIKE ?';
        params.push(`%"table_name":"${sourceTable}"%`);
      }

      const embeddings = await this.db.all(query, params);

      // Calcular similitud y ordenar
      const similarities = await Promise.all(
        embeddings.map(async (embedding) => {
          const storedEmbedding = JSON.parse(embedding.embedding_vector);
          const similarity = this.calculateCosineSimilarity(queryEmbedding, storedEmbedding);
          
          return {
            ...embedding,
            similarity,
            metadata: JSON.parse(embedding.content_metadata)
          };
        })
      );

      // Filtrar por umbral de similitud y ordenar
      const filteredResults = similarities
        .filter(result => result.similarity >= similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return filteredResults;
    } catch (error) {
      console.error('Error finding similar embeddings:', error);
      throw error;
    }
  }

  /**
   * Calcula similitud coseno entre dos vectores
   */
  calculateCosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Procesa y formatea los resultados de búsqueda
   */
  async processSearchResults(results, originalQuery) {
    return results.map(result => ({
      id: result.id,
      content: result.content_text,
      similarity: result.similarity,
      source: {
        type: result.source_type,
        id: result.source_id,
        table: result.metadata.table_name,
        chunk: result.metadata.chunk_index,
        totalChunks: result.metadata.total_chunks
      },
      metadata: result.metadata
    }));
  }

  /**
   * Búsqueda híbrida (semántica + keywords)
   */
  async hybridSearch(query, organizationId, options = {}) {
    try {
      // Búsqueda semántica
      const semanticResults = await this.searchSemantic(query, organizationId, options);
      
      // Búsqueda por keywords
      const keywordResults = await this.keywordSearch(query, organizationId, options);
      
      // Combinar y deduplicar resultados
      const combinedResults = this.combineSearchResults(semanticResults.results, keywordResults);
      
      return {
        query,
        results: combinedResults,
        totalResults: combinedResults.length,
        searchType: 'hybrid'
      };
    } catch (error) {
      console.error('Error in hybrid search:', error);
      throw error;
    }
  }

  /**
   * Búsqueda por keywords
   */
  async keywordSearch(query, organizationId, options = {}) {
    const { limit = this.config.search.maxResults } = options;
    
    try {
      const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
      
      if (keywords.length === 0) {
        return [];
      }

      // Construir consulta SQL con LIKE
      const likeConditions = keywords.map(() => 'content_text LIKE ?').join(' AND ');
      const sqlQuery = `
        SELECT 
          id, 
          content_text, 
          content_metadata, 
          source_type,
          source_id
        FROM rag_embeddings 
        WHERE organization_id = ? AND ${likeConditions}
        ORDER BY length(content_text) ASC
        LIMIT ?
      `;

      const params = [organizationId, ...keywords.map(k => `%${k}%`), limit];
      const results = await this.db.all(sqlQuery, params);

      return results.map(result => ({
        id: result.id,
        content: result.content_text,
        similarity: 0.5, // Similitud fija para keyword search
        source: {
          type: result.source_type,
          id: result.source_id,
          metadata: JSON.parse(result.content_metadata)
        }
      }));
    } catch (error) {
      console.error('Error in keyword search:', error);
      return [];
    }
  }

  /**
   * Combina resultados de búsquedas diferentes
   */
  combineSearchResults(semanticResults, keywordResults) {
    const combined = [...semanticResults];
    
    // Agregar resultados de keyword que no estén ya en semantic
    keywordResults.forEach(keywordResult => {
      const exists = combined.some(semanticResult => 
        semanticResult.id === keywordResult.id
      );
      
      if (!exists) {
        combined.push(keywordResult);
      }
    });

    // Ordenar por similitud
    return combined.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Búsqueda por tipo de contenido
   */
  async searchByContentType(query, organizationId, contentType, options = {}) {
    return this.searchSemantic(query, organizationId, {
      ...options,
      sourceType: contentType
    });
  }

  /**
   * Búsqueda en tabla específica
   */
  async searchInTable(query, organizationId, tableName, options = {}) {
    return this.searchSemantic(query, organizationId, {
      ...options,
      sourceTable: tableName
    });
  }

  /**
   * Obtiene estadísticas de búsqueda
   */
  async getSearchStats(organizationId) {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_embeddings,
          COUNT(DISTINCT source_type) as content_types,
          COUNT(DISTINCT source_id) as unique_sources
        FROM rag_embeddings 
        WHERE organization_id = ?
      `, [organizationId]);

      return stats;
    } catch (error) {
      console.error('Error getting search stats:', error);
      return null;
    }
  }
}

module.exports = RAGSearchService; 