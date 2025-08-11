const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

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
const objetivosCalidadRoutes = require('./routes/objetivos-calidad.routes.js');
const indicadoresRoutes = require('./routes/indicadores.routes.js');
const medicionesRoutes = require('./routes/mediciones.routes.js');
const hallazgosRoutes = require('./routes/hallazgos.js');
const accionesRoutes = require('./routes/acciones.routes.js');
const auditoriasRoutes = require('./routes/auditorias.routes.js');

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', userRoutes);

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

// Rutas de hallazgos
app.use('/api/hallazgos', hallazgosRoutes);

// Rutas de acciones
app.use('/api/acciones', accionesRoutes);

// Rutas de auditorías
app.use('/api/auditorias', auditoriasRoutes);

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