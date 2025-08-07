// 🔧 CONFIGURACIÓN DE ENTORNO - FRONTEND

export const config = {
  // 🌐 URL del Backend API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // 🔒 Configuración de autenticación
  AUTH_ENABLED: import.meta.env.VITE_AUTH_ENABLED !== 'false',
  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || 'auth_token',
  
  // 📊 Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ISO Flow',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // 🎨 Configuración de UI
  THEME: import.meta.env.VITE_THEME || 'light',
  LANGUAGE: import.meta.env.VITE_LANGUAGE || 'es',
  
  // 🔧 Configuración de desarrollo
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD
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
