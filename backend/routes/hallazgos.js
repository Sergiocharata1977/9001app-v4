const express = require('express');
const router = express.Router();

// Datos de ejemplo para hallazgos
const mockHallazgos = [
  {
    id: 'hall_001',
    numeroHallazgo: 'HAL-2024-001',
    titulo: 'Documentación incompleta en proceso de auditoría',
    descripcion: 'Se encontró que la documentación del proceso de auditoría interna no está completa según los requisitos de la norma ISO 9001.',
    estado: 'deteccion',
    fecha_deteccion: '2024-01-15T10:30:00Z',
    responsable: 'María Elena González',
    departamento: 'Calidad',
    severidad: 'media',
    tipo: 'hallazgo'
  },
  {
    id: 'hall_002',
    numeroHallazgo: 'HAL-2024-002',
    titulo: 'Falta de capacitación en nuevos procedimientos',
    descripcion: 'El personal del departamento de producción no ha recibido la capacitación necesaria sobre los nuevos procedimientos implementados.',
    estado: 'planificacion_ai',
    fecha_deteccion: '2024-01-20T14:15:00Z',
    responsable: 'Roberto David Ramirez',
    departamento: 'Producción',
    severidad: 'alta',
    tipo: 'hallazgo'
  },
  {
    id: 'hall_003',
    numeroHallazgo: 'HAL-2024-003',
    titulo: 'Indicadores de calidad no actualizados',
    descripcion: 'Los indicadores de calidad del último trimestre no han sido actualizados en el sistema de gestión.',
    estado: 'ejecucion_ai',
    fecha_deteccion: '2024-01-25T09:45:00Z',
    responsable: 'Javier Antonio Ramirez',
    departamento: 'Calidad',
    severidad: 'baja',
    tipo: 'hallazgo'
  },
  {
    id: 'hall_004',
    numeroHallazgo: 'HAL-2024-004',
    titulo: 'Equipos de medición sin calibración',
    descripcion: 'Se detectó que varios equipos de medición utilizados en el control de calidad no tienen calibración vigente.',
    estado: 'verificacion_cierre',
    fecha_deteccion: '2024-01-30T16:20:00Z',
    responsable: 'Sergio De Filippi',
    departamento: 'Laboratorio',
    severidad: 'alta',
    tipo: 'hallazgo'
  }
];

// GET - Obtener todos los hallazgos
router.get('/', (req, res) => {
  try {
    console.log('📋 [HallazgosService] Obteniendo todos los hallazgos');
    console.log('📋 [HallazgosService] Cantidad de hallazgos:', mockHallazgos.length);
    
    res.json(mockHallazgos);
  } catch (error) {
    console.error('Error al obtener hallazgos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al obtener hallazgos' 
    });
  }
});

// GET - Obtener un hallazgo específico
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const hallazgo = mockHallazgos.find(h => h.id === id);
    
    if (!hallazgo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hallazgo no encontrado' 
      });
    }
    
    res.json(hallazgo);
  } catch (error) {
    console.error('Error al obtener hallazgo específico:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// POST - Crear nuevo hallazgo
router.post('/', (req, res) => {
  try {
    const newHallazgo = {
      id: `hall_${Date.now()}`,
      numeroHallazgo: `HAL-2024-${String(mockHallazgos.length + 1).padStart(3, '0')}`,
      ...req.body,
      fecha_deteccion: req.body.fecha_deteccion || new Date().toISOString(),
      tipo: 'hallazgo'
    };
    
    mockHallazgos.push(newHallazgo);
    
    res.status(201).json({
      success: true,
      message: 'Hallazgo creado exitosamente',
      data: newHallazgo
    });
  } catch (error) {
    console.error('Error al crear hallazgo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al crear hallazgo' 
    });
  }
});

// PUT - Actualizar hallazgo
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const hallazgoIndex = mockHallazgos.findIndex(h => h.id === id);
    
    if (hallazgoIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hallazgo no encontrado' 
      });
    }
    
    mockHallazgos[hallazgoIndex] = {
      ...mockHallazgos[hallazgoIndex],
      ...req.body,
      id // Mantener el ID original
    };
    
    res.json({
      success: true,
      message: 'Hallazgo actualizado exitosamente',
      data: mockHallazgos[hallazgoIndex]
    });
  } catch (error) {
    console.error('Error al actualizar hallazgo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al actualizar hallazgo' 
    });
  }
});

// PUT - Actualizar estado de hallazgo
router.put('/mejoras/:id/estado', (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const hallazgoIndex = mockHallazgos.findIndex(h => h.id === id);
    
    if (hallazgoIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hallazgo no encontrado' 
      });
    }
    
    mockHallazgos[hallazgoIndex].estado = estado;
    
    res.json({
      success: true,
      message: 'Estado del hallazgo actualizado exitosamente',
      data: mockHallazgos[hallazgoIndex]
    });
  } catch (error) {
    console.error('Error al actualizar estado del hallazgo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al actualizar estado' 
    });
  }
});

// DELETE - Eliminar hallazgo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const hallazgoIndex = mockHallazgos.findIndex(h => h.id === id);
    
    if (hallazgoIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hallazgo no encontrado' 
      });
    }
    
    const deletedHallazgo = mockHallazgos.splice(hallazgoIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Hallazgo eliminado exitosamente',
      data: deletedHallazgo
    });
  } catch (error) {
    console.error('Error al eliminar hallazgo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor al eliminar hallazgo' 
    });
  }
});

// GET - Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hallazgos service running',
    timestamp: new Date().toISOString(),
    count: mockHallazgos.length
  });
});

module.exports = router; 