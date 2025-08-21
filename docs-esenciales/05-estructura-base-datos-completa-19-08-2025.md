# 🗄️ Estructura Completa de Base de Datos - SGC ISO 9001
**📅 Última Actualización:** 20/8/2025, 9:00:00
**📊 Total de Tablas:** 35

## 📈 Estadísticas Generales
- **Total de Tablas:** 35
- **Última Actualización:** 20/8/2025, 9:00:00
- **Estado:** ✅ Activo y Monitoreado

## 📋 Tablas del Sistema


### Organizaciones y Usuarios

#### 📊 organizations
**Registros:** 6 | **Columnas:** 8

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| name | TEXT | ✅ |  | - |
| email | TEXT |  |  | - |
| phone | TEXT |  |  | - |
| plan | TEXT | ✅ |  | 'basic' |
| is_active | INTEGER | ✅ |  | 1 |
| created_at | TEXT |  |  | datetime('now') |
| updated_at | TEXT |  |  | datetime('now') |

**Índices:**
- `sqlite_autoindex_organizations_1` (Único)

---

#### 📊 organization_features
**Registros:** 35 | **Columnas:** 5

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| organization_id | INTEGER | ✅ |  | - |
| feature_name | TEXT | ✅ |  | - |
| is_enabled | INTEGER | ✅ |  | 1 |
| created_at | TEXT |  |  | datetime('now') |

**Relaciones:**
- `organization_id` → `organizations.id`

**Índices:**
- `sqlite_autoindex_organization_features_1` (Único)

---


### Gestión de Personal

#### 📊 personal
**Registros:** 9 | **Columnas:** 16

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| organization_id | INTEGER | ✅ |  | 2 |
| nombres | TEXT | ✅ |  | - |
| apellidos | TEXT | ✅ |  | - |
| email | TEXT | ✅ |  | - |
| telefono | TEXT |  |  | - |
| documento_identidad | TEXT |  |  | - |
| fecha_nacimiento | TEXT |  |  | - |
| nacionalidad | TEXT |  |  | - |
| direccion | TEXT |  |  | - |
| telefono_emergencia | TEXT |  |  | - |
| fecha_contratacion | TEXT |  |  | - |
| numero_legajo | TEXT |  |  | - |
| estado | TEXT |  |  | 'Activo' |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| updated_at | DATETIME |  |  | CURRENT_TIMESTAMP |

**Índices:**
- `idx_personal_estado`
- `sqlite_autoindex_personal_1` (Único)

---

#### 📊 departamentos
**Registros:** 6 | **Columnas:** 8

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| responsable_id | TEXT |  |  | - |
| organization_id | INTEGER |  |  | 1 |
| objetivos | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |
| created_at | TEXT |  |  | - |

**Índices:**
- `sqlite_autoindex_departamentos_2` (Único)
- `sqlite_autoindex_departamentos_1` (Único)

---

#### 📊 puestos
**Registros:** 9 | **Columnas:** 10

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| descripcion_responsabilidades | TEXT |  |  | - |
| requisitos_experiencia | TEXT |  |  | - |
| requisitos_formacion | TEXT |  |  | - |
| departamento_id | TEXT |  |  | - |
| reporta_a_id | TEXT |  |  | - |
| organization_id | TEXT | ✅ |  | - |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

**Índices:**
- `sqlite_autoindex_puestos_1` (Único)

---

#### 📊 competencias
**Registros:** 6 | **Columnas:** 7

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| organization_id | INTEGER | ✅ |  | - |
| estado | TEXT |  |  | 'activa' |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| updated_at | DATETIME |  |  | CURRENT_TIMESTAMP |

---


### Procesos y Documentos

#### 📊 procesos
**Registros:** 5 | **Columnas:** 7

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| responsable | TEXT |  |  | - |
| descripcion | TEXT |  |  | - |
| organization_id | INTEGER |  |  | 1 |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

**Índices:**
- `sqlite_autoindex_procesos_1` (Único)

---

#### 📊 documentos
**Registros:** 2 | **Columnas:** 12

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| titulo | TEXT | ✅ |  | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| version | TEXT |  |  | '1.0' |
| archivo_nombre | TEXT | ✅ |  | - |
| archivo_path | TEXT | ✅ |  | - |
| tipo_archivo | TEXT |  |  | - |
| tamaño | INTEGER |  |  | - |
| organization_id | INTEGER | ✅ |  | - |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| updated_at | DATETIME |  |  | CURRENT_TIMESTAMP |

**Índices:**
- `idx_documentos_titulo`
- `idx_documentos_organization`

---

