const express = require('express');
import auditoriasController from '../controllers/auditoriasController';

const router = express.Router();

// ===============================================
// RUTAS DE AUDITORÍAS - SGC PRO
// ===============================================

// Rutas principales de auditorías
router.get('/', auditoriasController.getAllAuditorias);
router.get('/:id', auditoriasController.getAuditoriaById);
router.post('/', auditoriasController.createAuditoria);
router.put('/:id', auditoriasController.updateAuditoria);
router.delete('/:id', auditoriasController.deleteAuditoria);

// Rutas de aspectos de auditoría
router.get('/:auditoriaId/aspectos', auditoriasController.getAspectos);
router.post('/:auditoriaId/aspectos', auditoriasController.addAspecto);
router.put('/:auditoriaId/aspectos/:aspectoId', auditoriasController.updateAspecto);
router.delete('/:auditoriaId/aspectos/:aspectoId', auditoriasController.deleteAspecto);

// Rutas de relaciones de auditoría
router.get('/:auditoriaId/relaciones', auditoriasController.getRelaciones);
router.post('/:auditoriaId/relaciones', auditoriasController.addRelacion);
router.delete('/relaciones/:relacionId', auditoriasController.deleteRelacion);

// Ruta para obtener registros relacionables
router.get('/registros-relacionables/:tipo', auditoriasController.getRegistrosRelacionables);

// ===============================================
// RUTAS SGC - PARTICIPANTES, DOCUMENTOS Y NORMAS
// ===============================================

// Rutas de participantes SGC
router.get('/:auditoriaId/sgc/participantes', auditoriasController.getParticipantesSGC);
router.post('/:auditoriaId/sgc/participantes', auditoriasController.addParticipanteSGC);

// Rutas de documentos SGC
router.get('/:auditoriaId/sgc/documentos', auditoriasController.getDocumentosSGC);
router.post('/:auditoriaId/sgc/documentos', auditoriasController.addDocumentoSGC);

// Rutas de normas SGC
router.get('/:auditoriaId/sgc/normas', auditoriasController.getNormasSGC);
router.post('/:auditoriaId/sgc/normas', auditoriasController.addNormaSGC);

module.exports = router; 