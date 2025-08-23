import { z } from 'zod';

// Esquema base para capacitación
export const capacitacionBaseSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  
  tipo: z.enum(['obligatoria', 'recomendada', 'opcional', 'certificacion'], {
    errorMap: () => ({ message: 'El tipo debe ser obligatoria, recomendada, opcional o certificación' })
  }),
  
  fecha_inicio: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La fecha de inicio debe ser hoy o en el futuro'),
  
  fecha_fin: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La fecha de fin debe ser hoy o en el futuro')
    .optional(),
  
  hora_inicio: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  
  hora_fin: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  
  duracion_horas: z.number()
    .min(0.5, 'La duración debe ser al menos 0.5 horas')
    .max(480, 'La duración no puede exceder 480 horas (60 días)'),
  
  ubicacion: z.string()
    .max(200, 'La ubicación no puede exceder 200 caracteres')
    .optional(),
  
  instructor: z.string()
    .min(2, 'El instructor debe tener al menos 2 caracteres')
    .max(100, 'El instructor no puede exceder 100 caracteres'),
  
  instructor_id: z.number()
    .positive('Debe seleccionar un instructor válido')
    .optional(),
  
  departamento_id: z.number()
    .positive('Debe seleccionar un departamento válido')
    .optional(),
  
  cupo_maximo: z.number()
    .min(1, 'El cupo máximo debe ser al menos 1')
    .max(1000, 'El cupo máximo no puede exceder 1000')
    .optional(),
  
  cupo_minimo: z.number()
    .min(1, 'El cupo mínimo debe ser al menos 1')
    .max(100, 'El cupo mínimo no puede exceder 100')
    .optional(),
  
  costo: z.number()
    .min(0, 'El costo no puede ser negativo')
    .optional(),
  
  moneda: z.enum(['USD', 'EUR', 'PEN'], {
    errorMap: () => ({ message: 'La moneda debe ser USD, EUR o PEN' })
  }).default('PEN'),
  
  modalidad: z.enum(['presencial', 'virtual', 'hibrida'], {
    errorMap: () => ({ message: 'La modalidad debe ser presencial, virtual o híbrida' })
  }).default('presencial'),
  
  plataforma_virtual: z.string()
    .max(100, 'La plataforma virtual no puede exceder 100 caracteres')
    .optional(),
  
  link_virtual: z.string()
    .url('Debe ser una URL válida')
    .optional(),
  
  materiales_requeridos: z.array(z.string())
    .optional(),
  
  prerequisitos: z.array(z.string())
    .optional(),
  
  objetivos: z.array(z.string())
    .min(1, 'Debe especificar al menos un objetivo')
    .max(20, 'No puede exceder 20 objetivos'),
  
  contenido: z.array(z.object({
    tema: z.string().min(1, 'El tema no puede estar vacío'),
    descripcion: z.string().min(1, 'La descripción no puede estar vacía'),
    duracion: z.number().min(0.1, 'La duración debe ser al menos 0.1 horas'),
    recursos: z.array(z.string()).optional()
  }))
  .min(1, 'Debe especificar al menos un contenido')
  .max(50, 'No puede exceder 50 contenidos'),
  
  metodologia: z.string()
    .min(10, 'La metodología debe tener al menos 10 caracteres')
    .max(500, 'La metodología no puede exceder 500 caracteres')
    .optional(),
  
  criterios_evaluacion: z.array(z.string())
    .optional(),
  
  certificado: z.boolean().default(false),
  
  nombre_certificado: z.string()
    .max(200, 'El nombre del certificado no puede exceder 200 caracteres')
    .optional(),
  
  validez_certificado_meses: z.number()
    .min(0, 'La validez no puede ser negativa')
    .max(120, 'La validez no puede exceder 120 meses')
    .optional(),
  
  observaciones: z.string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional(),
  
  estado: z.enum(['programada', 'en_progreso', 'completada', 'cancelada', 'evaluacion_pendiente'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }).default('programada'),
  
  activo: z.boolean().default(true),
  
  creado_por: z.number()
    .positive('ID de usuario válido requerido'),
  
  actualizado_por: z.number()
    .positive('ID de usuario válido requerido')
    .optional(),
  
  fecha_creacion: z.string().optional(),
  fecha_actualizacion: z.string().optional(),
  
  // Campos específicos del sistema SGC
  proceso_sgc_id: z.number()
    .positive('Debe seleccionar un proceso SGC válido')
    .optional(),
  
  norma_id: z.number()
    .positive('Debe seleccionar una norma válida')
    .optional(),
  
  requisito_norma: z.string()
    .max(500, 'El requisito de la norma no puede exceder 500 caracteres')
    .optional(),
  
  competencia_id: z.number()
    .positive('Debe seleccionar una competencia válida')
    .optional(),
  
  nivel_competencia: z.enum(['basico', 'intermedio', 'avanzado'], {
    errorMap: () => ({ message: 'El nivel debe ser básico, intermedio o avanzado' })
  }).optional(),
  
  evaluacion_requerida: z.boolean().default(true),
  
  tipo_evaluacion: z.enum(['teorica', 'practica', 'mixta'], {
    errorMap: () => ({ message: 'El tipo de evaluación debe ser teórica, práctica o mixta' })
  }).default('mixta'),
  
  puntuacion_minima: z.number()
    .min(0, 'La puntuación mínima no puede ser negativa')
    .max(100, 'La puntuación mínima no puede exceder 100')
    .default(70),
  
  intentos_maximos: z.number()
    .min(1, 'Los intentos máximos deben ser al menos 1')
    .max(10, 'Los intentos máximos no pueden exceder 10')
    .default(3),
  
  seguimiento_requerido: z.boolean().default(false),
  
  frecuencia_seguimiento: z.enum(['semanal', 'mensual', 'trimestral', 'semestral', 'anual'])
    .optional(),
  
  recordatorio_dias_antes: z.number()
    .min(0, 'Los días de recordatorio no pueden ser negativos')
    .max(30, 'Los días de recordatorio no pueden exceder 30')
    .default(3),
  
  participantes: z.array(z.number())
    .optional(),
  
  participantes_confirmados: z.array(z.number())
    .optional(),
  
  participantes_asistieron: z.array(z.number())
    .optional(),
  
  participantes_evaluaron: z.array(z.number())
    .optional(),
  
  promedio_evaluacion: z.number()
    .min(0, 'El promedio no puede ser negativo')
    .max(100, 'El promedio no puede exceder 100')
    .optional(),
  
  feedback_general: z.string()
    .max(2000, 'El feedback general no puede exceder 2000 caracteres')
    .optional(),
  
  mejoras_sugeridas: z.array(z.string())
    .optional(),
  
  recursos_adicionales: z.array(z.object({
    tipo: z.enum(['documento', 'video', 'link', 'presentacion']),
    nombre: z.string(),
    url: z.string().url().optional(),
    descripcion: z.string().optional()
  }))
  .optional(),
  
  version: z.number()
    .positive('La versión debe ser un número positivo')
    .default(1),
  
  estado_workflow: z.enum(['borrador', 'revision', 'aprobada', 'en_ejecucion', 'completada', 'cancelada'], {
    errorMap: () => ({ message: 'Estado de workflow inválido' })
  }).default('borrador'),
  
  flujo_aprobacion: z.array(z.object({
    nivel: z.number(),
    rol: z.string(),
    usuario_id: z.number().optional(),
    estado: z.enum(['pendiente', 'aprobado', 'rechazado']),
    fecha: z.string().optional(),
    comentarios: z.string().optional()
  }))
  .optional(),
  
  historial_cambios: z.array(z.object({
    campo: z.string(),
    valor_anterior: z.string(),
    valor_nuevo: z.string(),
    usuario: z.string(),
    fecha: z.string()
  }))
  .optional()
});

