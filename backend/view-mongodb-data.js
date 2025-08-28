const { MongoClient } = require('mongodb');
require('dotenv').config();

async function viewMongoDBData() {
  console.log('🔍 Viendo datos en MongoDB...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    
    // Ver todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📁 COLECCIONES DISPONIBLES:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Ver usuarios
    console.log('\n👥 USUARIOS:');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    console.log(`Total: ${users.length} usuarios`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Organization: ${user.organization_id}`);
      console.log(`   Active: ${user.is_active}`);
      console.log(`   Created: ${user.created_at}`);
    });
    
    // Ver organizaciones
    console.log('\n🏢 ORGANIZACIONES:');
    const organizationsCollection = db.collection('organizations');
    const organizations = await organizationsCollection.find({}).toArray();
    console.log(`Total: ${organizations.length} organizaciones`);
    
    organizations.forEach((org, index) => {
      console.log(`\n${index + 1}. ${org.name}`);
      console.log(`   ID: ${org.id || org._id}`);
      console.log(`   Plan: ${org.plan}`);
      console.log(`   Active: ${org.is_active}`);
      console.log(`   Created: ${org.created_at}`);
    });
    
    // Estadísticas
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`   Usuarios activos: ${users.filter(u => u.is_active).length}`);
    console.log(`   Organizaciones activas: ${organizations.filter(o => o.is_active).length}`);
    
    // Usuarios por rol
    const roles = {};
    users.forEach(user => {
      roles[user.role] = (roles[user.role] || 0) + 1;
    });
    console.log('\n👥 USUARIOS POR ROL:');
    Object.entries(roles).forEach(([role, count]) => {
      console.log(`   ${role}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

viewMongoDBData();
