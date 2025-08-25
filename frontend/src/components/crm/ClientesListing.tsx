import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Users, Download, Filter, Grid, List, ArrowLeft, Mail, Phone, MapPin, Calendar, Building, Award, CheckCircle, AlertCircle, Clock, Eye, UserCheck, Plus, Search } from 'lucide-react';
import { crmService } from '@/services/crmService';
import ClienteModal from './ClienteModal';
import ClienteTableView from './ClienteTableView';
import ClienteCard from './ClienteCard';
import UnifiedHeader from '../common/UnifiedHeader';
import UnifiedCard from '../common/UnifiedCard';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

const ClientesListing = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  console.log('🔍 ClientesListing - Componente iniciado');
  console.log('👤 Usuario actual:', user);

  useEffect(() => {
    console.log('🔄 ClientesListing - useEffect ejecutado');
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      console.log('📡 Iniciando fetchClientes...');
      setLoading(true);
      setError(null);
      
      const response = await crmService.getClientes();
      console.log('📋 Respuesta completa del servicio CRM:', response);
      console.log('📋 Tipo de respuesta:', typeof response);
      console.log('📋 Es array?', Array.isArray(response));
      
      // Manejar diferentes formatos de respuesta
      let clientesData = [];
      if (Array.isArray(response)) {
        clientesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        clientesData = response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        clientesData = response.data.data;
      } else if (response && Array.isArray(response)) {
        clientesData = response;
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', response);
        clientesData = [];
      }
      
      console.log('📋 Clientes procesados:', clientesData);
      setClientes(clientesData);
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleView = (cliente) => {
    navigate(`/app/crm-satisfaccion/clientes/${cliente.id}`);
  };

  const handleDelete = (cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await crmService.deleteCliente(clienteToDelete.id);
      
      setClientes(prev => prev.filter(c => c.id !== clienteToDelete.id));
      
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
    }
  };

  const handleSave = async (clienteData) => {
    try {
      let response;
      
      if (clienteData.id) {
        // Actualizar
        response = await crmService.updateCliente(clienteData.id, clienteData);
        setClientes(prev => prev.map(c => c.id === clienteData.id ? response.data : c));
        toast({
          title: "Cliente actualizado",
          description: "El cliente ha sido actualizado exitosamente",
          variant: "default"
        });
      } else {
        // Crear
        response = await crmService.createCliente(clienteData);
        setClientes(prev => [...prev, response.data]);
        toast({
          title: "Cliente creado",
          description: "El cliente ha sido creado exitosamente",
          variant: "default"
        });
      }
      
      setIsModalOpen(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    // Implementar exportación
    toast({
      title: "Exportación",
      description: "Funcionalidad de exportación en desarrollo",
      variant: "default"
    });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('📊 Estado actual:', {
    loading,
    error,
    clientesCount: clientes.length,
    filteredCount: filteredClientes.length,
    searchTerm
  });

  // Renderizado simplificado para diagnóstico
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando clientes...</h3>
          <p className="text-gray-600">Por favor espera mientras se cargan los datos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar clientes</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchClientes} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header simplificado */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                <p className="text-white/90 text-sm mt-1">Administra tus clientes y prospectos de manera eficiente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Barra de herramientas */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      {filteredClientes.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No hay clientes que coincidan con tu búsqueda' : 'Aún no hay clientes registrados'}
          </p>
          {!searchTerm && (
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear primer cliente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cliente.nombre || 'Sin nombre'}</CardTitle>
                  <Badge variant="outline" className={cliente.tipo_cliente === 'activo' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                    {cliente.tipo_cliente || 'potencial'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{cliente.razon_social || 'Sin razón social'}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{cliente.telefono}</span>
                    </div>
                  )}
                  {cliente.ciudad && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{cliente.ciudad}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleView(cliente)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={selectedCliente}
        onSave={handleSave}
        organizacionId={user?.organization_id}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente "{clienteToDelete?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientesListing;
