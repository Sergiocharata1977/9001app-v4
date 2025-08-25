import React from 'react';
import { StandardKanbanBoard, KanbanItem } from '@/components/common/StandardKanbanBoard';
import { OPORTUNIDADES_AGRO_KANBAN_CONFIG } from '@/config/kanbanConfig';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Target, FileText, Star, TrendingUp, CheckCircle, DollarSign, Calendar, User } from 'lucide-react';

interface OportunidadAgro {
  id: string;
  organization_id: string;
  cliente_id: string;
  titulo: string;
  descripcion: string;
  tipo_oportunidad: 'nueva' | 'renovacion' | 'ampliacion' | 'servicio_tecnico';
  etapa: 'prospeccion' | 'diagnostico' | 'propuesta_tecnica' | 'demostracion' | 'negociacion' | 'cerrada_ganada' | 'cerrada_perdida';
  cultivo_objetivo: string;
  superficie_objetivo: number;
  temporada_objetivo: string;
  necesidad_tecnica: string;
  probabilidad: number;
  valor_estimado: number;
  moneda: string;
  fecha_cierre_esperada: string;
  fecha_cierre_real: string;
  fecha_siembra_objetivo: string;
  vendedor_id: string;
  tecnico_id: string;
  supervisor_id: string;
  competencia: string;
  estrategia_venta: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: number;
}

interface OportunidadAgroKanbanBoardProps {
  oportunidades: OportunidadAgro[];
  onCardClick?: (oportunidad: OportunidadAgro) => void;
  onOportunidadStateChange?: (oportunidadId: string, newEstado: string) => void;
}

// Componente de tarjeta personalizada para oportunidades agro
const OportunidadAgroKanbanCard: React.FC<{ item: KanbanItem }> = ({ item }) => {
  const oportunidad = item as unknown as OportunidadAgro;
  
  const getEstadoIcon = (etapa: string) => {
    switch (etapa) {
      case 'prospeccion':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'diagnostico':
        return <Target className="w-4 h-4 text-purple-600" />;
      case 'propuesta_tecnica':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'demostracion':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'negociacion':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'cerrada_ganada':
      case 'cerrada_perdida':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'nueva':
        return 'bg-green-100 text-green-700';
      case 'renovacion':
        return 'bg-blue-100 text-blue-700';
      case 'ampliacion':
        return 'bg-purple-100 text-purple-700';
      case 'servicio_tecnico':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProbabilidadColor = (probabilidad: number) => {
    if (probabilidad >= 80) return 'text-green-600';
    if (probabilidad >= 60) return 'text-yellow-600';
    if (probabilidad >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEtapaTitle = (etapa: string) => {
    switch (etapa) {
      case 'prospeccion': return 'Prospección';
      case 'diagnostico': return 'Diagnóstico';
      case 'propuesta_tecnica': return 'Propuesta Técnica';
      case 'demostracion': return 'Demostración';
      case 'negociacion': return 'Negociación';
      case 'cerrada_ganada': return 'Cerrada - Ganada';
      case 'cerrada_perdida': return 'Cerrada - Perdida';
      default: return etapa;
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
              {oportunidad.titulo}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getEstadoIcon(oportunidad.etapa)}
              <Badge variant="outline" className="text-xs">
                {getEtapaTitle(oportunidad.etapa)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-xs text-gray-600">
          {oportunidad.descripcion && (
            <p className="line-clamp-2 text-gray-700">
              {oportunidad.descripcion}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-xs ${getTipoColor(oportunidad.tipo_oportunidad)}`}>
              {oportunidad.tipo_oportunidad.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs font-semibold">
                {oportunidad.valor_estimado.toLocaleString()} {oportunidad.moneda}
              </span>
            </div>
          </div>

          {oportunidad.cultivo_objetivo && (
            <div className="text-xs text-gray-500">
              🌾 {oportunidad.cultivo_objetivo}
            </div>
          )}

          {oportunidad.superficie_objetivo && (
            <div className="text-xs text-gray-500">
              📏 {oportunidad.superficie_objetivo} ha
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Probabilidad:</span>
            <span className={`text-xs font-semibold ${getProbabilidadColor(oportunidad.probabilidad)}`}>
              {oportunidad.probabilidad}%
            </span>
          </div>

          {oportunidad.vendedor_id && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="text-xs text-gray-500 truncate">
                Vendedor: {oportunidad.vendedor_id}
              </span>
            </div>
          )}

          {oportunidad.fecha_cierre_esperada && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs text-gray-400">
                Cierre: {new Date(oportunidad.fecha_cierre_esperada).toLocaleDateString()}
              </span>
            </div>
          )}

          {oportunidad.temporada_objetivo && (
            <div className="text-xs text-gray-400">
              🌱 {oportunidad.temporada_objetivo}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const OportunidadAgroKanbanBoard: React.FC<OportunidadAgroKanbanBoardProps> = ({
  oportunidades,
  onCardClick,
  onOportunidadStateChange
}) => {
  // Convertir oportunidades a formato KanbanItem
  const kanbanItems: KanbanItem[] = oportunidades.map(oportunidad => ({
    id: oportunidad.id,
    title: oportunidad.titulo,
    description: oportunidad.descripcion,
    status: oportunidad.etapa,
    assignedTo: oportunidad.vendedor_id,
    dueDate: oportunidad.fecha_cierre_esperada,
    // Incluir todos los datos de la oportunidad para acceso en la tarjeta
    ...oportunidad
  }));

  const handleStatusChange = (itemId: string, newStatus: string) => {
    if (onOportunidadStateChange) {
      onOportunidadStateChange(itemId, newStatus);
    }
  };

  const handleCardClick = (item: KanbanItem) => {
    if (onCardClick) {
      onCardClick(item as unknown as OportunidadAgro);
    }
  };

  return (
    <div className="w-full">
      <StandardKanbanBoard
        items={kanbanItems}
        columns={OPORTUNIDADES_AGRO_KANBAN_CONFIG}
        onItemClick={handleCardClick}
        onStatusChange={handleStatusChange}
        renderItem={(item) => <OportunidadAgroKanbanCard item={item} />}
        className="p-4"
      />
    </div>
  );
};

export default OportunidadAgroKanbanBoard;
