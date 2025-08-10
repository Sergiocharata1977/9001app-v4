/**
 * Controlador RAG
 * Maneja todas las operaciones del módulo RAG
 */

const RAGIndexerService = require('../services/ragIndexerService');
const RAGSearchService = require('../services/ragSearchService');
const RAGGeneratorService = require('../services/ragGeneratorService');
const { validateQuery } = require('../models/rag.models');

class RAGController {
  constructor(db, config) {
    this.db = db;
    this.config = config;
    this.indexerService = new RAGIndexerService(db, config);
    this.searchService = new RAGSearchService(db, config);
    this.generatorService = new RAGGeneratorService(db, config, this.searchService);
  }

  /**
   * Activa/desactiva RAG para una organización
   */
  async toggleRAG(req, res) {
    try {
      const { organizationId, enabled } = req.body;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para configurar RAG'
        });
      }

      // Validar datos
      if (!organizationId || typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'organizationId y enabled son requeridos'
        });
      }

      // Actualizar configuración
      await this.updateRAGConfig(organizationId, enabled);

      // Si se está activando, iniciar indexación
      if (enabled) {
        // Iniciar indexación en background
        this.indexerService.indexOrganizationData(organizationId)
          .catch(error => console.error('Background indexing failed:', error));
      }

      res.json({
        success: true,
        message: `RAG ${enabled ? 'activado' : 'desactivado'} para la organización`,
        enabled
      });
    } catch (error) {
      console.error('Error toggling RAG:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Procesa consulta RAG
   */
  async query(req, res) {
    try {
      const { query, organizationId } = req.body;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para usar RAG'
        });
      }

      // Validar consulta
      const validation = validateQuery(query);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: `Consulta inválida: ${validation.errors.join(', ')}`
        });
      }

      // Verificar que RAG esté habilitado
      const ragEnabled = await this.isRAGEnabled(organizationId);
      if (!ragEnabled) {
        return res.status(400).json({
          success: false,
          message: 'RAG no está habilitado para esta organización'
        });
      }

      // Generar respuesta RAG
      const response = await this.generatorService.generateRAGResponse(
        query, 
        organizationId,
        { userId }
      );

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error processing RAG query:', error);
      res.status(500).json({
        success: false,
        message: 'Error procesando consulta RAG'
      });
    }
  }

  /**
   * Reindexa datos de una organización
   */
  async reindex(req, res) {
    try {
      const { organizationId } = req.body;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para reindexar RAG'
        });
      }

      // Verificar que RAG esté habilitado
      const ragEnabled = await this.isRAGEnabled(organizationId);
      if (!ragEnabled) {
        return res.status(400).json({
          success: false,
          message: 'RAG no está habilitado para esta organización'
        });
      }

      // Iniciar reindexación en background
      this.indexerService.indexOrganizationData(organizationId)
        .then(result => {
          console.log(`Reindexación completada para organización ${organizationId}:`, result);
        })
        .catch(error => {
          console.error(`Error en reindexación para organización ${organizationId}:`, error);
        });

      res.json({
        success: true,
        message: 'Reindexación iniciada. Se completará en segundo plano.'
      });
    } catch (error) {
      console.error('Error starting reindex:', error);
      res.status(500).json({
        success: false,
        message: 'Error iniciando reindexación'
      });
    }
  }

  /**
   * Obtiene estado de RAG
   */
  async getStatus(req, res) {
    try {
      const { organizationId } = req.params;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver estado de RAG'
        });
      }

      // Obtener configuración
      const config = await this.getRAGConfig(organizationId);
      
      // Obtener estadísticas
      const stats = await this.searchService.getSearchStats(organizationId);

      res.json({
        success: true,
        data: {
          enabled: config ? config.is_enabled : false,
          lastIndexed: config ? config.last_indexed_at : null,
          stats: stats || {
            total_embeddings: 0,
            content_types: 0,
            unique_sources: 0
          }
        }
      });
    } catch (error) {
      console.error('Error getting RAG status:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo estado de RAG'
      });
    }
  }

  /**
   * Búsqueda semántica directa
   */
  async search(req, res) {
    try {
      const { query, organizationId, options = {} } = req.body;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para usar búsqueda RAG'
        });
      }

      // Validar consulta
      const validation = validateQuery(query);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: `Consulta inválida: ${validation.errors.join(', ')}`
        });
      }

      // Realizar búsqueda
      const results = await this.searchService.searchSemantic(
        query, 
        organizationId, 
        options
      );

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error in RAG search:', error);
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda RAG'
      });
    }
  }

  /**
   * Obtiene sugerencias de consultas
   */
  async getSuggestions(req, res) {
    try {
      const { organizationId } = req.params;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para obtener sugerencias'
        });
      }

      const suggestions = this.getCommonQueries();

      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error('Error getting suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo sugerencias'
      });
    }
  }

  /**
   * Obtiene historial de consultas
   */
  async getQueryHistory(req, res) {
    try {
      const { organizationId } = req.params;
      const { limit = 20, offset = 0 } = req.query;
      const userId = req.user.id;

      // Validar permisos
      if (!this.hasRAGPermission(req.user, organizationId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver historial'
        });
      }

      const queries = await this.db.all(`
        SELECT 
          id,
          query_text,
          response_text,
          processing_time_ms,
          created_at
        FROM rag_queries 
        WHERE organization_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [organizationId, limit, offset]);

      res.json({
        success: true,
        data: queries
      });
    } catch (error) {
      console.error('Error getting query history:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo historial'
      });
    }
  }

  // Métodos auxiliares

  /**
   * Verifica permisos RAG
   */
  hasRAGPermission(user, organizationId) {
    // Solo admins y managers pueden usar RAG
    return user.role === 'admin' || user.role === 'manager';
  }

  /**
   * Verifica si RAG está habilitado
   */
  async isRAGEnabled(organizationId) {
    try {
      const result = await this.db.get(
        'SELECT is_enabled FROM rag_config WHERE organization_id = ?',
        [organizationId]
      );
      return result ? result.is_enabled : false;
    } catch (error) {
      console.error('Error checking RAG status:', error);
      return false;
    }
  }

  /**
   * Actualiza configuración RAG
   */
  async updateRAGConfig(organizationId, enabled) {
    try {
      // Verificar si existe configuración
      const existing = await this.db.get(
        'SELECT id FROM rag_config WHERE organization_id = ?',
        [organizationId]
      );

      if (existing) {
        // Actualizar configuración existente
        await this.db.run(
          'UPDATE rag_config SET is_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE organization_id = ?',
          [enabled, organizationId]
        );
      } else {
        // Crear nueva configuración
        await this.db.run(`
          INSERT INTO rag_config 
          (organization_id, is_enabled, created_at, updated_at)
          VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [organizationId, enabled]);
      }
    } catch (error) {
      console.error('Error updating RAG config:', error);
      throw error;
    }
  }

  /**
   * Obtiene configuración RAG
   */
  async getRAGConfig(organizationId) {
    try {
      return await this.db.get(
        'SELECT * FROM rag_config WHERE organization_id = ?',
        [organizationId]
      );
    } catch (error) {
      console.error('Error getting RAG config:', error);
      return null;
    }
  }

  /**
   * Obtiene consultas comunes
   */
  getCommonQueries() {
    return [
      "¿Qué objetivos están asociados al proceso de Producción?",
      "¿Qué indicadores se están utilizando para evaluar la calidad del área de Logística?",
      "¿Qué hallazgos se detectaron en la última auditoría interna?",
      "¿Qué acciones se definieron en base a las no conformidades del mes pasado?",
      "¿Qué actividades tiene asignadas el usuario Juan Pérez esta semana?",
      "¿Cuáles son los procesos más críticos de la organización?",
      "¿Qué departamentos tienen más hallazgos de auditoría?",
      "¿Cuáles son los indicadores de calidad más importantes?",
      "¿Qué capacitaciones están programadas para este mes?",
      "¿Cuál es el estado de cumplimiento de los objetivos de calidad?"
    ];
  }
}

module.exports = RAGController; 