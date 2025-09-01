import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, Search, Filter, Calendar, User, Tag, 
  AlertCircle, Clock, Paperclip, MessageSquare,
  CheckSquare, MoreVertical, Eye, Edit, Copy, Archive
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TarjetaRegistro from './TarjetaRegistro';
import FormularioDinamico from './FormularioDinamico';
import { IRegistro, IPlantillaRegistro, IEstado } from '../../types/editorRegistros';
import { registroService } from '../../services/registro.service';
import { plantillaRegistroService } from '../../services/plantillaRegistro.service';

interface VistaKanbanProps {
  plantillaId: string;
  filtros?: any;
  onRegistroClick?: (registro: IRegistro) => void;
}

interface Columna {
  id: string;
  nombre: string;
  color: string;
  orden: number;
  registros: IRegistro[];
  cargando: boolean;
}

const VistaKanban: React.FC<VistaKanbanProps> = ({
  plantillaId,
  filtros = {},
  onRegistroClick
}) => {
  const [plantilla, setPlantilla] = useState<IPlantillaRegistro | null>(null);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrosActivos, setFiltrosActivos] = useState(filtros);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [creandoRegistro, setCreandoRegistro] = useState<string | null>(null);
  const [editandoRegistro, setEditandoRegistro] = useState<IRegistro | null>(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [plantillaId, filtrosActivos]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Cargar plantilla
      const plantillaData = await plantillaRegistroService.obtenerPorId(plantillaId);
      setPlantilla(plantillaData);

      // Cargar registros agrupados por estado
      const kanbanData = await registroService.obtenerVistaKanban(plantillaId, filtrosActivos);
      
      // Preparar columnas
      const nuevasColumnas: Columna[] = plantillaData.estados.map(estado => ({
        id: estado.id,
        nombre: estado.nombre,
        color: estado.color,
        orden: estado.orden,
        registros: kanbanData.columnas.find(c => c.id === estado.id)?.registros || [],
        cargando: false
      }));

      setColumnas(nuevasColumnas);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Si se mueve en la misma columna y misma posición, no hacer nada
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    // Obtener columnas origen y destino
    const columnaOrigen = columnas.find(c => c.id === source.droppableId);
    const columnaDestino = columnas.find(c => c.id === destination.droppableId);

    if (!columnaOrigen || !columnaDestino) return;

    // Obtener el registro que se está moviendo
    const registro = columnaOrigen.registros[source.index];

    // Actualización optimista de la UI
    const nuevasColumnas = [...columnas];
    
    // Remover de la columna origen
    const indiceOrigen = nuevasColumnas.findIndex(c => c.id === source.droppableId);
    nuevasColumnas[indiceOrigen].registros.splice(source.index, 1);
    
    // Agregar a la columna destino
    const indiceDestino = nuevasColumnas.findIndex(c => c.id === destination.droppableId);
    nuevasColumnas[indiceDestino].registros.splice(destination.index, 0, registro);
    
    setColumnas(nuevasColumnas);

    // Si cambió de columna, actualizar en el servidor
    if (source.droppableId !== destination.droppableId) {
      setActualizando(true);
      try {
        await registroService.cambiarEstado(draggableId, destination.droppableId);
        
        // Recargar para obtener datos actualizados
        await cargarDatos();
      } catch (error) {
        console.error('Error cambiando estado:', error);
        // Revertir cambio en caso de error
        await cargarDatos();
      } finally {
        setActualizando(false);
      }
    }
  };

  const handleCrearRegistro = async (estadoId: string, datos: any) => {
    try {
      const nuevoRegistro = await registroService.crear({
        plantilla_id: plantillaId,
        datos_iniciales: datos,
        estado_inicial_id: estadoId
      });

      // Actualizar columna con el nuevo registro
      setColumnas(prevColumnas => 
        prevColumnas.map(col => 
          col.id === estadoId 
            ? { ...col, registros: [nuevoRegistro, ...col.registros] }
            : col
        )
      );

      setCreandoRegistro(null);
    } catch (error) {
      console.error('Error creando registro:', error);
    }
  };

  const aplicarFiltros = () => {
    // Aplicar filtros y recargar datos
    cargarDatos();
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos({});
    setBusqueda('');
    cargarDatos();
    setMostrarFiltros(false);
  };

  if (cargando) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tablero...</p>
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">No se pudo cargar la plantilla</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header con filtros */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{plantilla.nombre}</h2>
            <p className="text-gray-600">{plantilla.descripcion}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar registros..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Botón de filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`
                px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                ${Object.keys(filtrosActivos).length > 0 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {Object.keys(filtrosActivos).length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.keys(filtrosActivos).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable
                </label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtrosActivos.responsable || ''}
                  onChange={(e) => setFiltrosActivos({
                    ...filtrosActivos,
                    responsable: e.target.value || undefined
                  })}
                >
                  <option value="">Todos</option>
                  {/* Aquí irían las opciones de usuarios */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtrosActivos.prioridad || ''}
                  onChange={(e) => setFiltrosActivos({
                    ...filtrosActivos,
                    prioridad: e.target.value || undefined
                  })}
                >
                  <option value="">Todas</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento
                </label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtrosActivos.vencimiento || ''}
                  onChange={(e) => setFiltrosActivos({
                    ...filtrosActivos,
                    vencimiento: e.target.value || undefined
                  })}
                >
                  <option value="">Todos</option>
                  <option value="vencidos">Vencidos</option>
                  <option value="hoy">Vencen hoy</option>
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mes</option>
                </select>
              </div>
              
              <div className="flex items-end gap-2">
                <button
                  onClick={aplicarFiltros}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aplicar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tablero Kanban */}
      <div className="flex-1 overflow-x-auto">
        <div className="h-full p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full">
              {columnas.map(columna => (
                <div
                  key={columna.id}
                  className="flex-shrink-0 w-80 bg-gray-50 rounded-lg flex flex-col"
                >
                  {/* Header de columna */}
                  <div 
                    className="px-4 py-3 border-b-2"
                    style={{ borderColor: columna.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: columna.color }}
                        />
                        <h3 className="font-semibold text-gray-900">
                          {columna.nombre}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({columna.registros.length})
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setCreandoRegistro(columna.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Crear registro"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lista de registros */}
                  <Droppable droppableId={columna.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          flex-1 overflow-y-auto p-3 space-y-3
                          ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                          ${actualizando ? 'opacity-50 pointer-events-none' : ''}
                        `}
                      >
                        {/* Formulario de nuevo registro */}
                        {creandoRegistro === columna.id && (
                          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-500">
                            <h4 className="font-medium mb-3">Nuevo Registro</h4>
                            <FormularioDinamico
                              campos={plantilla.estados.find(e => e.id === columna.id)?.campos || []}
                              onSubmit={(datos) => handleCrearRegistro(columna.id, datos)}
                              onCancel={() => setCreandoRegistro(null)}
                            />
                          </div>
                        )}

                        {/* Registros */}
                        {columna.registros
                          .filter(registro => {
                            if (!busqueda) return true;
                            const busquedaLower = busqueda.toLowerCase();
                            return (
                              registro.codigo.toLowerCase().includes(busquedaLower) ||
                              Object.values(registro.datos || {}).some(valor => 
                                String(valor).toLowerCase().includes(busquedaLower)
                              )
                            );
                          })
                          .map((registro, index) => (
                            <Draggable
                              key={registro._id}
                              draggableId={registro._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TarjetaRegistro
                                    registro={registro}
                                    campos={plantilla.estados.find(e => e.id === columna.id)?.campos || []}
                                    isDragging={snapshot.isDragging}
                                    onClick={() => onRegistroClick?.(registro)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        
                        {provided.placeholder}
                        
                        {/* Mensaje cuando no hay registros */}
                        {columna.registros.length === 0 && !creandoRegistro && (
                          <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">Sin registros</p>
                            <button
                              onClick={() => setCreandoRegistro(columna.id)}
                              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Crear el primero
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Modal de edición de registro */}
      {editandoRegistro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Aquí iría el componente de edición de registro */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Editar Registro: {editandoRegistro.codigo}
              </h3>
              {/* Contenido del editor */}
              <button
                onClick={() => setEditandoRegistro(null)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaKanban;