import Joi from 'joi';

// Validación para crear departamento
export const createDepartmentSchema = Joi.object({
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
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
  
  objetivos: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los objetivos no pueden exceder 1000 caracteres'
    }),
  
  codigo: Joi.string()
    .min(2)
    .max(10)
    .optional()
    .messages({
      'string.min': 'El código debe tener al menos 2 caracteres',
      'string.max': 'El código no puede exceder 10 caracteres'
    }),
  
  responsable_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El responsable debe ser un ID válido'
    })
});

// Validación para actualizar departamento
export const updateDepartmentSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  
  descripcion: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
  
  objetivos: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Los objetivos no pueden exceder 1000 caracteres'
    }),
  
  codigo: Joi.string()
    .min(2)
    .max(10)
    .optional()
    .messages({
      'string.min': 'El código debe tener al menos 2 caracteres',
      'string.max': 'El código no puede exceder 10 caracteres'
    }),
  
  responsable_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El responsable debe ser un ID válido'
    }),
  
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
});

// Validación para parámetros de ID
export const departmentIdSchema = Joi.object({
  id: Joi.string()
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



