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
  MapPin,
  Users,
  Calendar
} from 'lucide-react';
import { crmService, crmUtils } from '@/services/crmService';
import { 
  TIPOS_CLIENTE, 
  CATEGORIAS_CLIENTE
} from '@/types/crm';
import ClienteCard from './ClienteCard';

const ClientesListing = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('all');
  const [selectedCategoria, setSelectedCategoria] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'cards'

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [clientes, searchTerm, selectedTipo, selectedCategoria]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getClientes();
      setClientes(response.data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarClientes = () => {
    let filtered = [...clientes];

    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTipo && selectedTipo !== 'all') {
      filtered = filtered.filter(cliente => cliente.tipo_cliente === selectedTipo);
    }

    if (selectedCategoria && selectedCategoria !== 'all') {
      filtered = filtered.filter(cliente => cliente.categoria === selectedCategoria);
    }

    setFilteredClientes(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 text-sm">Gestión de clientes y prospectos</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-r-none text-xs"
            >
              Tabla
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-l-none text-xs"
            >
              Tarjetas
            </Button>
          </div>
          <Button size="sm">
            <Plus className="w-3 h-3 mr-1" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nombre, empresa, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo de Cliente</label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {TIPOS_CLIENTE.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {CATEGORIAS_CLIENTE.map((categoria) => (
                    <SelectItem key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <CardTitle>
              Clientes ({filteredClientes.length} de {clientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cliente.nombre}</div>
                      {cliente.razon_social && (
                        <div className="text-sm text-gray-500">{cliente.razon_social}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: crmUtils.getTipoClienteColor(cliente.tipo_cliente) }}
                    >
                      {TIPOS_CLIENTE.find(t => t.value === cliente.tipo_cliente)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: crmUtils.getCategoriaClienteColor(cliente.categoria) }}
                    >
                      {CATEGORIAS_CLIENTE.find(c => c.value === cliente.categoria)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cliente.vendedor_nombre ? (
                      <div className="text-sm">{cliente.vendedor_nombre}</div>
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {cliente.telefono && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {cliente.telefono}
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {cliente.email}
                        </div>
                      )}
                      {cliente.ciudad && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {cliente.ciudad}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(cliente.fecha_registro).toLocaleDateString()}
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

          {filteredClientes.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron clientes</p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Vista de Tarjetas */}
      {viewMode === 'cards' && (
        <Card>
          <CardHeader>
            <CardTitle>
              Clientes ({filteredClientes.length} de {clientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClientes.map((cliente) => (
                <ClienteCard
                  key={cliente.id}
                  cliente={cliente}
                  onView={(cliente) => console.log('Ver cliente:', cliente)}
                  onEdit={(cliente) => console.log('Editar cliente:', cliente)}
                  onDelete={(cliente) => console.log('Eliminar cliente:', cliente)}
                />
              ))}
            </div>

            {filteredClientes.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No se encontraron clientes</p>
                <p className="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientesListing;
