import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Ruta básica para obtener usuarios de la organización
router.get('/', async (req, res) => {
  try {
    const { User } = await import('./user.model.js');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const users = await User.findByOrganization(req.user.organization_id._id.toString());
    
    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener un usuario específico
router.get('/:id', async (req, res) => {
  try {
    const { User } = await import('./user.model.js');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('organization_id', 'nombre codigo');

    if (!user || user.organization_id._id.toString() !== req.user.organization_id._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario obtenido exitosamente',
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;
