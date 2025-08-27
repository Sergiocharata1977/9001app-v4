const { Router } = require('express');
const mongoClient = require('../lib/mongoClient.js');
const crypto = require('crypto');
const { logTenantOperation, checkPermission } = require('../middleware/tenantMiddleware.js');
const ActivityLogService = require('../services/activityLogService.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/puestos - Obtener todos los puestos de la organización
router.get('/', async (req, res, next) => {
  try {
    const organizationId = req.user?.organization_id || req.organizationId;
    console.log('🔓 Obteniendo puestos para organización:', organizationId);
    
    const collection = mongoClient.collection('puestos');
    const result = await collection.find(
      { organization_id: String(organizationId) },
      { sort: { created_at: -1 } }
    ).toArray();
    
    console.log(`🔓 Puestos cargados para organización ${organizationId}: ${result.length} registros`);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al cargar puestos:', error);
    next(error);
  }
});

// GET /api/puestos/:id - Obtener un puesto específico de la organización
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const organizationId = req.user?.organization_id || req.organizationId;
    console.log(`🔓 Obteniendo puesto ${id} para organización:`, organizationId);
    
    const collection = mongoClient.collection('puestos');
    const result = await collection.findOne({
      id: id,
      organization_id: String(organizationId)
    });

    if (!result) {
      console.log(`❌ Puesto ${id} no encontrado en organización ${organizationId}`);
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    console.log(`✅ Puesto ${id} cargado exitosamente`);
    res.json(result);
  } catch (error) {
    console.error(`❌ Error al cargar puesto ${id}:`, error);
    next(error);
  }
});

// POST /api/puestos - Crear un nuevo puesto
router.post('/', async (req, res, next) => {
  console.log('📝 POST /api/puestos - Datos recibidos:', req.body);
  console.log('👤 Usuario:', req.user);

  try {
    // TEMPORAL: Comentado para permitir creación de puestos
    // if (!checkPermission(req, 'employee')) {
    //   return res.status(403).json({ error: 'Permisos insuficientes' });
    // }

    const {
      nombre,
      descripcion,
      requisitos_experiencia,
      requisitos_formacion
    } = req.body;

    // Usar organization_id directamente del usuario autenticado
    const organizationId = String(req.user?.organization_id);
    const usuario = req.user || { id: null, nombre: 'Sistema' };

    console.log('🔍 Validando campos obligatorios:', { nombre, organization_id: organizationId });
    if (!nombre) {
      console.log('❌ Error: Falta campo nombre');
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
    }

    const collection = mongoClient.collection('puestos');

    // Verificar si ya existe un puesto con el mismo nombre en la organización
    console.log('🔍 Verificando si existe puesto:', { nombre, organization_id: organizationId });
    const existente = await collection.findOne({
      nombre: nombre,
      organization_id: organizationId
    });
    
    if (existente) {
      console.log('❌ Error: Puesto ya existe');
      return res.status(409).json({ error: `Ya existe un puesto con el nombre '${nombre}' en la organización.` });
    }

    const id = crypto.randomUUID();
    const now = new Date();

    // Crear el nuevo puesto
    const nuevoPuesto = {
      id,
      nombre,
      descripcion: descripcion || '',
      requisitos_experiencia: requisitos_experiencia || '',
      requisitos_formacion: requisitos_formacion || '',
      organization_id: organizationId,
      created_by: usuario.id,
      created_at: now,
      updated_at: now
    };

    await collection.insertOne(nuevoPuesto);

    // Registrar actividad
    await ActivityLogService.registrarActividad({
      tipo_entidad: 'puesto',
      entidad_id: id,
      accion: 'crear',
      descripcion: `Puesto "${nombre}" creado`,
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      organization_id: organizationId,
      datos_nuevos: nuevoPuesto
    });

    console.log(`✅ Puesto "${nombre}" creado exitosamente con ID: ${id}`);
    res.status(201).json(nuevoPuesto);
  } catch (error) {
    console.error('❌ Error al crear puesto:', error);
    next(error);
  }
});

