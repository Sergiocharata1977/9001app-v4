import Joi from 'joi';
import { commonSchemas } from '../../shared/validators/common.validator.js';

export const positionValidators = {
  create: Joi.object({
    name: commonSchemas.name.required().messages({
      'string.empty': 'El nombre del puesto es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
    description: Joi.string().max(1000).trim().optional().messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
    code: Joi.string()
      .min(2)
      .max(15)
      .pattern(/^[A-Z0-9_-]+$/)
      .uppercase()
      .required()
      .messages({
        'string.empty': 'El código del puesto es requerido',
        'string.min': 'El código debe tener al menos 2 caracteres',
        'string.max': 'El código no puede exceder 15 caracteres',
        'string.pattern.base': 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
      }),
    departmentId: commonSchemas.objectId.required().messages({
      'string.empty': 'El departamento es requerido',
      'string.pattern.base': 'ID de departamento inválido'
    }),
    level: Joi.string()
      .valid('junior', 'senior', 'manager', 'director')
      .required()
      .messages({
        'string.empty': 'El nivel del puesto es requerido',
        'any.only': 'El nivel debe ser: junior, senior, manager o director'
      }),
    requirements: Joi.array()
      .items(
        Joi.string().max(200).trim().messages({
          'string.max': 'Cada requisito no puede exceder 200 caracteres'
        })
      )
      .max(10)
      .optional()
      .messages({
        'array.max': 'No se pueden agregar más de 10 requisitos'
      }),
    responsibilities: Joi.array()
      .items(
        Joi.string().max(200).trim().messages({
          'string.max': 'Cada responsabilidad no puede exceder 200 caracteres'
        })
      )
      .max(15)
      .optional()
      .messages({
        'array.max': 'No se pueden agregar más de 15 responsabilidades'
      })
  }),

  update: Joi.object({
    name: commonSchemas.name.optional().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
    description: Joi.string().max(1000).trim().optional().allow('').messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),
    code: Joi.string()
      .min(2)
      .max(15)
      .pattern(/^[A-Z0-9_-]+$/)
      .uppercase()
      .optional()
      .messages({
        'string.min': 'El código debe tener al menos 2 caracteres',
        'string.max': 'El código no puede exceder 15 caracteres',
        'string.pattern.base': 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
      }),
    departmentId: commonSchemas.objectId.optional().messages({
      'string.pattern.base': 'ID de departamento inválido'
    }),
    level: Joi.string()
      .valid('junior', 'senior', 'manager', 'director')
      .optional()
      .messages({
        'any.only': 'El nivel debe ser: junior, senior, manager o director'
      }),
    requirements: Joi.array()
      .items(
        Joi.string().max(200).trim().messages({
          'string.max': 'Cada requisito no puede exceder 200 caracteres'
        })
      )
      .max(10)
      .optional()
      .messages({
        'array.max': 'No se pueden agregar más de 10 requisitos'
      }),
    responsibilities: Joi.array()
      .items(
        Joi.string().max(200).trim().messages({
          'string.max': 'Cada responsabilidad no puede exceder 200 caracteres'
        })
      )
      .max(15)
      .optional()
      .messages({
        'array.max': 'No se pueden agregar más de 15 responsabilidades'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  }),

  params: Joi.object({
    id: commonSchemas.objectId.required().messages({
      'string.pattern.base': 'ID de puesto inválido'
    })
  }),

  query: Joi.object({
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
    search: Joi.string().max(100).trim().optional().messages({
      'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
    }),
    departmentId: commonSchemas.objectId.optional(),
    level: Joi.string().valid('junior', 'senior', 'manager', 'director').optional(),
    sortBy: Joi.string().valid('name', 'code', 'level', 'createdAt', 'updatedAt').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  })
};