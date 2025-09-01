import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        nombre: string;
        organizacion_id: string;
        rol: string;
        permisos?: string[];
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Token de acceso requerido' });
    return;
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido o expirado' });
      return;
    }
    
    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email,
      nombre: decoded.nombre || decoded.name,
      organizacion_id: decoded.organizacion_id || decoded.organization_id,
      rol: decoded.rol || decoded.role || 'usuario',
      permisos: decoded.permisos || decoded.permissions
    };
    
    next();
  });
};