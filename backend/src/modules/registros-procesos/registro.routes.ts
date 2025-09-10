import { Router } from 'express';
import registroController from './registro.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Rutas principales
router.post('/', registroController.createRegistro);
router.get('/', registroController.getRegistros);
router.get('/estadisticas', registroController.getEstadisticasRegistros);
router.get('/vencidos', registroController.getRegistrosVencidos);
router.get('/necesitan-atencion', registroController.getRegistrosNecesitanAtencion);
router.get('/con-alertas', registroController.getRegistrosConAlertas);

// Rutas por ID
router.get('/:id', registroController.getRegistroById);
router.put('/:id', registroController.updateRegistro);
router.delete('/:id', registroController.deleteRegistro);

// Rutas de acciones específicas
router.put('/:id/cerrar', registroController.cerrarRegistro);
router.post('/:id/seguimiento', registroController.agregarSeguimiento);
router.put('/:id/accion/:accionIndex', registroController.actualizarAccion);

// Rutas de filtros
router.get('/proceso/:procesoId', registroController.getRegistrosByProceso);
router.get('/departamento/:departamentoId', registroController.getRegistrosByDepartamento);
router.get('/responsable/:responsableId', registroController.getRegistrosByResponsable);
router.get('/tipo/:tipo', registroController.getRegistrosByTipo);
router.get('/estado/:estado', registroController.getRegistrosByEstado);
router.get('/prioridad/:prioridad', registroController.getRegistrosByPrioridad);
router.get('/categoria/:categoria', registroController.getRegistrosByCategoria);

export default router;