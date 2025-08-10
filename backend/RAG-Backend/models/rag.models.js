/**
 * Modelos de datos para el módulo RAG
 * Definición de esquemas y estructuras de datos
 */

// Esquema de configuración RAG por organización
const ragConfigSchema = {
  id: 'INTEGER PRIMARY KEY',
  organization_id: 'INTEGER NOT NULL',
  is_enabled: 'BOOLEAN DEFAULT FALSE',
  model_provider: 'TEXT DEFAULT "local"',
  model_name: 'TEXT DEFAULT "sentence-transformers/all-MiniLM-L6-v2"',
  vector_db_type: 'TEXT DEFAULT "chromadb"',
  last_indexed_at: 'DATETIME',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
};

// Esquema de embeddings
const ragEmbeddingsSchema = {
  id: 'TEXT PRIMARY KEY',
  organization_id: 'INTEGER NOT NULL',
  content_hash: 'TEXT NOT NULL',
  content_text: 'TEXT NOT NULL',
  content_metadata: 'TEXT', // JSON
  embedding_vector: 'BLOB', // Vector serializado
  source_type: 'TEXT', // structured, unstructured
  source_id: 'TEXT',
  source_table: 'TEXT',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
};

// Esquema de consultas RAG
const ragQueriesSchema = {
  id: 'TEXT PRIMARY KEY',
  organization_id: 'INTEGER NOT NULL',
  user_id: 'TEXT',
  query_text: 'TEXT NOT NULL',
  response_text: 'TEXT',
  sources_used: 'TEXT', // JSON array
  tokens_used: 'INTEGER',
  processing_time_ms: 'INTEGER',
  similarity_score: 'REAL',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
};

// Esquema de fuentes de datos
const ragSourcesSchema = {
  id: 'TEXT PRIMARY KEY',
  organization_id: 'INTEGER NOT NULL',
  source_name: 'TEXT NOT NULL',
  source_type: 'TEXT NOT NULL', // table, document, file
  source_path: 'TEXT',
  last_indexed: 'DATETIME',
  record_count: 'INTEGER',
  status: 'TEXT DEFAULT "pending"', // pending, indexed, error
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
};

// Tipos de contenido para indexación
const CONTENT_TYPES = {
  STRUCTURED: 'structured',
  UNSTRUCTURED: 'unstructured',
  DOCUMENT: 'document',
  PROCESS: 'process',
  OBJECTIVE: 'objective',
  INDICATOR: 'indicator',
  AUDIT: 'audit',
  FINDING: 'finding',
  ACTION: 'action',
  PERSONNEL: 'personnel',
  DEPARTMENT: 'department',
  POSITION: 'position'
};

// Estados de indexación
const INDEXING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ERROR: 'error',
  DISABLED: 'disabled'
};

// Tipos de consulta
const QUERY_TYPES = {
  SEMANTIC: 'semantic',
  KEYWORD: 'keyword',
  HYBRID: 'hybrid',
  STRUCTURED: 'structured'
};

// Configuración de chunking por tipo de contenido
const CHUNKING_CONFIG = {
  [CONTENT_TYPES.STRUCTURED]: {
    size: 500,
    overlap: 100
  },
  [CONTENT_TYPES.UNSTRUCTURED]: {
    size: 1000,
    overlap: 200
  },
  [CONTENT_TYPES.DOCUMENT]: {
    size: 1500,
    overlap: 300
  },
  [CONTENT_TYPES.PROCESS]: {
    size: 800,
    overlap: 150
  }
};

// Metadatos estándar para embeddings
const createMetadata = (sourceType, sourceId, organizationId, additionalData = {}) => {
  return {
    source_type: sourceType,
    source_id: sourceId,
    organization_id: organizationId,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
};

// Validación de consultas
const validateQuery = (query) => {
  const errors = [];
  
  if (!query || typeof query !== 'string') {
    errors.push('Query must be a non-empty string');
  }
  
  if (query.length > 1000) {
    errors.push('Query too long (max 1000 characters)');
  }
  
  if (query.trim().length < 3) {
    errors.push('Query too short (min 3 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitización de contenido
const sanitizeContent = (content) => {
  if (typeof content !== 'string') {
    return '';
  }
  
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

module.exports = {
  ragConfigSchema,
  ragEmbeddingsSchema,
  ragQueriesSchema,
  ragSourcesSchema,
  CONTENT_TYPES,
  INDEXING_STATUS,
  QUERY_TYPES,
  CHUNKING_CONFIG,
  createMetadata,
  validateQuery,
  sanitizeContent
}; 