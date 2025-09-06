const Proceso = require('../models/Proceso');
const { validateProceso } = require('../validators/procesosValidator');

/**
 * Controlador de Procesos SGC para MongoDB
 * Sistema de Gestión de Calidad ISO 9001
 */
class ProcesosController {
  
  /**
   * Obtener todos los procesos de una organización
   */
  async getAllProcesos(req, res) {
    try {
      const orgId = req.user?.organization_id || 2;
      console.log('📋 Obteniendo todos los procesos SGC para organización:', orgId);
      
      const procesos = await Proceso.findByOrganization(orgId)
        .populate('responsable_id', 'nombre_completo puesto')
        .populate('departamento_id', 'nombre')
        .populate('supervisor_id', 'nombre_completo')
        .sort({ codigo: 1, nombre: 1 });
      
      // Agregar contadores SGC
      const procesosConContadores = await Promise.all(
        procesos.map(async (proceso) => {
          const procesoObj = proceso.toPublicJSON();
          
          // Contadores de relaciones SGC (implementar cuando se creen los modelos)
          procesoObj.total_participantes = 0;
          procesoObj.total_documentos = 0;
          procesoObj.total_normas = 0;
          
          return procesoObj;
        })
      );
      
      console.log(`✅ ${procesosConContadores.length} procesos SGC obtenidos`);
      res.json({
        success: true,
        data: procesosConContadores,
        total: procesosConContadores.length,
        message: 'Procesos SGC obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener procesos SGC:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Error al obtener procesos SGC',
        error: error.message
      });
    }
  }
  
