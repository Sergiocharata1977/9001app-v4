import PlantillaEditor from '@/components/EditorRegistros/PlantillaEditor-TEMP';
import VistaKanban from '@/components/EditorRegistros/VistaKanban-TEMP';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { IPlantillaRegistro } from '@/types/editorRegistros';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ClipboardList,
    Edit,
    Eye,
    FileText,
    Loader2,
    Pause,
    Play,
    Plus,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Función para crear plantilla de ejemplo compatible
const crearPlantillaEjemplo = (id: string): IPlantillaRegistro => ({
  _id: id,
  codigo: 'LMP-CIL-001',
  nombre: 'Limpieza de Cilindros',
  descripcion: 'Registro para proceso de limpieza de cilindros en la línea de producción',
  organizacion_id: '1',
  activo: true,
  categoria: 'mantenimiento',
  modulo: 'produccion',
  configuracion_visual: {
    icono: 'ClipboardList',
    color_primario: '#10b981',
    vista_default: 'kanban',
    mostrar_progreso: true,
    mostrar_tiempo: true,
    mostrar_responsable: true
  },
  estados: [
    {
      id: '1',
      codigo: 'PEND',
      nombre: 'Pendiente',
      descripcion: 'Registro creado, esperando asignación',
      orden: 1,
      color: '#f59e0b',
      icono: 'Clock',
      es_inicial: true,
      es_final: false,
      campos: [],
      transiciones_permitidas: [],
      acciones_automaticas: [],
      tiempo: { excluir_fines_semana: true, excluir_feriados: true },
      permisos: {
        puede_crear: ['admin', 'operador'],
        puede_editar: ['admin', 'operador'],
        puede_mover_desde: ['admin', 'operador'],
        puede_mover_hacia: ['admin', 'operador']
      }
    },
    {
      id: '2',
      codigo: 'PROC',
      nombre: 'En Proceso',
      descripcion: 'Limpieza en ejecución',
      orden: 2,
      color: '#3b82f6',
      icono: 'Play',
      es_inicial: false,
      es_final: false,
      campos: [],
      transiciones_permitidas: [],
      acciones_automaticas: [],
      tiempo: { excluir_fines_semana: true, excluir_feriados: true },
      permisos: {
        puede_crear: ['admin'],
        puede_editar: ['admin', 'operador'],
        puede_mover_desde: ['admin', 'operador'],
        puede_mover_hacia: ['admin', 'operador']
      }
    },
    {
      id: '3',
      codigo: 'COMP',
      nombre: 'Completado',
      descripcion: 'Limpieza finalizada y verificada',
      orden: 3,
      color: '#10b981',
      icono: 'CheckCircle',
      es_inicial: false,
      es_final: true,
      campos: [],
      transiciones_permitidas: [],
      acciones_automaticas: [],
      tiempo: { excluir_fines_semana: true, excluir_feriados: true },
      permisos: {
        puede_crear: ['admin'],
        puede_editar: ['admin'],
        puede_mover_desde: ['admin', 'operador'],
        puede_mover_hacia: ['admin']
      }
    }
  ],
  configuracion_avanzada: {
    numeracion_automatica: {
      activa: true,
      prefijo: 'LMP',
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
    crear: ['admin', 'operador'],
    ver: ['admin', 'operador', 'consultor'],
    editar: ['admin', 'operador'],
    eliminar: ['admin']
  },
  auditoria: {
    creado_por: 'admin',
    fecha_creacion: new Date('2024-01-15'),
    version: 1,
    cambios_historial: []
  },
  eliminado: false
});

// Datos de ejemplo para registros
const registrosEjemplo = [
  {
    id: 'REG-001',
    plantilla_id: '1',
    estado: 'En Proceso',
    responsable: 'Juan Pérez',
    creado: '2024-02-15T10:30:00Z',
    datos: {
      fecha_limpieza: '2024-02-15',
      responsable: 'Juan Pérez',
      equipo: 'Cilindro A-1',
      observaciones: 'Limpieza estándar realizada'
    }
  },
  {
    id: 'REG-002',
    plantilla_id: '1',
    estado: 'Completado',
    responsable: 'María García',
    creado: '2024-02-14T14:20:00Z',
    datos: {
      fecha_limpieza: '2024-02-14',
      responsable: 'María García',
      equipo: 'Cilindro B-2',
      observaciones: 'Limpieza completada sin observaciones'
    }
  },
  {
    id: 'REG-003',
    plantilla_id: '1',
    estado: 'Pendiente',
    responsable: 'Carlos López',
    creado: '2024-02-16T09:15:00Z',
    datos: {
      fecha_limpieza: '2024-02-16',
      responsable: 'Carlos López',
      equipo: 'Cilindro C-3',
      observaciones: 'Pendiente de asignación'
    }
  }
];

export default function RegistrosProcesosSingleNEW() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [plantilla, setPlantilla] = useState<IPlantillaRegistro | null>(null);
  const [registros, setRegistros] = useState(registrosEjemplo);
  const [isEditing, setIsEditing] = useState(false);
  const [showKanban, setShowKanban] = useState(false);

  useEffect(() => {
    const loadPlantilla = async () => {
      try {
        setIsLoading(true);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En implementación real:
        // const plantillaData = await plantillaRegistroService.obtenerPorId(id!);
        // setPlantilla(plantillaData);
        
        // Por ahora usar datos de ejemplo
        const plantillaData = crearPlantillaEjemplo(id!);
        setPlantilla(plantillaData);
        
      } catch (error) {
        console.error('❌ Error cargando plantilla:', error);
        toast({
          title: "❌ Error",
          description: "No se pudo cargar la plantilla.",
          variant: "destructive"
        });
        navigate('/app/registros-procesos');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPlantilla();
    }
  }, [id, navigate, toast]);

  const handleToggleActive = async () => {
    if (!plantilla) return;
    
    try {
      // En implementación real:
      // await plantillaRegistroService.toggleActivo(plantilla._id!);
      
      setPlantilla(prev => prev ? { ...prev, activo: !prev.activo } : null);
      toast({
        title: plantilla.activo ? "⏸️ Plantilla desactivada" : "▶️ Plantilla activada",
        description: `La plantilla "${plantilla.nombre}" fue ${plantilla.activo ? 'desactivada' : 'activada'}.`
      });
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo cambiar el estado de la plantilla.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!plantilla) return;
    
    if (confirm(`¿Estás seguro de eliminar la plantilla "${plantilla.nombre}"?`)) {
      try {
        // En implementación real:
        // await plantillaRegistroService.eliminar(plantilla._id!);
        
        toast({
          title: "✅ Plantilla eliminada",
          description: `La plantilla "${plantilla.nombre}" fue eliminada.`
        });
        navigate('/app/registros-procesos');
      } catch (error) {
        console.error('❌ Error eliminando plantilla:', error);
        toast({
          title: "❌ Error",
          description: "No se pudo eliminar la plantilla.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveEdit = async (plantillaData: Partial<IPlantillaRegistro>) => {
    if (!plantilla) return;
    
    try {
      // En implementación real:
      // const updated = await plantillaRegistroService.actualizar(plantilla._id!, plantillaData);
      
      setPlantilla(prev => prev ? { ...prev, ...plantillaData } : null);
      setIsEditing(false);
      
      toast({
        title: "✅ Plantilla actualizada",
        description: "Los cambios fueron guardados correctamente."
      });
    } catch (error) {
      console.error('❌ Error actualizando plantilla:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar la plantilla.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando plantilla...</p>
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Plantilla no encontrada</h2>
        <p className="text-gray-500 mb-4">La plantilla que buscas no existe o fue eliminada.</p>
        <Button onClick={() => navigate('/app/registros-procesos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Plantillas
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <PlantillaEditor
        plantillaId={plantilla._id}
        onGuardar={handleSaveEdit}
        onCancelar={() => setIsEditing(false)}
      />
    );
  }

  if (showKanban) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKanban(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Detalles
            </Button>
            <h1 className="text-2xl font-bold">{plantilla.nombre} - Vista Kanban</h1>
          </div>
        </div>
        
        <VistaKanban 
          plantilla={plantilla}
          registros={registros}
          onRegistroUpdate={(registroId, nuevoEstado) => {
            setRegistros(prev => 
              prev.map(r => r.id === registroId ? { ...r, estado: nuevoEstado } : r)
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/registros-procesos')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {plantilla.nombre}
            </h1>
            <p className="text-gray-600">{plantilla.descripcion}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {plantilla.activo ? (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              Activa
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              Inactiva
            </Badge>
          )}
        </div>
      </div>

      {/* Información General y Acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Código</label>
                  <p className="text-lg font-mono">{plantilla.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Categoría</label>
                  <p className="text-lg capitalize">{plantilla.categoria}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Módulo</label>
                  <p className="text-lg capitalize">{plantilla.modulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Versión</label>
                  <p className="text-lg">v{plantilla.auditoria.version}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="text-gray-800 mt-1">{plantilla.descripcion}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Creada por</label>
                <p className="text-gray-800 mt-1">
                  {plantilla.auditoria.creado_por} - {new Date(plantilla.auditoria.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => setShowKanban(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Kanban
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Plantilla
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleToggleActive}
              >
                {plantilla.activo ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activar
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pestañas de Contenido */}
      <Tabs defaultValue="estados" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estados">Estados</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          <TabsTrigger value="registros">Registros</TabsTrigger>
        </TabsList>

        {/* Pestaña Estados */}
        <TabsContent value="estados">
          <Card>
            <CardHeader>
              <CardTitle>Estados del Flujo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plantilla.estados.map((estado, index) => (
                  <motion.div
                    key={estado.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: estado.color }}
                      />
                      <div>
                        <h4 className="font-medium">{estado.nombre}</h4>
                        <p className="text-sm text-gray-600">{estado.descripcion}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {estado.es_inicial && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Inicial
                        </Badge>
                      )}
                      {estado.es_final && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          Final
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">#{estado.orden}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Configuración */}
        <TabsContent value="configuracion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Color Primario</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: plantilla.configuracion_visual.color_primario }}
                    />
                    <span className="font-mono text-sm">{plantilla.configuracion_visual.color_primario}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Vista por Defecto</label>
                  <p className="text-gray-800 mt-1 capitalize">{plantilla.configuracion_visual.vista_default}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Mostrar Progreso</label>
                  <p className="text-gray-800 mt-1">{plantilla.configuracion_visual.mostrar_progreso ? 'Sí' : 'No'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración Avanzada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Numeración Automática</label>
                  <p className="text-gray-800 mt-1">
                    {plantilla.configuracion_avanzada.numeracion_automatica.activa ? 'Activada' : 'Desactivada'}
                  </p>
                  {plantilla.configuracion_avanzada.numeracion_automatica.activa && (
                    <p className="text-sm text-gray-600">
                      Prefijo: {plantilla.configuracion_avanzada.numeracion_automatica.prefijo}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Comentarios</label>
                  <p className="text-gray-800 mt-1">
                    {plantilla.configuracion_avanzada.permitir_comentarios ? 'Permitidos' : 'No permitidos'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Archivos Adjuntos</label>
                  <p className="text-gray-800 mt-1">
                    {plantilla.configuracion_avanzada.permitir_archivos_adjuntos ? 'Permitidos' : 'No permitidos'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña Registros */}
        <TabsContent value="registros">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Registros Recientes</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Registro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registros.map((registro, index) => (
                  <motion.div
                    key={registro.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Registro #{registro.id}</h4>
                        <p className="text-sm text-gray-600">
                          Por: {registro.responsable} - {new Date(registro.creado).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        style={{ 
                          color: plantilla.estados.find(e => e.nombre === registro.estado)?.color,
                          borderColor: plantilla.estados.find(e => e.nombre === registro.estado)?.color
                        }}
                      >
                        {registro.estado}
                      </Badge>
                    </div>
                    
                    {registro.datos.observaciones && (
                      <p className="text-sm text-gray-600 mt-2">
                        📝 {registro.datos.observaciones}
                      </p>
                    )}
                  </motion.div>
                ))}
                
                {registros.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay registros aún</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
