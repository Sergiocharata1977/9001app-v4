const mongoClient = require('../lib/mongoClient.js');

class CoordinacionService {
  
  // Obtener todas las tareas
  async obtenerTareas(organizationId = 2, limit = 50, offset = 0) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { organization_id: organizationId },
        {
          sort: { fecha: -1, hora_inicio: -1 },
          limit: limit,
          skip: offset
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw error;
    }
  }
  
  // Obtener tarea por número
  async obtenerTareaPorNumero(organizationId, tareaNumero) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.findOne({
        organization_id: organizationId,
        tarea_numero: tareaNumero
      });
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tarea:', error);
      throw error;
    }
  }
  
  // Obtener estadísticas
  async obtenerEstadisticas(organizationId = 2) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      // Total tareas
      const total = await collection.countDocuments({ organization_id: organizationId });
      
      // Por estado
      const estadoQuery = await collection.aggregate([
        { $match: { organization_id: organizationId } },
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ]).toArray();
      
      // Por módulo
      const moduloQuery = await collection.aggregate([
        { $match: { organization_id: organizationId } },
        { $group: { _id: '$modulo', count: { $sum: 1 } } }
      ]).toArray();
      
      // Por prioridad
      const prioridadQuery = await collection.aggregate([
        { $match: { organization_id: organizationId } },
        { $group: { _id: '$prioridad', count: { $sum: 1 } } }
      ]).toArray();
      
      // Tiempo total
      const tiempoQuery = await collection.aggregate([
        { 
          $match: { 
            organization_id: organizationId,
            tiempo_real: { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            tiempo_total: { $sum: '$tiempo_real' },
            tiempo_promedio: { $avg: '$tiempo_real' },
            tareas_con_tiempo: { $sum: 1 }
          }
        }
      ]).toArray();
      
      const estados = {};
      const modulos = {};
      const prioridades = {};
      
      estadoQuery.forEach(row => {
        estados[row._id] = row.count;
      });
      
      moduloQuery.forEach(row => {
        modulos[row._id] = row.count;
      });
      
      prioridadQuery.forEach(row => {
        prioridades[row._id] = row.count;
      });
      
      const tiempo = tiempoQuery[0] || {
        tiempo_total: 0,
        tiempo_promedio: 0,
        tareas_con_tiempo: 0
      };
      
      return {
        total,
        estados,
        modulos,
        prioridades,
        tiempo
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
  
  // Buscar tareas por texto
  async buscarTareas(organizationId, texto, limit = 20) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const searchTerm = `%${texto}%`;
      const result = await collection.find(
        {
          organization_id: organizationId,
          $or: [
            { descripcion: { $regex: searchTerm, $options: 'i' } },
            { problema: { $regex: searchTerm, $options: 'i' } },
            { solucion: { $regex: searchTerm, $options: 'i' } },
            { resultado: { $regex: searchTerm, $options: 'i' } }
          ]
        },
        {
          sort: { fecha: -1 }
        }
      ).limit(limit).toArray();
      
      return result;
    } catch (error) {
      console.error('Error buscando tareas:', error);
      throw error;
    }
  }
  
  // Obtener tareas por módulo
  async obtenerTareasPorModulo(organizationId = 2, modulo, limit = 20) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { 
          organization_id: organizationId,
          modulo: modulo
        },
        {
          sort: { fecha: -1, hora_inicio: -1 },
          limit: limit
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tareas por módulo:', error);
      throw error;
    }
  }
  
  // Obtener tareas por estado
  async obtenerTareasPorEstado(organizationId = 2, estado, limit = 20) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { 
          organization_id: organizationId,
          estado: estado
        },
        {
          sort: { fecha: -1, hora_inicio: -1 },
          limit: limit
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tareas por estado:', error);
      throw error;
    }
  }
  
  // Crear nueva tarea
  async crearTarea(tareaData) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      // Agregar timestamps
      const nuevaTarea = {
        ...tareaData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const result = await collection.insertOne(nuevaTarea);
      
      return {
        success: true,
        tarea_id: result.insertedId,
        message: 'Tarea creada exitosamente'
      };
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }
  
  // Actualizar tarea
  async actualizarTarea(organizationId, tareaNumero, datosActualizacion) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const datosActualizados = {
        ...datosActualizacion,
        updated_at: new Date()
      };
      
      const result = await collection.updateOne(
        {
          organization_id: organizationId,
          tarea_numero: tareaNumero
        },
        { $set: datosActualizados }
      );
      
      if (result.matchedCount === 0) {
        throw new Error('Tarea no encontrada');
      }
      
      return {
        success: true,
        message: 'Tarea actualizada exitosamente',
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }
  
  // Eliminar tarea
  async eliminarTarea(organizationId, tareaNumero) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.deleteOne({
        organization_id: organizationId,
        tarea_numero: tareaNumero
      });
      
      if (result.deletedCount === 0) {
        throw new Error('Tarea no encontrada');
      }
      
      return {
        success: true,
        message: 'Tarea eliminada exitosamente',
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }
  
  // Obtener siguiente número de tarea
  async obtenerSiguienteNumeroTarea(organizationId) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { organization_id: organizationId },
        { tarea_numero: 1, _id: 0 }
      ).sort({ tarea_numero: -1 }).limit(1).toArray();
      
      const maxNumero = result.length > 0 ? result[0].tarea_numero : 0;
      return maxNumero + 1;
    } catch (error) {
      console.error('Error obteniendo siguiente número:', error);
      throw error;
    }
  }
  
  // Obtener tareas pendientes
  async obtenerTareasPendientes(organizationId = 2) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { 
          organization_id: organizationId,
          estado: { $in: ['pendiente', 'en_proceso'] }
        },
        {
          sort: { prioridad: -1, fecha: 1 }
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tareas pendientes:', error);
      throw error;
    }
  }
  
  // Obtener tareas completadas
  async obtenerTareasCompletadas(organizationId = 2, limit = 50) {
    try {
      const collection = mongoClient.collection('coordinacion_tareas');
      
      const result = await collection.find(
        { 
          organization_id: organizationId,
          estado: 'completada'
        },
        {
          sort: { fecha: -1 },
          limit: limit
        }
      ).toArray();
      
      return result;
    } catch (error) {
      console.error('Error obteniendo tareas completadas:', error);
      throw error;
    }
  }
}

module.exports = CoordinacionService;
