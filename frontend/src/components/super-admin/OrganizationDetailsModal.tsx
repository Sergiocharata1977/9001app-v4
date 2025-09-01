import React, { useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  FileText,
  FolderOpen,
  Package,
  Calendar,
  Shield,
  Mail,
  Edit
} from 'lucide-react';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';

interface OrganizationDetailsModalProps {
  organization: any;
  onClose: () => void;
}

const OrganizationDetailsModal: React.FC<OrganizationDetailsModalProps> = ({
  organization,
  onClose
}) => {
  const {
    organizationUsers,
    isLoading,
    fetchOrganizationUsers,
    changeUserRole
  } = useSuperAdmin();
  
  useEffect(() => {
    if (organization) {
      fetchOrganizationUsers(organization.id);
    }
  }, [organization]);
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await changeUserRole(userId, newRole);
    } catch (error) {
      console.error('Error changing user role:', error);
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
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-red-500" />
            <div>
              <h2 className="text-xl font-bold text-white">{organization.name}</h2>
              <p className="text-sm text-gray-400">ID: {organization.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Organization Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Información General</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Plan:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPlanBadgeColor(organization.plan)}`}>
                    {organization.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Estado:</span>
                  <span className={`text-sm ${organization.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {organization.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Creado:</span>
                  <span className="text-sm text-white">
                    {new Date(organization.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Estadísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {organization.stats?.usersCount || 0}
                    </p>
                    <p className="text-xs text-gray-400">Usuarios</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {organization.stats?.personalCount || 0}
                    </p>
                    <p className="text-xs text-gray-400">Personal</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {organization.stats?.departamentosCount || 0}
                    </p>
                    <p className="text-xs text-gray-400">Departamentos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {organization.stats?.documentosCount || 0}
                    </p>
                    <p className="text-xs text-gray-400">Documentos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Users Table */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Usuarios de la Organización
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                <p className="text-gray-400">Cargando usuarios...</p>
              </div>
            ) : organizationUsers.length > 0 ? (
              <div className="bg-gray-700/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                        Usuario
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                        Rol
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {organizationUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white">{user.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-300">{user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                            <option value="user">User</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-700/50 rounded-lg">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No hay usuarios en esta organización</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsModal;

