import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import AuditoriaKanbanCard from './AuditoriaKanbanCard';
import { CheckCircle } from 'lucide-react';

const AuditoriaKanbanColumn = ({ id, title, auditorias, onCardClick, colorClasses, bgColor }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${colorClasses} border`}>
      <div className="p-4 border-b bg-white rounded-t-lg">
        <h3 className="font-bold text-lg text-gray-800">
          {title}
          <span className="ml-2 text-sm font-normal bg-gray-100 rounded-full px-2 py-0.5">
            {auditorias.length}
          </span>
        </h3>
      </div>
      
      <div ref={setNodeRef} className="flex-grow p-4 space-y-4 overflow-y-auto min-h-96" style={{ backgroundColor: bgColor + '30' }}>
        <SortableContext items={auditorias.map(a => a.id)}>
          {auditorias.length > 0 ? (
            auditorias.map((auditoria) => (
              <AuditoriaKanbanCard 
                key={auditoria.id} 
                auditoria={auditoria} 
                onCardClick={onCardClick} 
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-center text-sm text-gray-500 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
              <div>
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay auditorías<br />en este estado</p>
              </div>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default AuditoriaKanbanColumn;
