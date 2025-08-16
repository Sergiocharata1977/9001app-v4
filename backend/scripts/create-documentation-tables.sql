-- Crear tabla para documentación de la base de datos
CREATE TABLE IF NOT EXISTS database_documentation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_name TEXT NOT NULL,
  subsection_name TEXT,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'markdown',
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT DEFAULT 'system',
  CONSTRAINT database_documentation_section_subsection_uk UNIQUE (section_name, subsection_name)
);

-- Crear tabla para estructura de tablas
CREATE TABLE IF NOT EXISTS table_structure (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  data_type TEXT NOT NULL,
  is_nullable INTEGER DEFAULT 1,
  is_primary_key INTEGER DEFAULT 0,
  default_value TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT table_structure_table_column_uk UNIQUE (table_name, column_name)
);

-- Crear tabla para relaciones entre tablas
CREATE TABLE IF NOT EXISTS table_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_table TEXT NOT NULL,
  source_column TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_column TEXT NOT NULL,
  relationship_type TEXT DEFAULT 'foreign_key',
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT table_relationships_source_target_uk UNIQUE (source_table, source_column, target_table, target_column)
);

-- Crear tabla para estadísticas de la base de datos
CREATE TABLE IF NOT EXISTS database_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stat_name TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  stat_type TEXT DEFAULT 'string',
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT database_stats_name_uk UNIQUE (stat_name)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_database_documentation_section ON database_documentation(section_name);
CREATE INDEX IF NOT EXISTS idx_database_documentation_active ON database_documentation(is_active);
CREATE INDEX IF NOT EXISTS idx_table_structure_table ON table_structure(table_name);
CREATE INDEX IF NOT EXISTS idx_table_structure_active ON table_structure(is_active);
CREATE INDEX IF NOT EXISTS idx_table_relationships_source ON table_relationships(source_table);
CREATE INDEX IF NOT EXISTS idx_table_relationships_target ON table_relationships(target_table);
CREATE INDEX IF NOT EXISTS idx_database_stats_active ON database_stats(is_active);

-- Crear vistas para consultas fáciles
CREATE VIEW IF NOT EXISTS v_database_overview AS
SELECT 
  'documentation' as type,
  section_name as name,
  subsection_name as detail,
  content,
  updated_at
FROM database_documentation 
WHERE is_active = 1
UNION ALL
SELECT 
  'table' as type,
  table_name as name,
  'structure' as detail,
  'Table structure information' as content,
  updated_at
FROM table_structure 
WHERE is_active = 1
GROUP BY table_name
UNION ALL
SELECT 
  'relationship' as type,
  source_table as name,
  target_table as detail,
  description as content,
  updated_at
FROM table_relationships 
WHERE is_active = 1
UNION ALL
SELECT 
  'stat' as type,
  stat_name as name,
  stat_type as detail,
  stat_value as content,
  updated_at
FROM database_stats 
WHERE is_active = 1;

-- Vista para estructura completa de tablas
CREATE VIEW IF NOT EXISTS v_table_structure_complete AS
SELECT 
  ts.table_name,
  ts.column_name,
  ts.data_type,
  ts.is_nullable,
  ts.is_primary_key,
  ts.default_value,
  ts.description,
  ts.updated_at
FROM table_structure ts
WHERE ts.is_active = 1
ORDER BY ts.table_name, ts.column_name;

-- Vista para relaciones de tablas
CREATE VIEW IF NOT EXISTS v_table_relationships_complete AS
SELECT 
  tr.source_table,
  tr.source_column,
  tr.target_table,
  tr.target_column,
  tr.relationship_type,
  tr.description,
  tr.updated_at
FROM table_relationships tr
WHERE tr.is_active = 1
ORDER BY tr.source_table, tr.source_column;
