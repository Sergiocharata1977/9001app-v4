#!/usr/bin/env node

/**
 * 🔍 Sistema de Búsqueda Simple - Alternativa al RAG
 * Sistema básico de búsqueda en base de datos sin IA
 */

const mongoClient = require('../lib/mongoClient.js');

class SimpleSearchSystem {
  static async search(query, organizationId = 1) {
    try {
      const searchTerm = new RegExp(query, 'i');
      const results = [];

      // Buscar en personal
      const personalCollection = mongoClient.collection('personal');
      const personalResults = await personalCollection.find({
        organization_id: organizationId,
        $or: [
          { nombres: searchTerm },
          { apellidos: searchTerm },
          { email: searchTerm }
        ]
      }, {
        projection: {
          tipo: { $literal: 'personal' },
          id: 1,
          titulo: { $concat: ['$nombres', ' ', '$apellidos'] },
          contenido: { $concat: ['$email', ' | ', { $ifNull: ['$telefono', 'Sin teléfono'] }] },
          codigo: { $literal: 'Personal' },
          estado: 1,
          organization_id: 1,
          created_at: 1,
          updated_at: 1
        }
      }).limit(20).toArray();

      results.push(...personalResults);

      // Buscar en normas
      const normasCollection = mongoClient.collection('normas');
      const normasResults = await normasCollection.find({
        $or: [
          { organization_id: organizationId },
          { organization_id: 0 }
        ],
        $or: [
          { titulo: searchTerm },
          { descripcion: searchTerm },
          { codigo: searchTerm }
        ]
      }, {
        projection: {
          tipo: { $literal: 'normas' },
          id: 1,
          titulo: 1,
          contenido: { $concat: ['$descripcion', ' | ', '$codigo'] },
          codigo: 1,
          estado: 1,
          organization_id: 1,
          created_at: 1,
          updated_at: 1
        }
      }).limit(20).toArray();

      results.push(...normasResults);

      // Buscar en procesos
      const procesosCollection = mongoClient.collection('procesos');
      const procesosResults = await procesosCollection.find({
        organization_id: organizationId,
        $or: [
          { nombre: searchTerm },
          { descripcion: searchTerm }
        ]
      }, {
        projection: {
          tipo: { $literal: 'procesos' },
          id: 1,
          titulo: '$nombre',
          contenido: '$descripcion',
          codigo: { $literal: 'Proceso' },
          estado: { $literal: 'activo' },
          organization_id: 1,
          created_at: 1,
          updated_at: 1
        }
      }).limit(20).toArray();

      results.push(...procesosResults);

      // Ordenar por relevancia y limitar a 20 resultados totales
      return results.slice(0, 20);
    } catch (error) {
      console.error('Error en búsqueda simple:', error);
      return [];
    }
  }
  
  static async getStats() {
    try {
      const stats = [];

      // Estadísticas de personal
      const personalCollection = mongoClient.collection('personal');
      const personalCount = await personalCollection.countDocuments({ organization_id: 1 });
      stats.push({ tabla: 'personal', count: personalCount });

      // Estadísticas de normas
      const normasCollection = mongoClient.collection('normas');
      const normasCount = await normasCollection.countDocuments({
        $or: [
          { organization_id: 0 },
          { organization_id: 1 }
        ]
      });
      stats.push({ tabla: 'normas', count: normasCount });

      // Estadísticas de procesos
      const procesosCollection = mongoClient.collection('procesos');
      const procesosCount = await procesosCollection.countDocuments({ organization_id: 1 });
      stats.push({ tabla: 'procesos', count: procesosCount });

      // Estadísticas de documentos
      const documentosCollection = mongoClient.collection('documentos');
      const documentosCount = await documentosCollection.countDocuments({ organization_id: 1 });
      stats.push({ tabla: 'documentos', count: documentosCount });

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return [];
    }
  }
}

export default SimpleSearchSystem;
