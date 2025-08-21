/**
 * Middleware para verificar permisos de administrador
 * Verifica si el usuario tiene rol de admin o super_admin
 */

const adminMiddleware = (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Verificar si el usuario tiene rol de administrador
    const adminRoles = ['admin', 'super_admin', 'gerente'];
    
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Acceso denegado. Se requieren permisos de administrador.' 
      });
    }

    console.log('✅ Acceso de administrador permitido para:', user.email);
    next();
  } catch (error) {
    console.error('Error en adminMiddleware:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = adminMiddleware;
