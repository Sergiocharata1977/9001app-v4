import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Calendar, User, Target, Clock, Building, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditoriaKanbanCard = ({ auditoria, onCardClick }) => {
  const navigate = useNavigate();
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: auditoria.id,
    data: {
      type: 'Auditoria',
      auditoria,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatAreas = (areas) => {
    if (!areas) return 'Sin área';
    if (Array.isArray(areas)) {
      return areas.length > 0 ? areas.join(', ') : 'Sin área';
    }
    if (typeof areas === 'string') {
      try {
        const parsedAreas = JSON.parse(areas);
        return Array.isArray(parsedAreas) ? parsedAreas.join(', ') : areas;
      } catch {
        return areas;
      }
    }
    return String(areas);
  };

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      planificacion: 'bg-blue-100 text-blue-800',
      programacion: 'bg-purple-100 text-purple-800',
      ejecucion: 'bg-orange-100 text-orange-800',
      informe: 'bg-yellow-100 text-yellow-800',
      seguimiento: 'bg-indigo-100 text-indigo-800',
      cerrada: 'bg-green-100 text-green-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/app/auditorias/${auditoria.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log('Editar auditoría:', auditoria);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      console.log('Eliminar auditoría:', auditoria.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onCardClick && onCardClick(auditoria.id)}
      className="mb-4 touch-none cursor-pointer"
    >
      <Card className="bg-white hover:shadow-lg transition-all duration-200 border-l-4 border-blue-400 cursor-pointer hover:bg-gray-50">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-bold text-gray-800 mb-1 line-clamp-2">
                {auditoria.codigo || 'Sin código'}
              </CardTitle>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {auditoria.titulo || 'Sin título'}
              </p>
              <Badge className={`text-xs px-2 py-1 ${getEstadoBadgeColor(auditoria.estado)}`}>
                {auditoria.estado?.charAt(0).toUpperCase() + auditoria.estado?.slice(1) || 'Sin estado'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 text-xs text-gray-600 space-y-2">
          <div className="flex items-start">
            <Target className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{formatAreas(auditoria.areas)}</span>
          </div>
          
          <div className="flex items-start">
            <User className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{auditoria.auditor_lider || 'No asignado'}</span>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
            <span>{formatDate(auditoria.fecha_programada)}</span>
          </div>

          {auditoria.duracion_estimada && (
            <div className="flex items-start">
              <Clock className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span>{auditoria.duracion_estimada}</span>
            </div>
          )}

          {auditoria.tipo && (
            <div className="flex items-start">
              <Building className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="capitalize">{auditoria.tipo}</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            {auditoria.total_aspectos || 0} aspectos
          </Badge>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewClick}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
              aria-label="Ver detalles"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditClick}
              className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
              aria-label="Editar"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
              aria-label="Eliminar"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuditoriaKanbanCard;
