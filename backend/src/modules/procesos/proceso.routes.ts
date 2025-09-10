import { Router } from 'express';
import procesoController from './proceso.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas principales
router.post('/', procesoController.createProceso);
router.get('/', procesoController.getProcesos);
router.get('/estadisticas', procesoController.getEstadisticasProcesos);
router.get('/pendientes-revision', procesoController.getProcesosPendientesRevision);

// Rutas por ID
router.get('/:id', procesoController.getProcesoById);
router.put('/:id', procesoController.updateProceso);
router.delete('/:id', procesoController.deleteProceso);

// Rutas de acciones específicas
router.put('/:id/version', procesoController.actualizarVersionProceso);
router.put('/:id/aprobar', procesoController.aprobarProceso);
router.put('/:id/marcar-obsoleto', procesoController.marcarObsoleto);

// Rutas de filtros
router.get('/departamento/:departamentoId', procesoController.getProcesosByDepartamento);
router.get('/responsable/:responsableId', procesoController.getProcesosByResponsable);
router.get('/tipo/:tipo', procesoController.getProcesosByTipo);
router.get('/estado/:estado', procesoController.getProcesosByEstado);

export default router;