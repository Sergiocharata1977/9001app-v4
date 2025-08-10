import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Store principal de la aplicación
 */
export const useAppStore = create(
  devtools(
    (set, get) => ({
      // Estado global
      isLoading: false,
      error: null,
      notifications: [],

      // Acciones
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Notificaciones
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id: Date.now() }]
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Utilidades
      reset: () => set({ isLoading: false, error: null, notifications: [] })
    }),
    {
      name: 'app-store'
    }
  )
); 