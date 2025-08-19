// Configuración override para el entorno de desarrollo
window.RUNTIME_CONFIG = {
  API_URL: 'http://localhost:5000',
  ENVIRONMENT: 'development',
  DEBUG: true,
  VERSION: '1.0.0',
  FEATURES: {
    AGENT_COORDINATION: true,
    SYSTEM_MONITORING: true,
    PERFORMANCE_MONITORING: true
  }
};
