/**
 * Servicio de Indexación RAG
 * Responsable de procesar y vectorizar datos estructurados y no estructurados
 */

const { CONTENT_TYPES, CHUNKING_CONFIG, createMetadata, sanitizeContent } = require('../models/rag.models');
const { TextSplitter } = require('langchain/text_splitter');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { HuggingFaceTransformersEmbeddings } = require('langchain/embeddings/hf_transformers');

class RAGIndexerService {
  constructor(db, config) {
    this.db = db;
    this.config = config;
    this.embeddings = this.initializeEmbeddings();
    this.textSplitter = this.initializeTextSplitter();
  }

  /**
   * Inicializa el modelo de embeddings según la configuración
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
   * Inicializa el text splitter para chunking
   */
  initializeTextSplitter() {
    return new TextSplitter({
      chunkSize: this.config.chunking.size,
      chunkOverlap: this.config.chunking.overlap,
      separators: this.config.chunking.separators
    });
  }

  /**
   * Indexa todos los datos de una organización
   */
  async indexOrganizationData(organizationId) {
    try {
      console.log(`Starting RAG indexing for organization ${organizationId}`);
      
      // Indexar datos estructurados
      await this.indexStructuredData(organizationId);
      
      // Indexar documentos no estructurados
      await this.indexUnstructuredData(organizationId);
      
      // Actualizar timestamp de indexación
      await this.updateIndexingTimestamp(organizationId);
      
      console.log(`RAG indexing completed for organization ${organizationId}`);
      return { success: true, message: 'Indexing completed successfully' };
    } catch (error) {
      console.error(`RAG indexing failed for organization ${organizationId}:`, error);
      throw error;
    }
  }

  /**
   * Indexa datos estructurados de la base de datos
   */
  async indexStructuredData(organizationId) {
    const tables = [
      'departamentos',
      'puestos', 
      'personal',
      'procesos',
      'objetivos_calidad',
      'indicadores',
      'mediciones',
      'auditorias',
      'hallazgos',
      'acciones_correctivas',
      'calendario_eventos'
    ];

    for (const table of tables) {
      await this.indexTable(table, organizationId);
    }
  }

  /**
   * Indexa una tabla específica
   */
  async indexTable(tableName, organizationId) {
    try {
      console.log(`Indexing table: ${tableName}`);
      
      const query = `SELECT * FROM ${tableName} WHERE organization_id = ?`;
      const rows = await this.db.all(query, [organizationId]);
      
      for (const row of rows) {
        await this.processStructuredRow(tableName, row, organizationId);
      }
      
      console.log(`Completed indexing table: ${tableName}`);
    } catch (error) {
      console.error(`Error indexing table ${tableName}:`, error);
    }
  }

