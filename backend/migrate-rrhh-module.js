const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

// Datos de ejemplo para RRHH
const rrhhData = {
  // DEPARTAMENTOS
  departamentos: [
    {
      _id: new ObjectId(),
      id: "dept_001",
      nombre: "Recursos Humanos",
      descripcion: "Departamento de gestión de personal",
      responsable_id: null, // Se actualizará después
      organization_id: 1,
      objetivos: "Gestionar el capital humano de la organización",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "dept_002", 
      nombre: "Ventas",
      descripcion: "Departamento comercial",
      responsable_id: null,
      organization_id: 1,
      objetivos: "Maximizar las ventas y relaciones con clientes",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "dept_003",
      nombre: "Tecnología",
      descripcion: "Departamento de sistemas y tecnología",
      responsable_id: null,
      organization_id: 1,
      objetivos: "Mantener y desarrollar la infraestructura tecnológica",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // PERSONAL
  personal: [
    {
      _id: new ObjectId(),
      id: "per_001",
      organization_id: 1,
      nombres: "Sergio",
      apellidos: "De Filippi",
      email: "sergio.defilippi@empresa.com",
      telefono: "+54 9 11 1234-5678",
      documento_identidad: "DNI 12345678",
      fecha_nacimiento: "1985-03-15",
      nacionalidad: "Argentina",
      direccion: "Av. Corrientes 1234, CABA",
      telefono_emergencia: "+54 9 11 8765-4321",
      fecha_contratacion: "2020-01-15",
      numero_legajo: "LEG-001",
      estado: "Activo",
      meta_personal: 0,
      comision_porcentaje: 0,
      supervisor_id: null,
      especialidad_ventas: "Agroindustria",
      fecha_inicio_ventas: "2020-01-15",
      tipo_personal: "gerencial",
      zona_venta: "Buenos Aires",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "per_002",
      organization_id: 1,
      nombres: "Javier Antonio",
      apellidos: "Ramirez",
      email: "javier.ramirez@empresa.com",
      telefono: "+54 9 11 2345-6789",
      documento_identidad: "DNI 23456789",
      fecha_nacimiento: "1990-07-22",
      nacionalidad: "Argentina",
      direccion: "Belgrano 567, CABA",
      telefono_emergencia: "+54 9 11 7654-3210",
      fecha_contratacion: "2021-03-01",
      numero_legajo: "LEG-002",
      estado: "Activo",
      meta_personal: 0,
      comision_porcentaje: 0,
      supervisor_id: "per_001",
      especialidad_ventas: "Compras",
      fecha_inicio_ventas: "2021-03-01",
      tipo_personal: "gerencial",
      zona_venta: "Córdoba",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "per_003",
      organization_id: 1,
      nombres: "María",
      apellidos: "González",
      email: "maria.gonzalez@empresa.com",
      telefono: "+54 9 11 3456-7890",
      documento_identidad: "DNI 34567890",
      fecha_nacimiento: "1988-11-10",
      nacionalidad: "Argentina",
      direccion: "Palermo 890, CABA",
      telefono_emergencia: "+54 9 11 6543-2109",
      fecha_contratacion: "2022-06-15",
      numero_legajo: "LEG-003",
      estado: "Activo",
      meta_personal: 0,
      comision_porcentaje: 0,
      supervisor_id: "per_001",
      especialidad_ventas: null,
      fecha_inicio_ventas: null,
      tipo_personal: "administrativo",
      zona_venta: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // PUESTOS
  puestos: [
    {
      _id: new ObjectId(),
      id: "puesto_001",
      nombre: "Gerente de Ventas",
      descripcion_responsabilidades: "Gestionar equipo de ventas y estrategias comerciales",
      requisitos_experiencia: "5+ años en ventas agroindustriales",
      requisitos_formacion: "Ingeniería Agronómica o afín",
      departamento_id: "dept_002",
      reporta_a_id: null,
      organization_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "puesto_002",
      nombre: "Gerente de Compras",
      descripcion_responsabilidades: "Gestionar proveedores y adquisiciones",
      requisitos_experiencia: "3+ años en compras agroindustriales",
      requisitos_formacion: "Administración de Empresas o afín",
      departamento_id: "dept_002",
      reporta_a_id: "puesto_001",
      organization_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "puesto_003",
      nombre: "Analista de RRHH",
      descripcion_responsabilidades: "Gestionar procesos de personal y capacitación",
      requisitos_experiencia: "2+ años en RRHH",
      requisitos_formacion: "Psicología o RRHH",
      departamento_id: "dept_001",
      reporta_a_id: null,
      organization_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // CAPACITACIONES
  capacitaciones: [
    {
      _id: new ObjectId(),
      id: "cap_001",
      organization_id: 1,
      titulo: "Normas ISO 9001:2015",
      descripcion: "Capacitación en gestión de calidad",
      fecha_inicio: "2024-02-01",
      fecha_fin: "2024-02-15",
      duracion_horas: 16,
      modalidad: "Presencial",
      estado: "completada",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "cap_002",
      organization_id: 1,
      titulo: "Técnicas de Ventas Agroindustriales",
      descripcion: "Capacitación en ventas del sector agro",
      fecha_inicio: "2024-03-01",
      fecha_fin: "2024-03-10",
      duracion_horas: 20,
      modalidad: "Híbrida",
      estado: "programada",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // COMPETENCIAS
  competencias: [
    {
      _id: new ObjectId(),
      id: "comp_001",
      organization_id: 1,
      nombre: "Gestión de Calidad",
      descripcion: "Conocimientos en normas ISO y gestión de calidad",
      categoria: "Técnica",
      nivel_requerido: 3,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "comp_002",
      organization_id: 1,
      nombre: "Ventas Agroindustriales",
      descripcion: "Habilidades en ventas del sector agroindustrial",
      categoria: "Comercial",
      nivel_requerido: 4,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: "comp_003",
      organization_id: 1,
      nombre: "Liderazgo",
      descripcion: "Capacidad de liderar equipos y proyectos",
      categoria: "Gerencial",
      nivel_requerido: 4,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

async function migrateRRHHModule() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conexión exitosa');
    
    const db = client.db(DB_NAME);
    
    // 1. MIGRAR DEPARTAMENTOS
    console.log('\n📋 Migrando departamentos...');
    const departamentosCollection = db.collection('departamentos');
    await departamentosCollection.deleteMany({});
    const departamentosResult = await departamentosCollection.insertMany(rrhhData.departamentos);
    console.log(`✅ ${departamentosResult.insertedCount} departamentos migrados`);
    
    // 2. MIGRAR PERSONAL
    console.log('\n👥 Migrando personal...');
    const personalCollection = db.collection('personal');
    await personalCollection.deleteMany({});
    const personalResult = await personalCollection.insertMany(rrhhData.personal);
    console.log(`✅ ${personalResult.insertedCount} empleados migrados`);
    
    // 3. MIGRAR PUESTOS
    console.log('\n💼 Migrando puestos...');
    const puestosCollection = db.collection('puestos');
    await puestosCollection.deleteMany({});
    const puestosResult = await puestosCollection.insertMany(rrhhData.puestos);
    console.log(`✅ ${puestosResult.insertedCount} puestos migrados`);
    
    // 4. MIGRAR CAPACITACIONES
    console.log('\n🎓 Migrando capacitaciones...');
    const capacitacionesCollection = db.collection('capacitaciones');
    await capacitacionesCollection.deleteMany({});
    const capacitacionesResult = await capacitacionesCollection.insertMany(rrhhData.capacitaciones);
    console.log(`✅ ${capacitacionesResult.insertedCount} capacitaciones migradas`);
    
    // 5. MIGRAR COMPETENCIAS
    console.log('\n🏆 Migrando competencias...');
    const competenciasCollection = db.collection('competencias');
    await competenciasCollection.deleteMany({});
    const competenciasResult = await competenciasCollection.insertMany(rrhhData.competencias);
    console.log(`✅ ${competenciasResult.insertedCount} competencias migradas`);
    
    // 6. CREAR ÍNDICES
    console.log('\n🔍 Creando índices...');
    
    // Índices para departamentos
    await departamentosCollection.createIndex({ "organization_id": 1 });
    await departamentosCollection.createIndex({ "nombre": 1 }, { unique: true });
    
    // Índices para personal
    await personalCollection.createIndex({ "organization_id": 1 });
    await personalCollection.createIndex({ "email": 1 }, { unique: true });
    await personalCollection.createIndex({ "tipo_personal": 1 });
    await personalCollection.createIndex({ "estado": 1 });
    await personalCollection.createIndex({ "zona_venta": 1 });
    
    // Índices para puestos
    await puestosCollection.createIndex({ "organization_id": 1 });
    await puestosCollection.createIndex({ "departamento_id": 1 });
    
    // Índices para capacitaciones
    await capacitacionesCollection.createIndex({ "organization_id": 1 });
    await capacitacionesCollection.createIndex({ "estado": 1 });
    
    // Índices para competencias
    await competenciasCollection.createIndex({ "organization_id": 1 });
    await competenciasCollection.createIndex({ "categoria": 1 });
    
    console.log('✅ Índices creados exitosamente');
    
    // 7. ACTUALIZAR RELACIONES
    console.log('\n🔗 Actualizando relaciones...');
    
    // Actualizar responsable_id en departamentos
    await departamentosCollection.updateOne(
      { "id": "dept_001" },
      { $set: { "responsable_id": "per_001" } }
    );
    await departamentosCollection.updateOne(
      { "id": "dept_002" },
      { $set: { "responsable_id": "per_001" } }
    );
    await departamentosCollection.updateOne(
      { "id": "dept_003" },
      { $set: { "responsable_id": "per_003" } }
    );
    
    console.log('✅ Relaciones actualizadas');
    
    // 8. VERIFICAR MIGRACIÓN
    console.log('\n📊 Verificando migración...');
    
    const deptCount = await departamentosCollection.countDocuments();
    const personalCount = await personalCollection.countDocuments();
    const puestosCount = await puestosCollection.countDocuments();
    const capacitacionesCount = await capacitacionesCollection.countDocuments();
    const competenciasCount = await competenciasCollection.countDocuments();
    
    console.log(`📈 Resumen de migración:`);
    console.log(`   - Departamentos: ${deptCount}`);
    console.log(`   - Personal: ${personalCount}`);
    console.log(`   - Puestos: ${puestosCount}`);
    console.log(`   - Capacitaciones: ${capacitacionesCount}`);
    console.log(`   - Competencias: ${competenciasCount}`);
    
    console.log('\n🎉 ¡Migración del módulo RRHH completada exitosamente!');
    
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
  migrateRRHHModule()
    .then(() => {
      console.log('\n✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { migrateRRHHModule };
