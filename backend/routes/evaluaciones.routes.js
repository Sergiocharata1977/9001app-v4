const { Router  } = require('express');
const evaluacionesController = require('../controllers/evaluacionesController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// GET /api/evaluaciones -> Obtener todas las evaluaciones individuales
router.get('/', evaluacionesController.getEvaluaciones);

// POST /api/evaluaciones -> Crear una nueva evaluación individual
router.post('/', evaluacionesController.createEvaluacion);

// GET /api/evaluaciones/estadisticas -> Obtener estadísticas de evaluaciones
router.get('/estadisticas', evaluacionesController.getEstadisticasEvaluaciones);

// GET /api/evaluaciones/:id -> Obtener una evaluación específica
router.get('/:id', evaluacionesController.getEvaluacionById);

module.exports = router;
