import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

interface SuperAdminRequest extends Request {
  user?: {
    _id: string;
    id: string;
    role: string;
    email: string;
    name: string;
    organization_id?: string;
  };
}

/**
 * Middleware para verificar que el usuario es super admin
 */
export const requireSuperAdmin = async (
  req: SuperAdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Decodificar token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }
    
    // Conectar a MongoDB y verificar usuario
    const client = new MongoClient(process.env.MONGODB_URI!);
    
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
      const usersCollection = db.collection('users');
      
      // Buscar usuario
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
        is_active: true
      });
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado o inactivo'
        });
        return;
      }
      
      // Verificar que sea super admin
      if (user.role !== 'super_admin') {
        res.status(403).json({
          success: false,
          message: 'Acceso denegado. Se requieren permisos de Super Admin'
        });
        return;
      }
      
      // Agregar usuario al request
      req.user = {
        _id: user._id.toString(),
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
        organization_id: user.organization_id
      };
      
      next();
      
    } finally {
      await client.close();
    }
    
  } catch (error) {
    console.error('Error en middleware de super admin:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para logging de operaciones de super admin
 */
export const logSuperAdminAction = (action: string) => {
  return (req: SuperAdminRequest, res: Response, next: NextFunction) => {
    console.log(`[SUPER_ADMIN_ACTION] ${action}`, {
      user: req.user?.email,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
    
    next();
  };
};

/**
 * Middleware para rate limiting de operaciones críticas
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitSuperAdmin = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: SuperAdminRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }
    
    const now = Date.now();
    const userRequests = requestCounts.get(userId);
    
    if (!userRequests || now > userRequests.resetTime) {
      // Crear nueva ventana de tiempo
      requestCounts.set(userId, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }
    
    if (userRequests.count >= maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Por favor, espere un momento.'
      });
      return;
    }
    
    userRequests.count++;
    next();
  };
};

