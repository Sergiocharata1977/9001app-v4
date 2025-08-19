// ========== ESQUEMAS DE VALIDACIÓN PARA PROCESOS SGC ==========

import { z } from 'zod';

// Esquema para crear/editar proceso
export const procesoFormSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .trim(),
  descripcion: z.string().max(1000, 'La descripción no puede exceder 1000 caracteres').optional(),
  objetivo: z.string().max(500, 'El objetivo no puede exceder 500 caracteres').optional(),
  alcance: z.string().max(500, 'El alcance no puede exceder 500 caracteres').optional(),
  version: z.string().regex(/^\d+\.\d+$/, 'La versión debe tener el formato X.Y').optional(),
  tipo: z.enum(['estrategico', 'operativo', 'apoyo', 'mejora']).optional(),
  categoria: z.enum(['proceso', 'subproceso', 'actividad']).optional(),
  nivel_critico: z.enum(['bajo', 'medio', 'alto', 'critico']).optional(),
  responsable_id: z.string().optional(),
  departamento_id: z.string().optional(),
  supervisor_id: z.string().optional(),
  entradas: z.string().max(500, 'Las entradas no pueden exceder 500 caracteres').optional(),
  salidas: z.string().max(500, 'Las salidas no pueden exceder 500 caracteres').optional(),
  proveedores: z.string().max(500, 'Los proveedores no pueden exceder 500 caracteres').optional(),
  clientes: z.string().max(500, 'Los clientes no pueden exceder 500 caracteres').optional(),
  recursos_requeridos: z.string().max(500, 'Los recursos no pueden exceder 500 caracteres').optional(),
  competencias_requeridas: z.string().max(500, 'Las competencias no pueden exceder 500 caracteres').optional(),
  indicadores: z.string().max(500, 'Los indicadores no pueden exceder 500 caracteres').optional(),
  metodos_seguimiento: z.string().max(500, 'Los métodos no pueden exceder 500 caracteres').optional(),
  criterios_control: z.string().max(500, 'Los criterios no pueden exceder 500 caracteres').optional(),
  procedimientos_documentados: z.string().max(500, 'Los procedimientos no pueden exceder 500 caracteres').optional(),
  registros_requeridos: z.string().max(500, 'Los registros no pueden exceder 500 caracteres').optional(),
  riesgos_identificados: z.string().max(500, 'Los riesgos no pueden exceder 500 caracteres').optional(),
  oportunidades_mejora: z.string().max(500, 'Las oportunidades no pueden exceder 500 caracteres').optional(),
  fecha_vigencia: z.string().optional(),
  fecha_revision: z.string().optional(),
  motivo_cambio: z.string().max(200, 'El motivo no puede exceder 200 caracteres').optional(),
});

// Esquema para filtros de búsqueda
export const procesoFiltrosSchema = z.object({
  search: z.string().optional(),
  tipo: z.enum(['estrategico', 'operativo', 'apoyo', 'mejora']).optional(),
  categoria: z.enum(['proceso', 'subproceso', 'actividad']).optional(),
  nivel_critico: z.enum(['bajo', 'medio', 'alto', 'critico']).optional(),
  estado: z.enum(['activo', 'inactivo', 'obsoleto', 'en_revision']).optional(),
  responsable_id: z.string().optional(),
  departamento_id: z.string().optional(),
  fecha_desde: z.string().optional(),
  fecha_hasta: z.string().optional(),
});

// Esquema para agregar participante
export const participanteSchema = z.object({
  personal_id: z.string().min(1, 'El personal es obligatorio'),
  rol: z.string().min(1, 'El rol es obligatorio').max(100, 'El rol no puede exceder 100 caracteres'),
  observaciones: z.string().max(500, 'Las observaciones no pueden exceder 500 caracteres').optional(),
  asistio: z.boolean().optional(),
  justificacion_ausencia: z.string().max(200, 'La justificación no puede exceder 200 caracteres').optional(),
});

