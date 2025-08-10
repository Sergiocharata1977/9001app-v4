/**
 * Servicio de Generación de Respuestas RAG
 * Responsable de generar respuestas contextualizadas basadas en búsquedas semánticas
 */

const { CONTENT_TYPES } = require('../models/rag.models');

class RAGGeneratorService {
  constructor(db, config, searchService) {
    this.db = db;
    this.config = config;
    this.searchService = searchService;
    this.llm = this.initializeLLM();
  }

  /**
   * Inicializa el modelo de lenguaje
   */
  initializeLLM() {
    // Por ahora usamos una implementación básica
    // En producción se integraría con OpenAI, Ollama, etc.
    return {
      generate: async (prompt, context) => {
        return this.generateBasicResponse(prompt, context);
      }
    };
  }

  /**
   * Genera respuesta RAG completa
   */
  async generateRAGResponse(query, organizationId, options = {}) {
    try {
      const startTime = Date.now();

      // 1. Realizar búsqueda semántica
      const searchResults = await this.searchService.searchSemantic(
        query, 
        organizationId, 
        options
      );

      if (!searchResults.results || searchResults.results.length === 0) {
        return {
          query,
          response: "No encontré información relevante para tu consulta. ¿Podrías reformular tu pregunta?",
          sources: [],
          confidence: 0,
          processingTime: Date.now() - startTime
        };
      }

      // 2. Preparar contexto para generación
      const context = this.prepareContext(searchResults.results);

      // 3. Generar respuesta
      const response = await this.llm.generate(query, context);

      // 4. Procesar fuentes
      const sources = this.processSources(searchResults.results);

      // 5. Calcular confianza
      const confidence = this.calculateConfidence(searchResults.results);

      // 6. Guardar consulta en base de datos
      await this.saveQuery(query, response, sources, organizationId, {
        processingTime: Date.now() - startTime,
        resultsCount: searchResults.results.length,
        confidence
      });

      return {
        query,
        response,
        sources,
        confidence,
        processingTime: Date.now() - startTime,
        totalResults: searchResults.results.length
      };
    } catch (error) {
      console.error('Error generating RAG response:', error);
      throw error;
    }
  }

  /**
   * Prepara el contexto para la generación
   */
  prepareContext(searchResults) {
    let context = "Basándote en la siguiente información del sistema ISO 9001:\n\n";
    
    searchResults.forEach((result, index) => {
      context += `[Fuente ${index + 1} - ${result.source.type}]\n`;
      context += `${result.content}\n\n`;
    });

    context += "\nResponde de manera clara y concisa, citando las fuentes cuando sea relevante.";
    
    return context;
  }

  /**
   * Genera respuesta básica (implementación temporal)
   */
  async generateBasicResponse(query, context) {
    // Esta es una implementación básica
    // En producción se usaría un LLM real como OpenAI, Ollama, etc.
    
    const queryLower = query.toLowerCase();
    
    // Respuestas predefinidas basadas en patrones
    if (queryLower.includes('objetivo') && queryLower.includes('proceso')) {
      return this.generateObjectiveResponse(context);
    } else if (queryLower.includes('indicador') || queryLower.includes('medición')) {
      return this.generateIndicatorResponse(context);
    } else if (queryLower.includes('hallazgo') || queryLower.includes('auditoría')) {
      return this.generateAuditResponse(context);
    } else if (queryLower.includes('personal') || queryLower.includes('empleado')) {
      return this.generatePersonnelResponse(context);
    } else if (queryLower.includes('departamento')) {
      return this.generateDepartmentResponse(context);
    } else {
      return this.generateGenericResponse(context);
    }
  }

  /**
   * Genera respuesta sobre objetivos
   */
  generateObjectiveResponse(context) {
    const objectives = this.extractObjectives(context);
    
    if (objectives.length === 0) {
      return "No encontré objetivos específicos relacionados con tu consulta.";
    }

    let response = "Basándome en la información disponible, encontré los siguientes objetivos:\n\n";
    
    objectives.forEach((objective, index) => {
      response += `${index + 1}. ${objective}\n`;
    });

    return response;
  }

  /**
   * Genera respuesta sobre indicadores
   */
  generateIndicatorResponse(context) {
    const indicators = this.extractIndicators(context);
    
    if (indicators.length === 0) {
      return "No encontré indicadores específicos relacionados con tu consulta.";
    }

    let response = "Los indicadores relevantes encontrados son:\n\n";
    
    indicators.forEach((indicator, index) => {
      response += `${index + 1}. ${indicator}\n`;
    });

    return response;
  }

