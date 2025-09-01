import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';
import CreateOrganizationModal from './CreateOrganizationModal';
import OrganizationDetailsModal from './OrganizationDetailsModal';

const OrganizationsManagement: React.FC = () => {
  const {
    organizations,
    isLoading,
    error,
    fetchOrganizations,
    updateOrganization,
    deleteOrganization,
    selectOrganization,
    clearError
  } = useSuperAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  
  useEffect(() => {
    fetchOrganizations();
  }, []);
  
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || org.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });
  
  const handleViewDetails = (org: any) => {
    setSelectedOrg(org);
    selectOrganization(org);
    setShowDetailsModal(true);
  };
  
  const handleToggleStatus = async (org: any) => {
    try {
      await updateOrganization(org.id, { is_active: !org.is_active });
      await fetchOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };
  
  const handleDelete = async (orgId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta organización?')) {
      try {
        await deleteOrganization(orgId);
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };
  
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-600';
      case 'professional':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  if (isLoading && organizations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando organizaciones...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-900 min-h-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestión de Organizaciones
          </h1>
          <p className="text-gray-400">
            Administra todas las organizaciones del sistema
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Organización</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar organizaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">Todos los planes</option>
            <option value="basic">Basic</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center justify-between">
          <p className="text-red-400">{error}</p>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Organizations Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Organización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Usuarios
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Personal
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {org.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {org.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPlanBadgeColor(org.plan)}`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">
                        {org.stats?.usersCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white">
                      {org.stats?.personalCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {org.is_active ? (
                      <span className="flex items-center justify-center space-x-1 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Activo</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-1 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs">Inactivo</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(org)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(org)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title={org.is_active ? 'Desactivar' : 'Activar'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrganizations.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron organizaciones</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchOrganizations();
          }}
        />
      )}
      
      {showDetailsModal && selectedOrg && (
        <OrganizationDetailsModal
          organization={selectedOrg}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrg(null);
          }}
        />
      )}
    </div>
  );
};

export default OrganizationsManagement;

