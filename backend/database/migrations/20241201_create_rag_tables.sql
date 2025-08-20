-- Migración para crear tablas RAG
-- Fecha: 2024-12-01

-- Tabla de configuración RAG por organización
CREATE TABLE IF NOT EXISTS rag_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    model_provider TEXT DEFAULT 'local',
    model_name TEXT DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
    chunk_size INTEGER DEFAULT 1000,
    chunk_overlap INTEGER DEFAULT 200,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_indexed_at DATETIME,
    UNIQUE(organization_id)
);

-- Tabla de embeddings de documentos
CREATE TABLE IF NOT EXISTS rag_embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    content_type TEXT NOT NULL, -- 'documento', 'proceso', 'hallazgo', etc.
    content_id INTEGER NOT NULL,
    content_hash TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding_vector TEXT, -- JSON array de embeddings
    metadata TEXT, -- JSON con metadatos adicionales
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, content_type, content_id, chunk_index)
);

-- Tabla de consultas RAG
CREATE TABLE IF NOT EXISTS rag_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    query TEXT NOT NULL,
    response TEXT,
    sources TEXT, -- JSON array de fuentes
    confidence REAL DEFAULT 0.0,
    processing_time INTEGER, -- en milisegundos
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fuentes de documentos
CREATE TABLE IF NOT EXISTS rag_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    source_type TEXT NOT NULL, -- 'documento', 'proceso', 'hallazgo', etc.
    source_id INTEGER NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    content_preview TEXT,
    metadata TEXT, -- JSON con metadatos adicionales
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, source_type, source_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_rag_embeddings_org_type ON rag_embeddings(organization_id, content_type);
CREATE INDEX IF NOT EXISTS idx_rag_embeddings_content ON rag_embeddings(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_rag_queries_org_user ON rag_queries(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_rag_queries_created ON rag_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_rag_sources_org_type ON rag_sources(organization_id, source_type);

-- Insertar configuración por defecto para organización 1
INSERT OR IGNORE INTO rag_config (organization_id, is_enabled) VALUES (1, TRUE);
INSERT OR IGNORE INTO rag_config (organization_id, is_enabled) VALUES (2, TRUE);
