-- ===============================================
-- MIGRACIÓN EVALUACIONES AL SISTEMA SGC ESTANDARIZADO
-- Script completo para migrar módulo de evaluaciones
-- ===============================================

-- ⚠️  IMPORTANTE: 
-- 1. Realizar backup completo antes de ejecutar
-- 2. Ejecutar paso a paso verificando cada resultado
-- 3. NO eliminar tablas originales hasta confirmar migración

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: VERIFICAR CONTEO ACTUAL DE DATOS
-- ===============================================

-- Verificar datos existentes
SELECT 'evaluaciones_individuales' as tabla, COUNT(*) as registros FROM evaluaciones_individuales
UNION ALL
SELECT 'evaluaciones_competencias_detalle' as tabla, COUNT(*) as registros FROM evaluaciones_competencias_detalle  
UNION ALL
SELECT 'evaluacion_programacion' as tabla, COUNT(*) as registros FROM evaluacion_programacion;

-- ===============================================
-- PASO 2: MIGRAR EVALUACIONES_INDIVIDUALES → SGC_PERSONAL_RELACIONES
-- ===============================================

-- Migrar evaluados
INSERT OR IGNORE INTO sgc_personal_relaciones (
    id, 
    organization_id, 
    entidad_tipo, 
    entidad_id, 
    personal_id,
    rol, 
    asistio,
    observaciones,
    datos_adicionales,
    created_at,
    updated_at,
    created_by,
    is_active
)
SELECT 
    'PART_EVAL_' || ei.id || '_EVALUADO',
    ei.organization_id,
    'evaluacion',
    CAST(ei.id as TEXT),
    CAST(ei.empleado_id as TEXT),
    'evaluado',
    1, -- asistio = true (fue evaluado)
    ei.observaciones,
    JSON_OBJECT(
        'fecha_evaluacion', ei.fecha_evaluacion,
        'estado', ei.estado,
        'tipo_evaluacion', 'individual'
    ),
    COALESCE(ei.created_at, CURRENT_TIMESTAMP),
    COALESCE(ei.updated_at, CURRENT_TIMESTAMP),
    NULL,
    1
FROM evaluaciones_individuales ei
WHERE ei.empleado_id IS NOT NULL;

-- Migrar evaluadores
INSERT OR IGNORE INTO sgc_personal_relaciones (
    id, 
    organization_id, 
    entidad_tipo, 
    entidad_id, 
    personal_id,
    rol, 
    asistio,
    observaciones,
    datos_adicionales,
    created_at,
    updated_at,
    created_by,
    is_active
)
SELECT 
    'PART_EVAL_' || ei.id || '_EVALUADOR',
    ei.organization_id,
    'evaluacion',
    CAST(ei.id as TEXT),
    CAST(ei.evaluador_id as TEXT),
    'evaluador',
    1, -- asistio = true (realizó la evaluación)
    'Evaluador responsable',
    JSON_OBJECT(
        'fecha_evaluacion', ei.fecha_evaluacion,
        'estado', ei.estado,
        'tipo_evaluacion', 'individual'
    ),
    COALESCE(ei.created_at, CURRENT_TIMESTAMP),
    COALESCE(ei.updated_at, CURRENT_TIMESTAMP),
    NULL,
    1
FROM evaluaciones_individuales ei
WHERE ei.evaluador_id IS NOT NULL;

-- ===============================================
-- PASO 3: MIGRAR EVALUACIONES_COMPETENCIAS_DETALLE → SGC_NORMAS_RELACIONADAS
-- ===============================================

INSERT OR IGNORE INTO sgc_normas_relacionadas (
    id,
    organization_id,
    entidad_tipo,
    entidad_id,
    norma_id,
    punto_norma,
    clausula_descripcion,
    tipo_relacion,
    nivel_cumplimiento,
    observaciones,
    datos_adicionales,
    created_at,
    updated_at,
    created_by,
    is_active
)
SELECT 
    'NOR_EVAL_' || ecd.id,
    ecd.organization_id,
    'evaluacion',
    CAST(ecd.evaluacion_id as TEXT),
    COALESCE(ecd.competencia_id, 1), -- Norma genérica de competencias si no existe
    'COMPETENCIA_' || ecd.competencia_id,
    'Evaluación de competencia individual',
    'competencia_evaluada',
    CASE 
        WHEN ecd.puntaje >= 80 THEN 'cumple_completo'
        WHEN ecd.puntaje >= 60 THEN 'cumple_parcial'
        ELSE 'no_cumple'
    END,
    'Puntaje obtenido: ' || ecd.puntaje,
    JSON_OBJECT(
        'puntaje', ecd.puntaje,
        'puntaje_maximo', 100,
        'tipo_evaluacion', 'competencia_individual'
    ),
    COALESCE(ecd.created_at, CURRENT_TIMESTAMP),
    COALESCE(ecd.updated_at, CURRENT_TIMESTAMP),
    NULL,
    1
FROM evaluaciones_competencias_detalle ecd;

-- ===============================================
-- PASO 4: MIGRAR EVALUACION_PROGRAMACION → SGC_PERSONAL_RELACIONES (coordinadores)
-- ===============================================

