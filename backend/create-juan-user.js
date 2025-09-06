const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createJuanUser() {
  console.log('🔍 Creando usuario juan.lopez@agronorte.com...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    const usersCollection = db.collection('users');
    
    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email: 'juan.lopez@agronorte.com' });
    
    if (existingUser) {
      console.log('⚠️ Usuario juan.lopez@agronorte.com ya existe');
      console.log('📊 Datos del usuario:', {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        hasPassword: !!existingUser.password_hash,
        organization_id: existingUser.organization_id
      });
      
      // Si no tiene password_hash, lo creamos
      if (!existingUser.password_hash) {
        console.log('🔐 Creando password_hash para el usuario...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await usersCollection.updateOne(
          { email: 'juan.lopez@agronorte.com' },
          { 
            $set: { 
              password_hash: hashedPassword,
              updated_at: new Date()
            }
          }
        );
        
        console.log('✅ Password_hash creado exitosamente');
      }
      
      return;
    }
    
    // Crear el usuario
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const user = {
      name: 'Juan Carlos López',
      email: 'juan.lopez@agronorte.com',
      password_hash: hashedPassword,
      role: 'admin',
      organization_id: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await usersCollection.insertOne(user);
    console.log(`✅ Usuario creado: juan.lopez@agronorte.com (ID: ${result.insertedId})`);
    
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Email: juan.lopez@agronorte.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

createJuanUser();
