import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useRAG } from './RAGProvider';
import { RAG_CONFIG, isRAGEnabled } from '@/config/rag.config';

const RAGButton = () => {
  const { toggleRAG } = useRAG();

  // 🚫 Si RAG está deshabilitado, no mostrar el botón
  if (!isRAGEnabled()) {
    return null;
  }

  // 🎨 Configurar posición y color del botón
  const getButtonClasses = () => {
    const position = RAG_CONFIG.UI.BUTTON_POSITION;
    const color = RAG_CONFIG.UI.BUTTON_COLOR;
    
    const positionClasses = {
      'bottom-right': 'fixed bottom-5 right-5',
      'bottom-left': 'fixed bottom-5 left-5',
      'top-right': 'fixed top-5 right-5'
    };
    
    const colorClasses = {
      'blue': 'bg-blue-600 hover:bg-blue-700',
      'green': 'bg-green-600 hover:bg-green-700',
      'purple': 'bg-purple-600 hover:bg-purple-700',
      'orange': 'bg-orange-600 hover:bg-orange-700'
    };
    
    return `${positionClasses[position]} h-12 w-12 rounded-full shadow-lg ${colorClasses[color]} text-white border-0`;
  };

  return (
    <Button
      onClick={toggleRAG}
      variant="outline"
      size="icon"
      className={getButtonClasses()}
      title="Asistente RAG"
    >
      <Brain size={20} />
    </Button>
  );
};

export default RAGButton;

