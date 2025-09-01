import { Request, Response, NextFunction } from 'express';

export const checkRole = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const rolUsuario = req.user.rol || 'usuario';
    
    // Admin siempre tiene acceso
    if (rolUsuario === 'admin' || rolUsuario === 'superadmin') {
      next();
      return;
    }
    
    // Verificar si el rol del usuario está en los roles permitidos
    if (rolesPermitidos.includes(rolUsuario)) {
      next();
      return;
    }
    
    res.status(403).json({ 
      error: 'No tienes permisos para realizar esta acción',
      rol_actual: rolUsuario,
      roles_requeridos: rolesPermitidos
    });
  };
};

export const checkPermission = (permisosRequeridos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const permisosUsuario = req.user.permisos || [];
    const rolUsuario = req.user.rol || 'usuario';
    
    // Admin siempre tiene acceso
    if (rolUsuario === 'admin' || rolUsuario === 'superadmin') {
      next();
      return;
    }
    
    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const tienePermiso = permisosRequeridos.some(permiso => 
      permisosUsuario.includes(permiso)
    );
    
    if (tienePermiso) {
      next();
      return;
    }
    
    res.status(403).json({ 
      error: 'No tienes los permisos necesarios',
      permisos_requeridos: permisosRequeridos
    });
  };
};