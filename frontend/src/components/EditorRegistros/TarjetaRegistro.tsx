import React from 'react';
import { 
  Calendar, User, Tag, AlertCircle, Clock, 
  Paperclip, MessageSquare, CheckSquare, MoreVertical,
  Flag
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { IRegistro, ICampo } from '../../types/editorRegistros';

interface TarjetaRegistroProps {
  registro: IRegistro;
  campos: ICampo[];
  isDragging?: boolean;
  onClick?: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TarjetaRegistro: React.FC<TarjetaRegistroProps> = ({
  registro,
  campos,
  isDragging = false,
  onClick,
  onMenuClick
}) => {
  // Obtener campos configurados para mostrar en tarjeta
  const camposTarjeta = campos
    .filter(campo => campo.visible_tarjeta)
    .sort((a, b) => a.orden_tarjeta - b.orden_tarjeta);

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'text-red-600 bg-red-50';
      case 'alta': return 'text-orange-600 bg-orange-50';
      case 'media': return 'text-yellow-600 bg-yellow-50';
      case 'baja': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return '🔴';
      case 'alta': return '🟠';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border p-4 cursor-pointer
        hover:shadow-md transition-all
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${registro.esta_vencido ? 'border-red-300' : 'border-gray-200'}
      `}
      onClick={onClick}
    >
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {registro.codigo}
            </span>
            {registro.prioridad && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getPrioridadColor(registro.prioridad)}`}>
                {getPrioridadIcon(registro.prioridad)} {registro.prioridad}
              </span>
            )}
          </div>
          
          {/* Etiquetas */}
          {registro.etiquetas && registro.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {registro.etiquetas.slice(0, 3).map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{ 
                    backgroundColor: `${etiqueta.color}20`,
                    color: etiqueta.color
                  }}
                >
                  {etiqueta.icono && <span>{etiqueta.icono}</span>}
                  {etiqueta.nombre}
                </span>
              ))}
              {registro.etiquetas.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{registro.etiquetas.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Campos visibles en tarjeta */}
      {camposTarjeta.length > 0 && (
        <div className="space-y-2 mb-3">
          {camposTarjeta.map(campo => {
            const valor = registro.datos[campo.id];
            if (!valor) return null;

            return (
              <div key={campo.id} className="text-sm">
                <span className="text-gray-500">{campo.etiqueta}:</span>{' '}
                <span className="text-gray-900">
                  {typeof valor === 'boolean' 
                    ? (valor ? '✓' : '✗')
                    : String(valor).substring(0, 100)
                  }
                  {String(valor).length > 100 && '...'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {/* Responsable */}
          {registro.responsable_principal && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>
                {typeof registro.responsable_principal === 'object' 
                  ? (registro.responsable_principal as any).nombre
                  : 'Asignado'
                }
              </span>
            </div>
          )}
          
          {/* Fecha límite */}
          {registro.fecha_limite && (
            <div className={`flex items-center gap-1 ${registro.esta_vencido ? 'text-red-600' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>
                {format(new Date(registro.fecha_limite), 'dd MMM', { locale: es })}
              </span>
            </div>
          )}
          
          {/* Días abierto */}
          {registro.dias_abierto > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{registro.dias_abierto}d</span>
            </div>
          )}
        </div>

        {/* Indicadores */}
        <div className="flex items-center gap-2">
          {/* Comentarios */}
          {registro.comentarios && registro.comentarios.length > 0 && (
            <div className="flex items-center gap-0.5">
              <MessageSquare className="w-3 h-3" />
              <span>{registro.comentarios.length}</span>
            </div>
          )}
          
          {/* Archivos */}
          {registro.archivos && registro.archivos.length > 0 && (
            <div className="flex items-center gap-0.5">
              <Paperclip className="w-3 h-3" />
              <span>{registro.archivos.length}</span>
            </div>
          )}
          
          {/* Checklist */}
          {registro.checklist && registro.checklist.length > 0 && (
            <div className="flex items-center gap-0.5">
              <CheckSquare className="w-3 h-3" />
              <span>
                {registro.checklist.filter(i => i.completado).length}/{registro.checklist.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      {registro.progreso > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${registro.progreso}%` }}
            />
          </div>
        </div>
      )}

      {/* Indicador de vencimiento */}
      {registro.esta_vencido && (
        <div className="mt-3 flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          <AlertCircle className="w-3 h-3" />
          <span>Vencido</span>
        </div>
      )}

      {/* Indicador de bloqueo */}
      {registro.bloqueado && (
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          <Lock className="w-3 h-3" />
          <span>Bloqueado</span>
        </div>
      )}
    </div>
  );
};

// Icono de candado para registros bloqueados
function Lock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

export default TarjetaRegistro;