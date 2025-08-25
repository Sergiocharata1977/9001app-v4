import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import DisenoDesarrolloKanbanColumn from './DisenoDesarrolloKanbanColumn';

// Definición de las columnas del Kanban para Diseño y Desarrollo según ISO 9001:2015
const columnConfig = [
    {
        id: 'planificacion',
        title: 'Planificación',
        states: ['planificacion'],
        colorClasses: 'bg-blue-100 dark:bg-blue-900/40',
        bgColor: 'bg-blue-50',
        description: 'Definir etapas, actividades, responsabilidades'
    },
    {
        id: 'entradas',
        title: 'Entradas',
        states: ['entradas'],
        colorClasses: 'bg-purple-100 dark:bg-purple-900/40',
        bgColor: 'bg-purple-50',
        description: 'Requisitos, información legal, normas aplicables'
    },
    {
        id: 'diseno',
        title: 'Diseño',
        states: ['diseno'],
        colorClasses: 'bg-green-100 dark:bg-green-900/40',
        bgColor: 'bg-green-50',
        description: 'Desarrollo del producto/servicio'
    },
    {
        id: 'revision',
        title: 'Revisión',
        states: ['revision'],
        colorClasses: 'bg-orange-100 dark:bg-orange-900/40',
        bgColor: 'bg-orange-50',
        description: 'Verificación sistemática'
    },
    {
        id: 'verificacion',
        title: 'Verificación',
        states: ['verificacion'],
        colorClasses: 'bg-yellow-100 dark:bg-yellow-900/40',
        bgColor: 'bg-yellow-50',
        description: 'Cumplimiento de requisitos'
    },
    {
        id: 'validacion',
        title: 'Validación',
        states: ['validacion'],
        colorClasses: 'bg-indigo-100 dark:bg-indigo-900/40',
        bgColor: 'bg-indigo-50',
        description: 'Cumplimiento de necesidades del cliente'
    },
    {
        id: 'salidas',
        title: 'Salidas',
        states: ['salidas'],
        colorClasses: 'bg-teal-100 dark:bg-teal-900/40',
        bgColor: 'bg-teal-50',
        description: 'Documentación final'
    },
    {
        id: 'control_cambios',
        title: 'Control de Cambios',
        states: ['control_cambios'],
        colorClasses: 'bg-red-100 dark:bg-red-900/40',
        bgColor: 'bg-red-50',
        description: 'Gestión de modificaciones'
    }
];

const DisenoDesarrolloKanbanBoard = ({ proyectos, onCardClick, onProyectoStateChange }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const [items, setItems] = useState({});

    useEffect(() => {
        // Agrupa los proyectos en las columnas definidas en columnConfig
        const proyectosPorColumna = columnConfig.reduce((acc, column) => {
            acc[column.id] = proyectos.filter(p => column.states.includes(p.etapa_actual));
            return acc;
        }, {});
        setItems(proyectosPorColumna);

        console.log('🔧 Agrupando proyectos por columna:', proyectosPorColumna);
        console.log('📊 Total proyectos recibidos:', proyectos.length);
    }, [proyectos]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const proyecto = proyectos.find(p => p.id === active.id);
        if (!proyecto) return;

        const activeColumn = columnConfig.find(c => c.states.includes(proyecto.etapa_actual));

        // Si se suelta sobre la misma columna, no hacer nada
        if (over.id === activeColumn?.id) return;

        const proyectoId = active.id;
        const newColumnId = over.id;

        const targetColumn = columnConfig.find(c => c.id === newColumnId);
        if (!targetColumn) return;

        // Al mover una tarjeta, se asigna el primer estado definido para esa columna
        const newEstado = targetColumn.states[0];

        if (onProyectoStateChange) {
            onProyectoStateChange(proyectoId, newEstado);
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto p-4">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                {columnConfig.map((column) => (
                    <DisenoDesarrolloKanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        description={column.description}
                        proyectos={items[column.id] || []}
                        onCardClick={onCardClick}
                        colorClasses={column.colorClasses}
                        bgColor={column.bgColor}
                    />
                ))}
            </DndContext>
        </div>
    );
};

export default DisenoDesarrolloKanbanBoard;