// Esquema para agregar documento
export const documentoRelacionadoSchema = z.object({
  documento_id: z.number().min(1, 'El documento es obligatorio'),
  tipo_relacion: z.enum(['adjunto', 'evidencia', 'material', 'resultado', 'entrada', 'salida']).optional(),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  es_obligatorio: z.boolean().optional(),
});

// Esquema para agregar norma
export const normaRelacionadaSchema = z.object({
  norma_id: z.number().min(1, 'La norma es obligatoria'),
  punto_norma: z.string().min(1, 'El punto de norma es obligatorio').max(50, 'El punto de norma no puede exceder 50 caracteres'),
  clausula_descripcion: z.string().max(500, 'La descripción de cláusula no puede exceder 500 caracteres').optional(),
  tipo_relacion: z.enum(['aplica', 'no_aplica', 'competencia', 'requisito']).optional(),
  nivel_cumplimiento: z.enum(['cumple', 'no_cumple', 'parcial', 'pendiente', 'no_aplica']).optional(),
  observaciones: z.string().max(500, 'Las observaciones no pueden exceder 500 caracteres').optional(),
  evidencias: z.string().max(500, 'Las evidencias no pueden exceder 500 caracteres').optional(),
  acciones_requeridas: z.string().max(500, 'Las acciones requeridas no pueden exceder 500 caracteres').optional(),
});

// Esquema para indicador de proceso
export const indicadorProcesoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(200, 'El nombre no puede exceder 200 caracteres'),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  tipo: z.enum(['efectividad', 'eficiencia', 'satisfaccion', 'cumplimiento']),
  unidad: z.string().min(1, 'La unidad es obligatoria').max(50, 'La unidad no puede exceder 50 caracteres'),
  formula: z.string().max(200, 'La fórmula no puede exceder 200 caracteres').optional(),
  meta: z.number().min(0, 'La meta debe ser mayor o igual a 0'),
  tolerancia_inferior: z.number().optional(),
  tolerancia_superior: z.number().optional(),
  frecuencia_medicion: z.enum(['diario', 'semanal', 'mensual', 'trimestral', 'anual']),
  responsable_id: z.string().optional(),
});

// Esquema para riesgo de proceso
export const riesgoProcesoSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es obligatoria').max(500, 'La descripción no puede exceder 500 caracteres'),
  probabilidad: z.enum(['baja', 'media', 'alta']),
  impacto: z.enum(['bajo', 'medio', 'alto']),
  nivel_riesgo: z.enum(['bajo', 'medio', 'alto', 'critico']),
  medidas_control: z.string().max(500, 'Las medidas de control no pueden exceder 500 caracteres').optional(),
  responsable_id: z.string().optional(),
  fecha_evaluacion: z.string(),
  fecha_revision: z.string().optional(),
  estado: z.enum(['activo', 'mitigado', 'aceptado', 'transferido']),
});

// Esquema para oportunidad de mejora
export const oportunidadMejoraSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es obligatoria').max(500, 'La descripción no puede exceder 500 caracteres'),
  tipo: z.enum(['eficiencia', 'efectividad', 'satisfaccion', 'innovacion']),
  beneficio_esperado: z.string().min(1, 'El beneficio esperado es obligatorio').max(500, 'El beneficio no puede exceder 500 caracteres'),
  recursos_requeridos: z.string().max(500, 'Los recursos no pueden exceder 500 caracteres').optional(),
  prioridad: z.enum(['baja', 'media', 'alta']),
  responsable_id: z.string().optional(),
  fecha_identificacion: z.string(),
  fecha_implementacion: z.string().optional(),
  estado: z.enum(['identificada', 'en_analisis', 'aprobada', 'en_implementacion', 'implementada', 'cancelada']),
});

