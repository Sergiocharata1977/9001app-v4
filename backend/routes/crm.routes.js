const express = require('express');
const tursoClient = require('../lib/tursoClient.js');
const { auditMiddleware, auditActions, resourceTypes } = require('../middleware/auditMiddleware.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const crypto = require('crypto');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// ===============================================
// RUTAS PARA CLIENTES
// ===============================================

// GET /api/crm/clientes - Obtener todos los clientes
router.get('/clientes', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('📋 Obteniendo clientes para organización:', orgId);
    
    const result = await tursoClient.execute({
      sql: `SELECT c.*, 
            v.nombre as vendedor_nombre, v.email as vendedor_email,
            s.nombre as supervisor_nombre
            FROM clientes c
            LEFT JOIN personal v ON c.vendedor_asignado_id = v.id
            LEFT JOIN personal s ON c.supervisor_comercial_id = s.id
            WHERE c.organization_id = ? AND c.is_active = 1
            ORDER BY c.nombre`,
      args: [orgId]
    });
    
    console.log(`✅ Encontrados ${result.rows.length} clientes`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} clientes encontrados`
    });
    
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
});

// GET /api/crm/clientes/:id - Obtener cliente por ID
router.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organization_id;
    
    console.log(`🔍 Obteniendo cliente ${id}`);
    
    const result = await tursoClient.execute({
      sql: `SELECT c.*, 
            v.nombre as vendedor_nombre, v.email as vendedor_email,
            s.nombre as supervisor_nombre
            FROM clientes c
            LEFT JOIN personal v ON c.vendedor_asignado_id = v.id
            LEFT JOIN personal s ON c.supervisor_comercial_id = s.id
            WHERE c.id = ? AND c.organization_id = ? AND c.is_active = 1`,
      args: [id, orgId]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    console.log(`✅ Cliente ${id} encontrado`);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
});

// POST /api/crm/clientes - Crear nuevo cliente
router.post('/clientes', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    const clienteId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const {
      nombre, razon_social, rfc, tipo_cliente, categoria, direccion, ciudad, estado,
      codigo_postal, pais, telefono, email, sitio_web, representante_legal,
      vendedor_asignado_id, supervisor_comercial_id, zona_venta, especialidad_interes, observaciones
    } = req.body;
    
    console.log('➕ Creando nuevo cliente:', nombre);
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO clientes (
        id, organization_id, nombre, razon_social, rfc, tipo_cliente, categoria,
        direccion, ciudad, estado, codigo_postal, pais, telefono, email, sitio_web,
        representante_legal, vendedor_asignado_id, supervisor_comercial_id, zona_venta,
        especialidad_interes, observaciones, created_at, updated_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        clienteId, orgId, nombre, razon_social, rfc, tipo_cliente, categoria,
        direccion, ciudad, estado, codigo_postal, pais, telefono, email, sitio_web,
        representante_legal, vendedor_asignado_id, supervisor_comercial_id, zona_venta,
        especialidad_interes, observaciones, now, now, req.user?.nombre
      ]
    });
    
    console.log(`✅ Cliente creado con ID: ${clienteId}`);
    
    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: { id: clienteId, nombre }
    });
    
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
});

// PUT /api/crm/clientes/:id - Actualizar cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organization_id;
    const now = new Date().toISOString();
    
    const {
      nombre, razon_social, rfc, tipo_cliente, categoria, direccion, ciudad, estado,
      codigo_postal, pais, telefono, email, sitio_web, representante_legal,
      vendedor_asignado_id, supervisor_comercial_id, zona_venta, especialidad_interes, observaciones
    } = req.body;
    
    console.log(`✏️ Actualizando cliente ${id}`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE clientes SET 
        nombre = ?, razon_social = ?, rfc = ?, tipo_cliente = ?, categoria = ?,
        direccion = ?, ciudad = ?, estado = ?, codigo_postal = ?, pais = ?, telefono = ?,
        email = ?, sitio_web = ?, representante_legal = ?, vendedor_asignado_id = ?,
        supervisor_comercial_id = ?, zona_venta = ?, especialidad_interes = ?, observaciones = ?,
        updated_at = ?, updated_by = ?
        WHERE id = ? AND organization_id = ?`,
      args: [
        nombre, razon_social, rfc, tipo_cliente, categoria, direccion, ciudad, estado,
        codigo_postal, pais, telefono, email, sitio_web, representante_legal,
        vendedor_asignado_id, supervisor_comercial_id, zona_venta, especialidad_interes, observaciones,
        now, req.user?.nombre, id, orgId
      ]
    });
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    console.log(`✅ Cliente ${id} actualizado`);
    
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
});

