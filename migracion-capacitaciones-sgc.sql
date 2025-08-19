-- ===============================================
-- MIGRACIÓN CAPACITACIONES AL SISTEMA SGC ESTANDARIZADO
-- Migra capacitacion_asistentes → sgc_personal_relaciones
-- Prepara sistema para usar documentos y normas SGC
-- ===============================================

-- ⚠️  IMPORTANTE: 
-- 1. Realizar backup completo antes de ejecutar
-- 2. Ejecutar en entorno de desarrollo primero
-- 3. Verificar cada paso antes de continuar

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: VERIFICAR ESTADO ACTUAL
-- ===============================================

SELECT 'VERIFICACION_INICIAL' as paso;

-- Contar registros actuales
SELECT 'CAPACITACIONES' as tabla, COUNT(*) as registros FROM capacitaciones;
SELECT 'CAPACITACION_ASISTENTES' as tabla, COUNT(*) as registros FROM capacitacion_asistentes;
SELECT 'SGC_PERSONAL_RELACIONES_CAPACITACION' as tabla, COUNT(*) as registros FROM sgc_personal_relaciones WHERE entidad_tipo = 'capacitacion';
SELECT 'SGC_DOCUMENTOS_CAPACITACION' as tabla, COUNT(*) as registros FROM sgc_documentos_relacionados WHERE entidad_tipo = 'capacitacion';
SELECT 'SGC_NORMAS_CAPACITACION' as tabla, COUNT(*) as registros FROM sgc_normas_relacionadas WHERE entidad_tipo = 'capacitacion';

-- ===============================================
-- PASO 2: MIGRAR ASISTENTES → PARTICIPANTES SGC
-- ===============================================

SELECT 'MIGRACION_PARTICIPANTES' as paso;

-- Migrar capacitacion_asistentes → sgc_personal_relaciones
INSERT INTO sgc_personal_relaciones (
    id, 
    organization_id, 
    entidad_tipo, 
    entidad_id, 
    personal_id,
    rol, 
    asistio, 
    datos_adicionales,
    created_at,
    updated_at,
    is_active
)
SELECT 
    'PART_CAP_' || ca.id as id,
    ca.organization_id,
    'capacitacion' as entidad_tipo,
    ca.capacitacion_id as entidad_id,
    ca.empleado_id as personal_id,
    'participante' as rol,
    ca.asistencia as asistio,
    JSON_OBJECT(
        'migrado_desde', 'capacitacion_asistentes',
        'asistencia_original', ca.asistencia
    ) as datos_adicionales,
    ca.created_at,
    ca.updated_at,
    1 as is_active
FROM capacitacion_asistentes ca
WHERE NOT EXISTS (
    SELECT 1 FROM sgc_personal_relaciones sp 
    WHERE sp.entidad_tipo = 'capacitacion' 
    AND sp.entidad_id = ca.capacitacion_id 
    AND sp.personal_id = ca.empleado_id
);

-- ===============================================
-- PASO 3: CREAR DATOS DE EJEMPLO SGC
-- ===============================================

SELECT 'DATOS_EJEMPLO' as paso;

-- Ejemplo de instructor para cada capacitación
INSERT INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id,
    rol, asistio, datos_adicionales, created_at, updated_at, is_active
)
SELECT 
    'PART_CAP_INST_' || c.id,
    2,
    'capacitacion',
    c.id,
    'EMP001', -- ID de ejemplo - debe existir en tabla personal
    'instructor',
    1,
    JSON_OBJECT(
        'nivel_competencia', 'experto',
        'certificacion', 'ISO 9001:2015',
        'horas_formacion', 40
    ),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
FROM capacitaciones c
WHERE NOT EXISTS (
    SELECT 1 FROM sgc_personal_relaciones sp 
    WHERE sp.entidad_tipo = 'capacitacion' 
    AND sp.entidad_id = c.id 
    AND sp.rol = 'instructor'
)
LIMIT 2;

-- Ejemplo de documentos relacionados
INSERT INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id,
    tipo_relacion, descripcion, es_obligatorio, created_at, updated_at, is_active
)
SELECT 
    'DOC_CAP_' || c.id || '_' || tipo.tipo_relacion,
    2,
    'capacitacion',
    c.id,
    'DOC' || c.id || '_' || tipo.tipo_relacion,
    tipo.tipo_relacion,
    tipo.descripcion,
    tipo.obligatorio,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
FROM capacitaciones c
CROSS JOIN (
    SELECT 'material' as tipo_relacion, 'Material de capacitación' as descripcion, 1 as obligatorio
    UNION ALL
    SELECT 'presentacion' as tipo_relacion, 'Presentación PowerPoint' as descripcion, 1 as obligatorio
    UNION ALL
    SELECT 'evaluacion' as tipo_relacion, 'Formato de evaluación' as descripcion, 1 as obligatorio
    UNION ALL
    SELECT 'certificado' as tipo_relacion, 'Certificado de participación' as descripcion, 0 as obligatorio
) tipo
WHERE NOT EXISTS (
    SELECT 1 FROM sgc_documentos_relacionados sdr 
    WHERE sdr.entidad_tipo = 'capacitacion' 
    AND sdr.entidad_id = c.id 
    AND sdr.tipo_relacion = tipo.tipo_relacion
);

-- Ejemplo de normas relacionadas (competencias)
INSERT INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id,
    punto_norma, clausula_descripcion, tipo_relacion, nivel_cumplimiento,
    observaciones, created_at, updated_at, is_active
)
SELECT 
    'NOR_CAP_' || c.id || '_' || norma.codigo,
    2,
    'capacitacion',
    c.id,
    norma.norma_id,
    norma.punto_norma,
    norma.clausula_descripcion,
    norma.tipo_relacion,
    'desarrolla',
    norma.observaciones,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
