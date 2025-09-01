import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Save, Eye, Trash2, Copy, Settings, ChevronRight, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import EstadoEditor from './EstadoEditor';
import CampoEditor from './CampoEditor';
import ConfiguracionAvanzada from './ConfiguracionAvanzada';
import VistaPrevia from './VistaPrevia';
import { IPlantillaRegistro, IEstado, TipoCampo } from '../../types/editorRegistros';
import { plantillaRegistroService } from '../../services/plantillaRegistro.service';

interface PlantillaEditorProps {
  plantillaId?: string;
  onGuardar?: (plantilla: IPlantillaRegistro) => void;
  onCancelar?: () => void;
}

const PlantillaEditor: React.FC<PlantillaEditorProps> = ({
  plantillaId,
  onGuardar,
  onCancelar
}) => {
  const [plantilla, setPlantilla] = useState<Partial<IPlantillaRegistro>>({
    nombre: '',
    descripcion: '',
    estados: [],
    configuracion_visual: {
      icono: 'document',
      color_primario: '#3B82F6',
      vista_default: 'kanban',
      mostrar_progreso: true,
      mostrar_tiempo: true,
      mostrar_responsable: true
    },
    configuracion_avanzada: {
      numeracion_automatica: {
        activa: true,
        prefijo: '',
        longitud_numero: 4,
        reiniciar_anual: false,
        reiniciar_mensual: false
      },
      permitir_comentarios: true,
      permitir_archivos_adjuntos: true,
      permitir_checklist: true,
      permitir_etiquetas: true
    },
    permisos: {
      crear: ['admin', 'usuario'],
      ver: ['admin', 'usuario', 'invitado'],
      editar: ['admin', 'usuario'],
      eliminar: ['admin']
    }
  });
  
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(null);
  const [mostrarConfigAvanzada, setMostrarConfigAvanzada] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  useEffect(() => {
    if (plantillaId) {
      cargarPlantilla();
    }
  }, [plantillaId]);

  const cargarPlantilla = async () => {
    try {
      const data = await plantillaRegistroService.obtenerPorId(plantillaId!);
      setPlantilla(data);
      if (data.estados.length > 0) {
        setEstadoSeleccionado(data.estados[0].id);
      }
    } catch (error) {
      console.error('Error cargando plantilla:', error);
      setErrores(['Error al cargar la plantilla']);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(plantilla.estados || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar orden
    items.forEach((estado, index) => {
      estado.orden = index + 1;
    });

    setPlantilla({ ...plantilla, estados: items });
  };

  const agregarEstado = () => {
    const nuevoEstado: IEstado = {
      id: uuidv4(),
      codigo: `EST-${Date.now()}`,
      nombre: `Estado ${(plantilla.estados?.length || 0) + 1}`,
      orden: (plantilla.estados?.length || 0) + 1,
      color: '#6B7280',
      es_inicial: plantilla.estados?.length === 0,
      es_final: false,
      campos: [],
      transiciones_permitidas: [],
      acciones_automaticas: [],
      tiempo: {
        excluir_fines_semana: false,
        excluir_feriados: false
      },
      permisos: {
        puede_crear: ['admin', 'usuario'],
        puede_editar: ['admin', 'usuario'],
        puede_mover_desde: ['admin', 'usuario'],
        puede_mover_hacia: ['admin', 'usuario']
      }
    };

    setPlantilla({
      ...plantilla,
      estados: [...(plantilla.estados || []), nuevoEstado]
    });
    
    setEstadoSeleccionado(nuevoEstado.id);
  };

  const actualizarEstado = (estadoId: string, estadoActualizado: IEstado) => {
    setPlantilla({
      ...plantilla,
      estados: plantilla.estados?.map(e => 
        e.id === estadoId ? estadoActualizado : e
      )
    });
  };

  const eliminarEstado = (estadoId: string) => {
    if (confirm('¿Estás seguro de eliminar este estado?')) {
      setPlantilla({
        ...plantilla,
        estados: plantilla.estados?.filter(e => e.id !== estadoId)
      });
      
      if (estadoSeleccionado === estadoId) {
        setEstadoSeleccionado(null);
      }
    }
  };

  const validarPlantilla = (): boolean => {
    const nuevosErrores: string[] = [];

    if (!plantilla.nombre?.trim()) {
      nuevosErrores.push('El nombre es requerido');
    }

    if (!plantilla.estados || plantilla.estados.length === 0) {
      nuevosErrores.push('Debe tener al menos un estado');
    }

    const tieneInicial = plantilla.estados?.some(e => e.es_inicial);
    if (!tieneInicial && plantilla.estados && plantilla.estados.length > 0) {
      nuevosErrores.push('Debe marcar un estado como inicial');
    }

    setErrores(nuevosErrores);
    return nuevosErrores.length === 0;
  };

  const handleGuardar = async () => {
    if (!validarPlantilla()) return;

    setGuardando(true);
    try {
      let resultado;
      if (plantillaId) {
        resultado = await plantillaRegistroService.actualizar(plantillaId, plantilla);
      } else {
        resultado = await plantillaRegistroService.crear(plantilla);
      }
      
      if (onGuardar) {
        onGuardar(resultado);
      }
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      setErrores(['Error al guardar la plantilla']);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={plantilla.nombre}
              onChange={(e) => setPlantilla({ ...plantilla, nombre: e.target.value })}
              placeholder="Nombre de la plantilla"
              className="text-2xl font-bold border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors w-full max-w-md"
            />
            <input
              type="text"
              value={plantilla.descripcion}
              onChange={(e) => setPlantilla({ ...plantilla, descripcion: e.target.value })}
              placeholder="Descripción (opcional)"
              className="text-gray-600 mt-2 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors w-full max-w-lg"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarVistaPrevia(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Vista Previa
            </button>
            
            <button
              onClick={() => setMostrarConfigAvanzada(true)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </button>
            
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            
            {onCancelar && (
              <button
                onClick={onCancelar}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        
        {/* Errores */}
        {errores.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ul className="list-disc list-inside text-red-600 text-sm">
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel izquierdo - Estados */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Estados del Proceso</h3>
              <button
                onClick={agregarEstado}
                className="p-1 hover:bg-gray-100 rounded"
                title="Agregar estado"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Arrastra para reordenar los estados
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="estados">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {plantilla.estados?.map((estado, index) => (
                      <Draggable key={estado.id} draggableId={estado.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`
                              mb-2 p-3 bg-white border rounded-lg cursor-pointer
                              ${estadoSeleccionado === estado.id ? 'border-blue-500 shadow-md' : 'border-gray-200'}
                              ${snapshot.isDragging ? 'shadow-lg' : ''}
                              hover:shadow-md transition-all
                            `}
                            onClick={() => setEstadoSeleccionado(estado.id)}
                          >
                            <div className="flex items-center">
                              <div {...provided.dragHandleProps} className="mr-2">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </div>
                              
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: estado.color }}
                              />
                              
                              <div className="flex-1">
                                <div className="font-medium">{estado.nombre}</div>
                                <div className="text-xs text-gray-500">
                                  {estado.campos.length} campos
                                  {estado.es_inicial && ' • Inicial'}
                                  {estado.es_final && ' • Final'}
                                </div>
                              </div>
                              
                              <ChevronRight className="w-4 h-4 text-gray-400" />
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
            
            {(!plantilla.estados || plantilla.estados.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay estados definidos</p>
                <button
                  onClick={agregarEstado}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar primer estado
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho - Editor de estado */}
        <div className="flex-1 overflow-y-auto">
          {estadoSeleccionado && plantilla.estados ? (
            <EstadoEditor
              estado={plantilla.estados.find(e => e.id === estadoSeleccionado)!}
              todosLosEstados={plantilla.estados}
              onActualizar={(estado) => actualizarEstado(estadoSeleccionado, estado)}
              onEliminar={() => eliminarEstado(estadoSeleccionado)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Selecciona un estado para editar</p>
                <p className="text-sm text-gray-400">o crea uno nuevo para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {mostrarConfigAvanzada && (
        <ConfiguracionAvanzada
          configuracion={plantilla.configuracion_avanzada!}
          permisos={plantilla.permisos!}
          onGuardar={(config, permisos) => {
            setPlantilla({
              ...plantilla,
              configuracion_avanzada: config,
              permisos
            });
            setMostrarConfigAvanzada(false);
          }}
          onCerrar={() => setMostrarConfigAvanzada(false)}
        />
      )}

      {mostrarVistaPrevia && (
        <VistaPrevia
          plantilla={plantilla as IPlantillaRegistro}
          onCerrar={() => setMostrarVistaPrevia(false)}
        />
      )}
    </div>
  );
};

export default PlantillaEditor;