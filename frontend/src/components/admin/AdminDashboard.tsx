import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Activity, 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import useAuthStore from '@/store/authStore';

const AdminDashboard = () => {
  const authStore = useAuthStore();
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    activeUsers: 0,
    activeOrganizations: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const role = authStore.getUserRole();
      setUserRole(role);

      if (role === 'super_admin') {
        // Cargar estadísticas globales para super admin
        const [orgsResponse, usersResponse] = await Promise.all([
          adminService.getAllOrganizations(),
          adminService.getAllUsers()
        ]);

        const organizations = orgsResponse.data.data || [];
        const users = usersResponse.data.data || [];

        setStats({
          totalOrganizations: organizations.length,
          totalUsers: users.length,
          activeUsers: users.filter(u => u.is_active).length,
          activeOrganizations: organizations.filter(o => o.is_active).length,
          recentActivity: [
            { type: 'user_created', message: 'Nuevo usuario registrado', time: 'Hace 2 horas' },
            { type: 'org_updated', message: 'Organización actualizada', time: 'Hace 4 horas' },
            { type: 'audit_completed', message: 'Auditoría completada', time: 'Hace 1 día' }
          ]
        });
      } else if (role === 'admin') {
        // Cargar estadísticas de la organización para admin
        const organizationId = authStore.getOrganizationId();
        const usersResponse = await adminService.getOrganizationUsers(organizationId);
        const users = usersResponse.data.data || [];

        setStats({
          totalOrganizations: 1, // Solo su organización
          totalUsers: users.length,
          activeUsers: users.filter(u => u.is_active).length,
          activeOrganizations: 1,
          recentActivity: [
            { type: 'user_created', message: 'Nuevo empleado agregado', time: 'Hace 1 hora' },
            { type: 'audit_completed', message: 'Auditoría interna completada', time: 'Hace 3 horas' },
            { type: 'training_completed', message: 'Capacitación finalizada', time: 'Hace 1 día' }
          ]
        });
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      user_created: Users,
      org_updated: Building2,
      audit_completed: CheckCircle,
      training_completed: Shield
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colors = {
      user_created: 'text-blue-600',
      org_updated: 'text-green-600',
      audit_completed: 'text-purple-600',
      training_completed: 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando dashboard administrativo...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userRole === 'super_admin' ? 'Vista global del sistema' : 'Vista de tu organización'}
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Shield className="w-3 h-3 mr-1" />
          {userRole === 'super_admin' ? 'Super Administrador' : 'Administrador'}
        </Badge>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeOrganizations} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Actividad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Usuarios activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              En tiempo real
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium">Gestionar Usuarios</h3>
                  <p className="text-sm text-gray-500">Crear y editar usuarios</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium">Configuración</h3>
                  <p className="text-sm text-gray-500">Ajustar configuración</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-medium">Reportes</h3>
                  <p className="text-sm text-gray-500">Ver reportes del sistema</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
