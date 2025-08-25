import { KanbanColumn } from '@/components/common/StandardKanbanBoard';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  Users, 
  TrendingUp,
  Package,
  Shield,
  Eye,
  Settings,
  Zap,
  Star,
  Award,
  AlertCircle,
  CheckSquare,
  Monitor,
  Lock
} from 'lucide-react';

// Configuración estandarizada para efectos visuales
export const KANBAN_VISUAL_CONFIG = {
  // Colores base para estados
  colors: {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      header: 'bg-blue-100 dark:bg-blue-900/40'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      header: 'bg-orange-100 dark:bg-orange-900/40'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      header: 'bg-purple-100 dark:bg-purple-900/40'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      header: 'bg-green-100 dark:bg-green-900/40'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      header: 'bg-yellow-100 dark:bg-yellow-900/40'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      header: 'bg-indigo-100 dark:bg-indigo-900/40'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      header: 'bg-red-100 dark:bg-red-900/40'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      header: 'bg-gray-100 dark:bg-gray-900/40'
    }
  },
  
  // Efectos de hover y transiciones
  effects: {
    cardHover: 'hover:shadow-md transition-shadow duration-200',
    columnHover: 'hover:bg-opacity-80 transition-colors duration-200',
    dragActive: 'opacity-50 scale-95',
    dropZone: 'border-2 border-dashed border-gray-300 bg-gray-50/50'
  },
  
  // Dimensiones estandarizadas
  dimensions: {
    columnWidth: 'w-80',
    cardMinHeight: 'min-h-24',
    columnMinHeight: 'min-h-96',
    gap: 'gap-6'
  }
};

// Configuración para Hallazgos
export const HALLAZGOS_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'identificado',
    title: 'Identificado',
    states: ['Identificado', 'Detectado'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.red.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.red.bg,
    icon: AlertCircle
  },
  {
    id: 'analisis',
    title: 'En Análisis',
    states: ['En Análisis', 'Analizando'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.orange.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.orange.bg,
    icon: Eye
  },
  {
    id: 'accion',
    title: 'En Acción',
    states: ['En Acción', 'Implementando'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: Zap
  },
  {
    id: 'verificacion',
    title: 'En Verificación',
    states: ['En Verificación', 'Verificando'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.yellow.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.yellow.bg,
    icon: CheckSquare
  },
  {
    id: 'cerrado',
    title: 'Cerrado',
    states: ['Cerrado', 'Resuelto'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: CheckCircle
  }
];

// Configuración para Acciones
export const ACCIONES_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'planificada',
    title: 'Planificada',
    states: ['Planificada', 'Programada'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: FileText
  },
  {
    id: 'en_proceso',
    title: 'En Proceso',
    states: ['En Proceso', 'Ejecutando'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.orange.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.orange.bg,
    icon: Clock
  },
  {
    id: 'verificacion',
    title: 'En Verificación',
    states: ['En Verificación', 'Verificando'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.yellow.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.yellow.bg,
    icon: CheckSquare
  },
  {
    id: 'implementada',
    title: 'Implementada',
    states: ['Implementada', 'Completada'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: CheckCircle
  }
];

// Configuración para Capacitaciones
export const CAPACITACIONES_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'planificacion',
    title: 'Planificación',
    states: ['Planificada', 'Programada'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: FileText
  },
  {
    id: 'preparacion',
    title: 'En Preparación',
    states: ['En Preparación', 'Preparando Material'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.orange.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.orange.bg,
    icon: Settings
  },
  {
    id: 'evaluacion',
    title: 'En Evaluación',
    states: ['En Evaluación', 'Evaluando Resultados'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.purple.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.purple.bg,
    icon: Target
  },
  {
    id: 'completada',
    title: 'Completada',
    states: ['Completada', 'Finalizada', 'Cerrada'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: Award
  }
];

// Configuración para Oportunidades Agro
export const OPORTUNIDADES_AGRO_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'prospeccion',
    title: 'Prospección',
    states: ['prospeccion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: Eye
  },
  {
    id: 'diagnostico',
    title: 'Diagnóstico',
    states: ['diagnostico'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.purple.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.purple.bg,
    icon: Target
  },
  {
    id: 'propuesta_tecnica',
    title: 'Propuesta Técnica',
    states: ['propuesta_tecnica'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.orange.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.orange.bg,
    icon: FileText
  },
  {
    id: 'demostracion',
    title: 'Demostración',
    states: ['demostracion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.yellow.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.yellow.bg,
    icon: Star
  },
  {
    id: 'negociacion',
    title: 'Negociación',
    states: ['negociacion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.indigo.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.indigo.bg,
    icon: TrendingUp
  },
  {
    id: 'cerrada',
    title: 'Cerrada',
    states: ['cerrada_ganada', 'cerrada_perdida'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: CheckCircle
  }
];

// Configuración para Productos
export const PRODUCTOS_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'borrador',
    title: 'Borrador',
    states: ['borrador', 'planificacion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.gray.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.gray.bg,
    icon: FileText
  },
  {
    id: 'en_revision',
    title: 'En Revisión',
    states: ['en_revision', 'verificacion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.yellow.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.yellow.bg,
    icon: Eye
  },
  {
    id: 'aprobado',
    title: 'Aprobado',
    states: ['aprobado', 'validacion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: CheckCircle
  },
  {
    id: 'en_produccion',
    title: 'En Producción',
    states: ['en_produccion', 'produccion'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: Package
  },
  {
    id: 'descontinuado',
    title: 'Descontinuado',
    states: ['descontinuado', 'obsoleto'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.red.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.red.bg,
    icon: AlertTriangle
  }
];

// Configuración para Análisis de Riesgo
export const ANALISIS_RIESGO_KANBAN_CONFIG: KanbanColumn[] = [
  {
    id: 'identificado',
    title: 'Identificado',
    states: ['identificado', 'detectado'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.red.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.red.bg,
    icon: AlertCircle
  },
  {
    id: 'evaluado',
    title: 'Evaluado',
    states: ['evaluado', 'analizado'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.orange.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.orange.bg,
    icon: Target
  },
  {
    id: 'mitigado',
    title: 'Mitigado',
    states: ['mitigado', 'controlado'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.yellow.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.yellow.bg,
    icon: Shield
  },
  {
    id: 'monitoreado',
    title: 'Monitoreado',
    states: ['monitoreado', 'seguimiento'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.blue.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.blue.bg,
    icon: Monitor
  },
  {
    id: 'cerrado',
    title: 'Cerrado',
    states: ['cerrado', 'resuelto'],
    colorClasses: KANBAN_VISUAL_CONFIG.colors.green.header,
    bgColor: KANBAN_VISUAL_CONFIG.colors.green.bg,
    icon: Lock
  }
];

// Función helper para obtener configuración por módulo
export const getKanbanConfig = (module: string): KanbanColumn[] => {
  switch (module) {
    case 'hallazgos':
      return HALLAZGOS_KANBAN_CONFIG;
    case 'acciones':
      return ACCIONES_KANBAN_CONFIG;
    case 'capacitaciones':
      return CAPACITACIONES_KANBAN_CONFIG;
    case 'oportunidades_agro':
      return OPORTUNIDADES_AGRO_KANBAN_CONFIG;
    case 'productos':
      return PRODUCTOS_KANBAN_CONFIG;
    case 'analisis_riesgo':
      return ANALISIS_RIESGO_KANBAN_CONFIG;
    default:
      return [];
  }
};
