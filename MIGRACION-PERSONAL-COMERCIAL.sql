-- ===============================================
-- MIGRACIÓN PERSONAL COMERCIAL
-- Script para agregar clasificación comercial al personal
-- ===============================================

-- ⚠️  IMPORTANTE: Realizar backup antes de ejecutar
-- ⚠️  Probar primero en entorno de desarrollo

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: AGREGAR CAMPOS COMERCIALES A PERSONAL
-- ===============================================

-- Agregar campo de clasificación comercial
ALTER TABLE personal ADD COLUMN clasificacion_comercial TEXT DEFAULT 'general';

-- Agregar campo de rol comercial
ALTER TABLE personal ADD COLUMN rol_comercial TEXT DEFAULT 'ninguno';

-- Agregar campo de zona de venta
ALTER TABLE personal ADD COLUMN zona_venta TEXT;

-- Agregar campo de comisión de venta
ALTER TABLE personal ADD COLUMN comision_venta DECIMAL(5,2) DEFAULT 0.00;

-- Agregar campo de meta de venta mensual
ALTER TABLE personal ADD COLUMN meta_venta_mensual DECIMAL(12,2) DEFAULT 0.00;

-- Agregar campo de fecha de inicio comercial
ALTER TABLE personal ADD COLUMN fecha_inicio_comercial DATE;

-- Agregar campo de supervisor comercial
ALTER TABLE personal ADD COLUMN supervisor_comercial_id INTEGER;

-- Agregar campo de especialidad agro
ALTER TABLE personal ADD COLUMN especialidad_agro TEXT DEFAULT 'general';

-- ===============================================
-- PASO 2: CREAR ÍNDICES PARA BÚSQUEDAS COMERCIALES
-- ===============================================

-- Índice para clasificación comercial
CREATE INDEX idx_personal_clasificacion_comercial ON personal(clasificacion_comercial);

-- Índice para rol comercial
CREATE INDEX idx_personal_rol_comercial ON personal(rol_comercial);

-- Índice para zona de venta
CREATE INDEX idx_personal_zona_venta ON personal(zona_venta);

-- Índice para especialidad agro
CREATE INDEX idx_personal_especialidad_agro ON personal(especialidad_agro);

-- Índice para supervisor comercial
CREATE INDEX idx_personal_supervisor_comercial ON personal(supervisor_comercial_id);

-- Índice compuesto para consultas comerciales
CREATE INDEX idx_personal_comercial_compuesto ON personal(clasificacion_comercial, rol_comercial, zona_venta);

-- ===============================================
-- PASO 3: CREAR VISTA DE PERSONAL COMERCIAL
-- ===============================================

-- Vista para personal comercial activo
CREATE VIEW v_personal_comercial AS
SELECT 
    p.*,
    s.nombre as nombre_supervisor,
    s.apellido as apellido_supervisor,
    d.nombre as nombre_departamento,
    pu.nombre as nombre_puesto
FROM personal p
LEFT JOIN personal s ON p.supervisor_comercial_id = s.id
LEFT JOIN departamentos d ON p.departamento_id = d.id
LEFT JOIN puestos pu ON p.puesto_id = pu.id
WHERE p.clasificacion_comercial = 'comercial'
   OR p.rol_comercial != 'ninguno'
   OR p.especialidad_agro != 'general';

-- ===============================================
-- PASO 4: CREAR VISTA DE VENDEDORES ACTIVOS
-- ===============================================

-- Vista específica para vendedores
CREATE VIEW v_vendedores_activos AS
SELECT 
    p.*,
    s.nombre as nombre_supervisor,
    s.apellido as apellido_supervisor,
    d.nombre as nombre_departamento,
    pu.nombre as nombre_puesto
FROM personal p
LEFT JOIN personal s ON p.supervisor_comercial_id = s.id
LEFT JOIN departamentos d ON p.departamento_id = d.id
LEFT JOIN puestos pu ON p.puesto_id = pu.id
WHERE p.rol_comercial = 'vendedor'
   OR p.rol_comercial = 'supervisor_comercial'
   OR p.rol_comercial = 'gerente_comercial';

-- ===============================================
-- PASO 5: INSERTAR DATOS DE EJEMPLO (OPCIONAL)
-- ===============================================

-- Actualizar algunos registros existentes como ejemplo
-- (Descomentar si se desea agregar datos de ejemplo)

/*
UPDATE personal 
SET 
    clasificacion_comercial = 'comercial',
    rol_comercial = 'vendedor',
    zona_venta = 'Zona Norte',
    comision_venta = 5.00,
    meta_venta_mensual = 50000.00,
    fecha_inicio_comercial = '2024-01-01',
    especialidad_agro = 'semillas'
WHERE id IN (1, 2, 3); -- IDs de ejemplo

UPDATE personal 
SET 
    clasificacion_comercial = 'comercial',
    rol_comercial = 'supervisor_comercial',
    zona_venta = 'Todas las zonas',
    comision_venta = 3.00,
    meta_venta_mensual = 200000.00,
    fecha_inicio_comercial = '2023-06-01',
    especialidad_agro = 'general'
WHERE id = 4; -- ID de supervisor de ejemplo
*/

-- ===============================================
-- PASO 6: CREAR TRIGGERS PARA AUDITORÍA
-- ===============================================

-- Trigger para auditoría de cambios comerciales
CREATE TRIGGER tr_personal_comercial_audit
AFTER UPDATE ON personal
FOR EACH ROW
WHEN (OLD.clasificacion_comercial != NEW.clasificacion_comercial 
   OR OLD.rol_comercial != NEW.rol_comercial
   OR OLD.zona_venta != NEW.zona_venta
   OR OLD.comision_venta != NEW.comision_venta
   OR OLD.meta_venta_mensual != NEW.meta_venta_mensual)
BEGIN
    INSERT INTO audit_log (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_by,
        changed_at
    ) VALUES (
        'personal',
        NEW.id,
        'UPDATE_COMERCIAL',
        json_object(
            'clasificacion_comercial', OLD.clasificacion_comercial,
            'rol_comercial', OLD.rol_comercial,
            'zona_venta', OLD.zona_venta,
            'comision_venta', OLD.comision_venta,
            'meta_venta_mensual', OLD.meta_venta_mensual
        ),
        json_object(
            'clasificacion_comercial', NEW.clasificacion_comercial,
            'rol_comercial', NEW.rol_comercial,
            'zona_venta', NEW.zona_venta,
            'comision_venta', NEW.comision_venta,
            'meta_venta_mensual', NEW.meta_venta_mensual
        ),
        'SISTEMA',
        datetime('now')
    );
END;

-- ===============================================
-- PASO 7: VERIFICACIÓN FINAL
-- ===============================================

-- Verificar que los campos se agregaron correctamente
SELECT 
    name,
    type,
    "notnull",
    dflt_value
FROM pragma_table_info('personal')
WHERE name IN (
    'clasificacion_comercial',
    'rol_comercial',
    'zona_venta',
    'comision_venta',
    'meta_venta_mensual',
    'fecha_inicio_comercial',
    'supervisor_comercial_id',
    'especialidad_agro'
);

-- Verificar índices creados
SELECT 
    name,
    sql
FROM sqlite_master
WHERE type = 'index'
AND name LIKE 'idx_personal_%';

-- Verificar vistas creadas
SELECT 
    name,
    sql
FROM sqlite_master
WHERE type = 'view'
AND name LIKE 'v_%comercial%';

COMMIT;

-- ===============================================
-- MENSAJE DE ÉXITO
-- ===============================================

SELECT '✅ Migración de personal comercial completada exitosamente' as resultado;