#### 📊 normas
**Registros:** 54 | **Columnas:** 14

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| codigo | TEXT | ✅ |  | - |
| titulo | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| version | TEXT |  |  | '2015' |
| tipo | TEXT |  |  | 'ISO 9001' |
| estado | TEXT |  |  | 'activo' |
| categoria | TEXT |  |  | - |
| responsable | TEXT |  |  | - |
| fecha_revision | DATE |  |  | - |
| observaciones | TEXT |  |  | - |
| organization_id | INTEGER | ✅ |  | - |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| updated_at | DATETIME |  |  | CURRENT_TIMESTAMP |

---


### Auditorías y Calidad

#### 📊 auditorias
**Registros:** 2 | **Columnas:** 16

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| codigo | TEXT | ✅ |  | - |
| titulo | TEXT | ✅ |  | - |
| area | TEXT | ✅ |  | - |
| responsable_id | TEXT |  |  | - |
| fecha_programada | TEXT | ✅ |  | - |
| fecha_ejecucion | TEXT |  |  | - |
| estado | TEXT |  |  | 'planificada' |
| objetivos | TEXT |  |  | - |
| alcance | TEXT |  |  | - |
| criterios | TEXT |  |  | - |
| resultados | TEXT |  |  | - |
| observaciones | TEXT |  |  | - |
| organization_id | INTEGER | ✅ |  | - |
| created_at | TEXT |  |  | datetime('now') |
| updated_at | TEXT |  |  | datetime('now') |

**Índices:**
- `sqlite_autoindex_auditorias_2` (Único)
- `sqlite_autoindex_auditorias_1` (Único)

---

#### 📊 hallazgos
**Registros:** 0 | **Columnas:** 16

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| numeroHallazgo | TEXT | ✅ |  | - |
| titulo | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| estado | TEXT | ✅ |  | - |
| origen | TEXT |  |  | - |
| tipo_hallazgo | TEXT |  |  | - |
| prioridad | TEXT |  |  | - |
| fecha_deteccion | TEXT | ✅ |  | - |
| fecha_cierre | TEXT |  |  | - |
| proceso_id | TEXT | ✅ |  | - |
| requisito_incumplido | TEXT |  |  | - |
| orden | INTEGER |  |  | - |
| organization_id | INTEGER |  |  | 1 |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

**Relaciones:**
- `proceso_id` → `procesos.id`

**Índices:**
- `sqlite_autoindex_hallazgos_2` (Único)
- `sqlite_autoindex_hallazgos_1` (Único)

---

#### 📊 acciones
**Registros:** 0 | **Columnas:** 14

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| hallazgo_id | TEXT | ✅ |  | - |
| numeroAccion | TEXT | ✅ |  | - |
| estado | TEXT | ✅ |  | - |
| descripcion_accion | TEXT |  |  | - |
| responsable_accion | TEXT |  |  | - |
| fecha_plan_accion | TEXT |  |  | - |
| comentarios_ejecucion | TEXT |  |  | - |
| fecha_ejecucion_accion | TEXT |  |  | - |
| eficacia | TEXT |  |  | - |
| observaciones | TEXT |  |  | - |
| organization_id | INTEGER |  |  | 1 |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

**Relaciones:**
- `hallazgo_id` → `hallazgos.id`

**Índices:**
- `sqlite_autoindex_acciones_2` (Único)
- `sqlite_autoindex_acciones_1` (Único)

---


### Indicadores y Objetivos

#### 📊 indicadores
**Registros:** 4 | **Columnas:** 10

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| proceso_id | INTEGER |  |  | - |
| frecuencia_medicion | TEXT |  |  | - |
| meta | REAL |  |  | - |
| formula | TEXT |  |  | - |
| organization_id | INTEGER |  |  | 1 |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

**Relaciones:**
- `proceso_id` → `procesos.id`

---

#### 📊 mediciones
**Registros:** 0 | **Columnas:** 8

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| indicador_id | TEXT | ✅ |  | - |
| valor | REAL | ✅ |  | - |
| fecha_medicion | TEXT | ✅ |  | - |
| observaciones | TEXT |  |  | - |
| responsable | TEXT |  |  | - |
| fecha_creacion | TEXT | ✅ |  | datetime('now') |
| organization_id | INTEGER |  |  | 1 |

**Relaciones:**
- `indicador_id` → `indicadores.id`

**Índices:**
- `sqlite_autoindex_mediciones_1` (Único)

---

