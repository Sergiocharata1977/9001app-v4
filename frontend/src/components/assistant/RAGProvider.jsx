import React, { createContext, useContext, useState } from 'react';
import RAGAssistant from './RAGAssistant';

// Context para gestionar el estado del RAG
const RAGContext = createContext();

export const useRAG = () => {
  const context = useContext(RAGContext);
  if (!context) {
    throw new Error('useRAG debe usarse dentro de un RAGProvider');
  }
  return context;
};

export const RAGProvider = ({ children, organizationId = 1 }) => {
  const [isRAGVisible, setIsRAGVisible] = useState(false);

  const showRAG = () => setIsRAGVisible(true);
  const hideRAG = () => setIsRAGVisible(false);
  const toggleRAG = () => setIsRAGVisible(prev => !prev);

  return (
    <RAGContext.Provider value={{ showRAG, hideRAG, toggleRAG }}>
      {children}
      {isRAGVisible && <RAGAssistant onClose={hideRAG} organizationId={organizationId} />}
    </RAGContext.Provider>
  );
};

export default RAGProvider;

