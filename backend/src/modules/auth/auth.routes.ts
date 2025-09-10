import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { AuthController } from './auth.controller.js';

const router = Router();

// Rutas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);

// Rutas protegidas
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;