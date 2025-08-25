import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { hallazgosService } from '@/services/hallazgosService';
import { toast } from 'sonner';
import type { 
  KanbanBoardProps, 
  KanbanColumn as KanbanColumnType, 
  Hallazgo, 
  EstadoMap 
} from '@/types/mejoras';

const estadoMap: EstadoMap = {
  d1_iniciado: 'Iniciado',
  d2_accion_inmediata_programada: 'Planificado',
  d3_accion_inmediata_finalizada: 'Ejecutado',
  t1_pendiente_ac: 'En Análisis',
  t2_cerrado: 'Cerrado',
};

export default function KanbanBoard({ hallazgos, onUpdate }: KanbanBoardProps): React.JSX.Element {
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [activeHallazgo, setActiveHallazgo] = useState<Hallazgo | null>(null);

  useEffect(() => {
    const groupedHallazgos = Object.keys(estadoMap).reduce((acc, estadoKey) => {
      acc[estadoKey] = hallazgos
        .filter(h => h.estado === estadoKey)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));
      return acc;
    }, {} as Record<string, Hallazgo[]>);

    const boardColumns: KanbanColumnType[] = Object.keys(estadoMap).map(estadoKey => ({
      id: estadoKey,
      title: estadoMap[estadoKey],
      hallazgos: groupedHallazgos[estadoKey] || [],
    }));
    setColumns(boardColumns);
  }, [hallazgos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px
      },
    })
  );

  function handleDragStart(event: DragStartEvent): void {
    if (event.active.data.current?.type === 'Hallazgo') {
      setActiveHallazgo(event.active.data.current.hallazgo || null);
    }
  }

  async function handleDragEnd(event: DragEndEvent): Promise<void> {
    setActiveHallazgo(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = active.data.current?.sortable?.containerId;
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (activeContainer !== overContainer) {
      // Mover a otra columna (cambio de estado)
      const hallazgoId = Number(activeId);
      const nuevoEstado = overContainer;
      try {
        await hallazgosService.updateHallazgo(hallazgoId, { estado: nuevoEstado });
        toast.success('Hallazgo actualizado correctamente.');
        onUpdate(); // Actualiza la lista de hallazgos
      } catch (error) {
        toast.error('Error al actualizar el estado del hallazgo.');
      }
    } else {
      // Reordenar en la misma columna
      const columnIndex = columns.findIndex(col => col.id === activeContainer);
      const oldIndex = columns[columnIndex].hallazgos.findIndex(h => h.id === Number(activeId));
      const newIndex = columns[columnIndex].hallazgos.findIndex(h => h.id === Number(overId));
      
      if (oldIndex !== newIndex) {
        const newHallazgosOrder = arrayMove(columns[columnIndex].hallazgos, oldIndex, newIndex);
        // Aquí se debería llamar a la API para guardar el nuevo orden
        console.log('Nuevo orden:', newHallazgosOrder.map(h => h.id));
        // onUpdate() o una actualización local para reflejar el cambio visualmente
        const newColumns = [...columns];
        newColumns[columnIndex].hallazgos = newHallazgosOrder;
        setColumns(newColumns);
        toast.info('Reordenamiento visual (API no implementada).');
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        <SortableContext items={columns.map(col => col.id)}>
          {columns.map(col => (
            <KanbanColumn key={col.id} id={col.id} title={col.title} hallazgos={col.hallazgos} />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeHallazgo && <KanbanCard hallazgo={activeHallazgo} />}
      </DragOverlay>
    </DndContext>
  );
}
