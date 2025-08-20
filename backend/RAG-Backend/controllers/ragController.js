/**
 * Controlador RAG
 * Maneja todas las operaciones del módulo RAG
 */

const { RAGDataModel } = require('../models/rag.models.js');

// @desc    Obtener estado de salud del sistema RAG
// @route   GET /api/rag/health
// @access  Private
const getRAGHealth = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId;
    
    // Verificar que podemos obtener datos del sistema
    const testData = await RAGDataModel.getAllSystemData(organizationId);
    
    res.json({
      success: true,
      message: 'Sistema RAG funcionando correctamente',
      data: {
        status: 'healthy',
        totalRecords: testData.length,
        organizationId: organizationId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error en health check RAG:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el sistema RAG',
      error: error.message
    });
  }
};

// @desc    Buscar información en el sistema
// @route   POST /api/rag/search
// @access  Private
const searchRAG = async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    const organizationId = req.user?.organizationId;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La consulta es requerida'
      });
    }

    console.log(`🔍 Búsqueda RAG: "${query}" para organización ${organizationId}`);

    // Buscar en todos los datos del sistema
    const results = await RAGDataModel.searchInSystemData(query, organizationId);

    // Generar respuesta contextualizada
    let response = `Basándome en la información del sistema, aquí está lo que encontré sobre "${query}":\n\n`;
    
    if (results.length > 0) {
      response += `📊 **Resultados encontrados (${results.length}):**\n\n`;
      
      results.slice(0, 5).forEach((result, index) => {
        response += `${index + 1}. **[${result.tipo.toUpperCase()}]** ${result.titulo}\n`;
        response += `   ${result.contenido.substring(0, 150)}${result.contenido.length > 150 ? '...' : ''}\n\n`;
      });
      
      if (results.length > 5) {
        response += `... y ${results.length - 5} resultados más.\n\n`;
      }
      
      response += `💡 **Fuentes consultadas:** ${results.length} registros del sistema SGC`;
    } else {
      response += `❌ No encontré información específica sobre "${query}" en el sistema.\n\n`;
      response += `💡 **Sugerencias:**\n`;
      response += `• Intenta con términos más generales\n`;
      response += `• Verifica la ortografía\n`;
      response += `• Consulta sobre: indicadores, auditorías, personal, procesos, normas ISO 9001`;
    }

    res.json({
      success: true,
      message: 'Búsqueda completada',
      data: {
        response: response,
        query: query,
        sources: results.slice(0, limit).map(result => ({
          tipo: result.tipo,
          titulo: result.titulo,
          contenido: result.contenido.substring(0, 100) + '...',
          codigo: result.codigo
        })),
        totalFound: results.length,
        organizationId: organizationId
      }
    });
  } catch (error) {
    console.error('Error en búsqueda RAG:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
};

// @desc    Obtener contexto para respuesta del asistente
// @route   POST /api/rag/context
// @access  Private
const getRAGContext = async (req, res) => {
  try {
    const { question, contextType = 'all' } = req.body;
    const organizationId = req.user?.organizationId;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La pregunta es requerida'
      });
    }

    console.log(`🎯 Obteniendo contexto para: "${question}"`);

    let contextData = [];

    // Obtener datos según el tipo de contexto solicitado
    switch (contextType) {
      case 'documentos':
        contextData = await RAGDataModel.getAllDocuments(organizationId);
        break;
      case 'normas':
        contextData = await RAGDataModel.getAllNormas(organizationId);
        break;
      case 'personal':
        contextData = await RAGDataModel.getPersonalInfo(organizationId);
        break;
      case 'auditorias':
        contextData = await RAGDataModel.getAuditoriasInfo(organizationId);
        break;
      case 'hallazgos':
        contextData = await RAGDataModel.getHallazgosAcciones(organizationId);
        break;
      case 'indicadores':
        contextData = await RAGDataModel.getIndicadoresObjetivos(organizationId);
        break;
      case 'procesos':
        contextData = await RAGDataModel.getProcesosDepartamentos(organizationId);
        break;
      case 'capacitaciones':
        contextData = await RAGDataModel.getCapacitaciones(organizationId);
        break;
      case 'all':
      default:
        contextData = await RAGDataModel.getAllSystemData(organizationId);
        break;
    }

    // Buscar información relevante para la pregunta
    const relevantData = await RAGDataModel.searchInSystemData(question, organizationId);

    // Preparar contexto para el asistente
    const context = {
      question: question,
      relevantData: relevantData,
      totalSystemData: contextData.length,
      organizationId: organizationId,
      contextType: contextType,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Contexto obtenido correctamente',
      data: context
    });
  } catch (error) {
    console.error('Error obteniendo contexto RAG:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo contexto',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del sistema RAG
// @route   GET /api/rag/stats
// @access  Private
const getRAGStats = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId;

    console.log(`📊 Obteniendo estadísticas RAG para organización ${organizationId}`);

    // Obtener todos los datos del sistema
    const allData = await RAGDataModel.getAllSystemData(organizationId);

    // Calcular estadísticas
    const stats = {};
    allData.forEach(item => {
      stats[item.tipo] = (stats[item.tipo] || 0) + 1;
    });

    // Obtener estadísticas por tipo
    const statsByType = Object.entries(stats).map(([tipo, count]) => ({
      tipo: tipo,
      count: count,
      percentage: ((count / allData.length) * 100).toFixed(1)
    }));

    res.json({
      success: true,
      message: 'Estadísticas obtenidas correctamente',
      data: {
        totalRecords: allData.length,
        organizationId: organizationId,
        statsByType: statsByType,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas RAG:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
};

// @desc    Obtener datos por tipo específico
// @route   GET /api/rag/data/:type
// @access  Private
const getRAGDataByType = async (req, res) => {
  try {
    const { type } = req.params;
    const organizationId = req.user?.organizationId;
    const { limit = 50, offset = 0 } = req.query;

    console.log(`📋 Obteniendo datos de tipo: ${type}`);

    let data = [];

    switch (type) {
      case 'documentos':
        data = await RAGDataModel.getAllDocuments(organizationId);
        break;
      case 'normas':
        data = await RAGDataModel.getAllNormas(organizationId);
        break;
      case 'personal':
        data = await RAGDataModel.getPersonalInfo(organizationId);
        break;
      case 'auditorias':
        data = await RAGDataModel.getAuditoriasInfo(organizationId);
        break;
      case 'hallazgos':
        data = await RAGDataModel.getHallazgosAcciones(organizationId);
        break;
      case 'indicadores':
        data = await RAGDataModel.getIndicadoresObjetivos(organizationId);
        break;
      case 'procesos':
        data = await RAGDataModel.getProcesosDepartamentos(organizationId);
        break;
      case 'capacitaciones':
        data = await RAGDataModel.getCapacitaciones(organizationId);
        break;
      case 'minutas':
        data = await RAGDataModel.getMinutas(organizationId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de datos no válido'
        });
    }

    // Aplicar paginación
    const paginatedData = data.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      message: `Datos de tipo ${type} obtenidos correctamente`,
      data: {
        type: type,
        records: paginatedData,
        total: data.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        organizationId: organizationId
      }
    });
  } catch (error) {
    console.error(`Error obteniendo datos de tipo ${req.params.type}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos',
      error: error.message
    });
  }
};

module.exports = {
  getRAGHealth,
  searchRAG,
  getRAGContext,
  getRAGStats,
  getRAGDataByType
}; 