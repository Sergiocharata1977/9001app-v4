import React, { useState } from 'react';
import { Plus, Trash2, Palette } from 'lucide-react';
import { IEstado } from '../../types/editorRegistros';

interface EstadoEditorProps {
  estados: IEstado[];
  onEstadosChange: (estados: IEstado[]) => void;
}

const EstadoEditor: React.FC<EstadoEditorProps> = ({ estados, onEstadosChange }) => {
  const [mostrarColores, setMostrarColores] = useState<string | null>(null);

  const coloresDisponibles = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#6b7280', '#374151', '#1f2937'
  ];

  const agregarEstado = () => {
    const nuevoEstado: IEstado = {
      id: `estado_${Date.now()}`,
      nombre: 'Nuevo Estado',
      descripcion: '',
      color: '#6b7280',
      orden: estados.length,
      activo: true
    };
    onEstadosChange([...estados, nuevoEstado]);
  };

  const actualizarEstado = (id: string, campo: keyof IEstado, valor: any) => {
    const nuevosEstados = estados.map(estado =>
      estado.id === id ? { ...estado, [campo]: valor } : estado
    );
    onEstadosChange(nuevosEstados);
  };

  const eliminarEstado = (id: string) => {
    onEstadosChange(estados.filter(estado => estado.id !== id));
  };

  const cambiarColor = (id: string, color: string) => {
    actualizarEstado(id, 'color', color);
    setMostrarColores(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Estados del Proceso</h3>
        <button
          onClick={agregarEstado}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Estado</span>
        </button>
      </div>

      <div className="space-y-3">
        {estados.map((estado, index) => (
          <div key={estado.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white">
            {/* Indicador de orden */}
            <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              {index + 1}
            </div>

            {/* Color del estado */}
            <div className="relative">
              <button
                onClick={() => setMostrarColores(mostrarColores === estado.id ? null : estado.id)}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: estado.color }}
                title="Cambiar color"
              >
                <Palette className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </button>
              
              {mostrarColores === estado.id && (
                <div className="absolute top-10 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {coloresDisponibles.map(color => (
                      <button
                        key={color}
                        onClick={() => cambiarColor(estado.id, color)}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nombre del estado */}
            <input
              type="text"
              value={estado.nombre}
              onChange={(e) => actualizarEstado(estado.id, 'nombre', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del estado"
            />

            {/* Descripción */}
            <input
              type="text"
              value={estado.descripcion}
              onChange={(e) => actualizarEstado(estado.id, 'descripcion', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción (opcional)"
            />

            {/* Activo/Inactivo */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={estado.activo}
                onChange={(e) => actualizarEstado(estado.id, 'activo', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Activo</span>
            </label>

            {/* Botón eliminar */}
            <button
              onClick={() => eliminarEstado(estado.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar estado"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {estados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No hay estados configurados</p>
            <p className="text-sm">Agrega estados para definir el flujo del proceso</p>
          </div>
        )}
      </div>

      {estados.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Los estados definen las etapas por las que pasará cada registro. 
            Puedes cambiar el orden arrastrando los elementos.
          </p>
        </div>
      )}
    </div>
  );
};

export default EstadoEditor;
