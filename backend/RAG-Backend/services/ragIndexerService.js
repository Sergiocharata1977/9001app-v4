/**
 * Servicio de Indexación RAG
 * Responsable de indexar datos de la organización para búsqueda semántica
 */

const { CONTENT_TYPES } = require('../models/rag.models');

class RAGIndexerService {
  constructor(db, config) {
    this.db = db;
    this.config = config;
  }

  /**
   * Indexa todos los datos de una organización
   */
  async indexOrganizationData(organizationId) {
    try {
      console.log(`🔍 Iniciando indexación para organización ${organizationId}...`);
      
      const startTime = Date.now();
      let totalIndexed = 0;

      // 1. Indexar documentos
      const documentosCount = await this.indexDocumentos(organizationId);
      totalIndexed += documentosCount;

      // 2. Indexar normas
      const normasCount = await this.indexNormas(organizationId);
      totalIndexed += normasCount;

      // 3. Indexar procesos
      const procesosCount = await this.indexProcesos(organizationId);
      totalIndexed += procesosCount;

      // 4. Indexar hallazgos
      const hallazgosCount = await this.indexHallazgos(organizationId);
      totalIndexed += hallazgosCount;

      // 5. Indexar acciones
      const accionesCount = await this.indexAcciones(organizationId);
      totalIndexed += accionesCount;

      // 6. Indexar objetivos de calidad
      const objetivosCount = await this.indexObjetivosCalidad(organizationId);
      totalIndexed += objetivosCount;

      // 7. Indexar indicadores
      const indicadoresCount = await this.indexIndicadores(organizationId);
      totalIndexed += indicadoresCount;

      // Actualizar timestamp de última indexación
      await this.updateLastIndexed(organizationId);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Indexación completada: ${totalIndexed} elementos en ${processingTime}ms`);

      return {
        success: true,
        totalIndexed,
        processingTime,
        breakdown: {
          documentos: documentosCount,
          normas: normasCount,
          procesos: procesosCount,
          hallazgos: hallazgosCount,
          acciones: accionesCount,
          objetivos: objetivosCount,
          indicadores: indicadoresCount
        }
      };
    } catch (error) {
      console.error('❌ Error en indexación:', error);
      throw error;
    }
  }

  /**
   * Indexa documentos de la organización
   */
  async indexDocumentos(organizationId) {
    try {
      const documentos = await this.db.all(`
        SELECT 
          id, titulo, nombre, descripcion, version,
          archivo_nombre, tipo_archivo, organization_id,
          created_at, updated_at
        FROM documentos 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const doc of documentos) {
        const content = this.prepareDocumentContent(doc);
        const chunks = this.createChunks(content, 'documento');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'documento',
            contentId: doc.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              titulo: doc.titulo,
              nombre: doc.nombre,
              version: doc.version,
              tipo_archivo: doc.tipo_archivo,
              source: 'documentos'
            }
          });
          indexed++;
        }
      }

      console.log(`📄 Indexados ${indexed} chunks de ${documentos.length} documentos`);
      return indexed;
    } catch (error) {
      console.error('Error indexando documentos:', error);
      return 0;
    }
  }

  /**
   * Indexa normas de la organización
   */
  async indexNormas(organizationId) {
    try {
      // Incluir normas específicas de la organización Y normas globales (organization_id = 0)
      const normas = await this.db.all(`
        SELECT 
          id, codigo, titulo, descripcion, version,
          tipo, estado, categoria, responsable,
          fecha_revision, observaciones, organization_id,
          created_at, updated_at
        FROM normas 
        WHERE organization_id = ? OR organization_id = 0
        ORDER BY organization_id ASC, codigo ASC
      `, [organizationId]);

      let indexed = 0;
      for (const norma of normas) {
        const content = this.prepareNormaContent(norma);
        const chunks = this.createChunks(content, 'norma');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId: organizationId, // Siempre usar la org actual para indexación
            contentType: 'norma',
            contentId: norma.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              codigo: norma.codigo,
              titulo: norma.titulo,
              version: norma.version,
              tipo: norma.tipo,
              estado: norma.estado,
              categoria: norma.categoria,
              responsable: norma.responsable,
              source: 'normas',
              is_global: norma.organization_id === 0,
              original_org_id: norma.organization_id
            }
          });
          indexed++;
        }
      }

      console.log(`📋 Indexadas ${indexed} chunks de ${normas.length} normas (incluyendo globales)`);
      return indexed;
    } catch (error) {
      console.error('Error indexando normas:', error);
      return 0;
    }
  }

  /**
   * Indexa procesos de la organización
   */
  async indexProcesos(organizationId) {
    try {
      const procesos = await this.db.all(`
        SELECT 
          id, nombre, descripcion, objetivo, alcance,
          responsable, recursos, organization_id,
          created_at, updated_at
        FROM procesos 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const proceso of procesos) {
        const content = this.prepareProcesoContent(proceso);
        const chunks = this.createChunks(content, 'proceso');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'proceso',
            contentId: proceso.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              nombre: proceso.nombre,
              objetivo: proceso.objetivo,
              responsable: proceso.responsable,
              source: 'procesos'
            }
          });
          indexed++;
        }
      }

      console.log(`🔄 Indexados ${indexed} chunks de ${procesos.length} procesos`);
      return indexed;
    } catch (error) {
      console.error('Error indexando procesos:', error);
      return 0;
    }
  }

  /**
   * Indexa hallazgos de la organización
   */
  async indexHallazgos(organizationId) {
    try {
      const hallazgos = await this.db.all(`
        SELECT 
          id, titulo, descripcion, tipo, severidad,
          estado, proceso_id, responsable, fecha_deteccion,
          fecha_limite, organization_id, created_at, updated_at
        FROM hallazgos 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const hallazgo of hallazgos) {
        const content = this.prepareHallazgoContent(hallazgo);
        const chunks = this.createChunks(content, 'hallazgo');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'hallazgo',
            contentId: hallazgo.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              titulo: hallazgo.titulo,
              tipo: hallazgo.tipo,
              severidad: hallazgo.severidad,
              estado: hallazgo.estado,
              responsable: hallazgo.responsable,
              fecha_deteccion: hallazgo.fecha_deteccion,
              source: 'hallazgos'
            }
          });
          indexed++;
        }
      }

      console.log(`🔍 Indexados ${indexed} chunks de ${hallazgos.length} hallazgos`);
      return indexed;
    } catch (error) {
      console.error('Error indexando hallazgos:', error);
      return 0;
    }
  }

  /**
   * Indexa acciones de la organización
   */
  async indexAcciones(organizationId) {
    try {
      const acciones = await this.db.all(`
        SELECT 
          id, titulo, descripcion, tipo, estado,
          responsable, fecha_inicio, fecha_limite,
          hallazgo_id, organization_id, created_at, updated_at
        FROM acciones 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const accion of acciones) {
        const content = this.prepareAccionContent(accion);
        const chunks = this.createChunks(content, 'accion');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'accion',
            contentId: accion.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              titulo: accion.titulo,
              tipo: accion.tipo,
              estado: accion.estado,
              responsable: accion.responsable,
              fecha_inicio: accion.fecha_inicio,
              fecha_limite: accion.fecha_limite,
              source: 'acciones'
            }
          });
          indexed++;
        }
      }

      console.log(`✅ Indexadas ${indexed} chunks de ${acciones.length} acciones`);
      return indexed;
    } catch (error) {
      console.error('Error indexando acciones:', error);
      return 0;
    }
  }

  /**
   * Indexa objetivos de calidad
   */
  async indexObjetivosCalidad(organizationId) {
    try {
      const objetivos = await this.db.all(`
        SELECT 
          id, titulo, descripcion, meta, unidad_medida,
          responsable, fecha_inicio, fecha_limite,
          estado, organization_id, created_at, updated_at
        FROM objetivos_calidad 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const objetivo of objetivos) {
        const content = this.prepareObjetivoContent(objetivo);
        const chunks = this.createChunks(content, 'objetivo');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'objetivo',
            contentId: objetivo.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              titulo: objetivo.titulo,
              meta: objetivo.meta,
              unidad_medida: objetivo.unidad_medida,
              responsable: objetivo.responsable,
              estado: objetivo.estado,
              source: 'objetivos_calidad'
            }
          });
          indexed++;
        }
      }

      console.log(`🎯 Indexados ${indexed} chunks de ${objetivos.length} objetivos`);
      return indexed;
    } catch (error) {
      console.error('Error indexando objetivos:', error);
      return 0;
    }
  }

  /**
   * Indexa indicadores
   */
  async indexIndicadores(organizationId) {
    try {
      const indicadores = await this.db.all(`
        SELECT 
          id, nombre, descripcion, formula, unidad_medida,
          objetivo_id, responsable, frecuencia, organization_id,
          created_at, updated_at
        FROM indicadores 
        WHERE organization_id = ?
      `, [organizationId]);

      let indexed = 0;
      for (const indicador of indicadores) {
        const content = this.prepareIndicadorContent(indicador);
        const chunks = this.createChunks(content, 'indicador');
        
        for (let i = 0; i < chunks.length; i++) {
          await this.saveEmbedding({
            organizationId,
            contentType: 'indicador',
            contentId: indicador.id,
            contentHash: this.generateHash(content),
            chunkIndex: i,
            chunkText: chunks[i],
            metadata: {
              nombre: indicador.nombre,
              formula: indicador.formula,
              unidad_medida: indicador.unidad_medida,
              responsable: indicador.responsable,
              frecuencia: indicador.frecuencia,
              source: 'indicadores'
            }
          });
          indexed++;
        }
      }

      console.log(`📊 Indexados ${indexed} chunks de ${indicadores.length} indicadores`);
      return indexed;
    } catch (error) {
      console.error('Error indexando indicadores:', error);
      return 0;
    }
  }

  // Métodos auxiliares para preparar contenido
  prepareDocumentContent(doc) {
    return `Documento: ${doc.titulo}\nNombre: ${doc.nombre}\nDescripción: ${doc.descripcion || ''}\nVersión: ${doc.version}\nTipo: ${doc.tipo_archivo || ''}`;
  }

  prepareNormaContent(norma) {
    return `Norma: ${norma.codigo} - ${norma.titulo}\nDescripción: ${norma.descripcion || ''}\nVersión: ${norma.version}\nTipo: ${norma.tipo}\nCategoría: ${norma.categoria || ''}\nResponsable: ${norma.responsable || ''}\nObservaciones: ${norma.observaciones || ''}`;
  }

  prepareProcesoContent(proceso) {
    return `Proceso: ${proceso.nombre}\nObjetivo: ${proceso.objetivo || ''}\nDescripción: ${proceso.descripcion || ''}\nAlcance: ${proceso.alcance || ''}\nResponsable: ${proceso.responsable || ''}\nRecursos: ${proceso.recursos || ''}`;
  }

  prepareHallazgoContent(hallazgo) {
    return `Hallazgo: ${hallazgo.titulo}\nDescripción: ${hallazgo.descripcion || ''}\nTipo: ${hallazgo.tipo}\nSeveridad: ${hallazgo.severidad}\nEstado: ${hallazgo.estado}\nResponsable: ${hallazgo.responsable || ''}\nFecha de detección: ${hallazgo.fecha_deteccion || ''}\nFecha límite: ${hallazgo.fecha_limite || ''}`;
  }

  prepareAccionContent(accion) {
    return `Acción: ${accion.titulo}\nDescripción: ${accion.descripcion || ''}\nTipo: ${accion.tipo}\nEstado: ${accion.estado}\nResponsable: ${accion.responsable || ''}\nFecha inicio: ${accion.fecha_inicio || ''}\nFecha límite: ${accion.fecha_limite || ''}`;
  }

  prepareObjetivoContent(objetivo) {
    return `Objetivo de Calidad: ${objetivo.titulo}\nDescripción: ${objetivo.descripcion || ''}\nMeta: ${objetivo.meta || ''}\nUnidad de medida: ${objetivo.unidad_medida || ''}\nResponsable: ${objetivo.responsable || ''}\nEstado: ${objetivo.estado}\nFecha inicio: ${objetivo.fecha_inicio || ''}\nFecha límite: ${objetivo.fecha_limite || ''}`;
  }

  prepareIndicadorContent(indicador) {
    return `Indicador: ${indicador.nombre}\nDescripción: ${indicador.descripcion || ''}\nFórmula: ${indicador.formula || ''}\nUnidad de medida: ${indicador.unidad_medida || ''}\nResponsable: ${indicador.responsable || ''}\nFrecuencia: ${indicador.frecuencia || ''}`;
  }

  /**
   * Crea chunks de texto
   */
  createChunks(text, contentType) {
    const chunkSize = this.config.chunkSize || 1000;
    const overlap = this.config.chunkOverlap || 200;
    
    if (text.length <= chunkSize) {
      return [text];
    }

    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.substring(start, end));
      start = end - overlap;
      
      if (start >= text.length) break;
    }

    return chunks;
  }

  /**
   * Guarda embedding en la base de datos
   */
  async saveEmbedding(embeddingData) {
    try {
      // Por ahora guardamos solo el texto, sin embeddings reales
      // En una implementación completa, aquí se generarían los embeddings
      await this.db.run(`
        INSERT OR REPLACE INTO rag_embeddings 
        (organization_id, content_type, content_id, content_hash, chunk_index, chunk_text, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        embeddingData.organizationId,
        embeddingData.contentType,
        embeddingData.contentId,
        embeddingData.contentHash,
        embeddingData.chunkIndex,
        embeddingData.chunkText,
        JSON.stringify(embeddingData.metadata)
      ]);
    } catch (error) {
      console.error('Error guardando embedding:', error);
    }
  }

  /**
   * Genera hash del contenido
   */
  generateHash(content) {
    // Implementación simple de hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Actualiza timestamp de última indexación
   */
  async updateLastIndexed(organizationId) {
    try {
      await this.db.run(`
        UPDATE rag_config 
        SET last_indexed_at = CURRENT_TIMESTAMP 
        WHERE organization_id = ?
      `, [organizationId]);
    } catch (error) {
      console.error('Error actualizando last_indexed_at:', error);
    }
  }
}

module.exports = RAGIndexerService; 