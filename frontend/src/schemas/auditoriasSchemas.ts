import { z } from 'zod';

// Esquema base para auditoría
export const auditoriaBaseSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  
  tipo: z.enum(['interna', 'externa', 'certificacion'], {
    errorMap: () => ({ message: 'El tipo debe ser interna, externa o certificación' })
  }),
  
  alcance: z.string()
    .min(10, 'El alcance debe tener al menos 10 caracteres')
    .max(500, 'El alcance no puede exceder 500 caracteres'),
  
  fecha_programada: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La fecha programada debe ser hoy o en el futuro'),
  
  fecha_fin_estimada: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La fecha de fin estimada debe ser hoy o en el futuro')
    .optional(),
  
  departamento_id: z.number()
    .positive('Debe seleccionar un departamento válido'),
  
  auditor_id: z.number()
    .positive('Debe seleccionar un auditor válido'),
  
  criterios: z.array(z.string())
    .min(1, 'Debe especificar al menos un criterio de auditoría')
    .max(20, 'No puede exceder 20 criterios'),
  
  documentos_requeridos: z.array(z.string())
    .optional(),
  
  observaciones: z.string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional(),
  
  prioridad: z.enum(['baja', 'media', 'alta', 'critica'], {
    errorMap: () => ({ message: 'La prioridad debe ser baja, media, alta o crítica' })
  }).default('media'),
  
  recursos_asignados: z.array(z.string())
    .optional(),
  
  presupuesto_estimado: z.number()
    .min(0, 'El presupuesto no puede ser negativo')
    .optional(),
  
  moneda: z.enum(['USD', 'EUR', 'PEN'], {
    errorMap: () => ({ message: 'La moneda debe ser USD, EUR o PEN' })
  }).default('PEN'),
  
  contacto_responsable: z.string()
    .email('Debe ser un email válido')
    .optional(),
  
  telefono_contacto: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Debe ser un número de teléfono válido')
    .optional(),
  
  ubicacion: z.string()
    .max(200, 'La ubicación no puede exceder 200 caracteres')
    .optional(),
  
  equipamiento_requerido: z.array(z.string())
    .optional(),
  
  personal_requerido: z.array(z.number())
    .optional(),
  
  riesgos_identificados: z.array(z.string())
    .optional(),
  
  medidas_mitigacion: z.array(z.string())
    .optional(),
  
  anexos: z.array(z.string())
    .optional(),
  
  tags: z.array(z.string())
    .max(10, 'No puede exceder 10 etiquetas')
    .optional(),
  
  es_recurrente: z.boolean().default(false),
  
  frecuencia_recurrencia: z.enum(['mensual', 'trimestral', 'semestral', 'anual'])
    .optional()
    .refine((val) => {
      // Solo requerido si es_recurrente es true
      return true;
    }, 'Debe especificar la frecuencia de recurrencia'),
  
  fecha_fin_recurrencia: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, 'La fecha de fin de recurrencia debe ser en el futuro'),
  
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
  
  hallazgos_anteriores: z.array(z.number())
    .optional(),
  
  acciones_correctivas_pendientes: z.array(z.number())
    .optional(),
  
  certificacion_id: z.number()
    .positive('Debe seleccionar una certificación válida')
    .optional(),
  
  organismo_certificador: z.string()
    .max(200, 'El organismo certificador no puede exceder 200 caracteres')
    .optional(),
  
  fecha_ultima_certificacion: z.string()
    .optional(),
  
  fecha_proxima_revision: z.string()
    .optional(),
  
  puntuacion_anterior: z.number()
    .min(0, 'La puntuación no puede ser negativa')
    .max(100, 'La puntuación no puede exceder 100')
    .optional(),
  
  objetivo_puntuacion: z.number()
    .min(0, 'El objetivo de puntuación no puede ser negativo')
    .max(100, 'El objetivo de puntuación no puede exceder 100')
    .optional(),
  
  metodologia: z.enum(['documental', 'entrevistas', 'observacion', 'muestreo', 'mixta'], {
    errorMap: () => ({ message: 'La metodología debe ser documental, entrevistas, observación, muestreo o mixta' })
  }).default('mixta'),
  
  duracion_estimada_horas: z.number()
    .min(1, 'La duración debe ser al menos 1 hora')
    .max(480, 'La duración no puede exceder 480 horas (60 días)')
    .optional(),
  
  equipo_auditor: z.array(z.number())
    .min(1, 'Debe asignar al menos un auditor al equipo')
    .max(10, 'El equipo no puede exceder 10 auditores'),
  
  observadores: z.array(z.number())
    .optional(),
  
  agenda_detallada: z.array(z.object({
    fecha: z.string(),
    hora_inicio: z.string(),
    hora_fin: z.string(),
    actividad: z.string(),
    responsable: z.string(),
    ubicacion: z.string().optional()
  }))
  .optional(),
  
  checklist_auditoria: z.array(z.object({
    item: z.string(),
    descripcion: z.string(),
    obligatorio: z.boolean().default(true),
    peso: z.number().min(0).max(10).default(1)
  }))
  .optional(),
  
  documentos_evidencia: z.array(z.string())
    .optional(),
  
  reporte_template: z.string()
    .optional(),
  
  criterios_aceptacion: z.array(z.string())
    .optional(),
  
  riesgos_auditoria: z.array(z.object({
    riesgo: z.string(),
    probabilidad: z.enum(['baja', 'media', 'alta']),
    impacto: z.enum(['bajo', 'medio', 'alto']),
    mitigacion: z.string()
  }))
  .optional(),
  
  comunicaciones_planificadas: z.array(z.object({
    tipo: z.enum(['inicio', 'progreso', 'cierre', 'seguimiento']),
    fecha: z.string(),
    destinatarios: z.array(z.string()),
    contenido: z.string()
  }))
  .optional(),
  
  recursos_externos: z.array(z.object({
    tipo: z.string(),
    descripcion: z.string(),
    costo: z.number().optional(),
    proveedor: z.string().optional()
  }))
  .optional(),
  
  restricciones: z.array(z.string())
    .optional(),
  
  dependencias: z.array(z.number())
    .optional(),
  
  notas_internas: z.string()
    .max(2000, 'Las notas internas no pueden exceder 2000 caracteres')
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

