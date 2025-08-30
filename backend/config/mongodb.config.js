/**
 * Configuración de MongoDB para 9001App
 * Base de datos principal del proyecto
 */

const MONGODB_CONFIG = {
  // Configuración de conexión
  uri: process.env.MONGODB_URI || 'mongodb+srv://9001app:password@cluster0.mongodb.net/9001app',
  database: process.env.MONGODB_DB || '9001app',
  
  // Opciones de conexión
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },

  // Colecciones principales
  collections: {
    organizations: 'organizations',
    users: 'users',
    personal: 'personal',
    departamentos: 'departamentos',
    planes: 'planes',
    suscripciones: 'suscripciones',
    organization_features: 'organization_features',
    user_feature_permissions: 'user_feature_permissions',
    
    // CRM Agro
    crm_clientes_agro: 'crm_clientes_agro',
    crm_contactos: 'crm_contactos',
    crm_lotes: 'crm_lotes',
    crm_cultivos_cliente: 'crm_cultivos_cliente',
    crm_explotaciones_agricolas: 'crm_explotaciones_agricolas',
    crm_actividades_agro: 'crm_actividades_agro',
    crm_oportunidades_agro: 'crm_oportunidades_agro',
    crm_productos_agro: 'crm_productos_agro',
    crm_zonas_geograficas: 'crm_zonas_geograficas',
    crm_metricas_agro: 'crm_metricas_agro',
    crm_balances_financieros: 'crm_balances_financieros',
    crm_flujo_caja: 'crm_flujo_caja',
    crm_impuestos_mensuales: 'crm_impuestos_mensuales',
    crm_activos_inmuebles: 'crm_activos_inmuebles',
    crm_analisis_riesgo: 'crm_analisis_riesgo',
    crm_cultivos_lote: 'crm_cultivos_lote',
    
    // SGC
    procesos: 'procesos',
    indicadores: 'indicadores',
    mediciones: 'mediciones',
    objetivos_calidad: 'objetivos_calidad',
    politica_calidad: 'politica_calidad',
    auditorias: 'auditorias',
    hallazgos: 'hallazgos',
    acciones: 'acciones',
    auditoria_aspectos: 'auditoria_aspectos',
    normas: 'normas',
    productos: 'productos',
    productos_historial: 'productos_historial',
    procesos_relaciones: 'procesos_relaciones',
    minutas: 'minutas',
    
    // RRHH
    puestos: 'puestos',
    capacitaciones: 'capacitaciones',
    competencias: 'competencias',
    
    // Sistema
    documentos: 'documentos',
    encuestas: 'encuestas',
    limites_uso: 'limites_uso',
    rag_config: 'rag_config',
    rag_embeddings: 'rag_embeddings',
    rag_queries: 'rag_queries',
    rag_sources: 'rag_sources',
    refresh_tokens: 'refresh_tokens'
  },

  // Índices principales
  indexes: {
    organizations: [
      { key: { "id": 1 }, unique: true },
      { key: { "name": 1 } },
      { key: { "is_active": 1 } }
    ],
    users: [
      { key: { "email": 1 }, unique: true },
      { key: { "organization_id": 1 } },
      { key: { "role": 1 } },
      { key: { "is_active": 1 } }
    ],
    personal: [
      { key: { "id": 1 }, unique: true },
      { key: { "organization_id": 1 } },
      { key: { "email": 1 } },
      { key: { "estado": 1 } },
      { key: { "tipo_personal": 1 } }
    ],
    planes: [
      { key: { "id": 1 }, unique: true },
      { key: { "nombre": 1 } },
      { key: { "precio_mensual": 1 } }
    ],
    suscripciones: [
      { key: { "id": 1 }, unique: true },
      { key: { "organization_id": 1 } },
      { key: { "plan_id": 1 } },
      { key: { "estado": 1 } }
    ]
  },

  // Estado de migración
  migrationStatus: {
    completed: 81.4,
    totalTables: 59,
    migratedTables: 48,
    pendingTables: 11,
    criticalPending: ['planes'],
    modules: {
      organizations: 87.5,
      rrhh: 50.0,
      crmAgro: 100,
      sgc: 100,
      sistema: 100,
      relaciones: 0
    }
  }
};

module.exports = MONGODB_CONFIG;
