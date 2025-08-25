import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  Target,
  Users,
  FileText
} from 'lucide-react';
import { crmService } from '@/services/crmService';

const ClienteSinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCliente();
  }, [id]);

  const cargarCliente = async () => {
    try {
      setIsLoading(true);
      const response = await crmService.getCliente(id);
      setCliente(response.data);
    } catch (error) {
      console.error('Error cargando cliente:', error);
      setError('Error al cargar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const calcularCompletitud = (cliente) => {
    if (!cliente) return 0;
    
    const campos = [
      'nombre', 'razon_social', 'rfc', 'email', 'telefono', 
      'direccion', 'ciudad', 'estado', 'codigo_postal', 'pais',
      'sitio_web', 'representante_legal', 'vendedor_asignado_id',
      'supervisor_comercial_id', 'zona_venta', 'especialidad_interes'
    ];
    
    const camposCompletados = campos.filter(campo => 
      cliente[campo] && cliente[campo].trim() !== ''
    ).length;
    
    return Math.round((camposCompletados / campos.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error || 'Cliente no encontrado'}</p>
          <Button onClick={() => navigate('/app/crm/clientes')}>
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  const completitud = calcularCompletitud(cliente);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/app/crm/clientes')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cliente.nombre}</h1>
            <p className="text-gray-600">Detalles del cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Indicador de Completitud */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Perfil Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{completitud}%</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completitud >= 80 ? 'bg-green-500' : 
                    completitud >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${completitud}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="comercial">Comercial</TabsTrigger>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
        </TabsList>

        {/* Pestaña General */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-gray-900">{cliente.nombre}</p>
                </div>
                {cliente.razon_social && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Razón Social</label>
                    <p className="text-gray-900">{cliente.razon_social}</p>
                  </div>
                )}
                {cliente.rfc && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">RFC</label>
                    <p className="text-gray-900">{cliente.rfc}</p>
                  </div>
                )}
                {cliente.representante_legal && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Representante Legal</label>
                    <p className="text-gray-900">{cliente.representante_legal}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge variant="outline">{cliente.tipo_cliente}</Badge>
                  <Badge variant="secondary">{cliente.categoria}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cliente.direccion && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dirección</label>
                    <p className="text-gray-900">{cliente.direccion}</p>
                  </div>
                )}
                {cliente.ciudad && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ciudad</label>
                    <p className="text-gray-900">{cliente.ciudad}</p>
                  </div>
                )}
                {cliente.estado && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-gray-900">{cliente.estado}</p>
                  </div>
                )}
                {cliente.codigo_postal && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Código Postal</label>
                    <p className="text-gray-900">{cliente.codigo_postal}</p>
                  </div>
                )}
                {cliente.pais && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">País</label>
                    <p className="text-gray-900">{cliente.pais}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña Contacto */}
        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{cliente.email}</p>
                    </div>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-gray-900">{cliente.telefono}</p>
                    </div>
                  </div>
                )}
                {cliente.sitio_web && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sitio Web</label>
                      <p className="text-gray-900">{cliente.sitio_web}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Comercial */}
        <TabsContent value="comercial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Información Comercial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cliente.vendedor_asignado_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vendedor Asignado</label>
                    <p className="text-gray-900">{cliente.vendedor_nombre || cliente.vendedor_asignado_id}</p>
                  </div>
                )}
                {cliente.supervisor_comercial_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Supervisor Comercial</label>
                    <p className="text-gray-900">{cliente.supervisor_nombre || cliente.supervisor_comercial_id}</p>
                  </div>
                )}
                {cliente.zona_venta && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Zona de Venta</label>
                    <p className="text-gray-900">{cliente.zona_venta}</p>
                  </div>
                )}
                {cliente.especialidad_interes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Especialidad de Interés</label>
                    <p className="text-gray-900">{cliente.especialidad_interes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Actividad */}
        <TabsContent value="actividad">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Actividad del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha de Registro</label>
                  <p className="text-gray-900">
                    {new Date(cliente.fecha_registro).toLocaleDateString()}
                  </p>
                </div>
                {cliente.fecha_ultimo_contacto && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Último Contacto</label>
                    <p className="text-gray-900">
                      {new Date(cliente.fecha_ultimo_contacto).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {cliente.observaciones && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observaciones</label>
                  <p className="text-gray-900">{cliente.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClienteSinglePage;
