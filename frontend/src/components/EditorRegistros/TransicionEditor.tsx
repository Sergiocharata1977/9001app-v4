import { AlertCircle, ArrowRight, Plus, Settings, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ICondicionTransicion, ITransicion } from '../../types/editorRegistros';

interface TransicionEditorProps {
  transicion: ITransicion;
  todosLosEstados: any[];
  onActualizar: (transicion: ITransicion) => void;
  onEliminar: () => void;
}

const TransicionEditor: React.FC<TransicionEditorProps> = ({
  transicion,
  todosLosEstados,
  onActualizar,
  onEliminar
}) => {
  const [mostrarCondiciones, setMostrarCondiciones] = useState(false);

  const agregarCondicion = () => {
    const nuevaCondicion: ICondicionTransicion = {
      campo_id: '',
      operador: 'igual',
      valor: ''
    };
    
    onActualizar({
      ...transicion,
      condiciones: [...transicion.condiciones, nuevaCondicion]
    });
  };

  const actualizarCondicion = (index: number, condicion: ICondicionTransicion) => {
    const nuevasCondiciones = [...transicion.condiciones];
    nuevasCondiciones[index] = condicion;
    
    onActualizar({
      ...transicion,
      condiciones: nuevasCondiciones
    });
  };

  const eliminarCondicion = (index: number) => {
    const nuevasCondiciones = transicion.condiciones.filter((_, i) => i !== index);
    
    onActualizar({
      ...transicion,
      condiciones: nuevasCondiciones
    });
  };

  const operadores = [
    { valor: 'igual', label: 'Igual a' },
    { valor: 'diferente', label: 'Diferente de' },
    { valor: 'mayor', label: 'Mayor que' },
    { valor: 'menor', label: 'Menor que' },
    { valor: 'contiene', label: 'Contiene' },
    { valor: 'no_contiene', label: 'No contiene' },
    { valor: 'vacio', label: 'Está vacío' },
    { valor: 'no_vacio', label: 'No está vacío' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ArrowRight className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">
            Transición a: {todosLosEstados.find(e => e.id === transicion.estado_destino_id)?.nombre || 'Estado no encontrado'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMostrarCondiciones(!mostrarCondiciones)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Configurar condiciones"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={onEliminar}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
            title="Eliminar transición"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Configuración básica */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requiere comentario
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={transicion.requiere_comentario}
              onChange={(e) => onActualizar({
                ...transicion,
                requiere_comentario: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600">
              El usuario debe escribir un comentario al cambiar a este estado
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje de confirmación
          </label>
          <input
            type="text"
            value={transicion.mensaje_confirmacion || ''}
            onChange={(e) => onActualizar({
              ...transicion,
              mensaje_confirmacion: e.target.value
            })}
            placeholder="¿Está seguro de cambiar a este estado?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roles permitidos
          </label>
          <div className="flex flex-wrap gap-2">
            {['admin', 'usuario', 'supervisor', 'auditor'].map(rol => (
              <label key={rol} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={transicion.roles_permitidos.includes(rol)}
                  onChange={(e) => {
                    const nuevosRoles = e.target.checked
                      ? [...transicion.roles_permitidos, rol]
                      : transicion.roles_permitidos.filter(r => r !== rol);
                    
                    onActualizar({
                      ...transicion,
                      roles_permitidos: nuevosRoles
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600 capitalize">{rol}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Condiciones */}
      {mostrarCondiciones && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>Condiciones para la transición</span>
            </h4>
            <button
              onClick={agregarCondicion}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar condición</span>
            </button>
          </div>

          {transicion.condiciones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No hay condiciones configuradas</p>
              <p className="text-sm">La transición estará siempre disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transicion.condiciones.map((condicion, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Condición {index + 1}
                    </span>
                    <button
                      onClick={() => eliminarCondicion(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Campo
                      </label>
                      <input
                        type="text"
                        value={condicion.campo_id}
                        onChange={(e) => actualizarCondicion(index, {
                          ...condicion,
                          campo_id: e.target.value
                        })}
                        placeholder="ID del campo"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Operador
                      </label>
                      <select
                        value={condicion.operador}
                        onChange={(e) => actualizarCondicion(index, {
                          ...condicion,
                          operador: e.target.value as any
                        })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {operadores.map(op => (
                          <option key={op.valor} value={op.valor}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {!['vacio', 'no_vacio'].includes(condicion.operador) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Valor
                        </label>
                        <input
                          type="text"
                          value={condicion.valor || ''}
                          onChange={(e) => actualizarCondicion(index, {
                            ...condicion,
                            valor: e.target.value
                          })}
                          placeholder="Valor esperado"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransicionEditor;
