-- ===============================================
-- CORREGIR TABLA SGC_PERSONAL_RELACIONES
-- Script para corregir las foreign keys y estructura
-- ===============================================

-- ===============================================
-- ETAPA 1: ELIMINAR TABLA ACTUAL
-- ===============================================

-- Eliminar vistas que dependen de la tabla
DROP VIEW IF EXISTS v_sgc_participantes_completos;
DROP VIEW IF EXISTS v_sgc_personal_relaciones_completos;

-- Eliminar la tabla actual
DROP TABLE IF EXISTS sgc_personal_relaciones;

-- ===============================================
-- ETAPA 2: CREAR TABLA CORREGIDA
-- ===============================================

CREATE TABLE sgc_personal_relaciones (
    id TEXT PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    entidad_tipo TEXT NOT NULL, -- 'minuta', 'auditoria', 'hallazgo', 'capacitacion', etc.
    entidad_id TEXT NOT NULL,   -- ID específico del registro
    personal_id TEXT NOT NULL,  -- Referencia al personal (TEXT, no INTEGER)
    rol TEXT NOT NULL,          -- 'responsable', 'participante', 'auditor', 'evaluador', etc.
    asistio INTEGER DEFAULT 1,  -- 1 = asistió, 0 = no asistió
    justificacion_ausencia TEXT,
    observaciones TEXT,
    datos_adicionales TEXT,     -- JSON para campos específicos
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    
    -- Restricciones CORREGIDAS
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (personal_id) REFERENCES personal(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,  -- usuarios, no users
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,  -- usuarios, no users
    
    -- Índices únicos
    UNIQUE(entidad_tipo, entidad_id, personal_id, organization_id)
);

-- ===============================================
-- ETAPA 3: CREAR ÍNDICES
-- ===============================================

CREATE INDEX idx_sgc_personal_relaciones_organization_id ON sgc_personal_relaciones(organization_id);
CREATE INDEX idx_sgc_personal_relaciones_entidad_tipo ON sgc_personal_relaciones(entidad_tipo);
CREATE INDEX idx_sgc_personal_relaciones_entidad_id ON sgc_personal_relaciones(entidad_id);
CREATE INDEX idx_sgc_personal_relaciones_personal_id ON sgc_personal_relaciones(personal_id);
CREATE INDEX idx_sgc_personal_relaciones_rol ON sgc_personal_relaciones(rol);
CREATE INDEX idx_sgc_personal_relaciones_asistio ON sgc_personal_relaciones(asistio);
CREATE INDEX idx_sgc_personal_relaciones_created_at ON sgc_personal_relaciones(created_at);
CREATE INDEX idx_sgc_personal_relaciones_is_active ON sgc_personal_relaciones(is_active);

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_sgc_personal_relaciones_entidad ON sgc_personal_relaciones(entidad_tipo, entidad_id);
CREATE INDEX idx_sgc_personal_relaciones_org_entidad ON sgc_personal_relaciones(organization_id, entidad_tipo, entidad_id);

-- ===============================================
-- ETAPA 4: CREAR VISTAS CORREGIDAS
-- ===============================================

-- Vista principal con información completa del personal (usando nombres correctos)
CREATE VIEW v_sgc_personal_relaciones_completos AS
SELECT 
    spr.*,
    p.nombres as nombre_personal,        -- nombres, no nombre
    p.apellidos as apellido_personal,    -- apellidos, no apellido
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

-- Vista de compatibilidad temporal
CREATE VIEW v_sgc_participantes_completos AS
SELECT * FROM v_sgc_personal_relaciones_completos;

-- ===============================================
-- ETAPA 5: INSERTAR DATOS DE EJEMPLO CORREGIDOS
-- ===============================================

-- Ejemplo: Participantes de minuta (usando IDs reales de personal)
INSERT INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, observaciones, datos_adicionales
) VALUES 
('rel_min_001_1', 2, 'minuta', 'MIN_2024_001', 'per_001', 'organizador', 1, 
 'Organizador de la reunión', '{"fecha_asignacion": "2024-01-15"}'),
('rel_min_001_2', 2, 'minuta', 'MIN_2024_001', 'per_002', 'secretario', 1, 
 'Secretario de la reunión', '{"fecha_asignacion": "2024-01-15"}'),
('rel_min_001_3', 2, 'minuta', 'MIN_2024_001', 'per_003', 'participante', 1, 
 'Participante invitado', '{"area": "produccion"}');

-- Ejemplo: Responsables de hallazgo
INSERT INTO sgc_personal_relaciones (
    id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
    asistio, observaciones, datos_adicionales
) VALUES 
('rel_hal_001_1', 2, 'hallazgo', 'HAL_2024_001', 'per_001', 'responsable', 1, 
 'Responsable de la corrección', '{"fecha_asignacion": "2024-01-20"}'),
('rel_hal_001_2', 2, 'hallazgo', 'HAL_2024_001', 'per_002', 'auditor', 1, 
 'Auditor que detectó el hallazgo', '{"fecha_deteccion": "2024-01-20"}');

-- ===============================================
-- ETAPA 6: VERIFICACIÓN FINAL
-- ===============================================

-- Verificar tabla creada
SELECT 'Tabla creada:' as info, COUNT(*) as total FROM sgc_personal_relaciones;

-- Verificar estructura
PRAGMA table_info(sgc_personal_relaciones);

-- Verificar índices
SELECT 'Índices creados:' as info, name as indice FROM sqlite_master 
WHERE type='index' AND name LIKE '%sgc_personal_relaciones%' ORDER BY name;

-- Verificar vistas
SELECT 'Vistas creadas:' as info, name as vista FROM sqlite_master 
WHERE type='view' AND name LIKE '%sgc_personal_relaciones%' ORDER BY name;

-- Test de funcionalidad
SELECT 'Vista personal relaciones:' as info, COUNT(*) as total FROM v_sgc_personal_relaciones_completos;

-- Mostrar todas las tablas SGC
SELECT 'Tablas SGC finales:' as info, name as tabla FROM sqlite_master 
WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name;
