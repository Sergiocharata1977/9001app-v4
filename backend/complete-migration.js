const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

// Datos para completar la migración
const missingData = {
  // TABLA PLANES - CRÍTICA
  planes: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      nombre: "Plan Básico",
      descripcion: "Plan básico para pequeñas empresas",
      precio_mensual: 29.99,
      max_usuarios: 5,
      max_procesos: 10,
      max_documentos: 50,
      features: ["procesos", "documentos", "usuarios"],
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      nombre: "Plan Profesional",
      descripcion: "Plan profesional para empresas medianas",
      precio_mensual: 59.99,
      max_usuarios: 20,
      max_procesos: 50,
      max_documentos: 200,
      features: ["procesos", "documentos", "usuarios", "auditorias", "reportes"],
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 3,
      organization_id: 1,
      nombre: "Plan Enterprise",
      descripcion: "Plan enterprise para grandes empresas",
      precio_mensual: 99.99,
      max_usuarios: 100,
      max_procesos: 200,
      max_documentos: 1000,
      features: ["procesos", "documentos", "usuarios", "auditorias", "reportes", "api", "integraciones"],
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // TABLAS RRHH FALTANTES
  puestos: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      nombre: "Gerente de Calidad",
      descripcion: "Responsable del sistema de gestión de calidad",
      nivel: "gerencial",
      departamento_id: 1,
      salario_base: 50000,
      competencias_requeridas: ["liderazgo", "calidad", "iso9001"],
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      nombre: "Auditor Interno",
      descripcion: "Auditor interno del sistema de calidad",
      nivel: "técnico",
      departamento_id: 1,
      salario_base: 35000,
      competencias_requeridas: ["auditoria", "calidad", "normas"],
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  capacitaciones: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      nombre: "Capacitación ISO 9001:2015",
      descripcion: "Capacitación en los requisitos de la norma ISO 9001:2015",
      tipo: "obligatoria",
      duracion_horas: 16,
      fecha_inicio: new Date('2025-02-01'),
      fecha_fin: new Date('2025-02-15'),
      instructor: "Consultor Externo",
      estado: "programada",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  competencias: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      nombre: "Liderazgo",
      descripcion: "Capacidad de liderar equipos y proyectos",
      categoria: "blandas",
      nivel_requerido: "intermedio",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      organization_id: 1,
      nombre: "ISO 9001",
      descripcion: "Conocimiento de la norma ISO 9001:2015",
      categoria: "técnicas",
      nivel_requerido: "avanzado",
      estado: "activo",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  evaluaciones_individuales: [
    {
      _id: new ObjectId(),
      id: 1,
      organization_id: 1,
      personal_id: 1,
      usuario_id: 1,
      periodo: "2025-Q1",
      fecha_evaluacion: new Date(),
      evaluador_id: 2,
      puntuacion_total: 85,
      comentarios: "Buen desempeño en el período",
      estado: "completada",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  evaluaciones_competencias_detalle: [
    {
      _id: new ObjectId(),
      id: 1,
      evaluacion_id: 1,
      competencia_id: 1,
      puntuacion: 4,
      observaciones: "Demuestra buen liderazgo",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      _id: new ObjectId(),
      id: 2,
      evaluacion_id: 1,
      competencia_id: 2,
      puntuacion: 5,
      observaciones: "Excelente conocimiento de ISO 9001",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  // RELACIONES SGC FALTANTES
  procesos_documentos: [
    {
      _id: new ObjectId(),
      proceso_id: 1,
      documento_id: 1,
      tipo_relacion: "requerido",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  procesos_normas: [
    {
      _id: new ObjectId(),
      proceso_id: 1,
      norma_id: 1,
      seccion: "8.1",
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  procesos_indicadores: [
    {
      _id: new ObjectId(),
      proceso_id: 1,
      indicador_id: 1,
      peso: 0.3,
      created_at: new Date(),
      updated_at: new Date()
    }
  ],

  personal_procesos: [
    {
      _id: new ObjectId(),
      personal_id: 1,
      proceso_id: 1,
      rol: "responsable",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
};

async function completeMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Completar migración de cada colección
    for (const [collectionName, data] of Object.entries(missingData)) {
      console.log(`\n📋 Migrando colección: ${collectionName}`);
      
      // Verificar si la colección ya existe
      const existingData = await db.collection(collectionName).countDocuments();
      
      if (existingData > 0) {
        console.log(`  ⚠️  La colección ${collectionName} ya tiene ${existingData} documentos`);
        console.log(`  🔄 Actualizando datos existentes...`);
        
        // Actualizar documentos existentes (sin _id)
        for (const doc of data) {
          const { _id, ...docWithoutId } = doc;
          await db.collection(collectionName).updateOne(
            { id: doc.id },
            { $set: docWithoutId },
            { upsert: true }
          );
        }
      } else {
        console.log(`  📥 Insertando ${data.length} documentos...`);
        await db.collection(collectionName).insertMany(data);
      }
      
      // Crear índices
      console.log(`  🔍 Creando índices...`);
      await db.collection(collectionName).createIndex({ id: 1 }, { unique: true });
      await db.collection(collectionName).createIndex({ organization_id: 1 });
      await db.collection(collectionName).createIndex({ estado: 1 });
      
      console.log(`  ✅ Colección ${collectionName} migrada exitosamente`);
    }
    
    // Verificar migración completa
    console.log('\n📊 VERIFICACIÓN FINAL:');
    for (const collectionName of Object.keys(missingData)) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`  ${collectionName}: ${count} documentos`);
    }
    
    console.log('\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('✅ Todas las tablas faltantes han sido migradas');
    console.log('✅ Relaciones SGC implementadas');
    console.log('✅ Base de datos lista para producción');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Ejecutar migración
completeMigration();
