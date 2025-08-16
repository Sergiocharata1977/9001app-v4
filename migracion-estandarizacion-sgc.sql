-- ===============================================
-- MIGRACIÓN A SISTEMA ESTANDARIZADO SGC
-- De tablas específicas a tablas genéricas
-- ===============================================

-- ⚠️  IMPORTANTE: Realizar backup antes de ejecutar
-- ⚠️  Probar primero en entorno de desarrollo

-- ===============================================
-- PASO 1: CREAR TABLAS GENÉRICAS
-- ===============================================

-- Ejecutar primero: propuesta-estandarizacion-sgc.sql

-- ===============================================
-- PASO 2: MIGRAR DATOS EXISTENTES
-- ===============================================

-- 👥 MIGRAR minutas_participantes → sgc_participantes
INSERT INTO sgc_participantes (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, justificacion_ausencia, created_at, updated_at, is_active
)
SELECT 
    'part_min_' || mp.id,                    -- Nuevo ID con prefijo
    m.organization_id,                       -- organization_id de la minuta
    'minuta',                                -- entidad_tipo fijo
    mp.minuta_id,                           -- entidad_id (ID de la minuta)
    mp.personal_id,                         -- personal_id (ya correcto)
    mp.rol,                                 -- rol
    mp.asistio,                             -- asistio
    mp.justificacion_ausencia,              -- justificacion_ausencia
    mp.created_at,                          -- created_at
    mp.updated_at,                          -- updated_at
    1                                       -- is_active
FROM minutas_participantes mp
JOIN minutas m ON mp.minuta_id = m.id
WHERE mp.id IS NOT NULL;

-- 📄 MIGRAR minutas_documentos → sgc_documentos_relacionados
INSERT INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id, tipo_relacion,
    descripcion, created_at, updated_at, created_by, updated_by, is_active
)
SELECT 
    'doc_min_' || md.id,                    -- Nuevo ID con prefijo
    m.organization_id,                      -- organization_id de la minuta
    'minuta',                               -- entidad_tipo fijo
    md.minuta_id,                          -- entidad_id (ID de la minuta)
    md.documento_id,                       -- documento_id
    md.tipo_adjunto,                       -- tipo_relacion (tipo_adjunto → tipo_relacion)
    md.descripcion,                        -- descripcion
    md.created_at,                         -- created_at
    md.updated_at,                         -- updated_at
    md.created_by,                         -- created_by
    md.updated_by,                         -- updated_by
    1                                      -- is_active
FROM minutas_documentos md
JOIN minutas m ON md.minuta_id = m.id
WHERE md.id IS NOT NULL;

-- ===============================================
-- PASO 3: MIGRAR RELACIONES EXISTENTES A NORMAS
-- ===============================================

-- 📏 MIGRAR relaciones SGC que involucren normas → sgc_normas_relacionadas
INSERT INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id, 
    tipo_relacion, observaciones, created_at, updated_at, is_active
)
SELECT 
    'nor_rel_' || r.id,                    -- Nuevo ID con prefijo
    r.organization_id,                     -- organization_id
    r.origen_tipo,                         -- entidad_tipo (de donde viene)
    r.origen_id,                           -- entidad_id
    r.destino_id,                          -- norma_id (destino)
    'aplica',                              -- tipo_relacion por defecto
    r.descripcion,                         -- observaciones
    r.fecha_creacion,                      -- created_at
    r.fecha_creacion,                      -- updated_at (igual a created_at)
    1                                      -- is_active
FROM relaciones_sgc r
WHERE r.destino_tipo = 'norma'
AND r.id IS NOT NULL;

-- ===============================================
-- PASO 4: ACTUALIZAR RELACIONES SGC RESTANTES
-- ===============================================

-- Mantener relaciones_sgc solo para relaciones que NO sean:
-- - participantes (ahora en sgc_participantes)
-- - documentos (ahora en sgc_documentos_relacionados)  
-- - normas (ahora en sgc_normas_relacionadas)

-- Las relaciones_sgc seguirán siendo útiles para:
-- - proceso → departamento
-- - proceso → puesto
-- - auditoria → hallazgo
-- - objetivo → medicion
-- - etc.

-- ===============================================
-- PASO 5: CREAR DATOS DE EJEMPLO PARA NUEVOS MÓDULOS
-- ===============================================

-- Ejemplo: Auditoría con participantes
INSERT OR IGNORE INTO sgc_participantes (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, asistio
) VALUES 
('part_aud_001', 2, 'auditoria', 'AUD_001', 'PER_001', 'auditor', 1),
('part_aud_002', 2, 'auditoria', 'AUD_001', 'PER_002', 'auditado', 1),
('part_aud_003', 2, 'auditoria', 'AUD_001', 'PER_003', 'testigo', 0);

