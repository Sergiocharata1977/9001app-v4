-- Crear tabla organization_feature
CREATE TABLE IF NOT EXISTS organization_feature (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT organization_feature_organization_id_feature_name_uk UNIQUE (organization_id, feature_name),
  CONSTRAINT organization_feature_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_organization_feature_org_id ON organization_feature(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_feature_name ON organization_feature(feature_name);
CREATE INDEX IF NOT EXISTS idx_organization_feature_enabled ON organization_feature(is_enabled);

-- Crear vista para features habilitadas
CREATE VIEW IF NOT EXISTS v_organization_features_enabled AS
SELECT 
  of.organization_id,
  o.name as organization_name,
  of.feature_name,
  of.is_enabled,
  of.created_at,
  of.updated_at
FROM organization_feature of
JOIN organizations o ON of.organization_id = o.id
WHERE of.is_enabled = 1;
