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
