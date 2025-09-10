import { Router } from 'express';
import medicionController from './medicion.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas principales
router.post('/', medicionController.createMedicion);
router.get('/', medicionController.getMediciones);
router.get('/estadisticas', medicionController.getEstadisticasMediciones);
router.get('/vencidas', medicionController.getMedicionesVencidas);
router.get('/necesitan-revision', medicionController.getMedicionesNecesitanRevision);
router.get('/con-alertas', medicionController.getMedicionesConAlertas);

// Rutas por ID
router.get('/:id', medicionController.getMedicionById);
router.put('/:id', medicionController.updateMedicion);
router.delete('/:id', medicionController.deleteMedicion);

// Rutas de acciones específicas
router.put('/:id/aprobar', medicionController.aprobarMedicion);
router.put('/:id/rechazar', medicionController.rechazarMedicion);

// Rutas de filtros
router.get('/indicador/:indicadorId', medicionController.getMedicionesByIndicador);
router.get('/responsable/:responsableId', medicionController.getMedicionesByResponsable);
router.get('/estado/:estado', medicionController.getMedicionesByEstado);
router.get('/periodo/:inicio/:fin', medicionController.getMedicionesByPeriodo);

// Rutas de análisis
router.get('/indicador/:indicadorId/tendencia', medicionController.calcularTendencia);

export default router;