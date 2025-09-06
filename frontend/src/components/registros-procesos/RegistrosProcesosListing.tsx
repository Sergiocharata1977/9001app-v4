import UnifiedHeader from '@/components/common/UnifiedHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardList, Grid3X3, List, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioRegistro from './FormularioRegistro';
import RegistroProcesoCard from './RegistroProcesoCard';

// Datos de ejemplo para plantillas de registros
const plantillasEjemplo = [
  {
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
    responsable: 'Juan Pérez'
  },
  {
    id: '2',
    nombre: 'Mantenimiento Preventivo',
    descripcion: 'Registro de mantenimiento preventivo de equipos',
    estados: [
      {
        id: '1',
        nombre: 'Programado',
        descripcion: 'Mantenimiento programado',
        color: '#8b5cf6',
        orden: 1
      },
      {
        id: '2',
        nombre: 'En Ejecución',
        descripcion: 'Mantenimiento en curso',
        color: '#3b82f6',
        orden: 2
      },
      {
        id: '3',
        nombre: 'Verificado',
        descripcion: 'Mantenimiento verificado',
        color: '#10b981',
        orden: 3
      },
      {
        id: '4',
        nombre: 'Completado',
        descripcion: 'Mantenimiento completado',
        color: '#059669',
        orden: 4
      }
    ],
    campos: [
      {
        id: '1',
        nombre: 'Equipo',
        tipo: 'text',
        requerido: true,
        descripcion: 'Nombre del equipo a mantener'
      },
      {
        id: '2',
        nombre: 'Fecha Programada',
        tipo: 'date',
        requerido: true,
        descripcion: 'Fecha programada para el mantenimiento'
      },
      {
        id: '3',
        nombre: 'Técnico Responsable',
        tipo: 'text',
        requerido: true,
        descripcion: 'Nombre del técnico responsable'
      },
      {
        id: '4',
        nombre: 'Tipo de Mantenimiento',
        tipo: 'select',
        requerido: true,
        descripcion: 'Tipo de mantenimiento a realizar',
        opciones: ['Preventivo', 'Correctivo', 'Predictivo']
      }
    ],
    registros: 8,
    activa: true,
    creada: '2024-01-10',
    responsable: 'María García'
  },
  {
    id: '3',
    nombre: 'Control de Calidad',
    descripcion: 'Registro de controles de calidad de productos',
    estados: [
      {
        id: '1',
        nombre: 'Pendiente',
        descripcion: 'Control pendiente de realizar',
        color: '#f59e0b',
        orden: 1
      },
      {
        id: '2',
        nombre: 'En Análisis',
        descripcion: 'Producto en análisis',
        color: '#3b82f6',
        orden: 2
      },
      {
        id: '3',
        nombre: 'Aprobado',
        descripcion: 'Producto aprobado',
        color: '#10b981',
        orden: 3
      },
      {
        id: '4',
        nombre: 'Rechazado',
        descripcion: 'Producto rechazado',
        color: '#ef4444',
        orden: 4
      }
    ],
    campos: [
      {
        id: '1',
        nombre: 'Lote de Producción',
        tipo: 'text',
        requerido: true,
        descripcion: 'Número de lote del producto'
      },
      {
        id: '2',
        nombre: 'Fecha de Control',
        tipo: 'date',
        requerido: true,
        descripcion: 'Fecha en que se realizó el control'
      },
      {
        id: '3',
        nombre: 'Inspector',
        tipo: 'text',
        requerido: true,
        descripcion: 'Nombre del inspector de calidad'
      },
      {
        id: '4',
        nombre: 'Resultado',
        tipo: 'select',
        requerido: true,
        descripcion: 'Resultado del control de calidad',
        opciones: ['Aprobado', 'Rechazado', 'Condicional']
      }
    ],
    registros: 23,
    activa: false,
    creada: '2024-01-05',
    responsable: 'Carlos López'
  }
];

