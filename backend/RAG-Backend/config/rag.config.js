/**
 * Configuración del módulo RAG
 * Módulo independiente de Retrieval-Augmented Generation para ISOFlow3
 */

const ragConfig = {
  // Configuración general
  enabled: process.env.RAG_ENABLED === 'true' || false,
  
  // Proveedor de modelo de IA
  modelProvider: process.env.RAG_MODEL_PROVIDER || 'local',
  
  // Modelo de embeddings
  embeddingModel: process.env.RAG_MODEL_NAME || 'sentence-transformers/all-MiniLM-L6-v2',
  
  // Base de datos vectorial
  vectorDB: {
    type: process.env.RAG_VECTOR_DB_TYPE || 'chromadb',
    host: process.env.RAG_VECTOR_DB_HOST || 'localhost',
    port: process.env.RAG_VECTOR_DB_PORT || 8000,
    collection: 'isoflow3_embeddings'
  },
  
  // Configuración de chunking
  chunking: {
    size: parseInt(process.env.RAG_CHUNK_SIZE) || 1000,
    overlap: parseInt(process.env.RAG_CHUNK_OVERLAP) || 200,
    separators: ['\n\n', '\n', ' ', '']
  },
  
  // Configuración de generación
  generation: {
    maxTokens: parseInt(process.env.RAG_MAX_TOKENS) || 2048,
    temperature: parseFloat(process.env.RAG_TEMPERATURE) || 0.7,
    topK: parseInt(process.env.RAG_TOP_K) || 5
  },
  
  // Configuración de búsqueda
  search: {
    similarityThreshold: parseFloat(process.env.RAG_SIMILARITY_THRESHOLD) || 0.7,
    maxResults: parseInt(process.env.RAG_MAX_RESULTS) || 10
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RAG_RATE_LIMIT_MAX) || 50
  },
  
  // Configuración de indexación
  indexing: {
    batchSize: parseInt(process.env.RAG_BATCH_SIZE) || 100,
    autoIndex: process.env.RAG_AUTO_INDEX === 'true' || false,
    schedule: process.env.RAG_INDEX_SCHEDULE || '0 2 * * *' // 2 AM diario
  },
  
  // Configuración de logging
  logging: {
    level: process.env.RAG_LOG_LEVEL || 'info',
    file: process.env.RAG_LOG_FILE || './logs/rag.log'
  },
  
  // Configuración de seguridad
  security: {
    sanitizeInputs: true,
    maxQueryLength: 1000,
    allowedFileTypes: ['pdf', 'docx', 'txt', 'md'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
  }
};

module.exports = ragConfig; 