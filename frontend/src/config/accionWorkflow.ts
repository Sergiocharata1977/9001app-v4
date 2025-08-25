import { ACCION_ESTADOS } from '@/types/acciones';

// Configuración del workflow de acciones
export const accionWorkflow = {
  [ACCION_ESTADOS.PLANIFICACION]: {
    title: 'Planificación de Acción',
    color: 'blue',
    colorClasses: 'bg-blue-500 text-white',
    nextState: ACCION_ESTADOS.EJECUCION,
    description: 'Definir los detalles de la acción correctiva/preventiva',
    component: 'PlanificacionForm'
  },
  [ACCION_ESTADOS.EJECUCION]: {
    title: 'Ejecución de Acción',
    color: 'orange',
    colorClasses: 'bg-orange-500 text-white',
    nextState: ACCION_ESTADOS.EJECUCION_VERIFICACION,
    description: 'Implementar la acción y registrar evidencias',
    component: 'EjecucionForm'
  },
  [ACCION_ESTADOS.PLANIFICACION_VERIFICACION]: {
    title: 'Verificación de Planificación',
    color: 'purple',
    colorClasses: 'bg-purple-500 text-white',
    nextState: ACCION_ESTADOS.CERRADA,
    description: 'Verificar que la planificación fue efectiva',
    component: 'VerificacionForm'
  },
  [ACCION_ESTADOS.EJECUCION_VERIFICACION]: {
    title: 'Verificación de Ejecución',
    color: 'purple',
    colorClasses: 'bg-purple-500 text-white',
    nextState: ACCION_ESTADOS.CERRADA,
    description: 'Verificar que la ejecución fue efectiva',
    component: 'VerificacionForm'
  },
  [ACCION_ESTADOS.CERRADA]: {
    title: 'Acción Cerrada',
    color: 'gray',
    colorClasses: 'bg-gray-500 text-white',
    nextState: null,
    description: 'La acción ha sido completada y verificada',
    component: null
  }
};

// Estados de acciones según el workflow
export const ACCION_ESTADOS = {
  PLANIFICACION: 'p1_planificacion_accion',
  EJECUCION: 'e2_ejecucion_accion',
  PLANIFICACION_VERIFICACION: 'v3_planificacion_verificacion',
  EJECUCION_VERIFICACION: 'v4_ejecucion_verificacion',
  CERRADA: 'c5_cerrada',
} as const;

export type AccionEstado = typeof ACCION_ESTADOS[keyof typeof ACCION_ESTADOS];

// Configuración de prioridades
export const ACCION_PRIORIDADES = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
} as const;

export type AccionPrioridad = typeof ACCION_PRIORIDADES[keyof typeof ACCION_PRIORIDADES];

// Configuración de colores por prioridad
export const prioridadColors = {
  [ACCION_PRIORIDADES.ALTA]: 'bg-red-500',
  [ACCION_PRIORIDADES.MEDIA]: 'bg-yellow-500',
  [ACCION_PRIORIDADES.BAJA]: 'bg-green-500'
};

// Configuración de iconos por estado
export const estadoIcons = {
  [ACCION_ESTADOS.PLANIFICACION]: 'Clock',
  [ACCION_ESTADOS.EJECUCION]: 'AlertCircle',
  [ACCION_ESTADOS.PLANIFICACION_VERIFICACION]: 'CheckCircle',
  [ACCION_ESTADOS.EJECUCION_VERIFICACION]: 'CheckCircle',
  [ACCION_ESTADOS.CERRADA]: 'XCircle'
};