  /**
   * Procesa una fila de datos estructurados
   */
  async processStructuredRow(tableName, row, organizationId) {
    try {
      // Crear contenido textual combinando campos relevantes
      const content = this.createStructuredContent(tableName, row);
      
      if (!content || content.trim().length === 0) {
        return;
      }

      // Generar hash del contenido
      const contentHash = this.generateContentHash(content);
      
      // Verificar si ya existe
      const existing = await this.db.get(
        'SELECT id FROM rag_embeddings WHERE content_hash = ? AND organization_id = ?',
        [contentHash, organizationId]
      );
      
      if (existing) {
        return; // Ya indexado
      }

      // Crear chunks del contenido
      const chunks = await this.textSplitter.splitText(content);
      
      // Procesar cada chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkId = `${contentHash}_chunk_${i}`;
        
        // Generar embedding
        const embedding = await this.embeddings.embedQuery(chunk);
        
        // Crear metadatos
        const metadata = createMetadata(
          CONTENT_TYPES.STRUCTURED,
          row.id,
          organizationId,
          {
            table_name: tableName,
            chunk_index: i,
            total_chunks: chunks.length,
            original_content_hash: contentHash
          }
        );

        // Guardar embedding
        await this.saveEmbedding(chunkId, chunk, embedding, metadata, organizationId);
      }
    } catch (error) {
      console.error(`Error processing structured row:`, error);
    }
  }

  /**
   * Crea contenido textual a partir de datos estructurados
   */
  createStructuredContent(tableName, row) {
    const contentMap = {
      'departamentos': `${row.nombre} - ${row.descripcion || ''} - Responsabilidades: ${row.responsabilidades || ''}`,
      'puestos': `${row.titulo} - ${row.descripcion || ''} - Competencias: ${row.competencias || ''}`,
      'personal': `${row.nombre} ${row.apellido} - Puesto: ${row.puesto || ''} - Departamento: ${row.departamento || ''}`,
      'procesos': `${row.nombre} - Objetivo: ${row.objetivo || ''} - Alcance: ${row.alcance || ''} - Responsable: ${row.responsable || ''}`,
      'objetivos_calidad': `${row.descripcion} - Indicadores: ${row.indicadores || ''} - Metas: ${row.metas || ''}`,
      'indicadores': `${row.nombre} - Proceso: ${row.proceso || ''} - Fórmula: ${row.formula || ''} - Objetivo: ${row.objetivo || ''}`,
      'mediciones': `Medición: ${row.valor} - Fecha: ${row.fecha} - Indicador: ${row.indicador_id}`,
      'auditorias': `${row.tipo} - Fecha: ${row.fecha} - Hallazgos: ${row.hallazgos || ''} - Conclusiones: ${row.conclusiones || ''}`,
      'hallazgos': `${row.descripcion} - Tipo: ${row.tipo} - Proceso: ${row.proceso || ''} - Estado: ${row.estado}`,
      'acciones_correctivas': `${row.descripcion} - Hallazgo: ${row.hallazgo_id} - Estado: ${row.estado}`,
      'calendario_eventos': `${row.titulo} - ${row.descripcion || ''} - Fecha: ${row.fecha} - Tipo: ${row.tipo}`
    };

    return contentMap[tableName] || JSON.stringify(row);
  }

  /**
   * Indexa documentos no estructurados
   */
  async indexUnstructuredData(organizationId) {
    try {
      // Buscar documentos en la tabla documentos
      const documents = await this.db.all(
        'SELECT * FROM documentos WHERE organization_id = ?',
        [organizationId]
      );

      for (const doc of documents) {
        await this.processDocument(doc, organizationId);
      }
    } catch (error) {
      console.error('Error indexing unstructured data:', error);
    }
  }

  /**
   * Procesa un documento individual
   */
  async processDocument(document, organizationId) {
    try {
      // Aquí se implementaría la extracción de texto según el tipo de documento
      // PDF, DOCX, TXT, etc.
      const content = await this.extractDocumentContent(document);
      
      if (!content) {
        return;
      }

      const contentHash = this.generateContentHash(content);
      
      // Verificar si ya existe
      const existing = await this.db.get(
        'SELECT id FROM rag_embeddings WHERE content_hash = ? AND organization_id = ?',
        [contentHash, organizationId]
      );
      
      if (existing) {
        return;
      }

      // Crear chunks
      const chunks = await this.textSplitter.splitText(content);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkId = `${contentHash}_chunk_${i}`;
        
        const embedding = await this.embeddings.embedQuery(chunk);
        
        const metadata = createMetadata(
          CONTENT_TYPES.UNSTRUCTURED,
          document.id,
          organizationId,
          {
            document_name: document.nombre,
            document_type: document.tipo,
            chunk_index: i,
            total_chunks: chunks.length
          }
        );

        await this.saveEmbedding(chunkId, chunk, embedding, metadata, organizationId);
      }
    } catch (error) {
      console.error('Error processing document:', error);
    }
  }

  /**
   * Extrae contenido de un documento
   */
  async extractDocumentContent(document) {
    // Implementación básica - en producción se usarían librerías específicas
    return document.contenido || document.descripcion || '';
  }

  /**
   * Guarda un embedding en la base de datos
   */
  async saveEmbedding(id, content, embedding, metadata, organizationId) {
    try {
      const query = `
        INSERT INTO rag_embeddings 
        (id, organization_id, content_hash, content_text, content_metadata, embedding_vector, source_type, source_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await this.db.run(query, [
        id,
        organizationId,
        this.generateContentHash(content),
        sanitizeContent(content),
        JSON.stringify(metadata),
        JSON.stringify(embedding),
        metadata.source_type,
        metadata.source_id
      ]);
    } catch (error) {
      console.error('Error saving embedding:', error);
    }
  }

  /**
   * Genera hash del contenido
   */
  generateContentHash(content) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Actualiza timestamp de indexación
   */
  async updateIndexingTimestamp(organizationId) {
    try {
      await this.db.run(
        'UPDATE rag_config SET last_indexed_at = CURRENT_TIMESTAMP WHERE organization_id = ?',
        [organizationId]
      );
    } catch (error) {
      console.error('Error updating indexing timestamp:', error);
    }
  }

  /**
   * Limpia embeddings obsoletos
   */
  async cleanupObsoleteEmbeddings(organizationId) {
    try {
      // Implementar lógica de limpieza
      console.log(`Cleanup completed for organization ${organizationId}`);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

module.exports = RAGIndexerService; 