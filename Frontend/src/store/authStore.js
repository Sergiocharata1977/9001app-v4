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
            set({ isLoading: true, error: null });
            const response = await authApi.login(credentials);
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });

            localStorage.setItem('token', token);
            return response.data;
          } catch (error) {
            set({
              error: error.response?.data?.message || 'Error al iniciar sesión',
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
            const { user } = response.data;
            
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
            // Verificar si el token es válido
            try {
              const response = await authApi.verifyToken();
              return localToken;
            } catch (error) {
              localStorage.removeItem('token');
              return null;
            }
          }
          
          return null;
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