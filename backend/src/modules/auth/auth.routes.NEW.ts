import { Router } from 'express';
import { AuthControllerNEW } from './auth.controller.NEW.js';

const router = Router();

// 🔐 Rutas de autenticación principales
router.post('/login-new', AuthControllerNEW.login);
router.post('/register-new', AuthControllerNEW.register);
router.get('/profile-new', AuthControllerNEW.getProfile);

// 🔧 Rutas de desarrollo
router.post('/set-password-new', AuthControllerNEW.setPassword);
router.post('/create-test-user-new', AuthControllerNEW.createTestUser);

export default router;