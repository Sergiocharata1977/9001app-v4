import jwt from 'jsonwebtoken';
const mongoClient = require('../lib/mongoClient.js');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware de autenticación básica
const authenticate = async (req: Request, res: Response, next?: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Obtener información completa del usuario y organización
    const userResult = await mongoClient.execute({
      sql: `SELECT u.id, u.name, u.email, u.role, u.organization_id, 
             o.name as organization_name, o.plan, o.max_users
             FROM usuarios u 
             LEFT JOIN organizations o ON u.organization_id = o.id 
             WHERE u.id = ?`,
      args: [decoded.id]
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];
    req.user = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      organization_id: Number(user.organization_id),
      organization_plan: user.plan || 'basic',
      organization_name: user.organization_name || 'Sin organización',
      max_users: Number(user.max_users) || 10
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

/**
 * Middleware para verificar permisos por feature
 * Verifica si el usuario tiene acceso a una feature específica
 */
const checkFeatureAccess = (requiredFeature) => {
  return async (req: Request, res: Response, next?: NextFunction): void => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }

      console.log('🔐 Verificando acceso a feature:', { 
        user: user.email, 
        feature: requiredFeature,
        role: user.role, 
        organization_id: user.organization_id
      });



      // Verificar que el usuario tenga una organización válida
      if (!user.organization_id) {
        return res.status(403).json({ message: 'Usuario no asignado a una organización' });
      }

      // Verificar si la feature está habilitada para la organización
      const featureEnabled = await mongoClient.execute({
        sql: `
          SELECT is_enabled FROM organization_feature 
          WHERE organization_id = ? AND feature_name = ? AND is_enabled = 1
        `,
        args: [user.organization_id, requiredFeature]
      });

      if (featureEnabled.rows.length === 0) {
        console.log('❌ Feature no habilitada para la organización:', requiredFeature);
        return res.status(403).json({ 
          message: `Feature '${requiredFeature}' no está habilitada para esta organización` 
        });
      }

      // Verificar si el usuario tiene permiso específico para esta feature
      const userPermission = await mongoClient.execute({
        sql: `
          SELECT 1 FROM user_feature_permissions 
          WHERE organization_id = ? AND user_id = ? AND feature_name = ? AND is_active = 1
        `,
        args: [user.organization_id, user.id, requiredFeature]
      });

      // Si no hay permisos específicos, verificar por rol
      if (userPermission.rows.length === 0) {
        // Admin de organización tiene acceso a todas las features habilitadas
        if (user.role === 'admin') {
          console.log('✅ Admin de organización - acceso permitido');
          return next();
        }
        
        // Para otros roles, verificar permisos específicos
        console.log('❌ Usuario sin permisos para feature:', requiredFeature);
        return res.status(403).json({ 
          message: `No tienes permisos para acceder a '${requiredFeature}'` 
        });
      }

      console.log('✅ Usuario con permisos específicos - acceso permitido');
      next();
    } catch (error) {
      console.error('💥 Error en middleware de permisos por feature:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};

/**
 * Middleware simplificado para verificar límites de usuarios
 * Por ahora no hay límites activos
 */
const checkUserLimits = async (req: Request, res: Response, next?: NextFunction): void => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }



    // Por ahora no aplicamos límites, solo log
    console.log('ℹ️ Verificación de límites (sin restricciones activas):', {
      organization_id: user.organization_id,
      user_role: user.role
    });

    next();
  } catch (error) {
    console.error('💥 Error en verificación de límites:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Middleware simplificado para auto-detectar permisos
 * Por ahora solo verifica autenticación
 */
const autoCheckPermissions = (req: Request, res: Response, next?: NextFunction): void => {
  // Por ahora solo verificamos que el usuario esté autenticado
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }
  
  console.log('🔐 Auto-verificación de permisos:', {
    path: req.path,
    method: req.method,
    user: req.user.email,
    organization_id: req.user.organization_id
  });
  
  next();
};

export default {
  authenticate,
  checkPermissions: checkFeatureAccess, // Renombrado para reflejar el nuevo middleware
  checkUserLimits,
  autoCheckPermissions
};
