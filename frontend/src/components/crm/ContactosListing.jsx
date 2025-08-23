import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building,
  User,
  Users,
  Store,
  Truck
} from 'lucide-react';
import { contactosService } from '@/services/crmService';
import toast from 'react-hot-toast';
import ContactoModal from './ContactoModal';

const ContactosListing = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);

  // Cargar contactos
  const loadContactos = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterTipo) filters.tipo_contacto = filterTipo;
      if (filterEstado) filters.estado_contacto = filterEstado;

      const response = await contactosService.getContactos(filters);
      setContactos(response.data || []);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      toast.error('Error al cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactos();
  }, [searchTerm, filterTipo, filterEstado]);

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      return;
    }

    try {
      await contactosService.deleteContacto(id);
      toast.success('Contacto eliminado exitosamente');
      loadContactos();
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      toast.error('Error al eliminar el contacto');
    }
  };

  // Manejar edición
  const handleEdit = (contacto) => {
    setSelectedContacto(contacto);
    setIsModalOpen(true);
  };

  // Manejar creación
  const handleCreate = () => {
    setSelectedContacto(null);
    setIsModalOpen(true);
  };

  // Obtener icono según tipo de contacto
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'cliente':
        return <User className="w-4 h-4" />;
      case 'proveedor':
        return <Truck className="w-4 h-4" />;
      case 'distribuidor':
        return <Store className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Obtener color del badge según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'calificado':
        return 'bg-blue-100 text-blue-800';
      case 'descalificado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar contactos
  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = !searchTerm || 
      contacto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = !filterTipo || contacto.tipo_contacto === filterTipo;
    const matchesEstado = !filterEstado || contacto.estado_contacto === filterEstado;

    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los contactos de tu CRM
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de contacto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                <SelectItem value="prospecto">Prospecto</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="distribuidor">Distribuidor</SelectItem>
                <SelectItem value="proveedor">Proveedor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="calificado">Calificado</SelectItem>
                <SelectItem value="descalificado">Descalificado</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterTipo('');
                setFilterEstado('');
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de contactos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contactos ({filteredContactos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContactos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No se encontraron contactos
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContactos.map((contacto) => (
                    <TableRow key={contacto.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(contacto.tipo_contacto)}
                            <div>
                              <div className="font-medium">
                                {contacto.nombre} {contacto.apellidos}
                              </div>
                              {contacto.cargo && (
                                <div className="text-sm text-muted-foreground">
                                  {contacto.cargo}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {contacto.empresa ? (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            {contacto.empresa}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {contacto.telefono && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3" />
                              {contacto.telefono}
                            </div>
                          )}
                          {contacto.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3" />
                              {contacto.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">
                          {contacto.tipo_contacto}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getEstadoColor(contacto.estado_contacto)}>
                          {contacto.estado_contacto}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {contacto.zona_geografica || '-'}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contacto)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contacto.id)}
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

      {/* Modal para crear/editar contacto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedContacto ? 'Editar Contacto' : 'Nuevo Contacto'}
            </DialogTitle>
          </DialogHeader>
          <ContactoModal
            contacto={selectedContacto}
            onSave={() => {
              setIsModalOpen(false);
              loadContactos();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactosListing;
