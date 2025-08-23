-- ===============================================
-- MIGRACIÓN: REDISEÑO COMPLETO DEL CRM AGRO
-- Fecha: 2024-12-22
-- Propósito: Implementar CRM especializado para empresas agro
-- ===============================================

-- ===============================================
-- 1. ELIMINACIÓN DE TABLAS ACTUALES DEL CRM
-- ===============================================

-- Eliminar índices primero
DROP INDEX IF EXISTS idx_clientes_organization;
DROP INDEX IF EXISTS idx_clientes_vendedor;
DROP INDEX IF EXISTS idx_clientes_tipo;
DROP INDEX IF EXISTS idx_clientes_categoria;

DROP INDEX IF EXISTS idx_oportunidades_organization;
DROP INDEX IF EXISTS idx_oportunidades_cliente;
DROP INDEX IF EXISTS idx_oportunidades_vendedor;
DROP INDEX IF EXISTS idx_oportunidades_etapa;
DROP INDEX IF EXISTS idx_oportunidades_fecha_cierre;

DROP INDEX IF EXISTS idx_actividades_organization;
DROP INDEX IF EXISTS idx_actividades_oportunidad;
DROP INDEX IF EXISTS idx_actividades_cliente;
DROP INDEX IF EXISTS idx_actividades_vendedor;
DROP INDEX IF EXISTS idx_actividades_fecha;
DROP INDEX IF EXISTS idx_actividades_estado;

DROP INDEX IF EXISTS idx_metricas_vendedor_periodo;

-- Eliminar tablas del CRM actual
DROP TABLE IF EXISTS metricas_vendedores;
DROP TABLE IF EXISTS productos_oportunidad;
DROP TABLE IF EXISTS actividades_crm;
DROP TABLE IF EXISTS oportunidades;
DROP TABLE IF EXISTS clientes;

-- ===============================================
-- 2. CREACIÓN DE NUEVAS TABLAS CRM AGRO
-- ===============================================

-- Tabla principal de clientes agro
CREATE TABLE clientes_agro (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  
  -- Información básica
  nombre TEXT NOT NULL,
  razon_social TEXT,
  rfc TEXT,
  tipo_cliente TEXT DEFAULT 'mediano' CHECK (tipo_cliente IN ('pequeno', 'mediano', 'grande', 'cooperativa', 'distribuidor')),
  
  -- Clasificación agro
  categoria_agro TEXT DEFAULT 'C' CHECK (categoria_agro IN ('A', 'B', 'C', 'D')),
  zona_geografica TEXT,
  clima_zona TEXT,
  tipo_suelo TEXT,
  
  -- Información de contacto
  direccion TEXT,
  ciudad TEXT,
  estado TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'México',
  telefono TEXT,
  email TEXT,
  sitio_web TEXT,
  representante_legal TEXT,
  
  -- Datos agro específicos
  superficie_total REAL, -- en hectáreas
  cultivos_principales TEXT, -- JSON array
  sistema_riego TEXT,
  tipo_agricultura TEXT DEFAULT 'convencional' CHECK (tipo_agricultura IN ('convencional', 'organica', 'mixta')),
  
  -- Asignación comercial
  vendedor_asignado_id TEXT,
  tecnico_asignado_id TEXT,
  supervisor_comercial_id TEXT,
  
  -- Historial y preferencias
  fecha_registro TEXT DEFAULT (datetime('now')),
  fecha_ultimo_contacto TEXT,
  preferencias_estacionales TEXT, -- JSON
  observaciones TEXT,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (vendedor_asignado_id) REFERENCES personal(id),
  FOREIGN KEY (tecnico_asignado_id) REFERENCES personal(id),
  FOREIGN KEY (supervisor_comercial_id) REFERENCES personal(id)
);

-- Tabla de cultivos por cliente
CREATE TABLE cultivos_cliente (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  cliente_id TEXT NOT NULL,
  
  -- Información del cultivo
  nombre_cultivo TEXT NOT NULL,
  variedad TEXT,
  superficie REAL, -- hectáreas
  fecha_siembra TEXT,
  fecha_cosecha_esperada TEXT,
  
  -- Rendimientos
  rendimiento_anterior REAL,
  rendimiento_esperado REAL,
  
  -- Estado actual
  estado_cultivo TEXT DEFAULT 'siembra' CHECK (estado_cultivo IN ('siembra', 'desarrollo', 'floracion', 'cosecha', 'finalizado')),
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes_agro(id)
);

