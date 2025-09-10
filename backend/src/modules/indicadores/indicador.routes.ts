import { Router } from 'express';
import indicadorController from './indicador.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas principales
router.post('/', indicadorController.createIndicador);
router.get('/', indicadorController.getIndicadores);
router.get('/estadisticas', indicadorController.getEstadisticasIndicadores);
router.get('/activos', indicadorController.getIndicadoresActivos);
router.get('/necesitan-medicion', indicadorController.getIndicadoresNecesitanMedicion);

// Rutas por ID
router.get('/:id', indicadorController.getIndicadorById);
router.put('/:id', indicadorController.updateIndicador);
router.delete('/:id', indicadorController.deleteIndicador);

// Rutas de acciones específicas
router.put('/:id/activar', indicadorController.activarIndicador);
router.put('/:id/desactivar', indicadorController.desactivarIndicador);
router.put('/:id/suspender', indicadorController.suspenderIndicador);
router.put('/:id/tendencia', indicadorController.actualizarTendencia);

// Rutas de filtros
router.get('/departamento/:departamentoId', indicadorController.getIndicadoresByDepartamento);
router.get('/proceso/:procesoId', indicadorController.getIndicadoresByProceso);
router.get('/objetivo/:objetivoId', indicadorController.getIndicadoresByObjetivo);
router.get('/responsable/:responsableId', indicadorController.getIndicadoresByResponsable);
router.get('/tipo/:tipo', indicadorController.getIndicadoresByTipo);
router.get('/categoria/:categoria', indicadorController.getIndicadoresByCategoria);
router.get('/estado/:estado', indicadorController.getIndicadoresByEstado);

export default router;