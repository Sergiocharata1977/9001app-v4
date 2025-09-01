import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, Trash2, Settings, ChevronDown, ChevronUp, 
  GripVertical, Copy, Eye, EyeOff, Lock, Unlock,
  ArrowRight, Clock, Bell, Zap
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CampoEditor from './CampoEditor';
import TransicionEditor from './TransicionEditor';
import AccionesAutomaticas from './AccionesAutomaticas';
import { IEstado, ICampo, TipoCampo } from '../../types/editorRegistros';

interface EstadoEditorProps {
  estado: IEstado;
  todosLosEstados: IEstado[];
  onActualizar: (estado: IEstado) => void;
  onEliminar: () => void;
}

const EstadoEditor: React.FC<EstadoEditorProps> = ({
  estado,
  todosLosEstados,
  onActualizar,
  onEliminar
}) => {
  const [tab, setTab] = useState<'campos' | 'transiciones' | 'acciones' | 'permisos'>('campos');
  const [campoEditando, setCampoEditando] = useState<string | null>(null);
  const [mostrarConfigTiempo, setMostrarConfigTiempo] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(estado.campos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar orden
    items.forEach((campo, index) => {
      campo.orden_formulario = index;
    });

    onActualizar({ ...estado, campos: items });
  };

  const agregarCampo = () => {
    const nuevoCampo: ICampo = {
      id: uuidv4(),
      codigo: `CAMPO_${Date.now()}`,
      etiqueta: `Campo ${estado.campos.length + 1}`,
      tipo: TipoCampo.TEXT,
      requerido: false,
      solo_lectura: false,
      visible_tarjeta: false,
      orden_tarjeta: 0,
      orden_formulario: estado.campos.length,
      configuracion: {},
      validaciones: [],
      permisos: {
        ver: [],
        editar: [],
        requerido_para: []
      }
    };

    onActualizar({
      ...estado,
      campos: [...estado.campos, nuevoCampo]
    });

    setCampoEditando(nuevoCampo.id);
  };

  const actualizarCampo = (campoId: string, campoActualizado: ICampo) => {
    onActualizar({
      ...estado,
      campos: estado.campos.map(c => 
        c.id === campoId ? campoActualizado : c
      )
    });
  };

  const eliminarCampo = (campoId: string) => {
    if (confirm('¿Estás seguro de eliminar este campo?')) {
      onActualizar({
        ...estado,
        campos: estado.campos.filter(c => c.id !== campoId)
      });
    }
  };

  const duplicarCampo = (campo: ICampo) => {
    const nuevoCampo: ICampo = {
      ...campo,
      id: uuidv4(),
      codigo: `${campo.codigo}_COPIA`,
      etiqueta: `${campo.etiqueta} (Copia)`,
      orden_formulario: estado.campos.length
    };

    onActualizar({
      ...estado,
      campos: [...estado.campos, nuevoCampo]
    });
  };

  const coloresPreset = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E'
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header del estado */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={estado.nombre}
                onChange={(e) => onActualizar({ ...estado, nombre: e.target.value })}
                className="text-2xl font-bold border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              />
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Color:</label>
                <div className="flex gap-1">
                  {coloresPreset.slice(0, 8).map(color => (
                    <button
                      key={color}
                      onClick={() => onActualizar({ ...estado, color })}
                      className={`w-6 h-6 rounded-full border-2 ${
                        estado.color === color ? 'border-gray-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={estado.color}
                    onChange={(e) => onActualizar({ ...estado, color: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <input
              type="text"
              value={estado.descripcion || ''}
              onChange={(e) => onActualizar({ ...estado, descripcion: e.target.value })}
              placeholder="Descripción del estado (opcional)"
              className="w-full text-gray-600 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            />

            {/* Badges de configuración */}
            <div className="flex items-center gap-3 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={estado.es_inicial}
                  onChange={(e) => onActualizar({ ...estado, es_inicial: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">Estado inicial</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={estado.es_final}
                  onChange={(e) => onActualizar({ ...estado, es_final: e.target.checked })}
                  className="rounded text-green-600"
                />
                <span className="text-sm text-gray-700">Estado final</span>
              </label>

              <button
                onClick={() => setMostrarConfigTiempo(!mostrarConfigTiempo)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <Clock className="w-4 h-4" />
                Configurar tiempos
              </button>
            </div>

            {/* Configuración de tiempo */}
            {mostrarConfigTiempo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días máximo en este estado
                    </label>
                    <input
                      type="number"
                      value={estado.tiempo?.dias_maximo || ''}
                      onChange={(e) => onActualizar({
                        ...estado,
                        tiempo: {
                          ...estado.tiempo,
                          dias_maximo: parseInt(e.target.value) || undefined
                        }
                      })}
                      placeholder="Sin límite"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Días para alerta
                    </label>
                    <input
                      type="number"
                      value={estado.tiempo?.dias_alerta || ''}
                      onChange={(e) => onActualizar({
                        ...estado,
                        tiempo: {
                          ...estado.tiempo,
                          dias_alerta: parseInt(e.target.value) || undefined
                        }
                      })}
                      placeholder="Sin alerta"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={estado.tiempo?.excluir_fines_semana || false}
                      onChange={(e) => onActualizar({
                        ...estado,
                        tiempo: {
                          ...estado.tiempo,
                          excluir_fines_semana: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Excluir fines de semana</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={estado.tiempo?.excluir_feriados || false}
                      onChange={(e) => onActualizar({
                        ...estado,
                        tiempo: {
                          ...estado.tiempo,
                          excluir_feriados: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Excluir feriados</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onEliminar}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar estado"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b">
          <button
            onClick={() => setTab('campos')}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'campos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Campos ({estado.campos.length})
          </button>
          <button
            onClick={() => setTab('transiciones')}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'transiciones'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Transiciones ({estado.transiciones_permitidas.length})
          </button>
          <button
            onClick={() => setTab('acciones')}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'acciones'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Acciones Automáticas ({estado.acciones_automaticas.length})
          </button>
          <button
            onClick={() => setTab('permisos')}
            className={`px-4 py-2 font-medium transition-colors ${
              tab === 'permisos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Permisos
          </button>
        </div>
      </div>

      {/* Contenido según tab */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'campos' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Arrastra para reordenar los campos. Los campos marcados aparecerán en las tarjetas.
              </p>
              <button
                onClick={agregarCampo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Campo
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="campos">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {estado.campos.map((campo, index) => (
                      <Draggable key={campo.id} draggableId={campo.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`
                              bg-white border rounded-lg
                              ${snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'}
                              ${campoEditando === campo.id ? 'border-blue-500' : 'border-gray-200'}
                            `}
                          >
                            <div className="p-4">
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{campo.etiqueta}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {campo.tipo}
                                    </span>
                                    {campo.requerido && (
                                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                        Requerido
                                      </span>
                                    )}
                                    {campo.visible_tarjeta && (
                                      <Eye className="w-4 h-4 text-blue-600" title="Visible en tarjeta" />
                                    )}
                                    {campo.solo_lectura && (
                                      <Lock className="w-4 h-4 text-gray-600" title="Solo lectura" />
                                    )}
                                  </div>
                                  {campo.descripcion && (
                                    <p className="text-sm text-gray-500 mt-1">{campo.descripcion}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setCampoEditando(
                                      campoEditando === campo.id ? null : campo.id
                                    )}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    {campoEditando === campo.id ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => duplicarCampo(campo)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                    title="Duplicar campo"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => eliminarCampo(campo.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Eliminar campo"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Editor expandido */}
                              {campoEditando === campo.id && (
                                <div className="mt-4 pt-4 border-t">
                                  <CampoEditor
                                    campo={campo}
                                    onActualizar={(campoActualizado) => 
                                      actualizarCampo(campo.id, campoActualizado)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {estado.campos.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No hay campos definidos para este estado</p>
                <button
                  onClick={agregarCampo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar primer campo
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'transiciones' && (
          <TransicionEditor
            estado={estado}
            todosLosEstados={todosLosEstados}
            onActualizar={onActualizar}
          />
        )}

        {tab === 'acciones' && (
          <AccionesAutomaticas
            estado={estado}
            onActualizar={onActualizar}
          />
        )}

        {tab === 'permisos' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Permisos del Estado</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pueden crear registros en este estado
                    </label>
                    <input
                      type="text"
                      value={estado.permisos.puede_crear.join(', ')}
                      onChange={(e) => onActualizar({
                        ...estado,
                        permisos: {
                          ...estado.permisos,
                          puede_crear: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="admin, supervisor, usuario"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separa los roles con comas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pueden editar registros en este estado
                    </label>
                    <input
                      type="text"
                      value={estado.permisos.puede_editar.join(', ')}
                      onChange={(e) => onActualizar({
                        ...estado,
                        permisos: {
                          ...estado.permisos,
                          puede_editar: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="admin, supervisor"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pueden mover registros desde este estado
                    </label>
                    <input
                      type="text"
                      value={estado.permisos.puede_mover_desde.join(', ')}
                      onChange={(e) => onActualizar({
                        ...estado,
                        permisos: {
                          ...estado.permisos,
                          puede_mover_desde: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="admin, supervisor, usuario"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pueden mover registros hacia este estado
                    </label>
                    <input
                      type="text"
                      value={estado.permisos.puede_mover_hacia.join(', ')}
                      onChange={(e) => onActualizar({
                        ...estado,
                        permisos: {
                          ...estado.permisos,
                          puede_mover_hacia: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="admin, supervisor"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoEditor;