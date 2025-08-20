# 🔧 Scripts Permanentes - Sistema RAG

Este directorio contiene scripts permanentes para la gestión y mantenimiento del sistema RAG (Retrieval-Augmented Generation) en la aplicación ISO 9001.

## 📁 Estructura de Directorios

```
scripts/
├── permanentes/          # Scripts permanentes (este directorio)
│   ├── rag-setup.js      # Configuración del sistema RAG
│   ├── update-backend-config.js  # Actualización de configuración
│   ├── cleanup-temp.js   # Limpieza de archivos temporales
│   ├── setup-rag-system.js # Script maestro para configuración completa
│   └── README.md         # Esta documentación
├── temporales/           # Scripts temporales (se limpian automáticamente)
└── backups/              # Backups de archivos temporales
```

## 🚀 Scripts Disponibles

### 1. `setup-rag-system.js` - Script Maestro
**Propósito:** Configuración completa del sistema RAG en un solo comando.

```bash
# Configuración completa
node scripts/permanentes/setup-rag-system.js complete

# Pasos individuales
node scripts/permanentes/setup-rag-system.js rag      # Solo RAG
node scripts/permanentes/setup-rag-system.js config   # Solo configuración
node scripts/permanentes/setup-rag-system.js cleanup  # Solo limpieza
node scripts/permanentes/setup-rag-system.js status   # Solo estado
node scripts/permanentes/setup-rag-system.js info     # Información completa
```

### 2. `rag-setup.js` - Configuración RAG
**Propósito:** Verificar y configurar el sistema RAG.

```bash
# Inicializar sistema RAG
node scripts/permanentes/rag-setup.js init

# Ver estado del sistema
node scripts/permanentes/rag-setup.js status

# Mostrar ayuda
node scripts/permanentes/rag-setup.js help
```

**Funciones:**
- ✅ Verificar conexión a isoflow4
- ✅ Verificar tablas RAG
- ✅ Configurar organizaciones
- ✅ Verificar datos disponibles
- ✅ Mostrar estadísticas del sistema

### 3. `update-backend-config.js` - Actualización de Configuración
**Propósito:** Actualizar la configuración del backend para usar isoflow4.

```bash
# Actualizar toda la configuración
node scripts/permanentes/update-backend-config.js update

# Ver estado de la configuración
node scripts/permanentes/update-backend-config.js status

# Mostrar ayuda
node scripts/permanentes/update-backend-config.js help
```

**Archivos actualizados:**
- `lib/tursoClient.js` - Cliente de base de datos
- `config/env-setup.js` - Variables de entorno
- `RAG-Backend/config/rag.config.js` - Configuración RAG
- `config/isoflow4-config.json` - Archivo de respaldo

### 4. `cleanup-temp.js` - Limpieza de Archivos Temporales
**Propósito:** Gestionar archivos temporales y backups.

```bash
# Limpiar archivos temporales
node scripts/permanentes/cleanup-temp.js cleanup

# Listar backups disponibles
node scripts/permanentes/cleanup-temp.js list

# Restaurar un backup específico
node scripts/permanentes/cleanup-temp.js restore backup-2025-08-20T09-18-00-000Z

# Mostrar ayuda
node scripts/permanentes/cleanup-temp.js help
```

## 🔄 Flujo de Trabajo Recomendado

### Configuración Inicial
```bash
# 1. Configuración completa automática
node scripts/permanentes/setup-rag-system.js complete

# 2. Verificar que todo funciona
node scripts/permanentes/setup-rag-system.js info
```

### Mantenimiento Regular
```bash
# 1. Verificar estado del sistema
node scripts/permanentes/rag-setup.js status

# 2. Limpiar archivos temporales
node scripts/permanentes/cleanup-temp.js cleanup

# 3. Ver información completa
node scripts/permanentes/setup-rag-system.js info
```

### Solución de Problemas
```bash
# 1. Verificar configuración
node scripts/permanentes/update-backend-config.js status

# 2. Reconfigurar RAG si es necesario
node scripts/permanentes/rag-setup.js init

# 3. Restaurar configuración si hay problemas
node scripts/permanentes/cleanup-temp.js list
node scripts/permanentes/cleanup-temp.js restore [backup-name]
```

## 📊 Configuración de Base de Datos

### isoflow4 - Base de Datos Principal
- **URL:** `libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io`
- **Estado:** ✅ Activo y configurado
- **Tablas RAG:** ✅ Creadas y listas
- **Datos:** ✅ 54 normas globales, tablas principales completas

### Organizaciones Soportadas
- **Organización 1:** ✅ Configurada
- **Organización 2:** ✅ Configurada
- **Normas Globales:** ✅ 54 normas ISO 9001 (organization_id = 0)

## 🔧 Configuración RAG

### Modelos
- **Proveedor:** Local
- **Modelo:** `sentence-transformers/all-MiniLM-L6-v2`
- **Tokens máximos:** 4096

### Indexación
- **Tamaño de chunk:** 1000 caracteres
- **Solapamiento:** 200 caracteres
- **Chunks máximos:** 10,000

### Búsqueda
- **Top K:** 5 resultados
- **Umbral de similitud:** 0.7
- **Resultados máximos:** 10

### Generación
- **Temperatura:** 0.7
- **Longitud máxima:** 500 caracteres
- **Incluir fuentes:** ✅ Sí

## 📋 Tablas RAG

### `rag_config`
- Configuración por organización
- Estado habilitado/deshabilitado
- Parámetros de modelos

### `rag_embeddings`
- Embeddings de contenido
- Metadatos y vectores
- Índices de chunks

### `rag_queries`
- Historial de consultas
- Respuestas generadas
- Métricas de rendimiento

### `rag_sources`
- Fuentes de documentos
- URLs y metadatos
- Vista previa de contenido

## 🚨 Solución de Problemas

### Error: "Cannot find module"
```bash
# Verificar que estás en el directorio correcto
cd backend

# Verificar que el script existe
ls scripts/permanentes/
```

### Error: "Connection failed"
```bash
# Verificar configuración de base de datos
node scripts/permanentes/rag-setup.js status

# Reconfigurar si es necesario
node scripts/permanentes/update-backend-config.js update
```

### Error: "Tables not found"
```bash
# Verificar tablas RAG
node scripts/permanentes/rag-setup.js init

# Si persiste, crear tablas manualmente
# Ver documentación de migraciones
```

## 📞 Soporte

Para problemas específicos:

1. **Verificar logs:** Revisar la salida de los scripts
2. **Estado del sistema:** `node scripts/permanentes/setup-rag-system.js info`
3. **Configuración:** `node scripts/permanentes/update-backend-config.js status`
4. **RAG:** `node scripts/permanentes/rag-setup.js status`

---

**Última actualización:** 20/8/2025
**Versión:** 1.0.0
**Estado:** ✅ Activo y funcional