FROM capacitaciones c
CROSS JOIN (
    SELECT 'ISO9001' as norma_id, '7.2' as punto_norma, 'Competencia del personal' as clausula_descripcion, 
           'competencia' as tipo_relacion, 'Desarrolla competencias según ISO 9001' as observaciones, 'COMP_GENERAL' as codigo
    UNION ALL
    SELECT 'ISO9001' as norma_id, '7.3' as punto_norma, 'Toma de conciencia' as clausula_descripcion, 
           'conciencia' as tipo_relacion, 'Desarrolla conciencia sobre calidad' as observaciones, 'CONC_CALIDAD' as codigo
    UNION ALL
    SELECT 'ISO9001' as norma_id, '9.1' as punto_norma, 'Seguimiento y medición' as clausula_descripcion, 
           'habilidad' as tipo_relacion, 'Desarrolla habilidades de medición' as observaciones, 'HAB_MEDICION' as codigo
) norma
WHERE NOT EXISTS (
    SELECT 1 FROM sgc_normas_relacionadas snr 
    WHERE snr.entidad_tipo = 'capacitacion' 
    AND snr.entidad_id = c.id 
    AND snr.tipo_relacion = norma.tipo_relacion
    AND snr.punto_norma = norma.punto_norma
);

-- ===============================================
-- PASO 4: VERIFICAR MIGRACIÓN
-- ===============================================

SELECT 'VERIFICACION_FINAL' as paso;

-- Contar registros después de la migración
SELECT 'SGC_PERSONAL_RELACIONES_CAPACITACION' as tabla, COUNT(*) as registros_nuevos FROM sgc_personal_relaciones WHERE entidad_tipo = 'capacitacion';
SELECT 'SGC_DOCUMENTOS_CAPACITACION' as tabla, COUNT(*) as registros_nuevos FROM sgc_documentos_relacionados WHERE entidad_tipo = 'capacitacion';
SELECT 'SGC_NORMAS_CAPACITACION' as tabla, COUNT(*) as registros_nuevos FROM sgc_normas_relacionadas WHERE entidad_tipo = 'capacitacion';

-- Mostrar resumen por capacitación
SELECT 
    c.id,
    c.nombre as capacitacion,
    COUNT(DISTINCT sp.id) as participantes,
    COUNT(DISTINCT sdr.id) as documentos,
    COUNT(DISTINCT snr.id) as normas_competencias
FROM capacitaciones c
LEFT JOIN sgc_personal_relaciones sp ON c.id = sp.entidad_id AND sp.entidad_tipo = 'capacitacion' AND sp.is_active = 1
LEFT JOIN sgc_documentos_relacionados sdr ON c.id = sdr.entidad_id AND sdr.entidad_tipo = 'capacitacion' AND sdr.is_active = 1
LEFT JOIN sgc_normas_relacionadas snr ON c.id = snr.entidad_id AND snr.entidad_tipo = 'capacitacion' AND snr.is_active = 1
GROUP BY c.id, c.nombre
ORDER BY c.id;

-- Verificar integridad de datos
SELECT 'VERIFICACION_INTEGRIDAD' as verificacion;

-- Capacitaciones sin participantes
SELECT 'CAPACITACIONES_SIN_PARTICIPANTES' as alerta, COUNT(*) as cantidad
FROM capacitaciones c
WHERE NOT EXISTS (
    SELECT 1 FROM sgc_personal_relaciones sp 
    WHERE sp.entidad_tipo = 'capacitacion' 
    AND sp.entidad_id = c.id 
    AND sp.is_active = 1
);

-- Participantes sin personal válido (esto debería ser 0)
SELECT 'PARTICIPANTES_SIN_PERSONAL_VALIDO' as alerta, COUNT(*) as cantidad
FROM sgc_personal_relaciones sp
WHERE sp.entidad_tipo = 'capacitacion'
AND NOT EXISTS (
    SELECT 1 FROM personal p WHERE p.id = sp.personal_id
);

COMMIT;

-- ===============================================
-- NOTAS IMPORTANTES PARA EL BACKEND
-- ===============================================

/*
CAMBIOS NECESARIOS EN EL BACKEND:

1. Actualizar rutas de capacitaciones para usar sgc_personal_relaciones:
   - GET /api/capacitaciones/:id/participantes (en lugar de /asistentes)
   - POST /api/capacitaciones/:id/participantes
   - DELETE /api/capacitaciones/:id/participantes/:participanteId

2. Agregar nuevas rutas SGC:
   - GET /api/capacitaciones/:id/documentos
   - POST /api/capacitaciones/:id/documentos
   - GET /api/capacitaciones/:id/competencias (normas)
   - POST /api/capacitaciones/:id/competencias

3. Usar vistas SGC para consultas optimizadas:
   - v_sgc_personal_relaciones_completos
   - v_sgc_documentos_completos
   - v_sgc_normas_completas

4. Roles específicos para capacitaciones:
   - instructor, facilitador, participante, evaluador

5. Tipos de documentos para capacitaciones:
   - material, presentacion, evaluacion, certificado, registro

6. Tipos de normas/competencias:
   - competencia, conciencia, habilidad, conocimiento
*/

SELECT 'MIGRACION_CAPACITACIONES_SGC_COMPLETADA' as resultado, 
       CURRENT_TIMESTAMP as fecha_migracion;
