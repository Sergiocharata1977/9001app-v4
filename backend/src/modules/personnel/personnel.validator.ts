import Joi from 'joi';
import { commonSchemas } from '../../shared/validators/common.validator.js';

export const personnelValidators = {
  create: Joi.object({
    employeeId: Joi.string()
      .min(2)
      .max(20)
      .pattern(/^[A-Z0-9_-]+$/)
      .uppercase()
      .required()
      .messages({
        'string.empty': 'El ID del empleado es requerido',
        'string.min': 'El ID debe tener al menos 2 caracteres',
        'string.max': 'El ID no puede exceder 20 caracteres',
        'string.pattern.base': 'El ID solo puede contener letras mayúsculas, números, guiones y guiones bajos'
      }),
    firstName: commonSchemas.name.required().messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres'
    }),
    lastName: commonSchemas.name.required().messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres'
    }),
    email: commonSchemas.email.required().messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido'
    }),
    phone: Joi.string().max(20).trim().optional().messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
    documentType: Joi.string()
      .valid('dni', 'passport', 'other')
      .required()
      .messages({
        'string.empty': 'El tipo de documento es requerido',
        'any.only': 'El tipo de documento debe ser: dni, passport u other'
      }),
    documentNumber: Joi.string()
      .min(5)
      .max(20)
      .required()
      .messages({
        'string.empty': 'El número de documento es requerido',
        'string.min': 'El número de documento debe tener al menos 5 caracteres',
        'string.max': 'El número de documento no puede exceder 20 caracteres'
      }),
    birthDate: Joi.date().optional().messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida'
    }),
    hireDate: Joi.date().required().messages({
      'date.base': 'La fecha de contratación debe ser una fecha válida',
      'any.required': 'La fecha de contratación es requerida'
    }),
    departmentId: commonSchemas.objectId.required().messages({
      'string.empty': 'El departamento es requerido',
      'string.pattern.base': 'ID de departamento inválido'
    }),
    positionId: commonSchemas.objectId.required().messages({
      'string.empty': 'El puesto es requerido',
      'string.pattern.base': 'ID de puesto inválido'
    }),
    managerId: commonSchemas.objectId.optional().messages({
      'string.pattern.base': 'ID de manager inválido'
    }),
    salary: Joi.number().min(0).optional().messages({
      'number.min': 'El salario no puede ser negativo'
    }),
    address: Joi.object({
      street: Joi.string().max(100).trim().optional(),
      city: Joi.string().max(50).trim().optional(),
      state: Joi.string().max(50).trim().optional(),
      zipCode: Joi.string().max(10).trim().optional(),
      country: Joi.string().max(50).trim().optional()
    }).optional(),
    emergencyContact: Joi.object({
      name: Joi.string().max(100).trim().required(),
      relationship: Joi.string().max(50).trim().required(),
      phone: Joi.string().max(20).trim().required()
    }).optional()
  }),

  update: Joi.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    email: commonSchemas.email.optional(),
    phone: Joi.string().max(20).trim().optional().allow(''),
    departmentId: commonSchemas.objectId.optional(),
    positionId: commonSchemas.objectId.optional(),
    managerId: commonSchemas.objectId.optional().allow(null),
    salary: Joi.number().min(0).optional(),
    status: Joi.string()
      .valid('active', 'inactive', 'suspended', 'terminated')
      .optional(),
    address: Joi.object({
      street: Joi.string().max(100).trim().optional().allow(''),
      city: Joi.string().max(50).trim().optional().allow(''),
      state: Joi.string().max(50).trim().optional().allow(''),
      zipCode: Joi.string().max(10).trim().optional().allow(''),
      country: Joi.string().max(50).trim().optional().allow('')
    }).optional(),
    emergencyContact: Joi.object({
      name: Joi.string().max(100).trim().optional(),
      relationship: Joi.string().max(50).trim().optional(),
      phone: Joi.string().max(20).trim().optional()
    }).optional()
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  }),

  params: Joi.object({
    id: commonSchemas.objectId.required().messages({
      'string.pattern.base': 'ID de empleado inválido'
    })
  }),

  query: Joi.object({
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
    search: Joi.string().max(100).trim().optional(),
    departmentId: commonSchemas.objectId.optional(),
    positionId: commonSchemas.objectId.optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'terminated').optional(),
    sortBy: Joi.string().valid('firstName', 'lastName', 'email', 'hireDate', 'createdAt').default('lastName'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  })
};