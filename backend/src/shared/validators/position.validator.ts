import Joi from 'joi';

// Validación para crear puesto
export const createPositionSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  
  descripcion: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El departamento debe ser un ID válido'
    }),
  
  requisitos_experiencia: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los requisitos de experiencia no pueden exceder 1000 caracteres'
    }),
  
  requisitos_formacion: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los requisitos de formación no pueden exceder 1000 caracteres'
    })
});

// Validación para actualizar puesto
export const updatePositionSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  
  descripcion: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El departamento debe ser un ID válido'
    }),
  
  requisitos_experiencia: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los requisitos de experiencia no pueden exceder 1000 caracteres'
    }),
  
  requisitos_formacion: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los requisitos de formación no pueden exceder 1000 caracteres'
    }),
  
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
});

// Validación para parámetros de ID
export const positionIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del puesto es obligatorio',
      'string.base': 'El ID debe ser una cadena válida'
    })
});

// Validación para parámetros de departamento
export const departmentIdSchema = Joi.object({
  departamento_id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del departamento es obligatorio',
      'string.base': 'El ID debe ser una cadena válida'
    })
});

// Middleware de validación
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Middleware de validación de parámetros
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};



