const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const mongoConfig = {
  uri: 'mongodb+srv://9001app:password@9001app-v2.xqydf2m.mongodb.net/9001app?retryWrites=true&w=majority',
  database: '9001app'
};

async function createTempUser() {
  try {
    console.log('🔧 Creando usuario temporal...');
    
    const client = new MongoClient(mongoConfig.uri);
    await client.connect();
    
    const db = client.db(mongoConfig.database);
    const usersCollection = db.collection('users');
    
    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email: 'admin@9001app.com' });
    
    if (existingUser) {
      console.log('✅ Usuario admin@9001app.com ya existe');
      
      // Actualizar contraseña
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await usersCollection.updateOne(
        { email: 'admin@9001app.com' },
        { $set: { password_hash: hashedPassword } }
      );
      
      console.log('✅ Contraseña actualizada a: admin123');
    } else {
      // Crear nuevo usuario
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newUser = {
        name: 'Admin User',
        email: 'admin@9001app.com',
        password_hash: hashedPassword,
        role: 'admin',
        organization_id: 1,
        is_active: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await usersCollection.insertOne(newUser);
      console.log('✅ Usuario creado: admin@9001app.com / admin123');
    }
    
    await client.close();
    console.log('🎉 Usuario temporal listo para usar');
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  }
}

createTempUser();
