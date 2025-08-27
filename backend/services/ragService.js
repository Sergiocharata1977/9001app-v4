const mongoClient = require('../lib/mongoClient.js');

/**
 * Servicio RAG simplificado para el Sistema SGC ISO 9001
 * Integra con MongoDB y proporciona respuestas inteligentes
 */
class RAGService {
  constructor() {
    this.mongoClient = mongoClient;
  }

  /**
   * Procesa una consulta RAG
   */
  async processQuery(question, organizationId = 'default', options = {}) {
    try {
      console.log(`🔄 Procesando consulta RAG: "${question}"`);
      
      const startTime = Date.now();
      
      // Configuración por defecto
      const config = {
        maxResults: options.maxResults || 10,
        includeSources: options.includeSources !== false,
        contextSize: options.contextSize || 5,
        ...options
      };

      // Paso 1: Buscar datos relevantes en MongoDB
      const relevantData = await this.searchData(question, organizationId);
      
      // Paso 2: Calcular relevancia y ordenar
      const scoredData = relevantData.map(item => ({
        ...item,
        relevance: this.calculateRelevanceScore(question, item)
      })).sort((a, b) => b.relevance - a.relevance);

      // Paso 3: Seleccionar mejores resultados
      const topResults = scoredData.slice(0, config.maxResults);
      
      // Paso 4: Generar respuesta
      const response = this.generateResponse(question, topResults, scoredData.length);
      
      const processingTime = Date.now() - startTime;

      const result = {
        question: question,
        answer: response.answer,
        confidence: response.confidence,
        sources: config.includeSources ? response.sources : [],
        totalResults: scoredData.length,
        processingTime: processingTime,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Consulta procesada en ${processingTime}ms con confianza ${response.confidence}%`);
      return result;
    } catch (error) {
      console.error('❌ Error procesando consulta RAG:', error);
      throw error;
    }
  }

  /**
   * Busca datos relevantes en MongoDB
   */
  async searchData(question, organizationId = 'default') {
    const questionLower = question.toLowerCase();
    const keywords = this.extractKeywords(questionLower);
    
    try {
      const collection = this.mongoClient.collection('rag_data');
      
      // Construir filtro de MongoDB
      const filter = {
        estado: 'activo'
      };
      
      // Filtrar por organización
      if (organizationId && organizationId !== 'default') {
        filter.organizacion_id = organizationId;
      }
      
      // Filtrar por palabras clave usando $or
      if (keywords.length > 0) {
        const keywordFilters = keywords.map(keyword => ({
          $or: [
            { titulo: { $regex: keyword, $options: 'i' } },
            { contenido: { $regex: keyword, $options: 'i' } },
            { codigo: { $regex: keyword, $options: 'i' } }
          ]
        }));
        
        filter.$or = keywordFilters.map(kf => kf.$or).flat();
      }
      
      // Ejecutar consulta
      const cursor = collection.find(filter, {
        projection: {
          tipo: 1,
          titulo: 1,
          codigo: 1,
          contenido: 1,
          estado: 1,
          fecha_creacion: 1,
          fecha_actualizacion: 1
        }
      });
      
      const results = await cursor.toArray();
      
      console.log(`🔍 Encontrados ${results.length} documentos relevantes`);
      return results;
    } catch (error) {
      console.error('❌ Error buscando datos en MongoDB:', error);
      return [];
    }
  }

  /**
   * Extrae palabras clave de la pregunta
   */
  extractKeywords(question) {
    // Palabras comunes a excluir
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'y', 'o', 'pero', 'si', 'no', 'que', 'cual', 'como',
      'cuando', 'donde', 'por', 'para', 'con', 'sin', 'sobre',
      'entre', 'detras', 'delante', 'encima', 'debajo', 'cerca',
      'lejos', 'antes', 'despues', 'durante', 'hasta', 'desde',
      'hacia', 'contra', 'segun', 'mediante', 'excepto', 'ademas',
      'tambien', 'muy', 'mas', 'menos', 'bien', 'mal', 'asi',
      'aqui', 'alli', 'ahi', 'este', 'esta', 'estos', 'estas',
      'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas'
    ]);

    // Extraer palabras y filtrar
    const words = question
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    return [...new Set(words)]; // Eliminar duplicados
  }

  /**
   * Calcula puntuación de relevancia
   */
  calculateRelevanceScore(question, item) {
    const questionLower = question.toLowerCase();
    const titleLower = (item.titulo || '').toLowerCase();
    const contentLower = (item.contenido || '').toLowerCase();
    const codeLower = (item.codigo || '').toLowerCase();

    let score = 0;

    // Puntuación por coincidencia exacta en título
    if (titleLower.includes(questionLower)) {
      score += 100;
    }

    // Puntuación por palabras clave en título
    const titleWords = titleLower.split(/\s+/);
    const questionWords = questionLower.split(/\s+/);
    const titleMatches = questionWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word))
    ).length;
    score += titleMatches * 20;

    // Puntuación por contenido
    const contentMatches = questionWords.filter(word => 
      contentLower.includes(word)
    ).length;
    score += contentMatches * 10;

    // Puntuación por código
    const codeMatches = questionWords.filter(word => 
      codeLower.includes(word)
    ).length;
    score += codeMatches * 15;

    // Bonus por tipo de documento
    if (item.tipo === 'procedimiento' || item.tipo === 'instruccion') {
      score += 5;
    }

    return Math.min(score, 100); // Máximo 100%
  }

  /**
   * Genera respuesta basada en los datos encontrados
   */
  generateResponse(question, topResults, totalResults) {
    if (topResults.length === 0) {
      return {
        answer: 'Lo siento, no encontré información relevante para tu consulta. Te sugiero reformular la pregunta o contactar al administrador del sistema.',
        confidence: 0,
        sources: []
      };
    }

    // Calcular confianza basada en relevancia promedio
    const avgRelevance = topResults.reduce((sum, item) => sum + item.relevance, 0) / topResults.length;
    const confidence = Math.round(avgRelevance);

    // Generar respuesta
    let answer = '';
    const sources = [];

    if (topResults.length === 1) {
      const result = topResults[0];
      answer = `Basándome en la información disponible, ${result.titulo}: ${result.contenido}`;
      sources.push({
        tipo: result.tipo,
        titulo: result.titulo,
        codigo: result.codigo,
        relevancia: result.relevance
      });
    } else {
      answer = 'Encontré la siguiente información relevante:\n\n';
      topResults.forEach((result, index) => {
        answer += `${index + 1}. ${result.titulo}: ${result.contenido}\n\n`;
        sources.push({
          tipo: result.tipo,
          titulo: result.titulo,
          codigo: result.codigo,
          relevancia: result.relevance
        });
      });
    }

    return {
      answer,
      confidence,
      sources
    };
  }

  /**
   * Obtiene estadísticas del sistema RAG
   */
  async getStats(organizationId = null) {
    try {
      const collection = this.mongoClient.collection('rag_data');
      
      const filter = {};
      if (organizationId) {
        filter.organizacion_id = organizationId;
      }

      const statsQuery = [
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            activos: {
              $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] }
            },
            inactivos: {
              $sum: { $cond: [{ $eq: ['$estado', 'inactivo'] }, 1, 0] }
            }
          }
        }
      ];

      const result = await collection.aggregate(statsQuery).toArray();
      
      if (result.length === 0) {
        return {
          total: 0,
          activos: 0,
          inactivos: 0
        };
      }

      return result[0];
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas RAG:', error);
      return {
        total: 0,
        activos: 0,
        inactivos: 0,
        error: error.message
      };
    }
  }

  /**
   * Inicializa el sistema RAG con datos de ejemplo
   */
  async initializeRAGSystem(organizationId = 'default') {
    try {
      console.log('🚀 Inicializando sistema RAG...');
      
      const collection = this.mongoClient.collection('rag_data');
      
      // Verificar si ya existen datos
      const existingCount = await collection.countDocuments({ organizacion_id: organizationId });
      
      if (existingCount > 0) {
        console.log(`✅ Sistema RAG ya inicializado con ${existingCount} documentos`);
        return {
          success: true,
          message: `Sistema RAG ya inicializado con ${existingCount} documentos`,
          existingCount
        };
      }

      // Datos de ejemplo para ISO 9001
      const sampleData = [
        {
          organizacion_id: organizationId,
          tipo: 'procedimiento',
          titulo: 'Control de Documentos',
          codigo: 'PROC-001',
          contenido: 'Este procedimiento establece los requisitos para el control de documentos del sistema de gestión de calidad, incluyendo la identificación, distribución, acceso, recuperación, uso, almacenamiento, preservación, control de cambios y disposición final de los documentos.',
          estado: 'activo',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date()
        },
        {
          organizacion_id: organizationId,
          tipo: 'instruccion',
          titulo: 'Auditorías Internas',
          codigo: 'INS-002',
          contenido: 'Las auditorías internas deben realizarse al menos una vez al año para verificar que el sistema de gestión de calidad cumple con los requisitos establecidos y se implementa y mantiene eficazmente.',
          estado: 'activo',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date()
        },
        {
          organizacion_id: organizationId,
          tipo: 'formulario',
          titulo: 'Registro de No Conformidades',
          codigo: 'FORM-003',
          contenido: 'Formulario para registrar no conformidades identificadas durante auditorías, inspecciones o quejas de clientes, incluyendo descripción, clasificación, acciones correctivas y seguimiento.',
          estado: 'activo',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date()
        }
      ];

      // Insertar datos de ejemplo
      const result = await collection.insertMany(sampleData);
      
      console.log(`✅ Sistema RAG inicializado con ${result.insertedCount} documentos`);
      
      return {
        success: true,
        message: `Sistema RAG inicializado con ${result.insertedCount} documentos`,
        insertedCount: result.insertedCount
      };
    } catch (error) {
      console.error('❌ Error inicializando sistema RAG:', error);
      return {
        success: false,
        message: `Error inicializando sistema RAG: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Verifica el estado del sistema RAG
   */
  async checkRAGStatus(organizationId = null) {
    try {
      const collection = this.mongoClient.collection('rag_data');
      
      const filter = {};
      if (organizationId) {
        filter.organizacion_id = organizationId;
      }

      const result = await collection.countDocuments(filter);
      
      return {
        success: true,
        totalDocuments: result,
        status: result > 0 ? 'active' : 'inactive',
        message: result > 0 ? 
          `Sistema RAG activo con ${result} documentos` : 
          'Sistema RAG inactivo - no hay documentos'
      };
    } catch (error) {
      console.error('❌ Error verificando estado RAG:', error);
      return {
        success: false,
        message: `Error verificando estado RAG: ${error.message}`,
        error: error.message
      };
    }
  }
}

module.exports = RAGService;
