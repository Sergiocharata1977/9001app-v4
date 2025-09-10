import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Ruta para obtener información de la organización del usuario
router.get('/current', async (req, res) => {
  try {
    const { Organization } = await import('./organization.model.js');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const organization = await Organization.findById(req.user.organization_id._id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organización no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Organización obtenida exitosamente',
      data: organization
    });
  } catch (error) {
    console.error('Error al obtener organización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;