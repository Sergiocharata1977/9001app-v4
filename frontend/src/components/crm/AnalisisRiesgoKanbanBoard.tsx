import React from 'react';
import { StandardKanbanBoard, KanbanItem } from '@/components/common/StandardKanbanBoard';
import { ANALISIS_RIESGO_KANBAN_CONFIG } from '@/config/kanbanConfig';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Target, Shield, Monitor, Lock, TrendingDown, TrendingUp } from 'lucide-react';

interface AnalisisRiesgo {
  id: string;
  organization_id: string;
  cliente_id: string;
  fecha_analisis: string;
  periodo_analisis: string;
  puntaje_riesgo: number;
  categoria_riesgo: 'baja' | 'media' | 'alta' | 'muy_alta';
  capacidad_pago: number;
  ingresos_mensuales: number;
  gastos_mensuales: number;
  margen_utilidad: number;
  liquidez: number;
  solvencia: number;
  endeudamiento: number;
  recomendaciones: string;
  observaciones: string;
  estado: 'identificado' | 'evaluado' | 'mitigado' | 'monitoreado' | 'cerrado';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: number;
}

interface AnalisisRiesgoKanbanBoardProps {
  analisisRiesgo: AnalisisRiesgo[];
  onCardClick?: (analisis: AnalisisRiesgo) => void;
  onAnalisisStateChange?: (analisisId: string, newEstado: string) => void;
}

// Componente de tarjeta personalizada para análisis de riesgo
const AnalisisRiesgoKanbanCard: React.FC<{ item: KanbanItem }> = ({ item }) => {
  const analisis = item as unknown as AnalisisRiesgo;
  
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'identificado':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'evaluado':
        return <Target className="w-4 h-4 text-orange-600" />;
      case 'mitigado':
        return <Shield className="w-4 h-4 text-yellow-600" />;
      case 'monitoreado':
        return <Monitor className="w-4 h-4 text-blue-600" />;
      case 'cerrado':
        return <Lock className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiesgoColor = (categoria: string) => {
    switch (categoria) {
      case 'baja':
        return 'bg-green-100 text-green-700';
      case 'media':
        return 'bg-yellow-100 text-yellow-700';
      case 'alta':
        return 'bg-orange-100 text-orange-700';
      case 'muy_alta':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiesgoIcon = (categoria: string) => {
    switch (categoria) {
      case 'baja':
        return <TrendingDown className="w-3 h-3" />;
      case 'media':
        return <TrendingUp className="w-3 h-3" />;
      case 'alta':
      case 'muy_alta':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <TrendingUp className="w-3 h-3" />;
    }
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
              Análisis {analisis.periodo_analisis}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getEstadoIcon(analisis.estado)}
              <Badge variant="outline" className="text-xs">
                {analisis.estado.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Puntaje:</span>
            <div className="flex items-center gap-1">
              {getRiesgoIcon(analisis.categoria_riesgo)}
              <span className="font-semibold">{analisis.puntaje_riesgo}/100</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Categoría:</span>
            <Badge variant="outline" className={`text-xs ${getRiesgoColor(analisis.categoria_riesgo)}`}>
              {analisis.categoria_riesgo.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {analisis.capacidad_pago && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Capacidad Pago:</span>
              <span className="font-mono text-xs">
                ${analisis.capacidad_pago.toLocaleString()}
              </span>
            </div>
          )}

          {analisis.margen_utilidad && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Margen:</span>
              <span className={`font-semibold text-xs ${
                analisis.margen_utilidad > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analisis.margen_utilidad > 0 ? '+' : ''}{analisis.margen_utilidad.toFixed(1)}%
              </span>
            </div>
          )}

          {analisis.liquidez && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Liquidez:</span>
              <span className={`font-semibold text-xs ${
                analisis.liquidez > 1 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analisis.liquidez.toFixed(2)}
              </span>
            </div>
          )}

          <div className="text-xs text-gray-400">
            {new Date(analisis.fecha_analisis).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AnalisisRiesgoKanbanBoard: React.FC<AnalisisRiesgoKanbanBoardProps> = ({
  analisisRiesgo,
  onCardClick,
  onAnalisisStateChange
}) => {
  // Convertir análisis de riesgo a formato KanbanItem
  const kanbanItems: KanbanItem[] = analisisRiesgo.map(analisis => ({
    id: analisis.id,
    title: `Análisis ${analisis.periodo_analisis}`,
    description: analisis.observaciones,
    status: analisis.estado,
    assignedTo: analisis.created_by,
    dueDate: analisis.fecha_analisis,
    // Incluir todos los datos del análisis para acceso en la tarjeta
    ...analisis
  }));

  const handleStatusChange = (itemId: string, newStatus: string) => {
    if (onAnalisisStateChange) {
      onAnalisisStateChange(itemId, newStatus);
    }
  };

  const handleCardClick = (item: KanbanItem) => {
    if (onCardClick) {
      onCardClick(item as unknown as AnalisisRiesgo);
    }
  };

  return (
    <div className="w-full">
      <StandardKanbanBoard
        items={kanbanItems}
        columns={ANALISIS_RIESGO_KANBAN_CONFIG}
        onItemClick={handleCardClick}
        onStatusChange={handleStatusChange}
        renderItem={(item) => <AnalisisRiesgoKanbanCard item={item} />}
        className="p-4"
      />
    </div>
  );
};

export default AnalisisRiesgoKanbanBoard;
