const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDatabaseStructure() {
  console.log('🔍 Verificando estructura de la base de datos...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    
    // Verificar colección de usuarios
    console.log('\n👥 USUARIOS:');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log(`Total usuarios: ${users.length}`);
    
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
      console.log(`     ID: ${user._id}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     Organization ID: ${user.organization_id}`);
      console.log(`     Active: ${user.is_active}`);
      console.log('');
    });
    
    // Verificar colección de organizaciones
    console.log('\n🏢 ORGANIZACIONES:');
    const organizationsCollection = db.collection('organizations');
    const organizations = await organizationsCollection.find({}).toArray();
    console.log(`Total organizaciones: ${organizations.length}`);
    
    organizations.forEach(org => {
      console.log(`   - ${org.name} (ID: ${org.id || org._id})`);
      console.log(`     Plan: ${org.plan}`);
      console.log(`     Active: ${org.is_active}`);
      console.log('');
    });
    
    // Verificar usuarios sin organización
    console.log('\n⚠️ USUARIOS SIN ORGANIZACIÓN:');
    const usersWithoutOrg = users.filter(user => !user.organization_id);
    if (usersWithoutOrg.length > 0) {
      usersWithoutOrg.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
    } else {
      console.log('   ✅ Todos los usuarios tienen organización asignada');
    }
    
    // Verificar organizaciones sin usuarios
    console.log('\n⚠️ ORGANIZACIONES SIN USUARIOS:');
    for (const org of organizations) {
      const orgId = org.id || org._id;
      const usersInOrg = users.filter(user => user.organization_id === orgId);
      if (usersInOrg.length === 0) {
        console.log(`   - ${org.name} (ID: ${orgId})`);
      }
    }
    
    // Verificar estructura de datos
    console.log('\n📊 ESTRUCTURA DE DATOS:');
    if (users.length > 0) {
      const sampleUser = users[0];
      console.log('Campos de usuario:');
      Object.keys(sampleUser).forEach(key => {
        console.log(`   - ${key}: ${typeof sampleUser[key]} (${sampleUser[key]})`);
      });
    }
    
    if (organizations.length > 0) {
      const sampleOrg = organizations[0];
      console.log('\nCampos de organización:');
      Object.keys(sampleOrg).forEach(key => {
        console.log(`   - ${key}: ${typeof sampleOrg[key]} (${sampleOrg[key]})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verificando estructura:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

checkDatabaseStructure();
