import { Router  } from 'express';
const {
  getConfiguracion,
  updateConfiguracion
} = require('../controllers/direccion.controller');

const router = Router();

// Ruta para obtener la configuración de la dirección
// El frontend llamará a GET /api/direccion/configuracion
router.get('/direccion/configuracion', getConfiguracion);

// Ruta para actualizar la configuración de la dirección
// El frontend llamará a PUT /api/direccion/configuracion
router.put('/direccion/configuracion', updateConfiguracion);

module.exports = router;
