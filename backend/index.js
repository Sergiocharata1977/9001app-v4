const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// Ruta de usuarios (datos de prueba)
app.get('/api/usuarios', (req, res) => {
  res.json([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@test.com', rol: 'Admin' },
    { id: 2, nombre: 'María García', email: 'maria@test.com', rol: 'Usuario' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@test.com', rol: 'Editor' }
  ]);
});

// Ruta para crear usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, email, rol } = req.body;
  
  // Validación básica
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  
  // Simular creación (en producción esto iría a la base de datos)
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    email,
    rol: rol || 'Usuario'
  };
  
  res.status(201).json(nuevoUsuario);
});

// Ruta para obtener un usuario específico
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  
  // Simular búsqueda (en producción esto iría a la base de datos)
  const usuario = {
    id: parseInt(id),
    nombre: 'Usuario ' + id,
    email: 'usuario' + id + '@test.com',
    rol: 'Usuario'
  };
  
  res.json(usuario);
});

// Ruta para actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;
  
  // Simular actualización
  const usuarioActualizado = {
    id: parseInt(id),
    nombre: nombre || 'Usuario ' + id,
    email: email || 'usuario' + id + '@test.com',
    rol: rol || 'Usuario'
  };
  
  res.json(usuarioActualizado);
});

// Ruta para eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  
  // Simular eliminación
  res.json({ message: `Usuario ${id} eliminado correctamente` });
});

// Ruta de departamentos (datos de prueba)
app.get('/api/departamentos', (req, res) => {
  res.json([
    { id: 1, nombre: 'Recursos Humanos', descripcion: 'Gestión de personal' },
    { id: 2, nombre: 'Tecnología', descripcion: 'Desarrollo y sistemas' },
    { id: 3, nombre: 'Finanzas', descripcion: 'Contabilidad y presupuesto' }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
}); 