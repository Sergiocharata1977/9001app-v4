const RAGDataModel = require('../models/ragDataModel.js');

/**
 * Controlador RAG para el Sistema SGC ISO 9001
 * Maneja todas las operaciones de búsqueda, consulta y generación de respuestas
 */
class RAGController {

  /**
   * Obtiene el estado de salud del sistema RAG
   */
  static async getRAGHealth(req, res) {
    try {
      console.log('🔍 Verificando salud del sistema RAG...');
      
      const startTime = Date.now();
      
      // Verificar conectividad con la base de datos
      const testData = await RAGDataModel.getAllSystemData(1);
      const processingTime = Date.now() - startTime;
      
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`,
        dataCount: testData.length,
        database: 'connected',
        version: '2.0.0',
        features: {
          search: 'enabled',
          generation: 'enabled',
          multiTenant: 'enabled',
          realTime: 'enabled'
        }
      };

      console.log('✅ Sistema RAG saludable');
      res.json(healthStatus);
    } catch (error) {
      console.error('❌ Error en verificación de salud RAG:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error verificando salud del sistema RAG',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Busca datos en el sistema RAG
   */
  static async searchRAGData(req, res) {
    try {
      const { query, organizationId, limit = 20 } = req.body;
      
      if (!query || query.trim() === '') {
        return res.status(400).json({
          error: 'Query de búsqueda requerida',
          message: 'Debe proporcionar un término de búsqueda'
        });
      }

      console.log(`🔍 Búsqueda RAG: "${query}" para organización ${organizationId || 'todas'}`);
      
      const startTime = Date.now();
      const results = await RAGDataModel.searchData(query, organizationId);
      const processingTime = Date.now() - startTime;

      // Limitar resultados
      const limitedResults = results.slice(0, limit);

      const response = {
        query: query,
        results: limitedResults,
        totalFound: results.length,
        returned: limitedResults.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Búsqueda completada: ${results.length} resultados encontrados`);
      res.json(response);
    } catch (error) {
      console.error('❌ Error en búsqueda RAG:', error);
      res.status(500).json({
        error: 'Error en búsqueda',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene contexto para generación de respuestas
   */
  static async getRAGContext(req, res) {
    try {
      const { question, organizationId, contextSize = 5 } = req.body;
      
      if (!question || question.trim() === '') {
        return res.status(400).json({
          error: 'Pregunta requerida',
          message: 'Debe proporcionar una pregunta para obtener contexto'
        });
      }

      console.log(`🧠 Obteniendo contexto para: "${question}"`);
      
      const startTime = Date.now();
      
      // Buscar datos relevantes
      const relevantData = await RAGDataModel.searchData(question, organizationId);
      
      // Seleccionar los más relevantes
      const contextData = relevantData.slice(0, contextSize);
      
      // Construir contexto
      const context = contextData.map(item => ({
        tipo: item.tipo,
        titulo: item.titulo,
        contenido: item.contenido,
        codigo: item.codigo,
        relevancia: this.calculateRelevance(question, item)
      }));

      const processingTime = Date.now() - startTime;

      const response = {
        question: question,
        context: context,
        contextSize: context.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Contexto obtenido: ${context.length} elementos relevantes`);
      res.json(response);
    } catch (error) {
      console.error('❌ Error obteniendo contexto RAG:', error);
      res.status(500).json({
        error: 'Error obteniendo contexto',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Genera respuesta basada en datos del sistema
   */
  static async generateRAGResponse(req, res) {
    try {
      const { question, organizationId, includeSources = true } = req.body;
      
      if (!question || question.trim() === '') {
        return res.status(400).json({
          error: 'Pregunta requerida',
          message: 'Debe proporcionar una pregunta para generar respuesta'
        });
      }

      console.log(`🤖 Generando respuesta para: "${question}"`);
      
      const startTime = Date.now();
      
      // Obtener datos relevantes
      const relevantData = await RAGDataModel.searchData(question, organizationId);
      
      // Generar respuesta
      const response = this.generateResponseFromData(question, relevantData);
      
      const processingTime = Date.now() - startTime;

      const result = {
        question: question,
        answer: response.answer,
        confidence: response.confidence,
        sources: includeSources ? response.sources : [],
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Respuesta generada con confianza: ${response.confidence}%`);
      res.json(result);
    } catch (error) {
      console.error('❌ Error generando respuesta RAG:', error);
      res.status(500).json({
        error: 'Error generando respuesta',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene estadísticas del sistema RAG
   */
  static async getRAGStats(req, res) {
    try {
      const { organizationId } = req.query;
      
      console.log('📊 Obteniendo estadísticas del sistema RAG...');
      
      const startTime = Date.now();
      const stats = await RAGDataModel.getSystemStats(organizationId);
      const processingTime = Date.now() - startTime;

      const response = {
        stats: stats,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Estadísticas obtenidas: ${stats.total} registros totales`);
      res.json(response);
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas RAG:', error);
      res.status(500).json({
        error: 'Error obteniendo estadísticas',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene datos por tipo específico
   */
  static async getRAGDataByType(req, res) {
    try {
      const { type } = req.params;
      const { organizationId } = req.query;
      
      console.log(`📋 Obteniendo datos de tipo: ${type}`);
      
      const startTime = Date.now();
      const data = await RAGDataModel.getDataByType(type, organizationId);
      const processingTime = Date.now() - startTime;

      const response = {
        type: type,
        data: data,
        count: data.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Datos obtenidos: ${data.length} registros de tipo ${type}`);
      res.json(response);
    } catch (error) {
      console.error(`❌ Error obteniendo datos de tipo ${req.params.type}:`, error);
      res.status(500).json({
        error: 'Error obteniendo datos',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene todos los datos del sistema
   */
  static async getAllRAGData(req, res) {
    try {
      const { organizationId } = req.query;
      
      console.log('📊 Obteniendo todos los datos del sistema RAG...');
      
      const startTime = Date.now();
      const data = await RAGDataModel.getAllSystemData(organizationId);
      const processingTime = Date.now() - startTime;

      const response = {
        data: data,
        total: data.length,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Todos los datos obtenidos: ${data.length} registros`);
      res.json(response);
    } catch (error) {
      console.error('❌ Error obteniendo todos los datos RAG:', error);
      res.status(500).json({
        error: 'Error obteniendo datos',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Calcula la relevancia de un item para una pregunta
   */
  static calculateRelevance(question, item) {
    const questionLower = question.toLowerCase();
    const titleLower = (item.titulo || '').toLowerCase();
    const contentLower = (item.contenido || '').toLowerCase();
    
    let score = 0;
    
    // Coincidencia exacta en título
    if (titleLower.includes(questionLower)) {
      score += 10;
    }
    
    // Coincidencia parcial en título
    const titleWords = questionLower.split(' ');
    titleWords.forEach(word => {
      if (titleLower.includes(word) && word.length > 2) {
        score += 3;
      }
    });
    
    // Coincidencia en contenido
    if (contentLower.includes(questionLower)) {
      score += 5;
    }
    
    // Coincidencia parcial en contenido
    titleWords.forEach(word => {
      if (contentLower.includes(word) && word.length > 2) {
        score += 1;
      }
    });
    
    return Math.min(score, 100);
  }

  /**
   * Genera respuesta basada en los datos encontrados
   */
  static generateResponseFromData(question, data) {
    if (!data || data.length === 0) {
      return {
        answer: "Lo siento, no encontré información específica sobre tu pregunta en el sistema. Te sugiero reformular tu consulta o contactar al administrador del sistema.",
        confidence: 0,
        sources: []
      };
    }

    // Ordenar por relevancia
    const sortedData = data.sort((a, b) => {
      const relevanceA = this.calculateRelevance(question, a);
      const relevanceB = this.calculateRelevance(question, b);
      return relevanceB - relevanceA;
    });

    // Tomar los 3 más relevantes
    const topResults = sortedData.slice(0, 3);
    
    // Calcular confianza promedio
    const confidence = Math.round(
      topResults.reduce((sum, item) => sum + this.calculateRelevance(question, item), 0) / topResults.length
    );

    // Generar respuesta
    let answer = "Basándome en la información del sistema, aquí tienes lo que encontré:\n\n";
    
    topResults.forEach((item, index) => {
      answer += `${index + 1}. **${item.titulo}** (${item.tipo})\n`;
      answer += `   ${item.contenido}\n\n`;
    });

    // Agregar contexto adicional si hay más resultados
    if (data.length > 3) {
      answer += `\n*Nota: Se encontraron ${data.length} resultados relacionados. Para información más específica, puedes reformular tu pregunta.*`;
    }

    return {
      answer: answer,
      confidence: confidence,
      sources: topResults.map(item => ({
        tipo: item.tipo,
        titulo: item.titulo,
        codigo: item.codigo,
        relevancia: this.calculateRelevance(question, item)
      }))
    };
  }
}

module.exports = RAGController;
