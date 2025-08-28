const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

// Datos de ejemplo para CRM Agro
const crmAgroData = {
  // CRM CONTACTOS
  crm_contactos: [
    {
      _id: new ObjectId(),
      id: "cont_001",
      organization_id: 1,
      nombre: "Juan Carlos",
      apellido: "López",
      cargo: "Gerente General",
      telefono: "+54 9 11 1111-1111",
      email: "juan.lopez@empresaagro.com",
      tipo_contacto: "principal",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cont_002",
      organization_id: 1,
      nombre: "María Elena",
      apellido: "Rodríguez",
      cargo: "Responsable de Compras",
      telefono: "+54 9 11 2222-2222",
      email: "maria.rodriguez@empresaagro.com",
      tipo_contacto: "secundario",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cont_003",
      organization_id: 1,
      nombre: "Carlos Alberto",
      apellido: "Gutiérrez",
      cargo: "Técnico Agrónomo",
      telefono: "+54 9 11 3333-3333",
      email: "carlos.gutierrez@empresaagro.com",
      tipo_contacto: "técnico",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM CLIENTES AGRO
  crm_clientes_agro: [
    {
      _id: new ObjectId(),
      id: "cli_001",
      organization_id: 1,
      nombre_empresa: "Agroindustria del Norte S.A.",
      tipo_cliente: "productor",
      categoria: "premium",
      supervisor_comercial_id: "per_001",
      tecnico_asignado_id: "per_003",
      vendedor_asignado_id: "per_002",
      contacto_id: "cont_001",
      direccion: "Ruta 9 Km 150, San Nicolás",
      telefono: "+54 336 444-4444",
      email: "info@agroindustrianorte.com",
      sitio_web: "www.agroindustrianorte.com",
      fecha_registro: "2024-01-15",
      estado: "activo",
      observaciones: "Cliente estratégico del norte",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cli_002",
      organization_id: 1,
      nombre_empresa: "Cooperativa Agrícola Sur",
      tipo_cliente: "cooperativa",
      categoria: "estándar",
      supervisor_comercial_id: "per_001",
      tecnico_asignado_id: "per_003",
      vendedor_asignado_id: "per_002",
      contacto_id: "cont_002",
      direccion: "Av. San Martín 500, Bahía Blanca",
      telefono: "+54 291 555-5555",
      email: "ventas@coopagricolasur.com",
      sitio_web: "www.coopagricolasur.com",
      fecha_registro: "2024-02-01",
      estado: "activo",
      observaciones: "Cooperativa con 50 productores asociados",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM EXPLOTACIONES AGRÍCOLAS
  crm_explotaciones_agricolas: [
    {
      _id: new ObjectId(),
      id: "exp_001",
      organization_id: 1,
      cliente_id: "cli_001",
      nombre_explotacion: "Estancia El Paraíso",
      ubicacion: "San Nicolás, Buenos Aires",
      superficie_total: 2500.5,
      tipo_explotacion: "mixta",
      estado: "activa",
      observaciones: "Explotación principal del cliente",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "exp_002",
      organization_id: 1,
      cliente_id: "cli_002",
      nombre_explotacion: "Campo Cooperativo Sur",
      ubicacion: "Bahía Blanca, Buenos Aires",
      superficie_total: 1800.0,
      tipo_explotacion: "agrícola",
      estado: "activa",
      observaciones: "Campo principal de la cooperativa",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM LOTES
  crm_lotes: [
    {
      _id: new ObjectId(),
      id: "lote_001",
      organization_id: 1,
      explotacion_id: "exp_001",
      nombre_lote: "Lote A - Soja",
      superficie_hectareas: 500.0,
      ubicacion: "Sector Norte",
      estado: "disponible",
      observaciones: "Lote preparado para siembra de soja",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "lote_002",
      organization_id: 1,
      explotacion_id: "exp_001",
      nombre_lote: "Lote B - Maíz",
      superficie_hectareas: 400.0,
      ubicacion: "Sector Este",
      estado: "disponible",
      observaciones: "Lote para rotación con maíz",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "lote_003",
      organization_id: 1,
      explotacion_id: "exp_002",
      nombre_lote: "Lote Cooperativo 1",
      superficie_hectareas: 600.0,
      ubicacion: "Sector Central",
      estado: "disponible",
      observaciones: "Lote principal de la cooperativa",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM CULTIVOS CLIENTE
  crm_cultivos_cliente: [
    {
      _id: new ObjectId(),
      id: "cult_cli_001",
      organization_id: 1,
      cliente_id: "cli_001",
      cultivo: "Soja",
      superficie_hectareas: 1200.0,
      fecha_siembra: "2024-11-15",
      estado: "siembra",
      observaciones: "Cultivo principal de la campaña",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cult_cli_002",
      organization_id: 1,
      cliente_id: "cli_001",
      cultivo: "Maíz",
      superficie_hectareas: 800.0,
      fecha_siembra: "2024-12-01",
      estado: "siembra",
      observaciones: "Cultivo de rotación",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cult_cli_003",
      organization_id: 1,
      cliente_id: "cli_002",
      cultivo: "Trigo",
      superficie_hectareas: 1000.0,
      fecha_siembra: "2024-06-15",
      estado: "cosecha",
      observaciones: "Cultivo de invierno",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM CULTIVOS LOTE
  crm_cultivos_lote: [
    {
      _id: new ObjectId(),
      id: "cult_lote_001",
      organization_id: 1,
      lote_id: "lote_001",
      cultivo: "Soja",
      superficie_hectareas: 500.0,
      fecha_siembra: "2024-11-15",
      estado: "siembra",
      observaciones: "Soja RR en lote A",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cult_lote_002",
      organization_id: 1,
      lote_id: "lote_002",
      cultivo: "Maíz",
      superficie_hectareas: 400.0,
      fecha_siembra: "2024-12-01",
      estado: "siembra",
      observaciones: "Maíz tardío en lote B",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM ACTIVIDADES AGRO
  crm_actividades_agro: [
    {
      _id: new ObjectId(),
      id: "act_001",
      organization_id: 1,
      tecnico_id: "per_003",
      vendedor_id: "per_002",
      contacto_id: "cont_001",
      cliente_id: "cli_001",
      oportunidad_id: null,
      tipo_actividad: "visita_tecnica",
      descripcion: "Visita técnica para planificación de siembra",
      fecha_actividad: "2024-10-15",
      duracion_horas: 4.0,
      estado: "completada",
      resultado: "Planificación aprobada",
      observaciones: "Cliente satisfecho con la propuesta",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "act_002",
      organization_id: 1,
      tecnico_id: "per_003",
      vendedor_id: "per_002",
      contacto_id: "cont_002",
      cliente_id: "cli_002",
      oportunidad_id: null,
      tipo_actividad: "capacitacion",
      descripcion: "Capacitación en manejo de cultivos",
      fecha_actividad: "2024-10-20",
      duracion_horas: 6.0,
      estado: "programada",
      resultado: null,
      observaciones: "Capacitación para 20 productores",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM OPORTUNIDADES AGRO
  crm_oportunidades_agro: [
    {
      _id: new ObjectId(),
      id: "opp_001",
      organization_id: 1,
      supervisor_id: "per_001",
      tecnico_id: "per_003",
      vendedor_id: "per_002",
      contacto_id: "cont_001",
      cliente_id: "cli_001",
      nombre_oportunidad: "Venta de Fertilizantes 2024",
      descripcion: "Oportunidad de venta de fertilizantes para la campaña 2024/25",
      valor_estimado: 150000.0,
      probabilidad: 80,
      fecha_cierre_esperada: "2024-11-30",
      estado: "negociacion",
      observaciones: "Cliente interesado en productos premium",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "opp_002",
      organization_id: 1,
      supervisor_id: "per_001",
      tecnico_id: "per_003",
      vendedor_id: "per_002",
      contacto_id: "cont_002",
      cliente_id: "cli_002",
      nombre_oportunidad: "Servicios de Asesoramiento Técnico",
      descripcion: "Contrato de asesoramiento técnico anual",
      valor_estimado: 50000.0,
      probabilidad: 60,
      fecha_cierre_esperada: "2024-12-15",
      estado: "prospeccion",
      observaciones: "Evaluando propuesta técnica",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM PRODUCTOS AGRO
  crm_productos_agro: [
    {
      _id: new ObjectId(),
      id: "prod_agro_001",
      organization_id: 1,
      producto_iso_id: null,
      nombre_producto: "Fertilizante NPK Premium",
      descripcion: "Fertilizante balanceado para cultivos extensivos",
      categoria: "fertilizantes",
      precio_unitario: 850.0,
      unidad_medida: "kg",
      stock_disponible: 10000.0,
      estado: "activo",
      observaciones: "Producto estrella de la línea",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "prod_agro_002",
      organization_id: 1,
      producto_iso_id: null,
      nombre_producto: "Herbicida Selectivo",
      descripcion: "Herbicida para control de malezas en soja",
      categoria: "herbicidas",
      precio_unitario: 1200.0,
      unidad_medida: "litros",
      stock_disponible: 5000.0,
      estado: "activo",
      observaciones: "Producto de alta demanda",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM ZONAS GEOGRÁFICAS
  crm_zonas_geograficas: [
    {
      _id: new ObjectId(),
      id: "zona_001",
      organization_id: 1,
      tecnico_responsable_id: "per_003",
      vendedor_responsable_id: "per_002",
      nombre_zona: "Zona Norte",
      descripcion: "Zona norte de Buenos Aires",
      region: "Buenos Aires Norte",
      estado: "activa",
      observaciones: "Zona de alta producción agrícola",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "zona_002",
      organization_id: 1,
      tecnico_responsable_id: "per_003",
      vendedor_responsable_id: "per_002",
      nombre_zona: "Zona Sur",
      descripcion: "Zona sur de Buenos Aires",
      region: "Buenos Aires Sur",
      estado: "activa",
      observaciones: "Zona de producción mixta",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM BALANCES FINANCIEROS
  crm_balances_financieros: [
    {
      _id: new ObjectId(),
      id: "bal_001",
      organization_id: 1,
      cliente_id: "cli_001",
      fecha_balance: "2024-06-30",
      activos_corrientes: 2500000.0,
      pasivos_corrientes: 800000.0,
      activos_fijos: 5000000.0,
      pasivos_largo_plazo: 2000000.0,
      patrimonio_neto: 4700000.0,
      observaciones: "Balance sólido, cliente solvente",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "bal_002",
      organization_id: 1,
      cliente_id: "cli_002",
      fecha_balance: "2024-06-30",
      activos_corrientes: 1500000.0,
      pasivos_corrientes: 500000.0,
      activos_fijos: 3000000.0,
      pasivos_largo_plazo: 1000000.0,
      patrimonio_neto: 3000000.0,
      observaciones: "Cooperativa con buena posición financiera",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM ANÁLISIS DE RIESGO
  crm_analisis_riesgo: [
    {
      _id: new ObjectId(),
      id: "riesgo_001",
      organization_id: 1,
      cliente_id: "cli_001",
      fecha_analisis: "2024-10-01",
      nivel_riesgo: "bajo",
      factores_riesgo: "Clima, precios de commodities",
      recomendaciones: "Mantener línea de crédito actual",
      estado: "aprobado",
      observaciones: "Cliente de bajo riesgo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "riesgo_002",
      organization_id: 1,
      cliente_id: "cli_002",
      fecha_analisis: "2024-10-01",
      nivel_riesgo: "medio",
      factores_riesgo: "Dependencia de precios internacionales",
      recomendaciones: "Monitorear evolución de precios",
      estado: "aprobado",
      observaciones: "Riesgo controlado",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM FLUJO DE CAJA
  crm_flujo_caja: [
    {
      _id: new ObjectId(),
      id: "flujo_001",
      organization_id: 1,
      cliente_id: "cli_001",
      fecha_periodo: "2024-10-01",
      ingresos_operativos: 800000.0,
      gastos_operativos: 500000.0,
      flujo_neto: 300000.0,
      observaciones: "Flujo positivo, buena capacidad de pago",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "flujo_002",
      organization_id: 1,
      cliente_id: "cli_002",
      fecha_periodo: "2024-10-01",
      ingresos_operativos: 600000.0,
      gastos_operativos: 400000.0,
      flujo_neto: 200000.0,
      observaciones: "Flujo estable",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM IMPUESTOS MENSUALES
  crm_impuestos_mensuales: [
    {
      _id: new ObjectId(),
      id: "imp_001",
      organization_id: 1,
      cliente_id: "cli_001",
      mes: 10,
      año: 2024,
      monto_impuestos: 50000.0,
      tipo_impuesto: "IIBB",
      estado: "pagado",
      fecha_vencimiento: "2024-10-20",
      observaciones: "Impuesto pagado en tiempo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "imp_002",
      organization_id: 1,
      cliente_id: "cli_002",
      mes: 10,
      año: 2024,
      monto_impuestos: 30000.0,
      tipo_impuesto: "IIBB",
      estado: "pendiente",
      fecha_vencimiento: "2024-10-20",
      observaciones: "Pendiente de pago",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM MÉTRICAS AGRO
  crm_metricas_agro: [
    {
      _id: new ObjectId(),
      id: "met_001",
      organization_id: 1,
      vendedor_id: "per_002",
      fecha_metrica: "2024-10-01",
      ventas_mes: 250000.0,
      clientes_nuevos: 2,
      oportunidades_activas: 5,
      conversion_rate: 0.75,
      observaciones: "Excelente mes de ventas",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CRM ACTIVOS INMUEBLES
  crm_activos_inmuebles: [
    {
      _id: new ObjectId(),
      id: "activo_001",
      organization_id: 1,
      balance_id: "bal_001",
      tipo_activo: "maquinaria",
      descripcion: "Tractores y cosechadoras",
      valor: 2000000.0,
      fecha_adquisicion: "2020-01-15",
      estado: "activo",
      observaciones: "Maquinaria en buen estado",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "activo_002",
      organization_id: 1,
      balance_id: "bal_001",
      tipo_activo: "inmueble",
      descripcion: "Silos y galpones",
      valor: 1500000.0,
      fecha_adquisicion: "2019-06-01",
      estado: "activo",
      observaciones: "Infraestructura de almacenamiento",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

async function migrateCRMAgroModule() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conexión exitosa');
    
    const db = client.db(DB_NAME);
    
    // 1. MIGRAR CONTACTOS
    console.log('\n📞 Migrando contactos...');
    const contactosCollection = db.collection('crm_contactos');
    await contactosCollection.deleteMany({});
    const contactosResult = await contactosCollection.insertMany(crmAgroData.crm_contactos);
    console.log(`✅ ${contactosResult.insertedCount} contactos migrados`);
    
    // 2. MIGRAR CLIENTES
    console.log('\n🏢 Migrando clientes...');
    const clientesCollection = db.collection('crm_clientes_agro');
    await clientesCollection.deleteMany({});
    const clientesResult = await clientesCollection.insertMany(crmAgroData.crm_clientes_agro);
    console.log(`✅ ${clientesResult.insertedCount} clientes migrados`);
    
    // 3. MIGRAR EXPLOTACIONES
    console.log('\n🌾 Migrando explotaciones...');
    const explotacionesCollection = db.collection('crm_explotaciones_agricolas');
    await explotacionesCollection.deleteMany({});
    const explotacionesResult = await explotacionesCollection.insertMany(crmAgroData.crm_explotaciones_agricolas);
    console.log(`✅ ${explotacionesResult.insertedCount} explotaciones migradas`);
    
    // 4. MIGRAR LOTES
    console.log('\n📦 Migrando lotes...');
    const lotesCollection = db.collection('crm_lotes');
    await lotesCollection.deleteMany({});
    const lotesResult = await lotesCollection.insertMany(crmAgroData.crm_lotes);
    console.log(`✅ ${lotesResult.insertedCount} lotes migrados`);
    
    // 5. MIGRAR CULTIVOS CLIENTE
    console.log('\n🌱 Migrando cultivos cliente...');
    const cultivosClienteCollection = db.collection('crm_cultivos_cliente');
    await cultivosClienteCollection.deleteMany({});
    const cultivosClienteResult = await cultivosClienteCollection.insertMany(crmAgroData.crm_cultivos_cliente);
    console.log(`✅ ${cultivosClienteResult.insertedCount} cultivos cliente migrados`);
    
    // 6. MIGRAR CULTIVOS LOTE
    console.log('\n🌿 Migrando cultivos lote...');
    const cultivosLoteCollection = db.collection('crm_cultivos_lote');
    await cultivosLoteCollection.deleteMany({});
    const cultivosLoteResult = await cultivosLoteCollection.insertMany(crmAgroData.crm_cultivos_lote);
    console.log(`✅ ${cultivosLoteResult.insertedCount} cultivos lote migrados`);
    
    // 7. MIGRAR ACTIVIDADES
    console.log('\n📅 Migrando actividades...');
    const actividadesCollection = db.collection('crm_actividades_agro');
    await actividadesCollection.deleteMany({});
    const actividadesResult = await actividadesCollection.insertMany(crmAgroData.crm_actividades_agro);
    console.log(`✅ ${actividadesResult.insertedCount} actividades migradas`);
    
    // 8. MIGRAR OPORTUNIDADES
    console.log('\n🎯 Migrando oportunidades...');
    const oportunidadesCollection = db.collection('crm_oportunidades_agro');
    await oportunidadesCollection.deleteMany({});
    const oportunidadesResult = await oportunidadesCollection.insertMany(crmAgroData.crm_oportunidades_agro);
    console.log(`✅ ${oportunidadesResult.insertedCount} oportunidades migradas`);
    
    // 9. MIGRAR PRODUCTOS
    console.log('\n📦 Migrando productos...');
    const productosCollection = db.collection('crm_productos_agro');
    await productosCollection.deleteMany({});
    const productosResult = await productosCollection.insertMany(crmAgroData.crm_productos_agro);
    console.log(`✅ ${productosResult.insertedCount} productos migrados`);
    
    // 10. MIGRAR ZONAS
    console.log('\n🗺️ Migrando zonas...');
    const zonasCollection = db.collection('crm_zonas_geograficas');
    await zonasCollection.deleteMany({});
    const zonasResult = await zonasCollection.insertMany(crmAgroData.crm_zonas_geograficas);
    console.log(`✅ ${zonasResult.insertedCount} zonas migradas`);
    
    // 11. MIGRAR BALANCES
    console.log('\n💰 Migrando balances...');
    const balancesCollection = db.collection('crm_balances_financieros');
    await balancesCollection.deleteMany({});
    const balancesResult = await balancesCollection.insertMany(crmAgroData.crm_balances_financieros);
    console.log(`✅ ${balancesResult.insertedCount} balances migrados`);
    
    // 12. MIGRAR ANÁLISIS DE RIESGO
    console.log('\n⚠️ Migrando análisis de riesgo...');
    const riesgoCollection = db.collection('crm_analisis_riesgo');
    await riesgoCollection.deleteMany({});
    const riesgoResult = await riesgoCollection.insertMany(crmAgroData.crm_analisis_riesgo);
    console.log(`✅ ${riesgoResult.insertedCount} análisis de riesgo migrados`);
    
    // 13. MIGRAR FLUJO DE CAJA
    console.log('\n💸 Migrando flujo de caja...');
    const flujoCollection = db.collection('crm_flujo_caja');
    await flujoCollection.deleteMany({});
    const flujoResult = await flujoCollection.insertMany(crmAgroData.crm_flujo_caja);
    console.log(`✅ ${flujoResult.insertedCount} flujos de caja migrados`);
    
    // 14. MIGRAR IMPUESTOS
    console.log('\n📋 Migrando impuestos...');
    const impuestosCollection = db.collection('crm_impuestos_mensuales');
    await impuestosCollection.deleteMany({});
    const impuestosResult = await impuestosCollection.insertMany(crmAgroData.crm_impuestos_mensuales);
    console.log(`✅ ${impuestosResult.insertedCount} impuestos migrados`);
    
    // 15. MIGRAR MÉTRICAS
    console.log('\n📊 Migrando métricas...');
    const metricasCollection = db.collection('crm_metricas_agro');
    await metricasCollection.deleteMany({});
    const metricasResult = await metricasCollection.insertMany(crmAgroData.crm_metricas_agro);
    console.log(`✅ ${metricasResult.insertedCount} métricas migradas`);
    
    // 16. MIGRAR ACTIVOS
    console.log('\n🏗️ Migrando activos...');
    const activosCollection = db.collection('crm_activos_inmuebles');
    await activosCollection.deleteMany({});
    const activosResult = await activosCollection.insertMany(crmAgroData.crm_activos_inmuebles);
    console.log(`✅ ${activosResult.insertedCount} activos migrados`);
    
    // CREAR ÍNDICES
    console.log('\n🔍 Creando índices...');
    
    // Índices para contactos
    await contactosCollection.createIndex({ "organization_id": 1 });
    await contactosCollection.createIndex({ "email": 1 });
    
    // Índices para clientes
    await clientesCollection.createIndex({ "organization_id": 1 });
    await clientesCollection.createIndex({ "estado": 1 });
    await clientesCollection.createIndex({ "tipo_cliente": 1 });
    
    // Índices para explotaciones
    await explotacionesCollection.createIndex({ "organization_id": 1 });
    await explotacionesCollection.createIndex({ "cliente_id": 1 });
    
    // Índices para lotes
    await lotesCollection.createIndex({ "organization_id": 1 });
    await lotesCollection.createIndex({ "explotacion_id": 1 });
    
    // Índices para cultivos
    await cultivosClienteCollection.createIndex({ "organization_id": 1 });
    await cultivosClienteCollection.createIndex({ "cliente_id": 1 });
    await cultivosLoteCollection.createIndex({ "organization_id": 1 });
    await cultivosLoteCollection.createIndex({ "lote_id": 1 });
    
    // Índices para actividades
    await actividadesCollection.createIndex({ "organization_id": 1 });
    await actividadesCollection.createIndex({ "cliente_id": 1 });
    await actividadesCollection.createIndex({ "fecha_actividad": 1 });
    
    // Índices para oportunidades
    await oportunidadesCollection.createIndex({ "organization_id": 1 });
    await oportunidadesCollection.createIndex({ "cliente_id": 1 });
    await oportunidadesCollection.createIndex({ "estado": 1 });
    
    // Índices para productos
    await productosCollection.createIndex({ "organization_id": 1 });
    await productosCollection.createIndex({ "categoria": 1 });
    
    // Índices para zonas
    await zonasCollection.createIndex({ "organization_id": 1 });
    await zonasCollection.createIndex({ "region": 1 });
    
    // Índices para balances
    await balancesCollection.createIndex({ "organization_id": 1 });
    await balancesCollection.createIndex({ "cliente_id": 1 });
    
    // Índices para riesgo
    await riesgoCollection.createIndex({ "organization_id": 1 });
    await riesgoCollection.createIndex({ "cliente_id": 1 });
    
    // Índices para flujo
    await flujoCollection.createIndex({ "organization_id": 1 });
    await flujoCollection.createIndex({ "cliente_id": 1 });
    
    // Índices para impuestos
    await impuestosCollection.createIndex({ "organization_id": 1 });
    await impuestosCollection.createIndex({ "cliente_id": 1 });
    await impuestosCollection.createIndex({ "estado": 1 });
    
    // Índices para métricas
    await metricasCollection.createIndex({ "organization_id": 1 });
    await metricasCollection.createIndex({ "vendedor_id": 1 });
    
    // Índices para activos
    await activosCollection.createIndex({ "organization_id": 1 });
    await activosCollection.createIndex({ "balance_id": 1 });
    
    console.log('✅ Índices creados exitosamente');
    
    // VERIFICAR MIGRACIÓN
    console.log('\n📊 Verificando migración...');
    
    const contactosCount = await contactosCollection.countDocuments();
    const clientesCount = await clientesCollection.countDocuments();
    const explotacionesCount = await explotacionesCollection.countDocuments();
    const lotesCount = await lotesCollection.countDocuments();
    const cultivosClienteCount = await cultivosClienteCollection.countDocuments();
    const cultivosLoteCount = await cultivosLoteCollection.countDocuments();
    const actividadesCount = await actividadesCollection.countDocuments();
    const oportunidadesCount = await oportunidadesCollection.countDocuments();
    const productosCount = await productosCollection.countDocuments();
    const zonasCount = await zonasCollection.countDocuments();
    const balancesCount = await balancesCollection.countDocuments();
    const riesgoCount = await riesgoCollection.countDocuments();
    const flujoCount = await flujoCollection.countDocuments();
    const impuestosCount = await impuestosCollection.countDocuments();
    const metricasCount = await metricasCollection.countDocuments();
    const activosCount = await activosCollection.countDocuments();
    
    console.log(`📈 Resumen de migración CRM Agro:`);
    console.log(`   - Contactos: ${contactosCount}`);
    console.log(`   - Clientes: ${clientesCount}`);
    console.log(`   - Explotaciones: ${explotacionesCount}`);
    console.log(`   - Lotes: ${lotesCount}`);
    console.log(`   - Cultivos Cliente: ${cultivosClienteCount}`);
    console.log(`   - Cultivos Lote: ${cultivosLoteCount}`);
    console.log(`   - Actividades: ${actividadesCount}`);
    console.log(`   - Oportunidades: ${oportunidadesCount}`);
    console.log(`   - Productos: ${productosCount}`);
    console.log(`   - Zonas: ${zonasCount}`);
    console.log(`   - Balances: ${balancesCount}`);
    console.log(`   - Análisis Riesgo: ${riesgoCount}`);
    console.log(`   - Flujo Caja: ${flujoCount}`);
    console.log(`   - Impuestos: ${impuestosCount}`);
    console.log(`   - Métricas: ${metricasCount}`);
    console.log(`   - Activos: ${activosCount}`);
    
    console.log('\n🎉 ¡Migración del módulo CRM Agro completada exitosamente!');
    
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
  migrateCRMAgroModule()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { migrateCRMAgroModule };
