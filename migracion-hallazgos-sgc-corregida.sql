-- ===============================================
-- MIGRACIÓN HALLAZGOS AL SISTEMA SGC ESTANDARIZADO
-- Script corregido que usa las tablas SGC existentes
-- ===============================================

BEGIN TRANSACTION;

-- ===============================================
-- PASO 1: AGREGAR COLUMNAS FALTANTES A HALLAZGOS
-- ===============================================

-- Agregar columnas que faltan en la tabla hallazgos actual
ALTER TABLE hallazgos ADD COLUMN categoria TEXT DEFAULT 'no_conformidad';
ALTER TABLE hallazgos ADD COLUMN severidad TEXT DEFAULT 'media';
ALTER TABLE hallazgos ADD COLUMN accion_inmediata TEXT;
ALTER TABLE hallazgos ADD COLUMN causa_raiz TEXT;
ALTER TABLE hallazgos ADD COLUMN plan_accion TEXT;
ALTER TABLE hallazgos ADD COLUMN evidencia_cierre TEXT;
ALTER TABLE hallazgos ADD COLUMN verificacion_eficacia TEXT;
ALTER TABLE hallazgos ADD COLUMN datos_adicionales TEXT;

-- ===============================================
-- PASO 2: CREAR ÍNDICES ADICIONALES
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_hallazgos_categoria ON hallazgos(categoria);
CREATE INDEX IF NOT EXISTS idx_hallazgos_severidad ON hallazgos(severidad);
CREATE INDEX IF NOT EXISTS idx_hallazgos_fecha_registro ON hallazgos(fecha_deteccion);

-- ===============================================
-- PASO 3: INSERTAR DATOS DE EJEMPLO EN HALLAZGOS
-- ===============================================

-- Hallazgo 1: No conformidad en documentación
INSERT OR REPLACE INTO hallazgos (
    id, organization_id, numeroHallazgo, titulo, descripcion, estado, 
    fecha_deteccion, origen, categoria, prioridad, severidad, 
    tipo_hallazgo, requisito_incumplido, accion_inmediata, causa_raiz
) VALUES (
    'HAL_2024_001', 2, 'HAL-2024-001', 
    'Documentación de procedimientos desactualizada',
    'Los procedimientos de calidad no reflejan los cambios implementados en el proceso de producción',
    'deteccion', '2024-01-15', 'auditoria_interna', 'no_conformidad', 'alta', 'alta',
    'hallazgo', '4.2.3 Control de documentos', 
    'Suspender uso de procedimientos desactualizados',
    'Falta de proceso de actualización documental'
);

-- Hallazgo 2: Oportunidad de mejora
INSERT OR REPLACE INTO hallazgos (
    id, organization_id, numeroHallazgo, titulo, descripcion, estado, 
    fecha_deteccion, origen, categoria, prioridad, severidad, 
    tipo_hallazgo, requisito_incumplido, accion_inmediata, causa_raiz
) VALUES (
    'HAL_2024_002', 2, 'HAL-2024-002', 
    'Mejora en el sistema de indicadores',
    'Los indicadores actuales no proporcionan información suficiente para la toma de decisiones',
    'deteccion', '2024-01-20', 'revision_direccion', 'oportunidad_mejora', 'media', 'media',
    'hallazgo', '9.1.3 Análisis y evaluación', 
    'Revisar indicadores existentes',
    'Indicadores no alineados con objetivos estratégicos'
);

-- Hallazgo 3: Observación menor
INSERT OR REPLACE INTO hallazgos (
    id, organization_id, numeroHallazgo, titulo, descripcion, estado, 
    fecha_deteccion, origen, categoria, prioridad, severidad, 
    tipo_hallazgo, requisito_incumplido, accion_inmediata, causa_raiz
) VALUES (
    'HAL_2024_003', 2, 'HAL-2024-003', 
    'Mejora en la señalización de áreas',
    'Algunas áreas de trabajo carecen de señalización adecuada de seguridad',
    'deteccion', '2024-01-25', 'auditoria_interna', 'observacion', 'baja', 'baja',
    'hallazgo', '7.1.4 Ambiente para la operación', 
    'Identificar áreas sin señalización',
    'Falta de proceso de mantenimiento de señalización'
);

