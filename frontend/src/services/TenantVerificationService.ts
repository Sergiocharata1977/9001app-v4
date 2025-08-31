import axios from 'axios';

interface VerificationResult {
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

class TenantVerificationService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.token = localStorage.getItem('token');
  }

  /**
   * Verificar el aislamiento del tenant actual
   */
  async verifyTenantIsolation(): Promise<VerificationResult> {
    try {
      const response = await axios.get(`${this.baseURL}/organizations/verify-tenant`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.data.success) {
        const data = response.data.data;
        const tests = data.verificationTests;
        
        return {
          isValid: tests.userIsolation && tests.dataIsolation && tests.permissionIsolation && !tests.crossContamination,
          userIsolation: tests.userIsolation,
          dataIsolation: tests.dataIsolation,
          permissionIsolation: tests.permissionIsolation,
          crossContamination: tests.crossContamination,
          currentTenant: data.tenantInfo.currentTenant,
          isSuperAdmin: data.tenantInfo.isSuperAdmin,
          accessibleOrganizations: data.accessibleOrganizations,
          accessibleData: data.accessibleData
        };
      }

      throw new Error('Verificación fallida');
    } catch (error) {
      console.error('Error verificando tenant:', error);
      throw error;
    }
  }

  /**
   * Obtener información detallada de una organización
   */
  async getOrganizationDetails(organizationId: string) {
    try {
      const response = await axios.get(`${this.baseURL}/organizations/${organizationId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.data.success) {
        return response.data.data.organization;
      }

      throw new Error('No se pudo obtener la organización');
    } catch (error) {
      console.error('Error obteniendo organización:', error);
      throw error;
    }
  }

  /**
   * Verificar acceso a datos de otra organización (para testing)
   */
  async testCrossOrganizationAccess(targetOrgId: string): Promise<boolean> {
    try {
      await this.getOrganizationDetails(targetOrgId);
      return true; // Si puede acceder, retorna true
    } catch (error: any) {
      if (error.response?.status === 403) {
        return false; // Acceso denegado correctamente
      }
      throw error;
    }
  }

  /**
   * Obtener todas las organizaciones (solo super_admin)
   */
  async getAllOrganizations() {
    try {
      const response = await axios.get(`${this.baseURL}/organizations`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.data.success) {
        return response.data.data.organizations;
      }

      return [];
    } catch (error: any) {
      if (error.response?.status === 403) {
        console.log('Acceso denegado: No eres super_admin');
        return [];
      }
      throw error;
    }
  }

  /**
   * Ejecutar suite completa de verificación
   */
  async runFullVerificationSuite(): Promise<{
    passed: boolean;
    tests: Array<{
      name: string;
      passed: boolean;
      message: string;
    }>;
  }> {
    const tests = [];
    let allPassed = true;

    try {
      // Test 1: Verificación básica de aislamiento
      const isolation = await this.verifyTenantIsolation();
      tests.push({
        name: 'Aislamiento de Usuario',
        passed: isolation.userIsolation,
        message: isolation.userIsolation ? 'Usuario correctamente aislado' : 'Fallo en aislamiento de usuario'
      });
      tests.push({
        name: 'Aislamiento de Datos',
        passed: isolation.dataIsolation,
        message: isolation.dataIsolation ? 'Datos correctamente aislados' : 'Fallo en aislamiento de datos'
      });
      tests.push({
        name: 'Aislamiento de Permisos',
        passed: isolation.permissionIsolation,
        message: isolation.permissionIsolation ? 'Permisos correctamente aislados' : 'Fallo en aislamiento de permisos'
      });
      tests.push({
        name: 'Sin Contaminación Cruzada',
        passed: !isolation.crossContamination,
        message: !isolation.crossContamination ? 'No hay contaminación cruzada' : 'Detectada contaminación cruzada de datos'
      });

      // Test 2: Verificar acceso según rol
      if (isolation.isSuperAdmin) {
        tests.push({
          name: 'Acceso Super Admin',
          passed: isolation.accessibleOrganizations.length > 1,
          message: `Super Admin puede ver ${isolation.accessibleOrganizations.length} organizaciones`
        });
      } else {
        tests.push({
          name: 'Acceso Restringido',
          passed: isolation.accessibleOrganizations.length === 1,
          message: isolation.accessibleOrganizations.length === 1 ? 
            'Usuario solo ve su organización' : 
            'Error: Usuario ve múltiples organizaciones'
        });
      }

      // Test 3: Verificar datos accesibles
      tests.push({
        name: 'Datos Accesibles',
        passed: isolation.accessibleData.totalPersonal >= 0,
        message: `Acceso a ${isolation.accessibleData.totalPersonal} registros de personal`
      });

      // Calcular resultado final
      allPassed = tests.every(test => test.passed);

    } catch (error) {
      tests.push({
        name: 'Error en Verificación',
        passed: false,
        message: `Error: ${error}`
      });
      allPassed = false;
    }

    return {
      passed: allPassed,
      tests
    };
  }

  /**
   * Actualizar token de autenticación
   */
  updateToken(newToken: string) {
    this.token = newToken;
  }
}

export default new TenantVerificationService();
