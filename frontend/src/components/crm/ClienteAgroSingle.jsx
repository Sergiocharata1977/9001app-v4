import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Target, 
  Leaf, 
  Droplets, 
  Sun, 
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Hash,
  Globe,
  Thermometer,
  TreePine,
  Sprout,
  Tractor,
  UserCheck,
  UserCog,
  Eye
} from 'lucide-react';
import { clientesAgroService, contactosService } from '@/services/crmService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ClienteAgroSingle = () => {
  const [cliente, setCliente] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const response = await clientesAgroService.getClienteAgro(id);
        setCliente(response.data);
        
        // Cargar información del contacto
        if (response.data?.contacto_id) {
          const contactoResponse = await contactosService.getContacto(response.data.contacto_id);
          setContacto(contactoResponse.data);
        }
      } catch (err) {
        setError('No se pudo cargar el cliente. Es posible que haya sido eliminado.');
        toast({
          title: 'Error',
          description: 'No se pudo cargar el cliente. Inténtalo de nuevo más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCliente();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/app/crm/clientes/editar/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesAgroService.deleteClienteAgro(id);
        toast({
          title: 'Cliente eliminado',
          description: 'El cliente ha sido eliminado exitosamente.',
          variant: 'success',
        });
        navigate('/app/crm/clientes');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el cliente.',
          variant: 'destructive',
        });
      }
    }
  };

  const getTipoClienteLabel = (tipo) => {
    const tipos = {
      'pequeno': 'Pequeño (&lt; 10 ha)',
      'mediano': 'Mediano (10-100 ha)',
      'grande': 'Grande (&gt; 100 ha)',
      'cooperativa': 'Cooperativa',
      'distribuidor': 'Distribuidor'
    };
    return tipos[tipo] || tipo;
  };

  const getCategoriaLabel = (categoria) => {
    const categorias = {
      'A': 'Categoría A (Alto valor)',
      'B': 'Categoría B (Medio-alto valor)',
      'C': 'Categoría C (Medio valor)',
      'D': 'Categoría D (Bajo valor)'
    };
    return categorias[categoria] || categoria;
  };

  const getTipoAgriculturaLabel = (tipo) => {
    const tipos = {
      'convencional': 'Convencional',
      'organica': 'Orgánica',
      'mixta': 'Mixta'
    };
    return tipos[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Cargando detalles del cliente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error al Cargar</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button variant="outline" onClick={() => navigate('/app/crm/clientes')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Clientes
        </Button>
      </div>
    );
  }

  if (!cliente) {
    return null;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header Principal */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => navigate('/app/crm/clientes')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Cliente Agro: {cliente.razon_social}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sistema de Gestión Comercial - CRM Agro
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Layout principal: contenido + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido del cliente) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Building className="w-6 h-6 mr-3 text-blue-600" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <strong>Razón Social:</strong>
                    <span className="ml-2">{cliente.razon_social}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <strong>RFC:</strong>
                    <span className="ml-2">{cliente.rfc || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <strong>Tipo:</strong>
                    <Badge variant="outline" className="ml-2">
                      {getTipoClienteLabel(cliente.tipo_cliente)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    <strong>Categoría:</strong>
                    <Badge variant="outline" className="ml-2">
                      {getCategoriaLabel(cliente.categoria_agro)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            {contacto && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <strong>Nombre:</strong>
                      <span className="ml-2">{contacto.nombre} {contacto.apellidos}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <strong>Email:</strong>
                      <span className="ml-2">{contacto.email || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <strong>Teléfono:</strong>
                      <span className="ml-2">{contacto.telefono || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <strong>Empresa:</strong>
                      <span className="ml-2">{contacto.empresa || 'No especificada'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dirección */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <strong>Dirección:</strong>
                    <span className="ml-2">{cliente.direccion || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <strong>Ciudad:</strong>
                    <span className="ml-2">{cliente.ciudad || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <strong>Estado:</strong>
                    <span className="ml-2">{cliente.estado || 'No especificado'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos Agro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Datos Agro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <strong>Zona Geográfica:</strong>
                    <span className="ml-2">{cliente.zona_geografica || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <strong>Región:</strong>
                    <span className="ml-2">{cliente.region || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Thermometer className="w-4 h-4 mr-2" />
                    <strong>Clima:</strong>
                    <span className="ml-2">{cliente.clima_zona || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TreePine className="w-4 h-4 mr-2" />
                    <strong>Tipo de Suelo:</strong>
                    <span className="ml-2">{cliente.tipo_suelo || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    <strong>Superficie Total:</strong>
                    <span className="ml-2">{cliente.superficie_total ? `${cliente.superficie_total} ha` : 'No especificada'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Droplets className="w-4 h-4 mr-2" />
                    <strong>Sistema de Riego:</strong>
                    <span className="ml-2">{cliente.sistema_riego || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Sprout className="w-4 h-4 mr-2" />
                    <strong>Tipo de Agricultura:</strong>
                    <Badge variant="outline" className="ml-2">
                      {getTipoAgriculturaLabel(cliente.tipo_agricultura)}
                    </Badge>
                  </div>
                </div>

                {/* Cultivos Principales */}
                {cliente.cultivos_principales && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start text-gray-600">
                      <Leaf className="w-4 h-4 mr-2 mt-1" />
                      <div>
                        <strong>Cultivos Principales:</strong>
                        <p className="ml-2 mt-1 text-sm">{cliente.cultivos_principales}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferencias Estacionales */}
                {cliente.preferencias_estacionales && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 mt-1" />
                      <div>
                        <strong>Preferencias Estacionales:</strong>
                        <p className="ml-2 mt-1 text-sm">{cliente.preferencias_estacionales}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Observaciones */}
            {cliente.observaciones && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Observaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{cliente.observaciones}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna de relaciones y asignaciones */}
          <div className="space-y-6">
            {/* Asignación Comercial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Asignación Comercial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <strong>Vendedor:</strong>
                    <span className="ml-2">{cliente.vendedor_asignado?.nombres || 'No asignado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserCog className="w-4 h-4 mr-2" />
                    <strong>Técnico:</strong>
                    <span className="ml-2">{cliente.tecnico_asignado?.nombres || 'No asignado'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-2" />
                    <strong>Supervisor:</strong>
                    <span className="ml-2">{cliente.supervisor_comercial?.nombres || 'No asignado'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Registro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información de Registro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <strong>Fecha de Registro:</strong>
                    <span className="ml-2">
                      {cliente.fecha_registro ? new Date(cliente.fecha_registro).toLocaleDateString() : 'No especificada'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <strong>Último Contacto:</strong>
                    <span className="ml-2">
                      {cliente.fecha_ultimo_contacto ? new Date(cliente.fecha_ultimo_contacto).toLocaleDateString() : 'No especificada'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Nueva Actividad
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Nueva Oportunidad
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Llamar Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteAgroSingle;