// Esquema para crear capacitación
export const createCapacitacionSchema = capacitacionBaseSchema.omit({
  fecha_creacion: true,
  fecha_actualizacion: true,
  actualizado_por: true,
  historial_cambios: true,
  participantes: true,
  participantes_confirmados: true,
  participantes_asistieron: true,
  participantes_evaluaron: true,
  promedio_evaluacion: true
});

// Esquema para actualizar capacitación
export const updateCapacitacionSchema = capacitacionBaseSchema.partial().omit({
  fecha_creacion: true,
  historial_cambios: true
});

// Esquema para filtros de capacitación
export const capacitacionFiltersSchema = z.object({
  search: z.string().optional(),
  estado: z.enum(['programada', 'en_progreso', 'completada', 'cancelada', 'evaluacion_pendiente']).optional(),
  tipo: z.enum(['obligatoria', 'recomendada', 'opcional', 'certificacion']).optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  instructor: z.string().optional(),
  departamento: z.string().optional(),
  modalidad: z.enum(['presencial', 'virtual', 'hibrida']).optional(),
  proceso_sgc: z.number().optional(),
  norma: z.number().optional(),
  activo: z.boolean().optional()
});

// Esquema para cambio de estado
export const changeEstadoCapacitacionSchema = z.object({
  estado: z.enum(['programada', 'en_progreso', 'completada', 'cancelada', 'evaluacion_pendiente'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para inscribir participantes
export const inscribirParticipantesSchema = z.object({
  participantes: z.array(z.number())
    .min(1, 'Debe seleccionar al menos un participante')
    .max(1000, 'No puede inscribir más de 1000 participantes'),
  enviar_notificacion: z.boolean().default(true),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para desinscribir participantes
export const desinscribirParticipantesSchema = z.object({
  participantes: z.array(z.number())
    .min(1, 'Debe seleccionar al menos un participante'),
  motivo: z.string().max(500, 'El motivo no puede exceder 500 caracteres').optional(),
  enviar_notificacion: z.boolean().default(true)
});

// Esquema para capacitaciones recurrentes
export const capacitacionesRecurrentesSchema = z.object({
  tipo: z.enum(['obligatoria', 'recomendada', 'opcional', 'certificacion']),
  frecuencia: z.enum(['semanal', 'mensual', 'trimestral', 'semestral', 'anual']),
  fechaInicio: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'La fecha de inicio debe ser hoy o en el futuro'),
  fechaFin: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  }, 'La fecha de fin debe ser en el futuro'),
  departamentos: z.array(z.number()).min(1, 'Debe seleccionar al menos un departamento'),
  instructores: z.array(z.number()).min(1, 'Debe seleccionar al menos un instructor'),
  template_capacitacion: z.number().optional(),
  nombre_base: z.string().min(3, 'El nombre base debe tener al menos 3 caracteres'),
  descripcion_base: z.string().min(10, 'La descripción base debe tener al menos 10 caracteres'),
  duracion_horas: z.number().min(0.5, 'La duración debe ser al menos 0.5 horas'),
  modalidad: z.enum(['presencial', 'virtual', 'hibrida']).default('presencial')
});

// Esquema para duplicar capacitación
export const duplicateCapacitacionSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  fecha_inicio: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'La fecha de inicio debe ser hoy o en el futuro'),
  mantener_instructor: z.boolean().default(true),
  mantener_contenido: z.boolean().default(true),
  mantener_participantes: z.boolean().default(false),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para exportación
export const exportCapacitacionesSchema = z.object({
  formato: z.enum(['excel', 'pdf', 'csv']),
  filtros: capacitacionFiltersSchema.optional(),
  columnas: z.array(z.string()).optional(),
  incluir_detalles: z.boolean().default(false),
  incluir_participantes: z.boolean().default(false),
  incluir_evaluaciones: z.boolean().default(false)
});

// Esquema para registro de asistencia
export const registroAsistenciaSchema = z.object({
  asistencias: z.array(z.object({
    participante_id: z.number().positive('ID de participante válido requerido'),
    asistio: z.boolean(),
    comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
  }))
  .min(1, 'Debe registrar al menos una asistencia')
});

// Esquema para registro de evaluaciones
export const registroEvaluacionesSchema = z.object({
  evaluaciones: z.array(z.object({
    participante_id: z.number().positive('ID de participante válido requerido'),
    puntuacion: z.number().min(0, 'La puntuación no puede ser negativa').max(100, 'La puntuación no puede exceder 100'),
    comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
  }))
  .min(1, 'Debe registrar al menos una evaluación')
});

// Tipos derivados de los esquemas
export type CapacitacionBase = z.infer<typeof capacitacionBaseSchema>;
export type CreateCapacitacionData = z.infer<typeof createCapacitacionSchema>;
export type UpdateCapacitacionData = z.infer<typeof updateCapacitacionSchema>;
export type CapacitacionFilters = z.infer<typeof capacitacionFiltersSchema>;
export type ChangeEstadoCapacitacionData = z.infer<typeof changeEstadoCapacitacionSchema>;
export type InscribirParticipantesData = z.infer<typeof inscribirParticipantesSchema>;
export type DesinscribirParticipantesData = z.infer<typeof desinscribirParticipantesSchema>;
export type CapacitacionesRecurrentesData = z.infer<typeof capacitacionesRecurrentesSchema>;
export type DuplicateCapacitacionData = z.infer<typeof duplicateCapacitacionSchema>;
export type ExportCapacitacionesData = z.infer<typeof exportCapacitacionesSchema>;
export type RegistroAsistenciaData = z.infer<typeof registroAsistenciaSchema>;
export type RegistroEvaluacionesData = z.infer<typeof registroEvaluacionesSchema>;
