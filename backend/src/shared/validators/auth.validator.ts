import Joi from 'joi';

// Validación para registro de usuario
export const registerSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  
  apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres',
      'any.required': 'El apellido es obligatorio'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es obligatorio'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'any.required': 'La contraseña es obligatoria'
    }),
  
  telefono: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'El teléfono debe tener un formato válido'
    }),
  
  organization_id: Joi.string()
    .required()
    .messages({
      'any.required': 'La organización es obligatoria'
    })
});

// Validación para login
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es obligatorio'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es obligatoria'
    })
});

// Validación para refresh token
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'El refresh token es obligatorio'
    })
});

// Validación para cambio de contraseña
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña actual es obligatoria'
    }),
  
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
      'string.max': 'La nueva contraseña no puede exceder 128 caracteres',
      'any.required': 'La nueva contraseña es obligatoria'
    })
});

// Validación para actualizar perfil
export const updateProfileSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres'
    }),
  
  apellido: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres'
    }),
  
  telefono: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'El teléfono debe tener un formato válido'
    }),
  
  configuracion: Joi.object({
    tema: Joi.string()
      .valid('light', 'dark')
      .optional(),
    idioma: Joi.string()
      .optional(),
    notificaciones: Joi.boolean()
      .optional()
  }).optional()
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



