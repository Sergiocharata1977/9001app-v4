import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  TrendingUp,
  BarChart3,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Tipos TypeScript
interface ProcesoAbm {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  objetivo?: string;
  alcance?: string;
  version: string;
  tipo: 'estrategico' | 'operativo' | 'apoyo' | 'mejora';
  categoria: 'proceso' | 'subproceso' | 'actividad';
  nivel_critico: 'bajo' | 'medio' | 'alto' | 'critico';
  estado: 'activo' | 'inactivo' | 'obsoleto' | 'en_revision';
  responsable_id?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  departamento_id?: {
    _id: string;
    nombre: string;
    descripcion: string;
  };
  supervisor_id?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  created_by?: {
    _id: string;
    nombre: string;
    email: string;
  };
}

interface FiltrosProcesos {
  search: string;
  tipo: string;
  categoria: string;
  estado: string;
  nivel_critico: string;
  departamento_id: string;
  responsable_id: string;
}

interface EstadisticasProcesos {
  total: number;
  por_tipo: Record<string, number>;
  por_categoria: Record<string, number>;
  por_estado: Record<string, number>;
  por_nivel_critico: Record<string, number>;
}

const ProcesosAbm: React.FC = () => {
  const { toast } = useToast();
  
  // Estados principales
  const [procesos, setProcesos] = useState<ProcesoAbm[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasProcesos | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<ProcesoAbm | null>(null);
  const [modoModal, setModoModal] = useState<'crear' | 'editar' | 'ver'>('crear');
  
  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosProcesos>({
    search: '',
    tipo: '',
    categoria: '',
    estado: '',
    nivel_critico: '',
    departamento_id: '',
    responsable_id: ''
  });
  
  // Estados de paginación
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarProcesos();
    cargarEstadisticas();
  }, [filtros, paginacion.page]);

  const cargarProcesos = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: paginacion.page.toString(),
        limit: paginacion.limit.toString(),
        ...Object.fromEntries(Object.entries(filtros).filter(([_, value]) => value !== ''))
      });

      const response = await fetch(`/api/procesos-abm?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar procesos');
      }

      const data = await response.json();
      setProcesos(data.data || []);
      setPaginacion(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los procesos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async (): Promise<void> => {
    try {
      const response = await fetch('/api/procesos-abm/dashboard/estadisticas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEstadisticas(data.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleFiltroChange = (key: keyof FiltrosProcesos, value: string): void => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setPaginacion(prev => ({ ...prev, page: 1 }));
  };

  const handleCrearProceso = (): void => {
    setProcesoSeleccionado(null);
    setModoModal('crear');
    setShowModal(true);
  };

  const handleEditarProceso = (proceso: ProcesoAbm): void => {
    setProcesoSeleccionado(proceso);
    setModoModal('editar');
    setShowModal(true);
  };

  const handleVerProceso = (proceso: ProcesoAbm): void => {
    setProcesoSeleccionado(proceso);
    setModoModal('ver');
    setShowModal(true);
  };

  const handleEliminarProceso = async (id: string): Promise<void> => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proceso?')) return;

    try {
      const response = await fetch(`/api/procesos-abm/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar proceso');
      }

      toast({
        title: 'Éxito',
        description: 'Proceso eliminado correctamente'
      });

      cargarProcesos();
      cargarEstadisticas();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proceso',
        variant: 'destructive'
      });
    }
  };

  const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'obsoleto': return 'bg-red-100 text-red-800 border-red-200';
      case 'en_revision': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerColorNivelCritico = (nivel: string): string => {
    switch (nivel) {
      case 'bajo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critico': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerIconoTipo = (tipo: string): React.ReactNode => {
    switch (tipo) {
      case 'estrategico': return <TrendingUp className="w-4 h-4" />;
      case 'operativo': return <BarChart3 className="w-4 h-4" />;
      case 'apoyo': return <Users className="w-4 h-4" />;
      case 'mejora': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar procesos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={cargarProcesos}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Procesos</h1>
          <p className="text-gray-600">Administra las definiciones escritas de procesos según ISO 9001</p>
        </div>
        <Button onClick={handleCrearProceso} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Proceso
        </Button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Procesos</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                </div>
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.por_estado.activo || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Revisión</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadisticas.por_estado.en_revision || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Críticos</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.por_nivel_critico.critico || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                placeholder="Nombre, código o descripción..."
                value={filtros.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <Select value={filtros.tipo} onValueChange={(value) => handleFiltroChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="estrategico">Estratégico</SelectItem>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="apoyo">Apoyo</SelectItem>
                  <SelectItem value="mejora">Mejora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <Select value={filtros.categoria} onValueChange={(value) => handleFiltroChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  <SelectItem value="proceso">Proceso</SelectItem>
                  <SelectItem value="subproceso">Subproceso</SelectItem>
                  <SelectItem value="actividad">Actividad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="obsoleto">Obsoleto</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de vista */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">
          Mostrando {procesos.length} de {paginacion.total} procesos
        </p>
      </div>

      {/* Lista de procesos */}
      {procesos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay procesos registrados</h3>
            <p className="text-gray-600 mb-4">Empieza creando un nuevo proceso para tu organización.</p>
            <Button onClick={handleCrearProceso}>Crear Primer Proceso</Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          <AnimatePresence>
            {procesos.map((proceso) => (
              <motion.div
                key={proceso._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {obtenerIconoTipo(proceso.tipo)}
                        <div>
                          <CardTitle className="text-lg">{proceso.nombre}</CardTitle>
                          <p className="text-sm text-gray-600">{proceso.codigo}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerProceso(proceso)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarProceso(proceso)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarProceso(proceso._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {proceso.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {proceso.descripcion}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={obtenerColorEstado(proceso.estado)}>
                        {proceso.estado.replace('_', ' ')}
                      </Badge>
                      <Badge className={obtenerColorNivelCritico(proceso.nivel_critico)}>
                        {proceso.nivel_critico}
                      </Badge>
                      <Badge variant="outline">
                        v{proceso.version}
                      </Badge>
                    </div>
                    
                    {proceso.responsable_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{proceso.responsable_id.nombre} {proceso.responsable_id.apellido}</span>
                      </div>
                    )}
                    
                    {proceso.departamento_id && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{proceso.departamento_id.nombre}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Paginación */}
      {paginacion.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={paginacion.page === 1}
            onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Anterior
          </Button>
          
          <span className="text-sm text-gray-600">
            Página {paginacion.page} de {paginacion.pages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            disabled={paginacion.page === paginacion.pages}
            onClick={() => setPaginacion(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Modal para crear/editar/ver proceso */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modoModal === 'crear' && 'Crear Nuevo Proceso'}
              {modoModal === 'editar' && 'Editar Proceso'}
              {modoModal === 'ver' && 'Detalles del Proceso'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {modoModal === 'crear' && 'Completa la información del nuevo proceso.'}
              {modoModal === 'editar' && 'Modifica la información del proceso.'}
              {modoModal === 'ver' && 'Información detallada del proceso.'}
            </p>
            
            {/* Aquí iría el formulario del proceso */}
            <div className="text-center py-8">
              <p className="text-gray-500">Formulario de proceso en desarrollo...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcesosAbm;


