import Joi from 'joi';

// Validación para crear personal
export const createPersonnelSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  
  apellido: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'El email debe tener un formato válido'
    }),
  
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  
  documento_identidad: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El documento de identidad no puede exceder 20 caracteres'
    }),
  
  dni: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El DNI no puede exceder 20 caracteres'
    }),
  
  numero_legajo: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El número de legajo no puede exceder 20 caracteres'
    }),
  
  fecha_nacimiento: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida'
    }),
  
  fecha_ingreso: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de ingreso debe ser una fecha válida'
    }),
  
  fecha_contratacion: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de contratación debe ser una fecha válida'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El departamento debe ser un ID válido'
    }),
  
  puesto_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El puesto debe ser un ID válido'
    }),
  
  departamento: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El departamento no puede exceder 100 caracteres'
    }),
  
  puesto: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El puesto no puede exceder 100 caracteres'
    }),
  
  estado: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El estado no puede exceder 50 caracteres'
    })
});

// Validación para actualizar personal
export const updatePersonnelSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  
  apellido: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .allow('')
    .messages({
      'string.email': 'El email debe tener un formato válido'
    }),
  
  telefono: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  
  documento_identidad: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El documento de identidad no puede exceder 20 caracteres'
    }),
  
  dni: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El DNI no puede exceder 20 caracteres'
    }),
  
  numero_legajo: Joi.string()
    .max(20)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El número de legajo no puede exceder 20 caracteres'
    }),
  
  fecha_nacimiento: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida'
    }),
  
  fecha_ingreso: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de ingreso debe ser una fecha válida'
    }),
  
  fecha_contratacion: Joi.date()
    .optional()
    .messages({
      'date.base': 'La fecha de contratación debe ser una fecha válida'
    }),
  
  departamento_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El departamento debe ser un ID válido'
    }),
  
  puesto_id: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'El puesto debe ser un ID válido'
    }),
  
  departamento: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El departamento no puede exceder 100 caracteres'
    }),
  
  puesto: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El puesto no puede exceder 100 caracteres'
    }),
  
  estado: Joi.string()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'El estado no puede exceder 50 caracteres'
    }),
  
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El estado activo debe ser verdadero o falso'
    })
});

// Validación para parámetros de ID
export const personnelIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del personal es obligatorio',
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

// Validación para parámetros de puesto
export const positionIdSchema = Joi.object({
  puesto_id: Joi.string()
    .required()
    .messages({
      'any.required': 'El ID del puesto es obligatorio',
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



