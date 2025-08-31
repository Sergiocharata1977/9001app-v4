import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import TenantVerificationService from '../services/TenantVerificationService';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Database,
  Lock,
  Users,
  Building2,
  Activity,
  BarChart3,
  TrendingUp,
  Server,
  Globe,
  Key
} from 'lucide-react';

interface VerificationData {
  isValid: boolean;
  userIsolation: boolean;
  dataIsolation: boolean;
  permissionIsolation: boolean;
  crossContamination: boolean;
  currentTenant: string;
  isSuperAdmin: boolean;
  accessibleOrganizations: Array<{
    id: string;
    name: string;
    plan: string;
    is_active: boolean;
  }>;
  accessibleData: {
    totalOrganizations: number;
    totalPersonal: number;
    totalDepartamentos: number;
    totalPuestos: number;
    totalUsers: number;
  };
}

const MultitenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadVerificationData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await TenantVerificationService.verifyTenantIsolation();
      setVerificationData(data);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos de verificación');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationData();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadVerificationData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-600" />;
  };

  if (isLoading && !verificationData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de verificación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-semibold mb-2">Error al cargar datos</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={loadVerificationData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard de Verificación Multitenant
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema de monitoreo y verificación del aislamiento de datos
                </p>
              </div>
            </div>
            <button
              onClick={loadVerificationData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Estado: {verificationData?.isValid ? 
                <span className="text-green-600 font-semibold">✅ Verificado</span> : 
                <span className="text-red-600 font-semibold">❌ Con Problemas</span>
              }
            </span>
            <span>•</span>
            <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Usuario Actual */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                user?.is_super_admin ? 'bg-purple-100 text-purple-700' : 
                user?.is_admin ? 'bg-blue-100 text-blue-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-gray-600">Usuario</p>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
          </div>

          {/* Organización */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Activa
              </span>
            </div>
            <p className="text-sm text-gray-600">Organización</p>
            <p className="text-lg font-semibold text-gray-900">
              {verificationData?.currentTenant || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Plan: {user?.organization_plan}
            </p>
          </div>

          {/* Datos Accesibles */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Datos Totales</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-gray-500">Personal</p>
                <p className="text-sm font-semibold">
                  {verificationData?.accessibleData.totalPersonal || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Deptos</p>
                <p className="text-sm font-semibold">
                  {verificationData?.accessibleData.totalDepartamentos || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Organizaciones Visibles */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <Key className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Orgs Visibles</p>
            <p className="text-2xl font-bold text-gray-900">
              {verificationData?.accessibleOrganizations.length || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {verificationData?.isSuperAdmin ? 'Acceso Total' : 'Acceso Limitado'}
            </p>
          </div>
        </div>

        {/* Tests de Verificación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Panel de Tests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Tests de Aislamiento
            </h2>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border ${getStatusColor(verificationData?.userIsolation || false)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationData?.userIsolation || false)}
                    <span className="font-medium">Aislamiento de Usuario</span>
                  </div>
                  <span className="text-sm">
                    {verificationData?.userIsolation ? 'Pasó' : 'Falló'}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Verifica que el usuario solo accede a sus datos autorizados
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${getStatusColor(verificationData?.dataIsolation || false)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationData?.dataIsolation || false)}
                    <span className="font-medium">Aislamiento de Datos</span>
                  </div>
                  <span className="text-sm">
                    {verificationData?.dataIsolation ? 'Pasó' : 'Falló'}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Confirma que los datos están correctamente segregados por organización
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${getStatusColor(verificationData?.permissionIsolation || false)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationData?.permissionIsolation || false)}
                    <span className="font-medium">Aislamiento de Permisos</span>
                  </div>
                  <span className="text-sm">
                    {verificationData?.permissionIsolation ? 'Pasó' : 'Falló'}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Valida que los permisos están aplicados correctamente
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${getStatusColor(!verificationData?.crossContamination)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!verificationData?.crossContamination)}
                    <span className="font-medium">Sin Contaminación Cruzada</span>
                  </div>
                  <span className="text-sm">
                    {!verificationData?.crossContamination ? 'Pasó' : 'Falló'}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  Asegura que no hay filtración de datos entre organizaciones
                </p>
              </div>
            </div>
          </div>

          {/* Organizaciones Accesibles */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Organizaciones Accesibles
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {verificationData?.accessibleOrganizations.map((org, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{org.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      org.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {org.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>ID: {org.id}</span>
                    <span>•</span>
                    <span>Plan: {org.plan}</span>
                  </div>
                </div>
              ))}
              {verificationData?.accessibleOrganizations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay organizaciones accesibles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Estadísticas del Sistema
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Server className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {verificationData?.accessibleData.totalOrganizations || 0}
              </p>
              <p className="text-xs text-gray-600">Organizaciones</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {verificationData?.accessibleData.totalUsers || 0}
              </p>
              <p className="text-xs text-gray-600">Usuarios</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {verificationData?.accessibleData.totalPersonal || 0}
              </p>
              <p className="text-xs text-gray-600">Personal</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Building2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {verificationData?.accessibleData.totalDepartamentos || 0}
              </p>
              <p className="text-xs text-gray-600">Departamentos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Database className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {verificationData?.accessibleData.totalPuestos || 0}
              </p>
              <p className="text-xs text-gray-600">Puestos</p>
            </div>
          </div>
        </div>

        {/* Footer con información del sistema */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sistema Multitenant v1.0 - Modo: {verificationData?.isSuperAdmin ? 'Super Administrador' : 'Usuario Regular'}</p>
          <p>Nivel de Aislamiento: ROW_LEVEL | Campo Tenant: organization_id</p>
        </div>
      </div>
    </div>
  );
};

export default MultitenantDashboard;
