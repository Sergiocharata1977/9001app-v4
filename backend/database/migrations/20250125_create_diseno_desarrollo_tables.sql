-- ===============================================
-- MIGRACIÓN: DISEÑO Y DESARROLLO DE PRODUCTOS
-- Fecha: 2025-01-25
-- Descripción: Tabla para gestión de proyectos según ISO 9001:2015 (8.3)
-- ===============================================
-- 1) TABLA PRINCIPAL
CREATE TABLE IF NOT EXISTS diseno_desarrollo_productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    nombre_producto TEXT NOT NULL,
    descripcion TEXT,
    etapa_actual TEXT NOT NULL DEFAULT 'planificacion',
    responsable_id TEXT,
    fecha_inicio TEXT,
    fecha_fin_estimada TEXT,
    requisitos_cliente TEXT,
    especificaciones_tecnicas TEXT,
    observaciones TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    -- Índices para optimización
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
-- 2) ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX IF NOT EXISTS idx_diseno_org_id ON diseno_desarrollo_productos(organization_id);
CREATE INDEX IF NOT EXISTS idx_diseno_etapa ON diseno_desarrollo_productos(etapa_actual);
CREATE INDEX IF NOT EXISTS idx_diseno_responsable ON diseno_desarrollo_productos(responsable_id);
CREATE INDEX IF NOT EXISTS idx_diseno_fecha_inicio ON diseno_desarrollo_productos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_diseno_fecha_fin ON diseno_desarrollo_productos(fecha_fin_estimada);
CREATE INDEX IF NOT EXISTS idx_diseno_created_at ON diseno_desarrollo_productos(created_at);
-- 3) TABLA DE HISTORIAL DE CAMBIOS (OPCIONAL)
CREATE TABLE IF NOT EXISTS diseno_desarrollo_historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    organization_id INTEGER NOT NULL,
    campo_modificado TEXT NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    usuario_id TEXT,
    fecha_cambio TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (proyecto_id) REFERENCES diseno_desarrollo_productos(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
-- 4) ÍNDICES PARA HISTORIAL
CREATE INDEX IF NOT EXISTS idx_historial_proyecto ON diseno_desarrollo_historial(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_historial_org ON diseno_desarrollo_historial(organization_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON diseno_desarrollo_historial(fecha_cambio);
-- 5) TRIGGER PARA ACTUALIZAR updated_at
CREATE TRIGGER IF NOT EXISTS update_diseno_desarrollo_timestamp
AFTER
UPDATE ON diseno_desarrollo_productos FOR EACH ROW BEGIN
UPDATE diseno_desarrollo_productos
SET updated_at = datetime('now')
WHERE id = NEW.id;
END;
-- 6) TRIGGER PARA REGISTRAR CAMBIOS EN HISTORIAL
CREATE TRIGGER IF NOT EXISTS log_diseno_desarrollo_changes
AFTER
UPDATE ON diseno_desarrollo_productos FOR EACH ROW BEGIN
INSERT INTO diseno_desarrollo_historial (
        proyecto_id,
        organization_id,
        campo_modificado,
        valor_anterior,
        valor_nuevo,
        fecha_cambio
    )
VALUES (
        NEW.id,
        NEW.organization_id,
        'etapa_actual',
        OLD.etapa_actual,
        NEW.etapa_actual,
        datetime('now')
    );
END;
-- 7) DATOS DE PRUEBA (OPCIONAL)
INSERT
    OR IGNORE INTO diseno_desarrollo_productos (
        organization_id,
        nombre_producto,
        descripcion,
        etapa_actual,
        responsable_id,
        fecha_inicio,
        fecha_fin_estimada,
        requisitos_cliente,
        especificaciones_tecnicas,
        observaciones
    )
VALUES (
        1,
        'Sistema de Gestión Web',
        'Plataforma web para gestión empresarial',
        'planificacion',
        '1',
        '2025-01-25',
        '2025-06-30',
        'Interfaz intuitiva, responsive design',
        'React + Node.js + SQLite',
        'Proyecto piloto'
    ),
    (
        1,
        'App Móvil CRM',
        'Aplicación móvil para gestión de clientes',
        'diseno',
        '2',
        '2025-01-20',
        '2025-05-15',
        'Sincronización offline, notificaciones push',
        'React Native + Firebase',
        'En desarrollo'
    ),
    (
        1,
        'API de Integración',
        'API REST para integración con sistemas externos',
        'revision',
        '3',
        '2025-01-15',
        '2025-04-30',
        'Documentación Swagger, autenticación JWT',
        'Express.js + MongoDB',
        'Pendiente de revisión'
    );
-- ===============================================
-- FIN DE MIGRACIÓN
-- ===============================================