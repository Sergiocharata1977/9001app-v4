const express = require('express');
const {
  // Nivel 1: Gestión de usuarios por organización
  getOrganizationUsers,
  createOrganizationUser,
  updateOrganizationUser,
  deleteOrganizationUser,
  
  // Nivel 2: Gestión global (super-admin)
  getAllOrganizations,
  createOrganization,
  updateOrganizationPlan
} = require('../controllers/userController.js');
const { getProfile } = require('../controllers/authController.js');
const { auditCreateUser, auditUpdateUser, auditDeleteUser } = require('../middleware/auditMiddleware.js');

const router = express.Router();

// NOTA: El middleware básico de autenticación se aplica en index.js
// Aquí no necesitamos middleware adicional por ahora

console.log('📋 Configurando rutas de usuarios BÁSICAS (sin restricciones de roles)');

// ===============================================
// NIVEL 1: GESTIÓN DE USUARIOS POR ORGANIZACIÓN
// ===============================================

// @route   GET /api/users
// @desc    Obtener todos los usuarios de la organización actual
// @access  Private (Todos los usuarios autenticados)
router.get('/', getOrganizationUsers);

// @route   POST /api/users
// @desc    Crear un nuevo usuario en la organización
// @access  Private (Todos los usuarios autenticados)
router.post('/', 
  auditCreateUser,
  createOrganizationUser
);

// @route   PUT /api/users/:id
// @desc    Actualizar un usuario de la organización
// @access  Private (Todos los usuarios autenticados)
router.put('/:id', 
  auditUpdateUser,
  updateOrganizationUser
);

// @route   DELETE /api/users/:id
// @desc    Eliminar un usuario de la organización
// @access  Private (Todos los usuarios autenticados)
router.delete('/:id', 
  auditDeleteUser,
  deleteOrganizationUser
);

// @route   GET /api/users/profile
// @desc    Obtener perfil del usuario actual
// @access  Private (Todos los usuarios autenticados)
router.get('/profile', getProfile);

// ===============================================
// NIVEL 2: GESTIÓN GLOBAL (SUPER-ADMIN)
// ===============================================

// @route   GET /api/users/organizations
// @desc    Obtener todas las organizaciones del sistema
// @access  Private (Super-Admin only)
router.get('/organizations', 
  (req, res, next) => {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Solo super-admin puede acceder' });
    }
    next();
  },
  getAllOrganizations
);

// @route   POST /api/users/organizations
// @desc    Crear una nueva organización
// @access  Private (Super-Admin only)
router.post('/organizations', 
  (req, res, next) => {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Solo super-admin puede crear organizaciones' });
    }
    next();
  },
  createOrganization
);

// @route   PUT /api/users/organizations/:id/plan
// @desc    Actualizar plan de una organización
// @access  Private (Super-Admin only)
router.put('/organizations/:id/plan', 
  (req, res, next) => {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Solo super-admin puede modificar planes' });
    }
    next();
  },
  updateOrganizationPlan
);

module.exports = router;
