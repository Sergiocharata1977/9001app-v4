const { MongoClient } = require('mongodb');
require('dotenv').config();

async function evaluateAllCollections() {
  console.log('🔍 EVALUANDO TODAS LAS COLECCIONES DE MONGODB');
  console.log('=' .repeat(60));
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    console.log(`📊 Base de datos: ${db.databaseName}`);
    
    // Obtener todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Total de colecciones encontradas: ${collections.length}`);
    
    // Evaluar cada colección
    for (const collectionInfo of collections) {
      await evaluateCollection(db, collectionInfo.name);
    }
    
    // Análisis general
    await generateGeneralReport(db, collections);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

async function evaluateCollection(db, collectionName) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📋 EVALUANDO COLECCIÓN: ${collectionName.toUpperCase()}`);
  console.log(`${'='.repeat(50)}`);
  
  const collection = db.collection(collectionName);
  
  try {
    // Contar documentos
    const totalDocs = await collection.countDocuments();
    console.log(`📊 Total de documentos: ${totalDocs}`);
    
    if (totalDocs === 0) {
      console.log('⚠️  Colección vacía');
      return;
    }
    
    // Obtener muestra de documentos
    const sampleDocs = await collection.find({}).limit(3).toArray();
    
    // Analizar estructura
    console.log('\n🏗️  ESTRUCTURA DE DATOS:');
    if (sampleDocs.length > 0) {
      const fields = Object.keys(sampleDocs[0]);
      console.log(`   Campos encontrados: ${fields.length}`);
      fields.forEach(field => {
        const sampleValue = sampleDocs[0][field];
        console.log(`   - ${field}: ${typeof sampleValue} (${sampleValue})`);
      });
    }
    
    // Análisis específico por colección
    switch (collectionName) {
      case 'users':
        await analyzeUsersCollection(collection);
        break;
      case 'organizations':
        await analyzeOrganizationsCollection(collection);
        break;
      default:
        await analyzeGenericCollection(collection, sampleDocs);
    }
    
    // Verificar índices
    await analyzeIndexes(collection);
    
  } catch (error) {
    console.error(`❌ Error evaluando ${collectionName}:`, error.message);
  }
}

async function analyzeUsersCollection(collection) {
  console.log('\n👥 ANÁLISIS ESPECÍFICO DE USUARIOS:');
  
  // Usuarios por rol
  const roles = await collection.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  
  console.log('   Roles de usuario:');
  roles.forEach(role => {
    console.log(`   - ${role._id}: ${role.count} usuarios`);
  });
  
  // Usuarios activos vs inactivos
  const activeUsers = await collection.countDocuments({ is_active: true });
  const inactiveUsers = await collection.countDocuments({ is_active: false });
  console.log(`   Usuarios activos: ${activeUsers}`);
  console.log(`   Usuarios inactivos: ${inactiveUsers}`);
  
  // Usuarios por organización
  const orgs = await collection.aggregate([
    { $group: { _id: '$organization_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  
  console.log('   Usuarios por organización:');
  orgs.forEach(org => {
    console.log(`   - Organización ${org._id}: ${org.count} usuarios`);
  });
  
  // Verificar emails únicos
  const totalUsers = await collection.countDocuments();
  const uniqueEmails = await collection.distinct('email');
  console.log(`   Emails únicos: ${uniqueEmails.length}/${totalUsers}`);
  
  if (uniqueEmails.length !== totalUsers) {
    console.log('   ⚠️  Hay emails duplicados');
  }
}

async function analyzeOrganizationsCollection(collection) {
  console.log('\n🏢 ANÁLISIS ESPECÍFICO DE ORGANIZACIONES:');
  
  // Organizaciones por plan
  const plans = await collection.aggregate([
    { $group: { _id: '$plan', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  
  console.log('   Organizaciones por plan:');
  plans.forEach(plan => {
    console.log(`   - ${plan._id}: ${plan.count} organizaciones`);
  });
  
  // Organizaciones activas vs inactivas
  const activeOrgs = await collection.countDocuments({ is_active: true });
  const inactiveOrgs = await collection.countDocuments({ is_active: false });
  console.log(`   Organizaciones activas: ${activeOrgs}`);
  console.log(`   Organizaciones inactivas: ${inactiveOrgs}`);
  
  // Verificar nombres únicos
  const totalOrgs = await collection.countDocuments();
  const uniqueNames = await collection.distinct('name');
  console.log(`   Nombres únicos: ${uniqueNames.length}/${totalOrgs}`);
}

async function analyzeGenericCollection(collection, sampleDocs) {
  console.log('\n📋 ANÁLISIS GENÉRICO:');
  
  // Verificar documentos con campos requeridos
  const fields = Object.keys(sampleDocs[0]);
  console.log('   Campos principales:');
  fields.forEach(field => {
    console.log(`   - ${field}`);
  });
  
  // Verificar documentos con timestamps
  const hasCreatedAt = await collection.countDocuments({ created_at: { $exists: true } });
  const hasUpdatedAt = await collection.countDocuments({ updated_at: { $exists: true } });
  console.log(`   Documentos con created_at: ${hasCreatedAt}`);
  console.log(`   Documentos con updated_at: ${hasUpdatedAt}`);
}

async function analyzeIndexes(collection) {
  console.log('\n🔍 ANÁLISIS DE ÍNDICES:');
  
  try {
    const indexes = await collection.indexes();
    console.log(`   Total de índices: ${indexes.length}`);
    
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    if (indexes.length === 1) {
      console.log('   ⚠️  Solo tiene índice por defecto (_id)');
    }
  } catch (error) {
    console.log('   ❌ Error obteniendo índices');
  }
}

async function generateGeneralReport(db, collections) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 REPORTE GENERAL DE LA BASE DE DATOS');
  console.log(`${'='.repeat(60)}`);
  
  let totalDocuments = 0;
  let totalCollections = collections.length;
  
  // Contar documentos totales
  for (const collectionInfo of collections) {
    const collection = db.collection(collectionInfo.name);
    const count = await collection.countDocuments();
    totalDocuments += count;
    console.log(`   ${collectionInfo.name}: ${count} documentos`);
  }
  
  console.log(`\n📈 ESTADÍSTICAS GENERALES:`);
  console.log(`   Total de colecciones: ${totalCollections}`);
  console.log(`   Total de documentos: ${totalDocuments}`);
  console.log(`   Promedio por colección: ${(totalDocuments / totalCollections).toFixed(1)}`);
  
  // Verificar integridad referencial
  console.log(`\n🔗 VERIFICACIÓN DE INTEGRIDAD:`);
  
  const usersCollection = db.collection('users');
  const organizationsCollection = db.collection('organizations');
  
  if (await usersCollection.countDocuments() > 0 && await organizationsCollection.countDocuments() > 0) {
    // Verificar usuarios sin organización
    const usersWithoutOrg = await usersCollection.countDocuments({ organization_id: { $exists: false } });
    console.log(`   Usuarios sin organización: ${usersWithoutOrg}`);
    
    // Verificar organizaciones sin usuarios
    const orgs = await organizationsCollection.find({}).toArray();
    let orgsWithoutUsers = 0;
    
    for (const org of orgs) {
      const orgId = org.id || org._id;
      const usersInOrg = await usersCollection.countDocuments({ organization_id: orgId });
      if (usersInOrg === 0) {
        orgsWithoutUsers++;
      }
    }
    
    console.log(`   Organizaciones sin usuarios: ${orgsWithoutUsers}`);
  }
  
  console.log(`\n✅ EVALUACIÓN COMPLETADA`);
}

// Ejecutar evaluación
evaluateAllCollections();
