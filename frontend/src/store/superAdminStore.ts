import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';

interface Organization {
  _id: string;
  id: string;
  name: string;
  plan: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  stats: {
    usersCount: number;
    personalCount: number;
    departamentosCount: number;
    puestosCount: number;
    documentosCount: number;
    procesosCount: number;
  };
}

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  totalPersonal: number;
  totalDepartamentos: number;
  totalPuestos: number;
  totalDocumentos: number;
  organizationsByPlan: Record<string, number>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
    organizationId?: string;
  }>;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization_id: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface SuperAdminStore {
  // Estado
  dashboardStats: DashboardStats | null;
  organizations: Organization[];
  selectedOrganization: Organization | null;
  organizationUsers: User[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones - Dashboard
  fetchDashboardStats: () => Promise<void>;
  
  // Acciones - Organizaciones
  fetchOrganizations: () => Promise<void>;
  createOrganization: (data: {
    name: string;
    plan: string;
    adminEmail: string;
    adminName: string;
    adminPassword: string;
  }) => Promise<void>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
  selectOrganization: (org: Organization | null) => void;
  
  // Acciones - Usuarios
  fetchOrganizationUsers: (organizationId: string) => Promise<void>;
  changeUserRole: (userId: string, role: string) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  reset: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const useSuperAdminStore = create<SuperAdminStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        dashboardStats: null,
        organizations: [],
        selectedOrganization: null,
        organizationUsers: [],
        isLoading: false,
        error: null,
        
        // Fetch Dashboard Stats
        fetchDashboardStats: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(
              `${API_BASE_URL}/super-admin/dashboard/stats`,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              set({ dashboardStats: response.data.data });
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar estadísticas';
            set({ error: errorMessage });
            console.error('Error fetching dashboard stats:', error);
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Fetch Organizations
        fetchOrganizations: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(
              `${API_BASE_URL}/super-admin/organizations`,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              set({ organizations: response.data.data });
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar organizaciones';
            set({ error: errorMessage });
            console.error('Error fetching organizations:', error);
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Create Organization
        createOrganization: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.post(
              `${API_BASE_URL}/super-admin/organizations`,
              data,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              // Recargar organizaciones
              await get().fetchOrganizations();
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear organización';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Update Organization
        updateOrganization: async (id, data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.put(
              `${API_BASE_URL}/super-admin/organizations/${id}`,
              data,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              // Actualizar la organización en el estado local
              set(state => ({
                organizations: state.organizations.map(org =>
                  org.id === id ? { ...org, ...data } : org
                )
              }));
              
              // Si es la organización seleccionada, actualizarla también
              const selected = get().selectedOrganization;
              if (selected && selected.id === id) {
                set({ selectedOrganization: { ...selected, ...data } });
              }
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar organización';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Delete Organization
        deleteOrganization: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.delete(
              `${API_BASE_URL}/super-admin/organizations/${id}`,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              // Eliminar de la lista local
              set(state => ({
                organizations: state.organizations.filter(org => org.id !== id)
              }));
              
              // Si era la seleccionada, limpiar selección
              if (get().selectedOrganization?.id === id) {
                set({ selectedOrganization: null, organizationUsers: [] });
              }
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar organización';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Select Organization
        selectOrganization: (org) => {
          set({ selectedOrganization: org, organizationUsers: [] });
          if (org) {
            get().fetchOrganizationUsers(org.id);
          }
        },
        
        // Fetch Organization Users
        fetchOrganizationUsers: async (organizationId) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(
              `${API_BASE_URL}/super-admin/organizations/${organizationId}/users`,
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              set({ organizationUsers: response.data.data });
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cargar usuarios';
            set({ error: errorMessage });
            console.error('Error fetching organization users:', error);
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Change User Role
        changeUserRole: async (userId, role) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.put(
              `${API_BASE_URL}/super-admin/users/${userId}/role`,
              { role },
              { headers: getAuthHeaders() }
            );
            
            if (response.data.success) {
              // Actualizar el rol en el estado local
              set(state => ({
                organizationUsers: state.organizationUsers.map(user =>
                  user._id === userId ? { ...user, role } : user
                )
              }));
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al cambiar rol';
            set({ error: errorMessage });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        
        // Clear Error
        clearError: () => set({ error: null }),
        
        // Reset Store
        reset: () => set({
          dashboardStats: null,
          organizations: [],
          selectedOrganization: null,
          organizationUsers: [],
          isLoading: false,
          error: null
        })
      }),
      {
        name: 'super-admin-storage',
        partialize: (state) => ({
          selectedOrganization: state.selectedOrganization
        })
      }
    )
  )
);

export default useSuperAdminStore;

