import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

// Tipos estandarizados para Kanban
export interface KanbanColumn {
  id: string;
  title: string;
  states: string[];
  colorClasses: string;
  bgColor: string;
  icon?: React.ComponentType<any>;
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: 'alta' | 'media' | 'baja';
  assignedTo?: string;
  dueDate?: string;
  [key: string]: any; // Para campos específicos de cada módulo
}

export interface StandardKanbanBoardProps {
  items: KanbanItem[];
  columns: KanbanColumn[];
  onItemClick?: (item: KanbanItem) => void;
  onStatusChange?: (itemId: string, newStatus: string) => void;
  renderItem?: (item: KanbanItem) => React.ReactNode;
  className?: string;
}

// Componente de columna estandarizada
const StandardKanbanColumn: React.FC<{
  column: KanbanColumn;
  items: KanbanItem[];
  onItemClick?: (item: KanbanItem) => void;
  renderItem?: (item: KanbanItem) => React.ReactNode;
}> = ({ column, items, onItemClick, renderItem }) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className={`flex flex-col w-80 flex-shrink-0 rounded-lg ${column.colorClasses} border`}>
      <div className="p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-800">
            {column.icon && <column.icon className="w-4 h-4 mr-2" />}
            {column.title}
          </h3>
          <Badge variant="secondary" className="text-sm">
            {items.length}
          </Badge>
        </div>
      </div>

      <div 
        ref={setNodeRef} 
        className="flex-grow p-4 space-y-4 overflow-y-auto min-h-96" 
        style={{ backgroundColor: column.bgColor + '30' }}
      >
        <SortableContext items={items.map(item => item.id)}>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} onClick={() => onItemClick?.(item)}>
                {renderItem ? renderItem(item) : <DefaultKanbanCard item={item} />}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-center text-sm text-gray-500 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
              <div>
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay elementos<br />en este estado</p>
              </div>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

// Tarjeta por defecto
const DefaultKanbanCard: React.FC<{ item: KanbanItem }> = ({ item }) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'alta': return 'text-red-600';
      case 'media': return 'text-yellow-600';
      case 'baja': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-xs text-gray-600">
          {item.description && (
            <p className="line-clamp-2 text-gray-700">
              {item.description}
            </p>
          )}
          {item.assignedTo && (
            <div className="flex items-center gap-1">
              <span className="truncate">{item.assignedTo}</span>
            </div>
          )}
          {item.dueDate && (
            <div className="flex items-center gap-1">
              <span>{new Date(item.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal estandarizado
export const StandardKanbanBoard: React.FC<StandardKanbanBoardProps> = ({
  items,
  columns,
  onItemClick,
  onStatusChange,
  renderItem,
  className = ''
}) => {
  const [groupedItems, setGroupedItems] = useState<Record<string, KanbanItem[]>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Agrupa los elementos por columnas
    const grouped = columns.reduce((acc, column) => {
      acc[column.id] = items.filter(item => column.states.includes(item.status));
      return acc;
    }, {} as Record<string, KanbanItem[]>);
    
    setGroupedItems(grouped);
  }, [items, columns]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const item = items.find(i => i.id === active.id);
    if (!item) return;

    const activeColumn = columns.find(c => c.states.includes(item.status));
    if (over.id === activeColumn?.id) return;

    const newColumnId = over.id;
    const targetColumn = columns.find(c => c.id === newColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.states[0];
    onStatusChange?.(active.id, newStatus);
  };

  return (
    <div className={`flex gap-6 overflow-x-auto p-4 ${className}`}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {columns.map((column) => (
          <StandardKanbanColumn
            key={column.id}
            column={column}
            items={groupedItems[column.id] || []}
            onItemClick={onItemClick}
            renderItem={renderItem}
          />
        ))}
      </DndContext>
    </div>
  );
};

export default StandardKanbanBoard;
