import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { plantillaRegistroService } from '../../services/plantillaRegistro.service';
import { IEstado, IPlantillaRegistro, TipoCampo } from '../../types/editorRegistros';

interface PlantillaEditorProps {
  plantillaId?: string;
  onSave?: (plantilla: IPlantillaRegistro) => void;
  onCancel?: () => void;
}

const PlantillaEditor: React.FC<PlantillaEditorProps> = ({ 
  plantillaId, 
  onSave, 
  onCancel 
}) => {
  const [plantilla, setPlantilla] = useState<IPlantillaRegistro>({
    id: plantillaId || uuidv4(),
    nombre: '',
    descripcion: '',
    estados: [],
    campos: [],
    configuracion: {
      numeracion: {
        activa: false,
        prefijo: '',
        longitud_numero: 4,
        reiniciar_anual: true,
        reiniciar_mensual: false
      },
      versionado: {
        activo: false,
        version_inicial: '1.0'
      },
      visual: {
        color_principal: '#3b82f6',
        icono: '📋',
        mostrar_responsable: true
      }
    },
    activa: true,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
    creado_por: 'usuario_actual'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plantillaId) {
      cargarPlantilla();
    }
  }, [plantillaId]);

  const cargarPlantilla = async () => {
    if (!plantillaId) return;
    
    setLoading(true);
    try {
      const data = await plantillaRegistroService.getById(plantillaId);
      setPlantilla(data);
    } catch (err) {
      setError('Error al cargar la plantilla');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const plantillaGuardada = await plantillaRegistroService.save(plantilla);
      onSave?.(plantillaGuardada);
    } catch (err) {
      setError('Error al guardar la plantilla');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarEstado = () => {
    const nuevoEstado: IEstado = {
      id: uuidv4(),
      nombre: 'Nuevo Estado',
      descripcion: '',
      color: '#6b7280',
      orden: plantilla.estados.length,
      activo: true
    };
    
    setPlantilla(prev => ({
      ...prev,
      estados: [...prev.estados, nuevoEstado]
    }));
  };

  const agregarCampo = () => {
    const nuevoCampo = {
      id: uuidv4(),
      nombre: 'Nuevo Campo',
      tipo: 'text' as TipoCampo,
      requerido: false,
      opciones: [],
      orden: plantilla.campos.length,
      activo: true
    };
    
    setPlantilla(prev => ({
      ...prev,
      campos: [...prev.campos, nuevoCampo]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plantilla...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {plantillaId ? 'Editar Plantilla' : 'Nueva Plantilla'}
              </h2>
              <p className="text-gray-600 mt-1">
                Configura los estados y campos para tu registro de proceso
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-6 rounded">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                value={plantilla.nombre}
                onChange={(e) => setPlantilla(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Registro de Auditoría Interna"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={plantilla.descripcion}
                onChange={(e) => setPlantilla(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción breve del registro"
              />
            </div>
          </div>

          {/* Estados */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estados del Proceso</h3>
              <button
                onClick={agregarEstado}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Estado</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {plantilla.estados.map((estado, index) => (
                <div key={estado.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: estado.color }}
                  ></div>
                  <input
                    type="text"
                    value={estado.nombre}
                    onChange={(e) => {
                      const nuevosEstados = [...plantilla.estados];
                      nuevosEstados[index].nombre = e.target.value;
                      setPlantilla(prev => ({ ...prev, estados: nuevosEstados }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const nuevosEstados = plantilla.estados.filter((_, i) => i !== index);
                      setPlantilla(prev => ({ ...prev, estados: nuevosEstados }));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {plantilla.estados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay estados configurados</p>
                  <p className="text-sm">Agrega estados para definir el flujo del proceso</p>
                </div>
              )}
            </div>
          </div>

          {/* Campos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Campos del Registro</h3>
              <button
                onClick={agregarCampo}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Campo</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {plantilla.campos.map((campo, index) => (
                <div key={campo.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={campo.nombre}
                      onChange={(e) => {
                        const nuevosCampos = [...plantilla.campos];
                        nuevosCampos[index].nombre = e.target.value;
                        setPlantilla(prev => ({ ...prev, campos: nuevosCampos }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del campo"
                    />
                    <select
                      value={campo.tipo}
                      onChange={(e) => {
                        const nuevosCampos = [...plantilla.campos];
                        nuevosCampos[index].tipo = e.target.value as TipoCampo;
                        setPlantilla(prev => ({ ...prev, campos: nuevosCampos }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Texto</option>
                      <option value="textarea">Área de texto</option>
                      <option value="number">Número</option>
                      <option value="date">Fecha</option>
                      <option value="select">Lista desplegable</option>
                      <option value="checkbox">Casilla de verificación</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={campo.requerido}
                          onChange={(e) => {
                            const nuevosCampos = [...plantilla.campos];
                            nuevosCampos[index].requerido = e.target.checked;
                            setPlantilla(prev => ({ ...prev, campos: nuevosCampos }));
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">Requerido</span>
                      </label>
                      <button
                        onClick={() => {
                          const nuevosCampos = plantilla.campos.filter((_, i) => i !== index);
                          setPlantilla(prev => ({ ...prev, campos: nuevosCampos }));
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {plantilla.campos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay campos configurados</p>
                  <p className="text-sm">Agrega campos para capturar información en el registro</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantillaEditor;
