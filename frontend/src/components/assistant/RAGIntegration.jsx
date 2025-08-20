import React from 'react';
import { RAGProvider } from './RAGProvider';
import RAGButton from './RAGButton';
import { isRAGEnabled } from '@/config/rag.config';

/**
 * Componente de integración RAG
 * 
 * USO:
 * 1. Envuelve tu app con RAGIntegration
 * 2. El botón aparecerá automáticamente si RAG está habilitado
 * 3. Para desactivar, cambia ENABLED: false en rag.config.js
 */
const RAGIntegration = ({ children, organizationId = 1 }) => {
  // Si RAG está deshabilitado, solo renderizar children
  if (!isRAGEnabled()) {
    return <>{children}</>;
  }

  return (
    <RAGProvider organizationId={organizationId}>
      {children}
      <RAGButton />
    </RAGProvider>
  );
};

export default RAGIntegration;

/**
 * EJEMPLO DE USO EN App.jsx:
 * 
 * import RAGIntegration from '@/components/assistant/RAGIntegration';
 * 
 * function App() {
 *   return (
 *     <RAGIntegration organizationId={1}>
 *       <Router>
 *         <Routes>
 *           {/* Tus rutas aquí */}
 *         </Routes>
 *       </Router>
 *     </RAGIntegration>
 *   );
 * }
 * 
 * 
 * PARA DESACTIVAR RAG:
 * 1. Ve a frontend/src/config/rag.config.js
 * 2. Cambia ENABLED: false
 * 3. El botón desaparecerá automáticamente
 * 
 * PARA ACTIVAR RAG:
 * 1. Ve a frontend/src/config/rag.config.js  
 * 2. Cambia ENABLED: true
 * 3. El botón aparecerá automáticamente
 */
