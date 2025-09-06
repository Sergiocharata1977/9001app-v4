const mongoose = require('mongoose');

/**
 * Modelo de Proceso SGC para MongoDB
 * Sistema de Gestión de Calidad ISO 9001
 */
const procesoSchema = new mongoose.Schema({
  // Identificación básica
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `proc-${Date.now()}`
  },
  
  organization_id: {
    type: Number,
    required: true,
    index: true
  },
  
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  descripcion: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  objetivo: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  alcance: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  version: {
    type: String,
    default: '1.0',
    trim: true
  },
  
  // Clasificación SGC
  tipo: {
    type: String,
    enum: ['estrategico', 'operativo', 'apoyo', 'mejora'],
    default: 'operativo',
    required: true
  },
  
  categoria: {
    type: String,
    enum: ['proceso', 'subproceso', 'actividad'],
    default: 'proceso',
    required: true
  },
  
  nivel_critico: {
    type: String,
    enum: ['bajo', 'medio', 'alto', 'critico'],
    default: 'medio',
    required: true
  },
  
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'obsoleto', 'en_revision'],
    default: 'activo',
    required: true
  },
  
  // Responsabilidad
  responsable_id: {
    type: String,
    ref: 'Personal',
    index: true
  },
  
  departamento_id: {
    type: String,
    ref: 'Departamento',
    index: true
  },
  
  supervisor_id: {
    type: String,
    ref: 'Personal',
    index: true
  },
  
  // Alcance detallado
  entradas: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  salidas: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  proveedores: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  clientes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Recursos
  recursos_requeridos: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  competencias_requeridas: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Control y medición
  indicadores: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  metodos_seguimiento: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  criterios_control: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Información documental
  procedimientos_documentados: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  registros_requeridos: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Mejora
  riesgos_identificados: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  oportunidades_mejora: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Control de versiones
  fecha_vigencia: {
    type: Date
  },
  
  fecha_revision: {
    type: Date
  },
  
  motivo_cambio: {
    type: String,
    trim: true,
    maxlength: 300
  },
  
  // Metadatos
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  },
  
  created_by: {
    type: String,
    ref: 'User'
  },
  
  updated_by: {
    type: String,
    ref: 'User'
  },
  
  is_active: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'procesos'
});

// Índices para optimización
procesoSchema.index({ organization_id: 1, is_active: 1 });
procesoSchema.index({ codigo: 1, organization_id: 1 });
procesoSchema.index({ tipo: 1, categoria: 1 });
procesoSchema.index({ estado: 1, organization_id: 1 });
procesoSchema.index({ responsable_id: 1, organization_id: 1 });

// Middleware para actualizar updated_at
procesoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Métodos estáticos
procesoSchema.statics.findByOrganization = function(orgId) {
  return this.find({ organization_id: orgId, is_active: true });
};

procesoSchema.statics.findByTipo = function(orgId, tipo) {
  return this.find({ organization_id: orgId, tipo, is_active: true });
};

// Métodos de instancia
procesoSchema.methods.toPublicJSON = function() {
  const proceso = this.toObject();
  delete proceso.__v;
  return proceso;
};

const Proceso = mongoose.model('Proceso', procesoSchema);

module.exports = Proceso;
