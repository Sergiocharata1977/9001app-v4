const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta para obtener el documento de coordinación
router.get('/coordinacion-document', (req, res) => {
  try {
    // Ruta al documento de coordinación
    const documentPath = path.join(__dirname, '..', '..', 'COORDINACION-AGENTES.md');
    
    // Verificar si el archivo existe
    if (!fs.existsSync(documentPath)) {
      return res.status(404).json({
        error: 'Documento de coordinación no encontrado',
        message: 'El archivo COORDINACION-AGENTES.md no existe'
      });
    }
    
    // Leer el contenido del archivo
    const content = fs.readFileSync(documentPath, 'utf8');
    
    // Configurar headers para texto plano
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Enviar el contenido
    res.send(content);
    
  } catch (error) {
    console.error('Error al leer documento de coordinación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo leer el documento de coordinación'
    });
  }
});

// Ruta para actualizar el documento (solo para desarrollo)
router.post('/coordinacion-document', (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        error: 'Contenido requerido',
        message: 'El campo content es obligatorio'
      });
    }
    
    // Ruta al documento de coordinación
    const documentPath = path.join(__dirname, '..', '..', 'COORDINACION-AGENTES.md');
    
    // Escribir el contenido al archivo
    fs.writeFileSync(documentPath, content, 'utf8');
    
    res.json({
      success: true,
      message: 'Documento de coordinación actualizado correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error al actualizar documento de coordinación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el documento de coordinación'
    });
  }
});

// Ruta para obtener el estado del documento
router.get('/coordinacion-status', (req, res) => {
  try {
    const documentPath = path.join(__dirname, '..', '..', 'COORDINACION-AGENTES.md');
    
    if (!fs.existsSync(documentPath)) {
      return res.json({
        exists: false,
        lastModified: null,
        size: 0
      });
    }
    
    const stats = fs.statSync(documentPath);
    
    res.json({
      exists: true,
      lastModified: stats.mtime.toISOString(),
      size: stats.size,
      path: documentPath
    });
    
  } catch (error) {
    console.error('Error al obtener estado del documento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el estado del documento'
    });
  }
});

module.exports = router;
