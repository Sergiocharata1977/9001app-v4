import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import type { TiemposWorkflowProps, Hallazgo } from '@/types/mejoras';

interface TiempoEtapaProps {
  title: string;
  fecha: string | undefined;
  duracion: string;
}

// Helper para calcular y formatear la duración entre dos fechas
const formatDuration = (start: string | undefined, end: string | undefined): string => {
  if (!start || !end) return 'N/A';
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff < 0) return 'Fechas inválidas';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim() || 'Menos de 1 min';
};

// Helper para formatear una fecha a un formato legible
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Pendiente';
  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
};

// Componente para mostrar una línea de tiempo de una etapa
const TiempoEtapa: React.FC<TiempoEtapaProps> = ({ title, fecha, duracion }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div>
      <p className="font-semibold text-gray-800 dark:text-gray-200">{title}</p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{formatDate(fecha)}</span>
      </div>
    </div>
    <div className="flex items-center text-teal-600 dark:text-teal-400">
      <Clock className="w-4 h-4 mr-2" />
      <span className="font-mono text-sm font-medium">{duracion}</span>
    </div>
  </div>
);

export default function TiemposWorkflow({ hallazgo }: TiemposWorkflowProps): React.JSX.Element {
  const {
    fechaDeteccion,
    fechaPlanificacion,
    fechaEjecucion,
    fechaAnalisis,
    fechaCierre,
  } = hallazgo;

  const duracionPlanificacion = formatDuration(fechaDeteccion, fechaPlanificacion);
  const duracionEjecucion = formatDuration(fechaPlanificacion, fechaEjecucion);
  const duracionAnalisis = formatDuration(fechaEjecucion, fechaAnalisis);
  const duracionTotal = formatDuration(fechaDeteccion, fechaCierre);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Análisis de Tiempos del Flujo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <TiempoEtapa 
            title="1. Tiempo de Planificación"
            fecha={fechaPlanificacion}
            duracion={duracionPlanificacion}
          />
          <TiempoEtapa 
            title="2. Tiempo de Ejecución"
            fecha={fechaEjecucion}
            duracion={duracionEjecucion}
          />
          <TiempoEtapa 
            title="3. Tiempo de Análisis"
            fecha={fechaAnalisis}
            duracion={duracionAnalisis}
          />
          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-teal-500">
            <p className="font-bold text-lg text-gray-800 dark:text-gray-200">Tiempo Total hasta Cierre</p>
            <div className="flex items-center text-teal-600 dark:text-teal-400">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-mono text-lg font-bold">{duracionTotal}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Las duraciones se calculan desde la finalización de la etapa anterior. El tiempo total se calcula desde el registro inicial hasta el cierre final del hallazgo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
