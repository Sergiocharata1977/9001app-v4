/**
 * Configuración dinámica en tiempo de ejecución
 * Este archivo se carga antes que la aplicación React y configura las URLs automáticamente
 */
(function() {
  // Detectar el entorno automáticamente basado en el hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  let apiBaseUrl;
  
  // Configuración según el entorno detectado
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Desarrollo local
    apiBaseUrl = 'http://localhost:5000/api';
  } else {
    // Producción o cualquier otro servidor
    // Usar el mismo hostname pero puerto 5000 para el backend
    // Si el backend está en un puerto diferente o subdominio, ajustar aquí
    apiBaseUrl = `${protocol}//${hostname}:5000/api`;
  }
  
  // Crear el objeto de configuración global
  window.__RUNTIME_CONFIG__ = {
    API_BASE_URL: apiBaseUrl,
    API_URL: apiBaseUrl, // Por compatibilidad
    APP_NAME: 'ISO Flow',
    APP_VERSION: '1.0.0',
    AUTH_ENABLED: true,
    TOKEN_KEY: 'iso_auth_token',
    THEME: 'light',
    LANGUAGE: 'es',
    // Información del entorno
    ENV: {
      hostname: hostname,
      protocol: protocol,
      port: port || (protocol === 'https:' ? '443' : '80'),
      isDevelopment: hostname === 'localhost' || hostname === '127.0.0.1',
      isProduction: hostname !== 'localhost' && hostname !== '127.0.0.1'
    }
  };
  
  // Log para debugging (solo en desarrollo)
  if (window.__RUNTIME_CONFIG__.ENV.isDevelopment) {
    console.log('Runtime Config loaded:', window.__RUNTIME_CONFIG__);
  }
})();