// DELETE /api/crm/clientes/:id - Eliminar cliente (soft delete)
router.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organization_id;
    
    console.log(`🗑️ Eliminando cliente ${id}`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE clientes SET is_active = 0, updated_at = ?, updated_by = ?
            WHERE id = ? AND organization_id = ?`,
      args: [new Date().toISOString(), req.user?.nombre, id, orgId]
    });
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    console.log(`✅ Cliente ${id} eliminado`);
    
    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
});

// ===============================================
// RUTAS PARA OPORTUNIDADES
// ===============================================

// GET /api/crm/oportunidades - Obtener todas las oportunidades
router.get('/oportunidades', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('📋 Obteniendo oportunidades para organización:', orgId);
    
    const result = await tursoClient.execute({
      sql: `SELECT o.*, 
            c.nombre as cliente_nombre, c.tipo_cliente as cliente_tipo,
            v.nombre as vendedor_nombre, v.email as vendedor_email,
            s.nombre as supervisor_nombre
            FROM oportunidades o
            LEFT JOIN clientes c ON o.cliente_id = c.id
            LEFT JOIN personal v ON o.vendedor_id = v.id
            LEFT JOIN personal s ON o.supervisor_id = s.id
            WHERE o.organization_id = ? AND o.is_active = 1
            ORDER BY o.fecha_cierre_esperada DESC, o.created_at DESC`,
      args: [orgId]
    });
    
    console.log(`✅ Encontradas ${result.rows.length} oportunidades`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} oportunidades encontradas`
    });
    
  } catch (error) {
    console.error('Error obteniendo oportunidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener oportunidades',
      error: error.message
    });
  }
});

// GET /api/crm/oportunidades/:id - Obtener oportunidad por ID
router.get('/oportunidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organization_id;
    
    console.log(`🔍 Obteniendo oportunidad ${id}`);
    
    const result = await tursoClient.execute({
      sql: `SELECT o.*, 
            c.nombre as cliente_nombre, c.tipo_cliente as cliente_tipo,
            v.nombre as vendedor_nombre, v.email as vendedor_email,
            s.nombre as supervisor_nombre
            FROM oportunidades o
            LEFT JOIN clientes c ON o.cliente_id = c.id
            LEFT JOIN personal v ON o.vendedor_id = v.id
            LEFT JOIN personal s ON o.supervisor_id = s.id
            WHERE o.id = ? AND o.organization_id = ? AND o.is_active = 1`,
      args: [id, orgId]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad no encontrada'
      });
    }
    
    console.log(`✅ Oportunidad ${id} encontrada`);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error obteniendo oportunidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener oportunidad',
      error: error.message
    });
  }
});

// POST /api/crm/oportunidades - Crear nueva oportunidad
router.post('/oportunidades', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    const oportunidadId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const {
      cliente_id, vendedor_id, supervisor_id, titulo, descripcion, tipo_oportunidad,
      etapa, probabilidad, valor_estimado, moneda, fecha_cierre_esperada,
      productos_servicios, competencia, recursos_requeridos, riesgos, estrategia_venta, observaciones
    } = req.body;
    
    console.log('➕ Creando nueva oportunidad:', titulo);
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO oportunidades (
        id, organization_id, cliente_id, vendedor_id, supervisor_id, titulo, descripcion,
        tipo_oportunidad, etapa, probabilidad, valor_estimado, moneda, fecha_cierre_esperada,
        productos_servicios, competencia, recursos_requeridos, riesgos, estrategia_venta,
        observaciones, created_at, updated_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        oportunidadId, orgId, cliente_id, vendedor_id, supervisor_id, titulo, descripcion,
        tipo_oportunidad, etapa, probabilidad, valor_estimado, moneda, fecha_cierre_esperada,
        productos_servicios, competencia, recursos_requeridos, riesgos, estrategia_venta,
        observaciones, now, now, req.user?.nombre
      ]
    });
    
    console.log(`✅ Oportunidad creada con ID: ${oportunidadId}`);
    
    res.status(201).json({
      success: true,
      message: 'Oportunidad creada exitosamente',
      data: { id: oportunidadId, titulo }
    });
    
  } catch (error) {
    console.error('Error creando oportunidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear oportunidad',
      error: error.message
    });
  }
});

