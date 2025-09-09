import { Router } from 'express';
import { Request, Response } from 'express';
import { Proceso } from '../models/Proceso.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateOrganization } from '../middleware/organization.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);
router.use(validateOrganization);

/**
 * @route GET /api/procesos-abm
 * @desc Obtener todos los procesos (definiciones escritas)
 * @access Private
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      tipo = '', 
      categoria = '', 
      estado = '',
      nivel_critico = '',
      departamento_id = '',
      responsable_id = ''
    } = req.query;

    // Construir filtros
    const filtros: any = {
      organization_id: parseInt(organization_id),
      is_active: true
    };

    if (search) {
      filtros.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    if (tipo) filtros.tipo = tipo;
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;
    if (nivel_critico) filtros.nivel_critico = nivel_critico;
    if (departamento_id) filtros.departamento_id = departamento_id;
    if (responsable_id) filtros.responsable_id = responsable_id;

    // Paginación
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    // Ejecutar consulta con población
    const procesos = await Proceso.find(filtros)
      .populate('responsable_id', 'nombre apellido email')
      .populate('departamento_id', 'nombre descripcion')
      .populate('supervisor_id', 'nombre apellido email')
      .populate('created_by', 'nombre email')
      .populate('updated_by', 'nombre email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum);

    // Contar total
    const total = await Proceso.countDocuments(filtros);

    res.json({
      success: true,
      data: procesos,
      pagination: {
        page: parseInt(page as string),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error al obtener procesos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route GET /api/procesos-abm/:id
 * @desc Obtener un proceso específico
 * @access Private
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;
    const { id } = req.params;

    const proceso = await Proceso.findOne({
      _id: id,
      organization_id: parseInt(organization_id),
      is_active: true
    })
    .populate('responsable_id', 'nombre apellido email')
    .populate('departamento_id', 'nombre descripcion')
    .populate('supervisor_id', 'nombre apellido email')
    .populate('created_by', 'nombre email')
    .populate('updated_by', 'nombre email');

    if (!proceso) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado'
      });
    }

    res.json({
      success: true,
      data: proceso
    });

  } catch (error) {
    console.error('Error al obtener proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route POST /api/procesos-abm
 * @desc Crear un nuevo proceso
 * @access Private
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const procesoData = {
      ...req.body,
      organization_id: parseInt(organization_id),
      created_by: user_id,
      updated_by: user_id
    };

    // Generar código automático si no se proporciona
    if (!procesoData.codigo) {
      const count = await Proceso.countDocuments({ organization_id: parseInt(organization_id) });
      procesoData.codigo = `PROC-${String(count + 1).padStart(4, '0')}`;
    }

    const nuevoProceso = new Proceso(procesoData);
    await nuevoProceso.save();

    // Poblar datos relacionados
    await nuevoProceso.populate([
      { path: 'responsable_id', select: 'nombre apellido email' },
      { path: 'departamento_id', select: 'nombre descripcion' },
      { path: 'supervisor_id', select: 'nombre apellido email' },
      { path: 'created_by', select: 'nombre email' },
      { path: 'updated_by', select: 'nombre email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Proceso creado exitosamente',
      data: nuevoProceso
    });

  } catch (error) {
    console.error('Error al crear proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route PUT /api/procesos-abm/:id
 * @desc Actualizar un proceso existente
 * @access Private
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: user_id,
      updated_at: new Date()
    };

    const proceso = await Proceso.findOneAndUpdate(
      {
        _id: id,
        organization_id: parseInt(organization_id),
        is_active: true
      },
      updateData,
      { new: true, runValidators: true }
    )
    .populate('responsable_id', 'nombre apellido email')
    .populate('departamento_id', 'nombre descripcion')
    .populate('supervisor_id', 'nombre apellido email')
    .populate('created_by', 'nombre email')
    .populate('updated_by', 'nombre email');

    if (!proceso) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proceso actualizado exitosamente',
      data: proceso
    });

  } catch (error) {
    console.error('Error al actualizar proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route DELETE /api/procesos-abm/:id
 * @desc Eliminar un proceso (soft delete)
 * @access Private
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.user;
    const { id } = req.params;

    const proceso = await Proceso.findOneAndUpdate(
      {
        _id: id,
        organization_id: parseInt(organization_id),
        is_active: true
      },
      {
        is_active: false,
        updated_by: user_id,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!proceso) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proceso eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @route GET /api/procesos-abm/dashboard/estadisticas
 * @desc Obtener estadísticas de procesos
 * @access Private
 */
router.get('/dashboard/estadisticas', async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.user;

    const estadisticas = await Proceso.aggregate([
      {
        $match: {
          organization_id: parseInt(organization_id),
          is_active: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          por_tipo: {
            $push: {
              tipo: '$tipo',
              categoria: '$categoria',
              estado: '$estado',
              nivel_critico: '$nivel_critico'
            }
          }
        }
      }
    ]);

    // Procesar estadísticas
    const stats = estadisticas[0] || { total: 0, por_tipo: [] };
    
    const resumen = {
      total: stats.total,
      por_tipo: stats.por_tipo.reduce((acc: any, item: any) => {
        acc[item.tipo] = (acc[item.tipo] || 0) + 1;
        return acc;
      }, {}),
      por_categoria: stats.por_tipo.reduce((acc: any, item: any) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + 1;
        return acc;
      }, {}),
      por_estado: stats.por_tipo.reduce((acc: any, item: any) => {
        acc[item.estado] = (acc[item.estado] || 0) + 1;
        return acc;
      }, {}),
      por_nivel_critico: stats.por_tipo.reduce((acc: any, item: any) => {
        acc[item.nivel_critico] = (acc[item.nivel_critico] || 0) + 1;
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


