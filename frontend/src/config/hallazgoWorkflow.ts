import FormAnalisisAccion from '@/components/hallazgos/forms/FormAnalisisAccion';
import FormEjecucionAI from '@/components/hallazgos/forms/FormEjecucionAI';
import FormPlanificacionAI from '@/components/hallazgos/forms/FormPlanificacionAI';
import FormVerificacionCierre from '@/components/hallazgos/forms/FormVerificacionCierre';
import type { HallazgoEstado } from '@/types/hallazgos';

interface WorkflowStep {
  Component?: React.ComponentType<any>;
  nextState: HallazgoEstado | { [key: string]: HallazgoEstado };
  title: string;
  description: string;
}

export const hallazgoWorkflow: Record<HallazgoEstado, WorkflowStep> = {
  // Estados de detección
  deteccion: {
    Component: FormPlanificacionAI,
    nextState: 'planificacion_ai',
    title: 'Planificación de Acción Inmediata',
    description: 'Planificar la acción inmediata para el hallazgo detectado'
  },
  d1_iniciado: {
    Component: FormPlanificacionAI,
    nextState: 'planificacion_ai',
    title: 'Planificación de Acción Inmediata',
    description: 'Planificar la acción inmediata para el hallazgo detectado'
  },

  // Estados de planificación
  planificacion_ai: {
    Component: FormEjecucionAI,
    nextState: 'ejecucion_ai',
    title: 'Ejecución de Acción Inmediata',
    description: 'Ejecutar la acción inmediata planificada'
  },
  d1_accion_inmediata_programada: {
    Component: FormEjecucionAI,
    nextState: 'ejecucion_ai',
    title: 'Ejecución de Acción Inmediata',
    description: 'Ejecutar la acción inmediata planificada'
  },
  d2_accion_inmediata_programada: {
    Component: FormEjecucionAI,
    nextState: 'ejecucion_ai',
    title: 'Ejecución de Acción Inmediata',
    description: 'Ejecutar la acción inmediata planificada'
  },

  // Estados de ejecución
  ejecucion_ai: {
    Component: FormAnalisisAccion,
    nextState: {
      requiere_accion: 'analisis_plan_accion',
      no_requiere_accion: 'verificacion_cierre'
    },
    title: 'Análisis de la Acción',
    description: 'Analizar la efectividad de la acción ejecutada'
  },
  d2_analisis_causa_raiz_programado: {
    Component: FormAnalisisAccion,
    nextState: {
      requiere_accion: 'analisis_plan_accion',
      no_requiere_accion: 'verificacion_cierre'
    },
    title: 'Análisis de la Acción',
    description: 'Analizar la efectividad de la acción ejecutada'
  },

  // Estados de análisis
  analisis_plan_accion: {
    Component: FormVerificacionCierre,
    nextState: 'verificacion_cierre',
    title: 'Verificación y Cierre',
    description: 'Verificar la eficacia de las acciones implementadas'
  },
  d3_plan_accion_definido: {
    Component: FormVerificacionCierre,
    nextState: 'verificacion_cierre',
    title: 'Verificación y Cierre',
    description: 'Verificar la eficacia de las acciones implementadas'
  },

  // Estados de verificación
  verificacion_cierre: {
    Component: undefined, // No hay componente, proceso finalizado
    nextState: 'verificacion_cierre',
    title: 'Proceso Finalizado',
    description: 'El hallazgo ha sido verificado y cerrado'
  },
  d4_verificacion_programada: {
    Component: undefined,
    nextState: 'verificacion_cierre',
    title: 'Proceso Finalizado',
    description: 'El hallazgo ha sido verificado y cerrado'
  },
  d5_verificacion_eficacia_realizada: {
    Component: undefined,
    nextState: 'verificacion_cierre',
    title: 'Proceso Finalizado',
    description: 'El hallazgo ha sido verificado y cerrado'
  }
};

export default hallazgoWorkflow;
