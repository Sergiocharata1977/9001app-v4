import apiClient from './apiClient';

class FeatureService {
  // Obtener features de una organización
  async getOrganizationFeatures(organizationId) {
    try {
      console.log('🔄 [FeatureService] Obteniendo features de organización...');
      const response = await apiClient.get(`/admin/organization/${organizationId}/features`);
      console.log('📡 [FeatureService] Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [FeatureService] Error obteniendo features:', error);
      throw error;
    }
  }

  // Actualizar features de una organización
  async updateOrganizationFeatures(organizationId, features) {
    try {
      console.log('🔄 [FeatureService] Actualizando features de organización...');
      const response = await apiClient.put(`/admin/organization/${organizationId}/features`, { features });
      console.log('📡 [FeatureService] Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [FeatureService] Error actualizando features:', error);
      throw error;
    }
  }

  // Obtener permisos de usuarios por feature
  async getUserFeaturePermissions(organizationId, featureName = null) {
    try {
      console.log('🔄 [FeatureService] Obteniendo permisos de usuarios...');
      const params = featureName ? { feature_name: featureName } : {};
      const response = await apiClient.get(`/admin/organization/${organizationId}/feature-permissions`, { params });
      console.log('📡 [FeatureService] Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [FeatureService] Error obteniendo permisos:', error);
      throw error;
    }
  }

  // Asignar permisos de usuarios por feature
  async assignUserFeaturePermissions(organizationId, featureName, userIds) {
    try {
      console.log('🔄 [FeatureService] Asignando permisos de usuarios...');
      const response = await apiClient.post(`/admin/organization/${organizationId}/feature-permissions`, {
        feature_name: featureName,
        user_ids: userIds
      });
      console.log('📡 [FeatureService] Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [FeatureService] Error asignando permisos:', error);
      throw error;
    }
  }

  // Verificar si el usuario actual tiene acceso a una feature
  async checkUserFeatureAccess(featureName) {
    try {
      // Esta función verifica si el usuario actual tiene acceso a una feature específica
      // Se puede usar para mostrar/ocultar elementos del menú
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return false;

      // Super admin tiene acceso total
      if (user.role === 'super_admin') return true;

      // Admin de organización tiene acceso a todas las features
      if (user.role === 'admin') return true;

      // Para otros roles, verificar permisos específicos
      const response = await apiClient.get(`/admin/organization/${user.organization_id}/feature-permissions`, {
        params: { feature_name: featureName }
      });

      const userPermissions = response.data.data;
      return userPermissions.some(permission => permission.user_id === user.id);
    } catch (error) {
      console.error('❌ [FeatureService] Error verificando acceso:', error);
      return false;
    }
  }

  // Obtener features disponibles para el usuario actual
  async getAvailableFeatures() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return [];

      // Super admin ve todas las features
      if (user.role === 'super_admin') {
        const response = await apiClient.get(`/admin/organization/${user.organization_id}/features`);
        return response.data.data.filter(feature => feature.is_enabled);
      }

      // Admin de organización ve todas las features habilitadas
      if (user.role === 'admin') {
        const response = await apiClient.get(`/admin/organization/${user.organization_id}/features`);
        return response.data.data.filter(feature => feature.is_enabled);
      }

      // Para otros roles, verificar permisos específicos
      const response = await apiClient.get(`/admin/organization/${user.organization_id}/feature-permissions`);
      const userPermissions = response.data.data;
      
      // Obtener features únicas a las que tiene acceso
      const accessibleFeatures = [...new Set(userPermissions.map(permission => permission.feature_name))];
      
      return accessibleFeatures;
    } catch (error) {
      console.error('❌ [FeatureService] Error obteniendo features disponibles:', error);
      return [];
    }
  }
}

export default new FeatureService();
