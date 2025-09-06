const Joi = require('joi');

/**
 * Validador Joi para Procesos SGC
 * Sistema de Gestión de Calidad ISO 9001
 */

// Esquemas de validación
const procesoSchema = Joi.object({
  // Información básica
  nombre: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'El nombre del proceso es obligatorio',
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 200 caracteres'
    }),
  
  codigo: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[A-Z0-9\-_]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'El código solo puede contener mayúsculas, números, guiones y guiones bajos',
      'string.min': 'El código debe tener al menos 3 caracteres',
      'string.max': 'El código no puede exceder 20 caracteres'
    }),
  
  descripcion: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  
  objetivo: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El objetivo no puede exceder 500 caracteres'
    }),
  
  alcance: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El alcance no puede exceder 500 caracteres'
    }),
  
  version: Joi.string()
    .pattern(/^\d+\.\d+$/)
    .default('1.0')
    .optional()
    .messages({
      'string.pattern.base': 'La versión debe tener el formato X.Y (ej: 1.0)'
    }),
  
  // Clasificación SGC
  tipo: Joi.string()
    .valid('estrategico', 'operativo', 'apoyo', 'mejora')
    .default('operativo')
    .optional()
    .messages({
      'any.only': 'El tipo debe ser: estratégico, operativo, apoyo o mejora'
    }),
  
  categoria: Joi.string()
    .valid('proceso', 'subproceso', 'actividad')
    .default('proceso')
    .optional()
    .messages({
      'any.only': 'La categoría debe ser: proceso, subproceso o actividad'
    }),
  
  nivel_critico: Joi.string()
    .valid('bajo', 'medio', 'alto', 'critico')
    .default('medio')
    .optional()
    .messages({
      'any.only': 'El nivel crítico debe ser: bajo, medio, alto o crítico'
    }),
  
  estado: Joi.string()
    .valid('activo', 'inactivo', 'obsoleto', 'en_revision')
    .default('activo')
    .optional()
    .messages({
      'any.only': 'El estado debe ser: activo, inactivo, obsoleto o en revisión'
    }),
  
  // Responsabilidad
  responsable_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'El responsable no puede estar vacío'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'El departamento no puede estar vacío'
    }),
  
  supervisor_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'El supervisor no puede estar vacío'
    }),
  
  // Alcance detallado
  entradas: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Las entradas no pueden exceder 500 caracteres'
    }),
  
  salidas: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Las salidas no pueden exceder 500 caracteres'
    }),
  
  proveedores: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los proveedores no pueden exceder 500 caracteres'
    }),
  
  clientes: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los clientes no pueden exceder 500 caracteres'
    }),
  
  // Recursos
  recursos_requeridos: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los recursos requeridos no pueden exceder 500 caracteres'
    }),
  
  competencias_requeridas: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Las competencias requeridas no pueden exceder 500 caracteres'
    }),
  
  // Control y medición
  indicadores: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los indicadores no pueden exceder 500 caracteres'
    }),
  
  metodos_seguimiento: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los métodos de seguimiento no pueden exceder 500 caracteres'
    }),
  
  criterios_control: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los criterios de control no pueden exceder 500 caracteres'
    }),
  
  // Información documental
  procedimientos_documentados: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los procedimientos documentados no pueden exceder 500 caracteres'
    }),
  
  registros_requeridos: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los registros requeridos no pueden exceder 500 caracteres'
    }),
  
  // Mejora
  riesgos_identificados: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los riesgos identificados no pueden exceder 500 caracteres'
    }),
  
  oportunidades_mejora: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Las oportunidades de mejora no pueden exceder 500 caracteres'
    }),
  
  // Control de versiones
  fecha_vigencia: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha de vigencia debe tener formato ISO válido'
    }),
  
  fecha_revision: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha de revisión debe tener formato ISO válido'
    }),
  
  motivo_cambio: Joi.string()
    .max(300)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El motivo del cambio no puede exceder 300 caracteres'
    })
});