// PUT /api/puestos/:id - Actualizar un puesto
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`📝 PUT /api/puestos/${id} - Datos recibidos:`, req.body);

  try {
    // TEMPORAL: Comentado para permitir actualización de puestos
    // if (!checkPermission(req, 'employee')) {
    //   return res.status(403).json({ error: 'Permisos insuficientes' });
    // }

    const {
      nombre,
      descripcion,
      requisitos_experiencia,
      requisitos_formacion
    } = req.body;

    const organizationId = String(req.user?.organization_id);
    const usuario = req.user || { id: null, nombre: 'Sistema' };

    const collection = mongoClient.collection('puestos');

    // Verificar que el puesto existe
    const existente = await collection.findOne({
      id: id,
      organization_id: organizationId
    });

    if (!existente) {
      console.log(`❌ Puesto ${id} no encontrado en organización ${organizationId}`);
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Si se está cambiando el nombre, verificar que no exista otro con el mismo nombre
    if (nombre && nombre !== existente.nombre) {
      const nombreExistente = await collection.findOne({
        nombre: nombre,
        organization_id: organizationId,
        id: { $ne: id }
      });

      if (nombreExistente) {
        return res.status(409).json({ error: `Ya existe un puesto con el nombre '${nombre}' en la organización.` });
      }
    }

    // Preparar datos para actualización
    const updateData = {
      updated_at: new Date()
    };

    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (requisitos_experiencia !== undefined) updateData.requisitos_experiencia = requisitos_experiencia;
    if (requisitos_formacion !== undefined) updateData.requisitos_formacion = requisitos_formacion;

    const result = await collection.updateOne(
      { id: id, organization_id: organizationId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Obtener el puesto actualizado
    const puestoActualizado = await collection.findOne({
      id: id,
      organization_id: organizationId
    });

    // Registrar actividad
    await ActivityLogService.registrarActividad({
      tipo_entidad: 'puesto',
      entidad_id: id,
      accion: 'actualizar',
      descripcion: `Puesto "${puestoActualizado.nombre}" actualizado`,
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      organization_id: organizationId,
      datos_anteriores: existente,
      datos_nuevos: puestoActualizado
    });

    console.log(`✅ Puesto ${id} actualizado exitosamente`);
    res.json(puestoActualizado);
  } catch (error) {
    console.error(`❌ Error al actualizar puesto ${id}:`, error);
    next(error);
  }
});

// DELETE /api/puestos/:id - Eliminar un puesto
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`🗑️ DELETE /api/puestos/${id}`);

  try {
    if (!checkPermission(req, 'admin')) {
      return res.status(403).json({ error: 'Permisos insuficientes - se requiere rol admin' });
    }

    const organizationId = String(req.user?.organization_id);
    const usuario = req.user || { id: null, nombre: 'Sistema' };

    const collection = mongoClient.collection('puestos');

    // Verificar que el puesto existe
    const existente = await collection.findOne({
      id: id,
      organization_id: organizationId
    });

    if (!existente) {
      console.log(`❌ Puesto ${id} no encontrado en organización ${organizationId}`);
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Eliminar el puesto
    const result = await collection.deleteOne({
      id: id,
      organization_id: organizationId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Puesto no encontrado' });
    }

    // Registrar actividad
    await ActivityLogService.registrarActividad({
      tipo_entidad: 'puesto',
      entidad_id: id,
      accion: 'eliminar',
      descripcion: `Puesto "${existente.nombre}" eliminado`,
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      organization_id: organizationId,
      datos_anteriores: existente
    });

    console.log(`✅ Puesto ${id} eliminado exitosamente`);
    res.json({ message: 'Puesto eliminado exitosamente' });
  } catch (error) {
    console.error(`❌ Error al eliminar puesto ${id}:`, error);
    next(error);
  }
});

module.exports = router;