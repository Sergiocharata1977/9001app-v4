import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../modules/users/user.model.js';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface JWTPayload {
  userId: string;
  email: string;
  organizationId: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// Middleware para verificar JWT
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.userId)
      .populate('organization_id', 'nombre codigo')
      .select('-password');

    if (!user || !user.activo) {
      res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
      return;
    }

    // Verificar que la organización coincida
    if (user.organization_id._id.toString() !== decoded.organizationId) {
      res.status(401).json({
        success: false,
        message: 'Token de organización inválido'
      });
      return;
    }

    // Actualizar último acceso
    user.ultimo_acceso = new Date();
    await user.save();

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    } else {
      console.error('Error en autenticación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    const hasRole = roles.some(role => req.user!.roles.includes(role));
    
    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
      return;
    }

    next();
  };
};

// Middleware para verificar que el usuario pertenece a la organización
export const requireOrganization = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
    return;
  }

  const organizationId = req.params.organizationId || req.body.organization_id || req.query.organization_id;
  
  if (organizationId && req.user.organization_id._id.toString() !== organizationId) {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado a esta organización'
    });
    return;
  }

  next();
};

// Función para generar tokens
export const generateTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    organizationId: user.organization_id.toString(),
    roles: user.roles
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '15m' 
  });
  
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { 
    expiresIn: '7d' 
  });

  return { accessToken, refreshToken };
};

// Función para verificar refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
};