-- Tabla de productos agro
CREATE TABLE productos_agro (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  
  -- Información básica
  nombre TEXT NOT NULL,
  codigo TEXT UNIQUE,
  descripcion TEXT,
  
  -- Clasificación agro
  categoria TEXT NOT NULL CHECK (categoria IN ('semillas', 'fertilizantes', 'maquinaria', 'servicios', 'financiamiento')),
  subcategoria TEXT,
  marca TEXT,
  
  -- Especificaciones técnicas
  especificaciones_tecnicas TEXT, -- JSON
  dosis_recomendada TEXT,
  cultivos_compatibles TEXT, -- JSON array
  temporada_uso TEXT, -- JSON
  
  -- Información comercial
  precio_unitario REAL DEFAULT 0,
  unidad_medida TEXT,
  stock_disponible INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 10,
  
  -- Estado
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'descontinuado')),
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Tabla de oportunidades agro
CREATE TABLE oportunidades_agro (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  cliente_id TEXT NOT NULL,
  
  -- Información básica
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_oportunidad TEXT DEFAULT 'nueva' CHECK (tipo_oportunidad IN ('nueva', 'renovacion', 'ampliacion', 'servicio_tecnico')),
  
  -- Etapas del proceso agro
  etapa TEXT DEFAULT 'prospeccion' CHECK (etapa IN ('prospeccion', 'diagnostico', 'propuesta_tecnica', 'demostracion', 'negociacion', 'cerrada_ganada', 'cerrada_perdida')),
  
  -- Información específica agro
  cultivo_objetivo TEXT,
  superficie_objetivo REAL,
  temporada_objetivo TEXT,
  necesidad_tecnica TEXT,
  
  -- Valoración
  probabilidad INTEGER DEFAULT 10 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  valor_estimado REAL DEFAULT 0,
  moneda TEXT DEFAULT 'MXN',
  
  -- Fechas
  fecha_cierre_esperada TEXT,
  fecha_cierre_real TEXT,
  fecha_siembra_objetivo TEXT,
  
  -- Asignación
  vendedor_id TEXT NOT NULL,
  tecnico_id TEXT,
  supervisor_id TEXT,
  
  -- Información adicional
  competencia TEXT,
  estrategia_venta TEXT,
  observaciones TEXT,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes_agro(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id),
  FOREIGN KEY (tecnico_id) REFERENCES personal(id),
  FOREIGN KEY (supervisor_id) REFERENCES personal(id)
);

