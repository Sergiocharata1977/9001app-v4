export interface Capacitacion {
  id: number;
  nombre?: string;
  titulo?: string;
  descripcion?: string;
  instructor?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  duracion_horas?: number;
  modalidad?: string;
  estado?: string;
  ubicacion?: string;
  costo?: number;
  cupo_maximo?: number;
  cupo_actual?: number;
  requisitos?: string;
  objetivos?: string;
  contenido?: string;
  metodologia?: string;
  evaluacion?: string;
  certificacion?: boolean;
  created_at?: string;
  updated_at?: string;
  tipo?: string;
  hora_inicio?: string;
  hora_fin?: string;
  participantes?: any[];
}

export interface CapacitacionFormData {
  nombre: string;
  descripcion: string;
  instructor: string;
  fecha_inicio: string;
  fecha_fin: string;
  duracion_horas: number;
  modalidad: string;
  estado: string;
  ubicacion: string;
  costo: number;
  cupo_maximo: number;
  requisitos: string;
  objetivos: string;
  contenido: string;
  metodologia: string;
  evaluacion: string;
  certificacion: boolean;
}

export interface CreateCapacitacionData {
  nombre: string;
  descripcion: string;
  instructor: string;
  fecha_inicio: string;
  fecha_fin: string;
  duracion_horas: number;
  modalidad: string;
  estado: string;
  ubicacion: string;
  costo: number;
  cupo_maximo: number;
  requisitos: string;
  objetivos: string;
  contenido: string;
  metodologia: string;
  evaluacion: string;
  certificacion: boolean;
  tipo?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface UpdateCapacitacionData {
  nombre?: string;
  descripcion?: string;
  instructor?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  duracion_horas?: number;
  modalidad?: string;
  estado?: string;
  ubicacion?: string;
  costo?: number;
  cupo_maximo?: number;
  requisitos?: string;
  objetivos?: string;
  contenido?: string;
  metodologia?: string;
  evaluacion?: string;
  certificacion?: boolean;
  tipo?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface CapacitacionStats {
  total: number;
  planificadas: number;
  enPreparacion: number;
  completadas: number;
}

export interface CapacitacionFilters {
  search?: string;
  estado?: string;
  tipo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  instructor?: string;
  departamento?: string;
  modalidad?: string;
  proceso_sgc?: number;
  norma?: number;
  activo?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type ViewMode = 'grid' | 'list';

export interface CapacitacionField {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface CapacitacionService {
  getAll: () => Promise<Capacitacion[]>;
  getById: (id: number) => Promise<Capacitacion>;
  create: (data: CapacitacionFormData) => Promise<Capacitacion>;
  update: (id: number, data: Partial<CapacitacionFormData>) => Promise<Capacitacion>;
  delete: (id: number) => Promise<void>;
}
