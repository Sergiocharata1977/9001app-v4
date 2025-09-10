import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      maxPoolSize: 10, // Mantener hasta 10 conexiones socket
      serverSelectionTimeoutMS: 5000, // Mantener intentando enviar operaciones por 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
      bufferCommands: false, // Deshabilitar mongoose buffering
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🔗 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    // Eventos de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de MongoDB:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    console.log('🔄 Verificando configuración de MongoDB Atlas...');
    
    // Mostrar información de debug
    console.log('🔍 URI configurada:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log('🔍 Variables de entorno:');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - MONGODB_URI presente:', !!process.env.MONGODB_URI);
    
    // Para desarrollo, intentar conectar con configuración más permisiva
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Intentando conexión con configuración de desarrollo...');
      try {
        await mongoose.connect(MONGODB_URI, {
          maxPoolSize: 5,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
          retryWrites: true,
          w: 'majority'
        });
        console.log('✅ Conectado a MongoDB Atlas exitosamente');
      } catch (retryError) {
        console.error('❌ Error en reintento de conexión:', retryError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 MongoDB desconectado');
  } catch (error) {
    console.error('❌ Error al desconectar MongoDB:', error);
  }
};