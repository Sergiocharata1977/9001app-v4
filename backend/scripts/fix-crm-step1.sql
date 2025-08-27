-- Paso 1: Corregir tipos de datos y agregar índices básicos

-- Corregir organization_id en oportunidades (de TEXT a INTEGER)
ALTER TABLE oportunidades ADD COLUMN organization_id_new INTEGER;
UPDATE oportunidades SET organization_id_new = CAST(organization_id AS INTEGER) WHERE organization_id IS NOT NULL;
ALTER TABLE oportunidades DROP COLUMN organization_id;
ALTER TABLE oportunidades RENAME COLUMN organization_id_new TO organization_id;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_actividades_cliente_id ON actividades_crm(cliente_id);
CREATE INDEX IF NOT EXISTS idx_actividades_vendedor_id ON actividades_crm(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_actividades_oportunidad_id ON actividades_crm(oportunidad_id);
CREATE INDEX IF NOT EXISTS idx_actividades_organization_id ON actividades_crm(organization_id);

CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente_id ON oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_vendedor_id ON oportunidades(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_organization_id ON oportunidades(organization_id);

CREATE INDEX IF NOT EXISTS idx_clientes_organization_id ON clientes(organization_id);
CREATE INDEX IF NOT EXISTS idx_personal_organization_id ON personal(organization_id);
