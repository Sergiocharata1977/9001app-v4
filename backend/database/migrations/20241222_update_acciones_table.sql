-- Migración para actualizar la tabla de acciones con campos del workflow
-- Fecha: 2024-12-22

-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS acciones (
  id TEXT PRIMARY KEY,
  organization_id INTEGER NOT NULL DEFAULT 1,
  hallazgo_id TEXT NOT NULL,
  numeroAccion TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL DEFAULT 'p1_planificacion_accion',
  descripcion_accion TEXT,
  responsable_accion TEXT,
  fecha_plan_accion TEXT,
  comentarios_ejecucion TEXT,
  fecha_ejecucion TEXT,
  descripcion_verificacion TEXT,
  responsable_verificacion TEXT,
  fecha_plan_verificacion TEXT,
  comentarios_verificacion TEXT,
  fecha_verificacion_finalizada TEXT,
  eficacia TEXT DEFAULT 'Pendiente',
  evidencia_accion TEXT,
  resultado_verificacion TEXT,
  observaciones TEXT,
  prioridad TEXT DEFAULT 'media',
  titulo TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_acciones_estado ON acciones(estado);
CREATE INDEX IF NOT EXISTS idx_acciones_hallazgo_id ON acciones(hallazgo_id);
CREATE INDEX IF NOT EXISTS idx_acciones_organization_id ON acciones(organization_id);
CREATE INDEX IF NOT EXISTS idx_acciones_prioridad ON acciones(prioridad);
CREATE INDEX IF NOT EXISTS idx_acciones_fecha_plan_accion ON acciones(fecha_plan_accion);

-- Insertar datos de ejemplo si la tabla está vacía
INSERT OR IGNORE INTO acciones (
  id, 
  organization_id, 
  hallazgo_id, 
  numeroAccion, 
  estado, 
  descripcion_accion, 
  responsable_accion, 
  prioridad,
  titulo
) VALUES (
  'acc-001',
  1,
  'hall-001',
  'AM-001',
  'p1_planificacion_accion',
  'Implementar sistema de control de calidad',
  'Juan Pérez',
  'alta',
  'Sistema de Control de Calidad'
);
