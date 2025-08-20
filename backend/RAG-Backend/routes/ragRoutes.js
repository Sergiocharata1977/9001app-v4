const express = require('express');
const router = express.Router();
const { 
  getRAGHealth, 
  searchRAG, 
  getRAGContext, 
  getRAGStats, 
  getRAGDataByType 
} = require('../controllers/ragController');
const authMiddleware = require('../../middleware/authMiddleware');

// Middleware de autenticación para todas las rutas RAG
router.use(authMiddleware);

// Ruta de salud del sistema RAG
router.get('/health', getRAGHealth);

// Ruta para búsquedas RAG
router.post('/search', searchRAG);

// Ruta para obtener contexto
router.post('/context', getRAGContext);

// Ruta para obtener estadísticas
router.get('/stats', getRAGStats);

// Ruta para obtener datos por tipo
router.get('/data/:type', getRAGDataByType);

// Ruta para consultas RAG (alias de search para compatibilidad)
router.post('/query', searchRAG);

// Ruta para obtener estado de RAG de una organización
router.get('/status/:organizationId', getRAGHealth);

module.exports = router;
