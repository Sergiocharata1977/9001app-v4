const express = require('express');
const router = express.Router();
const RAGController = require('../controllers/ragController.js');
const authMiddleware = require('../../middleware/authMiddleware.js');

/**
 * Rutas del Sistema RAG para el SGC ISO 9001
 * Todas las rutas requieren autenticación
 */

// Middleware de autenticación para todas las rutas RAG
router.use(authMiddleware);

/**
 * @route   GET /api/rag/health
 * @desc    Verificar estado de salud del sistema RAG
 * @access  Private
 */
router.get('/health', RAGController.getRAGHealth);

/**
 * @route   POST /api/rag/search
 * @desc    Buscar datos en el sistema RAG
 * @access  Private
 */
router.post('/search', RAGController.searchRAGData);

/**
 * @route   POST /api/rag/context
 * @desc    Obtener contexto para generación de respuestas
 * @access  Private
 */
router.post('/context', RAGController.getRAGContext);

/**
 * @route   POST /api/rag/generate
 * @desc    Generar respuesta basada en datos del sistema
 * @access  Private
 */
router.post('/generate', RAGController.generateRAGResponse);

/**
 * @route   GET /api/rag/stats
 * @desc    Obtener estadísticas del sistema RAG
 * @access  Private
 */
router.get('/stats', RAGController.getRAGStats);

/**
 * @route   GET /api/rag/data/:type
 * @desc    Obtener datos por tipo específico
 * @access  Private
 */
router.get('/data/:type', RAGController.getRAGDataByType);

/**
 * @route   GET /api/rag/data
 * @desc    Obtener todos los datos del sistema
 * @access  Private
 */
router.get('/data', RAGController.getAllRAGData);

/**
 * @route   POST /api/rag/query
 * @desc    Endpoint unificado para consultas RAG (compatibilidad)
 * @access  Private
 */
router.post('/query', async (req, res) => {
  try {
    const { query, question, organizationId } = req.body;
    
    // El frontend envía 'query', pero el controlador espera 'question'
    const questionText = question || query;
    
    if (!questionText) {
      return res.status(400).json({
        error: 'Pregunta requerida',
        message: 'Debe proporcionar una pregunta'
      });
    }

    // Crear un nuevo request con el campo correcto
    const modifiedReq = {
      ...req,
      body: {
        ...req.body,
        question: questionText
      }
    };

    // Usar el endpoint de generación de respuesta
    const originalJson = res.json;
    res.json = function(data) {
      // Adaptar el formato para el frontend
      const adaptedData = {
        data: {
          response: data.answer,
          sources: data.sources || []
        },
        question: data.question,
        confidence: data.confidence,
        processingTime: data.processingTime,
        timestamp: data.timestamp
      };
      return originalJson.call(this, adaptedData);
    };
    
    await RAGController.generateRAGResponse(modifiedReq, res);
  } catch (error) {
    console.error('Error en endpoint /query:', error);
    res.status(500).json({
      error: 'Error procesando consulta',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/rag/status
 * @desc    Endpoint de estado (compatibilidad)
 * @access  Private
 */
router.get('/status', RAGController.getRAGHealth);

module.exports = router;
