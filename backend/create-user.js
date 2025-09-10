const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Definir esquemas directamente
    const OrganizationSchema = new mongoose.Schema({
      nombre: String,
      codigo: String,
      descripcion: String,
      activo: { type: Boolean, default: true }
    });

    const UserSchema = new mongoose.Schema({
      nombre: String,
      apellido: String,
      email: { type: String, unique: true },
      password: String,
      telefono: String,
      roles: [String],
      organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
      activo: { type: Boolean, default: true },
      configuracion: {
        tema: { type: String, default: 'light' },
        idioma: { type: String, default: 'es' },
        notificaciones: { type: Boolean, default: true }
      }
    });

    const Organization = mongoose.model('Organization', OrganizationSchema);
    const User = mongoose.model('User', UserSchema);

    // Verificar si ya existe una organización de prueba
    let organization = await Organization.findOne({ codigo: 'TEST' });
    
    if (!organization) {
      // Crear organización de prueba
      organization = new Organization({
        nombre: 'Organización de Prueba',
        codigo: 'TEST',
        descripcion: 'Organización para pruebas del sistema',
        activo: true
      });
      await organization.save();
      console.log('✅ Organización de prueba creada:', organization.nombre);
    } else {
      console.log('✅ Organización de prueba ya existe:', organization.nombre);
    }

    // Verificar si ya existe el usuario de prueba
    let user = await User.findOne({ email: 'admin@test.com' });
    
    if (!user) {
      // Crear usuario de prueba
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      user = new User({
        nombre: 'Admin',
        apellido: 'Test',
        email: 'admin@test.com',
        password: hashedPassword,
        telefono: '+5491234567890',
        roles: ['admin'],
        organization_id: organization._id,
        activo: true,
        configuracion: {
          tema: 'light',
          idioma: 'es',
          notificaciones: true
        }
      });
      
      await user.save();
      console.log('✅ Usuario de prueba creado:', user.email);
    } else {
      console.log('✅ Usuario de prueba ya existe:', user.email);
    }

    // Mostrar información del usuario
    console.log('\n📋 INFORMACIÓN DEL USUARIO DE PRUEBA:');
    console.log('Email:', user.email);
    console.log('Contraseña: 123456');
    console.log('Organización:', organization.nombre);
    console.log('Roles:', user.roles);
    console.log('Activo:', user.activo);

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare('123456', user.password);
    console.log('Contraseña válida:', isPasswordValid);

    console.log('\n🎉 Usuario de prueba listo para usar!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

createTestUser();



