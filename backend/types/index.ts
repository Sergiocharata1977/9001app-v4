
// Tipos básicos para la aplicación
export interface User {
  _id: string;
  id: number;
  email: string;
  password: string;
  role: 'super_admin' | 'org_admin' | 'manager' | 'user' | 'auditor';
  organization_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Organization {
  _id: string;
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Proceso {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Indicador {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  unidad: string;
  meta: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Medicion {
  _id: string;
  id: number;
  indicador_id: number;
  valor: number;
  fecha_medicion: Date;
  observaciones: string;
  created_at: Date;
  updated_at: Date;
}

export interface ObjetivoCalidad {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  indicador_id: number;
  proceso_id: number;
  meta: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: 'activo' | 'completado' | 'cancelado';
  created_at: Date;
  updated_at: Date;
}

export interface Auditoria {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  tipo: 'interna' | 'externa';
  fecha_inicio: Date;
  fecha_fin: Date;
  auditor_id: number;
  estado: 'planificada' | 'en_progreso' | 'completada';
  created_at: Date;
  updated_at: Date;
}

export interface Hallazgo {
  _id: string;
  id: number;
  auditoria_id: number;
  proceso_id: number;
  descripcion: string;
  tipo: 'no_conformidad' | 'observacion' | 'oportunidad_mejora';
  severidad: 'alta' | 'media' | 'baja';
  estado: 'abierto' | 'cerrado';
  created_at: Date;
  updated_at: Date;
}

export interface Accion {
  _id: string;
  id: number;
  hallazgo_id: number;
  descripcion: string;
  tipo: 'correctiva' | 'preventiva';
  responsable_id: number;
  fecha_limite: Date;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  created_at: Date;
  updated_at: Date;
}

export interface Personal {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  puesto_id: number;
  departamento_id: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Departamento {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  responsable_id: number;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Plan {
  _id: string;
  id: number;
  organization_id: number;
  nombre: string;
  descripcion: string;
  precio_mensual: number;
  max_usuarios: number;
  max_procesos: number;
  max_documentos: number;
  features: string[];
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at: Date;
}

export interface Suscripcion {
  _id: string;
  id: number;
  organization_id: number;
  plan_id: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: 'activa' | 'suspendida' | 'cancelada';
  created_at: Date;
  updated_at: Date;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Tipos para filtros y búsquedas
export interface FilterOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  organization_id?: number;
  estado?: string;
}

export interface SearchFilters {
  [key: string]: any;
}
