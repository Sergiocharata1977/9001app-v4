import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CheckCircle } from 'lucide-react';
import React from 'react';
import DisenoDesarrolloKanbanCard from './DisenoDesarrolloKanbanCard';

const DisenoDesarrolloKanbanColumn = ({ id, title, description, proyectos, onCardClick, colorClasses, bgColor }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${colorClasses} border`}>
            <div className="p-4 border-b bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                            {description}
                        </p>
                    </div>
                    <span className="text-sm font-normal bg-gray-100 rounded-full px-2 py-0.5">
                        {proyectos.length}
                    </span>
                </div>
            </div>

            <div 
                ref={setNodeRef} 
                className="flex-grow p-4 space-y-4 overflow-y-auto min-h-96" 
                style={{ backgroundColor: bgColor + '30' }}
            >
                <SortableContext items={proyectos.map(p => p.id)}>
                    {proyectos.length > 0 ? (
                        proyectos.map((proyecto) => (
                            <DisenoDesarrolloKanbanCard
                                key={proyecto.id}
                                proyecto={proyecto}
                                onCardClick={onCardClick}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32 text-center text-sm text-gray-500 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                            <div>
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No hay proyectos<br />en esta etapa</p>
                            </div>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default DisenoDesarrolloKanbanColumn;
