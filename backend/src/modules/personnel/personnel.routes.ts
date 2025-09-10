import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import {
    createPersonnelSchema,
    departmentIdSchema,
    personnelIdSchema,
    positionIdSchema,
    updatePersonnelSchema,
    validateParams,
    validateRequest
} from '../../shared/validators/personnel.validator.js';
import { PersonnelController } from './personnel.controller.js';

const router = Router();
const personnelController = new PersonnelController();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/personal/stats - Obtener estadísticas
router.get('/stats', personnelController.getPersonnelStats);

// GET /api/personal/departamento/:departamento_id - Obtener personal por departamento
router.get('/departamento/:departamento_id', 
  validateParams(departmentIdSchema), 
  personnelController.getPersonnelByDepartment
);

// GET /api/personal/puesto/:puesto_id - Obtener personal por puesto
router.get('/puesto/:puesto_id', 
  validateParams(positionIdSchema), 
  personnelController.getPersonnelByPosition
);

// GET /api/personal - Obtener todo el personal
router.get('/', personnelController.getAllPersonnel);

// GET /api/personal/:id - Obtener empleado por ID
router.get('/:id', validateParams(personnelIdSchema), personnelController.getPersonnelById);

// POST /api/personal - Crear nuevo empleado
router.post('/', validateRequest(createPersonnelSchema), personnelController.createPersonnel);

// PUT /api/personal/:id - Actualizar empleado
router.put('/:id', 
  validateParams(personnelIdSchema), 
  validateRequest(updatePersonnelSchema), 
  personnelController.updatePersonnel
);

// DELETE /api/personal/:id - Eliminar empleado
router.delete('/:id', validateParams(personnelIdSchema), personnelController.deletePersonnel);

export default router;