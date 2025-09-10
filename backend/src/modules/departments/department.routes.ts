import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import {
    createDepartmentSchema,
    departmentIdSchema,
    updateDepartmentSchema,
    validateParams,
    validateRequest
} from '../../shared/validators/department.validator.js';
import { DepartmentController } from './department.controller.js';

const router = Router();
const departmentController = new DepartmentController();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/departamentos/stats - Obtener estadísticas
router.get('/stats', departmentController.getDepartmentStats);

// GET /api/departamentos - Obtener todos los departamentos
router.get('/', departmentController.getAllDepartments);

// GET /api/departamentos/:id - Obtener departamento por ID
router.get('/:id', validateParams(departmentIdSchema), departmentController.getDepartmentById);

// POST /api/departamentos - Crear nuevo departamento
router.post('/', validateRequest(createDepartmentSchema), departmentController.createDepartment);

// PUT /api/departamentos/:id - Actualizar departamento
router.put('/:id', 
  validateParams(departmentIdSchema), 
  validateRequest(updateDepartmentSchema), 
  departmentController.updateDepartment
);

// DELETE /api/departamentos/:id - Eliminar departamento
router.delete('/:id', validateParams(departmentIdSchema), departmentController.deleteDepartment);

export default router;