import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

// Cargar variables de entorno
dotenv.config();

// Importar middleware de autenticación
import authMiddleware from '../middleware/authMiddleware';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS PÚBLICAS (SIN AUTENTICACIÓN) =====

// Ruta de salud
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Ruta de prueba
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// ===== FIN RUTAS PÚBLICAS =====

// Importar rutas
import accionesRoutes from '../routes/acciones.routes';
import auditoriasRoutes from '../routes/auditorias.routes';
import authRoutes from '../routes/authRoutes';
import capacitacionesRoutes from '../routes/capacitaciones.routes';
import competenciasRoutes from '../routes/competencias.routes';
import coordinacionRoutes from '../routes/coordinacion.routes';
import crmRoutes from '../routes/crm.routes';
import databaseRoutes from '../routes/database.routes';
import departamentosRoutes from '../routes/departamentos.routes';
import documentosRoutes from '../routes/documentos.routes';
import eventsRoutes from '../routes/events.routes';
import fileStructureRoutes from '../routes/fileStructure.routes';
import hallazgosRoutes from '../routes/hallazgos.routes';
import indicadoresRoutes from '../routes/indicadores.routes';
import medicionesRoutes from '../routes/mediciones.routes';
import minutasRoutes from '../routes/minutas.routes';
import normasRoutes from '../routes/normas.routes';
import numeracionCorrelativaRoutes from '../routes/numeracionCorrelativa.routes';
import objetivosCalidadRoutes from '../routes/objetivos-calidad.routes';
import personalRoutes from '../routes/personal.routes';
import planesRoutes from '../routes/planes';
import politicaCalidadRoutes from '../routes/politica-calidad.routes';
import procesosRoutes from '../routes/procesos.routes';
import productosRoutes from '../routes/productos.routes';
import puestosRoutes from '../routes/puestos.routes';
import suscripcionesRoutes from '../routes/suscripciones';
import userRoutes from '../routes/userRoutes';

// ===== RUTAS CON AUTENTICACIÓN =====

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de planes
app.use('/api/planes', planesRoutes);

// Rutas de suscripciones
app.use('/api/suscripciones', suscripcionesRoutes);

// Rutas de usuarios (requieren autenticación)
app.use('/api/usuarios', authMiddleware, userRoutes);

// Rutas de departamentos
app.use('/api/departamentos', departamentosRoutes);

// Rutas de personal
app.use('/api/personal', personalRoutes);

// Rutas de puestos
app.use('/api/puestos', puestosRoutes);

// Rutas de capacitaciones
app.use('/api/capacitaciones', capacitacionesRoutes);

// Rutas de competencias
app.use('/api/competencias', competenciasRoutes);

// Rutas de documentos (con subida y descarga)
app.use('/api/documentos', documentosRoutes);

// Rutas de puntos de la norma ISO
app.use('/api/normas', normasRoutes);

// Rutas de procesos
app.use('/api/procesos', procesosRoutes);

// Rutas de objetivos de calidad
app.use('/api/objetivos-calidad', objetivosCalidadRoutes);

// Rutas de indicadores
app.use('/api/indicadores', indicadoresRoutes);

// Rutas de mediciones
app.use('/api/mediciones', medicionesRoutes);

// Rutas de auditorías
app.use('/api/auditorias', auditoriasRoutes);

// Rutas de hallazgos
app.use('/api/hallazgos', hallazgosRoutes);

// Rutas de acciones
app.use('/api/acciones', accionesRoutes);

// Rutas de minutas
app.use('/api/minutas', minutasRoutes);

// Rutas de política de calidad
app.use('/api/politica-calidad', politicaCalidadRoutes);

// Rutas de eventos
app.use('/api/events', eventsRoutes);

// Rutas de coordinación de agentes
app.use('/api', coordinacionRoutes);

// Rutas de CRM
app.use('/api/crm', crmRoutes);

// Rutas de base de datos
app.use('/api/database', databaseRoutes);

// Rutas de estructura de archivos
app.use('/api/file-structure', fileStructureRoutes);

// Rutas de productos (requieren autenticación)
app.use('/api/productos', authMiddleware, productosRoutes);

// Rutas de numeración correlativa ISO 9001
app.use('/api/numeracion-correlativa', numeracionCorrelativaRoutes);

// ===== FIN RUTAS CON AUTENTICACIÓN =====

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
  });
});

// Ruta 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
});
