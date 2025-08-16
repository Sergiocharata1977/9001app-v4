-- ===============================================
-- MIGRACIÓN HALLAZGOS AL SISTEMA SGC ESTANDARIZADO
-- Script completo para integrar hallazgos con tablas SGC
-- ===============================================

-- ⚠️  IMPORTANTE: 
-- 1. Realizar backup completo antes de ejecutar
-- 2. Ejecutar en entorno de desarrollo primero
-- 3. Verificar cada paso antes de continuar

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: CREAR TABLA HALLAZGOS COMPLETA
-- ===============================================

-- Crear tabla hallazgos con estructura completa
CREATE TABLE IF NOT EXISTS hallazgos (
    id TEXT PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    
    -- Información básica
    numeroHallazgo TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    origen TEXT, -- 'auditoria_interna', 'auditoria_externa', 'revision_direccion', 'proceso', 'cliente', 'proveedor'
    categoria TEXT, -- 'no_conformidad', 'oportunidad_mejora', 'observacion'
    
    -- Punto de norma afectado
    punto_norma_afectado TEXT, -- Ej: "8.5.1", "7.2", etc.
    requisito_incumplido TEXT,
    
    -- Estados del workflow
    estado TEXT NOT NULL DEFAULT 'deteccion', -- Ver workflow states
    orden INTEGER DEFAULT 0,
    
    -- Fechas del proceso
    fecha_deteccion TEXT DEFAULT CURRENT_TIMESTAMP,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    fecha_planificacion TEXT,
    fecha_ejecucion TEXT,
    fecha_verificacion TEXT,
    fecha_cierre TEXT,
    
    -- Información de responsabilidad (DEPRECATED - usar sgc_participantes)
    responsable_id TEXT, -- Temporal para migración
    auditor_id TEXT,     -- Temporal para migración
    
    -- Prioridad y severidad
    prioridad TEXT DEFAULT 'media', -- 'alta', 'media', 'baja'
    severidad TEXT DEFAULT 'media', -- 'critica', 'alta', 'media', 'baja'
    tipo TEXT DEFAULT 'hallazgo',
    
    -- Campos del proceso
    accion_inmediata TEXT,
    causa_raiz TEXT,
    plan_accion TEXT,
    evidencia_cierre TEXT,
    verificacion_eficacia TEXT,
    
    -- Campos adicionales para flexibilidad
    datos_adicionales TEXT, -- JSON para campos específicos
    
    -- Auditoría estándar
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    
    -- Restricciones
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (auditor_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===============================================
-- PASO 2: CREAR ÍNDICES PARA HALLAZGOS
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_hallazgos_organization_id ON hallazgos(organization_id);
CREATE INDEX IF NOT EXISTS idx_hallazgos_estado ON hallazgos(estado);
CREATE INDEX IF NOT EXISTS idx_hallazgos_fecha_deteccion ON hallazgos(fecha_deteccion);
CREATE INDEX IF NOT EXISTS idx_hallazgos_responsable_id ON hallazgos(responsable_id);
CREATE INDEX IF NOT EXISTS idx_hallazgos_punto_norma ON hallazgos(punto_norma_afectado);
CREATE INDEX IF NOT EXISTS idx_hallazgos_categoria ON hallazgos(categoria);
CREATE INDEX IF NOT EXISTS idx_hallazgos_prioridad ON hallazgos(prioridad);
CREATE INDEX IF NOT EXISTS idx_hallazgos_numero ON hallazgos(numeroHallazgo);

-- ===============================================
-- PASO 3: INSERTAR DATOS DE EJEMPLO (MIGRACIÓN MOCK DATA)
-- ===============================================

-- Insertar hallazgos de ejemplo con estructura completa
INSERT OR REPLACE INTO hallazgos (
    id, organization_id, numeroHallazgo, titulo, descripcion, estado, 
    fecha_deteccion, responsable_id, categoria, prioridad, severidad, 
    origen, punto_norma_afectado, requisito_incumplido, tipo
) VALUES 
(
    'HALL_001', 1, 'HAL-2024-001',
    'Documentación incompleta en proceso de auditoría',
    'Se encontró que la documentación del proceso de auditoría interna no está completa según los requisitos de la norma ISO 9001.',
    'deteccion',
    '2024-01-15T10:30:00Z',
    'PER_001', -- Referencia a personal (temporal)
    'no_conformidad',
    'media',
    'media',
    'auditoria_interna',
    '9.2.2',
    'Documentación de auditoría incompleta',
    'hallazgo'
),
(
    'HALL_002', 1, 'HAL-2024-002',
    'Falta de capacitación en nuevos procedimientos',
    'El personal del departamento de producción no ha recibido la capacitación necesaria sobre los nuevos procedimientos implementados.',
    'planificacion_ai',
    '2024-01-20T14:15:00Z',
    'PER_002',
    'no_conformidad',
    'alta',
    'alta',
    'proceso',
    '7.2',
    'Competencia del personal',
    'hallazgo'
),
(
    'HALL_003', 1, 'HAL-2024-003',
    'Indicadores de calidad no actualizados',
    'Los indicadores de calidad del último trimestre no han sido actualizados en el sistema de gestión.',
    'ejecucion_ai',
    '2024-01-25T09:45:00Z',
    'PER_003',
    'oportunidad_mejora',
    'baja',
    'baja',
    'revision_direccion',
    '9.1.1',
    'Seguimiento y medición',
    'hallazgo'
),
(
    'HALL_004', 1, 'HAL-2024-004',
    'Equipos de medición sin calibración',
    'Se detectó que varios equipos de medición utilizados en el control de calidad no tienen calibración vigente.',
    'verificacion_cierre',
    '2024-01-30T16:20:00Z',
    'PER_004',
    'no_conformidad',
    'alta',
    'critica',
    'auditoria_externa',
    '7.1.5',
    'Recursos de seguimiento y medición',
    'hallazgo'
);

-- ===============================================
-- PASO 4: INTEGRACIÓN CON SISTEMA SGC
-- ===============================================

-- 4.1 CREAR PARTICIPANTES SGC PARA HALLAZGOS EXISTENTES
INSERT OR IGNORE INTO sgc_participantes (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol,
    observaciones, created_at, updated_at, is_active
)
SELECT 
    'PART_HAL_' || h.id || '_RESP',
    h.organization_id,
    'hallazgo',
    h.id,
    h.responsable_id,
    'responsable',
    'Responsable principal del hallazgo',
    h.created_at,
    h.updated_at,
    1
FROM hallazgos h
WHERE h.responsable_id IS NOT NULL AND h.is_active = 1;

-- 4.2 CREAR AUDITORES SGC PARA HALLAZGOS
INSERT OR IGNORE INTO sgc_participantes (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol,
    observaciones, created_at, updated_at, is_active
)
SELECT 
    'PART_HAL_' || h.id || '_AUD',
    h.organization_id,
    'hallazgo',
    h.id,
    h.auditor_id,
    'auditor',
    'Auditor que detectó el hallazgo',
    h.created_at,
    h.updated_at,
    1
FROM hallazgos h
WHERE h.auditor_id IS NOT NULL AND h.is_active = 1;

-- 4.3 CREAR NORMAS SGC PARA HALLAZGOS EXISTENTES
INSERT OR IGNORE INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id,
    punto_norma, clausula_descripcion, tipo_relacion, nivel_cumplimiento,
    observaciones, acciones_requeridas, created_at, updated_at, is_active
)
SELECT 
    'NOR_HAL_' || h.id,
    h.organization_id,
    'hallazgo',
    h.id,
    1, -- ISO 9001 (asumiendo ID 1)
    h.punto_norma_afectado,
    h.requisito_incumplido,
    CASE 
        WHEN h.categoria = 'no_conformidad' THEN 'no_conformidad'
        WHEN h.categoria = 'oportunidad_mejora' THEN 'oportunidad_mejora'
        ELSE 'observacion'
    END,
    CASE 
        WHEN h.estado IN ('deteccion', 'd1_iniciado') THEN 'no_cumple'
        WHEN h.estado IN ('verificacion_cierre', 'd5_verificacion_eficacia_realizada') THEN 'cumple'
        ELSE 'en_proceso'
    END,
    h.descripcion,
    h.plan_accion,
    h.created_at,
    h.updated_at,
    1
FROM hallazgos h
WHERE h.punto_norma_afectado IS NOT NULL AND h.is_active = 1;

-- ===============================================
-- PASO 5: VISTAS PARA CONSULTAS SGC INTEGRADAS
-- ===============================================

-- Vista principal de hallazgos con datos SGC
CREATE VIEW IF NOT EXISTS v_hallazgos_sgc AS
SELECT 
    h.*,
    
    -- Contadores SGC
    COALESCE(participantes.total, 0) as total_participantes,
    COALESCE(participantes.responsables, 0) as total_responsables,
    COALESCE(participantes.auditores, 0) as total_auditores,
    COALESCE(documentos.total, 0) as total_documentos,
    COALESCE(documentos.evidencias, 0) as total_evidencias,
    COALESCE(normas.total, 0) as total_normas,
    
    -- Nombres de responsables
    resp.nombre_completo as responsable_nombre,
    aud.nombre_completo as auditor_nombre

FROM hallazgos h
LEFT JOIN (
    SELECT 
        entidad_id, 
        COUNT(*) as total,
        COUNT(CASE WHEN rol = 'responsable' THEN 1 END) as responsables,
        COUNT(CASE WHEN rol = 'auditor' THEN 1 END) as auditores
    FROM sgc_participantes 
    WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
    GROUP BY entidad_id
) participantes ON h.id = participantes.entidad_id

LEFT JOIN (
    SELECT 
        entidad_id, 
        COUNT(*) as total,
        COUNT(CASE WHEN tipo_relacion = 'evidencia' THEN 1 END) as evidencias
    FROM sgc_documentos_relacionados 
    WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
    GROUP BY entidad_id
) documentos ON h.id = documentos.entidad_id

LEFT JOIN (
    SELECT entidad_id, COUNT(*) as total 
    FROM sgc_normas_relacionadas 
    WHERE entidad_tipo = 'hallazgo' AND is_active = 1 
    GROUP BY entidad_id
) normas ON h.id = normas.entidad_id

LEFT JOIN personal resp ON h.responsable_id = resp.id
LEFT JOIN personal aud ON h.auditor_id = aud.id

WHERE h.is_active = 1;

-- Vista de estadísticas de hallazgos
CREATE VIEW IF NOT EXISTS v_hallazgos_stats AS
SELECT 
    COUNT(*) as total_hallazgos,
    COUNT(CASE WHEN estado = 'deteccion' THEN 1 END) as en_deteccion,
    COUNT(CASE WHEN estado IN ('planificacion_ai', 'ejecucion_ai') THEN 1 END) as en_tratamiento,
    COUNT(CASE WHEN estado = 'verificacion_cierre' THEN 1 END) as en_verificacion,
    COUNT(CASE WHEN estado LIKE '%finalizado%' OR estado LIKE '%cerrado%' THEN 1 END) as cerrados,
    
    -- Por prioridad
    COUNT(CASE WHEN prioridad = 'alta' THEN 1 END) as prioridad_alta,
    COUNT(CASE WHEN prioridad = 'media' THEN 1 END) as prioridad_media,
    COUNT(CASE WHEN prioridad = 'baja' THEN 1 END) as prioridad_baja,
    
    -- Por categoría
    COUNT(CASE WHEN categoria = 'no_conformidad' THEN 1 END) as no_conformidades,
    COUNT(CASE WHEN categoria = 'oportunidad_mejora' THEN 1 END) as oportunidades_mejora,
    COUNT(CASE WHEN categoria = 'observacion' THEN 1 END) as observaciones,
    
    -- Por origen
    COUNT(CASE WHEN origen = 'auditoria_interna' THEN 1 END) as auditoria_interna,
    COUNT(CASE WHEN origen = 'auditoria_externa' THEN 1 END) as auditoria_externa,
    COUNT(CASE WHEN origen = 'revision_direccion' THEN 1 END) as revision_direccion

FROM hallazgos 
WHERE is_active = 1;

-- ===============================================
-- PASO 6: TRIGGERS PARA MANTENER CONSISTENCIA
-- ===============================================

-- Trigger para actualizar updated_at en hallazgos
CREATE TRIGGER IF NOT EXISTS trigger_hallazgos_updated_at
AFTER UPDATE ON hallazgos
FOR EACH ROW
BEGIN
    UPDATE hallazgos 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Trigger para generar número automático de hallazgo
CREATE TRIGGER IF NOT EXISTS trigger_hallazgos_numero_auto
AFTER INSERT ON hallazgos
FOR EACH ROW
WHEN NEW.numeroHallazgo IS NULL
BEGIN
    UPDATE hallazgos 
    SET numeroHallazgo = 'HAL-' || strftime('%Y', 'now') || '-' || 
                         printf('%03d', (SELECT COUNT(*) FROM hallazgos WHERE strftime('%Y', created_at) = strftime('%Y', 'now')))
    WHERE id = NEW.id;
END;

COMMIT;

-- ===============================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ===============================================

-- Mostrar resumen de la migración
SELECT 'HALLAZGOS TOTALES' as categoria, COUNT(*) as cantidad FROM hallazgos WHERE is_active = 1
UNION ALL
SELECT 'PARTICIPANTES SGC', COUNT(*) FROM sgc_participantes WHERE entidad_tipo = 'hallazgo' AND is_active = 1
UNION ALL
SELECT 'NORMAS SGC', COUNT(*) FROM sgc_normas_relacionadas WHERE entidad_tipo = 'hallazgo' AND is_active = 1
UNION ALL
SELECT 'DOCUMENTOS SGC', COUNT(*) FROM sgc_documentos_relacionados WHERE entidad_tipo = 'hallazgo' AND is_active = 1;

-- Verificar integridad de datos
SELECT 
    'HALLAZGOS SIN RESPONSABLE' as verificacion,
    COUNT(*) as cantidad
FROM hallazgos h 
LEFT JOIN sgc_participantes p ON p.entidad_tipo = 'hallazgo' AND p.entidad_id = h.id AND p.rol = 'responsable'
WHERE h.is_active = 1 AND p.id IS NULL;

-- ===============================================
-- FIN DE MIGRACIÓN HALLAZGOS SGC
-- ===============================================
