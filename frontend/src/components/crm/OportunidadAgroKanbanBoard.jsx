import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import OportunidadAgroKanbanColumn from './OportunidadAgroKanbanColumn';

// Definición de las columnas del Kanban para oportunidades agro
const columnConfig = [
    {
        id: 'prospeccion',
        title: 'Prospección',
        states: ['prospeccion'],
        colorClasses: 'bg-blue-100 dark:bg-blue-900/40',
        bgColor: 'bg-blue-50'
    },
    {
        id: 'diagnostico',
        title: 'Diagnóstico',
        states: ['diagnostico'],
        colorClasses: 'bg-purple-100 dark:bg-purple-900/40',
        bgColor: 'bg-purple-50'
    },
    {
        id: 'propuesta_tecnica',
        title: 'Propuesta Técnica',
        states: ['propuesta_tecnica'],
        colorClasses: 'bg-orange-100 dark:bg-orange-900/40',
        bgColor: 'bg-orange-50'
    },
    {
        id: 'demostracion',
        title: 'Demostración',
        states: ['demostracion'],
        colorClasses: 'bg-yellow-100 dark:bg-yellow-900/40',
        bgColor: 'bg-yellow-50'
    },
    {
        id: 'negociacion',
        title: 'Negociación',
        states: ['negociacion'],
        colorClasses: 'bg-indigo-100 dark:bg-indigo-900/40',
        bgColor: 'bg-indigo-50'
    },
    {
        id: 'cerrada',
        title: 'Cerrada',
        states: ['cerrada_ganada', 'cerrada_perdida'],
        colorClasses: 'bg-green-100 dark:bg-green-900/40',
        bgColor: 'bg-green-50'
    },
];

const OportunidadAgroKanbanBoard = ({ oportunidades, onCardClick, onOportunidadStateChange }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Permite clics si el cursor no se mueve más de 8px
            },
        })
    );

    const [items, setItems] = useState({});

    useEffect(() => {
        // Agrupa las oportunidades en las columnas definidas en columnConfig
        const oportunidadesPorColumna = columnConfig.reduce((acc, column) => {
            acc[column.id] = oportunidades.filter(o => column.states.includes(o.etapa));
            return acc;
        }, {});
        setItems(oportunidadesPorColumna);

        console.log('🔄 Agrupando oportunidades por columna:', oportunidadesPorColumna);
        console.log('📊 Total oportunidades recibidas:', oportunidades.length);
    }, [oportunidades]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const oportunidad = oportunidades.find(o => o.id === active.id);
        if (!oportunidad) return;

        const activeColumn = columnConfig.find(c => c.states.includes(oportunidad.etapa));

        // Si se suelta sobre la misma columna, no hacer nada
        if (over.id === activeColumn?.id) return;

        const oportunidadId = active.id;
        const newColumnId = over.id;

        const targetColumn = columnConfig.find(c => c.id === newColumnId);
        if (!targetColumn) return;

        // Al mover una tarjeta, se asigna el primer estado definido para esa columna
        const newEstado = targetColumn.states[0];

        if (onOportunidadStateChange) {
            onOportunidadStateChange(oportunidadId, newEstado);
        }
    };

    return (
        <div className="flex flex-col flex-grow">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="flex-grow overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: `${columnConfig.length * 320}px` }}>
                        {columnConfig.map((column) => (
                            <OportunidadAgroKanbanColumn
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                oportunidades={items[column.id] || []}
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

export default OportunidadAgroKanbanBoard;