// PUT /api/crm/oportunidades/:id - Actualizar oportunidad
router.put('/oportunidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user?.organization_id;
    const now = new Date().toISOString();
    
    const {
      cliente_id, vendedor_id, supervisor_id, titulo, descripcion, tipo_oportunidad,
      etapa, probabilidad, valor_estimado, moneda, fecha_cierre_esperada,
      productos_servicios, competencia, recursos_requeridos, riesgos, estrategia_venta, observaciones
    } = req.body;
    
    console.log(`✏️ Actualizando oportunidad ${id}`);
    
    const result = await tursoClient.execute({
      sql: `UPDATE oportunidades SET 
        cliente_id = ?, vendedor_id = ?, supervisor_id = ?, titulo = ?, descripcion = ?,
        tipo_oportunidad = ?, etapa = ?, probabilidad = ?, valor_estimado = ?, moneda = ?,
        fecha_cierre_esperada = ?, productos_servicios = ?, competencia = ?,
        recursos_requeridos = ?, riesgos = ?, estrategia_venta = ?, observaciones = ?,
        updated_at = ?, updated_by = ?
        WHERE id = ? AND organization_id = ?`,
      args: [
        cliente_id, vendedor_id, supervisor_id, titulo, descripcion, tipo_oportunidad,
        etapa, probabilidad, valor_estimado, moneda, fecha_cierre_esperada,
        productos_servicios, competencia, recursos_requeridos, riesgos, estrategia_venta, observaciones,
        now, req.user?.nombre, id, orgId
      ]
    });
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad no encontrada'
      });
    }
    
    console.log(`✅ Oportunidad ${id} actualizada`);
    
    res.json({
      success: true,
      message: 'Oportunidad actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('Error actualizando oportunidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar oportunidad',
      error: error.message
    });
  }
});

// ===============================================
// RUTAS PARA ACTIVIDADES CRM
// ===============================================

// GET /api/crm/actividades - Obtener todas las actividades
router.get('/actividades', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('📋 Obteniendo actividades CRM para organización:', orgId);
    
    const result = await tursoClient.execute({
      sql: `SELECT a.*, 
            c.nombre as cliente_nombre,
            o.titulo as oportunidad_titulo,
            v.nombre as vendedor_nombre, v.email as vendedor_email
            FROM actividades_crm a
            LEFT JOIN clientes c ON a.cliente_id = c.id
            LEFT JOIN oportunidades o ON a.oportunidad_id = o.id
            LEFT JOIN personal v ON a.vendedor_id = v.id
            WHERE a.organization_id = ? AND a.is_active = 1
            ORDER BY a.fecha_actividad DESC, a.created_at DESC`,
      args: [orgId]
    });
    
    console.log(`✅ Encontradas ${result.rows.length} actividades`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} actividades encontradas`
    });
    
  } catch (error) {
    console.error('Error obteniendo actividades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener actividades',
      error: error.message
    });
  }
});

// POST /api/crm/actividades - Crear nueva actividad
router.post('/actividades', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    const actividadId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const {
      oportunidad_id, cliente_id, vendedor_id, tipo_actividad, titulo, descripcion,
      fecha_actividad, duracion_minutos, estado, resultado, proxima_accion,
      fecha_proxima_accion, prioridad, ubicacion, participantes, observaciones
    } = req.body;
    
    console.log('➕ Creando nueva actividad:', titulo);
    
    const result = await tursoClient.execute({
      sql: `INSERT INTO actividades_crm (
        id, organization_id, oportunidad_id, cliente_id, vendedor_id, tipo_actividad,
        titulo, descripcion, fecha_actividad, duracion_minutos, estado, resultado,
        proxima_accion, fecha_proxima_accion, prioridad, ubicacion, participantes,
        observaciones, created_at, updated_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        actividadId, orgId, oportunidad_id, cliente_id, vendedor_id, tipo_actividad,
        titulo, descripcion, fecha_actividad, duracion_minutos, estado, resultado,
        proxima_accion, fecha_proxima_accion, prioridad, ubicacion, participantes,
        observaciones, now, now, req.user?.nombre
      ]
    });
    
    console.log(`✅ Actividad creada con ID: ${actividadId}`);
    
    res.status(201).json({
      success: true,
      message: 'Actividad creada exitosamente',
      data: { id: actividadId, titulo }
    });
    
  } catch (error) {
    console.error('Error creando actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear actividad',
      error: error.message
    });
  }
});

// ===============================================
// RUTAS PARA MÉTRICAS Y ESTADÍSTICAS
// ===============================================

