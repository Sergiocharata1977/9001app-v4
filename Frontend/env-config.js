// 🔧 CONFIGURACIÓN DE ENTORNO - FRONTEND

/**
 * Función helper para obtener configuración con fallback
 */
const getConfig = (key, defaultValue) => {
  // Primero intentar con configuración dinámica (runtime)
  if (window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__[key] !== undefined) {
    return window.__RUNTIME_CONFIG__[key];
  }
  // Luego intentar con variables de entorno de Vite
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey] !== undefined) {
    return import.meta.env[viteKey];
  }
  // Valor por defecto
  return defaultValue;
};

export const config = {
  // 🌐 URL del Backend API
  API_URL: getConfig('API_URL', 'http://localhost:5000/api'),
  
  // 🔒 Configuración de autenticación
  AUTH_ENABLED: getConfig('AUTH_ENABLED', true) !== false && getConfig('AUTH_ENABLED', true) !== 'false',
  TOKEN_KEY: getConfig('TOKEN_KEY', 'auth_token'),
  
  // 📊 Configuración de la aplicación
  APP_NAME: getConfig('APP_NAME', 'ISO Flow'),
  APP_VERSION: getConfig('APP_VERSION', '1.0.0'),
  
  // 🎨 Configuración de UI
  THEME: getConfig('THEME', 'light'),
  LANGUAGE: getConfig('LANGUAGE', 'es'),
  
  // 🔧 Configuración de desarrollo
  IS_DEV: import.meta.env.DEV || (window.__RUNTIME_CONFIG__?.ENV?.isDevelopment || false),
  IS_PROD: import.meta.env.PROD || (window.__RUNTIME_CONFIG__?.ENV?.isProduction || false)
};

// Función para obtener la URL completa de la API
export const getApiUrl = (endpoint = '') => {
  return `${config.API_URL}${endpoint}`;
};

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem(config.TOKEN_KEY);
};

// Función para establecer el token de autenticación
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(config.TOKEN_KEY, token);
  } else {
    localStorage.removeItem(config.TOKEN_KEY);
  }
};
