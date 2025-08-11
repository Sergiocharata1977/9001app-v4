import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import AuditoriaKanbanColumn from './AuditoriaKanbanColumn';

// Definición de las columnas del Kanban para auditorías
const columnConfig = [
  { 
    id: 'planificacion', 
    title: 'Planificación', 
    states: ['planificacion', 'planificada'], 
    colorClasses: 'bg-blue-100 dark:bg-blue-900/40',
    bgColor: 'bg-blue-50'
  },
  { 
    id: 'programacion', 
    title: 'Programación', 
    states: ['programacion', 'programada'], 
    colorClasses: 'bg-purple-100 dark:bg-purple-900/40',
    bgColor: 'bg-purple-50'
  },
  { 
    id: 'ejecucion', 
    title: 'Ejecución', 
    states: ['ejecucion', 'en_ejecucion'], 
    colorClasses: 'bg-orange-100 dark:bg-orange-900/40',
    bgColor: 'bg-orange-50'
  },
  { 
    id: 'informe', 
    title: 'Informe', 
    states: ['informe', 'informes'], 
    colorClasses: 'bg-yellow-100 dark:bg-yellow-900/40',
    bgColor: 'bg-yellow-50'
  },
  { 
    id: 'seguimiento', 
    title: 'Seguimiento', 
    states: ['seguimiento'], 
    colorClasses: 'bg-indigo-100 dark:bg-indigo-900/40',
    bgColor: 'bg-indigo-50'
  },
  { 
    id: 'cerrada', 
    title: 'Cerrada', 
    states: ['cerrada', 'completada', 'finalizada'], 
    colorClasses: 'bg-green-100 dark:bg-green-900/40',
    bgColor: 'bg-green-50'
  },
];

const AuditoriaKanbanBoard = ({ auditorias, onCardClick, onAuditoriaStateChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Permite clics si el cursor no se mueve más de 8px
      },
    })
  );
  
  const [items, setItems] = useState({});

  useEffect(() => {
    // Agrupa las auditorías en las columnas definidas en columnConfig
    const auditoriasPorColumna = columnConfig.reduce((acc, column) => {
      acc[column.id] = auditorias.filter(a => column.states.includes(a.estado));
      return acc;
    }, {});
    setItems(auditoriasPorColumna);
    
    console.log('🔄 Agrupando auditorías por columna:', auditoriasPorColumna);
    console.log('📊 Total auditorías recibidas:', auditorias.length);
  }, [auditorias]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const auditoria = auditorias.find(a => a.id === active.id);
    if (!auditoria) return;

    const activeColumn = columnConfig.find(c => c.states.includes(auditoria.estado));
    
    // Si se suelta sobre la misma columna, no hacer nada
    if (over.id === activeColumn?.id) return;

    const auditoriaId = active.id;
    const newColumnId = over.id;

    const targetColumn = columnConfig.find(c => c.id === newColumnId);
    if (!targetColumn) return;

    // Al mover una tarjeta, se asigna el primer estado definido para esa columna
    const newEstado = targetColumn.states[0];
    
    if (onAuditoriaStateChange) {
      onAuditoriaStateChange(auditoriaId, newEstado);
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex-grow overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: `${columnConfig.length * 320}px` }}>
            {columnConfig.map((column) => (
              <AuditoriaKanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                auditorias={items[column.id] || []}
                onCardClick={onCardClick}
                colorClasses={column.colorClasses}
                bgColor={column.bgColor}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default AuditoriaKanbanBoard;
