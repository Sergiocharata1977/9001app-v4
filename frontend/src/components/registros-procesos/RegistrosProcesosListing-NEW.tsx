import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { IEstado, IPlantillaRegistro } from '@/types/editorRegistros';
import { Edit, Eye, FileText, Grid3X3, List, Plus, Search, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrearPlantillaModal from './CrearPlantillaModal';
import EditorCamposEstado from './EditorCamposEstado';

// Datos de ejemplo con la nueva estructura
const plantillasEjemplo: IPlantillaRegistro[] = [
  {
    _id: '1',
    codigo: 'PLT-001',
    nombre: 'Registro de Auditoría Interna',
    descripcion: 'Plantilla para registrar auditorías internas del sistema de calidad',
    organizacion_id: 'org-1',
    activo: true,
    categoria: 'Calidad',
    modulo: 'SGC',
    tags: ['auditoria', 'calidad', 'iso9001'],
    proceso_id: 'proc-001',
    configuracion_visual: {
      icono: 'document',
      color_primario: '#3B82F6',
      vista_default: 'kanban',
      mostrar_progreso: true,
      mostrar_tiempo: true,
      mostrar_responsable: true
    },
    estados: [
      {
        id: '1',
        codigo: 'PROG',
        nombre: 'Programada',
        descripcion: 'Auditoría programada',
        orden: 1,
        color: '#f59e0b',
        es_inicial: true,
        es_final: false,
        campos: [
          {
            id: '1',
            codigo: 'auditor',
            etiqueta: 'Auditor',
            tipo: 'user',
            requerido: true,
            solo_lectura: false,
            visible_tarjeta: true,
            orden_tarjeta: 1,
            orden_formulario: 1,
            configuracion: {},
            validaciones: [],
            permisos: {
              ver: ['admin', 'supervisor', 'usuario'],
              editar: ['admin', 'supervisor'],
              requerido_para: []
            }
          },
          {
            id: '2',
            codigo: 'fecha',
            etiqueta: 'Fecha',
            tipo: 'date',
            requerido: true,
            solo_lectura: false,
            visible_tarjeta: true,
            orden_tarjeta: 2,
            orden_formulario: 2,
            configuracion: {},
            validaciones: [],
            permisos: {
              ver: ['admin', 'supervisor', 'usuario'],
              editar: ['admin', 'supervisor'],
              requerido_para: []
            }
          }
        ],
        transiciones_permitidas: [],
        acciones_automaticas: [],
        tiempo: {
          dias_maximo: undefined,
          dias_alerta: undefined,
          excluir_fines_semana: false,
          excluir_feriados: false
        },
        permisos: {
          puede_crear: ['admin', 'supervisor'],
          puede_editar: ['admin', 'supervisor'],
          puede_mover_desde: [],
          puede_mover_hacia: ['admin', 'supervisor']
        }
      },
      {
        id: '2',
        codigo: 'PROG',
        nombre: 'En Progreso',
        descripcion: 'Auditoría en ejecución',
        orden: 2,
        color: '#3b82f6',
        es_inicial: false,
        es_final: false,
        campos: [
          {
            id: '3',
            codigo: 'area',
            etiqueta: 'Área',
            tipo: 'select',
            requerido: true,
            solo_lectura: false,
            visible_tarjeta: true,
            orden_tarjeta: 1,
            orden_formulario: 1,
            configuracion: {
              opciones: [
                { valor: 'produccion', etiqueta: 'Producción' },
                { valor: 'calidad', etiqueta: 'Calidad' },
                { valor: 'rrhh', etiqueta: 'RRHH' }
              ]
            },
            validaciones: [],
            permisos: {
              ver: ['admin', 'supervisor', 'usuario'],
              editar: ['admin', 'supervisor'],
              requerido_para: []
            }
          }
        ],
        transiciones_permitidas: [],
        acciones_automaticas: [],
        tiempo: {
          dias_maximo: undefined,
          dias_alerta: undefined,
          excluir_fines_semana: false,
          excluir_feriados: false
        },
        permisos: {
          puede_crear: ['admin', 'supervisor'],
          puede_editar: ['admin', 'supervisor'],
          puede_mover_desde: ['admin', 'supervisor'],
          puede_mover_hacia: ['admin', 'supervisor']
        }
      },
      {
        id: '3',
        codigo: 'COMP',
        nombre: 'Completada',
        descripcion: 'Auditoría finalizada',
        orden: 3,
        color: '#10b981',
        es_inicial: false,
        es_final: true,
        campos: [
          {
            id: '4',
            codigo: 'resultado',
            etiqueta: 'Resultado',
            tipo: 'select',
            requerido: true,
            solo_lectura: false,
            visible_tarjeta: true,
            orden_tarjeta: 1,
            orden_formulario: 1,
            configuracion: {
              opciones: [
                { valor: 'conforme', etiqueta: 'Conforme' },
                { valor: 'no_conforme', etiqueta: 'No Conforme' },
                { valor: 'observacion', etiqueta: 'Observación' }
              ]
            },
            validaciones: [],
            permisos: {
              ver: ['admin', 'supervisor', 'usuario'],
              editar: ['admin', 'supervisor'],
              requerido_para: []
            }
          }
        ],
        transiciones_permitidas: [],
        acciones_automaticas: [],
        tiempo: {
          dias_maximo: undefined,
          dias_alerta: undefined,
          excluir_fines_semana: false,
          excluir_feriados: false
        },
        permisos: {
          puede_crear: ['admin', 'supervisor'],
          puede_editar: ['admin', 'supervisor'],
          puede_mover_desde: ['admin', 'supervisor'],
          puede_mover_hacia: []
        }
      }
    ],
    configuracion_avanzada: {
      numeracion_automatica: {
        activa: true,
        prefijo: 'AUD',
        formato: '{prefijo}-{año}-{numero}',
        reiniciar_anual: true,
        reiniciar_mensual: false
      },
      versionado: {
        activo: true,
        version_actual: 1,
        historial_cambios: []
      },
      notificaciones: {
        activas: true,
        eventos: ['creacion', 'cambio_estado', 'vencimiento']
      }
    },
    permisos: {
      ver: ['admin', 'supervisor', 'usuario'],
      crear: ['admin', 'supervisor'],
      editar: ['admin', 'supervisor'],
      eliminar: ['admin'],
      exportar: ['admin', 'supervisor'],
      importar: ['admin']
    },
    auditoria: {
      creado_por: 'admin',
      fecha_creacion: new Date(),
      version: 1,
      cambios_historial: []
    },
    eliminado: false
  }
];

export default function RegistrosProcesosListingNEW() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plantillas, setPlantillas] = useState<IPlantillaRegistro[]>(plantillasEjemplo);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estadoEditando, setEstadoEditando] = useState<IEstado | null>(null);

  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    plantilla.descripcion?.toLowerCase().includes(searchText.toLowerCase()) ||
    plantilla.categoria?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCrearPlantilla = (nuevaPlantilla: IPlantillaRegistro) => {
    setPlantillas([...plantillas, nuevaPlantilla]);
    toast({
      title: 'Plantilla creada',
      description: `La plantilla "${nuevaPlantilla.nombre}" ha sido creada exitosamente`,
    });
  };

  const handleEditarEstado = (estado: IEstado) => {
    setEstadoEditando(estado);
  };

  const handleGuardarEstado = (estadoActualizado: IEstado) => {
    setPlantillas(plantillas.map(plantilla => ({
      ...plantilla,
      estados: plantilla.estados.map(estado => 
        estado.id === estadoActualizado.id ? estadoActualizado : estado
      )
    })));
    setEstadoEditando(null);
  };

  const handleEliminarPlantilla = (plantillaId: string) => {
    setPlantillas(plantillas.filter(p => p._id !== plantillaId));
    toast({
      title: 'Plantilla eliminada',
      description: 'La plantilla ha sido eliminada exitosamente',
    });
  };

  const handleVerPlantilla = (plantillaId: string) => {
    navigate(`/app/registros-procesos/${plantillaId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registros de Procesos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona plantillas de registros personalizables con estados y campos editables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar plantillas de registros..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Título de sección */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Plantillas de Registros
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredPlantillas.length} plantilla{filteredPlantillas.length !== 1 ? 's' : ''} encontrada{filteredPlantillas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Lista de plantillas */}
      {filteredPlantillas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay plantillas
            </h3>
            <p className="text-gray-500 mb-4">
              {searchText ? 'No se encontraron plantillas que coincidan con tu búsqueda' : 'Crea tu primera plantilla de registro'}
            </p>
            {!searchText && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Plantilla
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredPlantillas.map((plantilla) => (
            <Card key={plantilla._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plantilla.configuracion_visual.color_primario }}
                    />
                    <div>
                      <CardTitle className="text-lg">{plantilla.nombre}</CardTitle>
                      <p className="text-sm text-gray-500">{plantilla.codigo}</p>
                    </div>
                  </div>
                  <Badge variant={plantilla.activo ? 'default' : 'secondary'}>
                    {plantilla.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                {plantilla.descripcion && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plantilla.descripcion}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6 pt-2">
                {/* Estados */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estados ({plantilla.estados.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plantilla.estados.map((estado) => (
                      <div key={estado.id} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: estado.color }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {estado.nombre}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campos totales */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campos por Estado
                  </h4>
                  <div className="space-y-1">
                    {plantilla.estados.map((estado) => (
                      <div key={estado.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{estado.nombre}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{estado.campos.length} campos</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarEstado(estado)}
                            className="h-6 w-6 p-0"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerPlantilla(plantilla._id!)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminarPlantilla(plantilla._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Creado por {plantilla.auditoria.creado_por}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modales */}
      <CrearPlantillaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCrearPlantilla}
        procesosDisponibles={[
          { id: 'proc-001', nombre: 'Gestión de Calidad', codigo: 'GC-001' },
          { id: 'proc-002', nombre: 'Auditorías Internas', codigo: 'AI-001' },
          { id: 'proc-003', nombre: 'Gestión de No Conformidades', codigo: 'GNC-001' }
        ]}
      />

      {estadoEditando && (
        <EditorCamposEstado
          estado={estadoEditando}
          isOpen={!!estadoEditando}
          onClose={() => setEstadoEditando(null)}
          onSave={handleGuardarEstado}
        />
      )}
    </div>
  );
}