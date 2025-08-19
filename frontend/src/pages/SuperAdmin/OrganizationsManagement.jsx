import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Calendar,
  Shield
} from 'lucide-react';

const OrganizationsManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de organizaciones
    setOrganizations([
      {
        id: 1,
        name: 'ISOFlow3 Platform',
        plan: 'Enterprise',
        users: 45,
        status: 'active',
        createdAt: '2024-01-15',
        features: 28
      },
      {
        id: 2,
        name: 'Organización Demo',
        plan: 'Professional',
        users: 12,
        status: 'active',
        createdAt: '2024-02-20',
        features: 24
      },
      {
        id: 3,
        name: 'TechCorp Solutions',
        plan: 'Basic',
        users: 8,
        status: 'pending',
        createdAt: '2024-03-10',
        features: 16
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Activa</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspendida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge className="bg-purple-500">Enterprise</Badge>;
      case 'Professional':
        return <Badge className="bg-blue-500">Professional</Badge>;
      case 'Basic':
        return <Badge className="bg-gray-500">Basic</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Organizaciones
          </h1>
          <p className="text-gray-600">
            Administra todas las organizaciones del sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Organización
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Organizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organizaciones Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.filter(org => org.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organizations.reduce((sum, org) => sum + org.users, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Organizaciones */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Organizaciones Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando organizaciones...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Organización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Usuarios</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Features</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Creación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{org.name}</p>
                          <p className="text-sm text-gray-500">ID: {org.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getPlanBadge(org.plan)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          {org.users}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(org.status)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{org.features}/28</Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(org.createdAt).toLocaleDateString('es-ES')}
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

export default OrganizationsManagement;