INSERT OR IGNORE INTO sgc_personal_relaciones (
    id, 
    organization_id, 
    entidad_tipo, 
    entidad_id, 
    personal_id,
    rol, 
    asistio,
    observaciones,
    datos_adicionales,
    created_at,
    updated_at,
    created_by,
    is_active
)
SELECT 
    'PART_PROG_' || ep.id || '_COORD',
    ep.organization_id,
    'evaluacion_programacion',
    CAST(ep.id as TEXT),
    ep.usuario_creador,
    'coordinador',
    1,
    'Coordinador de programación de evaluaciones',
    JSON_OBJECT(
        'nombre', ep.nombre,
        'descripcion', ep.descripcion,
        'fecha_inicio', ep.fecha_inicio,
        'fecha_fin', ep.fecha_fin,
        'estado', ep.estado,
        'tipo', 'programacion_evaluaciones'
    ),
    COALESCE(ep.fecha_creacion, CURRENT_TIMESTAMP),
    COALESCE(ep.fecha_creacion, CURRENT_TIMESTAMP),
    CAST(ep.usuario_creador as INTEGER),
    1
FROM evaluacion_programacion ep
WHERE ep.usuario_creador IS NOT NULL;

-- ===============================================
-- PASO 5: VERIFICAR MIGRACIÓN
-- ===============================================

-- Contar registros migrados
SELECT 'sgc_personal_relaciones (evaluaciones)' as tabla, COUNT(*) as registros_migrados 
FROM sgc_personal_relaciones 
WHERE entidad_tipo IN ('evaluacion', 'evaluacion_programacion')
UNION ALL
SELECT 'sgc_normas_relacionadas (evaluaciones)' as tabla, COUNT(*) as registros_migrados 
FROM sgc_normas_relacionadas 
WHERE entidad_tipo = 'evaluacion';

-- Verificar integridad de datos
SELECT 
    'Evaluaciones con participantes' as verificacion,
    COUNT(DISTINCT sp.entidad_id) as evaluaciones_con_participantes,
    (SELECT COUNT(*) FROM evaluaciones_individuales) as total_evaluaciones_originales
FROM sgc_personal_relaciones sp 
WHERE sp.entidad_tipo = 'evaluacion';

SELECT 
    'Competencias migradas' as verificacion,
    COUNT(*) as competencias_migradas,
    (SELECT COUNT(*) FROM evaluaciones_competencias_detalle) as total_competencias_originales
FROM sgc_normas_relacionadas snr 
WHERE snr.entidad_tipo = 'evaluacion';

-- ===============================================
-- PASO 6: CREAR VISTA PARA COMPATIBILIDAD
-- ===============================================

-- Vista para mantener compatibilidad con código existente
CREATE VIEW IF NOT EXISTS vista_evaluaciones_individuales AS
SELECT 
    CAST(sp_evaluado.entidad_id as INTEGER) as id,
    sp_evaluado.organization_id,
    CAST(sp_evaluado.personal_id as INTEGER) as empleado_id,
    CAST(sp_evaluador.personal_id as INTEGER) as evaluador_id,
    JSON_EXTRACT(sp_evaluado.datos_adicionales, '$.fecha_evaluacion') as fecha_evaluacion,
    sp_evaluado.observaciones,
    JSON_EXTRACT(sp_evaluado.datos_adicionales, '$.estado') as estado,
    sp_evaluado.created_at,
    sp_evaluado.updated_at
FROM sgc_personal_relaciones sp_evaluado
LEFT JOIN sgc_personal_relaciones sp_evaluador ON (
    sp_evaluado.entidad_tipo = sp_evaluador.entidad_tipo 
    AND sp_evaluado.entidad_id = sp_evaluador.entidad_id
    AND sp_evaluador.rol = 'evaluador'
)
WHERE sp_evaluado.entidad_tipo = 'evaluacion' 
AND sp_evaluado.rol = 'evaluado';

-- Vista para competencias evaluadas
CREATE VIEW IF NOT EXISTS vista_evaluaciones_competencias AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY snr.id) as id,
    snr.organization_id,
    CAST(snr.entidad_id as INTEGER) as evaluacion_id,
    snr.norma_id as competencia_id,
    CAST(JSON_EXTRACT(snr.datos_adicionales, '$.puntaje') as INTEGER) as puntaje,
    snr.observaciones,
    snr.created_at,
    snr.updated_at
FROM sgc_normas_relacionadas snr
WHERE snr.entidad_tipo = 'evaluacion' 
AND snr.tipo_relacion = 'competencia_evaluada';

COMMIT;

-- ===============================================
-- VERIFICACIÓN FINAL
-- ===============================================

-- Mostrar resumen de migración
SELECT '=== RESUMEN DE MIGRACIÓN EVALUACIONES ===' as resultado;

SELECT 
    'ORIGINALES' as tipo,
    'evaluaciones_individuales' as tabla,
    COUNT(*) as registros
FROM evaluaciones_individuales
UNION ALL
SELECT 
    'ORIGINALES' as tipo,
    'evaluaciones_competencias_detalle' as tabla,
    COUNT(*) as registros
FROM evaluaciones_competencias_detalle
UNION ALL
SELECT 
    'ORIGINALES' as tipo,
    'evaluacion_programacion' as tabla,
    COUNT(*) as registros
FROM evaluacion_programacion
UNION ALL
SELECT 
    'MIGRADOS' as tipo,
    'sgc_personal_relaciones (evaluaciones)' as tabla,
    COUNT(*) as registros
FROM sgc_personal_relaciones 
WHERE entidad_tipo IN ('evaluacion', 'evaluacion_programacion')
UNION ALL
SELECT 
    'MIGRADOS' as tipo,
    'sgc_normas_relacionadas (evaluaciones)' as tabla,
    COUNT(*) as registros
FROM sgc_normas_relacionadas 
WHERE entidad_tipo = 'evaluacion';

SELECT '=== MIGRACIÓN COMPLETADA ===' as resultado;
