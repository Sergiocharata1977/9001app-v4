// ========== ESQUEMAS DE VALIDACIÓN PARA MINUTAS SGC ==========

import { z } from 'zod';

// Esquema para crear/editar minuta
export const minutaFormSchema = z.object({
  titulo: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  hora_inicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  hora_fin: z.string().min(1, 'La hora de fin es obligatoria'),
  lugar: z.string()
    .min(1, 'El lugar es obligatorio')
    .max(200, 'El lugar no puede exceder 200 caracteres')
    .trim(),
  tipo: z.enum(['reunion', 'auditoria', 'revision', 'capacitacion'], {
    errorMap: () => ({ message: 'El tipo de minuta es obligatorio' })
  }),
  organizador_id: z.string().min(1, 'El organizador es obligatorio'),
  agenda: z.string()
    .min(10, 'La agenda debe tener al menos 10 caracteres')
    .max(2000, 'La agenda no puede exceder 2000 caracteres')
    .trim(),
  conclusiones: z.string()
    .max(2000, 'Las conclusiones no pueden exceder 2000 caracteres')
    .optional(),
  acuerdos: z.array(z.string().min(1, 'El acuerdo no puede estar vacío'))
    .max(20, 'No se pueden agregar más de 20 acuerdos')
    .optional(),
  proxima_reunion: z.string().optional(),
  estado: z.enum(['programada', 'en_proceso', 'completada', 'cancelada']).optional(),
});

// Esquema para filtros de búsqueda
export const minutaFiltrosSchema = z.object({
  search: z.string().optional(),
  tipo: z.enum(['reunion', 'auditoria', 'revision', 'capacitacion']).optional(),
  estado: z.enum(['programada', 'en_proceso', 'completada', 'cancelada']).optional(),
  fecha_desde: z.string().optional(),
  fecha_hasta: z.string().optional(),
  organizador_id: z.string().optional(),
});

// Esquema para agregar participante a minuta
export const minutaParticipanteSchema = z.object({
  personal_id: z.string().min(1, 'El personal es obligatorio'),
  rol: z.string()
    .min(1, 'El rol es obligatorio')
    .max(100, 'El rol no puede exceder 100 caracteres'),
  observaciones: z.string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional(),
  asistio: z.boolean().optional(),
  justificacion_ausencia: z.string()
    .max(200, 'La justificación no puede exceder 200 caracteres')
    .optional(),
});

// Esquema para actualizar asistencia
export const asistenciaSchema = z.object({
  asistio: z.boolean(),
  justificacion_ausencia: z.string()
    .max(200, 'La justificación no puede exceder 200 caracteres')
    .optional(),
});

// Esquema para agregar documento a minuta
export const minutaDocumentoSchema = z.object({
  documento_id: z.number().min(1, 'El documento es obligatorio'),
  tipo_relacion: z.enum(['adjunto', 'evidencia', 'material', 'resultado', 'entrada', 'salida']).optional(),
  descripcion: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  es_obligatorio: z.boolean().optional(),
});

// Esquema para agregar norma a minuta
export const minutaNormaSchema = z.object({
  norma_id: z.number().min(1, 'La norma es obligatoria'),
  punto_norma: z.string()
    .min(1, 'El punto de norma es obligatorio')
    .max(50, 'El punto de norma no puede exceder 50 caracteres'),
  clausula_descripcion: z.string()
    .max(500, 'La descripción de cláusula no puede exceder 500 caracteres')
    .optional(),
  tipo_relacion: z.enum(['aplica', 'no_aplica', 'competencia', 'requisito']).optional(),
  nivel_cumplimiento: z.enum(['cumple', 'no_cumple', 'parcial', 'pendiente', 'no_aplica']).optional(),
  observaciones: z.string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional(),
  evidencias: z.string()
    .max(500, 'Las evidencias no pueden exceder 500 caracteres')
    .optional(),
  acciones_requeridas: z.string()
    .max(500, 'Las acciones requeridas no pueden exceder 500 caracteres')
    .optional(),
});

// Esquema para acuerdos de minuta
export const acuerdoMinutaSchema = z.object({
  descripcion: z.string()
    .min(1, 'La descripción del acuerdo es obligatoria')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  responsable_id: z.string().optional(),
  fecha_limite: z.string().optional(),
  estado: z.enum(['pendiente', 'en_progreso', 'completado', 'cancelado']).optional(),
  prioridad: z.enum(['baja', 'media', 'alta']).optional(),
});

