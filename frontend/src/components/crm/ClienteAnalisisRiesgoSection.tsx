import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalisisRiesgo } from '@/services/analisisRiesgoService';
import {
    AlertTriangle,
    BarChart3,
    Plus,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClienteAnalisisRiesgoSectionProps {
  clienteId: string;
  analisisRiesgo: AnalisisRiesgo[];
}

export default function ClienteAnalisisRiesgoSection({ 
  clienteId, 
  analisisRiesgo 
}: ClienteAnalisisRiesgoSectionProps) {
  const navigate = useNavigate();

  const getRiskIcon = (puntaje: number) => {
    if (puntaje >= 80) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (puntaje >= 60) return <TrendingUp className="w-3 h-3 text-yellow-500" />;
    if (puntaje >= 40) return <TrendingDown className="w-3 h-3 text-orange-500" />;
    return <TrendingDown className="w-3 h-3 text-red-500" />;
  };

  const getRiskBadgeConfig = (categoria: string) => {
    switch (categoria) {
      case 'baja':
        return { variant: 'default' as const, className: 'bg-green-100 text-green-700' };
      case 'media':
        return { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-700' };
      case 'alta':
        return { variant: 'outline' as const, className: 'bg-orange-100 text-orange-700' };
      case 'muy_alta':
        return { variant: 'destructive' as const, className: 'bg-red-100 text-red-700' };
      default:
        return { variant: 'default' as const, className: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Análisis de Riesgo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analisisRiesgo.length > 0 ? (
          <div className="space-y-3">
            {analisisRiesgo.slice(0, 3).map((analisis) => {
              const badgeConfig = getRiskBadgeConfig(analisis.categoria_riesgo);
              return (
                <div key={analisis.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{analisis.periodo_analisis}</span>
                    <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
                      {analisis.categoria_riesgo.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {getRiskIcon(analisis.puntaje_riesgo)}
                    <span className="text-xs text-gray-600">Puntaje: {analisis.puntaje_riesgo}/100</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(analisis.fecha_analisis).toLocaleDateString()}
                  </p>
                  {analisis.observaciones && (
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {analisis.observaciones}
                    </p>
                  )}
                </div>
              );
            })}
            {analisisRiesgo.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{analisisRiesgo.length - 3} análisis más
              </p>
            )}
            <Button 
              className="w-full mt-3" 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/app/crm/analisis-riesgo?cliente=${clienteId}`)}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Todos los Análisis
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No hay análisis de riesgo para este cliente</p>
            <Button 
              className="w-full" 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/app/crm/analisis-riesgo?cliente=${clienteId}`)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Análisis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
