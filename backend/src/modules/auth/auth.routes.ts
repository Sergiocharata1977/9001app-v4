import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
    validateRequest
} from '../../shared/validators/auth.validator.js';
import { AuthController } from './auth.controller.js';

const router = Router();

// Rutas públicas
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/refresh-token', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Ruta para crear usuario de prueba (solo desarrollo)
router.post('/create-test-user', AuthController.createTestUser);

// Ruta para establecer contraseña (solo desarrollo)
router.post('/set-password', AuthController.setPassword);

// Rutas protegidas
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;