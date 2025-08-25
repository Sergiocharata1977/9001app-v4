import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { crmService } from '@/services/crmService';
import { toast } from 'sonner';

// Configuración de etapas del pipeline de ventas
const ETAPAS_OPORTUNIDADES = {
  prospeccion: {
    title: 'Prospección',
    color: 'bg-gray-100 border-gray-300',
    icon: Target,
    count: 0
  },
  calificacion: {
    title: 'Calificación',
    color: 'bg-blue-100 border-blue-300',
    icon: Users,
    count: 0
  },
  propuesta: {
    title: 'Propuesta',
    color: 'bg-yellow-100 border-yellow-300',
    icon: Calendar,
    count: 0
  },
  negociacion: {
    title: 'Negociación',
    color: 'bg-orange-100 border-orange-300',
    icon: DollarSign,
    count: 0
  },
  cerrada_ganada: {
    title: 'Ganada',
    color: 'bg-green-100 border-green-300',
    icon: DollarSign,
    count: 0
  },
  cerrada_perdida: {
    title: 'Perdida',
    color: 'bg-red-100 border-red-300',
    icon: Target,
    count: 0
  }
};

// Componente de tarjeta de oportunidad
const OportunidadCard = ({ oportunidad, onClick }) => {
  const etapa = ETAPAS_OPORTUNIDADES[oportunidad.etapa];
  
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor || 0);
  };
  
  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(oportunidad)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm truncate">{oportunidad.descripcion || 'Sin descripción'}</h4>
          <Badge variant="outline" className="text-xs">
            {formatearMoneda(oportunidad.valor_estimado)}
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>{oportunidad.cliente_nombre || 'Cliente no especificado'}</span>
          </div>
          <div className="flex items-center">
            <Target className="w-3 h-3 mr-1" />
            <span>{oportunidad.vendedor_nombre || 'Vendedor no asignado'}</span>
          </div>
          {oportunidad.fecha_cierre_esperada && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{new Date(oportunidad.fecha_cierre_esperada).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${oportunidad.probabilidad || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{oportunidad.probabilidad || 0}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de columna Kanban
const KanbanColumn = ({ etapa, oportunidades, onCardClick, onDrop }) => {
  const config = ETAPAS_OPORTUNIDADES[etapa];
  const Icon = config.icon;
  
  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`${config.color} border-2`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {oportunidades.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {oportunidades.map((oportunidad) => (
              <OportunidadCard
                key={oportunidad.id}
                oportunidad={oportunidad}
                onClick={onCardClick}
              />
            ))}
          </div>
          
          {oportunidades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Sin oportunidades</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componente principal Kanban Board
const CRMKanbanBoard = ({ oportunidades = [], onOportunidadClick, onEstadoChange }) => {
  const [columns, setColumns] = useState({});
  const [activeOportunidad, setActiveOportunidad] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 }
    })
  );

  useEffect(() => {
    // Agrupar oportunidades por etapa
    const grouped = Object.keys(ETAPAS_OPORTUNIDADES).reduce((acc, etapa) => {
      acc[etapa] = oportunidades.filter(op => op.etapa === etapa);
      return acc;
    }, {});
    setColumns(grouped);
  }, [oportunidades]);

  const handleDragStart = (event) => {
    const oportunidad = oportunidades.find(op => op.id === event.active.id);
    setActiveOportunidad(oportunidad);
  };

  const handleDragEnd = async (event) => {
    setActiveOportunidad(null);
    const { active, over } = event;
    
    if (!over) return;

    const oportunidadId = active.id;
    const nuevaEtapa = over.id;

    if (nuevaEtapa && onEstadoChange) {
      setIsLoading(true);
      try {
        await onEstadoChange(oportunidadId, nuevaEtapa);
        toast.success('Oportunidad actualizada');
      } catch (error) {
        toast.error('Error al actualizar oportunidad');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalOportunidades = oportunidades.length;
  const valorTotal = oportunidades.reduce((sum, op) => sum + (op.valor_estimado || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header con métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Oportunidades</p>
                <p className="text-2xl font-bold">{totalOportunidades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  }).format(valorTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold">
                  {new Set(oportunidades.map(op => op.cliente_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold">
                  {oportunidades.filter(op => {
                    const fecha = new Date(op.fecha_cierre_esperada);
                    const ahora = new Date();
                    return fecha.getMonth() === ahora.getMonth() && 
                           fecha.getFullYear() === ahora.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Object.keys(ETAPAS_OPORTUNIDADES).map((etapa) => (
            <KanbanColumn
              key={etapa}
              etapa={etapa}
              oportunidades={columns[etapa] || []}
              onCardClick={onOportunidadClick}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeOportunidad && (
            <OportunidadCard oportunidad={activeOportunidad} />
          )}
        </DragOverlay>
      </DndContext>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm">Actualizando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMKanbanBoard;