  /**
   * Genera respuesta sobre auditorías
   */
  generateAuditResponse(context) {
    const findings = this.extractFindings(context);
    
    if (findings.length === 0) {
      return "No encontré hallazgos de auditoría relacionados con tu consulta.";
    }

    let response = "Los hallazgos de auditoría encontrados son:\n\n";
    
    findings.forEach((finding, index) => {
      response += `${index + 1}. ${finding}\n`;
    });

    return response;
  }

  /**
   * Genera respuesta sobre personal
   */
  generatePersonnelResponse(context) {
    const personnel = this.extractPersonnel(context);
    
    if (personnel.length === 0) {
      return "No encontré información de personal relacionada con tu consulta.";
    }

    let response = "La información de personal encontrada es:\n\n";
    
    personnel.forEach((person, index) => {
      response += `${index + 1}. ${person}\n`;
    });

    return response;
  }

  /**
   * Genera respuesta sobre departamentos
   */
  generateDepartmentResponse(context) {
    const departments = this.extractDepartments(context);
    
    if (departments.length === 0) {
      return "No encontré información de departamentos relacionada con tu consulta.";
    }

    let response = "Los departamentos encontrados son:\n\n";
    
    departments.forEach((dept, index) => {
      response += `${index + 1}. ${dept}\n`;
    });

    return response;
  }

  /**
   * Genera respuesta genérica
   */
  generateGenericResponse(context) {
    return "Basándome en la información disponible del sistema ISO 9001, puedo proporcionarte la siguiente información:\n\n" + 
           context.split('\n').slice(0, 5).join('\n') + 
           "\n\nPara obtener información más específica, te recomiendo reformular tu pregunta de manera más concreta.";
  }

  /**
   * Extrae objetivos del contexto
   */
  extractObjectives(context) {
    const objectives = [];
    const lines = context.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('objetivo') || line.toLowerCase().includes('meta')) {
        objectives.push(line.trim());
      }
    });
    
    return objectives.slice(0, 5); // Máximo 5 objetivos
  }

  /**
   * Extrae indicadores del contexto
   */
  extractIndicators(context) {
    const indicators = [];
    const lines = context.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('indicador') || line.toLowerCase().includes('medición')) {
        indicators.push(line.trim());
      }
    });
    
    return indicators.slice(0, 5);
  }

  /**
   * Extrae hallazgos del contexto
   */
  extractFindings(context) {
    const findings = [];
    const lines = context.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('hallazgo') || line.toLowerCase().includes('auditoría')) {
        findings.push(line.trim());
      }
    });
    
    return findings.slice(0, 5);
  }

  /**
   * Extrae información de personal del contexto
   */
  extractPersonnel(context) {
    const personnel = [];
    const lines = context.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('personal') || line.toLowerCase().includes('empleado')) {
        personnel.push(line.trim());
      }
    });
    
    return personnel.slice(0, 5);
  }

  /**
   * Extrae información de departamentos del contexto
   */
  extractDepartments(context) {
    const departments = [];
    const lines = context.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('departamento')) {
        departments.push(line.trim());
      }
    });
    
    return departments.slice(0, 5);
  }

  /**
   * Procesa las fuentes de información
   */
  processSources(searchResults) {
    return searchResults.map(result => ({
      id: result.id,
      type: result.source.type,
      table: result.source.table,
      chunk: result.source.chunk,
      similarity: result.similarity,
      content: result.content.substring(0, 200) + '...'
    }));
  }

  /**
   * Calcula la confianza de la respuesta
   */
  calculateConfidence(searchResults) {
    if (searchResults.length === 0) {
      return 0;
    }

    // Promedio de similitudes
    const avgSimilarity = searchResults.reduce((sum, result) => 
      sum + result.similarity, 0) / searchResults.length;

    // Factor de cantidad de resultados
    const resultFactor = Math.min(searchResults.length / 5, 1);

    return Math.min(avgSimilarity * resultFactor, 1);
  }

  /**
   * Guarda la consulta en la base de datos
   */
  async saveQuery(query, response, sources, organizationId, metadata) {
    try {
      const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.db.run(`
        INSERT INTO rag_queries 
        (id, organization_id, query_text, response_text, sources_used, processing_time_ms)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        queryId,
        organizationId,
        query,
        response,
        JSON.stringify(sources),
        metadata.processingTime
      ]);
    } catch (error) {
      console.error('Error saving query:', error);
    }
  }

  /**
   * Genera respuesta con LLM externo (OpenAI, Ollama, etc.)
   */
  async generateWithExternalLLM(prompt, context) {
    // Implementación para LLM externo
    // Esta función se implementaría según el proveedor elegido
    throw new Error('External LLM not implemented yet');
  }
}

module.exports = RAGGeneratorService; 