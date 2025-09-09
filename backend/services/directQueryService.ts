#!/usr/bin/env node

/**
 * 📊 Sistema de Consultas Directas - Alternativa al RAG
 * Sistema para consultas directas a colecciones específicas
 */

const mongoClient = require('../lib/mongoClient.js');

class DirectQuerySystem {
  static async queryPersonal(organizationId = 1) {
    try {
      const collection = mongoClient.collection('personal');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            nombres: 1,
            apellidos: 1,
            email: 1,
            telefono: 1,
            estado: 1,
            fecha_contratacion: 1,
            created_at: 1
          },
          sort: { nombres: 1, apellidos: 1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando personal:', error);
      return [];
    }
  }
  
  static async queryNormas() {
    try {
      const collection = mongoClient.collection('normas');
      
      const result = await collection.find(
        {
          $or: [
            { organization_id: 0 },
            { organization_id: 1 }
          ]
        },
        {
          projection: {
            id: 1,
            codigo: 1,
            titulo: 1,
            descripcion: 1,
            version: 1,
            tipo: 1,
            estado: 1,
            categoria: 1,
            created_at: 1
          },
          sort: { codigo: 1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando normas:', error);
      return [];
    }
  }
  
  static async queryProcesos(organizationId = 1) {
    try {
      const collection = mongoClient.collection('procesos');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            nombre: 1,
            descripcion: 1,
            responsable: 1,
            created_at: 1
          },
          sort: { nombre: 1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando procesos:', error);
      return [];
    }
  }
  
  static async queryIndicadores(organizationId = 1) {
    try {
      const collection = mongoClient.collection('indicadores');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            nombre: 1,
            descripcion: 1,
            meta: 1,
            formula: 1,
            created_at: 1
          },
          sort: { nombre: 1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando indicadores:', error);
      return [];
    }
  }

  static async queryAcciones(organizationId = 1) {
    try {
      const collection = mongoClient.collection('acciones');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            titulo: 1,
            descripcion: 1,
            estado: 1,
            prioridad: 1,
            responsable: 1,
            fecha_limite: 1,
            created_at: 1
          },
          sort: { created_at: -1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando acciones:', error);
      return [];
    }
  }

  static async queryHallazgos(organizationId = 1) {
    try {
      const collection = mongoClient.collection('hallazgos');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            titulo: 1,
            descripcion: 1,
            tipo: 1,
            estado: 1,
            severidad: 1,
            responsable: 1,
            fecha_deteccion: 1,
            created_at: 1
          },
          sort: { created_at: -1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando hallazgos:', error);
      return [];
    }
  }

  static async queryAuditorias(organizationId = 1) {
    try {
      const collection = mongoClient.collection('auditorias');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          projection: {
            id: 1,
            tipo: 1,
            fecha: 1,
            auditor: 1,
            estado: 1,
            alcance: 1,
            conclusiones: 1,
            created_at: 1
          },
          sort: { fecha: -1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error consultando auditorias:', error);
      return [];
    }
  }
}

export default DirectQuerySystem;
