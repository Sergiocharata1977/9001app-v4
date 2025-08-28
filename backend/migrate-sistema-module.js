const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

// Datos de ejemplo para Sistema
const sistemaData = {
  // DOCUMENTOS
  documentos: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      titulo: "Manual de Calidad",
      descripcion: "Manual del sistema de gestión de calidad",
      tipo_documento: "manual",
      url_archivo: "/documentos/manual-calidad-v1.pdf",
      version: "1.0",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      titulo: "Procedimiento de Ventas",
      descripcion: "Procedimiento para el proceso de ventas",
      tipo_documento: "procedimiento",
      url_archivo: "/documentos/proc-ventas-v1.pdf",
      version: "1.0",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 3,
      organization_id: 1,
      titulo: "Política de Calidad",
      descripcion: "Política de calidad de la organización",
      tipo_documento: "politica",
      url_archivo: "/documentos/politica-calidad-v1.pdf",
      version: "1.0",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // ENCUESTAS
  encuestas: [
    {
      _id: new ObjectId(),
      id: "enc_001",
      organization_id: 1,
      titulo: "Satisfacción del Cliente",
      descripcion: "Encuesta para medir satisfacción del cliente",
      tipo_encuesta: "satisfaccion",
      fecha_inicio: "2024-10-01",
      fecha_fin: "2024-12-31",
      estado: "activa",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "enc_002",
      organization_id: 1,
      titulo: "Satisfacción del Personal",
      descripcion: "Encuesta para medir satisfacción del personal",
      tipo_encuesta: "satisfaccion",
      fecha_inicio: "2024-11-01",
      fecha_fin: "2024-11-30",
      estado: "borrador",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // LÍMITES DE USO
  limites_uso: [
    {
      _id: new ObjectId(),
      id: "lim_001",
      organization_id: 1,
      tipo_limite: "usuarios",
      valor_limite: 50,
      periodo: "mensual",
      descripcion: "Límite de usuarios activos",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "lim_002",
      organization_id: 1,
      tipo_limite: "almacenamiento",
      valor_limite: 1000,
      periodo: "mensual",
      descripcion: "Límite de almacenamiento en GB",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "lim_003",
      organization_id: 1,
      tipo_limite: "api_calls",
      valor_limite: 10000,
      periodo: "diario",
      descripcion: "Límite de llamadas a API",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // FEATURES DE ORGANIZACIÓN
  organization_features: [
    {
      _id: new ObjectId(),
      id: "feat_001",
      organization_id: 1,
      feature_name: "crm_agro",
      is_enabled: 1,
      configuracion: '{"modulos": ["clientes", "oportunidades", "actividades"]}',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "feat_002",
      organization_id: 1,
      feature_name: "sgc",
      is_enabled: 1,
      configuracion: '{"modulos": ["procesos", "indicadores", "auditorias"]}',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "feat_003",
      organization_id: 1,
      feature_name: "rrhh",
      is_enabled: 1,
      configuracion: '{"modulos": ["personal", "capacitaciones", "evaluaciones"]}',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "feat_004",
      organization_id: 1,
      feature_name: "rag_ai",
      is_enabled: 0,
      configuracion: '{"modelo": "gpt-4", "limite_consultas": 100}',
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CONFIGURACIÓN RAG
  rag_config: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      is_enabled: true,
      model_provider: "openai",
      model_name: "gpt-4",
      chunk_size: 1000,
      chunk_overlap: 200,
      created_at: new Date(),
      updated_at: new Date(),
      last_indexed_at: null
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      is_enabled: false,
      model_provider: "local",
      model_name: "sentence-transformers/all-MiniLM-L6-v2",
      chunk_size: 500,
      chunk_overlap: 100,
      created_at: new Date(),
      updated_at: new Date(),
      last_indexed_at: null
    }
  ],

  // EMBEDDINGS RAG
  rag_embeddings: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      content_type: "documento",
      content_id: 1,
      content_hash: "abc123",
      chunk_index: 0,
      chunk_text: "Este es el primer chunk del manual de calidad...",
      embedding_vector: "[0.1, 0.2, 0.3, ...]",
      metadata: '{"tipo": "manual", "version": "1.0"}',
      created_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      content_type: "documento",
      content_id: 2,
      content_hash: "def456",
      chunk_index: 0,
      chunk_text: "Este es el primer chunk del procedimiento de ventas...",
      embedding_vector: "[0.4, 0.5, 0.6, ...]",
      metadata: '{"tipo": "procedimiento", "version": "1.0"}',
      created_at: new Date()
    }
  ],

  // QUERIES RAG
  rag_queries: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      user_id: 1,
      query: "¿Cuál es el procedimiento de ventas?",
      response: "El procedimiento de ventas incluye los siguientes pasos...",
      sources: '["documento_2", "manual_1"]',
      confidence: 0.85,
      processing_time: 1500,
      created_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      user_id: 1,
      query: "¿Qué es la política de calidad?",
      response: "La política de calidad establece nuestro compromiso...",
      sources: '["documento_3", "manual_1"]',
      confidence: 0.92,
      processing_time: 1200,
      created_at: new Date()
    }
  ],

  // SOURCES RAG
  rag_sources: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      source_type: "documento",
      source_id: 1,
      source_name: "Manual de Calidad v1.0",
      source_url: "/documentos/manual-calidad-v1.pdf",
      content_preview: "Manual del sistema de gestión de calidad...",
      metadata: '{"tipo": "manual", "version": "1.0", "paginas": 50}',
      created_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      source_type: "documento",
      source_id: 2,
      source_name: "Procedimiento de Ventas v1.0",
      source_url: "/documentos/proc-ventas-v1.pdf",
      content_preview: "Procedimiento para el proceso de ventas...",
      metadata: '{"tipo": "procedimiento", "version": "1.0", "paginas": 25}',
      created_at: new Date()
    }
  ],

  // REFRESH TOKENS
  refresh_tokens: [
    {
      _id: new ObjectId(),
      id: 1,
      user_id: 1,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ2FuaXphdGlvbklkIjoxLCJpYXQiOjE3MzUwMjEyMzUsImV4cCI6MTczNTYyNjAzNX0.example",
      expires_at: "2024-12-31 23:59:59",
      created_at: "2024-10-01 10:00:00"
    },
    {
      _id: new ObjectId(),
      id: 2,
      user_id: 2,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm9yZ2FuaXphdGlvbklkIjoxLCJpYXQiOjE3MzUwMjEyMzUsImV4cCI6MTczNTYyNjAzNX0.example",
      expires_at: "2024-12-31 23:59:59",
      created_at: "2024-10-01 10:00:00"
    }
  ],

  // SUSCRIPCIONES
  suscripciones: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      plan_id: 1,
      estado: "activa",
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-12-31",
      fecha_renovacion: "2024-12-31",
      precio_pagado: 1200.00,
      moneda: "USD",
      metodo_pago: "tarjeta",
      periodo: "anual",
      cancelada_por_usuario: false,
      motivo_cancelacion: null,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      plan_id: 2,
      estado: "cancelada",
      fecha_inicio: "2024-06-01",
      fecha_fin: "2024-08-31",
      fecha_renovacion: null,
      precio_pagado: 300.00,
      moneda: "USD",
      metodo_pago: "transferencia",
      periodo: "trimestral",
      cancelada_por_usuario: true,
      motivo_cancelacion: "Cambio de plan",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // PERMISOS DE FEATURES
  user_feature_permissions: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      user_id: 1,
      feature_name: "admin_panel",
      granted_at: new Date(),
      granted_by: "system",
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      user_id: 1,
      feature_name: "reports_advanced",
      granted_at: new Date(),
      granted_by: "system",
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 3,
      organization_id: 1,
      user_id: 2,
      feature_name: "basic_reports",
      granted_at: new Date(),
      granted_by: "admin",
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

