import { Router } from 'express';
import { Request, Response } from 'express';
import { Registro } from '../models/Registro.js';
import { PlantillaRegistro } from '../models/PlantillaRegistro.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateOrganization } from '../middleware/organization.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);
router.use(validateOrganization);

/**
 * @route GET /api/registros-procesos-abm
 * @desc Obtener todos los registros de procesos (evidencias)
 * @access Private
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      estado = '', 
      prioridad = '',
      responsable_id = '',
      departamento = '',
      fecha_desde = '',
      fecha_hasta = '',
      plantilla_id = ''
    } = req.query;

    // Construir filtros
    const filtros: any = {
      organizacion_id: organization_id,
      'metadata.eliminado': false
    };

    if (search) {
      filtros.$or = [
        { codigo: { $regex: search, $options: 'i' } },
        { 'datos.nombre': { $regex: search, $options: 'i' } },
        { 'datos.descripcion': { $regex: search, $options: 'i' } }
      ];
    }

    if (estado) filtros['estado_actual.estado'] = estado;
    if (prioridad) filtros.prioridad = prioridad;
    if (responsable_id) filtros.responsable_principal = responsable_id;
    if (departamento) filtros.departamento = departamento;
    if (plantilla_id) filtros.plantilla_id = plantilla_id;

    // Filtros de fecha
    if (fecha_desde || fecha_hasta) {
      filtros['metadata.fecha_creacion'] = {};
      if (fecha_desde) filtros['metadata.fecha_creacion'].$gte = new Date(fecha_desde as string);
      if (fecha_hasta) filtros['metadata.fecha_creacion'].$lte = new Date(fecha_hasta as string);
    }

    // Paginación
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Ejecutar consulta con población
    const registros = await Registro.find(filtros)
      .populate('plantilla_id', 'nombre descripcion')
      .populate('responsable_principal', 'nombre apellido email')
      .populate('responsables_secundarios', 'nombre apellido email')
      .populate('observadores', 'nombre apellido email')
      .populate('metadata.creado_por', 'nombre email')
      .populate('metadata.modificado_por', 'nombre email')
      .sort({ 'metadata.fecha_creacion': -1 })
      .skip(skip)
      .limit(limitNum);

    // Contar total
    const total = await Registro.countDocuments(filtros);

    res.json({
      success: true,
      data: registros,
      pagination: {
        page: parseInt(page as string),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error al obtener registros de procesos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route GET /api/registros-procesos-abm/:id
 * @desc Obtener un registro específico
 * @access Private
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;
    const { id } = req.params;

    const registro = await Registro.findOne({
      _id: id,
      organizacion_id: organization_id,
      'metadata.eliminado': false
    })
    .populate('plantilla_id', 'nombre descripcion campos')
    .populate('responsable_principal', 'nombre apellido email')
    .populate('responsables_secundarios', 'nombre apellido email')
    .populate('observadores', 'nombre apellido email')
    .populate('metadata.creado_por', 'nombre email')
    .populate('metadata.modificado_por', 'nombre email')
    .populate('historial_estados.usuario', 'nombre email')
    .populate('comentarios.usuario', 'nombre email')
    .populate('actividad.usuario', 'nombre email');

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    res.json({
      success: true,
      data: registro
    });

  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route POST /api/registros-procesos-abm
 * @desc Crear un nuevo registro de proceso
 * @access Private
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const registroData = {
      ...req.body,
      organizacion_id: organization_id,
      metadata: {
        ...req.body.metadata,
        creado_por: user_id,
        fecha_creacion: new Date(),
        eliminado: false
      }
    };

    // Generar código automático si no se proporciona
    if (!registroData.codigo) {
      const count = await Registro.countDocuments({ organizacion_id: organization_id });
      registroData.codigo = `REG-${String(count + 1).padStart(6, '0')}`;
    }

    // Inicializar estado si no se proporciona
    if (!registroData.estado_actual) {
      registroData.estado_actual = {
        estado: 'borrador',
        fecha_cambio: new Date(),
        usuario: user_id,
        comentario: 'Registro creado'
      };
    }

    const nuevoRegistro = new Registro(registroData);
    await nuevoRegistro.save();

    // Poblar datos relacionados
    await nuevoRegistro.populate([
      { path: 'plantilla_id', select: 'nombre descripcion' },
      { path: 'responsable_principal', select: 'nombre apellido email' },
      { path: 'responsables_secundarios', select: 'nombre apellido email' },
      { path: 'observadores', select: 'nombre apellido email' },
      { path: 'metadata.creado_por', select: 'nombre email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Registro creado exitosamente',
      data: nuevoRegistro
    });

  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route PUT /api/registros-procesos-abm/:id
 * @desc Actualizar un registro existente
 * @access Private
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const { id } = req.params;
    const updateData = {
      ...req.body,
      'metadata.modificado_por': user_id,
      'metadata.fecha_modificacion': new Date()
    };

    const registro = await Registro.findOneAndUpdate(
      {
        _id: id,
        organizacion_id: organization_id,
        'metadata.eliminado': false
      },
      updateData,
      { new: true, runValidators: true }
    )
    .populate('plantilla_id', 'nombre descripcion')
    .populate('responsable_principal', 'nombre apellido email')
    .populate('responsables_secundarios', 'nombre apellido email')
    .populate('observadores', 'nombre apellido email')
    .populate('metadata.creado_por', 'nombre email')
    .populate('metadata.modificado_por', 'nombre email');

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Registro actualizado exitosamente',
      data: registro
    });

  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route DELETE /api/registros-procesos-abm/:id
 * @desc Eliminar un registro (soft delete)
 * @access Private
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const { id } = req.params;

    const registro = await Registro.findOneAndUpdate(
      {
        _id: id,
        organizacion_id: organization_id,
        'metadata.eliminado': false
      },
      {
        'metadata.eliminado': true,
        'metadata.fecha_eliminacion': new Date(),
        'metadata.eliminado_por': user_id
      },
      { new: true }
    );

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Registro eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route PUT /api/registros-procesos-abm/:id/cambiar-estado
 * @desc Cambiar estado de un registro
 * @access Private
 */
