import React, { useState } from 'react';
import { 
  Type, Hash, Calendar, Clock, List, CheckSquare, 
  File, User, Mail, Phone, Link, Palette, Star,
  Sliders, ToggleLeft, Calculator, Database, MapPin,
  Edit3, Barcode, QrCode, Minus, Layout, Code, TrendingUp,
  HelpCircle, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';
import { ICampo, TipoCampo } from '../../types/editorRegistros';

interface CampoEditorProps {
  campo: ICampo;
  onActualizar: (campo: ICampo) => void;
}

const tiposCampo = [
  { grupo: 'Básicos', tipos: [
    { valor: TipoCampo.TEXT, label: 'Texto', icono: Type },
    { valor: TipoCampo.TEXTAREA, label: 'Texto largo', icono: Type },
    { valor: TipoCampo.NUMBER, label: 'Número', icono: Hash },
    { valor: TipoCampo.DECIMAL, label: 'Decimal', icono: Hash }
  ]},
  { grupo: 'Fechas', tipos: [
    { valor: TipoCampo.DATE, label: 'Fecha', icono: Calendar },
    { valor: TipoCampo.DATETIME, label: 'Fecha y hora', icono: Calendar },
    { valor: TipoCampo.TIME, label: 'Hora', icono: Clock }
  ]},
  { grupo: 'Selección', tipos: [
    { valor: TipoCampo.SELECT, label: 'Lista desplegable', icono: List },
    { valor: TipoCampo.MULTISELECT, label: 'Selección múltiple', icono: CheckSquare },
    { valor: TipoCampo.RADIO, label: 'Radio buttons', icono: CheckSquare },
    { valor: TipoCampo.CHECKBOX, label: 'Checkbox', icono: CheckSquare },
    { valor: TipoCampo.CHECKBOX_GROUP, label: 'Grupo checkbox', icono: CheckSquare }
  ]},
  { grupo: 'Archivos', tipos: [
    { valor: TipoCampo.FILE, label: 'Archivo', icono: File },
    { valor: TipoCampo.FILES, label: 'Múltiples archivos', icono: File },
    { valor: TipoCampo.IMAGE, label: 'Imagen', icono: File }
  ]},
  { grupo: 'Usuarios', tipos: [
    { valor: TipoCampo.USER, label: 'Usuario', icono: User },
    { valor: TipoCampo.USERS, label: 'Múltiples usuarios', icono: User }
  ]},
  { grupo: 'Especiales', tipos: [
    { valor: TipoCampo.EMAIL, label: 'Email', icono: Mail },
    { valor: TipoCampo.PHONE, label: 'Teléfono', icono: Phone },
    { valor: TipoCampo.URL, label: 'URL', icono: Link },
    { valor: TipoCampo.COLOR, label: 'Color', icono: Palette },
    { valor: TipoCampo.RATING, label: 'Calificación', icono: Star },
    { valor: TipoCampo.SLIDER, label: 'Slider', icono: Sliders },
    { valor: TipoCampo.SWITCH, label: 'Switch', icono: ToggleLeft }
  ]},
  { grupo: 'Avanzados', tipos: [
    { valor: TipoCampo.FORMULA, label: 'Fórmula', icono: Calculator },
    { valor: TipoCampo.RELATION, label: 'Relación', icono: Database },
    { valor: TipoCampo.LOCATION, label: 'Ubicación', icono: MapPin },
    { valor: TipoCampo.SIGNATURE, label: 'Firma', icono: Edit3 },
    { valor: TipoCampo.BARCODE, label: 'Código de barras', icono: Barcode },
    { valor: TipoCampo.QR, label: 'Código QR', icono: QrCode }
  ]},
  { grupo: 'Visuales', tipos: [
    { valor: TipoCampo.SEPARATOR, label: 'Separador', icono: Minus },
    { valor: TipoCampo.TITLE, label: 'Título', icono: Layout },
    { valor: TipoCampo.HTML, label: 'HTML', icono: Code },
    { valor: TipoCampo.PROGRESS, label: 'Progreso', icono: TrendingUp }
  ]}
];

const CampoEditor: React.FC<CampoEditorProps> = ({ campo, onActualizar }) => {
  const [mostrarTipos, setMostrarTipos] = useState(false);
  const [opcionNueva, setOpcionNueva] = useState('');

  const tipoActual = tiposCampo
    .flatMap(g => g.tipos)
    .find(t => t.valor === campo.tipo);

  const necesitaOpciones = [
    TipoCampo.SELECT, TipoCampo.MULTISELECT, 
    TipoCampo.RADIO, TipoCampo.CHECKBOX_GROUP
  ].includes(campo.tipo);

  const agregarOpcion = () => {
    if (!opcionNueva.trim()) return;

    const nuevaOpcion = {
      valor: opcionNueva.trim(),
      etiqueta: opcionNueva.trim(),
      color: '#6B7280'
    };

    onActualizar({
      ...campo,
      configuracion: {
        ...campo.configuracion,
        opciones: [...(campo.configuracion.opciones || []), nuevaOpcion]
      }
    });

    setOpcionNueva('');
  };

  const eliminarOpcion = (index: number) => {
    const opciones = [...(campo.configuracion.opciones || [])];
    opciones.splice(index, 1);
    
    onActualizar({
      ...campo,
      configuracion: {
        ...campo.configuracion,
        opciones
      }
    });
  };

  const actualizarOpcion = (index: number, key: string, value: string) => {
    const opciones = [...(campo.configuracion.opciones || [])];
    opciones[index] = { ...opciones[index], [key]: value };
    
    onActualizar({
      ...campo,
      configuracion: {
        ...campo.configuracion,
        opciones
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Información básica */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiqueta del campo
          </label>
          <input
            type="text"
            value={campo.etiqueta}
            onChange={(e) => onActualizar({ ...campo, etiqueta: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código interno
          </label>
          <input
            type="text"
            value={campo.codigo}
            onChange={(e) => onActualizar({ ...campo, codigo: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      </div>

      {/* Tipo de campo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de campo
        </label>
        <button
          onClick={() => setMostrarTipos(!mostrarTipos)}
          className="w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center gap-2">
            {tipoActual && (
              <>
                <tipoActual.icono className="w-4 h-4 text-gray-600" />
                <span>{tipoActual.label}</span>
              </>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${mostrarTipos ? 'rotate-180' : ''}`} />
        </button>

        {mostrarTipos && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {tiposCampo.map(grupo => (
              <div key={grupo.grupo}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  {grupo.grupo}
                </div>
                {grupo.tipos.map(tipo => (
                  <button
                    key={tipo.valor}
                    onClick={() => {
                      onActualizar({ ...campo, tipo: tipo.valor });
                      setMostrarTipos(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 ${
                      campo.tipo === tipo.valor ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <tipo.icono className="w-4 h-4" />
                    <span>{tipo.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción / Ayuda
        </label>
        <textarea
          value={campo.descripcion || ''}
          onChange={(e) => onActualizar({ ...campo, descripcion: e.target.value })}
          placeholder="Texto de ayuda para el usuario"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Placeholder */}
      {[TipoCampo.TEXT, TipoCampo.TEXTAREA, TipoCampo.NUMBER, TipoCampo.DECIMAL, 
        TipoCampo.EMAIL, TipoCampo.PHONE, TipoCampo.URL].includes(campo.tipo) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={campo.placeholder || ''}
            onChange={(e) => onActualizar({ ...campo, placeholder: e.target.value })}
            placeholder="Texto de ejemplo"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Opciones para campos de selección */}
      {necesitaOpciones && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opciones
          </label>
          <div className="space-y-2">
            {campo.configuracion.opciones?.map((opcion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opcion.etiqueta}
                  onChange={(e) => actualizarOpcion(index, 'etiqueta', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={opcion.color || '#6B7280'}
                  onChange={(e) => actualizarOpcion(index, 'color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <button
                  onClick={() => eliminarOpcion(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={opcionNueva}
                onChange={(e) => setOpcionNueva(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && agregarOpcion()}
                placeholder="Nueva opción"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={agregarOpcion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuración específica por tipo */}
      {[TipoCampo.NUMBER, TipoCampo.DECIMAL].includes(campo.tipo) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor mínimo
            </label>
            <input
              type="number"
              value={campo.configuracion.minimo || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  minimo: e.target.value ? parseFloat(e.target.value) : undefined
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor máximo
            </label>
            <input
              type="number"
              value={campo.configuracion.maximo || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  maximo: e.target.value ? parseFloat(e.target.value) : undefined
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {campo.tipo === TipoCampo.DECIMAL && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decimales
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={campo.configuracion.decimales || 2}
            onChange={(e) => onActualizar({
              ...campo,
              configuracion: {
                ...campo.configuracion,
                decimales: parseInt(e.target.value)
              }
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {[TipoCampo.TEXT, TipoCampo.TEXTAREA].includes(campo.tipo) && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mínimo caracteres
            </label>
            <input
              type="number"
              value={campo.configuracion.minimo_caracteres || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  minimo_caracteres: e.target.value ? parseInt(e.target.value) : undefined
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo caracteres
            </label>
            <input
              type="number"
              value={campo.configuracion.maximo_caracteres || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  maximo_caracteres: e.target.value ? parseInt(e.target.value) : undefined
                }
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {campo.tipo === TipoCampo.FORMULA && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fórmula
          </label>
          <textarea
            value={campo.configuracion.formula || ''}
            onChange={(e) => onActualizar({
              ...campo,
              configuracion: {
                ...campo.configuracion,
                formula: e.target.value
              }
            })}
            placeholder="Ej: campo1 + campo2"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa los códigos de otros campos en la fórmula
          </p>
        </div>
      )}

      {/* Configuración de archivos */}
      {[TipoCampo.FILE, TipoCampo.FILES, TipoCampo.IMAGE].includes(campo.tipo) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipos permitidos
            </label>
            <input
              type="text"
              value={campo.configuracion.tipos_permitidos?.join(', ') || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  tipos_permitidos: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }
              })}
              placeholder=".pdf, .jpg, .png, .doc"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño máximo (MB)
            </label>
            <input
              type="number"
              value={campo.configuracion.tamaño_maximo_mb || ''}
              onChange={(e) => onActualizar({
                ...campo,
                configuracion: {
                  ...campo.configuracion,
                  tamaño_maximo_mb: e.target.value ? parseInt(e.target.value) : undefined
                }
              })}
              placeholder="10"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {campo.tipo === TipoCampo.FILES && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={campo.configuracion.multiples_archivos || false}
                onChange={(e) => onActualizar({
                  ...campo,
                  configuracion: {
                    ...campo.configuracion,
                    multiples_archivos: e.target.checked
                  }
                })}
                className="rounded"
              />
              <span className="text-sm">Permitir múltiples archivos</span>
            </label>
          )}
        </div>
      )}

      {/* Valor por defecto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor por defecto
        </label>
        <input
          type="text"
          value={campo.valor_default || ''}
          onChange={(e) => onActualizar({ ...campo, valor_default: e.target.value })}
          placeholder="Valor inicial del campo"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Opciones de visualización */}
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-medium text-gray-900">Opciones de visualización</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={campo.requerido}
              onChange={(e) => onActualizar({ ...campo, requerido: e.target.checked })}
              className="rounded text-red-600"
            />
            <span className="text-sm">Campo requerido</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={campo.solo_lectura}
              onChange={(e) => onActualizar({ ...campo, solo_lectura: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Solo lectura</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={campo.visible_tarjeta}
              onChange={(e) => onActualizar({ ...campo, visible_tarjeta: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span className="text-sm">Mostrar en tarjeta</span>
          </label>

          {campo.visible_tarjeta && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Orden en tarjeta
              </label>
              <input
                type="number"
                min="0"
                value={campo.orden_tarjeta}
                onChange={(e) => onActualizar({ 
                  ...campo, 
                  orden_tarjeta: parseInt(e.target.value) || 0 
                })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Grupo de campo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Grupo (opcional)
        </label>
        <input
          type="text"
          value={campo.grupo || ''}
          onChange={(e) => onActualizar({ ...campo, grupo: e.target.value })}
          placeholder="Ej: Información personal"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Los campos del mismo grupo se mostrarán juntos
        </p>
      </div>
    </div>
  );
};

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function Trash2(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

export default CampoEditor;