async function migrateSistemaModule() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conexión exitosa');
    
    const db = client.db(DB_NAME);
    
    // 1. MIGRAR DOCUMENTOS
    console.log('\n📄 Migrando documentos...');
    const documentosCollection = db.collection('documentos');
    await documentosCollection.deleteMany({});
    const documentosResult = await documentosCollection.insertMany(sistemaData.documentos);
    console.log(`✅ ${documentosResult.insertedCount} documentos migrados`);
    
    // 2. MIGRAR ENCUESTAS
    console.log('\n📊 Migrando encuestas...');
    const encuestasCollection = db.collection('encuestas');
    await encuestasCollection.deleteMany({});
    const encuestasResult = await encuestasCollection.insertMany(sistemaData.encuestas);
    console.log(`✅ ${encuestasResult.insertedCount} encuestas migradas`);
    
    // 3. MIGRAR LÍMITES
    console.log('\n🚫 Migrando límites...');
    const limitesCollection = db.collection('limites_uso');
    await limitesCollection.deleteMany({});
    const limitesResult = await limitesCollection.insertMany(sistemaData.limites_uso);
    console.log(`✅ ${limitesResult.insertedCount} límites migrados`);
    
    // 4. MIGRAR FEATURES
    console.log('\n⚙️ Migrando features...');
    const featuresCollection = db.collection('organization_features');
    await featuresCollection.deleteMany({});
    const featuresResult = await featuresCollection.insertMany(sistemaData.organization_features);
    console.log(`✅ ${featuresResult.insertedCount} features migradas`);
    
    // 5. MIGRAR CONFIG RAG
    console.log('\n🤖 Migrando configuración RAG...');
    const ragConfigCollection = db.collection('rag_config');
    await ragConfigCollection.deleteMany({});
    const ragConfigResult = await ragConfigCollection.insertMany(sistemaData.rag_config);
    console.log(`✅ ${ragConfigResult.insertedCount} configuraciones RAG migradas`);
    
    // 6. MIGRAR EMBEDDINGS
    console.log('\n🧠 Migrando embeddings...');
    const embeddingsCollection = db.collection('rag_embeddings');
    await embeddingsCollection.deleteMany({});
    const embeddingsResult = await embeddingsCollection.insertMany(sistemaData.rag_embeddings);
    console.log(`✅ ${embeddingsResult.insertedCount} embeddings migrados`);
    
    // 7. MIGRAR QUERIES
    console.log('\n❓ Migrando queries...');
    const queriesCollection = db.collection('rag_queries');
    await queriesCollection.deleteMany({});
    const queriesResult = await queriesCollection.insertMany(sistemaData.rag_queries);
    console.log(`✅ ${queriesResult.insertedCount} queries migradas`);
    
    // 8. MIGRAR SOURCES
    console.log('\n📚 Migrando sources...');
    const sourcesCollection = db.collection('rag_sources');
    await sourcesCollection.deleteMany({});
    const sourcesResult = await sourcesCollection.insertMany(sistemaData.rag_sources);
    console.log(`✅ ${sourcesResult.insertedCount} sources migradas`);
    
    // 9. MIGRAR REFRESH TOKENS
    console.log('\n🔑 Migrando refresh tokens...');
    const tokensCollection = db.collection('refresh_tokens');
    await tokensCollection.deleteMany({});
    const tokensResult = await tokensCollection.insertMany(sistemaData.refresh_tokens);
    console.log(`✅ ${tokensResult.insertedCount} tokens migrados`);
    
    // 10. MIGRAR SUSCRIPCIONES
    console.log('\n💳 Migrando suscripciones...');
    const suscripcionesCollection = db.collection('suscripciones');
    await suscripcionesCollection.deleteMany({});
    const suscripcionesResult = await suscripcionesCollection.insertMany(sistemaData.suscripciones);
    console.log(`✅ ${suscripcionesResult.insertedCount} suscripciones migradas`);
    
    // 11. MIGRAR PERMISOS
    console.log('\n🔐 Migrando permisos...');
    const permisosCollection = db.collection('user_feature_permissions');
    await permisosCollection.deleteMany({});
    const permisosResult = await permisosCollection.insertMany(sistemaData.user_feature_permissions);
    console.log(`✅ ${permisosResult.insertedCount} permisos migrados`);
    
    // CREAR ÍNDICES
    console.log('\n🔍 Creando índices...');
    
    // Índices para documentos
    await documentosCollection.createIndex({ "organization_id": 1 });
    await documentosCollection.createIndex({ "tipo_documento": 1 });
    await documentosCollection.createIndex({ "estado": 1 });
    
    // Índices para encuestas
    await encuestasCollection.createIndex({ "organization_id": 1 });
    await encuestasCollection.createIndex({ "estado": 1 });
    await encuestasCollection.createIndex({ "fecha_inicio": 1 });
    
    // Índices para límites
    await limitesCollection.createIndex({ "organization_id": 1 });
    await limitesCollection.createIndex({ "tipo_limite": 1 });
    await limitesCollection.createIndex({ "estado": 1 });
    
    // Índices para features
    await featuresCollection.createIndex({ "organization_id": 1 });
    await featuresCollection.createIndex({ "feature_name": 1 });
    await featuresCollection.createIndex({ "is_enabled": 1 });
    
    // Índices para RAG config
    await ragConfigCollection.createIndex({ "organization_id": 1 });
    await ragConfigCollection.createIndex({ "is_enabled": 1 });
    
    // Índices para embeddings
    await embeddingsCollection.createIndex({ "organization_id": 1 });
    await embeddingsCollection.createIndex({ "content_type": 1 });
    await embeddingsCollection.createIndex({ "content_id": 1 });
    
    // Índices para queries
    await queriesCollection.createIndex({ "organization_id": 1 });
    await queriesCollection.createIndex({ "user_id": 1 });
    await queriesCollection.createIndex({ "created_at": 1 });
    
    // Índices para sources
    await sourcesCollection.createIndex({ "organization_id": 1 });
    await sourcesCollection.createIndex({ "source_type": 1 });
    await sourcesCollection.createIndex({ "source_id": 1 });
    
    // Índices para tokens
    await tokensCollection.createIndex({ "user_id": 1 });
    await tokensCollection.createIndex({ "expires_at": 1 });
    
    // Índices para suscripciones
    await suscripcionesCollection.createIndex({ "organization_id": 1 });
    await suscripcionesCollection.createIndex({ "estado": 1 });
    await suscripcionesCollection.createIndex({ "fecha_inicio": 1 });
    
    // Índices para permisos
    await permisosCollection.createIndex({ "organization_id": 1 });
    await permisosCollection.createIndex({ "user_id": 1 });
    await permisosCollection.createIndex({ "feature_name": 1 });
    await permisosCollection.createIndex({ "is_active": 1 });
    
    console.log('✅ Índices creados exitosamente');
    
    // VERIFICAR MIGRACIÓN
    console.log('\n📊 Verificando migración...');
    
    const documentosCount = await documentosCollection.countDocuments();
    const encuestasCount = await encuestasCollection.countDocuments();
    const limitesCount = await limitesCollection.countDocuments();
    const featuresCount = await featuresCollection.countDocuments();
    const ragConfigCount = await ragConfigCollection.countDocuments();
    const embeddingsCount = await embeddingsCollection.countDocuments();
    const queriesCount = await queriesCollection.countDocuments();
    const sourcesCount = await sourcesCollection.countDocuments();
    const tokensCount = await tokensCollection.countDocuments();
    const suscripcionesCount = await suscripcionesCollection.countDocuments();
    const permisosCount = await permisosCollection.countDocuments();
    
    console.log(`📈 Resumen de migración Sistema:`);
    console.log(`   - Documentos: ${documentosCount}`);
    console.log(`   - Encuestas: ${encuestasCount}`);
    console.log(`   - Límites: ${limitesCount}`);
    console.log(`   - Features: ${featuresCount}`);
    console.log(`   - Config RAG: ${ragConfigCount}`);
    console.log(`   - Embeddings: ${embeddingsCount}`);
    console.log(`   - Queries: ${queriesCount}`);
    console.log(`   - Sources: ${sourcesCount}`);
    console.log(`   - Tokens: ${tokensCount}`);
    console.log(`   - Suscripciones: ${suscripcionesCount}`);
    console.log(`   - Permisos: ${permisosCount}`);
    
    console.log('\n🎉 ¡Migración del módulo Sistema completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateSistemaModule()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { migrateSistemaModule };