-- ===============================================
-- PASO 4: INSERTAR PARTICIPANTES SGC PARA HALLAZGOS
-- ===============================================

-- Participantes para Hallazgo 1
INSERT OR REPLACE INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, observaciones, datos_adicionales
) VALUES 
('part_hal_001_1', 2, 'hallazgo', 'HAL_2024_001', 'PER_JUAN', 'responsable', 1, 
 'Asignado como responsable de la corrección', '{"fecha_asignacion": "2024-01-15"}'),
('part_hal_001_2', 2, 'hallazgo', 'HAL_2024_001', 'PER_MARIA', 'auditor', 1, 
 'Auditor que detectó el hallazgo', '{"fecha_deteccion": "2024-01-15"}'),
('part_hal_001_3', 2, 'hallazgo', 'HAL_2024_001', 'PER_CARLOS', 'supervisor', 1, 
 'Supervisor del área afectada', '{"area": "produccion"}');

-- Participantes para Hallazgo 2
INSERT OR REPLACE INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, observaciones, datos_adicionales
) VALUES 
('part_hal_002_1', 2, 'hallazgo', 'HAL_2024_002', 'PER_ANA', 'responsable', 1, 
 'Responsable de mejora de indicadores', '{"fecha_asignacion": "2024-01-20"}'),
('part_hal_002_2', 2, 'hallazgo', 'HAL_2024_002', 'PER_LUIS', 'analista', 1, 
 'Analista de datos', '{"especialidad": "indicadores"}');

-- Participantes para Hallazgo 3
INSERT OR REPLACE INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, observaciones, datos_adicionales
) VALUES 
('part_hal_003_1', 2, 'hallazgo', 'HAL_2024_003', 'PER_PEDRO', 'responsable', 1, 
 'Responsable de mantenimiento', '{"fecha_asignacion": "2024-01-25"}');

-- ===============================================
-- PASO 5: INSERTAR NORMAS RELACIONADAS SGC
-- ===============================================

-- Normas para Hallazgo 1 (Documentación)
INSERT OR REPLACE INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id, punto_norma,
    clausula_descripcion, tipo_relacion, nivel_cumplimiento, observaciones
) VALUES 
('nor_hal_001_1', 2, 'hallazgo', 'HAL_2024_001', 1, '4.2.3',
 'Control de documentos', 'afectado', 'no_cumple', 
 'Documentos desactualizados no cumplen requisito de control'),
('nor_hal_001_2', 2, 'hallazgo', 'HAL_2024_001', 1, '4.2.4',
 'Control de registros', 'relacionado', 'cumple_parcial', 
 'Registros están controlados pero documentos no');

-- Normas para Hallazgo 2 (Indicadores)
INSERT OR REPLACE INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id, punto_norma,
    clausula_descripcion, tipo_relacion, nivel_cumplimiento, observaciones
) VALUES 
('nor_hal_002_1', 2, 'hallazgo', 'HAL_2024_002', 1, '9.1.3',
 'Análisis y evaluación', 'afectado', 'cumple_parcial', 
 'Indicadores existen pero no son suficientes'),
('nor_hal_002_2', 2, 'hallazgo', 'HAL_2024_002', 1, '6.1.1',
 'Acciones para abordar riesgos y oportunidades', 'relacionado', 'cumple', 
 'Riesgos identificados pero indicadores no los monitorean');

-- Normas para Hallazgo 3 (Ambiente)
INSERT OR REPLACE INTO sgc_normas_relacionadas (
    id, organization_id, entidad_tipo, entidad_id, norma_id, punto_norma,
    clausula_descripcion, tipo_relacion, nivel_cumplimiento, observaciones
) VALUES 
('nor_hal_003_1', 2, 'hallazgo', 'HAL_2024_003', 1, '7.1.4',
 'Ambiente para la operación', 'afectado', 'cumple_parcial', 
 'Ambiente operativo pero falta señalización');

-- ===============================================
-- PASO 6: INSERTAR DOCUMENTOS RELACIONADOS SGC
-- ===============================================