router.put('/:id/cambiar-estado', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const { id } = req.params;
    const { nuevo_estado, comentario } = req.body;

    const registro = await Registro.findOne({
      _id: id,
      organizacion_id: organization_id,
      'metadata.eliminado': false
    });

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    // Cambiar estado usando el método del modelo
    await registro.cambiarEstado(nuevo_estado, comentario, user_id);

    // Poblar datos relacionados
    await registro.populate([
      { path: 'plantilla_id', select: 'nombre descripcion' },
      { path: 'responsable_principal', select: 'nombre apellido email' },
      { path: 'historial_estados.usuario', select: 'nombre email' }
    ]);

    res.json({
      success: true,
      message: 'Estado cambiado exitosamente',
      data: registro
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route GET /api/registros-procesos-abm/dashboard/estadisticas
 * @desc Obtener estadísticas de registros
 * @access Private
 */
router.get('/dashboard/estadisticas', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;

    const estadisticas = await Registro.aggregate([
      {
        $match: {
          organizacion_id: organization_id,
          'metadata.eliminado': false
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          por_estado: {
            $push: '$estado_actual.estado'
          },
          por_prioridad: {
            $push: '$prioridad'
          },
          por_departamento: {
            $push: '$departamento'
          }
        }
      }
    ]);

    // Procesar estadísticas
    const stats = estadisticas[0] || { total: 0, por_estado: [], por_prioridad: [], por_departamento: [] };
    
    const resumen = {
      total: stats.total,
      por_estado: stats.por_estado.reduce((acc: any, estado: string) => {
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {}),
      por_prioridad: stats.por_prioridad.reduce((acc: any, prioridad: string) => {
        acc[prioridad] = (acc[prioridad] || 0) + 1;
        return acc;
      }, {}),
      por_departamento: stats.por_departamento.reduce((acc: any, dept: string) => {
        if (dept) acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: resumen
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;


