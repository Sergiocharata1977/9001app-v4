import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Trash2, 
  Edit, 
  User, 
  MapPin, 
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  GraduationCap,
  Eye
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import { useToast } from "@/components/ui/use-toast";
import CapacitacionModal from "./CapacitacionModal";
import CapacitacionSingle from "./CapacitacionSingle";
import UnifiedHeader from "../common/UnifiedHeader";
import DataTable from "../shared/DataTable/DataTable";

export default function CapacitacionesListingNEW() {
  const { toast } = useToast();
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [showSingle, setShowSingle] = useState(false);
  const [singleCapacitacionId, setSingleCapacitacionId] = useState(null);

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const fetchCapacitaciones = async () => {
    try {
      setLoading(true);
      const data = await capacitacionesService.getAll();
      setCapacitaciones(data);
      console.log('✅ Capacitaciones cargadas:', data);
    } catch (error) {
      console.error('❌ Error al cargar capacitaciones:', error);
      toast({ variant: "destructive", title: "Error", description: "Error al cargar las capacitaciones" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCapacitacion(null);
    setModalOpen(true);
  };

  const handleEdit = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setModalOpen(true);
  };

  const handleViewSingle = (capacitacion) => {
    setSingleCapacitacionId(capacitacion.id);
    setShowSingle(true);
  };

  const handleBackFromSingle = () => {
    setShowSingle(false);
    setSingleCapacitacionId(null);
    fetchCapacitaciones();
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCapacitacion) {
        await capacitacionesService.update(selectedCapacitacion.id, formData);
        toast({ title: "Éxito", description: "Capacitación actualizada exitosamente" });
      } else {
        await capacitacionesService.create(formData);
        toast({ title: "Éxito", description: "Capacitación creada exitosamente" });
      }
      setModalOpen(false);
      fetchCapacitaciones();
    } catch (error) {
      console.error('Error al guardar capacitación:', error);
      toast({ variant: "destructive", title: "Error", description: "Error al guardar la capacitación" });
    }
  };

  const handleDelete = async (capacitacion) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta capacitación?")) {
      try {
        await capacitacionesService.delete(capacitacion.id);
        toast({ title: "Éxito", description: "Capacitación eliminada exitosamente" });
        fetchCapacitaciones();
      } catch (error) {
        console.error('Error al eliminar capacitación:', error);
        toast({ variant: "destructive", title: "Error", description: "Error al eliminar la capacitación" });
      }
    }
  };

  const handleExport = () => {
    toast({ title: "Exportación", description: "Función de exportación en desarrollo" });
  };

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'planificacion':
      case 'planificada':
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en preparacion':
      case 'preparando material':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'en evaluacion':
      case 'evaluando resultados':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completada':
      case 'finalizada':
      case 'cerrada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'planificacion':
      case 'planificada':
        return Target;
      case 'en preparacion':
        return Clock;
      case 'en evaluacion':
        return TrendingUp;
      case 'completada':
        return CheckCircle;
      case 'cancelada':
        return AlertCircle;
      default:
        return BookOpen;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const getStats = () => {
    const total = capacitaciones.length;
    const planificadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'planificacion').length;
    const enPreparacion = capacitaciones.filter(c => c.estado?.toLowerCase() === 'en preparacion').length;
    const completadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'completada').length;
    
    return { total, planificadas, enPreparacion, completadas };
  };

  // Filtrar capacitaciones según el estado seleccionado
  const filteredCapacitaciones = capacitaciones.filter((capacitacion) => {
    const matchesEstado = filterEstado === "todos" || capacitacion.estado === filterEstado;
    return matchesEstado;
  });

  // Definición de columnas para el DataTable
  const columns = [
    {
      key: 'nombre',
      label: 'Capacitación',
      sortable: true,
      filterable: true,
      width: '300px',
      render: (value, row) => (
        <div className="flex items-center">
          <GraduationCap className="h-5 w-5 text-emerald-500 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {value || row.titulo || 'Sin título'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.descripcion}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'instructor',
      label: 'Instructor',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value, row) => (
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{value || '-'}</span>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value, row) => {
        const StatusIcon = getEstadoIcon(value);
        return (
          <div className="flex items-center">
            <StatusIcon className="w-4 h-4 mr-2 text-gray-500" />
            <Badge className={getEstadoBadgeColor(value)}>
              {value}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'fecha_inicio',
      label: 'Fecha Inicio',
      sortable: true,
      filterable: true,
      width: '150px',
      render: (value, row) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{formatDate(value)}</span>
        </div>
      )
    },
    {
      key: 'duracion_horas',
      label: 'Duración',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value, row) => (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm">{value ? `${value}h` : '-'}</span>
        </div>
      )
    },
    {
      key: 'modalidad',
      label: 'Modalidad',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value, row) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm capitalize">{value || '-'}</span>
        </div>
      )
    }
  ];

  // Definición de acciones
  const actions = [
    {
      icon: Eye,
      label: 'Ver',
      onClick: handleViewSingle,
      variant: 'ghost',
      className: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: handleEdit,
      variant: 'ghost',
      className: 'text-green-600 hover:text-green-700 hover:bg-green-50'
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: handleDelete,
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    }
  ];

  // Definición de columnas Kanban
  const kanbanColumns = [
    {
      key: 'planificacion',
      label: 'Planificación',
      color: 'bg-blue-500',
      filter: (capacitacion) => capacitacion.estado?.toLowerCase() === 'planificacion'
    },
    {
      key: 'en_preparacion',
      label: 'En Preparación',
      color: 'bg-orange-500',
      filter: (capacitacion) => capacitacion.estado?.toLowerCase() === 'en preparacion'
    },
    {
      key: 'en_evaluacion',
      label: 'En Evaluación',
      color: 'bg-purple-500',
      filter: (capacitacion) => capacitacion.estado?.toLowerCase() === 'en evaluacion'
    },
    {
      key: 'completada',
      label: 'Completada',
      color: 'bg-green-500',
      filter: (capacitacion) => capacitacion.estado?.toLowerCase() === 'completada'
    },
    {
      key: 'cancelada',
      label: 'Cancelada',
      color: 'bg-red-500',
      filter: (capacitacion) => capacitacion.estado?.toLowerCase() === 'cancelada'
    }
  ];

  // Renderizado personalizado para tarjetas
  const renderCard = (capacitacion, actions) => {
    const StatusIcon = getEstadoIcon(capacitacion.estado);
    const fields = [
      ...(capacitacion.instructor ? [{ 
        icon: User, 
        label: "Instructor", 
        value: capacitacion.instructor 
      }] : []),
      ...(capacitacion.fecha_inicio ? [{ 
        icon: Calendar, 
        label: "Fecha inicio", 
        value: formatDate(capacitacion.fecha_inicio) 
      }] : []),
      ...(capacitacion.modalidad ? [{ 
        icon: MapPin, 
        label: "Modalidad", 
        value: capacitacion.modalidad 
      }] : []),
      ...(capacitacion.duracion_horas ? [{ 
        icon: Clock, 
        label: "Duración", 
        value: `${capacitacion.duracion_horas}h` 
      }] : [])
    ];

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 h-20 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-white" />
            <div className="ml-3">
              <h3 className="text-white font-semibold text-sm line-clamp-1">
                {capacitacion.nombre || capacitacion.titulo}
              </h3>
              <div className="flex items-center mt-1">
                <StatusIcon className="h-4 w-4 text-white/80" />
                <Badge className={`ml-2 text-xs ${getEstadoBadgeColor(capacitacion.estado)}`}>
                  {capacitacion.estado}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {capacitacion.descripcion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {capacitacion.descripcion}
            </p>
          )}
          
          <div className="space-y-2">
            {fields.map((field, index) => {
              const Icon = field.icon;
              return (
                <div key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Icon className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">{field.label}:</span>
                  <span className="ml-1">{field.value}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            {actions.map((action, actionIndex) => {
              const Icon = action.icon;
              return (
                <Button
                  key={actionIndex}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(capacitacion);
                  }}
                  className={action.className}
                  title={action.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="sr-only">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizado personalizado para tarjetas Kanban
  const renderKanbanCard = (capacitacion, actions) => {
    const StatusIcon = getEstadoIcon(capacitacion.estado);
    
    return (
      <div className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-lg mb-3">
        <div className="p-3">
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                {capacitacion.nombre || capacitacion.titulo}
              </h4>
              <div className="flex items-center mt-1">
                <StatusIcon className="h-3 w-3 text-gray-500" />
                <Badge className={`ml-1 text-xs ${getEstadoBadgeColor(capacitacion.estado)}`}>
                  {capacitacion.estado}
                </Badge>
              </div>
            </div>
            
            {capacitacion.instructor && (
              <div className="flex items-center text-xs text-gray-700">
                <User className="w-3 h-3 mr-1 text-gray-500" />
                <span className="truncate">
                  {capacitacion.instructor}
                </span>
              </div>
            )}
            
            {capacitacion.fecha_inicio && (
              <div className="flex items-center text-xs text-gray-700">
                <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                <span>{formatDate(capacitacion.fecha_inicio)}</span>
              </div>
            )}
          </div>
          
          {actions.length > 0 && (
            <div className="flex gap-1 mt-3 pt-2 border-t">
              {actions.map((action, actionIndex) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={actionIndex}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(capacitacion);
                    }}
                    className={`${action.className} h-6 w-6 p-0`}
                    title={action.label}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showSingle) {
    return (
      <CapacitacionSingle 
        capacitacionId={singleCapacitacionId}
        onBack={handleBackFromSingle}
      />
    );
  }

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      <UnifiedHeader
        title="Gestión de Capacitaciones"
        description="Administra las capacitaciones del personal según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleCreate}
        onExport={handleExport}
        viewMode="grid"
        onViewModeChange={() => {}}
        newButtonText="Nueva Capacitación"
        totalCount={capacitaciones.length}
        lastUpdated="hoy"
        icon={GraduationCap}
        primaryColor="emerald"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificadas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planificadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Preparación</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enPreparacion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de estado */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="planificacion">Planificación</SelectItem>
            <SelectItem value="en preparacion">En Preparación</SelectItem>
            <SelectItem value="en evaluacion">En Evaluación</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredCapacitaciones}
        columns={columns}
        actions={actions}
        loading={loading}
        error={null}
        onRefresh={fetchCapacitaciones}
        onCreate={handleCreate}
        searchable={true}
        searchPlaceholder="Buscar capacitaciones..."
        searchFields={['nombre', 'titulo', 'descripcion', 'instructor']}
        paginated={true}
        pageSize={12}
        exportable={true}
        onExport={handleExport}
        title="Capacitaciones"
        description="Lista completa de capacitaciones del sistema"
        emptyMessage="No hay capacitaciones registradas"
        className="w-full"
        striped={true}
        bordered={false}
        compact={false}
        rowKey="id"
        viewModes={['list', 'grid', 'kanban']}
        defaultView="grid"
        kanbanColumns={kanbanColumns}
        gridColumns={4}
        renderCard={renderCard}
        renderKanbanCard={renderKanbanCard}
        onCardClick={handleViewSingle}
      />

      <CapacitacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        capacitacion={selectedCapacitacion}
        onSave={handleSave}
      />
    </div>
  );
}
