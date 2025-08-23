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
import { clientesAgroService } from '@/services/crmService';
import {
  Building,
  Crop,
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ClienteAgroModal from './ClienteAgroModal';

const ClientesAgroListing = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Cargar clientes agro
  const loadClientes = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterTipo) filters.tipo_cliente = filterTipo;
      if (filterCategoria) filters.categoria_agro = filterCategoria;

      const response = await clientesAgroService.getClientesAgro(filters);
      setClientes(response.data || []);
    } catch (error) {
      console.error('Error cargando clientes agro:', error);
      toast.error('Error al cargar los clientes agro');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, [searchTerm, filterTipo, filterCategoria]);

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente agro?')) {
      return;
    }

    try {
      await clientesAgroService.deleteClienteAgro(id);
      toast.success('Cliente agro eliminado exitosamente');
      loadClientes();
    } catch (error) {
      console.error('Error eliminando cliente agro:', error);
      toast.error('Error al eliminar el cliente agro');
    }
  };

  // Manejar edición
  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  // Manejar creación
  const handleCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleView = (cliente) => {
    navigate(`/app/crm/clientes/${cliente.id}`);
  };

  // Obtener color del badge según tipo de cliente
  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'pequeno':
        return 'bg-green-100 text-green-800';
      case 'mediano':
        return 'bg-blue-100 text-blue-800';
      case 'grande':
        return 'bg-purple-100 text-purple-800';
      case 'cooperativa':
        return 'bg-orange-100 text-orange-800';
      case 'distribuidor':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según categoría
  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'A':
        return 'bg-red-100 text-red-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-blue-100 text-blue-800';
      case 'D':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = !searchTerm ||
      cliente.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.rfc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.zona_geografica?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = !filterTipo || filterTipo === 'todos' || cliente.tipo_cliente === filterTipo;
    const matchesCategoria = !filterCategoria || filterCategoria === 'todas' || cliente.categoria_agro === filterCategoria;

    return matchesSearch && matchesTipo && matchesCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Header con diseño azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
              <p className="text-blue-100">
                Administra tus clientes y prospectos de manera eficiente
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
              {filteredClientes.length} clientes
            </Badge>
            <Button onClick={handleCreate} className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="pequeno">Pequeño</SelectItem>
                <SelectItem value="mediano">Mediano</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
                <SelectItem value="cooperativa">Cooperativa</SelectItem>
                <SelectItem value="distribuidor">Distribuidor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="A">Categoría A</SelectItem>
                <SelectItem value="B">Categoría B</SelectItem>
                <SelectItem value="C">Categoría C</SelectItem>
                <SelectItem value="D">Categoría D</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterTipo('todos');
                setFilterCategoria('todas');
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Clientes Agro ({filteredClientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Superficie</TableHead>
                  <TableHead>Cultivos</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No se encontraron clientes</p>
                        <p className="text-sm">Aún no hay clientes registrados</p>
                        <Button onClick={handleCreate} className="mt-4">
                          <Plus className="w-4 h-4 mr-2" />
                          Crear primer cliente
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{cliente.razon_social}</div>
                            {cliente.rfc && (
                              <div className="text-sm text-muted-foreground">
                                RFC: {cliente.rfc}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={getTipoColor(cliente.tipo_cliente)}>
                          {cliente.tipo_cliente}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className={getCategoriaColor(cliente.categoria_agro)}>
                          Cat. {cliente.categoria_agro}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{cliente.zona_geografica || '-'}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{cliente.superficie_total || 0} ha</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Crop className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {cliente.cultivos_principales ?
                              cliente.cultivos_principales.split(',').slice(0, 2).join(', ') +
                              (cliente.cultivos_principales.split(',').length > 2 ? '...' : '')
                              : '-'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {cliente.vendedor_nombre ? (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{cliente.vendedor_nombre}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(cliente)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(cliente)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(cliente.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Modal para crear/editar cliente agro */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCliente ? 'Editar Cliente Agro' : 'Nuevo Cliente Agro'}
            </DialogTitle>
          </DialogHeader>
          <ClienteAgroModal
            cliente={selectedCliente}
            onSave={() => {
              setIsModalOpen(false);
              loadClientes();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesAgroListing;
