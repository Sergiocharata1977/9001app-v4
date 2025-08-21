import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Calendar,
  Target,
  TrendingUp,
  User
} from 'lucide-react';
import { crmService } from '@/services/crmService';
import { ETAPAS_OPORTUNIDAD, formatearMoneda } from '@/types/crm';
import OportunidadModal from './OportunidadModal';

const OportunidadesListing = () => {
  const [oportunidades, setOportunidades] = useState([]);
  const [filteredOportunidades, setFilteredOportunidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState('all');
  const [selectedVendedor, setSelectedVendedor] = useState('all');
  
  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedOportunidad, setSelectedOportunidad] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarOportunidades();
  }, [oportunidades, searchTerm, selectedEtapa, selectedVendedor]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getOportunidades();
      setOportunidades(response.data);
    } catch (error) {
      console.error('Error cargando oportunidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarOportunidades = () => {
    let filtered = [...oportunidades];

    if (searchTerm) {
      filtered = filtered.filter(oportunidad =>
        oportunidad.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oportunidad.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        oportunidad.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEtapa && selectedEtapa !== 'all') {
      filtered = filtered.filter(oportunidad => oportunidad.etapa === selectedEtapa);
    }

    if (selectedVendedor && selectedVendedor !== 'all') {
      filtered = filtered.filter(oportunidad => oportunidad.vendedor_id === selectedVendedor);
    }

    setFilteredOportunidades(filtered);
  };

  const getEtapaColor = (etapa) => {
    const etapaInfo = ETAPAS_OPORTUNIDAD.find(e => e.value === etapa);
    return etapaInfo?.color || '#6B7280';
  };

  const getEtapaLabel = (etapa) => {
    const etapaInfo = ETAPAS_OPORTUNIDAD.find(e => e.value === etapa);
    return etapaInfo?.label || etapa;
  };

  // Funciones del modal
  const handleOpenModal = (mode, oportunidad = null) => {
    setModalMode(mode);
    setSelectedOportunidad(oportunidad);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOportunidad(null);
    setModalMode('create');
  };

  const handleModalSave = (data) => {
    if (data.deleted) {
      // Oportunidad eliminada
      setOportunidades(prev => prev.filter(o => o.id !== data.id));
    } else if (modalMode === 'create') {
      // Oportunidad creada
      setOportunidades(prev => [...prev, data]);
    } else if (modalMode === 'edit') {
      // Oportunidad actualizada
      setOportunidades(prev => prev.map(o => o.id === data.id ? data : o));
    }
    
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-600">Pipeline de ventas y oportunidades comerciales</p>
        </div>
        <Button onClick={() => handleOpenModal('create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nombre, cliente, descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Etapa</label>
              <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  {ETAPAS_OPORTUNIDAD.map((etapa) => (
                    <SelectItem key={etapa.value} value={etapa.value}>
                      {etapa.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendedor</label>
              <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los vendedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vendedores</SelectItem>
                  {/* Aquí se cargarían los vendedores dinámicamente */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Oportunidades ({filteredOportunidades.length} de {oportunidades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oportunidad</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Fecha Cierre</TableHead>
                <TableHead>Probabilidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOportunidades.map((oportunidad) => (
                <TableRow key={oportunidad.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{oportunidad.nombre}</div>
                      {oportunidad.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {oportunidad.descripcion}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{oportunidad.cliente_nombre}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: getEtapaColor(oportunidad.etapa) }}
                    >
                      {getEtapaLabel(oportunidad.etapa)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      {formatearMoneda(oportunidad.valor_estimado)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {oportunidad.vendedor_nombre ? (
                      <div className="flex items-center text-sm">
                        <User className="w-3 h-3 mr-1" />
                        {oportunidad.vendedor_nombre}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {oportunidad.fecha_cierre_esperada ? 
                        new Date(oportunidad.fecha_cierre_esperada).toLocaleDateString() : 
                        'Sin fecha'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${oportunidad.probabilidad || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{oportunidad.probabilidad || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenModal('view', oportunidad)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenModal('edit', oportunidad)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenModal('delete', oportunidad)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOportunidades.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron oportunidades</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Oportunidad */}
      <OportunidadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        oportunidad={selectedOportunidad}
        mode={modalMode}
      />
    </div>
  );
};

export default OportunidadesListing;