#### 📊 objetivos_calidad
**Registros:** 11 | **Columnas:** 10

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | TEXT |  | ✅ | - |
| nombre_objetivo | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| proceso_id | TEXT |  |  | - |
| indicador_asociado_id | INTEGER |  |  | - |
| meta | TEXT |  |  | - |
| responsable | TEXT |  |  | - |
| fecha_inicio | TEXT |  |  | - |
| fecha_fin | TEXT |  |  | - |
| organization_id | INTEGER |  |  | 1 |

**Relaciones:**
- `indicador_asociado_id` → `indicadores.id`
- `proceso_id` → `procesos.id`

**Índices:**
- `sqlite_autoindex_objetivos_calidad_1` (Único)

---


### Comunicación

#### 📊 minutas
**Registros:** 6 | **Columnas:** 5

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| titulo | TEXT | ✅ |  | - |
| responsable | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |

---


### Capacitación

#### 📊 capacitaciones
**Registros:** 2 | **Columnas:** 10

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| fecha_programada | TEXT |  |  | - |
| duracion_horas | INTEGER |  |  | - |
| instructor | TEXT |  |  | - |
| estado | TEXT |  |  | 'Programada' |
| organization_id | INTEGER |  |  | 1 |
| created_at | TEXT |  |  | - |
| updated_at | TEXT |  |  | - |

---


### Productos

#### 📊 productos
**Registros:** 3 | **Columnas:** 21

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| id | INTEGER |  | ✅ | - |
| organization_id | INTEGER | ✅ |  | - |
| nombre | TEXT | ✅ |  | - |
| descripcion | TEXT |  |  | - |
| codigo | TEXT |  |  | - |
| tipo | TEXT | ✅ |  | - |
| categoria | TEXT |  |  | - |
| estado | TEXT | ✅ |  | 'Borrador' |
| version | TEXT |  |  | '1.0' |
| fecha_creacion | DATE |  |  | - |
| fecha_revision | DATE |  |  | - |
| responsable | TEXT |  |  | - |
| especificaciones | TEXT |  |  | - |
| requisitos_calidad | TEXT |  |  | - |
| proceso_aprobacion | TEXT |  |  | - |
| documentos_asociados | TEXT |  |  | - |
| observaciones | TEXT |  |  | - |
| created_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| updated_at | DATETIME |  |  | CURRENT_TIMESTAMP |
| created_by | INTEGER |  |  | - |
| updated_by | INTEGER |  |  | - |

**Relaciones:**
- `updated_by` → `usuarios.id`
- `created_by` → `usuarios.id`
- `organization_id` → `organizations.id`

**Índices:**
- `sqlite_autoindex_productos_1` (Único)

---


### Sistema

#### 📊 sqlite_sequence
**Registros:** 16 | **Columnas:** 2

**Campos:**
| Campo | Tipo | Requerido | Clave Primaria | Valor por Defecto |
|-------|------|-----------|----------------|-------------------|
| name |  |  |  | - |
| seq |  |  |  | - |

---

## 🔄 Script de Actualización

### Configuración Automática
- **Frecuencia:** Cada hora (configurable)
- **Archivo de Salida:** `docs-esenciales/05-estructura-base-datos-completa-19-08-2025.md`
- **Formato:** Markdown con estructura completa

### Comandos Disponibles
```bash
# Actualización manual
npm run db-schema:update

# Actualización automática cada hora
npm run db-schema:start

# Detener actualización automática
npm run db-schema:stop

# Ver estado actual
npm run db-schema:status
```

### Monitoreo en Super Admin
La información de la estructura de base de datos se visualiza en:
- **Ruta:** `/super-admin/database-schema`
- **Componente:** `DatabaseSchemaViewer`
- **Actualización:** Automática cada hora

## 📊 Métricas de Rendimiento

### Tiempos de Actualización
- **Tiempo Promedio:** < 30 segundos
- **Tiempo Máximo:** < 60 segundos
- **Frecuencia:** Cada hora

### Estadísticas de Tablas
- **Tablas Principales:** 34
- **Tablas del Sistema:** 1
- **Total de Campos:** 349

## 🔧 Configuración del Script

### Variables de Entorno
```env
TURSO_DATABASE_URL=libsql://iso-flow-respo-sergiocharata1977.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here
UPDATE_INTERVAL=3600000
OUTPUT_FILE=docs-esenciales/05-estructura-base-datos-completa-19-08-2025.md
```

### Logs y Monitoreo
- **Logs:** `logs/database-schema-updater.log`
- **Estado:** `logs/database-schema-status.json`
- **Errores:** `logs/database-schema-errors.log`

---

*Este documento se actualiza automáticamente cada hora para mantener la información de la estructura de base de datos siempre actualizada.*