// Esquema para actualización (campos opcionales)
const procesoUpdateSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 200 caracteres'
    }),
  
  codigo: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[A-Z0-9\-_]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'El código solo puede contener mayúsculas, números, guiones y guiones bajos',
      'string.min': 'El código debe tener al menos 3 caracteres',
      'string.max': 'El código no puede exceder 20 caracteres'
    }),
  
  // Resto de campos opcionales para actualización
  descripcion: procesoSchema.extract('descripcion'),
  objetivo: procesoSchema.extract('objetivo'),
  alcance: procesoSchema.extract('alcance'),
  version: procesoSchema.extract('version'),
  tipo: procesoSchema.extract('tipo'),
  categoria: procesoSchema.extract('categoria'),
  nivel_critico: procesoSchema.extract('nivel_critico'),
  estado: procesoSchema.extract('estado'),
  responsable_id: procesoSchema.extract('responsable_id'),
  departamento_id: procesoSchema.extract('departamento_id'),
  supervisor_id: procesoSchema.extract('supervisor_id'),
  entradas: procesoSchema.extract('entradas'),
  salidas: procesoSchema.extract('salidas'),
  proveedores: procesoSchema.extract('proveedores'),
  clientes: procesoSchema.extract('clientes'),
  recursos_requeridos: procesoSchema.extract('recursos_requeridos'),
  competencias_requeridas: procesoSchema.extract('competencias_requeridas'),
  indicadores: procesoSchema.extract('indicadores'),
  metodos_seguimiento: procesoSchema.extract('metodos_seguimiento'),
  criterios_control: procesoSchema.extract('criterios_control'),
  procedimientos_documentados: procesoSchema.extract('procedimientos_documentados'),
  registros_requeridos: procesoSchema.extract('registros_requeridos'),
  riesgos_identificados: procesoSchema.extract('riesgos_identificados'),
  oportunidades_mejora: procesoSchema.extract('oportunidades_mejora'),
  fecha_vigencia: procesoSchema.extract('fecha_vigencia'),
  fecha_revision: procesoSchema.extract('fecha_revision'),
  motivo_cambio: procesoSchema.extract('motivo_cambio')
});

// Esquema para filtros de búsqueda
const procesoFiltrosSchema = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
    }),
  
  tipo: Joi.string()
    .valid('estrategico', 'operativo', 'apoyo', 'mejora')
    .optional()
    .messages({
      'any.only': 'El tipo de filtro debe ser: estratégico, operativo, apoyo o mejora'
    }),
  
  categoria: Joi.string()
    .valid('proceso', 'subproceso', 'actividad')
    .optional()
    .messages({
      'any.only': 'La categoría de filtro debe ser: proceso, subproceso o actividad'
    }),
  
  estado: Joi.string()
    .valid('activo', 'inactivo', 'obsoleto', 'en_revision')
    .optional()
    .messages({
      'any.only': 'El estado de filtro debe ser: activo, inactivo, obsoleto o en revisión'
    }),
  
  nivel_critico: Joi.string()
    .valid('bajo', 'medio', 'alto', 'critico')
    .optional()
    .messages({
      'any.only': 'El nivel crítico de filtro debe ser: bajo, medio, alto o crítico'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'El ID del departamento no puede estar vacío'
    }),
  
  responsable_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.empty': 'El ID del responsable no puede estar vacío'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional()
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite mínimo es 1',
      'number.max': 'El límite máximo es 100'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional()
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página mínima es 1'
    })
});

// Funciones de validación
const validateProceso = (data, isUpdate = false) => {
  const schema = isUpdate ? procesoUpdateSchema : procesoSchema;
  return schema.validate(data, { 
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

const validateProcesoFiltros = (data) => {
  return procesoFiltrosSchema.validate(data, { 
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

// Validación de ID de proceso
const validateProcesoId = (id) => {
  const schema = Joi.string()
    .min(1)
    .max(50)
    .required();
  
  return schema.validate(id);
};

module.exports = {
  validateProceso,
  validateProcesoFiltros,
  validateProcesoId,
  procesoSchema,
  procesoUpdateSchema,
  procesoFiltrosSchema
};
