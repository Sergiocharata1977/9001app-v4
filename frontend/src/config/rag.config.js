/**
 * Configuración simple para el sistema RAG
 * Cambia RAG_ENABLED a false para desactivar completamente el sistema
 */

export const RAG_CONFIG = {
  // 🎛️ CONTROL PRINCIPAL - Cambia esto para activar/desactivar RAG
  ENABLED: false, // RAG DESHABILITADO - Comentado temporalmente
  
  // 🏢 Configuración de organización
  ORGANIZATION_ID: 1,
  
  // 🎨 Configuración de UI
  UI: {
    BUTTON_POSITION: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right'
    BUTTON_COLOR: 'blue', // 'blue', 'green', 'purple', 'orange'
    AUTO_SHOW: false, // Mostrar automáticamente al cargar
  },
  
  // 🔧 Configuración de API
  API: {
    BASE_URL: '/api/rag',
    TIMEOUT: 30000, // 30 segundos
    RETRY_ATTEMPTS: 3,
  },
  
  // 📊 Configuración de estadísticas
  STATS: {
    SHOW_EMBEDDINGS_COUNT: true,
    SHOW_SOURCES_COUNT: true,
    AUTO_REFRESH: true,
    REFRESH_INTERVAL: 30000, // 30 segundos
  },
  
  // 💬 Configuración de chat
  CHAT: {
    MAX_MESSAGES: 50,
    SAVE_HISTORY: true,
    SUGGESTIONS_ENABLED: true,
    COPY_BUTTON: true,
  }
};

// 🚀 Función para verificar si RAG está habilitado
export const isRAGEnabled = () => {
  return RAG_CONFIG.ENABLED;
};

// 🔄 Función para cambiar el estado de RAG
export const toggleRAG = (enabled) => {
  RAG_CONFIG.ENABLED = enabled;
  console.log(`RAG ${enabled ? 'activado' : 'desactivado'}`);
  return RAG_CONFIG.ENABLED;
};

// 📋 Función para obtener configuración
export const getRAGConfig = () => {
  return { ...RAG_CONFIG };
};

export default RAG_CONFIG;
