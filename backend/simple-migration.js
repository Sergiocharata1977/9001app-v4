const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

async function simpleMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Migrar tabla PLANES (crítica)
    console.log('\n📋 Migrando tabla PLANES...');
    const planesData = [
      {
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
      }
    ];
    
    // Verificar si ya existe
    const existingPlanes = await db.collection('planes').countDocuments();
    if (existingPlanes === 0) {
      await db.collection('planes').insertMany(planesData);
      console.log('  ✅ Tabla PLANES migrada');
    } else {
      console.log('  ⚠️  Tabla PLANES ya existe');
    }
    
    // Migrar tabla PUESTOS
    console.log('\n📋 Migrando tabla PUESTOS...');
    const puestosData = [
      {
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
    ];
    
    const existingPuestos = await db.collection('puestos').countDocuments();
    if (existingPuestos === 0) {
      await db.collection('puestos').insertMany(puestosData);
      console.log('  ✅ Tabla PUESTOS migrada');
    } else {
      console.log('  ⚠️  Tabla PUESTOS ya existe');
    }
    
    // Migrar tabla COMPETENCIAS
    console.log('\n📋 Migrando tabla COMPETENCIAS...');
    const competenciasData = [
      {
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
    ];
    
    const existingCompetencias = await db.collection('competencias').countDocuments();
    if (existingCompetencias === 0) {
      await db.collection('competencias').insertMany(competenciasData);
      console.log('  ✅ Tabla COMPETENCIAS migrada');
    } else {
      console.log('  ⚠️  Tabla COMPETENCIAS ya existe');
    }
    
    // Crear índices
    console.log('\n🔍 Creando índices...');
    await db.collection('planes').createIndex({ id: 1 }, { unique: true });
    await db.collection('puestos').createIndex({ id: 1 }, { unique: true });
    await db.collection('competencias').createIndex({ id: 1 }, { unique: true });
    console.log('  ✅ Índices creados');
    
    // Verificar migración
    console.log('\n📊 VERIFICACIÓN:');
    const planesCount = await db.collection('planes').countDocuments();
    const puestosCount = await db.collection('puestos').countDocuments();
    const competenciasCount = await db.collection('competencias').countDocuments();
    
    console.log(`  Planes: ${planesCount} documentos`);
    console.log(`  Puestos: ${puestosCount} documentos`);
    console.log(`  Competencias: ${competenciasCount} documentos`);
    
    console.log('\n🎉 MIGRACIÓN COMPLETADA!');
    console.log('✅ Tablas críticas migradas a MongoDB');
    console.log('✅ Índices creados');
    console.log('✅ Sistema listo para continuar');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

simpleMigration();

