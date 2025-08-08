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

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', userRoutes);

// Rutas de departamentos
app.use('/api/departamentos', departamentosRoutes);

// Rutas de personal
app.use('/api/personal', personalRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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