import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { oportunidadesAgroService } from '@/services/crmService';
import {
  BarChart3,
  Building,
  Crop,
  DollarSign,
  Edit,
  Eye,
  Grid3X3,
  List,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UnifiedCard from '../common/UnifiedCard';
import OportunidadAgroKanbanBoard from './OportunidadAgroKanbanBoard';
import OportunidadAgroModal from './OportunidadAgroModal';

const OportunidadesAgroListing = () => {
  const navigate = useNavigate();
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtapa, setFilterEtapa] = useState('todas');
  const [filterTipo, setFilterTipo] = useState('todas');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'grid', 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOportunidad, setSelectedOportunidad] = useState(null);

  // Cargar oportunidades agro
  const loadOportunidades = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterEtapa !== 'todas') filters.etapa = filterEtapa;
      if (filterTipo !== 'todas') filters.tipo_oportunidad = filterTipo;

      const response = await oportunidadesAgroService.getOportunidadesAgro(filters);
      setOportunidades(response.data || []);
    } catch (error) {
      console.error('Error cargando oportunidades agro:', error);
      toast.error('Error al cargar las oportunidades agro');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOportunidades();
  }, [searchTerm, filterEtapa, filterTipo]);

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oportunidad agro?')) {
      return;
    }

    try {
      await oportunidadesAgroService.deleteOportunidadAgro(id);
      toast.success('Oportunidad agro eliminada exitosamente');
      loadOportunidades();
    } catch (error) {
      console.error('Error eliminando oportunidad agro:', error);
      toast.error('Error al eliminar la oportunidad agro');
    }
  };

  // Manejar edición
  const handleEdit = (oportunidad) => {
    setSelectedOportunidad(oportunidad);
    setIsModalOpen(true);
  };

  // Manejar creación
  const handleCreate = () => {
    setSelectedOportunidad(null);
    setIsModalOpen(true);
  };

  // Manejar vista de tarjeta
  const handleCardClick = (oportunidad) => {
    navigate(`/app/crm/oportunidades/${oportunidad.id}`);
  };

  // Manejar cambio de estado en Kanban
  const handleOportunidadStateChange = async (oportunidadId, newEstado) => {
    try {
      const oportunidad = oportunidades.find(o => o.id === oportunidadId);
      if (!oportunidad) return;

      await oportunidadesAgroService.updateOportunidadAgro(oportunidadId, {
        ...oportunidad,
        etapa: newEstado
      });

      toast.success('Estado de oportunidad actualizado');
      loadOportunidades();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  // Obtener color del badge según etapa
  const getEtapaColor = (etapa) => {
    switch (etapa) {
      case 'prospeccion':
        return 'bg-blue-100 text-blue-800';
      case 'diagnostico':
        return 'bg-purple-100 text-purple-800';
      case 'propuesta_tecnica':
        return 'bg-orange-100 text-orange-800';
      case 'demostracion':
        return 'bg-yellow-100 text-yellow-800';
      case 'negociacion':
        return 'bg-indigo-100 text-indigo-800';
      case 'cerrada_ganada':
        return 'bg-green-100 text-green-800';
      case 'cerrada_perdida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según tipo
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'nueva':
        return 'bg-emerald-100 text-emerald-800';
      case 'renovacion':
        return 'bg-blue-100 text-blue-800';
      case 'ampliacion':
        return 'bg-purple-100 text-purple-800';
      case 'servicio_tecnico':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener etiqueta de etapa
  const getEtapaLabel = (etapa) => {
    const etapas = {
      'prospeccion': 'Prospección',
      'diagnostico': 'Diagnóstico',
      'propuesta_tecnica': 'Propuesta Técnica',
      'demostracion': 'Demostración',
      'negociacion': 'Negociación',
      'cerrada_ganada': 'Cerrada Ganada',
      'cerrada_perdida': 'Cerrada Perdida'
    };
    return etapas[etapa] || etapa;
  };

  // Obtener etiqueta de tipo
  const getTipoLabel = (tipo) => {
    const tipos = {
      'nueva': 'Nueva',
      'renovacion': 'Renovación',
      'ampliacion': 'Ampliación',
      'servicio_tecnico': 'Servicio Técnico'
    };
    return tipos[tipo] || tipo;
  };

  // Filtrar oportunidades
  const filteredOportunidades = oportunidades.filter(oportunidad => {
    const matchesSearch = !searchTerm ||
      oportunidad.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidad.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidad.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEtapa = !filterEtapa || filterEtapa === 'todas' || oportunidad.etapa === filterEtapa;
    const matchesTipo = !filterTipo || filterTipo === 'todas' || oportunidad.tipo_oportunidad === filterTipo;

    return matchesSearch && matchesEtapa && matchesTipo;
  });

  // Calcular estadísticas
  const stats = {
    total: oportunidades.length,
    prospeccion: oportunidades.filter(o => o.etapa === 'prospeccion').length,
    negociacion: oportunidades.filter(o => o.etapa === 'negociacion').length,
    cerradas: oportunidades.filter(o => o.etapa === 'cerrada_ganada' || o.etapa === 'cerrada_perdida').length,
    valorTotal: oportunidades.reduce((sum, o) => sum + (Number(o.valor_estimado) || 0), 0)
  };

  // Renderizar vista de tarjetas
  const renderGridView = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredOportunidades.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron oportunidades.</p>
          <Button onClick={handleCreate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Crear primera oportunidad
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOportunidades.map((oportunidad) => {
          const fields = [
            ...(oportunidad.cliente_nombre ? [{
              icon: Building,
              label: "Cliente",
              value: oportunidad.cliente_nombre
            }] : []),
            ...(oportunidad.vendedor_nombre ? [{
              icon: UserCheck,
              label: "Vendedor",
              value: oportunidad.vendedor_nombre
            }] : []),
            ...(oportunidad.valor_estimado ? [{
              icon: DollarSign,
              label: "Valor",
              value: `$${Number(oportunidad.valor_estimado).toLocaleString()}`
            }] : []),
            ...(oportunidad.cultivo_objetivo ? [{
              icon: Crop,
              label: "Cultivo",
              value: oportunidad.cultivo_objetivo
            }] : [])
          ];

          return (
            <UnifiedCard
              key={oportunidad.id}
              title={oportunidad.titulo}
              subtitle={getTipoLabel(oportunidad.tipo_oportunidad)}
              description={oportunidad.descripcion}
              status={getEtapaLabel(oportunidad.etapa)}
              fields={fields}
              icon={Target}
              primaryColor="orange"
              onView={() => handleCardClick(oportunidad)}
              onEdit={() => handleEdit(oportunidad)}
              onDelete={() => handleDelete(oportunidad.id)}
            />
          );
        })}
      </div>
    );
  };

  // Renderizar vista de lista
  const renderListView = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Probabilidad</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOportunidades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Target className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No se encontraron oportunidades</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOportunidades.map((oportunidad) => (
                  <TableRow key={oportunidad.id}>
                    <TableCell>
                      <div className="font-medium">{oportunidad.titulo}</div>
                      {oportunidad.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {oportunidad.descripcion}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>{oportunidad.cliente_nombre || '-'}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className={getEtapaColor(oportunidad.etapa)}>
                        {getEtapaLabel(oportunidad.etapa)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={getTipoColor(oportunidad.tipo_oportunidad)}>
                        {getTipoLabel(oportunidad.tipo_oportunidad)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          ${oportunidad.valor_estimado ? Number(oportunidad.valor_estimado).toLocaleString() : '0'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{oportunidad.probabilidad}%</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <span>{oportunidad.vendedor_nombre || '-'}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCardClick(oportunidad)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(oportunidad)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(oportunidad.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades Agro</h1>
          <p className="text-gray-600">Gestión del pipeline de ventas agro</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Oportunidad
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Prospección</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prospeccion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Negociación</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.negociacion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.valorTotal.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar oportunidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterEtapa} onValueChange={setFilterEtapa}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las etapas</SelectItem>
                <SelectItem value="prospeccion">Prospección</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                <SelectItem value="propuesta_tecnica">Propuesta Técnica</SelectItem>
                <SelectItem value="demostracion">Demostración</SelectItem>
                <SelectItem value="negociacion">Negociación</SelectItem>
                <SelectItem value="cerrada_ganada">Cerrada Ganada</SelectItem>
                <SelectItem value="cerrada_perdida">Cerrada Perdida</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los tipos</SelectItem>
                <SelectItem value="nueva">Nueva</SelectItem>
                <SelectItem value="renovacion">Renovación</SelectItem>
                <SelectItem value="ampliacion">Ampliación</SelectItem>
                <SelectItem value="servicio_tecnico">Servicio Técnico</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido según modo de vista */}
      {viewMode === 'kanban' ? (
        <OportunidadAgroKanbanBoard
          oportunidades={filteredOportunidades}
          onCardClick={handleCardClick}
          onOportunidadStateChange={handleOportunidadStateChange}
        />
      ) : viewMode === 'grid' ? (
        renderGridView()
      ) : (
        renderListView()
      )}

      {/* Modal para crear/editar oportunidad agro */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOportunidad ? 'Editar Oportunidad Agro' : 'Nueva Oportunidad Agro'}
            </DialogTitle>
          </DialogHeader>
          <OportunidadAgroModal
            oportunidad={selectedOportunidad}
            onSave={() => {
              setIsModalOpen(false);
              loadOportunidades();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OportunidadesAgroListing;
