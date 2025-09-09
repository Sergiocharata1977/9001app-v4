const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Importar middleware de autenticación
const authMiddleware = require('./middleware/authMiddleware.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const departamentosRoutes = require('./routes/departamentos.routes.js');
const personalRoutes = require('./routes/personal.routes.js');
const puestosRoutes = require('./routes/puestos.routes.js');
const capacitacionesRoutes = require('./routes/capacitaciones.routes.js');
const competenciasRoutes = require('./routes/competencias.routes.js');
const documentosRoutes = require('./routes/documentos.routes.js');
const normasRoutes = require('./routes/normas.routes.js');
const procesosRoutes = require('./routes/procesos.routes.js');
const procesosMongoDBRoutes = require('./routes/procesos-mongodb.routes.js');
const procesosAbmRoutes = require('./routes/procesos-abm.routes.js');
const registrosProcesosAbmRoutes = require('./routes/registros-procesos-abm.routes.js');
const objetivosCalidadRoutes = require('./routes/objetivos-calidad.routes.js');
const indicadoresRoutes = require('./routes/indicadores.routes.js');
const medicionesRoutes = require('./routes/mediciones.routes.js');
const hallazgosRoutes = require('./routes/hallazgos.routes.js');
const accionesRoutes = require('./routes/acciones.routes.js');
const auditoriasRoutes = require('./routes/auditorias.routes.js');
const productosRoutes = require('./routes/productos.routes.js');
const minutasRoutes = require('./routes/minutas.routes.js');
const politicaCalidadRoutes = require('./routes/politica-calidad.routes.js');
const eventsRoutes = require('./routes/events.routes.js');
// const evaluacionesRoutes = require('./routes/evaluaciones.routes.js');
// const evaluacionesSgcRoutes = require('./routes/evaluaciones-sgc.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const planesRoutes = require('./routes/planes.js');
const suscripcionesRoutes = require('./routes/suscripciones.js');
const coordinacionRoutes = require('./routes/coordinacion.routes.js');
const crmRoutes = require('./routes/crm.routes.js');
const databaseRoutes = require('./routes/database.routes.js');
const fileStructureRoutes = require('./routes/fileStructure.routes.js');
const organizationRoutes = require('./routes/organization.routes.js');

// Importar rutas RAG del nuevo sistema
let ragRoutes = null;
try {
  ragRoutes = require('./routes/rag.routes.js');
  console.log('✅ Nuevo sistema RAG cargado correctamente');
} catch (error) {
  console.log('⚠️  Nuevo módulo RAG no encontrado, continuando sin RAG...');
  console.log('Error:', error.message);
}

// Importar rutas de Super Admin (TypeScript compilado)
let superAdminRoutes = null;
try {
  superAdminRoutes = require('./routes/superAdmin.routes.js');
  console.log('✅ Sistema Super Admin cargado correctamente');
} catch (error) {
  console.log('⚠️  Módulo Super Admin no encontrado, compilando TypeScript...');
  // El archivo TypeScript necesita ser compilado primero
}

// Importar rutas del Editor de Registros (TypeScript compilado)
let editorRegistrosRoutes = null;
try {
  editorRegistrosRoutes = require('./routes/editorRegistros.integration.js');
  console.log('✅ Sistema Editor de Registros cargado correctamente');
} catch (error) {
  console.log('⚠️  Módulo Editor de Registros no encontrado, compilando TypeScript...');
  // El archivo TypeScript necesita ser compilado primero
}

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de administración (requieren autenticación)
app.use('/api/admin', authMiddleware, adminRoutes);

// Rutas de planes
app.use('/api/planes', planesRoutes);

// Rutas de suscripciones
app.use('/api/suscripciones', suscripcionesRoutes);

// Rutas de usuarios (requieren autenticación)
app.use('/api/usuarios', authMiddleware, userRoutes);

// Rutas de organizaciones (requieren autenticación)
app.use('/api/organizations', organizationRoutes);

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
app.use('/api/procesos-mongodb', procesosMongoDBRoutes);
app.use('/api/procesos-abm', procesosAbmRoutes);
app.use('/api/registros-procesos-abm', registrosProcesosAbmRoutes);

// Rutas de objetivos de calidad
app.use('/api/objetivos-calidad', objetivosCalidadRoutes);

// Rutas de indicadores
app.use('/api/indicadores', indicadoresRoutes);

// Rutas de mediciones
app.use('/api/mediciones', medicionesRoutes);

// Rutas de hallazgos
app.use('/api/hallazgos', hallazgosRoutes);

// Rutas de acciones
app.use('/api/acciones', accionesRoutes);

// Rutas de auditorías
app.use('/api/auditorias', auditoriasRoutes);

// Rutas de minutas
app.use('/api/minutas', minutasRoutes);

// Rutas de políticas de calidad
app.use('/api/politica-calidad', politicaCalidadRoutes);

// Rutas de events (básico)
app.use('/api/events', eventsRoutes);

// Rutas de coordinación de agentes
app.use('/api', coordinacionRoutes);

// Rutas de CRM
app.use('/api/crm', crmRoutes);

// Rutas de base de datos
app.use('/api/database', databaseRoutes);

// Rutas de estructura de archivos
app.use('/api/file-structure', fileStructureRoutes);

// Rutas de RAG (si está disponible)
if (ragRoutes) {
  app.use('/api/rag', ragRoutes);
  console.log('✅ Rutas RAG registradas');
}

// Rutas de Super Admin (si está disponible)
if (superAdminRoutes) {
  app.use('/api/super-admin', superAdminRoutes);
  console.log('✅ Rutas Super Admin registradas');
}

// Rutas del Editor de Registros (si está disponible)
if (editorRegistrosRoutes) {
  editorRegistrosRoutes.registrarRutasEditorRegistros(app);
  console.log('✅ Rutas Editor de Registros registradas');
}

// Rutas de evaluaciones (SGC estandarizado) - TEMPORALMENTE DESHABILITADAS
// app.use('/api/evaluaciones', evaluacionesRoutes);

// Rutas de evaluaciones SGC (específicas) - TEMPORALMENTE DESHABILITADAS
// app.use('/api/evaluaciones-sgc', evaluacionesSgcRoutes);

// Rutas de productos (requieren autenticación)
app.use('/api/productos', authMiddleware, productosRoutes);

// ===== SISTEMAS ALTERNATIVOS DE BÚSQUEDA =====
const alternativeSearchRoutes = require('./routes/alternativeSearch.routes');
app.use('/api/alternative', alternativeSearchRoutes);
// ===== FIN SISTEMAS ALTERNATIVOS =====


// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
}); 