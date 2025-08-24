// Configuración de variables de entorno para 9001app-v2 (VERSIÓN EXPERIMENTAL)
require('dotenv').config();

const loadEnvConfig = () => {
  return {
    // Configuración de base de datos 9001app-v2
    TURSO_DATABASE_URL: 'libsql://9001app-v2-sergiocharata1977.aws-us-east-1.turso.io',
    TURSO_AUTH_TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTYwMzI1MjIsImlkIjoiOTQ3M2M5NWItMWE3OC00MWYwLTgyMDItMmMyM2Q4MmQyMjM2IiwicmlkIjoiYzIyOGMwODItZTNjZC00MTJmLWIxMWQtNWU1NjRjM2RmNzRiIn0.x4EI9uRwsvnpJzwoUJZDecbiBT4wr0Z9IhRgvwRZIIhh6AqlG5cVw9xu-P6ZAnhN-kAnjmSFyYfiG9iGlHFtBg',
    
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