// Esquema para crear auditoría
export const createAuditoriaSchema = auditoriaBaseSchema.omit({
  id: true,
  estado: true,
  fecha_creacion: true,
  fecha_actualizacion: true,
  actualizado_por: true,
  historial_cambios: true
});

// Esquema para actualizar auditoría
export const updateAuditoriaSchema = auditoriaBaseSchema.partial().omit({
  id: true,
  fecha_creacion: true,
  historial_cambios: true
});

// Esquema para filtros de auditoría
export const auditoriaFiltersSchema = z.object({
  search: z.string().optional(),
  estado: z.enum(['programada', 'en_proceso', 'completada', 'cancelada']).optional(),
  tipo: z.enum(['interna', 'externa', 'certificacion']).optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  auditor: z.string().optional(),
  departamento: z.number().optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'critica']).optional(),
  proceso_sgc: z.number().optional(),
  norma: z.number().optional(),
  es_recurrente: z.boolean().optional(),
  activo: z.boolean().optional()
});

// Esquema para cambio de estado
export const changeEstadoSchema = z.object({
  estado: z.enum(['programada', 'en_proceso', 'completada', 'cancelada'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para asignar auditores
export const assignAuditoresSchema = z.object({
  auditores: z.array(z.number())
    .min(1, 'Debe asignar al menos un auditor')
    .max(10, 'No puede asignar más de 10 auditores'),
  rol_principal: z.number().optional(),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para auditorías recurrentes
export const auditoriasRecurrentesSchema = z.object({
  tipo: z.enum(['interna', 'externa', 'certificacion']),
  frecuencia: z.enum(['mensual', 'trimestral', 'semestral', 'anual']),
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
  auditores: z.array(z.number()).min(1, 'Debe seleccionar al menos un auditor'),
  template_auditoria: z.number().optional(),
  nombre_base: z.string().min(3, 'El nombre base debe tener al menos 3 caracteres'),
  descripcion_base: z.string().min(10, 'La descripción base debe tener al menos 10 caracteres'),
  alcance_base: z.string().min(10, 'El alcance base debe tener al menos 10 caracteres')
});

// Esquema para duplicar auditoría
export const duplicateAuditoriaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  fecha_programada: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'La fecha programada debe ser hoy o en el futuro'),
  mantener_equipo: z.boolean().default(true),
  mantener_criterios: z.boolean().default(true),
  mantener_checklist: z.boolean().default(true),
  comentarios: z.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional()
});

// Esquema para exportación
export const exportAuditoriasSchema = z.object({
  formato: z.enum(['excel', 'pdf', 'csv']),
  filtros: auditoriaFiltersSchema.optional(),
  columnas: z.array(z.string()).optional(),
  incluir_detalles: z.boolean().default(false),
  incluir_historial: z.boolean().default(false)
});

// Tipos derivados de los esquemas
export type AuditoriaBase = z.infer<typeof auditoriaBaseSchema>;
export type CreateAuditoriaData = z.infer<typeof createAuditoriaSchema>;
export type UpdateAuditoriaData = z.infer<typeof updateAuditoriaSchema>;
export type AuditoriaFilters = z.infer<typeof auditoriaFiltersSchema>;
export type ChangeEstadoData = z.infer<typeof changeEstadoSchema>;
export type AssignAuditoresData = z.infer<typeof assignAuditoresSchema>;
export type AuditoriasRecurrentesData = z.infer<typeof auditoriasRecurrentesSchema>;
export type DuplicateAuditoriaData = z.infer<typeof duplicateAuditoriaSchema>;
export type ExportAuditoriasData = z.infer<typeof exportAuditoriasSchema>;
