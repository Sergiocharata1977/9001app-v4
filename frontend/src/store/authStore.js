import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '../services/api/authApi';

/**
 * Store de autenticación refactorizado
 */
const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Acciones
        login: async (credentials) => {
          try {
            console.log('🔐 Iniciando login con credenciales:', { email: credentials.email });
            set({ isLoading: true, error: null });
            const response = await authApi.login(credentials);

            // Backend responde: { success, message, data: { user, tokens: { accessToken, refreshToken } } }
            const body = response?.data || {};
            const rawUser = body?.data?.user || body?.user || null;
            const accessToken = body?.data?.tokens?.accessToken || body?.token || null;
            const refreshToken = body?.data?.tokens?.refreshToken || body?.refreshToken || null;

            console.log('📦 Respuesta del backend:', { 
              hasUser: !!rawUser, 
              hasToken: !!accessToken,
              userRole: rawUser?.role,
              userOrg: rawUser?.organization_name
            });

            if (!rawUser || !accessToken) {
              throw new Error('Respuesta de login inválida');
            }

            // Normalizar shape de usuario para compatibilidad con código legado
            const user = {
              ...rawUser,
              organization_id: rawUser.organization_id || rawUser.organization?.id || rawUser.organizationId || null,
              organization_name: rawUser.organization_name || rawUser.organization?.name || null,
              organization_plan: rawUser.organization_plan || rawUser.organization?.plan || null,
            };

            console.log('👤 Usuario normalizado:', {
              id: user.id,
              email: user.email,
              role: user.role,
              organization_id: user.organization_id,
              organization_name: user.organization_name
            });

            // Guardar en localStorage inmediatamente
            localStorage.setItem('token', accessToken);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }

            // Actualizar estado de forma síncrona para evitar delays
            set({
              user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false
            });

            console.log('✅ Login exitoso, estado actualizado');
            return body?.data || body;
          } catch (error) {
            console.error('❌ Error en login:', error);
            set({
              error: error.response?.data?.message || error.message || 'Error al iniciar sesión',
              isLoading: false
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            await authApi.logout();
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          } finally {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null
            });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        },

        register: async (userData) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authApi.register(userData);
            set({ isLoading: false });
            return response.data;
          } catch (error) {
            set({
              error: error.response?.data?.message || 'Error al registrar usuario',
              isLoading: false
            });
            throw error;
          }
        },

        verifyToken: async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              set({ isAuthenticated: false });
              return false;
            }

            const response = await authApi.verifyToken();
            const rawUser = response.data.user;
            
            // Normalizar shape de usuario para compatibilidad con código legado
            const user = {
              ...rawUser,
              organization_id: rawUser.organization_id || rawUser.organization?.id || rawUser.organizationId || null,
              organization_name: rawUser.organization_name || rawUser.organization?.name || null,
              organization_plan: rawUser.organization_plan || rawUser.organization?.plan || null,
            };
            
            set({
              user,
              token,
              isAuthenticated: true
            });
            return true;
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false
            });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return false;
          }
        },

        updateUser: (userData) => {
          set((state) => ({
            user: { ...state.user, ...userData }
          }));
        },

        clearError: () => set({ error: null }),

        // Función para obtener token válido
        getValidToken: async () => {
          const state = get();
          if (state.token) {
            return state.token;
          }
          
          const localToken = localStorage.getItem('token');
          if (localToken) {
            // Actualizar el estado con el token del localStorage
            set((state) => ({
              ...state,
              token: localToken
            }));
            return localToken;
          }
          
          return null;
        },

        // Función para refrescar el token de acceso
        refreshAccessToken: async () => {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No hay refresh token disponible');
            }

            const response = await authApi.refreshToken({ refreshToken });
            // Backend responde: { success, data: { accessToken } }
            const newToken = response?.data?.data?.accessToken;
            if (!newToken) {
              throw new Error('No se pudo obtener nuevo access token');
            }

            set((state) => ({
              token: newToken,
              user: state.user,
              isAuthenticated: true
            }));
            
            localStorage.setItem('token', newToken);
            return newToken;
          } catch (error) {
            console.error('Error al refrescar token:', error);
            // Si falla el refresh, hacer logout
            get().logout();
            throw error;
          }
        },

        // Función para inicializar la autenticación (verificar token al cargar)
        initializeAuth: async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              set({ isAuthenticated: false, isLoading: false });
              return false;
            }

            set({ isLoading: true });
            console.log('🔍 Llamando a verifyToken...');
            const response = await authApi.verifyToken();
            console.log('📦 Respuesta completa de verifyToken:', response);
            console.log('📦 response.data:', response.data);
            
            const rawUser = response.data?.user;
            console.log('👤 rawUser extraído:', rawUser);
            
            // Verificar que rawUser existe antes de procesarlo
            if (!rawUser) {
              console.error('❌ rawUser es null o undefined');
              throw new Error('No se recibieron datos de usuario válidos');
            }
            
            // Normalizar shape de usuario para compatibilidad con código legado
            const user = {
              ...rawUser,
              organization_id: rawUser.organization_id || rawUser.organization?.id || rawUser.organizationId || null,
              organization_name: rawUser.organization_name || rawUser.organization?.name || null,
              organization_plan: rawUser.organization_plan || rawUser.organization?.plan || null,
            };
            
            console.log('✅ Usuario normalizado:', user);
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          } catch (error) {
            console.error('❌ Error en initializeAuth:', error);
            console.warn('Token inválido, limpiando sesión:', error);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return false;
          }
        },

        // Función para obtener el ID de la organización del usuario actual
        getOrganizationId: () => {
          const state = get();
          return state.user?.organization_id || null;
        },

        // Función para obtener el rol del usuario actual
        getUserRole: () => {
          const state = get();
          return state.user?.role || null;
        },

        // Función para verificar si el usuario es super admin
        isSuperAdmin: () => {
          const state = get();
          return state.user?.role === 'super_admin';
        },

        // Función para verificar si el usuario es admin de organización
        isOrganizationAdmin: () => {
          const state = get();
          return state.user?.role === 'admin';
        },

        // Utilidades
        reset: () => {
            set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Exportación por defecto para compatibilidad
export default useAuthStore;

// Exportación nombrada para uso específico
export { useAuthStore };

// Exportación nombrada para compatibilidad con código existente
export const authStore = useAuthStore;