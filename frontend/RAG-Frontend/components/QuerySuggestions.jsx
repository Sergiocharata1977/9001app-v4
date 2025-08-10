/**
 * Query Suggestions Component
 * Componente para mostrar sugerencias de consultas RAG
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export const QuerySuggestions = ({ 
  suggestions, 
  onSelect, 
  show, 
  onToggle,
  maxSuggestions = 5 
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <div className="space-y-2">
      {/* Botón para mostrar/ocultar sugerencias */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Lightbulb size={12} />
        <span>Sugerencias ({suggestions.length})</span>
        {show ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {/* Lista de sugerencias */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {displayedSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => onSelect(suggestion)}
                className="w-full text-left p-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                whileHover={{ x: 2 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 