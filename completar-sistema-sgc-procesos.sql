-- ===============================================
-- COMPLETAR SISTEMA SGC - TABLA DE PROCESOS
-- Crear la 4ta tabla faltante para completar el sistema
-- ===============================================

-- 👥 TABLA GENÉRICA DE PROCESOS RELACIONADOS
CREATE TABLE IF NOT EXISTS sgc_procesos_relacionados (
    id TEXT PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    
    -- Identifica el módulo/proceso padre
    entidad_tipo TEXT NOT NULL,        -- 'auditoria', 'capacitacion', 'revision_direccion', 'hallazgo', etc.
    entidad_id TEXT NOT NULL,          -- ID del registro específico
    
    -- Información del proceso relacionado
    proceso_id INTEGER NOT NULL,       -- Referencia a tabla procesos
    tipo_relacion TEXT DEFAULT 'involucra', -- 'involucra', 'depende_de', 'alimenta', 'controla', 'soporta', etc.
    descripcion TEXT,
    nivel_importancia TEXT DEFAULT 'media', -- 'alta', 'media', 'baja'
    
    -- Campos específicos adicionales (JSON para flexibilidad)
    datos_adicionales TEXT,            -- JSON: {"frecuencia": "diaria", "responsable": "Juan Pérez", etc.}
    
    -- Auditoría
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    
    -- Restricciones
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (proceso_id) REFERENCES procesos(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Evitar duplicados
    UNIQUE(organization_id, entidad_tipo, entidad_id, proceso_id, tipo_relacion)
);

-- ===============================================
-- CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ===============================================

-- Índices para sgc_procesos_relacionados
CREATE INDEX IF NOT EXISTS idx_sgc_procesos_organization_id ON sgc_procesos_relacionados(organization_id);
CREATE INDEX IF NOT EXISTS idx_sgc_procesos_entidad ON sgc_procesos_relacionados(entidad_tipo, entidad_id);
CREATE INDEX IF NOT EXISTS idx_sgc_procesos_proceso_id ON sgc_procesos_relacionados(proceso_id);
CREATE INDEX IF NOT EXISTS idx_sgc_procesos_tipo ON sgc_procesos_relacionados(tipo_relacion);
CREATE INDEX IF NOT EXISTS idx_sgc_procesos_importancia ON sgc_procesos_relacionados(nivel_importancia);

-- ===============================================
-- CREAR VISTA PARA CONSULTAS COMPLETAS
-- ===============================================

-- Vista para procesos relacionados con información completa
CREATE VIEW IF NOT EXISTS v_sgc_procesos_completos AS
SELECT 
    spr.*,
    p.nombre as proceso_nombre,
    p.descripcion as proceso_descripcion,
    p.tipo as proceso_tipo,
    p.estado as proceso_estado
FROM sgc_procesos_relacionados spr
JOIN procesos p ON spr.proceso_id = p.id
WHERE spr.is_active = 1;

-- ===============================================
-- CREAR TRIGGER PARA MANTENIMIENTO
-- ===============================================

-- Trigger para actualizar updated_at en sgc_procesos_relacionados
CREATE TRIGGER IF NOT EXISTS trigger_sgc_procesos_updated_at
AFTER UPDATE ON sgc_procesos_relacionados
FOR EACH ROW
BEGIN
    UPDATE sgc_procesos_relacionados 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- ===============================================
-- INSERTAR DATOS DE EJEMPLO
-- ===============================================

-- Verificar que existen datos base antes de insertar ejemplos
INSERT OR IGNORE INTO sgc_procesos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, proceso_id, tipo_relacion, 
    descripcion, nivel_importancia, datos_adicionales
) 
SELECT 
    'proc_test_001', 2, 'auditoria', 'AUD_TEST_001', 1, 'involucra', 
    'Proceso de gestión de calidad involucrado en la auditoría', 'alta', 
    '{"frecuencia": "semanal", "responsable": "Gerente de Calidad"}'
WHERE EXISTS (SELECT 1 FROM procesos WHERE id = 1 LIMIT 1);

INSERT OR IGNORE INTO sgc_procesos_relacionados (
    id, organization_id, entidad_tipo, entidad_id, proceso_id, tipo_relacion, 
    descripcion, nivel_importancia, datos_adicionales
) 
SELECT 
    'proc_test_002', 2, 'capacitacion', 'CAP_TEST_001', 2, 'soporta', 
    'Proceso de recursos humanos que soporta la capacitación', 'media', 
    '{"frecuencia": "mensual", "responsable": "RRHH"}'
WHERE EXISTS (SELECT 1 FROM procesos WHERE id = 2 LIMIT 1);

-- ===============================================
-- VERIFICACIONES DE INTEGRIDAD
-- ===============================================

-- Verificar creación de tabla
SELECT 
    'VERIFICACION_TABLA_PROCESOS' as tabla,
    COUNT(*) as registros_creados
FROM sgc_procesos_relacionados;

-- Verificar vista
SELECT 
    'VERIFICACION_VISTA_PROCESOS' as vista,
    COUNT(*) as registros_vista
FROM v_sgc_procesos_completos;

-- ===============================================
-- RESUMEN DEL SISTEMA SGC COMPLETO
-- ===============================================

SELECT 
    'SISTEMA_SGC_COMPLETO' as estado,
    '✅ Implementado' as resultado,
    datetime('now') as fecha_implementacion;

-- Verificar todas las tablas SGC
SELECT 
    'TABLAS_SGC_DISPONIBLES' as tipo,
    'sgc_personal_relaciones' as tabla,
    (SELECT COUNT(*) FROM sgc_personal_relaciones) as registros
UNION ALL
SELECT 'TABLAS_SGC_DISPONIBLES', 'sgc_documentos_relacionados', (SELECT COUNT(*) FROM sgc_documentos_relacionados)
UNION ALL
SELECT 'TABLAS_SGC_DISPONIBLES', 'sgc_normas_relacionadas', (SELECT COUNT(*) FROM sgc_normas_relacionadas)
UNION ALL
SELECT 'TABLAS_SGC_DISPONIBLES', 'sgc_procesos_relacionados', (SELECT COUNT(*) FROM sgc_procesos_relacionados);

-- Verificar todas las vistas SGC
SELECT 
    'VISTAS_SGC_DISPONIBLES' as tipo,
    name as vista
FROM sqlite_master 
WHERE type='view' AND name LIKE '%sgc%'
ORDER BY name;
