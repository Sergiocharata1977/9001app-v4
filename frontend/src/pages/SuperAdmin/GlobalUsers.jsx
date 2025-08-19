import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield,
  Building2,
  Mail,
  Calendar
} from 'lucide-react';

const GlobalUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de usuarios
    setUsers([
      {
        id: 1,
        name: 'Super Administrador',
        email: 'super_admin@isoflow.com',
        role: 'super_admin',
        organization: 'ISOFlow3 Platform',
        status: 'active',
        lastLogin: '2024-08-16T10:30:00',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Admin Demo',
        email: 'admin@demo.com',
        role: 'admin',
        organization: 'Organización Demo',
        status: 'active',
        lastLogin: '2024-08-16T09:15:00',
        createdAt: '2024-02-20'
      },
      {
        id: 3,
        name: 'Usuario Test',
        email: 'user@test.com',
        role: 'user',
        organization: 'Organización Demo',
        status: 'active',
        lastLogin: '2024-08-15T16:45:00',
        createdAt: '2024-03-10'
      }
    ]);
    setLoading(false);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-500">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500">Admin</Badge>;
      case 'user':
        return <Badge className="bg-green-500">Usuario</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactivo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspendido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión Global de Usuarios
          </h1>
          <p className="text-gray-600">
            Administra todos los usuarios del sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.status === 'active').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organizaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(users.map(user => user.organization)).size}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuarios */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Organización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Último Acceso</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Creación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          {user.organization}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.lastLogin).toLocaleString('es-ES')}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalUsers;
