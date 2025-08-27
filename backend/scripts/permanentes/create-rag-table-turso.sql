-- Script para crear tabla RAG_DATA en Turso
-- Ejecutar en: npx turso db shell isoflow4

-- Crear tabla RAG_DATA
CREATE TABLE IF NOT EXISTS rag_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    codigo TEXT,
    contenido TEXT NOT NULL,
    estado TEXT DEFAULT 'activo',
    organizacion_id TEXT DEFAULT 'default',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT,
    relevancia_score REAL DEFAULT 0
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_rag_tipo ON rag_data(tipo);
CREATE INDEX IF NOT EXISTS idx_rag_titulo ON rag_data(titulo);
CREATE INDEX IF NOT EXISTS idx_rag_estado ON rag_data(estado);
CREATE INDEX IF NOT EXISTS idx_rag_organizacion ON rag_data(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_rag_fecha ON rag_data(fecha_actualizacion);

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER IF NOT EXISTS update_rag_timestamp 
    AFTER UPDATE ON rag_data
    FOR EACH ROW
BEGIN
    UPDATE rag_data SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insertar datos de ejemplo para ISO 9001
INSERT OR IGNORE INTO rag_data (tipo, titulo, codigo, contenido, organizacion_id) VALUES
('norma', 'ISO 9001:2015 - Requisitos generales', 'ISO-9001-2015', 'La norma ISO 9001:2015 establece los requisitos para un sistema de gestión de calidad que puede ser utilizado para aplicación interna por las organizaciones, para certificación o con fines contractuales. Esta norma se basa en el ciclo PDCA (Planificar-Hacer-Verificar-Actuar) y el enfoque basado en procesos.', 'default'),

('proceso', 'Proceso de Gestión de Calidad', 'PROC-001', 'Proceso principal que define cómo la organización gestiona la calidad de sus productos y servicios, incluyendo la planificación, implementación, control y mejora continua. Este proceso abarca desde la identificación de requisitos del cliente hasta la entrega del producto o servicio.', 'default'),

('indicador', 'Indicador de Satisfacción del Cliente', 'IND-001', 'Medición de la satisfacción del cliente basada en encuestas y feedback recibido, con objetivo de mantener un nivel superior al 85%. Se calcula mediante encuestas semestrales y feedback continuo de los clientes.', 'default'),

('auditoria', 'Auditoría Interna de Calidad', 'AUD-001', 'Proceso de auditoría interna que verifica el cumplimiento del sistema de gestión de calidad y la efectividad de los procesos implementados. Se realiza trimestralmente y cubre todos los procesos del SGC.', 'default'),

('hallazgo', 'No Conformidad en Documentación', 'HAL-001', 'Hallazgo identificado durante auditoría interna relacionado con documentación desactualizada en el proceso de control de calidad. Se requiere actualización inmediata de procedimientos.', 'default'),

('accion', 'Acción Correctiva - Actualización de Documentos', 'ACC-001', 'Acción correctiva implementada para actualizar toda la documentación del sistema de gestión de calidad y establecer proceso de revisión periódica. Incluye capacitación al personal en nuevos procedimientos.', 'default'),

('documento', 'Manual de Calidad', 'DOC-001', 'Documento principal que describe el sistema de gestión de calidad de la organización, incluyendo políticas, objetivos, estructura organizacional y compromiso de la dirección con la mejora continua.', 'default'),

('personal', 'Responsable de Calidad', 'PER-001', 'Descripción del puesto y responsabilidades del responsable del sistema de gestión de calidad, incluyendo competencias requeridas, formación necesaria y autoridad para tomar decisiones en materia de calidad.', 'default'),

('capacitacion', 'Capacitación en ISO 9001', 'CAP-001', 'Programa de capacitación para todo el personal sobre los requisitos de la norma ISO 9001:2015 y su aplicación en la organización. Incluye formación inicial y actualizaciones periódicas.', 'default'),

('minuta', 'Reunión de Revisión por la Dirección', 'MIN-001', 'Minuta de la reunión mensual de revisión por la dirección donde se analizan los indicadores de calidad, se revisan las acciones correctivas y se toman decisiones de mejora del sistema.', 'default'),

('proceso', 'Control de Documentos', 'PROC-002', 'Proceso que asegura que todos los documentos del SGC estén controlados, actualizados y disponibles para el personal autorizado. Incluye identificación, distribución, cambios y archivo de documentos.', 'default'),

('indicador', 'Tiempo de Respuesta a No Conformidades', 'IND-002', 'Medición del tiempo promedio desde la identificación de una no conformidad hasta la implementación de acciones correctivas. Objetivo: máximo 30 días.', 'default'),

('auditoria', 'Auditoría de Proveedores', 'AUD-002', 'Evaluación de proveedores críticos para verificar su capacidad de cumplir con los requisitos de calidad establecidos. Se realiza anualmente y cuando se incorporan nuevos proveedores.', 'default'),

('hallazgo', 'Incumplimiento en Procedimientos de Calidad', 'HAL-002', 'Hallazgo relacionado con el no seguimiento de procedimientos establecidos en el área de producción. Requiere reforzamiento de capacitación y supervisión.', 'default'),

('accion', 'Acción Preventiva - Mejora de Procesos', 'ACC-002', 'Acción preventiva implementada para mejorar la eficiencia del proceso de control de calidad mediante la automatización de ciertas verificaciones y el uso de tecnología avanzada.', 'default'),

('documento', 'Procedimiento de Control de Calidad', 'DOC-002', 'Documento que describe los métodos y criterios para el control de calidad de productos y servicios, incluyendo puntos de control, métodos de medición y criterios de aceptación.', 'default'),

('personal', 'Auditor Interno', 'PER-002', 'Perfil del auditor interno del SGC, incluyendo competencias técnicas, formación en auditorías, experiencia requerida y responsabilidades en el programa de auditorías internas.', 'default'),

('capacitacion', 'Formación de Auditores Internos', 'CAP-002', 'Programa específico para formar auditores internos del SGC, incluyendo metodología de auditoría, técnicas de entrevista, identificación de no conformidades y elaboración de informes.', 'default'),

('minuta', 'Reunión de Análisis de Indicadores', 'MIN-002', 'Minuta de la reunión quincenal donde se analizan los indicadores de calidad, se identifican tendencias y se proponen acciones de mejora basadas en los datos obtenidos.', 'default'),

('norma', 'ISO 9001:2015 - Enfoque basado en procesos', 'ISO-9001-PROCESOS', 'El enfoque basado en procesos es fundamental en ISO 9001:2015. Consiste en identificar, entender y gestionar un sistema de procesos interrelacionados que contribuyen a la eficacia y eficiencia de la organización.', 'default');

-- Verificar que se crearon los registros
SELECT COUNT(*) as total_registros FROM rag_data;
SELECT tipo, COUNT(*) as cantidad FROM rag_data GROUP BY tipo ORDER BY cantidad DESC;
