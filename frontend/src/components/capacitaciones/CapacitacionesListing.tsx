import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Trash2, 
  Edit, 
  User, 
  Users, 
  MapPin, 
  Clock,
  Download,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Search,
  Filter,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { capacitacionesService } from "@/services/capacitacionesService";
import { useToast } from "@/components/ui/use-toast";
import CapacitacionModal from "./CapacitacionModal";
import CapacitacionSingle from "./CapacitacionSingle";
import UnifiedHeader from "../common/UnifiedHeader";
import UnifiedCard from "../common/UnifiedCard";
import { 
  Capacitacion, 
  CapacitacionFormData, 
  CapacitacionStats, 
  ViewMode, 
  CapacitacionField 
} from "@/types/capacitaciones";

export default function CapacitacionesListing(): React.JSX.Element {
  const { toast } = useToast();
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<Capacitacion | null>(null);
  const [showSingle, setShowSingle] = useState<boolean>(false);
  const [singleCapacitacionId, setSingleCapacitacionId] = useState<number | null>(null);

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const fetchCapacitaciones = async (): Promise<void> => {
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

  const handleCreate = (): void => {
    setSelectedCapacitacion(null);
    setModalOpen(true);
  };

  const handleEdit = (capacitacion: Capacitacion): void => {
    setSelectedCapacitacion(capacitacion);
    setModalOpen(true);
  };

  const handleViewSingle = (capacitacion: Capacitacion): void => {
    setSingleCapacitacionId(capacitacion.id);
    setShowSingle(true);
  };

  const handleBackFromSingle = (): void => {
    setShowSingle(false);
    setSingleCapacitacionId(null);
    fetchCapacitaciones();
  };

  const handleSave = async (formData: CapacitacionFormData): Promise<void> => {
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

  const handleDelete = async (capacitacion: Capacitacion): Promise<void> => {
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

  const handleExport = (): void => {
    toast({ title: "Exportación", description: "Función de exportación en desarrollo" });
  };

  const handleViewModeChange = (mode: ViewMode): void => {
    setViewMode(mode);
  };

  const filteredCapacitaciones = capacitaciones.filter((capacitacion: Capacitacion) => {
    const titleField = capacitacion.nombre || capacitacion.titulo || '';
    const descriptionField = capacitacion.descripcion || '';
    
    const matchesSearch = titleField.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         descriptionField.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || capacitacion.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadgeColor = (estado?: string): string => {
    if (!estado) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    switch (estado.toLowerCase()) {
      case 'planificacion':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'en preparacion':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'en curso':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEstadoIcon = (estado?: string): React.ComponentType<{ className?: string }> => {
    if (!estado) return AlertCircle;
    
    switch (estado.toLowerCase()) {
      case 'planificacion':
        return Calendar;
      case 'en preparacion':
        return BookOpen;
      case 'en curso':
        return TrendingUp;
      case 'completada':
        return CheckCircle;
      case 'cancelada':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Fecha no definida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const getStats = (): CapacitacionStats => {
    const total = capacitaciones.length;
    const planificadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'planificacion').length;
    const enPreparacion = capacitaciones.filter(c => c.estado?.toLowerCase() === 'en preparacion').length;
    const completadas = capacitaciones.filter(c => c.estado?.toLowerCase() === 'completada').length;
    
    return { total, planificadas, enPreparacion, completadas };
  };

  if (showSingle && singleCapacitacionId) {
    return (
      <CapacitacionSingle 
        capacitacionId={singleCapacitacionId}
        onBack={handleBackFromSingle}
      />
    );
  }

  const stats = getStats();

  const renderGridView = (): React.JSX.Element => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 h-20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredCapacitaciones.length === 0) {
      return (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron capacitaciones.</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primera capacitación
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCapacitaciones.map((capacitacion: Capacitacion) => {
          const fields: CapacitacionField[] = [
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
            <div key={capacitacion.id} className="cursor-pointer" onClick={() => handleViewSingle(capacitacion)}>
              <UnifiedCard
                title={capacitacion.nombre || capacitacion.titulo || ''}
                description={capacitacion.descripcion || ''}
                status={capacitacion.estado || ''}
                fields={fields}
                icon={GraduationCap}
                primaryColor="emerald"
                onView={() => handleViewSingle(capacitacion)}
                onEdit={() => handleEdit(capacitacion)}
                onDelete={() => handleDelete(capacitacion)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = (): React.JSX.Element => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Capacitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCapacitaciones.map((capacitacion: Capacitacion) => (
                <tr key={capacitacion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => handleViewSingle(capacitacion)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-emerald-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {capacitacion.nombre || capacitacion.titulo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {capacitacion.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {capacitacion.instructor || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getEstadoBadgeColor(capacitacion.estado)}>
                      {capacitacion.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(capacitacion.fecha_inicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {capacitacion.duracion_horas ? `${capacitacion.duracion_horas}h` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSingle(capacitacion);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(capacitacion);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(capacitacion);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <UnifiedHeader
        title="Capacitaciones"
        description="Gestiona las capacitaciones del personal"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleCreate}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        icon={GraduationCap}
        primaryColor="emerald"
        totalCount={stats.total}
        newButtonText="Nueva Capacitación"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-emerald-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planificadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.planificadas}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Preparación</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.enPreparacion}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completadas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-1 gap-4 items-center">
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="planificacion">Planificación</SelectItem>
              <SelectItem value="en preparacion">En Preparación</SelectItem>
              <SelectItem value="en curso">En Curso</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      {viewMode === "grid" ? renderGridView() : renderListView()}

      {/* Modal */}
      {modalOpen && (
        <CapacitacionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          capacitacion={selectedCapacitacion}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
