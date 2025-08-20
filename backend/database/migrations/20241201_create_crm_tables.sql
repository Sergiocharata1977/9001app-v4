-- ===============================================
-- MIGRACIÓN: CREACIÓN DE TABLAS CRM
-- Fecha: 2024-12-01
-- Agente: CRM CON VENDEDORES
-- ===============================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  razon_social TEXT,
  rfc TEXT,
  tipo_cliente TEXT DEFAULT 'potencial' CHECK (tipo_cliente IN ('potencial', 'activo', 'inactivo')),
  categoria TEXT DEFAULT 'C' CHECK (categoria IN ('A', 'B', 'C')),
  direccion TEXT,
  ciudad TEXT,
  estado TEXT,
  codigo_postal TEXT,
  pais TEXT DEFAULT 'México',
  telefono TEXT,
  email TEXT,
  sitio_web TEXT,
  representante_legal TEXT,
  fecha_registro TEXT DEFAULT (datetime('now')),
  fecha_ultimo_contacto TEXT,
  vendedor_asignado_id TEXT,
  supervisor_comercial_id TEXT,
  zona_venta TEXT,
  especialidad_interes TEXT,
  observaciones TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (vendedor_asignado_id) REFERENCES personal(id),
  FOREIGN KEY (supervisor_comercial_id) REFERENCES personal(id)
);

-- Tabla de oportunidades de venta
CREATE TABLE IF NOT EXISTS oportunidades (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  cliente_id TEXT NOT NULL,
  vendedor_id TEXT NOT NULL,
  supervisor_id TEXT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo_oportunidad TEXT DEFAULT 'nueva' CHECK (tipo_oportunidad IN ('nueva', 'renovacion', 'ampliacion', 'referido')),
  etapa TEXT DEFAULT 'prospeccion' CHECK (etapa IN ('prospeccion', 'calificacion', 'propuesta', 'negociacion', 'cerrada_ganada', 'cerrada_perdida')),
  probabilidad INTEGER DEFAULT 10 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  valor_estimado REAL DEFAULT 0,
  moneda TEXT DEFAULT 'MXN',
  fecha_cierre_esperada TEXT,
  fecha_cierre_real TEXT,
  motivo_cierre TEXT,
  productos_servicios TEXT,
  competencia TEXT,
  recursos_requeridos TEXT,
  riesgos TEXT,
  estrategia_venta TEXT,
  observaciones TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id),
  FOREIGN KEY (supervisor_id) REFERENCES personal(id)
);

-- Tabla de actividades CRM
CREATE TABLE IF NOT EXISTS actividades_crm (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  oportunidad_id TEXT,
  cliente_id TEXT,
  vendedor_id TEXT NOT NULL,
  tipo_actividad TEXT NOT NULL CHECK (tipo_actividad IN ('llamada', 'email', 'reunion', 'visita', 'propuesta', 'seguimiento', 'otro')),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_actividad TEXT NOT NULL,
  duracion_minutos INTEGER DEFAULT 30,
  estado TEXT DEFAULT 'programada' CHECK (estado IN ('programada', 'en_proceso', 'completada', 'cancelada')),
  resultado TEXT,
  proxima_accion TEXT,
  fecha_proxima_accion TEXT,
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  ubicacion TEXT,
  participantes TEXT,
  adjuntos TEXT,
  observaciones TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT,
  updated_by TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (oportunidad_id) REFERENCES oportunidades(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id)
);

-- Tabla de productos/servicios para oportunidades
CREATE TABLE IF NOT EXISTS productos_oportunidad (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  oportunidad_id TEXT NOT NULL,
  producto_servicio TEXT NOT NULL,
  descripcion TEXT,
  cantidad INTEGER DEFAULT 1,
  precio_unitario REAL DEFAULT 0,
  descuento REAL DEFAULT 0,
  total REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (oportunidad_id) REFERENCES oportunidades(id)
);

-- Tabla de métricas de vendedores
CREATE TABLE IF NOT EXISTS metricas_vendedores (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  vendedor_id TEXT NOT NULL,
  periodo TEXT NOT NULL, -- formato: YYYY-MM
  clientes_asignados INTEGER DEFAULT 0,
  oportunidades_activas INTEGER DEFAULT 0,
  oportunidades_ganadas INTEGER DEFAULT 0,
  oportunidades_perdidas INTEGER DEFAULT 0,
  valor_ventas REAL DEFAULT 0,
  meta_mensual REAL DEFAULT 0,
  porcentaje_cumplimiento REAL DEFAULT 0,
  actividades_completadas INTEGER DEFAULT 0,
  actividades_pendientes INTEGER DEFAULT 0,
  tiempo_promedio_cierre REAL DEFAULT 0, -- en días
  tasa_conversion REAL DEFAULT 0, -- porcentaje
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (vendedor_id) REFERENCES personal(id),
  UNIQUE(vendedor_id, periodo)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_clientes_organization ON clientes(organization_id);
CREATE INDEX IF NOT EXISTS idx_clientes_vendedor ON clientes(vendedor_asignado_id);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_categoria ON clientes(categoria);

CREATE INDEX IF NOT EXISTS idx_oportunidades_organization ON oportunidades(organization_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente ON oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_vendedor ON oportunidades(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_etapa ON oportunidades(etapa);
CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_cierre ON oportunidades(fecha_cierre_esperada);

CREATE INDEX IF NOT EXISTS idx_actividades_organization ON actividades_crm(organization_id);
CREATE INDEX IF NOT EXISTS idx_actividades_oportunidad ON actividades_crm(oportunidad_id);
CREATE INDEX IF NOT EXISTS idx_actividades_cliente ON actividades_crm(cliente_id);
CREATE INDEX IF NOT EXISTS idx_actividades_vendedor ON actividades_crm(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_actividades_fecha ON actividades_crm(fecha_actividad);
CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades_crm(estado);

CREATE INDEX IF NOT EXISTS idx_metricas_vendedor_periodo ON metricas_vendedores(vendedor_id, periodo);
