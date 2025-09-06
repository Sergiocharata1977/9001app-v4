const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const procesosController = require('../controllers/procesosController.js');
const { validateProcesoFiltros, validateProcesoId } = require('../validators/procesosValidator.js');

const router = express.Router();

// ===============================================
// RUTAS PROCESOS SGC - MONGODB
// Sistema de Gestión de Calidad ISO 9001
// ===============================================

// Middleware de validación para filtros
const validateFiltros = (req, res, next) => {
  const { error } = validateProcesoFiltros(req.query);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Filtros de búsqueda inválidos',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Middleware de validación para ID
const validateId = (req, res, next) => {
  const { error } = validateProcesoId(req.params.id);
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'ID de proceso inválido',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// ===============================================
// ENDPOINTS PRINCIPALES
// ===============================================

// GET /api/procesos-mongodb - Obtener todos los procesos con filtros
router.get('/', authMiddleware, validateFiltros, procesosController.getAllProcesos);

// GET /api/procesos-mongodb/:id - Obtener proceso por ID
router.get('/:id', authMiddleware, validateId, procesosController.getProcesoById);

// POST /api/procesos-mongodb - Crear nuevo proceso
router.post('/', authMiddleware, procesosController.createProceso);

// PUT /api/procesos-mongodb/:id - Actualizar proceso
router.put('/:id', authMiddleware, validateId, procesosController.updateProceso);

// DELETE /api/procesos-mongodb/:id - Eliminar proceso (soft delete)
router.delete('/:id', authMiddleware, validateId, procesosController.deleteProceso);

// GET /api/procesos-mongodb/dashboard/sgc - Dashboard estadísticas SGC
router.get('/dashboard/sgc', authMiddleware, procesosController.getDashboardSGC);

// ===============================================
// ENDPOINTS DE BÚSQUEDA AVANZADA
// ===============================================

// GET /api/procesos-mongodb/search/advanced - Búsqueda avanzada
router.get('/search/advanced', authMiddleware, validateFiltros, async (req, res) => {
  try {
    const orgId = req.user?.organization_id || 2;
    const { search, tipo, categoria, estado, nivel_critico, departamento_id, responsable_id, limit = 20, page = 1 } = req.query;
    
    console.log('🔍 Búsqueda avanzada de procesos SGC:', { search, tipo, categoria, estado });
    
    // Construir filtros de búsqueda
    const filtros = { organization_id: orgId, is_active: true };
    
    if (search) {
      filtros.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { objetivo: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tipo) filtros.tipo = tipo;
    if (categoria) filtros.categoria = categoria;
    if (estado) filtros.estado = estado;
    if (nivel_critico) filtros.nivel_critico = nivel_critico;
    if (departamento_id) filtros.departamento_id = departamento_id;
    if (responsable_id) filtros.responsable_id = responsable_id;
    
    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Ejecutar búsqueda
    const [procesos, total] = await Promise.all([
      Proceso.find(filtros)
        .populate('responsable_id', 'nombre_completo puesto')
        .populate('departamento_id', 'nombre')
        .populate('supervisor_id', 'nombre_completo')
        .sort({ codigo: 1, nombre: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Proceso.countDocuments(filtros)
    ]);
    
    // Agregar contadores SGC
    const procesosConContadores = await Promise.all(
      procesos.map(async (proceso) => {
        const procesoObj = proceso.toPublicJSON();
        procesoObj.total_participantes = 0;
        procesoObj.total_documentos = 0;
        procesoObj.total_normas = 0;
        return procesoObj;
      })
    );
    
    console.log(`✅ Búsqueda avanzada completada: ${procesosConContadores.length} resultados`);
    res.json({
      status: 'success',
      data: procesosConContadores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      message: 'Búsqueda avanzada completada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en búsqueda avanzada:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en búsqueda avanzada',
      error: error.message
    });
  }
});

// GET /api/procesos-mongodb/export/csv - Exportar procesos a CSV
router.get('/export/csv', authMiddleware, async (req, res) => {
  try {
    const orgId = req.user?.organization_id || 2;
    console.log('📊 Exportando procesos SGC a CSV');
    
    const procesos = await Proceso.findByOrganization(orgId)
      .populate('responsable_id', 'nombre_completo')
      .populate('departamento_id', 'nombre')
      .sort({ codigo: 1, nombre: 1 });
    
    // Generar CSV
    const csvHeaders = [
      'Código',
      'Nombre',
      'Descripción',
      'Tipo',
      'Categoría',
      'Nivel Crítico',
      'Estado',
      'Responsable',
      'Departamento',
      'Versión',
      'Fecha Creación'
    ];
    
    const csvRows = procesos.map(proceso => [
      proceso.codigo,
      proceso.nombre,
      proceso.descripcion || '',
      proceso.tipo,
      proceso.categoria,
      proceso.nivel_critico,
      proceso.estado,
      proceso.responsable_id?.nombre_completo || '',
      proceso.departamento_id?.nombre || '',
      proceso.version,
      new Date(proceso.created_at).toLocaleDateString('es-ES')
    ]);
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="procesos-sgc-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
    
    console.log(`✅ Exportación CSV completada: ${procesos.length} procesos`);
  } catch (error) {
    console.error('❌ Error en exportación CSV:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en exportación CSV',
      error: error.message
    });
  }
});

// ===============================================
// ENDPOINTS DE ESTADÍSTICAS
// ===============================================

// GET /api/procesos-mongodb/stats/summary - Resumen estadístico
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const orgId = req.user?.organization_id || 2;
    console.log('📈 Obteniendo resumen estadístico de procesos');
    
    const stats = await Proceso.aggregate([
      { $match: { organization_id: orgId, is_active: true } },
      {
        $group: {
          _id: null,
          total_procesos: { $sum: 1 },
          por_tipo: {
            $push: {
              tipo: '$tipo',
              categoria: '$categoria',
              nivel_critico: '$nivel_critico'
            }
          },
          por_estado: {
            $push: '$estado'
          }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.json({
        status: 'success',
        data: {
          total_procesos: 0,
          distribucion_tipos: [],
          distribucion_estados: [],
          distribucion_niveles: []
        },
        message: 'No hay procesos para generar estadísticas'
      });
    }
    
    const stat = stats[0];
    
    // Procesar distribución por tipos
    const distribucionTipos = {};
    stat.por_tipo.forEach(item => {
      const key = `${item.tipo}-${item.categoria}`;
      distribucionTipos[key] = (distribucionTipos[key] || 0) + 1;
    });
    
    // Procesar distribución por estados
    const distribucionEstados = {};
    stat.por_estado.forEach(estado => {
      distribucionEstados[estado] = (distribucionEstados[estado] || 0) + 1;
    });
    
    // Procesar distribución por niveles críticos
    const distribucionNiveles = {};
    stat.por_tipo.forEach(item => {
      distribucionNiveles[item.nivel_critico] = (distribucionNiveles[item.nivel_critico] || 0) + 1;
    });
    
    const resumen = {
      total_procesos: stat.total_procesos,
      distribucion_tipos: Object.entries(distribucionTipos).map(([key, cantidad]) => {
        const [tipo, categoria] = key.split('-');
        return { tipo, categoria, cantidad };
      }),
      distribucion_estados: Object.entries(distribucionEstados).map(([estado, cantidad]) => ({
        estado,
        cantidad
      })),
      distribucion_niveles: Object.entries(distribucionNiveles).map(([nivel, cantidad]) => ({
        nivel,
        cantidad
      }))
    };
    
    res.json({
      status: 'success',
      data: resumen,
      message: 'Resumen estadístico obtenido exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al obtener resumen estadístico:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener resumen estadístico',
      error: error.message
    });
  }
});

// ===============================================
// ENDPOINTS DE MANTENIMIENTO
// ===============================================

// POST /api/procesos-mongodb/bulk-update - Actualización masiva
router.post('/bulk-update', authMiddleware, async (req, res) => {
  try {
    const { ids, updates } = req.body;
    const orgId = req.user?.organization_id || 2;
    const userId = req.user?.id;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere un array de IDs válido'
      });
    }
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Se requieren datos de actualización válidos'
      });
    }
    
    console.log(`🔄 Actualización masiva de ${ids.length} procesos`);
    
    // Validar que todos los procesos pertenezcan a la organización
    const procesos = await Proceso.find({
      id: { $in: ids },
      organization_id: orgId,
      is_active: true
    });
    
    if (procesos.length !== ids.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Algunos procesos no fueron encontrados o no pertenecen a la organización'
      });
    }
    
    // Actualizar todos los procesos
    const result = await Proceso.updateMany(
      { id: { $in: ids }, organization_id: orgId },
      { ...updates, updated_by: userId, updated_at: new Date() }
    );
    
    console.log(`✅ Actualización masiva completada: ${result.modifiedCount} procesos actualizados`);
    res.json({
      status: 'success',
      data: {
        total_procesos: ids.length,
        actualizados: result.modifiedCount
      },
      message: 'Actualización masiva completada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error en actualización masiva:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en actualización masiva',
      error: error.message
    });
  }
});

// POST /api/procesos-mongodb/validate-codes - Validar códigos únicos
router.post('/validate-codes', authMiddleware, async (req, res) => {
  try {
    const { codigos } = req.body;
    const orgId = req.user?.organization_id || 2;
    
    if (!codigos || !Array.isArray(codigos)) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere un array de códigos válido'
      });
    }
    
    console.log(`🔍 Validando ${codigos.length} códigos de procesos`);
    
    // Buscar códigos existentes
    const codigosExistentes = await Proceso.find({
      codigo: { $in: codigos },
      organization_id: orgId,
      is_active: true
    }, 'codigo');
    
    const codigosDuplicados = codigosExistentes.map(p => p.codigo);
    const codigosValidos = codigos.filter(codigo => !codigosDuplicados.includes(codigo));
    
    res.json({
      status: 'success',
      data: {
        total_codigos: codigos.length,
        codigos_validos: codigosValidos,
        codigos_duplicados: codigosDuplicados
      },
      message: 'Validación de códigos completada'
    });
  } catch (error) {
    console.error('❌ Error en validación de códigos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en validación de códigos',
      error: error.message
    });
  }
});

module.exports = router;
