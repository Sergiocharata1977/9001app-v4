import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff
} from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const TenantDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'passed' | 'failed'>('pending');

  const runVerification = async () => {
    setIsLoading(true);
    try {
      // Ejecutar suite de verificación
      const results = await TenantVerificationService.runFullVerificationSuite();
      setTestResults(results.tests);
      setOverallStatus(results.passed ? 'passed' : 'failed');

      // Obtener datos de verificación detallados
      const verification = await TenantVerificationService.verifyTenantIsolation();
      setVerificationData(verification);
    } catch (error) {
      console.error('Error en verificación:', error);
      setOverallStatus('failed');
      setTestResults([{
        name: 'Error de Sistema',
        passed: false,
        message: 'No se pudo completar la verificación'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      runVerification();
    }
  }, [isVisible]);

  const getStatusColor = (status: 'pending' | 'passed' | 'failed') => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: 'pending' | 'passed' | 'failed') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        title="Abrir Panel de Debug Multitenant"
      >
        <Shield className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${getStatusColor(overallStatus)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <h3 className="font-semibold text-lg">Debug Multitenant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runVerification}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Reejecutar verificación"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm">
          Estado: <span className="font-semibold">
            {overallStatus === 'passed' ? '✅ Verificado' : 
             overallStatus === 'failed' ? '❌ Falló' : '⏳ Verificando...'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[60vh]">
        {/* Test Results */}
        <div className="p-4 border-b">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Resultados de Verificación
          </h4>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {test.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{test.name}</div>
                  <div className="text-xs text-gray-600">{test.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Data */}
        {verificationData && (
          <>
            {/* Tenant Info */}
            <div className="p-4 border-b">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Información del Tenant
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenant Actual:</span>
                  <span className="font-medium">{verificationData.currentTenant || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Es Super Admin:</span>
                  <span className="font-medium">
                    {verificationData.isSuperAdmin ? '✅ Sí' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organizaciones Accesibles:</span>
                  <span className="font-medium">
                    {verificationData.accessibleOrganizations.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Access Stats */}
            <div className="p-4 border-b">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Datos Accesibles
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Personal</div>
                  <div className="font-semibold">{verificationData.accessibleData.totalPersonal}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Departamentos</div>
                  <div className="font-semibold">{verificationData.accessibleData.totalDepartamentos}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Puestos</div>
                  <div className="font-semibold">{verificationData.accessibleData.totalPuestos}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600 text-xs">Usuarios</div>
                  <div className="font-semibold">{verificationData.accessibleData.totalUsers}</div>
                </div>
              </div>
            </div>

            {/* Organizations List */}
            {verificationData.accessibleOrganizations.length > 0 && (
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Organizaciones Visibles
                </h4>
                <div className="space-y-2">
                  {verificationData.accessibleOrganizations.map((org: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{org.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          org.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {org.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        ID: {org.id} | Plan: {org.plan}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3" />
          Sistema Multitenant - Verificación de Aislamiento
        </div>
      </div>
    </div>
  );
};

export default TenantDebugPanel;
