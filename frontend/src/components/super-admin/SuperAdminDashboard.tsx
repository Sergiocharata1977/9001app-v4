import React, { useEffect } from 'react';
import {
  Building2,
  Users,
  FileText,
  FolderOpen,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSuperAdmin } from '../../hooks/useSuperAdmin';

const SuperAdminDashboard: React.FC = () => {
  const {
    dashboardStats,
    isLoading,
    error,
    fetchDashboardStats,
    clearError
  } = useSuperAdmin();
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  if (isLoading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  const stats = dashboardStats || {
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalPersonal: 0,
    totalDepartamentos: 0,
    totalPuestos: 0,
    totalDocumentos: 0,
    organizationsByPlan: {},
    recentActivity: []
  };
  
  const statCards = [
    {
      title: 'Organizaciones Totales',
      value: stats.totalOrganizations,
      icon: Building2,
      color: 'bg-blue-600',
      subtitle: `${stats.activeOrganizations} activas`
    },
    {
      title: 'Usuarios Totales',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-600',
      subtitle: `${stats.activeUsers} activos`
    },
    {
      title: 'Personal Registrado',
      value: stats.totalPersonal,
      icon: Users,
      color: 'bg-purple-600',
      subtitle: 'En todas las organizaciones'
    },
    {
      title: 'Documentos',
      value: stats.totalDocumentos,
      icon: FileText,
      color: 'bg-yellow-600',
      subtitle: 'Total en el sistema'
    }
  ];
  
  return (
    <div className="p-6 bg-gray-900 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Super Admin
        </h1>
        <p className="text-gray-400">
          Vista general del sistema multi-tenant
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizations by Plan */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Organizaciones por Plan
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.organizationsByPlan).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    plan === 'enterprise' ? 'bg-purple-500' :
                    plan === 'professional' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-gray-300 capitalize">{plan}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{count}</span>
                  <span className="text-gray-500 text-sm">
                    ({Math.round((count / stats.totalOrganizations) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="mt-1">
                    {activity.type === 'user_created' ? (
                      <Users className="w-4 h-4 text-green-400" />
                    ) : activity.type === 'org_created' ? (
                      <Building2 className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay actividad reciente
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* System Stats */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          Estadísticas del Sistema
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalDepartamentos}
            </p>
            <p className="text-gray-400 text-sm">Departamentos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {stats.totalPuestos}
            </p>
            <p className="text-gray-400 text-sm">Puestos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {stats.activeOrganizations}
            </p>
            <p className="text-gray-400 text-sm">Orgs Activas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {stats.activeUsers}
            </p>
            <p className="text-gray-400 text-sm">Usuarios Activos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

