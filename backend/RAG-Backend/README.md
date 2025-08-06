# 🧠 RAG-Backend - Módulo de Inteligencia Artificial

## 📋 Descripción

Módulo independiente de Retrieval-Augmented Generation (RAG) para ISOFlow3. Este módulo proporciona capacidades de búsqueda semántica y generación de respuestas contextualizadas basadas en la documentación y datos del sistema ISO 9001.

## 🏗️ Arquitectura

```
RAG-Backend/
├── controllers/          # Controladores RAG
├── services/            # Servicios de IA y vectorización
├── models/              # Modelos de datos RAG
├── middleware/          # Middleware específico RAG
├── routes/              # Rutas API RAG
├── utils/               # Utilidades RAG
├── config/              # Configuración RAG
├── tests/               # Tests del módulo
└── docs/                # Documentación técnica
```

## 🚀 Características

- ✅ **Búsqueda Semántica**: Embeddings para consultas inteligentes
- ✅ **Generación Contextual**: Respuestas basadas en datos reales
- ✅ **Multi-Tenant**: Aislamiento completo por organización
- ✅ **Activación/Desactivación**: Control granular del módulo
- ✅ **Indexación Automática**: Procesamiento de datos estructurados y no estructurados
- ✅ **Trazabilidad**: Fuentes y metadatos de respuestas

## 🔧 Tecnologías

- **Node.js + Express**: API REST
- **LangChain.js**: Orquestación RAG
- **ChromaDB**: Vector Database
- **Transformers.js**: Modelos locales
- **Turso**: Base de datos existente

## 📦 Instalación

```bash
# Instalar dependencias RAG
npm install langchain @langchain/community chromadb transformers
```

## ⚙️ Configuración

```bash
# Variables de entorno RAG
RAG_ENABLED=true
RAG_MODEL_PROVIDER=local
RAG_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
RAG_VECTOR_DB_TYPE=chromadb
RAG_CHUNK_SIZE=1000
RAG_CHUNK_OVERLAP=200
```

## 🎯 Uso

```javascript
// Activar RAG para organización
POST /api/rag/toggle
{
  "organizationId": 1,
  "enabled": true
}

// Consulta RAG
POST /api/rag/query
{
  "query": "¿Qué objetivos están asociados al proceso de Producción?",
  "organizationId": 1
}
```

## 🔒 Seguridad

- Aislamiento multi-tenant
- Sanitización de inputs
- Rate limiting
- Logging de auditoría
- Control de acceso granular

## 📊 Estado del Módulo

- [x] Arquitectura definida
- [x] Estructura de archivos
- [ ] Implementación de servicios
- [ ] Tests unitarios
- [ ] Integración con sistema principal
- [ ] Despliegue en producción

---

**Nota**: Este módulo está diseñado para ser completamente independiente y puede activarse/desactivarse sin afectar el funcionamiento del sistema principal. 