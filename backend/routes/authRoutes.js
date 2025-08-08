const express = require('express');
const { register, login, refreshToken, logout, getProfile, verifyToken } = require('../controllers/authController.js');
const authenticateToken = require('../middleware/authMiddleware.js');
const { auditLogin, auditLogout, auditRegister } = require('../middleware/auditMiddleware.js');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Registrar una nueva organización y su usuario admin
// @access  Public
router.post('/register', auditRegister, register);

// @route   POST api/auth/login
// @desc    Iniciar sesión y obtener tokens
// @access  Public
router.post('/login', login);

// @route   POST api/auth/refresh
// @desc    Renovar access token usando refresh token
// @access  Public
router.post('/refresh', refreshToken);

// @route   POST api/auth/logout
// @desc    Cerrar sesión y revocar refresh token
// @access  Public
router.post('/logout', auditLogout, logout);

// @route   GET api/auth/profile
// @desc    Obtener perfil del usuario autenticado
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   GET api/auth/verify
// @desc    Verificar si el token es válido
// @access  Private
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
