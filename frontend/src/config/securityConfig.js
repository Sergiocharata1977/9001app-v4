/**
 * Configuración de Sistemas de Seguridad
 * 
 * Este archivo permite activar/desactivar temporalmente los sistemas de seguridad
 * para facilitar el despliegue en GitHub y servidor.
 * 
 * Para desactivar todos los sistemas: cambiar todos los valores a false
 * Para activar todos los sistemas: cambiar todos los valores a true
 */

export const SECURITY_CONFIG = {
  // Sistema de manejo de errores centralizado
  ENABLE_ERROR_HANDLER: false,
  
  // Estandarización del uso de toast
  ENABLE_TOAST_STANDARDIZATION: false,
  
  // React Query para estado del servidor
  ENABLE_REACT_QUERY: false,
  
  // Paginación optimizada
  ENABLE_OPTIMIZED_PAGINATION: false,
  
  // React.memo para componentes
  ENABLE_REACT_MEMO: false,
  
  // useCallback y useMemo
  ENABLE_OPTIMIZATION_HOOKS: false,
  
  // Feedback visual durante operaciones
  ENABLE_LOADING_STATES: false,
  
  // Validación de formularios
  ENABLE_FORM_VALIDATION: false
};

/**
 * Función para verificar si un sistema está habilitado
 * @param {string} systemName - Nombre del sistema a verificar
 * @returns {boolean} - true si está habilitado, false si no
 */
export function isSecuritySystemEnabled(systemName) {
  return SECURITY_CONFIG[systemName] || false;
}

/**
 * Función para obtener configuración completa
 * @returns {Object} - Configuración completa de seguridad
 */
export function getSecurityConfig() {
  return { ...SECURITY_CONFIG };
}

/**
 * Función para desactivar todos los sistemas de seguridad
 * Útil para despliegue temporal
 */
export function disableAllSecuritySystems() {
  Object.keys(SECURITY_CONFIG).forEach(key => {
    SECURITY_CONFIG[key] = false;
  });
}

/**
 * Función para activar todos los sistemas de seguridad
 * Útil para desarrollo local
 */
export function enableAllSecuritySystems() {
  Object.keys(SECURITY_CONFIG).forEach(key => {
    SECURITY_CONFIG[key] = true;
  });
} 