// Esquema para conclusiones de minuta
export const conclusionMinutaSchema = z.object({
  conclusion: z.string()
    .min(1, 'La conclusión es obligatoria')
    .max(1000, 'La conclusión no puede exceder 1000 caracteres'),
  tipo: z.enum(['hallazgo', 'observacion', 'recomendacion', 'decision']).optional(),
  prioridad: z.enum(['baja', 'media', 'alta']).optional(),
  responsable_id: z.string().optional(),
});

// Tipos derivados de los esquemas
export type MinutaFormData = z.infer<typeof minutaFormSchema>;
export type MinutaFiltrosData = z.infer<typeof minutaFiltrosSchema>;
export type MinutaParticipanteData = z.infer<typeof minutaParticipanteSchema>;
export type AsistenciaData = z.infer<typeof asistenciaSchema>;
export type MinutaDocumentoData = z.infer<typeof minutaDocumentoSchema>;
export type MinutaNormaData = z.infer<typeof minutaNormaSchema>;
export type AcuerdoMinutaData = z.infer<typeof acuerdoMinutaSchema>;
export type ConclusionMinutaData = z.infer<typeof conclusionMinutaSchema>;

// Funciones de validación personalizadas
export const validacionesMinutas = {
  // Validar que las horas sean coherentes
  validarHoras: (horaInicio: string, horaFin: string): boolean => {
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fin = new Date(`2000-01-01T${horaFin}`);
    return inicio < fin;
  },

  // Validar que la fecha no sea en el pasado para minutas programadas
  validarFechaProgramada: (fecha: string, estado?: string): boolean => {
    if (estado === 'programada') {
      const fechaMinuta = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fechaMinuta >= hoy;
    }
    return true;
  },

  // Validar que la duración de la minuta sea razonable
  validarDuracionMinuta: (horaInicio: string, horaFin: string): boolean => {
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fin = new Date(`2000-01-01T${horaFin}`);
    const duracionMs = fin.getTime() - inicio.getTime();
    const duracionHoras = duracionMs / (1000 * 60 * 60);
    
    // Mínimo 15 minutos, máximo 8 horas
    return duracionHoras >= 0.25 && duracionHoras <= 8;
  },

  // Validar formato de hora
  validarFormatoHora: (hora: string): boolean => {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora);
  },

  // Validar que los acuerdos no estén duplicados
  validarAcuerdosUnicos: (acuerdos: string[]): boolean => {
    const acuerdosUnicos = new Set(acuerdos.map(a => a.toLowerCase().trim()));
    return acuerdosUnicos.size === acuerdos.length;
  }
};

// Esquemas con validaciones personalizadas
export const minutaFormSchemaConValidaciones = minutaFormSchema
  .refine(
    (data) => validacionesMinutas.validarHoras(data.hora_inicio, data.hora_fin),
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['hora_fin']
    }
  )
  .refine(
    (data) => validacionesMinutas.validarFechaProgramada(data.fecha, data.estado),
    {
      message: 'No se pueden programar minutas en fechas pasadas',
      path: ['fecha']
    }
  )
  .refine(
    (data) => validacionesMinutas.validarDuracionMinuta(data.hora_inicio, data.hora_fin),
    {
      message: 'La duración de la minuta debe estar entre 15 minutos y 8 horas',
      path: ['hora_fin']
    }
  )
  .refine(
    (data) => validacionesMinutas.validarFormatoHora(data.hora_inicio),
    {
      message: 'Formato de hora de inicio inválido (HH:MM)',
      path: ['hora_inicio']
    }
  )
  .refine(
    (data) => validacionesMinutas.validarFormatoHora(data.hora_fin),
    {
      message: 'Formato de hora de fin inválido (HH:MM)',
      path: ['hora_fin']
    }
  )
  .refine(
    (data) => !data.acuerdos || validacionesMinutas.validarAcuerdosUnicos(data.acuerdos),
    {
      message: 'No se permiten acuerdos duplicados',
      path: ['acuerdos']
    }
  );

// Esquema para validar asistencia
export const asistenciaSchemaConValidaciones = asistenciaSchema
  .refine(
    (data) => {
      if (!data.asistio && !data.justificacion_ausencia) {
        return false;
      }
      return true;
    },
    {
      message: 'Se requiere justificación cuando no se asiste',
      path: ['justificacion_ausencia']
    }
  );

