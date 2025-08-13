import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Settings, 
  Activity, 
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Building2,
  Save
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import useAuthStore from '@/store/authStore';
import UserModal from './UserModal';

const OrganizationAdminPanel = () => {
  const authStore = useAuthStore();
  const [users, setUsers] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [organizationForm, setOrganizationForm] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const organizationId = authStore.getOrganizationId();
      
      const [usersResponse, orgResponse] = await Promise.all([
        adminService.getOrganizationUsers(organizationId),
        adminService.getOrganizationById(organizationId)
      ]);
      
      setUsers(usersResponse.data.data || []);
      setOrganization(orgResponse.data.data || {});
      setOrganizationForm({
        name: orgResponse.data.data?.name || '',
        email: orgResponse.data.data?.email || '',
        phone: orgResponse.data.data?.phone || '',
        plan: orgResponse.data.data?.plan || 'basic'
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserSuccess = () => {
    loadData();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const organizationId = authStore.getOrganizationId();
        await adminService.deleteOrganizationUser(organizationId, userId);
        loadData();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleUpdateOrganization = async () => {
    try {
      const organizationId = authStore.getOrganizationId();
      await adminService.updateOrganization(organizationId, organizationForm);
      loadData();
      alert('Organización actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando organización:', error);
      alert('Error al actualizar organización');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { color: 'bg-blue-100 text-blue-800', icon: UserCheck },
      'manager': { color: 'bg-green-100 text-green-800', icon: Users },
      'employee': { color: 'bg-gray-100 text-gray-800', icon: Users }
    };
    
    const config = roleConfig[role] || roleConfig.employee;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => (
    <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administración de Organización
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {organization?.name} - Gestión de usuarios y configuración
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="font-medium">{organization?.name}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Usuarios de la Organización ({users.length})</CardTitle>
              <Button onClick={handleCreateUser}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.is_active)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay usuarios en esta organización
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Organización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de la Organización</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-md"
                      value={organizationForm.name}
                      onChange={(e) => setOrganizationForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email de Contacto</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded-md"
                      value={organizationForm.email}
                      onChange={(e) => setOrganizationForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border rounded-md"
                      value={organizationForm.phone}
                      onChange={(e) => setOrganizationForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plan</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={organizationForm.plan}
                      onChange={(e) => setOrganizationForm(prev => ({ ...prev, plan: e.target.value }))}
                    >
                      <option value="basic">Básico</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Empresarial</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handleUpdateOrganization} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usuario registrado</p>
                      <p className="text-sm text-gray-600">Juan Pérez se registró en el sistema</p>
                    </div>
                    <span className="text-sm text-gray-500">Hace 2 horas</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auditoría completada</p>
                      <p className="text-sm text-gray-600">Auditoría interna de calidad finalizada</p>
                    </div>
                    <span className="text-sm text-gray-500">Hace 1 día</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para crear/editar usuarios */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        organizations={[organization]}
        onSuccess={handleUserSuccess}
        isOrganizationAdmin={true}
      />
    </div>
  );
};

export default OrganizationAdminPanel; 