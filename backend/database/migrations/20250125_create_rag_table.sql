-- Tabla RAG para almacenar documentos y embeddings
CREATE TABLE IF NOT EXISTS rag_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text',
    source TEXT,
    organization_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    embedding BLOB,
    metadata TEXT -- JSON para metadatos adicionales
);
-- Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_rag_documents_organization ON rag_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_rag_documents_content_type ON rag_documents(content_type);
CREATE INDEX IF NOT EXISTS idx_rag_documents_created_at ON rag_documents(created_at);
-- Tabla para consultas RAG
CREATE TABLE IF NOT EXISTS rag_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    documents_used TEXT,
    -- JSON array de IDs de documentos
    organization_id INTEGER,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    accuracy_score REAL
);
-- Índices para consultas
CREATE INDEX IF NOT EXISTS idx_rag_queries_organization ON rag_queries(organization_id);
CREATE INDEX IF NOT EXISTS idx_rag_queries_user ON rag_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_rag_queries_created_at ON rag_queries(created_at);