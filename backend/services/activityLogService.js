const mongoClient = require('../lib/mongoClient.js');
const crypto = require('crypto');

/**
 * Servicio para registrar actividades del sistema en la bitácora unificada
 */
class ActivityLogService {
  
  /**
   * Registra una actividad en la bitácora del sistema
   * @param {Object} activityData - Datos de la actividad
   * @param {string} activityData.tipo_entidad - Tipo de entidad (departamento, puesto, proceso, etc.)
   * @param {string} activityData.entidad_id - ID de la entidad
   * @param {string} activityData.accion - Acción realizada (crear, actualizar, eliminar)
   * @param {string} activityData.descripcion - Descripción legible de la actividad
   * @param {string} activityData.usuario_id - ID del usuario que realizó la acción
   * @param {string} activityData.usuario_nombre - Nombre del usuario
   * @param {number} activityData.organization_id - ID de la organización
   * @param {Object} activityData.datos_anteriores - Datos antes del cambio (opcional)
   * @param {Object} activityData.datos_nuevos - Datos después del cambio (opcional)
   * @param {string} activityData.ip_address - Dirección IP (opcional)
   * @param {string} activityData.user_agent - User Agent (opcional)
   */
  static async registrarActividad(activityData) {
    try {
      const id = crypto.randomUUID();
      const now = new Date();

      const collection = mongoClient.collection('actividad_sistema');

      const actividad = {
        id,
        tipo_entidad: activityData.tipo_entidad,
        entidad_id: activityData.entidad_id,
        accion: activityData.accion,
        descripcion: activityData.descripcion,
        usuario_id: activityData.usuario_id || null,
        usuario_nombre: activityData.usuario_nombre || 'Sistema',
        organization_id: activityData.organization_id,
        datos_anteriores: activityData.datos_anteriores || null,
        datos_nuevos: activityData.datos_nuevos || null,
        created_at: now,
        ip_address: activityData.ip_address || null,
        user_agent: activityData.user_agent || null
      };

      await collection.insertOne(actividad);

      return { id, created_at: now };

    } catch (error) {
      console.error('Error registrando actividad:', error);
      // No lanzar error para evitar que falle la operación principal
      return null;
    }
  }

  /**
   * Obtiene el historial de actividades filtrado
   * @param {Object} filtros - Filtros para la consulta
   * @param {number} filtros.organization_id - ID de la organización
   * @param {string} filtros.tipo_entidad - Tipo de entidad (opcional)
   * @param {string} filtros.entidad_id - ID de entidad específica (opcional)
   * @param {string} filtros.usuario_id - ID de usuario (opcional)
   * @param {number} filtros.limite - Límite de resultados (default: 50)
   * @param {number} filtros.offset - Offset para paginación (default: 0)
   */
  static async obtenerHistorial(filtros = {}) {
    try {
      const {
        organization_id,
        tipo_entidad,
        entidad_id,
        usuario_id,
        limite = 50,
        offset = 0
      } = filtros;

      const collection = mongoClient.collection('actividad_sistema');

      // Construir filtro
      const filter = { organization_id };

      if (tipo_entidad) {
        filter.tipo_entidad = tipo_entidad;
      }

      if (entidad_id) {
        filter.entidad_id = entidad_id;
      }

      if (usuario_id) {
        filter.usuario_id = usuario_id;
      }

      const result = await collection.find(filter, {
        sort: { created_at: -1 },
        limit: limite,
        skip: offset
      }).toArray();

      return result;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de actividades
   * @param {number} organization_id - ID de la organización
   * @param {string} periodo - Periodo de tiempo (hoy, semana, mes, año)
   */
  static async obtenerEstadisticas(organization_id, periodo = 'mes') {
    try {
      const collection = mongoClient.collection('actividad_sistema');

      // Calcular fecha de inicio según el periodo
      const now = new Date();
      let fechaInicio;

      switch (periodo) {
        case 'hoy':
          fechaInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'semana':
          fechaInicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'mes':
          fechaInicio = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'año':
          fechaInicio = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          fechaInicio = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Consulta de agregación para estadísticas
      const pipeline = [
        {
          $match: {
            organization_id,
            created_at: { $gte: fechaInicio }
          }
        },
        {
          $group: {
            _id: {
              tipo_entidad: '$tipo_entidad',
              accion: '$accion'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.tipo_entidad',
            acciones: {
              $push: {
                accion: '$_id.accion',
                count: '$count'
              }
            },
            total: { $sum: '$count' }
          }
        }
      ];

      const result = await collection.aggregate(pipeline).toArray();

      // Formatear resultado
      const estadisticas = {};
      result.forEach(item => {
        estadisticas[item._id] = {
          total: item.total,
          acciones: item.acciones.reduce((acc, act) => {
            acc[act.accion] = act.count;
            return acc;
          }, {})
        };
      });

      return estadisticas;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {};
    }
  }

  /**
   * Obtiene actividades recientes
   * @param {number} organization_id - ID de la organización
   * @param {number} limite - Número de actividades a obtener
   */
  static async obtenerActividadesRecientes(organization_id, limite = 10) {
    try {
      const collection = mongoClient.collection('actividad_sistema');

      const result = await collection.find(
        { organization_id },
        {
          sort: { created_at: -1 },
          limit: limite,
          projection: {
            id: 1,
            tipo_entidad: 1,
            accion: 1,
            descripcion: 1,
            usuario_nombre: 1,
            created_at: 1
          }
        }
      ).toArray();

      return result;
    } catch (error) {
      console.error('Error obteniendo actividades recientes:', error);
      return [];
    }
  }

  /**
   * Limpia actividades antiguas
   * @param {number} organization_id - ID de la organización
   * @param {number} diasAntiguedad - Días de antigüedad para eliminar
   */
  static async limpiarActividadesAntiguas(organization_id, diasAntiguedad = 365) {
    try {
      const collection = mongoClient.collection('actividad_sistema');

      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

      const result = await collection.deleteMany({
        organization_id,
        created_at: { $lt: fechaLimite }
      });

      return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Se eliminaron ${result.deletedCount} actividades antiguas`
      };
    } catch (error) {
      console.error('Error limpiando actividades antiguas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = ActivityLogService; 