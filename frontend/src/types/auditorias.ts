export interface Auditoria {
  id: number;
  codigo?: string;
  titulo?: string;
  descripcion?: string;
  auditor_lider?: string;
  equipo_auditor?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  tipo?: string;
  alcance?: string;
  criterios?: string;
  areas_auditadas?: string;
  hallazgos_count?: number;
  no_conformidades_count?: number;
  observaciones_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuditoriaFormData {
  codigo: string;
  titulo: string;
  descripcion: string;
  auditor_lider: string;
  equipo_auditor: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  tipo: string;
  alcance: string;
  criterios: string;
  areas_auditadas: string;
}

export interface CreateAuditoriaData {
  codigo: string;
  titulo: string;
  descripcion: string;
  auditor_lider: string;
  equipo_auditor: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  tipo: string;
  alcance: string;
  criterios: string;
  areas_auditadas: string;
}

export interface UpdateAuditoriaData {
  codigo?: string;
  titulo?: string;
  descripcion?: string;
  auditor_lider?: string;
  equipo_auditor?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  tipo?: string;
  alcance?: string;
  criterios?: string;
  areas_auditadas?: string;
}

export interface AuditoriaStats {
  total: number;
  planificacion: number;
  programacion: number;
  ejecucion: number;
  informe: number;
  seguimiento: number;
  cerrada: number;
}

export interface AuditoriaFilters {
  search?: string;
  estado?: string;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  auditor?: string;
  departamento?: string;
  prioridad?: string;
  proceso_sgc?: number;
  norma?: number;
  es_recurrente?: boolean;
  activo?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type AuditoriaViewMode = 'kanban' | 'grid' | 'list';

export type AuditoriaEstado = 'planificacion' | 'programacion' | 'ejecucion' | 'informe' | 'seguimiento' | 'cerrada';

export interface EstadoConfig {
  colorClasses: string;
  label: string;
  bgColor: string;
}

export interface AuditoriaField {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface AuditoriaService {
  getAllAuditorias: () => Promise<Auditoria[]>;
  getAuditoriaById: (id: number) => Promise<Auditoria>;
  createAuditoria: (data: AuditoriaFormData) => Promise<Auditoria>;
  updateAuditoria: (id: number, data: Partial<AuditoriaFormData>) => Promise<Auditoria>;
  deleteAuditoria: (id: number) => Promise<void>;
  changeEstado: (id: number, estado: AuditoriaEstado) => Promise<void>;
}

export interface AuditoriaKanbanColumn {
  id: AuditoriaEstado;
  title: string;
  color: string;
  auditorias: Auditoria[];
}

export interface AuditoriaCardProps {
  auditoria: Auditoria;
  onClick: (id: number) => void;
  onEdit: (auditoria: Auditoria) => void;
  onDelete: (id: number) => void;
  onStateChange: (id: number, estado: AuditoriaEstado) => void;
}
