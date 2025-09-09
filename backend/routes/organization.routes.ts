import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getOrganization,
  verifyTenant,
  getAllOrganizations
} from '../controllers/organizationController';

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de organizaciones
router.get('/verify-tenant', verifyTenant);
router.get('/', getAllOrganizations);
router.get('/:id', getOrganization);

export default router;
