const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Unificar secreto con el usado al firmar en authController (fallback-secret)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware de autenticación para sistema SAAS multi-tenant
const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 DEBUG - authMiddleware llamado para:', req.path);
    
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    console.log('🔐 DEBUG - authHeader:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ DEBUG - Token no válido en header');
      return res.status(401).json({ message: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔐 DEBUG - Token extraído:', token.substring(0, 20) + '...');

    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Log para depuración
    console.log('🔓 Decoded JWT:', decoded);
    
    // Aceptar tanto 'id' como 'userId' en el token
    const userId = decoded.id || decoded.userId;
    if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
      console.log('❌ DEBUG - Token sin ID de usuario válido');
      return res.status(401).json({ message: 'Token sin ID de usuario válido.' });
    }
    
    console.log('👤 User ID from token:', userId);
    
    // Conectar a MongoDB y buscar usuario
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    const usersCollection = db.collection('users');
    
    // Buscar usuario por ObjectId (MongoDB)
    let user;
    try {
      user = await usersCollection.findOne({ 
        _id: new ObjectId(userId),
        is_active: true 
      });
      
      if (!user) {
        console.log('❌ Usuario no encontrado por ObjectId:', userId);
      } else {
        console.log('✅ Usuario encontrado por ObjectId:', userId);
      }
    } catch (error) {
      console.log('❌ Error al buscar por ObjectId:', error.message);
      user = null;
    }
    
    await client.close();

    if (!user) {
      console.log('❌ DEBUG - Usuario no encontrado en BD');
      return res.status(401).json({ message: 'Usuario no válido o inactivo.' });
    }

    console.log('👤 User from DB:', user);

    // Agregar usuario al request para uso en controladores
    req.user = user;
    console.log('✅ DEBUG - Usuario agregado a req.user');
    next();

  } catch (error) {
    console.error('❌ DEBUG - Error en authMiddleware:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = authMiddleware;
