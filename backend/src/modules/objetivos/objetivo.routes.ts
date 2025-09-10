import { Router } from 'express';
import objetivoController from './objetivo.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas principales
router.post('/', objetivoController.createObjetivo);
router.get('/', objetivoController.getObjetivos);
router.get('/estadisticas', objetivoController.getEstadisticasObjetivos);
router.get('/vencidos', objetivoController.getObjetivosVencidos);
router.get('/necesitan-atencion', objetivoController.getObjetivosNecesitanAtencion);

// Rutas por ID
router.get('/:id', objetivoController.getObjetivoById);
router.put('/:id', objetivoController.updateObjetivo);
router.delete('/:id', objetivoController.deleteObjetivo);

// Rutas de acciones específicas
router.put('/:id/actividad/:actividadIndex/progreso', objetivoController.actualizarProgresoActividad);
router.post('/:id/revision', objetivoController.agregarRevision);

// Rutas de filtros
router.get('/departamento/:departamentoId', objetivoController.getObjetivosByDepartamento);
router.get('/proceso/:procesoId', objetivoController.getObjetivosByProceso);
router.get('/responsable/:responsableId', objetivoController.getObjetivosByResponsable);
router.get('/tipo/:tipo', objetivoController.getObjetivosByTipo);
router.get('/estado/:estado', objetivoController.getObjetivosByEstado);
router.get('/prioridad/:prioridad', objetivoController.getObjetivosByPrioridad);

export default router;