import Joi from 'joi';
import { commonSchemas } from '../../shared/validators/common.validator.js';

export const departmentValidators = {
  create: Joi.object({
    name: commonSchemas.name.required().messages({
      'string.empty': 'El nombre del departamento es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
    description: Joi.string().max(500).trim().optional().messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
    code: Joi.string()
      .min(2)
      .max(10)
      .pattern(/^[A-Z0-9_-]+$/)
      .uppercase()
      .required()
      .messages({
        'string.empty': 'El código del departamento es requerido',
        'string.min': 'El código debe tener al menos 2 caracteres',
        'string.max': 'El código no puede exceder 10 caracteres',
        'string.pattern.base': 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
      }),
    managerId: commonSchemas.objectId.optional().messages({
      'string.pattern.base': 'ID de manager inválido'
    })
  }),

  update: Joi.object({
    name: commonSchemas.name.optional().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
    description: Joi.string().max(500).trim().optional().allow('').messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
    code: Joi.string()
      .min(2)
      .max(10)
      .pattern(/^[A-Z0-9_-]+$/)
      .uppercase()
      .optional()
      .messages({
        'string.min': 'El código debe tener al menos 2 caracteres',
        'string.max': 'El código no puede exceder 10 caracteres',
        'string.pattern.base': 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'
      }),
    managerId: commonSchemas.objectId.optional().allow(null).messages({
      'string.pattern.base': 'ID de manager inválido'
    })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  }),

  params: Joi.object({
    id: commonSchemas.objectId.required().messages({
      'string.pattern.base': 'ID de departamento inválido'
    })
  }),

  query: Joi.object({
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
    search: Joi.string().max(100).trim().optional().messages({
      'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
    }),
    managerId: commonSchemas.objectId.optional(),
    withManager: Joi.boolean().optional(),
    sortBy: Joi.string().valid('name', 'code', 'createdAt', 'updatedAt').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  })
};