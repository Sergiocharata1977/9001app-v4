-- ===============================================
-- RENOMBRAR TABLA SGC_PERSONAL_RELACIONES A SGC_PERSONAL_RELACIONES
-- Script para cambiar el nombre de la tabla para mayor claridad
-- ===============================================

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: RENOMBRAR LA TABLA
-- ===============================================

-- Renombrar la tabla principal
ALTER TABLE sgc_personal_relaciones RENAME TO sgc_personal_relaciones;

-- ===============================================
-- PASO 2: RENOMBRAR ÍNDICES (si existen)
-- ===============================================

-- Verificar y renombrar índices si existen
-- SQLite no permite renombrar índices directamente, pero se recrean automáticamente

-- ===============================================
-- PASO 3: ACTUALIZAR VISTAS QUE REFERENCIEN LA TABLA
-- ===============================================

-- Actualizar vista de participantes completos (si existe)
DROP VIEW IF EXISTS v_sgc_personal_relaciones_completos;

CREATE VIEW IF NOT EXISTS v_sgc_personal_relaciones_completos AS
SELECT 
    spr.*,
    p.nombre as nombre_personal,
    p.apellido as apellido_personal,
    p.email as email_personal,
    p.telefono as telefono_personal,
    d.nombre as nombre_departamento,
    pu.nombre as nombre_puesto
FROM sgc_personal_relaciones spr
LEFT JOIN personal p ON spr.personal_id = p.id
LEFT JOIN departamentos d ON p.departamento_id = d.id
LEFT JOIN puestos pu ON p.puesto_id = pu.id
WHERE spr.organization_id = p.organization_id
   OR spr.organization_id = d.organization_id
   OR spr.organization_id = pu.organization_id;

-- ===============================================
-- PASO 4: CREAR VISTA DE COMPATIBILIDAD (TEMPORAL)
-- ===============================================

-- Crear vista con el nombre anterior para compatibilidad temporal
CREATE VIEW IF NOT EXISTS v_sgc_personal_relaciones_completos AS
SELECT * FROM v_sgc_personal_relaciones_completos;

-- ===============================================
-- PASO 5: VERIFICAR EL CAMBIO
-- ===============================================

-- Verificar que la tabla existe con el nuevo nombre
SELECT 'Tabla renombrada:' as info, COUNT(*) as total FROM sgc_personal_relaciones;

-- Verificar que los datos se mantuvieron
SELECT 'Datos migrados:' as info, COUNT(*) as total FROM sgc_personal_relaciones;

-- Verificar estructura de la nueva tabla
PRAGMA table_info(sgc_personal_relaciones);

COMMIT;

-- ===============================================
-- VERIFICACIÓN FINAL
-- ===============================================

-- Mostrar todas las tablas SGC para confirmar el cambio
SELECT 'Tablas SGC actuales:' as info, name as tabla FROM sqlite_master 
WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name;

-- Verificar que la vista funciona
SELECT 'Vista personal relaciones:' as info, COUNT(*) as total FROM v_sgc_personal_relaciones_completos;
