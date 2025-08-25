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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { crmService } from '@/services/crmService';
import { TIPOS_ACTIVIDAD } from '@/types/crm';

const ActividadesListing = () => {
  const [actividades, setActividades] = useState([]);
  const [filteredActividades, setFilteredActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('all');
  const [selectedEstado, setSelectedEstado] = useState('all');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarActividades();
  }, [actividades, searchTerm, selectedTipo, selectedEstado]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getActividades();
      setActividades(response.data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarActividades = () => {
    let filtered = [...(actividades || [])];

    if (searchTerm) {
      filtered = filtered.filter(actividad =>
        actividad.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTipo && selectedTipo !== 'all') {
      filtered = filtered.filter(actividad => actividad.tipo === selectedTipo);
    }

    if (selectedEstado && selectedEstado !== 'all') {
      filtered = filtered.filter(actividad => actividad.estado === selectedEstado);
    }

    setFilteredActividades(filtered);
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'llamada':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'reunion':
        return <MessageSquare className="w-4 h-4" />;
      case 'tarea':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'llamada':
        return '#10B981';
      case 'email':
        return '#3B82F6';
      case 'reunion':
        return '#8B5CF6';
      case 'tarea':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada':
        return '#10B981';
      case 'pendiente':
        return '#F59E0B';
      case 'cancelada':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'completada':
        return 'Completada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actividades</h1>
          <p className="text-gray-600">Seguimiento de actividades comerciales</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
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
                  placeholder="Título, descripción, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {TIPOS_ACTIVIDAD.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Actividades ({(filteredActividades || []).length} de {(actividades || []).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actividad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActividades.map((actividad) => (
                <TableRow key={actividad.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{actividad.titulo}</div>
                      {actividad.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {actividad.descripcion}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="p-1 rounded"
                        style={{ backgroundColor: `${getTipoColor(actividad.tipo)}20` }}
                      >
                        {getTipoIcon(actividad.tipo)}
                      </div>
                      <span className="text-sm font-medium">
                        {TIPOS_ACTIVIDAD.find(t => t.value === actividad.tipo)?.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{actividad.cliente_nombre}</div>
                  </TableCell>
                  <TableCell>
                    {actividad.responsable_nombre ? (
                      <div className="flex items-center text-sm">
                        <User className="w-3 h-3 mr-1" />
                        {actividad.responsable_nombre}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {actividad.fecha_programada ? 
                        new Date(actividad.fecha_programada).toLocaleDateString() : 
                        'Sin fecha'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: getEstadoColor(actividad.estado),
                        color: getEstadoColor(actividad.estado)
                      }}
                    >
                      {getEstadoLabel(actividad.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredActividades.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron actividades</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActividadesListing;
