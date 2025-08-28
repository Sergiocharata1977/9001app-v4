const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

// Datos de ejemplo para SGC
const sgcData = {
  // PROCESOS
  procesos: [
    {
      _id: new ObjectId(),
      id: "proc_001",
      organization_id: 1,
      nombre: "Gestión de Recursos Humanos",
      descripcion: "Proceso de gestión del capital humano",
      responsable: "per_001",
      entrada: "Necesidades de personal",
      salida: "Personal capacitado y evaluado",
      recursos: "RRHH, capacitaciones, evaluaciones",
      estado: "activo",
      observaciones: "Proceso crítico para la organización",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "proc_002",
      organization_id: 1,
      nombre: "Gestión de Ventas",
      descripcion: "Proceso de ventas y atención al cliente",
      responsable: "per_002",
      entrada: "Demanda de productos",
      salida: "Ventas realizadas",
      recursos: "Vendedores, productos, CRM",
      estado: "activo",
      observaciones: "Proceso principal de ingresos",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "proc_003",
      organization_id: 1,
      nombre: "Gestión de Calidad",
      descripcion: "Proceso de control y mejora de calidad",
      responsable: "per_003",
      entrada: "Estándares de calidad",
      salida: "Productos certificados",
      recursos: "Normas ISO, auditorías, indicadores",
      estado: "activo",
      observaciones: "Proceso de certificación ISO 9001",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // INDICADORES
  indicadores: [
    {
      _id: new ObjectId(),
      id: "ind_001",
      organization_id: 1,
      proceso_id: "proc_001",
      nombre: "Satisfacción del Personal",
      descripcion: "Nivel de satisfacción del personal",
      tipo_indicador: "satisfaccion",
      unidad_medida: "porcentaje",
      meta: 85.0,
      estado: "activo",
      observaciones: "Medido trimestralmente",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "ind_002",
      organization_id: 1,
      proceso_id: "proc_002",
      nombre: "Tasa de Conversión de Ventas",
      descripcion: "Porcentaje de oportunidades convertidas",
      tipo_indicador: "eficiencia",
      unidad_medida: "porcentaje",
      meta: 75.0,
      estado: "activo",
      observaciones: "Medido mensualmente",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "ind_003",
      organization_id: 1,
      proceso_id: "proc_003",
      nombre: "Cumplimiento de Normas",
      descripcion: "Cumplimiento de estándares ISO",
      tipo_indicador: "cumplimiento",
      unidad_medida: "porcentaje",
      meta: 95.0,
      estado: "activo",
      observaciones: "Medido en auditorías",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // MEDICIONES
  mediciones: [
    {
      _id: new ObjectId(),
      id: "med_001",
      organization_id: 1,
      indicador_id: "ind_001",
      fecha_medicion: "2024-10-01",
      valor: 87.5,
      observaciones: "Excelente nivel de satisfacción",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "med_002",
      organization_id: 1,
      indicador_id: "ind_002",
      fecha_medicion: "2024-10-01",
      valor: 78.2,
      observaciones: "Supera la meta establecida",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "med_003",
      organization_id: 1,
      indicador_id: "ind_003",
      fecha_medicion: "2024-10-01",
      valor: 96.8,
      observaciones: "Cumplimiento excepcional",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // HALLAZGOS
  hallazgos: [
    {
      _id: new ObjectId(),
      id: "hall_001",
      organization_id: 1,
      proceso_id: "proc_001",
      tipo_hallazgo: "no_conformidad",
      descripcion: "Falta de documentación en evaluaciones",
      severidad: "media",
      fecha_deteccion: "2024-10-15",
      estado: "abierto",
      observaciones: "Requiere acción correctiva",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "hall_002",
      organization_id: 1,
      proceso_id: "proc_002",
      tipo_hallazgo: "oportunidad_mejora",
      descripcion: "Mejorar seguimiento de oportunidades",
      severidad: "baja",
      fecha_deteccion: "2024-10-20",
      estado: "abierto",
      observaciones: "Mejora del proceso de ventas",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // ACCIONES
  acciones: [
    {
      _id: new ObjectId(),
      id: "acc_001",
      organization_id: 1,
      hallazgo_id: "hall_001",
      tipo_accion: "correctiva",
      descripcion: "Implementar sistema de documentación",
      responsable: "per_001",
      fecha_inicio: "2024-10-16",
      fecha_fin_esperada: "2024-11-16",
      fecha_fin_real: null,
      estado: "en_proceso",
      observaciones: "Desarrollo de plantillas",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "acc_002",
      organization_id: 1,
      hallazgo_id: "hall_002",
      tipo_accion: "preventiva",
      descripcion: "Capacitar equipo de ventas",
      responsable: "per_002",
      fecha_inicio: "2024-10-21",
      fecha_fin_esperada: "2024-11-21",
      fecha_fin_real: null,
      estado: "pendiente",
      observaciones: "Programar capacitación",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // AUDITORÍAS
  auditorias: [
    {
      _id: new ObjectId(),
      id: "aud_001",
      organization_id: 1,
      tipo_auditoria: "interna",
      fecha_auditoria: "2024-10-15",
      auditor: "per_003",
      alcance: "Procesos de RRHH y Ventas",
      objetivo: "Verificar cumplimiento de procedimientos",
      estado: "completada",
      resultado: "Cumplimiento satisfactorio con hallazgos menores",
      observaciones: "Auditoría exitosa",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "aud_002",
      organization_id: 1,
      tipo_auditoria: "externa",
      fecha_auditoria: "2024-12-01",
      auditor: "Certificadora ABC",
      alcance: "Sistema de Gestión de Calidad completo",
      objetivo: "Certificación ISO 9001:2015",
      estado: "programada",
      resultado: null,
      observaciones: "Auditoría de certificación",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // ASPECTOS DE AUDITORÍA
  auditoria_aspectos: [
    {
      _id: new ObjectId(),
      id: "asp_001",
      organization_id: 1,
      auditoria_id: "aud_001",
      aspecto: "Documentación de procesos",
      descripcion: "Revisión de procedimientos documentados",
      estado: "pendiente",
      observaciones: "Requiere mejora en documentación",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "asp_002",
      organization_id: 1,
      auditoria_id: "aud_001",
      aspecto: "Control de registros",
      descripcion: "Verificación de registros de calidad",
      estado: "completado",
      observaciones: "Registros en orden",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // MINUTAS
  minutas: [
    {
      _id: new ObjectId(),
      id: "min_001",
      organization_id: 1,
      titulo: "Revisión de Indicadores Q3 2024",
      fecha_reunion: "2024-10-01",
      hora_inicio: "09:00",
      hora_fin: "11:00",
      lugar: "Sala de Reuniones",
      tipo_reunion: "revision_indicadores",
      objetivo: "Revisar cumplimiento de indicadores del tercer trimestre",
      agenda: "1. Presentación de indicadores\n2. Análisis de desviaciones\n3. Plan de acción",
      conclusiones: "Indicadores en línea con metas",
      acuerdos: "Implementar mejoras en proceso de ventas",
      proxima_reunion: "2024-11-01",
      estado: "completada",
      observaciones: "Reunión productiva",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "min_002",
      organization_id: 1,
      titulo: "Preparación Auditoría Externa",
      fecha_reunion: "2024-11-15",
      hora_inicio: "14:00",
      hora_fin: "16:00",
      lugar: "Sala de Reuniones",
      tipo_reunion: "preparacion_auditoria",
      objetivo: "Preparar equipo para auditoría externa",
      agenda: "1. Revisión de documentación\n2. Asignación de responsabilidades\n3. Simulación de auditoría",
      conclusiones: "Equipo preparado para auditoría",
      acuerdos: "Completar documentación faltante",
      proxima_reunion: "2024-11-30",
      estado: "programada",
      observaciones: "Preparación en curso",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // NORMAS
  normas: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      codigo: "ISO 9001:2015",
      titulo: "Sistemas de Gestión de Calidad",
      descripcion: "Norma internacional para sistemas de gestión de calidad",
      version: "2015",
      fecha_publicacion: "2015-09-15",
      estado: "vigente",
      observaciones: "Norma base del sistema",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      codigo: "ISO 14001:2015",
      titulo: "Sistemas de Gestión Ambiental",
      descripcion: "Norma para gestión ambiental",
      version: "2015",
      fecha_publicacion: "2015-09-15",
      estado: "vigente",
      observaciones: "Futura implementación",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // OBJETIVOS DE CALIDAD
  objetivos_calidad: [
    {
      _id: new ObjectId(),
      id: "obj_001",
      organization_id: 1,
      indicador_asociado_id: "ind_001",
      proceso_id: "proc_001",
      nombre: "Mejorar Satisfacción del Personal",
      descripcion: "Aumentar satisfacción del personal al 90%",
      meta: 90.0,
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-12-31",
      estado: "activo",
      observaciones: "Objetivo anual",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "obj_002",
      organization_id: 1,
      indicador_asociado_id: "ind_002",
      proceso_id: "proc_002",
      nombre: "Optimizar Conversión de Ventas",
      descripcion: "Mejorar tasa de conversión al 80%",
      meta: 80.0,
      fecha_inicio: "2024-01-01",
      fecha_fin: "2024-12-31",
      estado: "activo",
      observaciones: "Objetivo estratégico",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // POLÍTICA DE CALIDAD
  politica_calidad: [
    {
      _id: new ObjectId(),
      id: "pol_001",
      organization_id: 1,
      titulo: "Política de Calidad 2024",
      descripcion: "Compromiso con la excelencia y mejora continua",
      fecha_aprobacion: "2024-01-15",
      version: "2024.1",
      estado: "vigente",
      observaciones: "Política aprobada por dirección",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // PRODUCTOS
  productos: [
    {
      _id: new ObjectId(),
      id: "prod_001",
      organization_id: 1,
      nombre: "Sistema de Gestión ISO",
      descripcion: "Sistema integral de gestión de calidad",
      categoria: "software",
      codigo: "SGI-001",
      version: "2.0",
      estado: "activo",
      updated_by: 1,
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "prod_002",
      organization_id: 1,
      nombre: "Manual de Calidad",
      descripcion: "Documentación del sistema de calidad",
      categoria: "documentacion",
      codigo: "DOC-001",
      version: "1.0",
      estado: "activo",
      updated_by: 1,
      created_by: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // HISTORIAL DE PRODUCTOS
  productos_historial: [
    {
      _id: new ObjectId(),
      id: "hist_001",
      organization_id: 1,
      producto_id: "prod_001",
      version: "1.0",
      cambios: "Versión inicial del sistema",
      fecha_cambio: "2024-01-01",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "hist_002",
      organization_id: 1,
      producto_id: "prod_001",
      version: "2.0",
      cambios: "Mejoras en interfaz y funcionalidades",
      fecha_cambio: "2024-06-01",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // RELACIONES DE PROCESOS
  procesos_relaciones: [
    {
      _id: new ObjectId(),
      id: "rel_proc_001",
      organization_id: 1,
      proceso_origen_id: "proc_001",
      proceso_destino_id: "proc_002",
      tipo_relacion: "entrada",
      descripcion: "Personal capacitado alimenta proceso de ventas",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "rel_proc_002",
      organization_id: 1,
      proceso_origen_id: "proc_002",
      proceso_destino_id: "proc_003",
      tipo_relacion: "control",
      descripcion: "Ventas son controladas por calidad",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

async function migrateSGCModule() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conexión exitosa');
    
    const db = client.db(DB_NAME);
    
    // 1. MIGRAR PROCESOS
    console.log('\n⚙️ Migrando procesos...');
    const procesosCollection = db.collection('procesos');
    await procesosCollection.deleteMany({});
    const procesosResult = await procesosCollection.insertMany(sgcData.procesos);
    console.log(`✅ ${procesosResult.insertedCount} procesos migrados`);
    
    // 2. MIGRAR INDICADORES
    console.log('\n📊 Migrando indicadores...');
    const indicadoresCollection = db.collection('indicadores');
    await indicadoresCollection.deleteMany({});
    const indicadoresResult = await indicadoresCollection.insertMany(sgcData.indicadores);
    console.log(`✅ ${indicadoresResult.insertedCount} indicadores migrados`);
    
    // 3. MIGRAR MEDICIONES
    console.log('\n📏 Migrando mediciones...');
    const medicionesCollection = db.collection('mediciones');
    await medicionesCollection.deleteMany({});
    const medicionesResult = await medicionesCollection.insertMany(sgcData.mediciones);
    console.log(`✅ ${medicionesResult.insertedCount} mediciones migradas`);
    
    // 4. MIGRAR HALLAZGOS
    console.log('\n🔍 Migrando hallazgos...');
    const hallazgosCollection = db.collection('hallazgos');
    await hallazgosCollection.deleteMany({});
    const hallazgosResult = await hallazgosCollection.insertMany(sgcData.hallazgos);
    console.log(`✅ ${hallazgosResult.insertedCount} hallazgos migrados`);
    
    // 5. MIGRAR ACCIONES
    console.log('\n🎯 Migrando acciones...');
    const accionesCollection = db.collection('acciones');
    await accionesCollection.deleteMany({});
    const accionesResult = await accionesCollection.insertMany(sgcData.acciones);
    console.log(`✅ ${accionesResult.insertedCount} acciones migradas`);
    
    // 6. MIGRAR AUDITORÍAS
    console.log('\n🔎 Migrando auditorías...');
    const auditoriasCollection = db.collection('auditorias');
    await auditoriasCollection.deleteMany({});
    const auditoriasResult = await auditoriasCollection.insertMany(sgcData.auditorias);
    console.log(`✅ ${auditoriasResult.insertedCount} auditorías migradas`);
    
    // 7. MIGRAR ASPECTOS DE AUDITORÍA
    console.log('\n📋 Migrando aspectos de auditoría...');
    const aspectosCollection = db.collection('auditoria_aspectos');
    await aspectosCollection.deleteMany({});
    const aspectosResult = await aspectosCollection.insertMany(sgcData.auditoria_aspectos);
    console.log(`✅ ${aspectosResult.insertedCount} aspectos migrados`);
    
    // 8. MIGRAR MINUTAS
    console.log('\n📝 Migrando minutas...');
    const minutasCollection = db.collection('minutas');
    await minutasCollection.deleteMany({});
    const minutasResult = await minutasCollection.insertMany(sgcData.minutas);
    console.log(`✅ ${minutasResult.insertedCount} minutas migradas`);
    
    // 9. MIGRAR NORMAS
    console.log('\n📚 Migrando normas...');
    const normasCollection = db.collection('normas');
    await normasCollection.deleteMany({});
    const normasResult = await normasCollection.insertMany(sgcData.normas);
    console.log(`✅ ${normasResult.insertedCount} normas migradas`);
    
    // 10. MIGRAR OBJETIVOS
    console.log('\n🎯 Migrando objetivos...');
    const objetivosCollection = db.collection('objetivos_calidad');
    await objetivosCollection.deleteMany({});
    const objetivosResult = await objetivosCollection.insertMany(sgcData.objetivos_calidad);
    console.log(`✅ ${objetivosResult.insertedCount} objetivos migrados`);
    
    // 11. MIGRAR POLÍTICA
    console.log('\n📜 Migrando política...');
    const politicaCollection = db.collection('politica_calidad');
    await politicaCollection.deleteMany({});
    const politicaResult = await politicaCollection.insertMany(sgcData.politica_calidad);
    console.log(`✅ ${politicaResult.insertedCount} políticas migradas`);
    
    // 12. MIGRAR PRODUCTOS
    console.log('\n📦 Migrando productos...');
    const productosCollection = db.collection('productos');
    await productosCollection.deleteMany({});
    const productosResult = await productosCollection.insertMany(sgcData.productos);
    console.log(`✅ ${productosResult.insertedCount} productos migrados`);
    
    // 13. MIGRAR HISTORIAL
    console.log('\n📚 Migrando historial...');
    const historialCollection = db.collection('productos_historial');
    await historialCollection.deleteMany({});
    const historialResult = await historialCollection.insertMany(sgcData.productos_historial);
    console.log(`✅ ${historialResult.insertedCount} historiales migrados`);
    
    // 14. MIGRAR RELACIONES DE PROCESOS
    console.log('\n🔗 Migrando relaciones de procesos...');
    const relacionesCollection = db.collection('procesos_relaciones');
    await relacionesCollection.deleteMany({});
    const relacionesResult = await relacionesCollection.insertMany(sgcData.procesos_relaciones);
    console.log(`✅ ${relacionesResult.insertedCount} relaciones migradas`);
    
    // CREAR ÍNDICES
    console.log('\n🔍 Creando índices...');
    
    // Índices para procesos
    await procesosCollection.createIndex({ "organization_id": 1 });
    await procesosCollection.createIndex({ "estado": 1 });
    
    // Índices para indicadores
    await indicadoresCollection.createIndex({ "organization_id": 1 });
    await indicadoresCollection.createIndex({ "proceso_id": 1 });
    await indicadoresCollection.createIndex({ "estado": 1 });
    
    // Índices para mediciones
    await medicionesCollection.createIndex({ "organization_id": 1 });
    await medicionesCollection.createIndex({ "indicador_id": 1 });
    await medicionesCollection.createIndex({ "fecha_medicion": 1 });
    
    // Índices para hallazgos
    await hallazgosCollection.createIndex({ "organization_id": 1 });
    await hallazgosCollection.createIndex({ "proceso_id": 1 });
    await hallazgosCollection.createIndex({ "estado": 1 });
    
    // Índices para acciones
    await accionesCollection.createIndex({ "organization_id": 1 });
    await accionesCollection.createIndex({ "hallazgo_id": 1 });
    await accionesCollection.createIndex({ "estado": 1 });
    
    // Índices para auditorías
    await auditoriasCollection.createIndex({ "organization_id": 1 });
    await auditoriasCollection.createIndex({ "estado": 1 });
    await auditoriasCollection.createIndex({ "fecha_auditoria": 1 });
    
    // Índices para aspectos
    await aspectosCollection.createIndex({ "organization_id": 1 });
    await aspectosCollection.createIndex({ "auditoria_id": 1 });
    
    // Índices para minutas
    await minutasCollection.createIndex({ "organization_id": 1 });
    await minutasCollection.createIndex({ "estado": 1 });
    await minutasCollection.createIndex({ "fecha_reunion": 1 });
    
    // Índices para normas
    await normasCollection.createIndex({ "organization_id": 1 });
    await normasCollection.createIndex({ "estado": 1 });
    
    // Índices para objetivos
    await objetivosCollection.createIndex({ "organization_id": 1 });
    await objetivosCollection.createIndex({ "proceso_id": 1 });
    await objetivosCollection.createIndex({ "estado": 1 });
    
    // Índices para política
    await politicaCollection.createIndex({ "organization_id": 1 });
    await politicaCollection.createIndex({ "estado": 1 });
    
    // Índices para productos
    await productosCollection.createIndex({ "organization_id": 1 });
    await productosCollection.createIndex({ "categoria": 1 });
    await productosCollection.createIndex({ "estado": 1 });
    
    // Índices para historial
    await historialCollection.createIndex({ "organization_id": 1 });
    await historialCollection.createIndex({ "producto_id": 1 });
    
    // Índices para relaciones
    await relacionesCollection.createIndex({ "organization_id": 1 });
    await relacionesCollection.createIndex({ "proceso_origen_id": 1 });
    await relacionesCollection.createIndex({ "proceso_destino_id": 1 });
    
    console.log('✅ Índices creados exitosamente');
    
    // VERIFICAR MIGRACIÓN
    console.log('\n📊 Verificando migración...');
    
    const procesosCount = await procesosCollection.countDocuments();
    const indicadoresCount = await indicadoresCollection.countDocuments();
    const medicionesCount = await medicionesCollection.countDocuments();
    const hallazgosCount = await hallazgosCollection.countDocuments();
    const accionesCount = await accionesCollection.countDocuments();
    const auditoriasCount = await auditoriasCollection.countDocuments();
    const aspectosCount = await aspectosCollection.countDocuments();
    const minutasCount = await minutasCollection.countDocuments();
    const normasCount = await normasCollection.countDocuments();
    const objetivosCount = await objetivosCollection.countDocuments();
    const politicaCount = await politicaCollection.countDocuments();
    const productosCount = await productosCollection.countDocuments();
    const historialCount = await historialCollection.countDocuments();
    const relacionesCount = await relacionesCollection.countDocuments();
    
    console.log(`📈 Resumen de migración SGC:`);
    console.log(`   - Procesos: ${procesosCount}`);
    console.log(`   - Indicadores: ${indicadoresCount}`);
    console.log(`   - Mediciones: ${medicionesCount}`);
    console.log(`   - Hallazgos: ${hallazgosCount}`);
    console.log(`   - Acciones: ${accionesCount}`);
    console.log(`   - Auditorías: ${auditoriasCount}`);
    console.log(`   - Aspectos: ${aspectosCount}`);
    console.log(`   - Minutas: ${minutasCount}`);
    console.log(`   - Normas: ${normasCount}`);
    console.log(`   - Objetivos: ${objetivosCount}`);
    console.log(`   - Políticas: ${politicaCount}`);
    console.log(`   - Productos: ${productosCount}`);
    console.log(`   - Historial: ${historialCount}`);
    console.log(`   - Relaciones: ${relacionesCount}`);
    
    console.log('\n🎉 ¡Migración del módulo SGC completada exitosamente!');
    
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
  migrateSGCModule()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { migrateSGCModule };
