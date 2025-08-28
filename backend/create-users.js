const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createUsers() {
  console.log('🔍 Creando usuarios de prueba...');
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    const usersCollection = db.collection('users');
    const organizationsCollection = db.collection('organizations');
    
    // Crear organización de prueba
    console.log('🏢 Creando organización de prueba...');
    const org = {
      id: 1,
      name: '9001app Demo',
      description: 'Organización de demostración',
      plan: 'premium',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await organizationsCollection.insertOne(org);
    console.log('✅ Organización creada');
    
    // Usuarios a crear
    const users = [
      {
        name: 'Super Administrador',
        email: 'superadmin@9001app.com',
        password: 'superadmin123',
        role: 'super_admin',
        organization_id: 1
      },
      {
        name: 'Administrador',
        email: 'admin@9001app.com',
        password: 'admin123',
        role: 'admin',
        organization_id: 1
      },
      {
        name: 'Usuario Normal',
        email: 'user@9001app.com',
        password: 'user123',
        role: 'user',
        organization_id: 1
      },
      {
        name: 'Auditor',
        email: 'auditor@9001app.com',
        password: 'auditor123',
        role: 'auditor',
        organization_id: 1
      },
      {
        name: 'Gerente',
        email: 'gerente@9001app.com',
        password: 'gerente123',
        role: 'manager',
        organization_id: 1
      }
    ];
    
    console.log('👥 Creando usuarios...');
    
    for (const userData of users) {
      // Verificar si el usuario ya existe
      const existingUser = await usersCollection.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️ Usuario ${userData.email} ya existe, saltando...`);
        continue;
      }
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Crear usuario
      const user = {
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword,
        role: userData.role,
        organization_id: userData.organization_id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const result = await usersCollection.insertOne(user);
      console.log(`✅ Usuario creado: ${userData.email} (ID: ${result.insertedId})`);
    }
    
    // Mostrar todos los usuarios creados
    console.log('\n📋 Usuarios disponibles:');
    const allUsers = await usersCollection.find({}).toArray();
    allUsers.forEach(user => {
      console.log(`   👤 ${user.name} (${user.email}) - Rol: ${user.role}`);
    });
    
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Super Admin: superadmin@9001app.com / superadmin123');
    console.log('   Admin: admin@9001app.com / admin123');
    console.log('   User: user@9001app.com / user123');
    console.log('   Auditor: auditor@9001app.com / auditor123');
    console.log('   Gerente: gerente@9001app.com / gerente123');
    
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

createUsers();
