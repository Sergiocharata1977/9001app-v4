import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ClipboardList, Edit, Eye, FileText, Pause, Play, Plus, Settings, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Datos de ejemplo para una plantilla específica
const plantillaEjemplo = {
  id: '1',
  nombre: 'Limpieza de Cilindros',
  descripcion: 'Registro para proceso de limpieza de cilindros en la línea de producción',
  estados: [
    {
      id: '1',
      nombre: 'Pendiente',
      descripcion: 'Registro creado, esperando asignación',
      color: '#f59e0b',
      orden: 1
    },
    {
      id: '2',
      nombre: 'En Proceso',
      descripcion: 'Limpieza en ejecución',
      color: '#3b82f6',
      orden: 2
    },
    {
      id: '3',
      nombre: 'Completado',
      descripcion: 'Limpieza finalizada y verificada',
      color: '#10b981',
      orden: 3
    }
  ],
  campos: [
    {
      id: '1',
      nombre: 'Fecha de Limpieza',
      tipo: 'date',
      requerido: true,
      descripcion: 'Fecha en que se realizó la limpieza'
    },
    {
      id: '2',
      nombre: 'Responsable',
      tipo: 'text',
      requerido: true,
      descripcion: 'Nombre del operador responsable'
    },
    {
      id: '3',
      nombre: 'Observaciones',
      tipo: 'textarea',
      requerido: false,
      descripcion: 'Observaciones adicionales del proceso'
    }
  ],
  registros: 15,
  activa: true,
  creada: '2024-01-15',
  responsable: 'Juan Pérez',
  ultimaModificacion: '2024-01-20'
};

const registrosEjemplo = [
  {
    id: '1',
    plantilla_id: '1',
    estado: 'Completado',
    datos: {
      'Fecha de Limpieza': '2024-01-20',
      'Responsable': 'Carlos López',
      'Observaciones': 'Limpieza realizada sin incidencias'
    },
    creado: '2024-01-20T10:00:00Z',
    modificado: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    plantilla_id: '1',
    estado: 'En Proceso',
    datos: {
      'Fecha de Limpieza': '2024-01-21',
      'Responsable': 'María García',
      'Observaciones': 'En proceso de limpieza'
    },
    creado: '2024-01-21T09:00:00Z',
    modificado: '2024-01-21T09:00:00Z'
  }
];

export default function RegistrosProcesosSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plantilla, setPlantilla] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadPlantilla();
    loadRegistros();
  }, [id]);

  const loadPlantilla = async () => {
    try {
      setIsLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlantilla(plantillaEjemplo);
    } catch (error) {
      console.error('❌ Error cargando plantilla:', error);
      toast({ title: 'Error', description: 'No se pudo cargar la plantilla.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegistros = async () => {
    try {
      // Simular carga de registros
      setRegistros(registrosEjemplo);
    } catch (error) {
      console.error('❌ Error cargando registros:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar los registros.', variant: 'destructive' });
    }
  };

  const handleEdit = () => {
    navigate(`/app/registros-procesos/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      // Simular eliminación
      toast({ title: 'Éxito', description: 'Plantilla eliminada correctamente.' });
      navigate('/app/registros-procesos');
    } catch (error) {
      console.error('❌ Error eliminando plantilla:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la plantilla.', variant: 'destructive' });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const toggleActiva = async () => {
    try {
      setPlantilla(prev => ({ ...prev, activa: !prev.activa }));
      toast({ 
        title: 'Éxito', 
        description: `Plantilla ${plantilla.activa ? 'desactivada' : 'activada'} correctamente.` 
      });
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      toast({ title: 'Error', description: 'No se pudo cambiar el estado.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plantilla) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Plantilla no encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          La plantilla que buscas no existe o ha sido eliminada.
        </p>
        <Button onClick={() => navigate('/app/registros-procesos')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/app/registros-procesos')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {plantilla.nombre}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {plantilla.descripcion}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleActiva}
            className={plantilla.activa ? 'text-green-600' : 'text-gray-600'}
          >
            {plantilla.activa ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {plantilla.activa ? 'Desactivar' : 'Activar'}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="estados" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="estados">Estados</TabsTrigger>
              <TabsTrigger value="campos">Campos</TabsTrigger>
              <TabsTrigger value="registros">Registros</TabsTrigger>
            </TabsList>
            
            <TabsContent value="estados" className="space-y-4">
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
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: estado.color }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{estado.nombre}</h4>
                          <p className="text-sm text-gray-600">{estado.descripcion}</p>
                        </div>
                        <Badge variant="outline">{estado.orden}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campos del Formulario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plantilla.campos.map((campo, index) => (
                      <motion.div
                        key={campo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{campo.nombre}</h4>
                            {campo.requerido && (
                              <Badge variant="destructive" className="text-xs">Requerido</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{campo.descripcion}</p>
                          <Badge variant="outline" className="mt-1">{campo.tipo}</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="registros" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registros Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {registros.map((registro, index) => (
                      <motion.div
                        key={registro.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Registro #{registro.id}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(registro.creado).toLocaleDateString()}
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
                        <div className="mt-2 text-sm text-gray-600">
                          <p><strong>Responsable:</strong> {registro.datos['Responsable']}</p>
                          {registro.datos['Observaciones'] && (
                            <p><strong>Observaciones:</strong> {registro.datos['Observaciones']}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información general */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Responsable: {plantilla.responsable}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Creada: {new Date(plantilla.creada).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{plantilla.registros} registros</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Última modificación: {new Date(plantilla.ultimaModificacion).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {plantilla.activa ? (
                  <Badge className="bg-green-500">Activa</Badge>
                ) : (
                  <Badge variant="secondary">Inactiva</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => navigate(`/app/registros-procesos/${id}/kanban`)}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Kanban
              </Button>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Registro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la plantilla "{plantilla.nombre}" y todos sus registros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
