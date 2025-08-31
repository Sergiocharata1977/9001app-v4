import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Users, Calendar, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

interface Organization {
  _id: string;
  name: string;
  plan: string;
  is_active: boolean;
  created_at: string;
  stats: {
    personalCount: number;
    departamentosCount: number;
    puestosCount: number;
    usersCount: number;
  };
}

const OrganizationsManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await fetch('/api/organizations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrganizations(data.data.organizations);
        console.log('🏢 Organizaciones cargadas:', data.data.organizations);
      } else {
        setError(data.message || 'Error al cargar organizaciones');
      }
    } catch (error) {
      console.error('Error cargando organizaciones:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      enterprise: 'text-purple-700 bg-purple-100',
      premium: 'text-blue-700 bg-blue-100',
      basic: 'text-green-700 bg-green-100'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${planColors[plan as keyof typeof planColors] || planColors.basic}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
        isActive 
          ? 'text-green-700 bg-green-100' 
          : 'text-red-700 bg-red-100'
      }`}>
        {isActive ? 'Activa' : 'Inactiva'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando organizaciones...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOrganizations}>Reintentar</Button>
        </div>
      </div>
    );
  }

  const activeOrganizations = organizations.filter(org => org.is_active);
  const totalUsers = organizations.reduce((sum, org) => sum + org.stats.usersCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Organizaciones</h1>
          <p className="text-gray-600 mt-2">Administra todas las organizaciones del sistema</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Organización
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeOrganizations.length} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Promedio por organización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.stats.personalCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Empleados registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Organizaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Organizaciones Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {organizations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay organizaciones registradas
              </div>
            ) : (
              organizations.map((org) => (
                <div key={org._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{org.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getPlanBadge(org.plan)}
                        {getStatusBadge(org.is_active)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {org.stats.usersCount} usuarios
                      </div>
                      <div className="text-xs text-gray-500">
                        {org.stats.personalCount} personal
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsManagement;
