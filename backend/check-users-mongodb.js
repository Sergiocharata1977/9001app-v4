const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkUsersMongoDB() {
  console.log('🔍 Verificando usuarios en MongoDB...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    const usersCollection = db.collection('users');
    
    // Obtener todos los usuarios
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Total de usuarios: ${users.length}`);
    
    console.log('\n👥 Usuarios encontrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
      console.log(`   Role: ${user.role || 'Sin rol'}`);
      console.log(`   Organization_id: ${user.organization_id || 'Sin organization_id'}`);
      console.log(`   Is_active: ${user.is_active}`);
      console.log('---');
    });
    
    // Buscar usuarios con rol super_admin
    const superAdmins = users.filter(user => user.role === 'super_admin');
    console.log(`\n👑 Super Admins encontrados: ${superAdmins.length}`);
    superAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} - ${admin.name}`);
    });
    
    // Buscar usuarios con rol admin
    const admins = users.filter(user => user.role === 'admin');
    console.log(`\n🔧 Admins encontrados: ${admins.length}`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} - ${admin.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkUsersMongoDB();
