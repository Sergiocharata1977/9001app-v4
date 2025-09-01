import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Building2, 
  User, 
  Users, 
  Briefcase, 
  Building, 
  Shield, 
  ShieldCheck,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface OrganizationStats {
  personalCount: number;
  departamentosCount: number;
  puestosCount: number;
  usersCount?: number;
}

interface TenantInfo {
  user: {
    name: string;
    email: string;
    role: string;
    is_active: boolean;

    is_admin: boolean;
  };
  organization: {
    id: string;
    name: string;
    plan: string;
    is_active: boolean;
    stats: OrganizationStats;
  };
  isVerified: boolean;
}

const TenantInfoHeader: React.FC = () => {
  const { user } = useAuth();
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'verified' | 'error'>('checking');

  useEffect(() => {
    if (user) {
      // Construir información del tenant desde el usuario autenticado
      const info: TenantInfo = {
        user: {
          name: user.name || 'Usuario',
          email: user.email || '',
          role: user.role || 'user',
          is_active: user.is_active !== false,

          is_admin: user.is_admin === true
        },
        organization: {
          id: user.organization_code || user.organization_id || 'N/A',
          name: user.organization_name || 'Sin Organización',
          plan: user.organization_plan || 'basic',
          is_active: user.organization_active !== false,
          stats: user.organization_stats || {
            personalCount: 0,
            departamentosCount: 0,
            puestosCount: 0,
            usersCount: 0
          }
        },
        isVerified: true
      };
      
      setTenantInfo(info);
      setIsLoading(false);
      
      // Verificar el tenant en el backend
      verifyTenant();
    }
  }, [user]);

  const verifyTenant = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/organizations/verify-tenant', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.verificationTests) {
          const tests = data.data.verificationTests;
          if (tests.userIsolation && tests.dataIsolation && tests.permissionIsolation && !tests.crossContamination) {
            setVerificationStatus('verified');
          } else {
            setVerificationStatus('error');
          }
        }
      }
    } catch (error) {
      console.error('Error verificando tenant:', error);
      setVerificationStatus('error');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
            <User className="w-3 h-3" />
            Usuario
          </span>
        );
    }
  };

  const getPlanBadge = (plan: string) => {
    const planColors = {
      enterprise: 'text-purple-700 bg-purple-100',
      professional: 'text-blue-700 bg-blue-100',
      basic: 'text-gray-700 bg-gray-100'
    };

    const color = planColors[plan as keyof typeof planColors] || planColors.basic;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />;
    }
  };

  if (isLoading || !tenantInfo) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Información del Usuario */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {tenantInfo.user.name}
                  </span>
                  {getRoleBadge(tenantInfo.user.role)}
                </div>
                <span className="text-xs text-gray-500">{tenantInfo.user.email}</span>
              </div>
            </div>

            {/* Separador */}
            <div className="h-10 w-px bg-gray-300"></div>

            {/* Información de la Organización */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {tenantInfo.organization.name}
                  </span>
                  {getPlanBadge(tenantInfo.organization.plan)}
                </div>
                <span className="text-xs text-gray-500">
                  Código: {tenantInfo.organization.id}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {tenantInfo.organization.stats.personalCount}
                </span>
                <span className="text-gray-500 ml-1">Personal</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {tenantInfo.organization.stats.puestosCount}
                </span>
                <span className="text-gray-500 ml-1">Puestos</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
              <Building className="w-4 h-4 text-gray-500" />
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {tenantInfo.organization.stats.departamentosCount}
                </span>
                <span className="text-gray-500 ml-1">Deptos</span>
              </div>
            </div>

            {/* Estado de Verificación */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm">
              {getStatusIcon()}
              <span className="text-xs font-medium text-gray-600">
                {verificationStatus === 'verified' ? 'Verificado' : 
                 verificationStatus === 'error' ? 'Error' : 'Verificando...'}
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de Estado Activo */}
        {tenantInfo.user.is_active && tenantInfo.organization.is_active && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Sistema Activo</span>
            </div>
            {tenantInfo.user.is_super_admin && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-purple-700 font-medium">
                  Acceso Total al Sistema
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantInfoHeader;