export default function RegistrosProcesosListing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [plantillas, setPlantillas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormularioOpen, setIsFormularioOpen] = useState(false);
  const [currentPlantilla, setCurrentPlantilla] = useState(null);
  const [plantillaToDelete, setPlantillaToDelete] = useState(null);
  const [plantillaParaRegistro, setPlantillaParaRegistro] = useState(null);

  const loadPlantillas = async () => {
    try {
      setIsLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlantillas(plantillasEjemplo);
    } catch (error) {
      console.error('❌ Error cargando plantillas:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar las plantillas.', variant: 'destructive' });
      setPlantillas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlantillas();
  }, []);

  const handleSave = async (plantillaData) => {
    try {
      if (currentPlantilla) {
        // Actualizar plantilla existente
        setPlantillas(prev => prev.map(p => 
          p.id === currentPlantilla.id ? { ...p, ...plantillaData } : p
        ));
        toast({ title: 'Éxito', description: 'Plantilla actualizada correctamente.' });
      } else {
        // Crear nueva plantilla
        const nuevaPlantilla = {
          id: Date.now().toString(),
          ...plantillaData,
          registros: 0,
          creada: new Date().toISOString().split('T')[0],
          responsable: 'Usuario Actual'
        };
        setPlantillas(prev => [nuevaPlantilla, ...prev]);
        toast({ title: 'Éxito', description: 'Plantilla creada correctamente.' });
      }
      setIsModalOpen(false);
      setCurrentPlantilla(null);
    } catch (error) {
      console.error('❌ Error guardando plantilla:', error);
      toast({ title: 'Error', description: 'No se pudo guardar la plantilla.', variant: 'destructive' });
    }
  };

  const handleEdit = (plantilla) => {
    setCurrentPlantilla(plantilla);
    setIsModalOpen(true);
  };

  const handleDelete = (plantilla) => {
    setPlantillaToDelete(plantilla);
  };

  const confirmDelete = async () => {
    try {
      setPlantillas(prev => prev.filter(p => p.id !== plantillaToDelete.id));
      toast({ title: 'Éxito', description: 'Plantilla eliminada correctamente.' });
    } catch (error) {
      console.error('❌ Error eliminando plantilla:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la plantilla.', variant: 'destructive' });
    } finally {
      setPlantillaToDelete(null);
    }
  };

  const handleView = (plantilla) => {
    navigate(`/app/registros-procesos/${plantilla.id}`);
  };

  const handleNuevoRegistro = (plantilla) => {
    setPlantillaParaRegistro(plantilla);
    setIsFormularioOpen(true);
  };

  const handleSaveRegistro = async (datosRegistro) => {
    try {
      // Aquí se guardaría el registro en la base de datos
      console.log('Guardando registro:', datosRegistro);
      toast({ title: 'Éxito', description: 'Registro creado correctamente.' });
      setIsFormularioOpen(false);
      setPlantillaParaRegistro(null);
    } catch (error) {
      console.error('❌ Error guardando registro:', error);
      toast({ title: 'Error', description: 'No se pudo guardar el registro.', variant: 'destructive' });
    }
  };

  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    plantilla.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
    plantilla.responsable.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UnifiedHeader
          title="Registros de Procesos"
          subtitle="Gestiona plantillas de registros personalizables con estados y campos editables"
          actions={
            <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UnifiedHeader
        title="Registros de Procesos"
        subtitle="Gestiona plantillas de registros personalizables con estados y campos editables"
        actions={
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
        }
      />

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

      {/* Lista de plantillas */}
      {filteredPlantillas.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchText ? 'No se encontraron plantillas' : 'No hay plantillas registradas'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchText 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Empieza creando una nueva plantilla de registro'
              }
            </p>
            {!searchText && (
              <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Plantilla
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredPlantillas.map((plantilla) => (
            <RegistroProcesoCard
              key={plantilla.id}
              plantilla={plantilla}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Modal para crear/editar plantillas */}
      <RegistroProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentPlantilla(null);
        }}
        onSave={handleSave}
        plantilla={currentPlantilla}
      />

      {/* Modal para crear nuevos registros */}
      <FormularioRegistro
        isOpen={isFormularioOpen}
        onClose={() => {
          setIsFormularioOpen(false);
          setPlantillaParaRegistro(null);
        }}
        onSave={handleSaveRegistro}
        plantilla={plantillaParaRegistro}
      />

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={!!plantillaToDelete} onOpenChange={() => setPlantillaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la plantilla "{plantillaToDelete?.nombre}".
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