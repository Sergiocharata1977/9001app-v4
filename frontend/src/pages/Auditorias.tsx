import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Download, Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auditoriasService } from '@/services/auditoriasService';
import { Auditoria, AuditoriaFilters } from '@/types/auditorias';
import { useToast } from '@/hooks/useToast';

const Auditorias: React.FC = () => {
  const [filters, setFilters] = useState<AuditoriaFilters>({
    estado: '',
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    auditor: '',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Query para obtener auditorías
  const {
    data: auditorias = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['auditorias', filters],
    queryFn: () => auditoriasService.getAuditorias(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: auditoriasService.deleteAuditoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditorias'] });
      showToast('Auditoría eliminada exitosamente', 'success');
    },
    onError: () => {
      showToast('Error al eliminar auditoría', 'error');
    }
  });

  // Handlers
  const handleCreate = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (auditoria: Auditoria) => {
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta auditoría?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFilterChange = (key: keyof AuditoriaFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getEstadoColor = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error al cargar auditorías</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Auditorías</h1>
          <p className="text-gray-600 mt-2">Administra y programa auditorías del sistema de gestión</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Auditoría
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <Input
              placeholder="Buscar auditorías..."
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
              <option value="en_proceso">En Proceso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
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
              <option value="interna">Interna</option>
              <option value="externa">Externa</option>
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
              Auditor
            </label>
            <Input
              placeholder="Nombre del auditor"
              value={filters.auditor}
              onChange={(e) => handleFilterChange('auditor', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Auditorías List */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : auditorias.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron auditorías</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auditoría
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
                    Auditor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditorias.map((auditoria) => (
                  <tr key={auditoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {auditoria.titulo || auditoria.codigo || `Auditoría ${auditoria.id}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {auditoria.alcance || 'Sin alcance definido'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {auditoria.tipo || 'Sin tipo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getEstadoColor(auditoria.estado)}>
                        {auditoria.estado || 'Sin estado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {auditoria.fecha_inicio ? new Date(auditoria.fecha_inicio).toLocaleDateString() : 'Sin fecha'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {auditoria.auditor_lider || 'Sin auditor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(auditoria)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(auditoria.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="w-4 h-4" />
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
              {isEditMode ? 'Editar Auditoría' : 'Nueva Auditoría'}
            </h2>
            <p className="text-gray-600">Formulario de auditoría en desarrollo...</p>
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

export default Auditorias;
