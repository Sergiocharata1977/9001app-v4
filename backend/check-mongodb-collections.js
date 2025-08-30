const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkCollections() {
  try {
    console.log('🔍 Verificando colecciones en MongoDB...');
    console.log('📋 URI:', process.env.MONGODB_URI ? 'Configurada' : 'No configurada');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI no configurada');
      return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log('✅ Conectado a MongoDB');
    
    // Listar todas las bases de datos
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    
    console.log('\n📊 BASES DE DATOS DISPONIBLES:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Verificar la base de datos específica
    const dbName = process.env.MONGODB_DB_NAME || '9001app';
    console.log(`\n🔍 Verificando base de datos: ${dbName}`);
    
    try {
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      console.log(`\n📁 COLECCIONES EN ${dbName}:`);
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      // Verificar colecciones CRM específicas
      const crmCollections = [
        'crm_clientes_agro',
        'crm_contactos', 
        'crm_oportunidades_agro',
        'crm_productos_agro',
        'crm_zonas_geograficas'
      ];
      
      console.log('\n🌾 VERIFICANDO COLECCIONES CRM:');
      for (const collectionName of crmCollections) {
        try {
          const collection = db.collection(collectionName);
          const count = await collection.countDocuments();
          console.log(`   - ${collectionName}: ${count} documentos`);
          
          if (count > 0) {
            const sample = await collection.findOne();
            console.log(`     Ejemplo: ${JSON.stringify(sample, null, 2).substring(0, 100)}...`);
          }
        } catch (error) {
          console.log(`   - ${collectionName}: ❌ Error - ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error accediendo a la base de datos ${dbName}:`, error.message);
    }
    
    await client.close();
    console.log('\n🔌 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCollections();
