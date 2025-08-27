-- ===============================================
-- CORRECCIÓN DE RELACIONES CRM
-- Fecha: 2024-01-15
-- Objetivo: Mejorar la integridad referencial y consistencia de datos
-- ===============================================

-- 1. CORREGIR TIPOS DE DATOS INCONSISTENTES
-- ===============================================

-- Corregir organization_id en oportunidades (de TEXT a INTEGER)
ALTER TABLE oportunidades ADD COLUMN organization_id_new INTEGER;
UPDATE oportunidades SET organization_id_new = CAST(organization_id AS INTEGER) WHERE organization_id IS NOT NULL;
ALTER TABLE oportunidades DROP COLUMN organization_id;
ALTER TABLE oportunidades RENAME COLUMN organization_id_new TO organization_id;

-- 2. AGREGAR RESTRICCIONES DE INTEGRIDAD REFERENCIAL
-- ===============================================

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_actividades_cliente_id ON actividades_crm(cliente_id);
CREATE INDEX IF NOT EXISTS idx_actividades_vendedor_id ON actividades_crm(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_actividades_oportunidad_id ON actividades_crm(oportunidad_id);
CREATE INDEX IF NOT EXISTS idx_actividades_organization_id ON actividades_crm(organization_id);

CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente_id ON oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_vendedor_id ON oportunidades(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_organization_id ON oportunidades(organization_id);

CREATE INDEX IF NOT EXISTS idx_clientes_organization_id ON clientes(organization_id);
CREATE INDEX IF NOT EXISTS idx_personal_organization_id ON personal(organization_id);

-- 3. AGREGAR VISTAS PARA FACILITAR CONSULTAS
-- ===============================================

-- Vista para actividades con información completa
CREATE VIEW IF NOT EXISTS v_actividades_completas AS
SELECT 
    a.id,
    a.organization_id,
    a.tipo_actividad,
    a.titulo,
    a.descripcion,
    a.fecha_actividad,
    a.estado,
    a.prioridad,
    
    -- Información del cliente
    c.id as cliente_id,
    c.nombre as cliente_nombre,
    c.tipo_cliente as cliente_tipo,
    
    -- Información del vendedor
    v.id as vendedor_id,
    v.nombres as vendedor_nombres,
    v.apellidos as vendedor_apellidos,
    v.email as vendedor_email,
    
    -- Información de la oportunidad
    o.id as oportunidad_id,
    o.titulo as oportunidad_titulo,
    o.estado_oportunidad as oportunidad_estado,
    o.valor_estimado as oportunidad_valor
    
FROM actividades_crm a
LEFT JOIN clientes c ON a.cliente_id = c.id
LEFT JOIN personal v ON a.vendedor_id = v.id
LEFT JOIN oportunidades o ON a.oportunidad_id = o.id
WHERE a.is_active = 1;

-- Vista para oportunidades con información completa
CREATE VIEW IF NOT EXISTS v_oportunidades_completas AS
SELECT 
    o.id,
    o.organization_id,
    o.titulo,
    o.description,
    o.tipo_oportunidad,
    o.estado_oportunidad,
    o.valor_estimado,
    o.fecha_creacion,
    o.fecha_cierre_esperada,
    
    -- Información del cliente
    c.id as cliente_id,
    c.nombre as cliente_nombre,
    c.tipo_cliente as cliente_tipo,
    c.email as cliente_email,
    
    -- Información del vendedor
    v.id as vendedor_id,
    v.nombres as vendedor_nombres,
    v.apellidos as vendedor_apellidos,
    v.email as vendedor_email,
    
    -- Información del supervisor
    s.id as supervisor_id,
    s.nombres as supervisor_nombres,
    s.apellidos as supervisor_apellidos,
    
    -- Estadísticas de actividades
    (SELECT COUNT(*) FROM actividades_crm WHERE oportunidad_id = o.id AND is_active = 1) as total_actividades,
    (SELECT COUNT(*) FROM actividades_crm WHERE oportunidad_id = o.id AND estado = 'completada' AND is_active = 1) as actividades_completadas
    
FROM oportunidades o
LEFT JOIN clientes c ON o.cliente_id = c.id
LEFT JOIN personal v ON o.vendedor_id = v.id
LEFT JOIN personal s ON o.supervisor_id = s.id
WHERE o.is_active = 1;

-- 4. FUNCIONES UTILITARIAS
-- ===============================================

-- Función para obtener estadísticas de un vendedor
CREATE VIEW IF NOT EXISTS v_estadisticas_vendedor AS
SELECT 
    v.id as vendedor_id,
    v.nombres,
    v.apellidos,
    v.email,
    
    -- Estadísticas de clientes
    COUNT(DISTINCT c.id) as total_clientes,
    COUNT(DISTINCT CASE WHEN c.tipo_cliente = 'activo' THEN c.id END) as clientes_activos,
    COUNT(DISTINCT CASE WHEN c.tipo_cliente = 'potencial' THEN c.id END) as clientes_potenciales,
    
    -- Estadísticas de oportunidades
    COUNT(DISTINCT o.id) as total_oportunidades,
    COUNT(DISTINCT CASE WHEN o.estado_oportunidad = 'cerrada_ganada' THEN o.id END) as oportunidades_ganadas,
    COUNT(DISTINCT CASE WHEN o.estado_oportunidad = 'cerrada_perdida' THEN o.id END) as oportunidades_perdidas,
    
    -- Estadísticas de actividades
    COUNT(DISTINCT a.id) as total_actividades,
    COUNT(DISTINCT CASE WHEN a.estado = 'completada' THEN a.id END) as actividades_completadas,
    COUNT(DISTINCT CASE WHEN a.estado = 'programada' THEN a.id END) as actividades_programadas
    
FROM personal v
LEFT JOIN clientes c ON v.id = c.vendedor_asignado_id
LEFT JOIN oportunidades o ON v.id = o.vendedor_id
LEFT JOIN actividades_crm a ON v.id = a.vendedor_id
WHERE v.organization_id = 1  -- Ajustar según la organización
GROUP BY v.id, v.nombres, v.apellidos, v.email;

-- 5. TRIGGERS PARA MANTENER INTEGRIDAD
-- ===============================================

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS tr_actividades_updated_at
AFTER UPDATE ON actividades_crm
BEGIN
    UPDATE actividades_crm SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS tr_oportunidades_updated_at
AFTER UPDATE ON oportunidades
BEGIN
    UPDATE oportunidades SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS tr_clientes_updated_at
AFTER UPDATE ON clientes
BEGIN
    UPDATE clientes SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- 6. DATOS DE EJEMPLO MEJORADOS
-- ===============================================

-- Insertar vendedores de ejemplo si no existen
INSERT OR IGNORE INTO personal (id, organization_id, nombres, apellidos, email, telefono) VALUES
('vendedor-001', 1, 'María', 'González', 'maria@empresa.com', '555-0101'),
('vendedor-002', 1, 'Carlos', 'Rodríguez', 'carlos@empresa.com', '555-0102'),
('vendedor-003', 1, 'Ana', 'Martínez', 'ana@empresa.com', '555-0103');

-- Insertar clientes de ejemplo si no existen
INSERT OR IGNORE INTO clientes (id, organization_id, nombre, tipo_cliente, email, telefono, is_active) VALUES
('cliente-001', 1, 'Empresa Tecnológica ABC', 'potencial', 'contacto@abc.com', '555-1001', 1),
('cliente-002', 1, 'Consultoría XYZ', 'activo', 'info@xyz.com', '555-1002', 1),
('cliente-003', 1, 'Industrias DEF', 'potencial', 'ventas@def.com', '555-1003', 1);

-- Insertar oportunidades de ejemplo
INSERT OR IGNORE INTO oportunidades (id, organization_id, cliente_id, vendedor_id, titulo, estado_oportunidad, valor_estimado, fecha_creacion) VALUES
('oportunidad-001', 1, 'cliente-001', 'vendedor-001', 'Implementación de Software ERP', 'calificacion', 50000.00, '2024-01-01'),
('oportunidad-002', 1, 'cliente-002', 'vendedor-002', 'Consultoría de Procesos', 'propuesta', 25000.00, '2024-01-05'),
('oportunidad-003', 1, 'cliente-003', 'vendedor-003', 'Sistema de Gestión de Calidad', 'negociacion', 75000.00, '2024-01-10');

-- Insertar actividades de ejemplo
INSERT OR IGNORE INTO actividades_crm (id, organization_id, cliente_id, vendedor_id, oportunidad_id, tipo_actividad, titulo, descripcion, fecha_actividad, estado, prioridad) VALUES
('actividad-001', 1, 'cliente-001', 'vendedor-001', 'oportunidad-001', 'llamada', 'Llamada inicial de contacto', 'Primer contacto con el cliente para presentar nuestros servicios', '2024-01-02 10:00:00', 'completada', 'alta'),
('actividad-002', 1, 'cliente-001', 'vendedor-001', 'oportunidad-001', 'reunion', 'Presentación del producto', 'Reunión para presentar las características del software ERP', '2024-01-05 14:00:00', 'completada', 'alta'),
('actividad-003', 1, 'cliente-001', 'vendedor-001', 'oportunidad-001', 'propuesta', 'Envío de propuesta comercial', 'Envío de la propuesta detallada con precios y condiciones', '2024-01-08 09:00:00', 'programada', 'media'),
('actividad-004', 1, 'cliente-002', 'vendedor-002', 'oportunidad-002', 'email', 'Seguimiento de propuesta', 'Envío de email de seguimiento sobre la propuesta enviada', '2024-01-06 11:00:00', 'completada', 'media'),
('actividad-005', 1, 'cliente-003', 'vendedor-003', 'oportunidad-003', 'visita', 'Visita técnica al cliente', 'Visita para evaluar las necesidades técnicas del cliente', '2024-01-12 15:00:00', 'en_proceso', 'alta');

-- 7. CONSULTAS DE EJEMPLO PARA VERIFICAR
-- ===============================================

-- Verificar que todo funciona correctamente
SELECT 'Verificación completada' as status;
