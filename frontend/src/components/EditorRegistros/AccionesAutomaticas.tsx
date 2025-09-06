import { Calculator, Calendar, Mail, Plus, Settings, Trash2, User, Webhook, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { IAccionAutomatica } from '../../types/editorRegistros';

interface AccionesAutomaticasProps {
  acciones: IAccionAutomatica[];
  onActualizar: (acciones: IAccionAutomatica[]) => void;
}

const AccionesAutomaticas: React.FC<AccionesAutomaticasProps> = ({
  acciones,
  onActualizar
}) => {
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [accionEditando, setAccionEditando] = useState<IAccionAutomatica | null>(null);

  const tiposAccion = [
    { 
      valor: 'enviar_email', 
      label: 'Enviar Email', 
      icono: Mail,
      descripcion: 'Enviar notificación por correo electrónico'
    },
    { 
      valor: 'asignar_usuario', 
      label: 'Asignar Usuario', 
      icono: User,
      descripcion: 'Asignar automáticamente un usuario'
    },
    { 
      valor: 'calcular_campo', 
      label: 'Calcular Campo', 
      icono: Calculator,
      descripcion: 'Calcular el valor de un campo automáticamente'
    },
    { 
      valor: 'crear_tarea', 
      label: 'Crear Tarea', 
      icono: Calendar,
      descripcion: 'Crear una nueva tarea relacionada'
    },
    { 
      valor: 'webhook', 
      label: 'Webhook', 
      icono: Webhook,
      descripcion: 'Enviar datos a un endpoint externo'
    }
  ];

  const triggers = [
    { valor: 'al_entrar', label: 'Al entrar al estado' },
    { valor: 'al_salir', label: 'Al salir del estado' },
    { valor: 'al_vencer', label: 'Al vencer el plazo' },
    { valor: 'al_crear', label: 'Al crear el registro' },
    { valor: 'al_modificar', label: 'Al modificar el registro' }
  ];

  const agregarAccion = () => {
    const nuevaAccion: IAccionAutomatica = {
      tipo: 'enviar_email',
      trigger: 'al_entrar',
      configuracion: {},
      activa: true
    };
    
    setAccionEditando(nuevaAccion);
    setMostrarEditor(true);
  };

  const editarAccion = (accion: IAccionAutomatica) => {
    setAccionEditando(accion);
    setMostrarEditor(true);
  };

  const guardarAccion = () => {
    if (!accionEditando) return;

    const nuevasAcciones = accionEditando.tipo === 'nueva'
      ? [...acciones, { ...accionEditando, tipo: 'enviar_email' }]
      : acciones.map(a => a === accionEditando ? accionEditando : a);

    onActualizar(nuevasAcciones);
    setMostrarEditor(false);
    setAccionEditando(null);
  };

  const eliminarAccion = (index: number) => {
    const nuevasAcciones = acciones.filter((_, i) => i !== index);
    onActualizar(nuevasAcciones);
  };

  const toggleAccion = (index: number) => {
    const nuevasAcciones = acciones.map((accion, i) => 
      i === index ? { ...accion, activa: !accion.activa } : accion
    );
    onActualizar(nuevasAcciones);
  };

  const renderConfiguracion = (tipo: string, configuracion: any) => {
    switch (tipo) {
      case 'enviar_email':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asunto
              </label>
              <input
                type="text"
                value={configuracion.asunto || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, asunto: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Asunto del email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plantilla
              </label>
              <textarea
                value={configuracion.plantilla || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, plantilla: e.target.value }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Plantilla del email (puede usar variables como {{nombre}}, {{estado}})"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destinatarios
              </label>
              <input
                type="text"
                value={configuracion.destinatarios || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, destinatarios: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="responsable,supervisor,admin (separados por comas)"
              />
            </div>
          </div>
        );

      case 'asignar_usuario':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario a asignar
              </label>
              <input
                type="text"
                value={configuracion.usuario_id || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, usuario_id: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID del usuario o rol (ej: supervisor)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de asignación
              </label>
              <select
                value={configuracion.tipo_asignacion || 'responsable'}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, tipo_asignacion: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="responsable">Responsable principal</option>
                <option value="secundario">Responsable secundario</option>
                <option value="observador">Observador</option>
              </select>
            </div>
          </div>
        );

      case 'calcular_campo':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campo a calcular
              </label>
              <input
                type="text"
                value={configuracion.campo_id || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, campo_id: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID del campo a calcular"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fórmula
              </label>
              <input
                type="text"
                value={configuracion.formula || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, formula: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: {{campo1}} + {{campo2}} * 0.1"
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del webhook
              </label>
              <input
                type="url"
                value={configuracion.url || ''}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, url: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.ejemplo.com/webhook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método HTTP
              </label>
              <select
                value={configuracion.metodo || 'POST'}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, metodo: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headers (JSON)
              </label>
              <textarea
                value={configuracion.headers || '{}'}
                onChange={(e) => setAccionEditando({
                  ...accionEditando!,
                  configuracion: { ...configuracion, headers: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2" />
            <p>Configuración no disponible para este tipo de acción</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Acciones Automáticas</span>
        </h3>
        <button
          onClick={agregarAccion}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Acción</span>
        </button>
      </div>

      {acciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">No hay acciones automáticas</p>
          <p className="text-sm">Agrega acciones que se ejecuten automáticamente en ciertos eventos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {acciones.map((accion, index) => {
            const tipoInfo = tiposAccion.find(t => t.valor === accion.tipo);
            const triggerInfo = triggers.find(t => t.valor === accion.trigger);
            
            return (
              <div key={index} className={`border rounded-lg p-4 ${accion.activa ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${accion.activa ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {tipoInfo && <tipoInfo.icono className="h-4 w-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {tipoInfo?.label || accion.tipo}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {triggerInfo?.label || accion.trigger}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAccion(index)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        accion.activa 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {accion.activa ? 'Activa' : 'Inactiva'}
                    </button>
                    <button
                      onClick={() => editarAccion(accion)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => eliminarAccion(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de edición */}
      {mostrarEditor && accionEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {accionEditando.tipo === 'nueva' ? 'Nueva Acción Automática' : 'Editar Acción Automática'}
              </h3>
              <button
                onClick={() => setMostrarEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de acción
                </label>
                <select
                  value={accionEditando.tipo}
                  onChange={(e) => setAccionEditando({
                    ...accionEditando,
                    tipo: e.target.value as any,
                    configuracion: {}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiposAccion.map(tipo => (
                    <option key={tipo.valor} value={tipo.valor}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuándo ejecutar
                </label>
                <select
                  value={accionEditando.trigger}
                  onChange={(e) => setAccionEditando({
                    ...accionEditando,
                    trigger: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {triggers.map(trigger => (
                    <option key={trigger.valor} value={trigger.valor}>
                      {trigger.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Configuración
                </label>
                {renderConfiguracion(accionEditando.tipo, accionEditando.configuracion)}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activa"
                  checked={accionEditando.activa}
                  onChange={(e) => setAccionEditando({
                    ...accionEditando,
                    activa: e.target.checked
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="activa" className="text-sm text-gray-700">
                  Acción activa
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setMostrarEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={guardarAccion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccionesAutomaticas;
