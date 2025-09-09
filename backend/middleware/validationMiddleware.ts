const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req: Request, res: Response, next?: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validaciones para Personal
const validatePersonal = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-ES')
    .withMessage('Debe ser un teléfono válido'),
  
  body('fecha_ingreso')
    .optional()
    .isISO8601()
    .withMessage('Debe ser una fecha válida'),
  
  body('tipo_personal')
    .optional()
    .isIn(['empleado', 'contratista', 'consultor', 'practicante'])
    .withMessage('Tipo de personal inválido'),
  
  body('puestoId')
    .optional()
    .isMongoId()
    .withMessage('ID de puesto inválido'),
  
  body('departamentoId')
    .optional()
    .isMongoId()
    .withMessage('ID de departamento inválido'),
  
  body('organization_id')
    .notEmpty()
    .withMessage('ID de organización es obligatorio')
    .isMongoId()
    .withMessage('ID de organización inválido'),
  
  handleValidationErrors
];

// Validaciones para Procesos
const validateProceso = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),
  
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  
  body('objetivo')
    .notEmpty()
    .withMessage('El objetivo es obligatorio')
    .isLength({ min: 10, max: 300 })
    .withMessage('El objetivo debe tener entre 10 y 300 caracteres'),
  
  body('version')
    .optional()
    .matches(/^\d+\.\d+$/)
    .withMessage('La versión debe tener el formato X.Y'),
  
  body('tipo')
    .optional()
    .isIn(['estrategico', 'operativo', 'apoyo', 'mejora'])
    .withMessage('Tipo de proceso inválido'),
  
  body('categoria')
    .optional()
    .isIn(['proceso', 'subproceso', 'actividad'])
    .withMessage('Categoría inválida'),
  
  body('nivel_critico')
    .optional()
    .isIn(['bajo', 'medio', 'alto', 'critico'])
    .withMessage('Nivel crítico inválido'),
  
  body('responsable_id')
    .optional()
    .isMongoId()
    .withMessage('ID de responsable inválido'),
  
  body('departamento_id')
    .optional()
    .isMongoId()
    .withMessage('ID de departamento inválido'),
  
  body('fecha_vigencia')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vigencia inválida'),
  
  body('fecha_revision')
    .optional()
    .isISO8601()
    .withMessage('Fecha de revisión inválida'),
  
  handleValidationErrors
];

// Validaciones para Indicadores
const validateIndicador = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 300 })
    .withMessage('La descripción debe tener entre 10 y 300 caracteres'),
  
  body('tipo')
    .optional()
    .isIn(['efectividad', 'eficiencia', 'satisfaccion', 'cumplimiento'])
    .withMessage('Tipo de indicador inválido'),
  
  body('unidad')
    .notEmpty()
    .withMessage('La unidad de medida es obligatoria')
    .isLength({ min: 1, max: 20 })
    .withMessage('La unidad debe tener entre 1 y 20 caracteres'),
  
  body('meta')
    .notEmpty()
    .withMessage('La meta es obligatoria')
    .isNumeric()
    .withMessage('La meta debe ser un número válido'),
  
  body('frecuencia')
    .optional()
    .isIn(['diario', 'semanal', 'mensual', 'trimestral', 'anual'])
    .withMessage('Frecuencia inválida'),
  
  body('responsable_id')
    .optional()
    .isMongoId()
    .withMessage('ID de responsable inválido'),
  
  body('proceso_id')
    .optional()
    .isMongoId()
    .withMessage('ID de proceso inválido'),
  
  body('tolerancia_inferior')
    .optional()
    .isNumeric()
    .withMessage('Tolerancia inferior debe ser un número válido'),
  
  body('tolerancia_superior')
    .optional()
    .isNumeric()
    .withMessage('Tolerancia superior debe ser un número válido'),
  
  handleValidationErrors
];

// Validaciones para Objetivos de Calidad
const validateObjetivo = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),
  
  body('nombre_objetivo')
    .notEmpty()
    .withMessage('El nombre del objetivo es obligatorio')
    .isLength({ min: 5, max: 100 })
    .withMessage('El nombre debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 10, max: 300 })
    .withMessage('La descripción debe tener entre 10 y 300 caracteres'),
  
  body('meta')
    .notEmpty()
    .withMessage('La meta es obligatoria')
    .isLength({ min: 5, max: 200 })
    .withMessage('La meta debe tener entre 5 y 200 caracteres'),
  
  body('responsable')
    .notEmpty()
    .withMessage('El responsable es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El responsable debe tener entre 2 y 50 caracteres'),
  
  body('fecha_inicio')
    .notEmpty()
    .withMessage('La fecha de inicio es obligatoria')
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),
  
  body('fecha_limite')
    .notEmpty()
    .withMessage('La fecha límite es obligatoria')
    .isISO8601()
    .withMessage('Fecha límite inválida'),
  
  body('estado')
    .optional()
    .isIn(['activo', 'en_progreso', 'completado', 'pausado', 'cancelado'])
    .withMessage('Estado inválido'),
  
  body('prioridad')
    .optional()
    .isIn(['baja', 'media', 'alta', 'critica'])
    .withMessage('Prioridad inválida'),
  
  body('tipo')
    .optional()
    .isIn(['mejora', 'prevencion', 'correccion', 'innovacion'])
    .withMessage('Tipo de objetivo inválido'),
  
  body('proceso_id')
    .optional()
    .isMongoId()
    .withMessage('ID de proceso inválido'),
  
  handleValidationErrors
];

// Validaciones para Mediciones
const validateMedicion = [
  body('indicador_id')
    .notEmpty()
    .withMessage('El indicador es obligatorio')
    .isMongoId()
    .withMessage('ID de indicador inválido'),
  
  body('valor')
    .notEmpty()
    .withMessage('El valor es obligatorio')
    .isNumeric()
    .withMessage('El valor debe ser un número válido'),
  
  body('fecha_medicion')
    .notEmpty()
    .withMessage('La fecha de medición es obligatoria')
    .isISO8601()
    .withMessage('Fecha de medición inválida'),
  
  body('responsable_id')
    .notEmpty()
    .withMessage('El responsable es obligatorio')
    .isMongoId()
    .withMessage('ID de responsable inválido'),
  
  body('estado')
    .optional()
    .isIn(['completada', 'pendiente', 'rechazada'])
    .withMessage('Estado inválido'),
  
  body('confiabilidad')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('Confiabilidad inválida'),
  
  body('metodo_medicion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('El método de medición no puede exceder 500 caracteres'),
  
  body('fuente_datos')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La fuente de datos no puede exceder 500 caracteres'),
  
  body('observaciones')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  
  handleValidationErrors
];

// Validación personalizada para fechas
const validateDateRange = (startDateField, endDateField) => {
  return (req: Request, res: Response, next?: NextFunction): void => {
    const startDate = req.body[startDateField];
    const endDate = req.body[endDateField];
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: [{
            field: endDateField,
            message: `La fecha ${endDateField} debe ser posterior a ${startDateField}`,
            value: endDate
          }]
        });
      }
    }
    
    next();
  };
};

export default {
  validatePersonal,
  validateProceso,
  validateIndicador,
  validateObjetivo,
  validateMedicion,
  validateDateRange,
  handleValidationErrors
};
