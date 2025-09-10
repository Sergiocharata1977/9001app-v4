import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

// Cargar variables de entorno
dotenv.config();

// Importar configuración de base de datos
import { connectDatabase } from './config/database.js';

// Importar middlewares
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Importar rutas
import authRoutes from './modules/auth/auth.routes.js';
import departmentRoutes from './modules/departments/department.routes.js';
import organizationRoutes from './modules/organizations/organization.routes.js';
import personnelRoutes from './modules/personnel/personnel.routes.js';
import positionRoutes from './modules/positions/position.routes.js';
import userRoutes from './modules/users/user.routes.js';

// Importar rutas SGC
import procesoRoutes from './modules/procesos/proceso.routes.js';
import objetivoRoutes from './modules/objetivos/objetivo.routes.js';
import indicadorRoutes from './modules/indicadores/indicador.routes.js';
import medicionRoutes from './modules/mediciones/medicion.routes.js';
import registroRoutes from './modules/registros-procesos/registro.routes.js';

// Crear aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde'
});

// Middlewares globales
app.use(helmet()); // Seguridad
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Comprimir respuestas
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // Logging

// Rate limiting en rutas sensibles
app.use('/api/auth', limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/departamentos', departmentRoutes);
app.use('/api/puestos', positionRoutes);
app.use('/api/personal', personnelRoutes);

// Rutas SGC (Sistema de Gestión de Calidad)
app.use('/api/procesos', procesoRoutes);
app.use('/api/objetivos', objetivoRoutes);
app.use('/api/indicadores', indicadorRoutes);
app.use('/api/mediciones', medicionRoutes);
app.use('/api/registros', registroRoutes);

// Manejo de rutas no encontradas
app.use(notFound);

// Manejo global de errores
app.use(errorHandler);

// Función para iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    // Conectar a MongoDB
    await connectDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
        🚀 Servidor corriendo en http://localhost:${PORT}
        📊 Ambiente: ${process.env.NODE_ENV || 'development'}
        🔗 MongoDB: Conectado
        ✅ Sistema listo para recibir peticiones
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Cerrar servidor de forma segura
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Cerrar servidor de forma segura
  process.exit(1);
});

// Iniciar servidor
startServer();