// Esquema para auditoría de proceso
export const auditoriaProcesoSchema = z.object({
  fecha_auditoria: z.string(),
  auditor_id: z.string().min(1, 'El auditor es obligatorio'),
  tipo_auditoria: z.enum(['interna', 'externa', 'seguimiento']),
  alcance: z.string().min(1, 'El alcance es obligatorio').max(500, 'El alcance no puede exceder 500 caracteres'),
  criterios: z.string().min(1, 'Los criterios son obligatorios').max(500, 'Los criterios no pueden exceder 500 caracteres'),
  hallazgos: z.string().max(1000, 'Los hallazgos no pueden exceder 1000 caracteres').optional(),
  conclusiones: z.string().max(500, 'Las conclusiones no pueden exceder 500 caracteres').optional(),
  recomendaciones: z.string().max(500, 'Las recomendaciones no pueden exceder 500 caracteres').optional(),
  estado: z.enum(['planificada', 'en_proceso', 'completada', 'cancelada']),
});

// Tipos derivados de los esquemas
export type ProcesoFormData = z.infer<typeof procesoFormSchema>;
export type ProcesoFiltrosData = z.infer<typeof procesoFiltrosSchema>;
export type ParticipanteData = z.infer<typeof participanteSchema>;
export type DocumentoRelacionadoData = z.infer<typeof documentoRelacionadoSchema>;
export type NormaRelacionadaData = z.infer<typeof normaRelacionadaSchema>;
export type IndicadorProcesoData = z.infer<typeof indicadorProcesoSchema>;
export type RiesgoProcesoData = z.infer<typeof riesgoProcesoSchema>;
export type OportunidadMejoraData = z.infer<typeof oportunidadMejoraSchema>;
export type AuditoriaProcesoData = z.infer<typeof auditoriaProcesoSchema>;

// Funciones de validación personalizadas
export const validacionesProcesos = {
  // Validar que las fechas sean coherentes
  validarFechas: (fechaVigencia?: string, fechaRevision?: string): boolean => {
    if (!fechaVigencia || !fechaRevision) return true;
    return new Date(fechaVigencia) <= new Date(fechaRevision);
  },

  // Validar que la tolerancia sea coherente
  validarTolerancia: (inferior?: number, superior?: number): boolean => {
    if (inferior === undefined || superior === undefined) return true;
    return inferior <= superior;
  },

  // Validar formato de código de proceso
  validarCodigoProceso: (codigo: string): boolean => {
    return /^[A-Z]{3,4}-\d{3,6}$/.test(codigo);
  },

  // Validar que el nivel de riesgo sea coherente con probabilidad e impacto
  validarNivelRiesgo: (probabilidad: string, impacto: string, nivelRiesgo: string): boolean => {
    const matrizRiesgo: Record<string, Record<string, string>> = {
      baja: {
        bajo: 'bajo',
        medio: 'bajo',
        alto: 'medio'
      },
      media: {
        bajo: 'bajo',
        medio: 'medio',
        alto: 'alto'
      },
      alta: {
        bajo: 'medio',
        medio: 'alto',
        alto: 'critico'
      }
    };

    const nivelEsperado = matrizRiesgo[probabilidad]?.[impacto];
    return nivelEsperado === nivelRiesgo;
  }
};

// Esquemas con validaciones personalizadas
export const procesoFormSchemaConValidaciones = procesoFormSchema
  .refine(
    (data) => validacionesProcesos.validarFechas(data.fecha_vigencia, data.fecha_revision),
    {
      message: 'La fecha de vigencia debe ser anterior o igual a la fecha de revisión',
      path: ['fecha_revision']
    }
  )
  .refine(
    (data) => !data.codigo || validacionesProcesos.validarCodigoProceso(data.codigo),
    {
      message: 'El código debe tener el formato XXX-123456',
      path: ['codigo']
    }
  );

export const indicadorProcesoSchemaConValidaciones = indicadorProcesoSchema
  .refine(
    (data) => validacionesProcesos.validarTolerancia(data.tolerancia_inferior, data.tolerancia_superior),
    {
      message: 'La tolerancia inferior debe ser menor o igual a la superior',
      path: ['tolerancia_superior']
    }
  );

export const riesgoProcesoSchemaConValidaciones = riesgoProcesoSchema
  .refine(
    (data) => validacionesProcesos.validarNivelRiesgo(data.probabilidad, data.impacto, data.nivel_riesgo),
    {
      message: 'El nivel de riesgo no es coherente con la probabilidad e impacto',
      path: ['nivel_riesgo']
    }
  );
