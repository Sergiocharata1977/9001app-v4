const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configurar MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://9001app:password@cluster0.mongodb.net/9001app';

// Schema simple para User
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },
  roles: [{ type: String, default: ['user'] }],
  organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Schema simple para Organization
const organizationSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  descripcion: { type: String },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Organization = mongoose.model('Organization', organizationSchema);

async function createTestUser() {
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Conectado a MongoDB Atlas');

    // Crear organización de prueba
    let organization = await Organization.findOne({ codigo: 'TEST' });
    if (!organization) {
      organization = new Organization({
        nombre: 'Organización de Prueba',
        codigo: 'TEST',
        descripcion: 'Organización para pruebas del sistema',
        activo: true
      });
      await organization.save();
      console.log('✅ Organización creada:', organization.nombre);
    } else {
      console.log('✅ Organización ya existe:', organization.nombre);
    }

    // Crear usuario de prueba
    let user = await User.findOne({ email: 'admin@test.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 12);
      
      user = new User({
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin@test.com',
        password: hashedPassword,
        telefono: '+5491234567890',
        roles: ['admin'],
        organization_id: organization._id,
        activo: true
      });
      
      await user.save();
      console.log('✅ Usuario creado:', user.email);
    } else {
      console.log('✅ Usuario ya existe:', user.email);
    }

    console.log('\n📋 CREDENCIALES DE PRUEBA:');
    console.log('Email: admin@test.com');
    console.log('Contraseña: 123456');
    console.log('Organización:', organization.nombre);
    console.log('Roles:', user.roles);
    
    console.log('\n🎉 Sistema listo para login real!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

createTestUser();
