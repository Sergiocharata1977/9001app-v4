import { AlertCircle, FileText, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ICampo, IEstado, IPlantillaRegistro, TipoCampo } from '../../types/editorRegistros';

interface FormularioDinamicoProps {
  plantilla: IPlantillaRegistro;
  estado: IEstado;
  datosIniciales?: Record<string, any>;
  onGuardar: (datos: Record<string, any>) => void;
  onCancelar: () => void;
  modoEdicion?: boolean;
}

const FormularioDinamico: React.FC<FormularioDinamicoProps> = ({
  plantilla,
  estado,
  datosIniciales = {},
  onGuardar,
  onCancelar,
  modoEdicion = false
}) => {
  const [datos, setDatos] = useState<Record<string, any>>(datosIniciales);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Inicializar datos con valores por defecto
    const datosInicializados: Record<string, any> = { ...datosIniciales };
    
    estado.campos.forEach(campo => {
      if (datosInicializados[campo.codigo] === undefined && campo.valor_default !== undefined) {
        datosInicializados[campo.codigo] = campo.valor_default;
      }
    });
    
    setDatos(datosInicializados);
  }, [estado, datosIniciales]);

  const validarCampo = (campo: ICampo, valor: any): string | null => {
    // Validación requerido
    if (campo.requerido && (!valor || valor === '')) {
      return `${campo.etiqueta} es requerido`;
    }

    // Validaciones específicas por tipo
    switch (campo.tipo) {
      case TipoCampo.EMAIL:
        if (valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
          return 'Formato de email inválido';
        }
        break;
      
      case TipoCampo.NUMBER:
      case TipoCampo.DECIMAL:
        if (valor && isNaN(Number(valor))) {
          return 'Debe ser un número válido';
        }
        if (campo.configuracion.minimo !== undefined && Number(valor) < campo.configuracion.minimo) {
          return `El valor mínimo es ${campo.configuracion.minimo}`;
        }
        if (campo.configuracion.maximo !== undefined && Number(valor) > campo.configuracion.maximo) {
          return `El valor máximo es ${campo.configuracion.maximo}`;
        }
        break;
      
      case TipoCampo.DATE:
        if (valor && campo.configuracion.fecha_minima) {
          const fechaMinima = new Date(campo.configuracion.fecha_minima);
          const fechaValor = new Date(valor);
          if (fechaValor < fechaMinima) {
            return `La fecha mínima es ${fechaMinima.toLocaleDateString()}`;
          }
        }
        if (valor && campo.configuracion.fecha_maxima) {
          const fechaMaxima = new Date(campo.configuracion.fecha_maxima);
          const fechaValor = new Date(valor);
          if (fechaValor > fechaMaxima) {
            return `La fecha máxima es ${fechaMaxima.toLocaleDateString()}`;
          }
        }
        break;
      
      case TipoCampo.TEXT:
      case TipoCampo.TEXTAREA:
        if (campo.configuracion.minimo_caracteres && valor.length < campo.configuracion.minimo_caracteres) {
          return `Mínimo ${campo.configuracion.minimo_caracteres} caracteres`;
        }
        if (campo.configuracion.maximo_caracteres && valor.length > campo.configuracion.maximo_caracteres) {
          return `Máximo ${campo.configuracion.maximo_caracteres} caracteres`;
        }
        if (campo.configuracion.patron_regex && valor && !new RegExp(campo.configuracion.patron_regex).test(valor)) {
          return 'Formato inválido';
        }
        break;
    }

    // Validaciones personalizadas
    campo.validaciones.forEach(validacion => {
      switch (validacion.tipo) {
        case 'regex':
          if (valor && !new RegExp(validacion.configuracion.patron).test(valor)) {
            return validacion.mensaje_error;
          }
          break;
        case 'rango':
          if (valor && (valor < validacion.configuracion.min || valor > validacion.configuracion.max)) {
            return validacion.mensaje_error;
          }
          break;
        case 'unico':
          // Esta validación se haría en el backend
          break;
      }
    });

    return null;
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    let esValido = true;

    estado.campos.forEach(campo => {
      const error = validarCampo(campo, datos[campo.codigo]);
      if (error) {
        nuevosErrores[campo.codigo] = error;
        esValido = false;
      }
    });

    setErrores(nuevosErrores);
    return esValido;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    try {
      await onGuardar(datos);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarCampo = (codigo: string, valor: any) => {
    setDatos(prev => ({ ...prev, [codigo]: valor }));
    
    // Limpiar error si existe
    if (errores[codigo]) {
      setErrores(prev => {
        const nuevos = { ...prev };
        delete nuevos[codigo];
        return nuevos;
      });
    }
  };

  const renderCampo = (campo: ICampo) => {
    const valor = datos[campo.codigo] || '';
    const error = errores[campo.codigo];
    const esRequerido = campo.requerido;
    const esSoloLectura = campo.solo_lectura;

    const inputBaseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error 
        ? 'border-red-300 focus:border-red-500' 
        : 'border-gray-300 focus:border-transparent'
    } ${esSoloLectura ? 'bg-gray-50 text-gray-600' : ''}`;

    const labelClasses = `block text-sm font-medium text-gray-700 mb-1 ${
      esRequerido ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''
    }`;

    switch (campo.tipo) {
      case TipoCampo.TEXT:
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || `Ingrese ${campo.etiqueta.toLowerCase()}`}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.TEXTAREA:
        return (
          <textarea
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || `Ingrese ${campo.etiqueta.toLowerCase()}`}
            disabled={esSoloLectura}
            rows={4}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.NUMBER:
        return (
          <input
            type="number"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || '0'}
            disabled={esSoloLectura}
            min={campo.configuracion.minimo}
            max={campo.configuracion.maximo}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.DECIMAL:
        return (
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || '0.00'}
            disabled={esSoloLectura}
            min={campo.configuracion.minimo}
            max={campo.configuracion.maximo}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.DATE:
        return (
          <input
            type="date"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            disabled={esSoloLectura}
            min={campo.configuracion.fecha_minima}
            max={campo.configuracion.fecha_maxima}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.DATETIME:
        return (
          <input
            type="datetime-local"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.TIME:
        return (
          <input
            type="time"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.SELECT:
        return (
          <select
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          >
            <option value="">Seleccione una opción</option>
            {campo.configuracion.opciones?.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        );

      case TipoCampo.MULTISELECT:
        return (
          <div className="space-y-2">
            {campo.configuracion.opciones?.map((opcion) => (
              <label key={opcion.valor} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(valor) && valor.includes(opcion.valor)}
                  onChange={(e) => {
                    const valoresActuales = Array.isArray(valor) ? valor : [];
                    const nuevosValores = e.target.checked
                      ? [...valoresActuales, opcion.valor]
                      : valoresActuales.filter(v => v !== opcion.valor);
                    actualizarCampo(campo.codigo, nuevosValores);
                  }}
                  disabled={esSoloLectura}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{opcion.etiqueta}</span>
              </label>
            ))}
          </div>
        );

      case TipoCampo.RADIO:
        return (
          <div className="space-y-2">
            {campo.configuracion.opciones?.map((opcion) => (
              <label key={opcion.valor} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={campo.codigo}
                  value={opcion.valor}
                  checked={valor === opcion.valor}
                  onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
                  disabled={esSoloLectura}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{opcion.etiqueta}</span>
              </label>
            ))}
          </div>
        );

      case TipoCampo.CHECKBOX:
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={valor}
              onChange={(e) => actualizarCampo(campo.codigo, e.target.checked)}
              disabled={esSoloLectura}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{campo.etiqueta}</span>
          </div>
        );

      case TipoCampo.EMAIL:
        return (
          <input
            type="email"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || 'usuario@ejemplo.com'}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.PHONE:
        return (
          <input
            type="tel"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || '+1 (555) 123-4567'}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.URL:
        return (
          <input
            type="url"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={campo.placeholder || 'https://ejemplo.com'}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );

      case TipoCampo.FILE:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Arrastra un archivo aquí o haz clic para seleccionar</p>
            <input
              type="file"
              onChange={(e) => {
                const archivo = e.target.files?.[0];
                if (archivo) {
                  actualizarCampo(campo.codigo, archivo);
                }
              }}
              disabled={esSoloLectura}
              className="hidden"
              id={`file-${campo.codigo}`}
            />
            <label
              htmlFor={`file-${campo.codigo}`}
              className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Seleccionar archivo
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={valor}
            onChange={(e) => actualizarCampo(campo.codigo, e.target.value)}
            placeholder={`Campo ${campo.tipo}`}
            disabled={esSoloLectura}
            className={inputBaseClasses}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
          </h3>
          <p className="text-sm text-gray-600">
            {plantilla.nombre} - {estado.nombre}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: estado.color }}
          />
          <span className="text-sm font-medium text-gray-700">{estado.nombre}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos agrupados */}
        {estado.campos
          .sort((a, b) => a.orden_formulario - b.orden_formulario)
          .map(campo => (
            <div key={campo.id} className="space-y-2">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${
                campo.requerido ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''
              }`}>
                {campo.etiqueta}
              </label>
              
              {campo.descripcion && (
                <p className="text-xs text-gray-500">{campo.descripcion}</p>
              )}
              
              {renderCampo(campo)}
              
              {errores[campo.codigo] && (
                <div className="flex items-center space-x-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errores[campo.codigo]}</span>
                </div>
              )}
              
              {campo.ayuda && (
                <p className="text-xs text-blue-600">{campo.ayuda}</p>
              )}
            </div>
          ))}

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{modoEdicion ? 'Actualizar' : 'Crear'} Registro</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDinamico;
