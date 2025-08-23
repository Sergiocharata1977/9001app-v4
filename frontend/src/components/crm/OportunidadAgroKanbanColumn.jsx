import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CheckCircle } from 'lucide-react';
import React from 'react';
import OportunidadAgroKanbanCard from './OportunidadAgroKanbanCard';

const OportunidadAgroKanbanColumn = ({ id, title, oportunidades, onCardClick, colorClasses, bgColor }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${colorClasses} border`}>
            <div className="p-4 border-b bg-white rounded-t-lg">
                <h3 className="font-bold text-lg text-gray-800">
                    {title}
                    <span className="ml-2 text-sm font-normal bg-gray-100 rounded-full px-2 py-0.5">
                        {oportunidades.length}
                    </span>
                </h3>
            </div>

            <div ref={setNodeRef} className="flex-grow p-4 space-y-4 overflow-y-auto min-h-96" style={{ backgroundColor: bgColor + '30' }}>
                <SortableContext items={oportunidades.map(o => o.id)}>
                    {oportunidades.length > 0 ? (
                        oportunidades.map((oportunidad) => (
                            <OportunidadAgroKanbanCard
                                key={oportunidad.id}
                                oportunidad={oportunidad}
                                onCardClick={onCardClick}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32 text-center text-sm text-gray-500 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                            <div>
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>No hay oportunidades<br />en este estado</p>
                            </div>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default OportunidadAgroKanbanColumn;
