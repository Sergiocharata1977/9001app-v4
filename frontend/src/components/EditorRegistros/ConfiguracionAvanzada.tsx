import React, { useState } from 'react';
import { Settings, Hash, Bell, Shield, Webhook, Save, X } from 'lucide-react';
import { IConfiguracionAvanzada, IPermisos } from '../../types/editorRegistros';

interface ConfiguracionAvanzadaProps {
  configuracion: IConfiguracionAvanzada;
  permisos: IPermisos;
  onGuardar: (configuracion: IConfiguracionAvanzada, permisos: IPermisos) => void;
  onCerrar: () => void;
}

const ConfiguracionAvanzada: React.FC<ConfiguracionAvanzadaProps> = ({
  configuracion,
  permisos,
  onGuardar,
  onCerrar
}) => {
  const [config, setConfig] = useState<IConfiguracionAvanzada>(configuracion);
  const [permisosState, setPermisosState] = useState<IPermisos>(permisos);
  const [tabActiva, setTabActiva] = useState<'numeracion' | 'notificaciones' | 'permisos' | 'integraciones'>('numeracion');

  const roles = ['admin', 'usuario', 'supervisor', 'auditor', 'invitado'];

  const handleGuardar = () => {
    onGuardar(config, permisosState);
  };

  const togglePermiso = (categoria: keyof IPermisos, rol: string) => {
    setPermisosState(prev => ({
      ...prev,
      [categoria]: prev[categoria].includes(rol)
        ? prev[categoria].filter(r => r !== rol)
        : [...prev[categoria], rol]
    }));
  };

  const tabs = [
    { id: 'numeracion', label: 'Numeración', icon: Hash },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'permisos', label: 'Permisos', icon: Shield },
    { id: 'integraciones', label: 'Integraciones', icon: Webhook }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Configuración Avanzada
            </h2>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    tabActiva === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tabActiva === 'numeracion' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Numeración Automática
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="numeracion_activa"
                      checked={config.numeracion_automatica.activa}
                      onChange={(e) => setConfig({
                        ...config,
                        numeracion_automatica: {
                          ...config.numeracion_automatica,
                          activa: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="numeracion_activa" className="text-sm font-medium text-gray-700">
                      Habilitar numeración automática
                    </label>
                  </div>

                  {config.numeracion_automatica.activa && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prefijo
                        </label>
                        <input
                          type="text"
                          value={config.numeracion_automatica.prefijo}
                          onChange={(e) => setConfig({
                            ...config,
                            numeracion_automatica: {
                              ...config.numeracion_automatica,
                              prefijo: e.target.value
                            }
                          })}
                          placeholder="REG"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitud del número
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={config.numeracion_automatica.longitud_numero}
                          onChange={(e) => setConfig({
                            ...config,
                            numeracion_automatica: {
                              ...config.numeracion_automatica,
                              longitud_numero: parseInt(e.target.value) || 4
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reiniciar anualmente
                        </label>
                        <input
                          type="checkbox"
                          checked={config.numeracion_automatica.reiniciar_anual}
                          onChange={(e) => setConfig({
                            ...config,
                            numeracion_automatica: {
                              ...config.numeracion_automatica,
                              reiniciar_anual: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reiniciar mensualmente
                        </label>
                        <input
                          type="checkbox"
                          checked={config.numeracion_automatica.reiniciar_mensual}
                          onChange={(e) => setConfig({
                            ...config,
                            numeracion_automatica: {
                              ...config.numeracion_automatica,
                              reiniciar_mensual: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Funcionalidades Adicionales
                </h3>
                
                <div className="space-y-3">
                  {[
                    { key: 'permitir_comentarios', label: 'Permitir comentarios' },
                    { key: 'permitir_archivos_adjuntos', label: 'Permitir archivos adjuntos' },
                    { key: 'permitir_checklist', label: 'Permitir checklist' },
                    { key: 'permitir_etiquetas', label: 'Permitir etiquetas' },
                    { key: 'requerir_firma_digital', label: 'Requerir firma digital' },
                    { key: 'habilitar_recordatorios', label: 'Habilitar recordatorios' }
                  ].map(feature => (
                    <div key={feature.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={feature.key}
                        checked={config[feature.key as keyof IConfiguracionAvanzada] as boolean}
                        onChange={(e) => setConfig({
                          ...config,
                          [feature.key]: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={feature.key} className="text-sm font-medium text-gray-700">
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tabActiva === 'notificaciones' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configuración de Notificaciones
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'al_crear', label: 'Al crear registro' },
                    { key: 'al_cambiar_estado', label: 'Al cambiar estado' },
                    { key: 'al_vencer', label: 'Al vencer plazo' },
                    { key: 'al_comentar', label: 'Al agregar comentario' },
                    { key: 'al_asignar', label: 'Al asignar responsable' }
                  ].map(notif => (
                    <div key={notif.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={notif.key}
                        checked={config.notificaciones?.[notif.key as keyof typeof config.notificaciones] as boolean || false}
                        onChange={(e) => setConfig({
                          ...config,
                          notificaciones: {
                            ...config.notificaciones,
                            [notif.key]: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={notif.key} className="text-sm font-medium text-gray-700">
                        {notif.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal por defecto
                  </label>
                  <select
                    value={config.notificaciones?.canal_default || 'email'}
                    onChange={(e) => setConfig({
                      ...config,
                      notificaciones: {
                        ...config.notificaciones,
                        canal_default: e.target.value as any
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="sistema">Sistema</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tabActiva === 'permisos' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Permisos por Rol
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crear
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ver
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Editar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roles.map(rol => (
                        <tr key={rol}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {rol}
                          </td>
                          {(['crear', 'ver', 'editar', 'eliminar'] as const).map(permiso => (
                            <td key={permiso} className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={permisosState[permiso].includes(rol)}
                                onChange={() => togglePermiso(permiso, rol)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tabActiva === 'integraciones' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Integraciones Externas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={config.integraciones?.webhook_url || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        integraciones: {
                          ...config.integraciones,
                          webhook_url: e.target.value
                        }
                      })}
                      placeholder="https://api.ejemplo.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={config.integraciones?.api_key || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        integraciones: {
                          ...config.integraciones,
                          api_key: e.target.value
                        }
                      })}
                      placeholder="Clave de API para autenticación"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eventos a enviar
                    </label>
                    <div className="space-y-2">
                      {['crear', 'actualizar', 'eliminar', 'cambiar_estado'].map(evento => (
                        <div key={evento} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`evento_${evento}`}
                            checked={config.integraciones?.eventos?.includes(evento) || false}
                            onChange={(e) => {
                              const eventos = config.integraciones?.eventos || [];
                              const nuevosEventos = e.target.checked
                                ? [...eventos, evento]
                                : eventos.filter(e => e !== evento);
                              
                              setConfig({
                                ...config,
                                integraciones: {
                                  ...config.integraciones,
                                  eventos: nuevosEventos
                                }
                              });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`evento_${evento}`} className="text-sm font-medium text-gray-700 capitalize">
                            {evento.replace('_', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionAvanzada;