// GET /api/crm/estadisticas - Obtener estadísticas generales
router.get('/estadisticas', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('📊 Obteniendo estadísticas CRM para organización:', orgId);
    
    // Estadísticas de clientes
    const clientesStats = await tursoClient.execute({
      sql: `SELECT 
        COUNT(*) as total_clientes,
        SUM(CASE WHEN tipo_cliente = 'potencial' THEN 1 ELSE 0 END) as clientes_potenciales,
        SUM(CASE WHEN tipo_cliente = 'activo' THEN 1 ELSE 0 END) as clientes_activos,
        SUM(CASE WHEN tipo_cliente = 'inactivo' THEN 1 ELSE 0 END) as clientes_inactivos
        FROM clientes WHERE organization_id = ? AND is_active = 1`,
      args: [orgId]
    });
    
    // Estadísticas de oportunidades
    const oportunidadesStats = await tursoClient.execute({
      sql: `SELECT 
        COUNT(*) as total_oportunidades,
        SUM(CASE WHEN etapa NOT IN ('cerrada_ganada', 'cerrada_perdida') THEN 1 ELSE 0 END) as oportunidades_activas,
        SUM(CASE WHEN etapa = 'cerrada_ganada' THEN 1 ELSE 0 END) as oportunidades_ganadas,
        SUM(CASE WHEN etapa = 'cerrada_perdida' THEN 1 ELSE 0 END) as oportunidades_perdidas,
        SUM(valor_estimado) as valor_total_ventas,
        SUM(CASE WHEN etapa NOT IN ('cerrada_ganada', 'cerrada_perdida') THEN valor_estimado ELSE 0 END) as valor_pipeline
        FROM oportunidades WHERE organization_id = ? AND is_active = 1`,
      args: [orgId]
    });
    
    // Estadísticas de actividades
    const actividadesStats = await tursoClient.execute({
      sql: `SELECT 
        COUNT(*) as total_actividades,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as actividades_completadas,
        SUM(CASE WHEN estado IN ('programada', 'en_proceso') THEN 1 ELSE 0 END) as actividades_pendientes
        FROM actividades_crm WHERE organization_id = ? AND is_active = 1`,
      args: [orgId]
    });
    
    const stats = {
      ...clientesStats.rows[0],
      ...oportunidadesStats.rows[0],
      ...actividadesStats.rows[0],
      tasa_conversion_global: oportunidadesStats.rows[0].total_oportunidades > 0 
        ? (oportunidadesStats.rows[0].oportunidades_ganadas / oportunidadesStats.rows[0].total_oportunidades) * 100 
        : 0
    };
    
    console.log('✅ Estadísticas obtenidas');
    
    res.json({
      success: true,
      data: stats,
      message: 'Estadísticas obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;

// ===============================================
// RUTAS PARA VENDEDORES DEL PERSONAL ESTANDARIZADO
// ===============================================

// GET /api/crm/vendedores - Obtener vendedores del personal
router.get('/vendedores', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('👥 Obteniendo vendedores para organización:', orgId);
    
    // Obtener personal que sea comercial o tenga rol de vendedor
    const result = await tursoClient.execute({
      sql: `SELECT p.*, 
            COUNT(DISTINCT c.id) as total_clientes,
            COUNT(DISTINCT o.id) as oportunidades_activas,
            COALESCE(SUM(CASE WHEN o.etapa = 'cerrada_ganada' THEN o.valor_estimado ELSE 0 END), 0) as ventas_mes,
            COALESCE(AVG(CASE WHEN o.etapa = 'cerrada_ganada' THEN o.probabilidad ELSE NULL END), 0) as rendimiento
            FROM personal p
            LEFT JOIN clientes c ON p.id = c.vendedor_asignado_id AND c.is_active = 1
            LEFT JOIN oportunidades o ON p.id = o.vendedor_id AND o.is_active = 1
            WHERE p.organization_id = ? 
            AND (p.puesto LIKE '%comercial%' OR p.puesto LIKE '%vendedor%' OR p.departamento LIKE '%ventas%')
            GROUP BY p.id
            ORDER BY p.nombre`,
      args: [orgId]
    });
    
    console.log(`✅ Encontrados ${result.rows.length} vendedores`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} vendedores encontrados`
    });
    
  } catch (error) {
    console.error('Error obteniendo vendedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedores',
      error: error.message
    });
  }
});

// GET /api/crm/personal/comercial - Obtener personal comercial
router.get('/personal/comercial', async (req, res) => {
  try {
    const orgId = req.user?.organization_id;
    console.log('👥 Obteniendo personal comercial para organización:', orgId);
    
    const result = await tursoClient.execute({
      sql: `SELECT p.*, 
            COUNT(DISTINCT c.id) as total_clientes,
            COUNT(DISTINCT o.id) as oportunidades_activas
            FROM personal p
            LEFT JOIN clientes c ON p.id = c.vendedor_asignado_id AND c.is_active = 1
            LEFT JOIN oportunidades o ON p.id = o.vendedor_id AND o.is_active = 1
            WHERE p.organization_id = ? 
            AND (p.puesto LIKE '%comercial%' OR p.puesto LIKE '%vendedor%' OR p.departamento LIKE '%ventas%')
            GROUP BY p.id
            ORDER BY p.nombre`,
      args: [orgId]
    });
    
    console.log(`✅ Encontrados ${result.rows.length} comerciales`);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: `${result.rows.length} comerciales encontrados`
    });
    
  } catch (error) {
    console.error('Error obteniendo personal comercial:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener personal comercial',
      error: error.message
    });
  }
});