-- Tabla de actividades agro
CREATE TABLE actividades_agro (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  oportunidad_id TEXT,
  cliente_id TEXT,
  
  -- Información básica
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_actividad TEXT NOT NULL CHECK (tipo_actividad IN ('llamada', 'email', 'visita_comercial', 'visita_tecnica', 'demostracion', 'capacitacion', 'seguimiento_tecnico', 'analisis_suelo')),
  
  -- Fechas y duración
  fecha_actividad TEXT NOT NULL,
  duracion_minutos INTEGER DEFAULT 60,
  estado TEXT DEFAULT 'programada' CHECK (estado IN ('programada', 'en_proceso', 'completada', 'cancelada')),
  
  -- Información específica agro
  ubicacion TEXT,
  cultivo_relacionado TEXT,
  resultado_tecnico TEXT,
  recomendaciones TEXT,
  
  -- Seguimiento
  proxima_accion TEXT,
  fecha_proxima_accion TEXT,
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  
  -- Participantes
  vendedor_id TEXT NOT NULL,
  tecnico_id TEXT,
  participantes TEXT, -- JSON array
  
  -- Archivos
  adjuntos TEXT, -- JSON array
  observaciones TEXT,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (oportunidad_id) REFERENCES oportunidades_agro(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes_agro(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id),
  FOREIGN KEY (tecnico_id) REFERENCES personal(id)
);

-- Tabla de historial de compras
CREATE TABLE historial_compras (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  cliente_id TEXT NOT NULL,
  
  -- Información de la compra
  fecha_compra TEXT NOT NULL,
  numero_factura TEXT,
  total_compra REAL DEFAULT 0,
  moneda TEXT DEFAULT 'MXN',
  
  -- Productos comprados
  productos TEXT, -- JSON array con detalles
  
  -- Información agro
  cultivo_destino TEXT,
  temporada_uso TEXT,
  superficie_aplicacion REAL,
  
  -- Resultados
  rendimiento_obtenido REAL,
  satisfaccion_cliente INTEGER CHECK (satisfaccion_cliente >= 1 AND satisfaccion_cliente <= 5),
  comentarios TEXT,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes_agro(id)
);

-- Tabla de pronósticos climáticos
CREATE TABLE pronosticos_clima (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  
  -- Información del pronóstico
  zona_geografica TEXT NOT NULL,
  fecha_pronostico TEXT NOT NULL,
  periodo_pronostico TEXT DEFAULT 'corto_plazo' CHECK (periodo_pronostico IN ('corto_plazo', 'mediano_plazo', 'largo_plazo')),
  
  -- Datos climáticos
  temperatura_maxima REAL,
  temperatura_minima REAL,
  precipitacion_probabilidad INTEGER,
  precipitacion_mm REAL,
  humedad_relativa INTEGER,
  velocidad_viento REAL,
  
  -- Impacto agrícola
  impacto_cultivos TEXT, -- JSON
  recomendaciones TEXT,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Tabla de métricas agro
CREATE TABLE metricas_agro (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  vendedor_id TEXT NOT NULL,
  
  -- Período
  periodo TEXT NOT NULL, -- formato: YYYY-MM
  
  -- Métricas de clientes
  clientes_asignados INTEGER DEFAULT 0,
  clientes_activos INTEGER DEFAULT 0,
  clientes_nuevos INTEGER DEFAULT 0,
  
  -- Métricas de oportunidades
  oportunidades_activas INTEGER DEFAULT 0,
  oportunidades_ganadas INTEGER DEFAULT 0,
  oportunidades_perdidas INTEGER DEFAULT 0,
  
  -- Métricas de ventas
  valor_ventas_semillas REAL DEFAULT 0,
  valor_ventas_fertilizantes REAL DEFAULT 0,
  valor_ventas_maquinaria REAL DEFAULT 0,
  valor_ventas_servicios REAL DEFAULT 0,
  total_ventas REAL DEFAULT 0,
  
  -- Métricas agro específicas
  superficie_atendida REAL DEFAULT 0, -- hectáreas
  cultivos_atendidos INTEGER DEFAULT 0,
  visitas_tecnicas INTEGER DEFAULT 0,
  capacitaciones_realizadas INTEGER DEFAULT 0,
  
  -- KPIs
  tasa_conversion REAL DEFAULT 0,
  ticket_promedio REAL DEFAULT 0,
  tiempo_promedio_cierre REAL DEFAULT 0,
  
  -- Auditoría
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id),
  UNIQUE(vendedor_id, periodo)
);

-- ===============================================
-- 3. CREACIÓN DE ÍNDICES PARA OPTIMIZACIÓN
-- ===============================================

-- Índices para clientes_agro
CREATE INDEX IF NOT EXISTS idx_clientes_agro_organization ON clientes_agro(organization_id);
CREATE INDEX IF NOT EXISTS idx_clientes_agro_vendedor ON clientes_agro(vendedor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_clientes_agro_tecnico ON clientes_agro(tecnico_asignado_id);
CREATE INDEX IF NOT EXISTS idx_clientes_agro_tipo ON clientes_agro(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_agro_categoria ON clientes_agro(categoria_agro);
CREATE INDEX IF NOT EXISTS idx_clientes_agro_zona ON clientes_agro(zona_geografica);

-- Índices para cultivos_cliente
CREATE INDEX IF NOT EXISTS idx_cultivos_cliente_organization ON cultivos_cliente(organization_id);
CREATE INDEX IF NOT EXISTS idx_cultivos_cliente_cliente ON cultivos_cliente(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cultivos_cliente_estado ON cultivos_cliente(estado_cultivo);
CREATE INDEX IF NOT EXISTS idx_cultivos_cliente_fecha_siembra ON cultivos_cliente(fecha_siembra);

-- Índices para productos_agro
CREATE INDEX IF NOT EXISTS idx_productos_agro_organization ON productos_agro(organization_id);
CREATE INDEX IF NOT EXISTS idx_productos_agro_categoria ON productos_agro(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_agro_estado ON productos_agro(estado);
CREATE INDEX IF NOT EXISTS idx_productos_agro_codigo ON productos_agro(codigo);

-- Índices para oportunidades_agro
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_organization ON oportunidades_agro(organization_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_cliente ON oportunidades_agro(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_vendedor ON oportunidades_agro(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_etapa ON oportunidades_agro(etapa);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_fecha_cierre ON oportunidades_agro(fecha_cierre_esperada);
CREATE INDEX IF NOT EXISTS idx_oportunidades_agro_cultivo ON oportunidades_agro(cultivo_objetivo);

-- Índices para actividades_agro
CREATE INDEX IF NOT EXISTS idx_actividades_agro_organization ON actividades_agro(organization_id);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_oportunidad ON actividades_agro(oportunidad_id);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_cliente ON actividades_agro(cliente_id);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_vendedor ON actividades_agro(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_fecha ON actividades_agro(fecha_actividad);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_estado ON actividades_agro(estado);
CREATE INDEX IF NOT EXISTS idx_actividades_agro_tipo ON actividades_agro(tipo_actividad);

-- Índices para historial_compras
CREATE INDEX IF NOT EXISTS idx_historial_compras_organization ON historial_compras(organization_id);
CREATE INDEX IF NOT EXISTS idx_historial_compras_cliente ON historial_compras(cliente_id);
CREATE INDEX IF NOT EXISTS idx_historial_compras_fecha ON historial_compras(fecha_compra);
CREATE INDEX IF NOT EXISTS idx_historial_compras_cultivo ON historial_compras(cultivo_destino);

-- Índices para pronosticos_clima
CREATE INDEX IF NOT EXISTS idx_pronosticos_clima_organization ON pronosticos_clima(organization_id);
CREATE INDEX IF NOT EXISTS idx_pronosticos_clima_zona ON pronosticos_clima(zona_geografica);
CREATE INDEX IF NOT EXISTS idx_pronosticos_clima_fecha ON pronosticos_clima(fecha_pronostico);

-- Índices para metricas_agro
CREATE INDEX IF NOT EXISTS idx_metricas_agro_vendedor_periodo ON metricas_agro(vendedor_id, periodo);
CREATE INDEX IF NOT EXISTS idx_metricas_agro_organization ON metricas_agro(organization_id);

-- ===============================================
-- 4. DATOS DE EJEMPLO PARA PRUEBAS
-- ===============================================

-- Insertar productos agro de ejemplo
INSERT INTO productos_agro (id, organization_id, nombre, codigo, descripcion, categoria, subcategoria, marca, precio_unitario, unidad_medida, stock_disponible) VALUES
('prod_001', 1, 'Semilla de Maíz Híbrido', 'SEM-MAIZ-001', 'Semilla de maíz híbrido de alto rendimiento', 'semillas', 'maiz', 'AgroMax', 2500.00, 'kg', 100),
('prod_002', 1, 'Fertilizante NPK 20-20-20', 'FERT-NPK-001', 'Fertilizante balanceado para todo tipo de cultivos', 'fertilizantes', 'npk', 'NutriAgro', 1800.00, 'kg', 500),
('prod_003', 1, 'Tractor Agrícola 75HP', 'MAQ-TRAC-001', 'Tractor agrícola de 75 caballos de fuerza', 'maquinaria', 'tractores', 'TractorPro', 850000.00, 'unidad', 5),
('prod_004', 1, 'Análisis de Suelo Completo', 'SERV-ANAL-001', 'Servicio de análisis completo de suelo', 'servicios', 'analisis', 'LabAgro', 1500.00, 'analisis', 50),
('prod_005', 1, 'Crédito Agrícola Preferencial', 'FIN-CRED-001', 'Línea de crédito especializada para agricultores', 'financiamiento', 'creditos', 'BancoAgro', 0.00, 'credito', 100);

-- Insertar pronósticos climáticos de ejemplo
INSERT INTO pronosticos_clima (id, organization_id, zona_geografica, fecha_pronostico, periodo_pronostico, temperatura_maxima, temperatura_minima, precipitacion_probabilidad, precipitacion_mm, humedad_relativa, velocidad_viento, impacto_cultivos, recomendaciones) VALUES
('pron_001', 1, 'Zona Norte', '2024-12-22', 'corto_plazo', 28.5, 15.2, 30, 5.2, 65, 12.5, '["maiz", "soja"]', 'Condiciones favorables para siembra de maíz'),
('pron_002', 1, 'Zona Sur', '2024-12-22', 'corto_plazo', 32.1, 18.7, 15, 2.1, 55, 8.3, '["trigo", "girasol"]', 'Atención a riego en cultivos de trigo');

-- ===============================================
-- 5. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ===============================================

-- Trigger para actualizar updated_at en clientes_agro
CREATE TRIGGER IF NOT EXISTS update_clientes_agro_updated_at
AFTER UPDATE ON clientes_agro
FOR EACH ROW
BEGIN
    UPDATE clientes_agro SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en oportunidades_agro
CREATE TRIGGER IF NOT EXISTS update_oportunidades_agro_updated_at
AFTER UPDATE ON oportunidades_agro
FOR EACH ROW
BEGIN
    UPDATE oportunidades_agro SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en actividades_agro
CREATE TRIGGER IF NOT EXISTS update_actividades_agro_updated_at
AFTER UPDATE ON actividades_agro
FOR EACH ROW
BEGIN
    UPDATE actividades_agro SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ===============================================
-- 6. VISTAS ÚTILES PARA CONSULTAS
-- ===============================================

-- Vista de clientes con información completa
CREATE VIEW IF NOT EXISTS v_clientes_agro_completo AS
SELECT 
    ca.*,
    p_vendedor.nombres || ' ' || p_vendedor.apellidos as vendedor_nombre,
    p_tecnico.nombres || ' ' || p_tecnico.apellidos as tecnico_nombre,
    p_supervisor.nombres || ' ' || p_supervisor.apellidos as supervisor_nombre,
    COUNT(cc.id) as total_cultivos,
    SUM(cc.superficie) as superficie_total_cultivos
FROM clientes_agro ca
LEFT JOIN personal p_vendedor ON ca.vendedor_asignado_id = p_vendedor.id
LEFT JOIN personal p_tecnico ON ca.tecnico_asignado_id = p_tecnico.id
LEFT JOIN personal p_supervisor ON ca.supervisor_comercial_id = p_supervisor.id
LEFT JOIN cultivos_cliente cc ON ca.id = cc.cliente_id
GROUP BY ca.id;

-- Vista de oportunidades con información de cliente
CREATE VIEW IF NOT EXISTS v_oportunidades_agro_completo AS
SELECT 
    oa.*,
    ca.nombre as cliente_nombre,
    ca.tipo_cliente as cliente_tipo,
    ca.superficie_total as cliente_superficie,
    p_vendedor.nombres || ' ' || p_vendedor.apellidos as vendedor_nombre,
    p_tecnico.nombres || ' ' || p_tecnico.apellidos as tecnico_nombre
FROM oportunidades_agro oa
LEFT JOIN clientes_agro ca ON oa.cliente_id = ca.id
LEFT JOIN personal p_vendedor ON oa.vendedor_id = p_vendedor.id
LEFT JOIN personal p_tecnico ON oa.tecnico_id = p_tecnico.id;

-- Vista de métricas por vendedor
CREATE VIEW IF NOT EXISTS v_metricas_vendedor_resumen AS
SELECT 
    ma.vendedor_id,
    p.nombres || ' ' || p.apellidos as vendedor_nombre,
    ma.periodo,
    ma.clientes_asignados,
    ma.clientes_activos,
    ma.oportunidades_activas,
    ma.oportunidades_ganadas,
    ma.total_ventas,
    ma.superficie_atendida,
    ma.tasa_conversion,
    ma.ticket_promedio
FROM metricas_agro ma
LEFT JOIN personal p ON ma.vendedor_id = p.id
ORDER BY ma.periodo DESC, ma.total_ventas DESC;

-- ===============================================
-- MIGRACIÓN COMPLETADA
-- ===============================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 'clientes_agro' as tabla, COUNT(*) as registros FROM clientes_agro
UNION ALL
SELECT 'cultivos_cliente' as tabla, COUNT(*) as registros FROM cultivos_cliente
UNION ALL
SELECT 'productos_agro' as tabla, COUNT(*) as registros FROM productos_agro
UNION ALL
SELECT 'oportunidades_agro' as tabla, COUNT(*) as registros FROM oportunidades_agro
UNION ALL
SELECT 'actividades_agro' as tabla, COUNT(*) as registros FROM actividades_agro
UNION ALL
SELECT 'historial_compras' as tabla, COUNT(*) as registros FROM historial_compras
UNION ALL
SELECT 'pronosticos_clima' as tabla, COUNT(*) as registros FROM pronosticos_clima
UNION ALL
SELECT 'metricas_agro' as tabla, COUNT(*) as registros FROM metricas_agro;
