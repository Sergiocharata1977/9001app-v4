import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Grid3X3,
  List,
  Target,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { capacitacionesService } from '@/services/capacitacionesService';
import { Capacitacion, CapacitacionFilters } from '@/types/capacitaciones';
import { useToast } from '@/hooks/useToast';

const Capacitaciones: React.FC = () => {
  const [filters, setFilters] = useState<CapacitacionFilters>({
    search: '',
    estado: '',
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    instructor: '',
    departamento: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Query para obtener capacitaciones
  const {
    data: capacitaciones = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['capacitaciones', filters],
    queryFn: () => capacitacionesService.getCapacitaciones(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: capacitacionesService.deleteCapacitacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacitaciones'] });
      showToast('Capacitación eliminada exitosamente', 'success');
    },
    onError: () => {
      showToast('Error al eliminar capacitación', 'error');
    }
  });

  // Handlers
  const handleCreate = () => {
    // setSelectedCapacitacion(null); // This line was removed
    // setIsEditMode(false); // This line was removed
    setIsModalOpen(true);
  };

  const handleEdit = (capacitacion: Capacitacion) => {
    // setSelectedCapacitacion(capacitacion); // This line was removed
    // setIsEditMode(true); // This line was removed
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta capacitación?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFilterChange = (key: keyof CapacitacionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getEstadoColor = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'evaluacion_pendiente': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string | undefined) => {
    if (!tipo) return 'bg-gray-100 text-gray-800';
    
    switch (tipo) {
      case 'obligatoria': return 'bg-red-100 text-red-800';
      case 'recomendada': return 'bg-orange-100 text-orange-800';
      case 'opcional': return 'bg-gray-100 text-gray-800';
      case 'certificacion': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Sin fecha';
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '--:--';
    
    return timeString.substring(0, 5); // HH:MM format
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error al cargar capacitaciones</h3>
          <p className="text-red-600 mt-2">Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Capacitaciones</h1>
          <p className="text-gray-600 mt-2">Administra y programa capacitaciones del personal</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            {viewMode === 'grid' ? 'Lista' : 'Grid'}
          </Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Capacitación
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <Input
              placeholder="Buscar capacitaciones..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="programada">Programada</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
              <option value="evaluacion_pendiente">Evaluación Pendiente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="obligatoria">Obligatoria</option>
              <option value="recomendada">Recomendada</option>
              <option value="opcional">Opcional</option>
              <option value="certificacion">Certificación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <Input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <Input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <Input
              placeholder="Nombre del instructor"
              value={filters.instructor}
              onChange={(e) => handleFilterChange('instructor', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Capacitaciones List/Grid */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : capacitaciones.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay capacitaciones</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva capacitación.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capacitaciones.map((capacitacion) => (
              <Card key={capacitacion.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {capacitacion.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {capacitacion.descripcion}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(capacitacion)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(capacitacion.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(capacitacion.fecha_inicio)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(capacitacion.hora_inicio)} - {formatTime(capacitacion.hora_fin)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {capacitacion.ubicacion || 'No especificada'}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {capacitacion.instructor}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {capacitacion.participantes?.length || 0} participantes
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Badge className={getEstadoColor(capacitacion.estado)}>
                        {capacitacion.estado}
                      </Badge>
                      <Badge className={getTipoColor(capacitacion.tipo)}>
                        {capacitacion.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="w-4 h-4 mr-1" />
                      {capacitacion.duracion_horas}h
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {capacitaciones.map((capacitacion) => (
                  <tr key={capacitacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {capacitacion.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {capacitacion.descripcion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getTipoColor(capacitacion.tipo)}>
                        {capacitacion.tipo}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getEstadoColor(capacitacion.estado)}>
                        {capacitacion.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(capacitacion.fecha_inicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {capacitacion.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {capacitacion.participantes?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(capacitacion)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(capacitacion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal placeholder - Se implementará en el siguiente paso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Editar Capacitación' : 'Nueva Capacitación'}
            </h2>
            <p className="text-gray-600">Formulario de capacitación en desarrollo...</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button>
                {isEditMode ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Capacitaciones;
