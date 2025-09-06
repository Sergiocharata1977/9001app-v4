import { Calendar, Eye, FileText, RotateCcw, Settings, Tag, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { IPlantillaRegistro } from '../../types/editorRegistros';

interface VistaPreviaProps {
  plantilla: IPlantillaRegistro;
  onCerrar: () => void;
}

const VistaPrevia: React.FC<VistaPreviaProps> = ({
  plantilla,
  onCerrar
}) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(
    plantilla.estados.find(e => e.es_inicial)?.id || plantilla.estados[0]?.id || null
  );
  const [datosEjemplo, setDatosEjemplo] = useState<Record<string, any>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const estadoActual = plantilla.estados.find(e => e.id === estadoSeleccionado);

  const generarDatosEjemplo = () => {
    const datos: Record<string, any> = {};
    
    if (estadoActual) {
      estadoActual.campos.forEach(campo => {
        switch (campo.tipo) {
          case 'text':
            datos[campo.codigo] = `Ejemplo de ${campo.etiqueta}`;
            break;
          case 'number':
            datos[campo.codigo] = Math.floor(Math.random() * 100);
            break;
          case 'date':
            datos[campo.codigo] = new Date().toISOString().split('T')[0];
            break;
          case 'select':
            datos[campo.codigo] = campo.configuracion.opciones?.[0]?.valor || '';
            break;
          case 'checkbox':
            datos[campo.codigo] = Math.random() > 0.5;
            break;
          default:
            datos[campo.codigo] = `Valor de ${campo.etiqueta}`;
        }
      });
    }
    
    setDatosEjemplo(datos);
  };

  const renderCampo = (campo: any) => {
    const valor = datosEjemplo[campo.codigo] || campo.valor_default || '';

    switch (campo.tipo) {
      case 'text':
        return (
          <input
            type="text"
            value={valor}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder={campo.placeholder || `Ingrese ${campo.etiqueta.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={valor}
            readOnly
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder={campo.placeholder || `Ingrese ${campo.etiqueta.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={valor}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder={campo.placeholder || '0'}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={valor}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
        );

      case 'select':
        return (
          <select
            value={valor}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          >
            <option value="">Seleccione una opción</option>
            {campo.configuracion.opciones?.map((opcion: any) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={valor}
              disabled
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">{campo.etiqueta}</span>
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Arrastra un archivo aquí o haz clic para seleccionar</p>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={valor}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            placeholder={`Campo ${campo.tipo}`}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Vista Previa: {plantilla.nombre}
              </h2>
              <p className="text-sm text-gray-600">
                {plantilla.descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Estados */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Estados</h3>
              <div className="space-y-2">
                {plantilla.estados.map(estado => (
                  <button
                    key={estado.id}
                    onClick={() => setEstadoSeleccionado(estado.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      estadoSeleccionado === estado.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: estado.color }}
                      />
                      <span className="font-medium">{estado.nombre}</span>
                    </div>
                    {estado.descripcion && (
                      <p className="text-xs text-gray-500 mt-1">{estado.descripcion}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {estado.es_inicial && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                          Inicial
                        </span>
                      )}
                      {estado.es_final && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                          Final
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {estadoActual ? (
              <div className="p-6">
                {/* Estado Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: estadoActual.color }}
                      />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {estadoActual.nombre}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={generarDatosEjemplo}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Generar Datos</span>
                      </button>
                      <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        <Settings className="h-4 w-4" />
                        <span>{mostrarFormulario ? 'Ocultar' : 'Mostrar'} Formulario</span>
                      </button>
                    </div>
                  </div>
                  {estadoActual.descripcion && (
                    <p className="text-gray-600 mt-2">{estadoActual.descripcion}</p>
                  )}
                </div>

                {/* Campos del Estado */}
                {mostrarFormulario && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {estadoActual.campos.map(campo => (
                        <div key={campo.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {campo.etiqueta}
                            {campo.requerido && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          {campo.descripcion && (
                            <p className="text-xs text-gray-500">{campo.descripcion}</p>
                          )}
                          {renderCampo(campo)}
                          {campo.ayuda && (
                            <p className="text-xs text-blue-600">{campo.ayuda}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Transiciones */}
                    {estadoActual.transiciones_permitidas.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-md font-medium text-gray-900 mb-4">
                          Transiciones Permitidas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {estadoActual.transiciones_permitidas.map((transicion, index) => {
                            const estadoDestino = plantilla.estados.find(e => e.id === transicion.estado_destino_id);
                            return (
                              <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: estadoDestino?.color }}
                                  />
                                  <span className="font-medium text-gray-900">
                                    {estadoDestino?.nombre}
                                  </span>
                                </div>
                                {transicion.requiere_comentario && (
                                  <div className="flex items-center space-x-1 text-xs text-orange-600">
                                    <span>⚠️</span>
                                    <span>Requiere comentario</span>
                                  </div>
                                )}
                                {transicion.condiciones.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {transicion.condiciones.length} condición(es)
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Acciones Automáticas */}
                    {estadoActual.acciones_automaticas.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-md font-medium text-gray-900 mb-4">
                          Acciones Automáticas
                        </h4>
                        <div className="space-y-2">
                          {estadoActual.acciones_automaticas.map((accion, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className={`w-2 h-2 rounded-full ${accion.activa ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {accion.tipo.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({accion.trigger.replace('_', ' ')})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Vista de Tarjeta */}
                {!mostrarFormulario && (
                  <div className="max-w-md">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Vista de Tarjeta
                    </h4>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: estadoActual.color }}
                          />
                          <span className="font-medium text-gray-900">
                            {plantilla.nombre}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {estadoActual.nombre}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {estadoActual.campos
                          .filter(campo => campo.visible_tarjeta)
                          .sort((a, b) => a.orden_tarjeta - b.orden_tarjeta)
                          .slice(0, 3)
                          .map(campo => (
                            <div key={campo.id} className="text-sm">
                              <span className="text-gray-500">{campo.etiqueta}:</span>
                              <span className="ml-2 text-gray-900">
                                {datosEjemplo[campo.codigo] || 'Sin valor'}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Usuario</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Hoy</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Selecciona un estado para ver la vista previa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaPrevia;
