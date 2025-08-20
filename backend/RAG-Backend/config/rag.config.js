// Configuración RAG para isoflow4
const RAG_CONFIG = {
  // Configuración de base de datos
  database: {
    url: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU2OTAwMDYsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.hs83X428FW-ZjxGvLZ1eWE6Gjp4JceY2e88VDSAgaLHOxVe-IntR-S_-bQoyA-UnMnoFYJtP-PiktziqDMOVDw'
  },
  
  // Configuración de modelos
  models: {
    provider: process.env.RAG_MODEL_PROVIDER || 'local',
    name: process.env.RAG_MODEL_NAME || 'sentence-transformers/all-MiniLM-L6-v2',
    maxTokens: 4096
  },
  
  // Configuración de indexación
  indexing: {
    chunkSize: 1000,
    chunkOverlap: 200,
    maxChunks: 10000
  },
  
  // Configuración de búsqueda
  search: {
    topK: 5,
    similarityThreshold: 0.7,
    maxResults: 10
  },
  
  // Configuración de generación
  generation: {
    temperature: 0.7,
    maxLength: 500,
    includeSources: true
  },
  
  // Configuración de organizaciones
  organizations: {
    enabled: [1, 2], // IDs de organizaciones habilitadas
    globalNorms: true // Incluir normas con organization_id = 0
  }
};

module.exports = RAG_CONFIG;
