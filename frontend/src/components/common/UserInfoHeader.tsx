import React from 'react';
import useAuthStore from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, Shield, AlertTriangle } from 'lucide-react';

const UserInfoHeader: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Card className="mb-4 border-yellow-200 bg-yellow-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Cargando información de usuario...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="mb-4 border-red-200 bg-red-50">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">No autenticado - Por favor inicia sesión</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUserType = () => {
    if (user.role === 'super_admin') return 'Super Administrador';
    if (user.role === 'admin') return 'Administrador';
    if (user.role === 'manager') return 'Gerente';
    if (user.role === 'user') return 'Usuario';
    return 'Empleado';
  };

  const getOrganizationName = () => {
    if (user.organization_name) return user.organization_name;
    if (user.organization?.name) return user.organization.name;
    return 'Organización no identificada';
  };

  const getOrganizationId = () => {
    return user.organization_id || user.organizationId || user.org_id || 'No disponible';
  };

  const isSuperAdmin = user.role === 'super_admin';
  const hasOrganizationId = !!(user.organization_id || user.organizationId || user.org_id);

  return (
    <Card className={`mb-4 ${isSuperAdmin ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className={`h-5 w-5 ${isSuperAdmin ? 'text-blue-600' : 'text-green-600'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {user.name || user.nombre || user.email}
                </span>
                <Badge variant={isSuperAdmin ? "default" : "secondary"}>
                  {getUserType()}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building className={`h-5 w-5 ${isSuperAdmin ? 'text-blue-600' : 'text-green-600'}`} />
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {getOrganizationName()}
                </div>
                <div className="text-sm text-gray-600">
                  ID: {getOrganizationId()}
                </div>
              </div>
            </div>

            {isSuperAdmin && (
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <Badge variant="default" className="text-xs">SUPER ADMIN</Badge>
              </div>
            )}

            {!hasOrganizationId && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <Badge variant="destructive" className="text-xs">SIN ORG ID</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div><span className="font-medium">User ID:</span> {user._id || user.id || 'N/A'}</div>
            <div><span className="font-medium">Role:</span> {user.role || 'N/A'}</div>
            <div><span className="font-medium">Org ID Type:</span> {typeof getOrganizationId()}</div>
            <div>
              <span className="font-medium">Status:</span> 
              <Badge variant={hasOrganizationId ? "default" : "destructive"} className="ml-1 text-xs">
                {hasOrganizationId ? "OK" : "ERROR"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoHeader;
