// Configuración de variables de entorno para isoflow4
require('dotenv').config();

const loadEnvConfig = () => {
  return {
    // Configuración de base de datos isoflow4
    TURSO_DATABASE_URL: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
    TURSO_AUTH_TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU2OTAwMDYsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.hs83X428FW-ZjxGvLZ1eWE6Gjp4JceY2e88VDSAgaLHOxVe-IntR-S_-bQoyA-UnMnoFYJtP-PiktziqDMOVDw',
    
    // Otras configuraciones
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    
    // Configuración RAG
    RAG_ENABLED: process.env.RAG_ENABLED || 'true',
    RAG_MODEL_PROVIDER: process.env.RAG_MODEL_PROVIDER || 'local',
    RAG_MODEL_NAME: process.env.RAG_MODEL_NAME || 'sentence-transformers/all-MiniLM-L6-v2',
    
    // Configuración de archivos
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760, // 10MB
  };
};

module.exports = { loadEnvConfig };
