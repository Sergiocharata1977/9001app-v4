import React from 'react';
import { StandardKanbanBoard, KanbanItem } from '@/components/common/StandardKanbanBoard';
import { CAPACITACIONES_KANBAN_CONFIG } from '@/config/kanbanConfig';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings, Target, Award, Calendar, Users, BookOpen } from 'lucide-react';

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'Planificada' | 'En Preparación' | 'En Evaluación' | 'Completada';
  tipo_capacitacion: string;
  modalidad: string;
  duracion_horas: number;
  fecha_inicio: string;
  fecha_fin: string;
  instructor: string;
  participantes_max: number;
  participantes_actual: number;
  lugar: string;
  costo: number;
  temas: string[];
  materiales: string[];
  evaluacion: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: number;
}

interface CapacitacionKanbanBoardProps {
  capacitaciones: Capacitacion[];
  onCardClick?: (capacitacion: Capacitacion) => void;
  onCapacitacionStateChange?: (capacitacionId: string, newEstado: string) => void;
}

// Componente de tarjeta personalizada para capacitaciones
const CapacitacionKanbanCard: React.FC<{ item: KanbanItem }> = ({ item }) => {
  const capacitacion = item as unknown as Capacitacion;
  
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Planificada':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'En Preparación':
        return <Settings className="w-4 h-4 text-orange-600" />;
      case 'En Evaluación':
        return <Target className="w-4 h-4 text-purple-600" />;
      case 'Completada':
        return <Award className="w-4 h-4 text-green-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModalidadColor = (modalidad: string) => {
    switch (modalidad.toLowerCase()) {
      case 'presencial':
        return 'bg-blue-100 text-blue-700';
      case 'virtual':
        return 'bg-purple-100 text-purple-700';
      case 'híbrida':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getParticipacionPorcentaje = () => {
    if (capacitacion.participantes_max === 0) return 0;
    return (capacitacion.participantes_actual / capacitacion.participantes_max) * 100;
  };

  const participacion = getParticipacionPorcentaje();

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
              {capacitacion.titulo}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getEstadoIcon(capacitacion.estado)}
              <Badge variant="outline" className="text-xs">
                {capacitacion.estado}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-xs text-gray-600">
          {capacitacion.descripcion && (
            <p className="line-clamp-2 text-gray-700">
              {capacitacion.descripcion}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-xs ${getModalidadColor(capacitacion.modalidad)}`}>
              {capacitacion.modalidad}
            </Badge>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span className="text-xs text-gray-500">
                {capacitacion.duracion_horas}h
              </span>
            </div>
          </div>

          {capacitacion.instructor && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="text-xs text-gray-500 truncate">
                {capacitacion.instructor}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Participación:</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold">
                {capacitacion.participantes_actual}/{capacitacion.participantes_max}
              </span>
              <span className={`text-xs ${
                participacion >= 80 ? 'text-green-600' : 
                participacion >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                ({participacion.toFixed(0)}%)
              </span>
            </div>
          </div>

          {capacitacion.lugar && (
            <div className="text-xs text-gray-500">
              📍 {capacitacion.lugar}
            </div>
          )}

          {capacitacion.costo && capacitacion.costo > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Costo:</span>
              <span className="text-xs font-mono">
                ${capacitacion.costo.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="text-xs text-gray-400">
              {new Date(capacitacion.fecha_inicio).toLocaleDateString()} - {new Date(capacitacion.fecha_fin).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CapacitacionKanbanBoard: React.FC<CapacitacionKanbanBoardProps> = ({
  capacitaciones,
  onCardClick,
  onCapacitacionStateChange
}) => {
  // Convertir capacitaciones a formato KanbanItem
  const kanbanItems: KanbanItem[] = capacitaciones.map(capacitacion => ({
    id: capacitacion.id,
    title: capacitacion.titulo,
    description: capacitacion.descripcion,
    status: capacitacion.estado,
    assignedTo: capacitacion.instructor,
    dueDate: capacitacion.fecha_fin,
    // Incluir todos los datos de la capacitación para acceso en la tarjeta
    ...capacitacion
  }));

  const handleStatusChange = (itemId: string, newStatus: string) => {
    if (onCapacitacionStateChange) {
      onCapacitacionStateChange(itemId, newStatus);
    }
  };

  const handleCardClick = (item: KanbanItem) => {
    if (onCardClick) {
      onCardClick(item as unknown as Capacitacion);
    }
  };

  return (
    <div className="w-full">
      <StandardKanbanBoard
        items={kanbanItems}
        columns={CAPACITACIONES_KANBAN_CONFIG}
        onItemClick={handleCardClick}
        onStatusChange={handleStatusChange}
        renderItem={(item) => <CapacitacionKanbanCard item={item} />}
        className="p-4"
      />
    </div>
  );
};

export default CapacitacionKanbanBoard; 