const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDepartamentosData() {
  console.log('🔍 Verificando datos de departamentos en MongoDB...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    const collection = db.collection('departamentos');
    
    // Contar total de departamentos
    const total = await collection.countDocuments();
    console.log(`📊 Total de departamentos: ${total}`);
    
    if (total > 0) {
      // Mostrar todos los departamentos
      const departamentos = await collection.find({}).toArray();
      console.log('📋 Departamentos encontrados:');
      departamentos.forEach((dept, index) => {
        console.log(`${index + 1}. ID: ${dept._id}`);
        console.log(`   Nombre: ${dept.nombre || 'Sin nombre'}`);
        console.log(`   OrganizationId: ${dept.organizationId || 'Sin organizationId'}`);
        console.log(`   Organization_id: ${dept.organization_id || 'Sin organization_id'}`);
        console.log(`   Campos disponibles: ${Object.keys(dept).join(', ')}`);
        console.log('---');
      });
    } else {
      console.log('❌ No hay departamentos en la base de datos');
    }
    
    // Verificar también la colección de usuarios para ver qué organization_id tienen
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).limit(5).toArray();
    console.log('\n👥 Usuarios (primeros 5):');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Organization_id: ${user.organization_id || 'Sin organization_id'}`);
      console.log(`   OrganizationId: ${user.organizationId || 'Sin organizationId'}`);
      console.log(`   Campos disponibles: ${Object.keys(user).join(', ')}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDepartamentosData();
