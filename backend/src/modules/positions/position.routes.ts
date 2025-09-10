import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import {
    createPositionSchema,
    departmentIdSchema,
    positionIdSchema,
    updatePositionSchema,
    validateParams,
    validateRequest
} from '../../shared/validators/position.validator.js';
import { PositionController } from './position.controller.js';

const router = Router();
const positionController = new PositionController();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/puestos/stats - Obtener estadísticas
router.get('/stats', positionController.getPositionStats);

// GET /api/puestos/departamento/:departamento_id - Obtener puestos por departamento
router.get('/departamento/:departamento_id', 
  validateParams(departmentIdSchema), 
  positionController.getPositionsByDepartment
);

// GET /api/puestos - Obtener todos los puestos
router.get('/', positionController.getAllPositions);

// GET /api/puestos/:id - Obtener puesto por ID
router.get('/:id', validateParams(positionIdSchema), positionController.getPositionById);

// POST /api/puestos - Crear nuevo puesto
router.post('/', validateRequest(createPositionSchema), positionController.createPosition);

// PUT /api/puestos/:id - Actualizar puesto
router.put('/:id', 
  validateParams(positionIdSchema), 
  validateRequest(updatePositionSchema), 
  positionController.updatePosition
);

// DELETE /api/puestos/:id - Eliminar puesto
router.delete('/:id', validateParams(positionIdSchema), positionController.deletePosition);

export default router;