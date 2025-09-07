const { ObjectId } = require('mongodb');

class QueryOptimizer {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Optimiza consultas agregadas para MongoDB
   */
  optimizeAggregationPipeline(pipeline, options = {}) {
    const {
      useCache = true,
      cacheKey = null,
      maxCacheTime = this.cacheTimeout
    } = options;

    // Generar clave de caché si no se proporciona
    const key = cacheKey || this.generateCacheKey(pipeline);
    
    // Verificar caché
    if (useCache && this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < maxCacheTime) {
        console.log('📦 Usando datos del caché para:', key);
        return cached.data;
      }
      this.cache.delete(key);
    }

    // Optimizar pipeline
    const optimizedPipeline = this.optimizePipeline(pipeline);
    
    return {
      pipeline: optimizedPipeline,
      cacheKey: key,
      useCache
    };
  }

  /**
   * Optimiza un pipeline de agregación
   */
  optimizePipeline(pipeline) {
    const optimized = [...pipeline];

    // 1. Mover $match al principio
    this.moveMatchToBeginning(optimized);

    // 2. Optimizar $lookup
    this.optimizeLookups(optimized);

    // 3. Optimizar $sort
    this.optimizeSort(optimized);

    // 4. Optimizar $project
    this.optimizeProject(optimized);

    // 5. Optimizar $group
    this.optimizeGroup(optimized);

    return optimized;
  }

  /**
   * Mueve $match al principio del pipeline
   */
  moveMatchToBeginning(pipeline) {
    const matchStages = [];
    const otherStages = [];

    pipeline.forEach(stage => {
      if (stage.$match) {
        matchStages.push(stage);
      } else {
        otherStages.push(stage);
      }
    });

    // Combinar múltiples $match en uno solo
    if (matchStages.length > 1) {
      const combinedMatch = { $match: {} };
      matchStages.forEach(stage => {
        Object.assign(combinedMatch.$match, stage.$match);
      });
      pipeline.length = 0;
      pipeline.push(combinedMatch, ...otherStages);
    } else if (matchStages.length === 1) {
      pipeline.length = 0;
      pipeline.push(matchStages[0], ...otherStages);
    }
  }

  /**
   * Optimiza operaciones $lookup
   */
  optimizeLookups(pipeline) {
    pipeline.forEach((stage, index) => {
      if (stage.$lookup) {
        // Agregar pipeline local para filtrar antes del lookup
        if (!stage.$lookup.pipeline) {
          stage.$lookup.pipeline = [
            { $match: { is_active: true } }
          ];
        }

        // Optimizar el pipeline del lookup
        stage.$lookup.pipeline = this.optimizePipeline(stage.$lookup.pipeline);
      }
    });
  }

  /**
   * Optimiza operaciones $sort
   */
  optimizeSort(pipeline) {
    // Mover $sort después de $match pero antes de $lookup
    const sortIndex = pipeline.findIndex(stage => stage.$sort);
    if (sortIndex > 0) {
      const sortStage = pipeline.splice(sortIndex, 1)[0];
      
      // Encontrar posición óptima (después de $match, antes de $lookup)
      let insertIndex = 0;
      for (let i = 0; i < pipeline.length; i++) {
        if (pipeline[i].$lookup) {
          insertIndex = i;
          break;
        }
        insertIndex = i + 1;
      }
      
      pipeline.splice(insertIndex, 0, sortStage);
    }
  }

  /**
   * Optimiza operaciones $project
   */
  optimizeProject(pipeline) {
    pipeline.forEach(stage => {
      if (stage.$project) {
        // Asegurar que solo se proyecten campos necesarios
        if (stage.$project._id === undefined) {
          stage.$project._id = 1; // Incluir _id por defecto
        }
      }
    });
  }

  /**
   * Optimiza operaciones $group
   */
  optimizeGroup(pipeline) {
    pipeline.forEach(stage => {
      if (stage.$group) {
        // Optimizar expresiones de agregación
        Object.keys(stage.$group).forEach(key => {
          if (key !== '_id') {
            const expr = stage.$group[key];
            if (typeof expr === 'object') {
              // Optimizar expresiones complejas
              this.optimizeAggregationExpression(expr);
            }
          }
        });
      }
    });
  }

  /**
   * Optimiza expresiones de agregación
   */
  optimizeAggregationExpression(expr) {
    // Implementar optimizaciones específicas según sea necesario
    // Por ejemplo, simplificar expresiones anidadas
  }

  /**
   * Genera una clave de caché para el pipeline
   */
  generateCacheKey(pipeline) {
    return JSON.stringify(pipeline);
  }

  /**
   * Almacena datos en caché
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Limpia el caché
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas del caché
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Crea índices optimizados para consultas comunes
   */
  createOptimizedIndexes(db, collectionName) {
    const collection = db.collection(collectionName);
    
    const indexes = [
      // Índice compuesto para consultas por organización y estado
      { organization_id: 1, is_active: 1 },
      
      // Índice para búsquedas por fecha
      { created_at: -1 },
      
      // Índice para búsquedas por nombre
      { nombre: 'text', descripcion: 'text' },
      
      // Índices específicos por colección
      ...this.getCollectionSpecificIndexes(collectionName)
    ];

    return Promise.all(
      indexes.map(index => 
        collection.createIndex(index).catch(err => 
          console.warn(`⚠️ No se pudo crear índice:`, err.message)
        )
      )
    );
  }

  /**
   * Obtiene índices específicos por colección
   */
  getCollectionSpecificIndexes(collectionName) {
    const specificIndexes = {
      personal: [
        { email: 1, organization_id: 1 },
        { puestoId: 1, organization_id: 1 },
        { departamentoId: 1, organization_id: 1 }
      ],
      procesos: [
        { codigo: 1, organization_id: 1 },
        { tipo: 1, organization_id: 1 },
        { nivel_critico: 1, organization_id: 1 },
        { responsable_id: 1, organization_id: 1 }
      ],
      indicadores: [
        { tipo: 1, organization_id: 1 },
        { proceso_id: 1, organization_id: 1 },
        { responsable_id: 1, organization_id: 1 }
      ],
      objetivos_calidad: [
        { codigo: 1, organization_id: 1 },
        { estado: 1, organization_id: 1 },
        { prioridad: 1, organization_id: 1 },
        { proceso_id: 1, organization_id: 1 }
      ],
      mediciones: [
        { indicador_id: 1, organization_id: 1 },
        { fecha_medicion: -1, organization_id: 1 },
        { responsable_id: 1, organization_id: 1 }
      ]
    };

    return specificIndexes[collectionName] || [];
  }

  /**
   * Analiza el rendimiento de una consulta
   */
  async analyzeQueryPerformance(db, collectionName, pipeline) {
    try {
      const collection = db.collection(collectionName);
      
      // Ejecutar con explain
      const explainResult = await collection.aggregate(pipeline).explain('executionStats');
      
      return {
        executionTime: explainResult.executionStats?.executionTimeMillis || 0,
        totalDocsExamined: explainResult.executionStats?.totalDocsExamined || 0,
        totalDocsReturned: explainResult.executionStats?.totalDocsReturned || 0,
        stages: explainResult.executionStats?.stages || [],
        indexesUsed: this.extractIndexesUsed(explainResult),
        recommendations: this.generateRecommendations(explainResult)
      };
    } catch (error) {
      console.error('Error analizando rendimiento:', error);
      return null;
    }
  }

  /**
   * Extrae los índices utilizados en la consulta
   */
  extractIndexesUsed(explainResult) {
    const indexes = [];
    
    if (explainResult.executionStats?.stages) {
      explainResult.executionStats.stages.forEach(stage => {
        if (stage.indexName) {
          indexes.push(stage.indexName);
        }
      });
    }
    
    return [...new Set(indexes)];
  }

  /**
   * Genera recomendaciones de optimización
   */
  generateRecommendations(explainResult) {
    const recommendations = [];
    const stats = explainResult.executionStats;
    
    if (!stats) return recommendations;
    
    // Verificar si se examinaron demasiados documentos
    if (stats.totalDocsExamined > stats.totalDocsReturned * 10) {
      recommendations.push({
        type: 'index',
        message: 'Considerar crear un índice para reducir el número de documentos examinados'
      });
    }
    
    // Verificar tiempo de ejecución
    if (stats.executionTimeMillis > 1000) {
      recommendations.push({
        type: 'performance',
        message: 'La consulta tarda más de 1 segundo. Considerar optimizaciones adicionales'
      });
    }
    
    // Verificar si no se usaron índices
    if (stats.totalDocsExamined > 0 && this.extractIndexesUsed(explainResult).length === 0) {
      recommendations.push({
        type: 'index',
        message: 'No se utilizaron índices. Crear índices apropiados para mejorar el rendimiento'
      });
    }
    
    return recommendations;
  }
}

module.exports = QueryOptimizer;
