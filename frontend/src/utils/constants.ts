/**
 * Constantes de la aplicación
 */

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
  AUDITOR: 'auditor'
};

// Estados de hallazgos
export const HALLAZGO_STATES = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  RESUELTO: 'resuelto',
  CERRADO: 'cerrado'
};

// Tipos de documentos
export const DOCUMENT_TYPES = {
  PROCEDIMIENTO: 'procedimiento',
  INSTRUCTIVO: 'instructivo',
  FORMATO: 'formato',
  REGISTRO: 'registro'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Configuración de API
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  DOCUMENTS: '/documents',
  HALLAZGOS: '/hallazgos',
  AUDITORIAS: '/auditorias'
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right'
}; 