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
  Phone, 
  Mail,
  User,
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import { crmService } from '@/services/crmService';

const VendedoresListing = () => {
  const [vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('all');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarVendedores();
  }, [vendedores, searchTerm, selectedEstado]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getVendedores();
      setVendedores(response.data);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarVendedores = () => {
    let filtered = [...vendedores];

    if (searchTerm) {
      filtered = filtered.filter(vendedor =>
        vendedor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEstado && selectedEstado !== 'all') {
      filtered = filtered.filter(vendedor => vendedor.estado === selectedEstado);
    }

    setFilteredVendedores(filtered);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo':
        return '#10B981';
      case 'inactivo':
        return '#EF4444';
      case 'vacaciones':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'vacaciones':
        return 'Vacaciones';
      default:
        return estado;
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando vendedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
          <p className="text-gray-600">Gestión del equipo comercial</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vendedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nombre, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Vendedores ({filteredVendedores.length} de {vendedores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Oportunidades</TableHead>
                <TableHead>Ventas Mes</TableHead>
                <TableHead>Rendimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendedores.map((vendedor) => (
                <TableRow key={vendedor.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{vendedor.nombre}</div>
                        <div className="text-sm text-gray-500">{vendedor.cargo}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {vendedor.telefono && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {vendedor.telefono}
                        </div>
                      )}
                      {vendedor.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {vendedor.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: getEstadoColor(vendedor.estado),
                        color: getEstadoColor(vendedor.estado)
                      }}
                    >
                      {getEstadoLabel(vendedor.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <User className="w-3 h-3 mr-1" />
                      {vendedor.total_clientes || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Target className="w-3 h-3 mr-1" />
                      {vendedor.oportunidades_activas || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      {formatearMoneda(vendedor.ventas_mes)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${vendedor.rendimiento || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{vendedor.rendimiento || 0}%</span>
                    </div>
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

          {filteredVendedores.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron vendedores</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendedoresListing;