// Esquema para validar acuerdos
export const acuerdoMinutaSchemaConValidaciones = acuerdoMinutaSchema
  .refine(
    (data) => {
      if (data.fecha_limite) {
        const fechaLimite = new Date(data.fecha_limite);
        const hoy = new Date();
        return fechaLimite >= hoy;
      }
      return true;
    },
    {
      message: 'La fecha límite no puede ser en el pasado',
      path: ['fecha_limite']
    }
  );

// Esquemas para validación de fechas específicas
export const fechaMinutaSchema = z.object({
  fecha: z.string().refine(
    (fecha) => {
      const fechaMinuta = new Date(fecha);
      return !isNaN(fechaMinuta.getTime());
    },
    {
      message: 'Formato de fecha inválido'
    }
  ),
  hora_inicio: z.string().refine(
    (hora) => validacionesMinutas.validarFormatoHora(hora),
    {
      message: 'Formato de hora inválido (HH:MM)'
    }
  ),
  hora_fin: z.string().refine(
    (hora) => validacionesMinutas.validarFormatoHora(hora),
    {
      message: 'Formato de hora inválido (HH:MM)'
    }
  )
}).refine(
  (data) => validacionesMinutas.validarHoras(data.hora_inicio, data.hora_fin),
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['hora_fin']
  }
);

// Esquema para validación de participantes
export const participantesMinutaSchema = z.object({
  participantes: z.array(minutaParticipanteSchema)
    .min(1, 'Debe haber al menos un participante')
    .max(50, 'No se pueden agregar más de 50 participantes')
    .refine(
      (participantes) => {
        const personalIds = participantes.map(p => p.personal_id);
        const personalIdsUnicos = new Set(personalIds);
        return personalIdsUnicos.size === personalIds.length;
      },
      {
        message: 'No se permiten participantes duplicados'
      }
    )
});

// Esquema para validación de documentos
export const documentosMinutaSchema = z.object({
  documentos: z.array(minutaDocumentoSchema)
    .max(20, 'No se pueden agregar más de 20 documentos')
    .refine(
      (documentos) => {
        const documentoIds = documentos.map(d => d.documento_id);
        const documentoIdsUnicos = new Set(documentoIds);
        return documentoIdsUnicos.size === documentoIds.length;
      },
      {
        message: 'No se permiten documentos duplicados'
      }
    )
});

// Esquema para validación de normas
export const normasMinutaSchema = z.object({
  normas: z.array(minutaNormaSchema)
    .max(30, 'No se pueden agregar más de 30 normas')
    .refine(
      (normas) => {
        const normaIds = normas.map(n => n.norma_id);
        const normaIdsUnicos = new Set(normaIds);
        return normaIdsUnicos.size === normaIds.length;
      },
      {
        message: 'No se permiten normas duplicadas'
      }
    )
});

// Esquema completo para minuta con todas las validaciones
export const minutaCompletaSchema = z.object({
  ...minutaFormSchema.shape,
  participantes: z.array(minutaParticipanteSchema).optional(),
  documentos: z.array(minutaDocumentoSchema).optional(),
  normas: z.array(minutaNormaSchema).optional()
}).refine(
  (data) => validacionesMinutas.validarHoras(data.hora_inicio, data.hora_fin),
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['hora_fin']
  }
).refine(
  (data) => validacionesMinutas.validarFechaProgramada(data.fecha, data.estado),
  {
    message: 'No se pueden programar minutas en fechas pasadas',
    path: ['fecha']
  }
).refine(
  (data) => validacionesMinutas.validarDuracionMinuta(data.hora_inicio, data.hora_fin),
  {
    message: 'La duración de la minuta debe estar entre 15 minutos y 8 horas',
    path: ['hora_fin']
  }
).refine(
  (data) => validacionesMinutas.validarFormatoHora(data.hora_inicio),
  {
    message: 'Formato de hora de inicio inválido (HH:MM)',
    path: ['hora_inicio']
  }
).refine(
  (data) => validacionesMinutas.validarFormatoHora(data.hora_fin),
  {
    message: 'Formato de hora de fin inválido (HH:MM)',
    path: ['hora_fin']
  }
).refine(
  (data) => !data.acuerdos || validacionesMinutas.validarAcuerdosUnicos(data.acuerdos),
  {
    message: 'No se permiten acuerdos duplicados',
    path: ['acuerdos']
  }
);

// Tipos para el esquema completo
export type MinutaCompletaData = z.infer<typeof minutaCompletaSchema>;
