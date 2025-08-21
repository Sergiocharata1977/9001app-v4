import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { crmService } from '@/services/crmService';
import {
  Plus,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ClienteModal from './ClienteModal';

const ClientesListing = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('all');
  const [selectedCategoria, setSelectedCategoria] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [clientes, searchTerm, selectedTipo, selectedCategoria]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await crmService.getClientes();
      console.log('Respuesta del servicio CRM:', response);
      setClientes(response.data || []);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarClientes = () => {
    if (!clientes || !Array.isArray(clientes)) {
      setFilteredClientes([]);
      return;
    }

    let filtered = [...clientes];

    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTipo && selectedTipo !== 'all') {
      filtered = filtered.filter(cliente => cliente?.tipo_cliente === selectedTipo);
    }

    if (selectedCategoria && selectedCategoria !== 'all') {
      filtered = filtered.filter(cliente => cliente?.categoria === selectedCategoria);
    }

    setFilteredClientes(filtered);
  };

  // Funciones del modal
  const handleOpenModal = (mode, cliente = null) => {
    setModalMode(mode);
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCliente(null);
    setModalMode('create');
  };

  const handleModalSave = (data) => {
    if (data.deleted) {
      setClientes(prev => prev.filter(c => c.id !== data.id));
    } else if (modalMode === 'create') {
      setClientes(prev => [...prev, data]);
    } else if (modalMode === 'edit') {
      setClientes(prev => prev.map(c => c.id === data.id ? data : c));
    }

    handleCloseModal();
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={cargarDatos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
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
          <Button size="sm" onClick={() => handleOpenModal('create')}>
            <Plus className="w-3 h-3 mr-1" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Clientes ({filteredClientes?.length || 0} de {clientes?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lista de Clientes</h3>
            <p className="text-gray-600 mb-4">
              {filteredClientes?.length === 0
                ? 'No se encontraron clientes'
                : `Mostrando ${filteredClientes?.length || 0} clientes`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <ClienteModal
        open={modalOpen}
        mode={modalMode}
        cliente={selectedCliente}
        onClose={handleCloseModal}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default ClientesListing;