  /**
   * Obtener un proceso por ID con información SGC completa
   */
  async getProcesoById(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.user?.organization_id || 2;
      console.log(`🔍 Buscando proceso SGC con ID: ${id}`);
      
      const proceso = await Proceso.findOne({
        id,
        organization_id: orgId,
        is_active: true
      }).populate('responsable_id', 'nombre_completo puesto email')
        .populate('departamento_id', 'nombre descripcion')
        .populate('supervisor_id', 'nombre_completo puesto');
      
      if (!proceso) {
        return res.status(404).json({
          status: 'error',
          message: 'Proceso no encontrado'
        });
      }
      
      // Agregar información SGC (implementar cuando se creen los modelos)
      const procesoCompleto = {
        ...proceso.toPublicJSON(),
        participantes: [],
        documentos: [],
        normas: [],
        estadisticas_sgc: {
          total_participantes: 0,
          total_documentos: 0,
          total_normas: 0
        }
      };
      
      console.log(`✅ Proceso SGC completo encontrado: ${proceso.nombre}`);
      res.json({
        status: 'success',
        data: procesoCompleto,
        message: 'Proceso SGC obtenido exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener proceso SGC:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Error al obtener proceso SGC',
        error: error.message
      });
    }
  }
  
  /**
   * Crear un nuevo proceso con estructura SGC
   */
  async createProceso(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = validateProceso(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos de entrada inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }
      
      const orgId = req.user?.organization_id || 2;
      const userId = req.user?.id;
      
      console.log('➕ Creando nuevo proceso SGC:', { 
        nombre: value.nombre, 
        codigo: value.codigo, 
        tipo: value.tipo, 
        categoria: value.categoria 
      });
      
      // Generar código único si no se proporciona
      if (!value.codigo) {
        value.codigo = `PROC-${String(Date.now()).slice(-6)}`;
      }
      
      // Verificar que el código sea único en la organización
      const codigoExistente = await Proceso.findOne({
        codigo: value.codigo,
        organization_id: orgId,
        is_active: true
      });
      
      if (codigoExistente) {
        return res.status(400).json({
          status: 'error',
          message: 'El código del proceso ya existe en esta organización'
        });
      }
      
      // Crear el proceso
      const nuevoProceso = new Proceso({
        ...value,
        organization_id: orgId,
        created_by: userId,
        updated_by: userId
      });
      
      const procesoGuardado = await nuevoProceso.save();
      
      console.log(`✅ Proceso SGC creado con ID: ${procesoGuardado.id}`);
      res.status(201).json({
        status: 'success',
        data: procesoGuardado.toPublicJSON(),
        message: 'Proceso SGC creado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al crear proceso SGC:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Error al crear proceso SGC',
        error: error.message
      });
    }
  }
  
  /**
   * Actualizar un proceso existente con estructura SGC
   */
  async updateProceso(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.user?.organization_id || 2;
      const userId = req.user?.id;
      
      console.log(`✏️ Actualizando proceso SGC ID: ${id}`);
      
      // Validar datos de entrada
      const { error, value } = validateProceso(req.body, true);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos de entrada inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }
      
      // Buscar el proceso
      const proceso = await Proceso.findOne({
        id,
        organization_id: orgId,
        is_active: true
      });
      
      if (!proceso) {
        return res.status(404).json({
          status: 'error',
          message: 'Proceso no encontrado'
        });
      }
      
      // Verificar código único si se está cambiando
      if (value.codigo && value.codigo !== proceso.codigo) {
        const codigoExistente = await Proceso.findOne({
          codigo: value.codigo,
          organization_id: orgId,
          is_active: true,
          id: { $ne: id }
        });
        
        if (codigoExistente) {
          return res.status(400).json({
            status: 'error',
            message: 'El código del proceso ya existe en esta organización'
          });
        }
      }
      
      // Actualizar el proceso
      Object.assign(proceso, value, { updated_by: userId });
      const procesoActualizado = await proceso.save();
      
      console.log(`✅ Proceso SGC actualizado: ${procesoActualizado.nombre}`);
      res.json({
        status: 'success',
        data: procesoActualizado.toPublicJSON(),
        message: 'Proceso SGC actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al actualizar proceso SGC:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Error al actualizar proceso SGC',
        error: error.message
      });
    }
  }
  
  /**
   * Eliminar un proceso (soft delete)
   */
  async deleteProceso(req, res) {
    try {
      const { id } = req.params;
      const orgId = req.user?.organization_id || 2;
      const userId = req.user?.id;
      
      console.log(`🗑️ Eliminando proceso SGC ID: ${id}`);
      
      const proceso = await Proceso.findOne({
        id,
        organization_id: orgId,
        is_active: true
      });
      
      if (!proceso) {
        return res.status(404).json({
          status: 'error',
          message: 'Proceso no encontrado'
        });
      }
      
      // Soft delete
      proceso.is_active = false;
      proceso.updated_by = userId;
      await proceso.save();
      
      console.log(`✅ Proceso SGC eliminado: ${proceso.nombre}`);
      res.json({
        status: 'success',
        message: 'Proceso SGC eliminado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al eliminar proceso SGC:', error);
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Error al eliminar proceso SGC',
        error: error.message
      });
    }
  }
  
  /**
   * Obtener dashboard de estadísticas SGC de procesos
   */
  async getDashboardSGC(req, res) {
    try {
      const orgId = req.user?.organization_id || 2;
      console.log('📊 Obteniendo dashboard SGC de procesos');
      
      const [
        resumenResult,
        tiposResult,
        cumplimientoResult
      ] = await Promise.all([
        // Resumen general
        Proceso.aggregate([
          { $match: { organization_id: orgId, is_active: true } },
          {
            $group: {
              _id: null,
              total_procesos: { $sum: 1 },
              activos: { $sum: { $cond: [{ $eq: ['$estado', 'activo'] }, 1, 0] } },
              estrategicos: { $sum: { $cond: [{ $eq: ['$tipo', 'estrategico'] }, 1, 0] } },
              operativos: { $sum: { $cond: [{ $eq: ['$tipo', 'operativo'] }, 1, 0] } },
              apoyo: { $sum: { $cond: [{ $eq: ['$tipo', 'apoyo'] }, 1, 0] } }
            }
          }
        ]),
        
        // Distribución por tipos
        Proceso.aggregate([
          { $match: { organization_id: orgId, is_active: true } },
          {
            $group: {
              _id: { tipo: '$tipo', categoria: '$categoria' },
              cantidad: { $sum: 1 }
            }
          },
          { $sort: { cantidad: -1 } }
        ]),
        
        // Cumplimiento de normas (placeholder)
        Promise.resolve([])
      ]);
      
      const dashboard = {
        resumen: resumenResult[0] || {
          total_procesos: 0,
          activos: 0,
          estrategicos: 0,
          operativos: 0,
          apoyo: 0
        },
        distribucion_tipos: tiposResult || [],
        cumplimiento_normas: cumplimientoResult || []
      };
      
      res.json({
        status: 'success',
        data: dashboard,
        message: 'Dashboard SGC procesos obtenido exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al obtener dashboard SGC:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener dashboard SGC',
        error: error.message
      });
    }
  }
}

module.exports = new ProcesosController();
