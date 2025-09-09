const express = require('express');
import NumeracionCorrelativaController from '../controllers/NumeracionCorrelativaController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// ===============================================
// RUTAS DE NUMERACIÓN CORRELATIVA ISO 9001
// ===============================================

// POST /api/numeracion-correlativa/generar
// Genera un código correlativo ISO 9001
router.post('/generar', NumeracionCorrelativaController.generarCodigo);

// POST /api/numeracion-correlativa/sub-codigo
// Genera un código de sub-numeración (ej: H0001, A001)
router.post('/sub-codigo', NumeracionCorrelativaController.generarSubCodigo);

// POST /api/numeracion-correlativa/flujo-completo
// Genera un código completo de flujo ISO 9001
router.post('/flujo-completo', NumeracionCorrelativaController.generarCodigoFlujoCompleto);

// GET /api/numeracion-correlativa/configuracion
// Obtiene la configuración de numeración
router.get('/configuracion', NumeracionCorrelativaController.obtenerConfiguracion);

// GET /api/numeracion-correlativa/ejemplo/:tipo
// Genera un código de ejemplo para mostrar el formato
router.get('/ejemplo/:tipo', NumeracionCorrelativaController.generarCodigoEjemplo);

// GET /api/numeracion-correlativa/estadisticas
// Obtiene estadísticas de numeración
router.get('/estadisticas', NumeracionCorrelativaController.obtenerEstadisticas);

// POST /api/numeracion-correlativa/reiniciar-anual
// Reinicia los contadores anuales
router.post('/reiniciar-anual', NumeracionCorrelativaController.reiniciarContadoresAnuales);

// POST /api/numeracion-correlativa/reiniciar-mensual
// Reinicia los contadores mensuales
router.post('/reiniciar-mensual', NumeracionCorrelativaController.reiniciarContadoresMensuales);

module.exports = router;
