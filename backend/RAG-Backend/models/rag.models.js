/**
 * Modelos de datos para el módulo RAG
 * Definición de esquemas y estructuras de datos
 */

const tursoClient = require('../../lib/tursoClient.js');

// Modelo para obtener todos los datos del sistema para RAG
class RAGDataModel {
  
  // Obtener todos los documentos del sistema
  static async getAllDocuments(organizationId = null) {
    try {
      let query = `
        SELECT 
          'documento' as tipo,
          id,
          titulo as titulo,
          descripcion as contenido,
          version,
          organization_id,
          created_at,
          updated_at
        FROM documentos
      `;
      
      if (organizationId) {
        query += ` WHERE organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      return [];
    }
  }

  // Obtener todas las normas ISO
  static async getAllNormas(organizationId = null) {
    try {
      let query = `
        SELECT 
          'norma' as tipo,
          id,
          titulo,
          descripcion as contenido,
          codigo,
          version,
          tipo as categoria,
          organization_id,
          created_at,
          updated_at
        FROM normas
      `;
      
      if (organizationId) {
        query += ` WHERE organization_id = ? OR organization_id = 0`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo normas:', error);
      return [];
    }
  }

  // Obtener información de personal y competencias
  static async getPersonalInfo(organizationId = null) {
    try {
      let query = `
        SELECT 
          'personal' as tipo,
          p.id,
          p.nombres || ' ' || p.apellidos as titulo,
          p.documento_identidad as codigo,
          'Personal: ' || p.nombres || ' ' || p.apellidos || 
          ' | Email: ' || p.email || 
          ' | Departamento: ' || COALESCE(d.nombre, 'Sin asignar') ||
          ' | Puesto: ' || COALESCE(pu.nombre, 'Sin asignar') as contenido,
          p.organization_id,
          p.created_at,
          p.updated_at
        FROM personal p
        LEFT JOIN departamentos d ON p.id = d.responsable_id
        LEFT JOIN puestos pu ON p.id = pu.id
      `;
      
      if (organizationId) {
        query += ` WHERE p.organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo información de personal:', error);
      return [];
    }
  }

  // Obtener auditorías y hallazgos
  static async getAuditoriasInfo(organizationId = null) {
    try {
      let query = `
        SELECT 
          'auditoria' as tipo,
          a.id,
          a.titulo,
          a.objetivos || ' | ' || a.alcance || ' | ' || COALESCE(a.resultados, 'Sin resultados') as contenido,
          a.codigo,
          a.estado,
          a.organization_id,
          a.created_at,
          a.updated_at
        FROM auditorias a
      `;
      
      if (organizationId) {
        query += ` WHERE a.organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo auditorías:', error);
      return [];
    }
  }

  // Obtener hallazgos y acciones
  static async getHallazgosAcciones(organizationId = null) {
    try {
      let query = `
        SELECT 
          'hallazgo' as tipo,
          h.id,
          h.titulo,
          h.descripcion || ' | Estado: ' || h.estado || ' | Prioridad: ' || COALESCE(h.prioridad, 'Sin definir') as contenido,
          h.numeroHallazgo as codigo,
          h.estado,
          h.organization_id,
          h.created_at,
          h.updated_at
        FROM hallazgos h
        UNION ALL
        SELECT 
          'accion' as tipo,
          ac.id,
          'Acción: ' || ac.descripcion_accion as titulo,
          ac.descripcion_accion || ' | Responsable: ' || COALESCE(ac.responsable_accion, 'Sin asignar') || 
          ' | Estado: ' || ac.estado as contenido,
          ac.numeroAccion as codigo,
          ac.estado,
          ac.organization_id,
          ac.created_at,
          ac.updated_at
        FROM acciones ac
      `;
      
      if (organizationId) {
        query += ` WHERE organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo hallazgos y acciones:', error);
      return [];
    }
  }

  // Obtener indicadores y objetivos
  static async getIndicadoresObjetivos(organizationId = null) {
    try {
      let query = `
        SELECT 
          'indicador' as tipo,
          i.id,
          i.nombre as titulo,
          i.descripcion || ' | Meta: ' || COALESCE(i.meta, 'Sin definir') || ' | Fórmula: ' || COALESCE(i.formula, 'Sin fórmula') as contenido,
          i.frecuencia_medicion as codigo,
          'activo' as estado,
          i.organization_id,
          i.created_at,
          i.updated_at
        FROM indicadores i
        UNION ALL
        SELECT 
          'objetivo' as tipo,
          o.id,
          o.nombre_objetivo as titulo,
          o.descripcion || ' | Meta: ' || COALESCE(o.meta, 'Sin definir') || ' | Responsable: ' || COALESCE(o.responsable, 'Sin asignar') as contenido,
          'objetivo_calidad' as codigo,
          'activo' as estado,
          o.organization_id,
          '2024-01-01' as created_at,
          '2024-01-01' as updated_at
        FROM objetivos_calidad o
      `;
      
      if (organizationId) {
        query += ` WHERE organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo indicadores y objetivos:', error);
      return [];
    }
  }

  // Obtener procesos y departamentos
  static async getProcesosDepartamentos(organizationId = null) {
    try {
      let query = `
        SELECT 
          'proceso' as tipo,
          p.id,
          p.nombre as titulo,
          p.descripcion || ' | Responsable: ' || COALESCE(p.responsable, 'Sin asignar') as contenido,
          'proceso_sgc' as codigo,
          'activo' as estado,
          p.organization_id,
          p.created_at,
          p.updated_at
        FROM procesos p
        UNION ALL
        SELECT 
          'departamento' as tipo,
          d.id,
          d.nombre as titulo,
          d.descripcion || ' | Objetivos: ' || COALESCE(d.objetivos, 'Sin objetivos definidos') as contenido,
          'departamento' as codigo,
          'activo' as estado,
          d.organization_id,
          d.created_at,
          d.updated_at
        FROM departamentos d
      `;
      
      if (organizationId) {
        query += ` WHERE organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo procesos y departamentos:', error);
      return [];
    }
  }

  // Obtener capacitaciones
  static async getCapacitaciones(organizationId = null) {
    try {
      let query = `
        SELECT 
          'capacitacion' as tipo,
          c.id,
          c.nombre as titulo,
          c.descripcion || ' | Instructor: ' || COALESCE(c.instructor, 'Sin asignar') || 
          ' | Duración: ' || COALESCE(c.duracion_horas, 0) || ' horas' as contenido,
          c.estado as codigo,
          c.estado,
          c.organization_id,
          c.created_at,
          c.updated_at
        FROM capacitaciones c
      `;
      
      if (organizationId) {
        query += ` WHERE c.organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo capacitaciones:', error);
      return [];
    }
  }

  // Obtener minutas y comunicaciones
  static async getMinutas(organizationId = null) {
    try {
      let query = `
        SELECT 
          'minuta' as tipo,
          m.id,
          m.titulo,
          'Tipo: ' || COALESCE(m.tipo, 'Sin tipo') || 
          ' | Lugar: ' || COALESCE(m.lugar, 'Sin lugar') ||
          ' | Agenda: ' || COALESCE(m.agenda, 'Sin agenda') ||
          ' | Conclusiones: ' || COALESCE(m.conclusiones, 'Sin conclusiones') as contenido,
          'comunicacion' as codigo,
          COALESCE(m.estado, 'activa') as estado,
          COALESCE(m.organization_id, 1) as organization_id,
          m.created_at,
          m.updated_at
        FROM minutas m
      `;
      
      if (organizationId) {
        query += ` WHERE m.organization_id = ?`;
        const result = await tursoClient.execute({ sql: query, args: [organizationId] });
        return result.rows;
      } else {
        const result = await tursoClient.execute(query);
        return result.rows;
      }
    } catch (error) {
      console.error('Error obteniendo minutas:', error);
      return [];
    }
  }

  // Obtener TODOS los datos del sistema para RAG
  static async getAllSystemData(organizationId = null) {
    try {
      console.log('🔄 Obteniendo todos los datos del sistema para RAG...');
      
      const [
        documentos,
        normas,
        personal,
        auditorias,
        hallazgosAcciones,
        indicadoresObjetivos,
        procesosDepartamentos,
        capacitaciones,
        minutas
      ] = await Promise.all([
        this.getAllDocuments(organizationId),
        this.getAllNormas(organizationId),
        this.getPersonalInfo(organizationId),
        this.getAuditoriasInfo(organizationId),
        this.getHallazgosAcciones(organizationId),
        this.getIndicadoresObjetivos(organizationId),
        this.getProcesosDepartamentos(organizationId),
        this.getCapacitaciones(organizationId),
        this.getMinutas(organizationId)
      ]);

      const allData = [
        ...documentos,
        ...normas,
        ...personal,
        ...auditorias,
        ...hallazgosAcciones,
        ...indicadoresObjetivos,
        ...procesosDepartamentos,
        ...capacitaciones,
        ...minutas
      ];

      console.log(`✅ Total de registros obtenidos: ${allData.length}`);
      console.log(`📊 Distribución por tipo:`);
      
      const stats = {};
      allData.forEach(item => {
        stats[item.tipo] = (stats[item.tipo] || 0) + 1;
      });
      
      Object.entries(stats).forEach(([tipo, count]) => {
        console.log(`   - ${tipo}: ${count} registros`);
      });

      return allData;
    } catch (error) {
      console.error('Error obteniendo todos los datos del sistema:', error);
      return [];
    }
  }

  // Buscar en todos los datos del sistema
  static async searchInSystemData(query, organizationId = null) {
    try {
      const allData = await this.getAllSystemData(organizationId);
      
      // Búsqueda simple por texto (se puede mejorar con embeddings)
      const searchTerm = query.toLowerCase();
      const results = allData.filter(item => {
        return (
          (item.titulo && item.titulo.toLowerCase().includes(searchTerm)) ||
          (item.contenido && item.contenido.toLowerCase().includes(searchTerm)) ||
          (item.codigo && item.codigo.toLowerCase().includes(searchTerm))
        );
      });

      return results.slice(0, 10); // Limitar a 10 resultados
    } catch (error) {
      console.error('Error buscando en datos del sistema:', error);
      return [];
    }
  }
}

module.exports = {
  RAGDataModel
}; 