-- Ejemplo: Capacitación con documentos
INSERT OR IGNORE INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id, tipo_relacion, descripcion
) VALUES 
('doc_cap_001', 2, 'capacitacion', 'CAP_001', 1, 'material', 'Manual de procedimientos'),
('doc_cap_002', 2, 'capacitacion', 'CAP_001', 2, 'presentacion', 'Slides de la capacitación'),
('doc_cap_003', 2, 'capacitacion', 'CAP_001', 3, 'evaluacion', 'Cuestionario de evaluación');

-- Ejemplo: Revisión por la dirección con normas
INSERT OR IGNORE INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id, punto_norma, 
    tipo_relacion, nivel_cumplimiento, observaciones
) VALUES 
('nor_rev_001', 2, 'revision_direccion', 'REV_001', 1, '9.3', 'revision', 'cumple', 'Revisión por la dirección completa'),
('nor_rev_002', 2, 'revision_direccion', 'REV_001', 1, '5.1', 'revision', 'parcial', 'Liderazgo necesita mejoras'),
('nor_rev_003', 2, 'revision_direccion', 'REV_001', 1, '10.2', 'revision', 'no_cumple', 'Acciones correctivas pendientes');

-- ===============================================
-- PASO 6: VERIFICACIÓN DE MIGRACIÓN
-- ===============================================

-- Verificar migración de participantes
SELECT 
    'MINUTAS_PARTICIPANTES' as origen,
    COUNT(*) as registros_origen
FROM minutas_participantes
UNION ALL
SELECT 
    'SGC_PARTICIPANTES_MINUTAS' as destino,
    COUNT(*) as registros_destino
FROM sgc_participantes 
WHERE entidad_tipo = 'minuta';

-- Verificar migración de documentos
SELECT 
    'MINUTAS_DOCUMENTOS' as origen,
    COUNT(*) as registros_origen
FROM minutas_documentos
UNION ALL
SELECT 
    'SGC_DOCUMENTOS_MINUTAS' as destino,
    COUNT(*) as registros_destino
FROM sgc_documentos_relacionados 
WHERE entidad_tipo = 'minuta';

-- Verificar migración de normas
SELECT 
    'RELACIONES_SGC_NORMAS' as origen,
    COUNT(*) as registros_origen
FROM relaciones_sgc 
WHERE destino_tipo = 'norma'
UNION ALL
SELECT 
    'SGC_NORMAS_RELACIONADAS' as destino,
    COUNT(*) as registros_destino
FROM sgc_normas_relacionadas;

-- ===============================================
-- PASO 7: LIMPIEZA (OPCIONAL - DESPUÉS DE VERIFICAR)
-- ===============================================

-- ⚠️  SOLO DESPUÉS DE VERIFICAR QUE TODO ESTÁ CORRECTO
-- ⚠️  Y DE PROBAR EL SISTEMA CON LAS NUEVAS TABLAS

/*
-- Renombrar tablas antiguas como backup
ALTER TABLE minutas_participantes RENAME TO minutas_participantes_backup;
ALTER TABLE minutas_documentos RENAME TO minutas_documentos_backup;

-- Eliminar relaciones migradas de relaciones_sgc
DELETE FROM relaciones_sgc WHERE destino_tipo = 'norma';

-- Después de un período de prueba exitoso, eliminar backups:
-- DROP TABLE minutas_participantes_backup;
-- DROP TABLE minutas_documentos_backup;
*/

-- ===============================================
-- TRIGGERS PARA MANTENER CONSISTENCIA
-- ===============================================

-- Trigger para actualizar updated_at en sgc_participantes
CREATE TRIGGER IF NOT EXISTS trigger_sgc_participantes_updated_at
AFTER UPDATE ON sgc_participantes
FOR EACH ROW
BEGIN
    UPDATE sgc_participantes 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en sgc_documentos_relacionados
CREATE TRIGGER IF NOT EXISTS trigger_sgc_documentos_updated_at
AFTER UPDATE ON sgc_documentos_relacionados
FOR EACH ROW
BEGIN
    UPDATE sgc_documentos_relacionados 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en sgc_normas_relacionadas
CREATE TRIGGER IF NOT EXISTS trigger_sgc_normas_updated_at
AFTER UPDATE ON sgc_normas_relacionadas
FOR EACH ROW
BEGIN
    UPDATE sgc_normas_relacionadas 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;