-- Documentos para Hallazgo 1
INSERT OR REPLACE INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id, tipo_relacion,
    descripcion, es_obligatorio, datos_adicionales
) VALUES 
('doc_hal_001_1', 2, 'hallazgo', 'HAL_2024_001', 1, 'evidencia',
 'Procedimientos desactualizados', 1, '{"fecha_revision": "2023-06-15"}'),
('doc_hal_001_2', 2, 'hallazgo', 'HAL_2024_001', 2, 'plan_correccion',
 'Plan de actualización documental', 1, '{"fecha_creacion": "2024-01-16"}');

-- Documentos para Hallazgo 2
INSERT OR REPLACE INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id, tipo_relacion,
    descripcion, es_obligatorio, datos_adicionales
) VALUES 
('doc_hal_002_1', 2, 'hallazgo', 'HAL_2024_002', 3, 'analisis',
 'Análisis de indicadores actuales', 1, '{"fecha_analisis": "2024-01-21"}');

-- Documentos para Hallazgo 3
INSERT OR REPLACE INTO sgc_documentos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, documento_id, tipo_relacion,
    descripcion, es_obligatorio, datos_adicionales
) VALUES 
('doc_hal_003_1', 2, 'hallazgo', 'HAL_2024_003', 4, 'inventario',
 'Inventario de señalización faltante', 1, '{"fecha_inventario": "2024-01-26"}');

-- ===============================================
-- PASO 7: CREAR VISTA PARA HALLAZGOS COMPLETOS
-- ===============================================

CREATE VIEW IF NOT EXISTS v_hallazgos_completos AS
SELECT 
    h.*,
    -- Participantes
    GROUP_CONCAT(DISTINCT sp.personal_id) as participantes_ids,
    GROUP_CONCAT(DISTINCT sp.rol) as roles_participantes,
    -- Documentos
    GROUP_CONCAT(DISTINCT sdr.documento_id) as documentos_ids,
    GROUP_CONCAT(DISTINCT sdr.tipo_relacion) as tipos_documentos,
    -- Normas
    GROUP_CONCAT(DISTINCT snr.punto_norma) as puntos_norma,
    GROUP_CONCAT(DISTINCT snr.nivel_cumplimiento) as niveles_cumplimiento
FROM hallazgos h
LEFT JOIN sgc_personal_relaciones sp ON h.id = sp.entidad_id AND sp.entidad_tipo = 'hallazgo'
LEFT JOIN sgc_documentos_relacionados sdr ON h.id = sdr.entidad_id AND sdr.entidad_tipo = 'hallazgo'
LEFT JOIN sgc_normas_relacionadas snr ON h.id = snr.entidad_id AND snr.entidad_tipo = 'hallazgo'
WHERE h.organization_id = sp.organization_id 
   OR h.organization_id = sdr.organization_id 
   OR h.organization_id = snr.organization_id
GROUP BY h.id;

-- ===============================================
-- PASO 8: CREAR TRIGGER PARA ACTUALIZAR FECHAS
-- ===============================================

CREATE TRIGGER IF NOT EXISTS tr_hallazgos_updated_at
AFTER UPDATE ON hallazgos
BEGIN
    UPDATE hallazgos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

COMMIT;

-- ===============================================
-- VERIFICACIÓN FINAL
-- ===============================================

-- Verificar hallazgos creados
SELECT 'Hallazgos creados:' as info, COUNT(*) as total FROM hallazgos WHERE organization_id = 2;

-- Verificar personal relaciones SGC
SELECT 'Participantes SGC:' as info, COUNT(*) as total FROM sgc_personal_relaciones WHERE entidad_tipo = 'hallazgo' AND organization_id = 2;

-- Verificar normas relacionadas
SELECT 'Normas relacionadas:' as info, COUNT(*) as total FROM sgc_normas_relacionadas WHERE entidad_tipo = 'hallazgo' AND organization_id = 2;

-- Verificar documentos relacionados
SELECT 'Documentos relacionados:' as info, COUNT(*) as total FROM sgc_documentos_relacionados WHERE entidad_tipo = 'hallazgo' AND organization_id = 2;
