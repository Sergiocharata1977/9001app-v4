import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, AxiosProgressEvent, InternalAxiosRequestConfig } from 'axios';
// @ts-ignore - módulo JS sin tipos
import useAuthStore from '../store/authStore';

// Tipos para configuración
interface RuntimeConfig {
  API_BASE_URL?: string;
}

// Tipos locales

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface ApiClient {
  get: <T = any>(endpoint?: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  post: <T = any>(endpoint?: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  put: <T = any>(endpoint?: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  delete: <T = any>(endpoint?: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  patch: <T = any>(endpoint?: string, data?: any, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
}

/**
 * Obtener la URL base de la API desde la configuración dinámica o variables de entorno
 */
const getApiBaseUrl = (): string => {
  // Primero intentar con la configuración dinámica (runtime)
  if (window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.API_BASE_URL) {
    return window.__RUNTIME_CONFIG__.API_BASE_URL;
  }
  // Fallback a variables de entorno de Vite (para desarrollo)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Valor por defecto
  return 'http://localhost:5000/api';
};

// Servicio base para llamadas HTTP al backend
const API_BASE_URL = getApiBaseUrl();

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();
    
    if (token) {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${token}`,
      } as any;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });
    
    // Si es un error 401 y no hemos intentado refrescar el token aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshAccessToken, logout } = useAuthStore.getState();
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Reintentar la petición original con el nuevo token
          originalRequest.headers = {
            ...(originalRequest.headers as any),
            Authorization: `Bearer ${newToken}`,
          } as any;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Métodos HTTP básicos
  get: <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => 
    apiClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => 
    apiClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => 
    apiClient.put<T>(url, data, config),
  
  delete: <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => 
    apiClient.delete<T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => 
    apiClient.patch<T>(url, data, config),

  // Método para configurar token manualmente (para compatibilidad)
  setAuthToken: (token: string | null): void => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  // Método para hacer peticiones con manejo de errores
  request: async <T = any>(config: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await apiClient<T>(config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Manejar errores de red
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error('La petición ha expirado. Por favor, inténtalo de nuevo.');
      }
      
      // Manejar errores HTTP
      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        const message = responseData?.message || responseData?.error || 'Error en el servidor';
        throw new Error(message);
      }
      
      // Manejar errores de red
      if (axiosError.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      }
      
      throw error;
    }
  },

  // Métodos específicos para diferentes tipos de peticiones
  fetchData: async <T = any>(endpoint: string): Promise<T> => {
    return apiService.request<T>({ method: 'GET', url: endpoint });
  },

  postData: async <T = any>(endpoint: string, data: any): Promise<T> => {
    return apiService.request<T>({ method: 'POST', url: endpoint, data });
  },

  putData: async <T = any>(endpoint: string, data: any): Promise<T> => {
    return apiService.request<T>({ method: 'PUT', url: endpoint, data });
  },

  deleteData: async <T = any>(endpoint: string): Promise<T> => {
    return apiService.request<T>({ method: 'DELETE', url: endpoint });
  },

  // Método para subir archivos
  uploadFile: async <T = any>(
    endpoint: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<T> => {
    return apiService.request<T>({
      method: 'POST',
      url: endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Método para descargar archivos
  downloadFile: async (endpoint: string, filename: string): Promise<AxiosResponse<Blob>> => {
    try {
      const response = await apiClient.get<Blob>(endpoint, {
        responseType: 'blob',
      });
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      throw new Error('Error al descargar el archivo');
    }
  }
};

// Función para crear cliente API específico para cada servicio
export const createApiClient = (baseRoute: string): ApiClient => {
  const buildUrl = (endpoint: string): string => `${baseRoute}${endpoint}`;

  return {
    get: async <T = any>(endpoint: string = '', config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
      const response = await apiService.get<ApiResponse<T>>(buildUrl(endpoint), config);
      return response.data;
    },
    post: async <T = any>(endpoint: string = '', data?: any, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
      const response = await apiService.post<ApiResponse<T>>(buildUrl(endpoint), data, config);
      return response.data;
    },
    put: async <T = any>(endpoint: string = '', data?: any, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
      const response = await apiService.put<ApiResponse<T>>(buildUrl(endpoint), data, config);
      return response.data;
    },
    delete: async <T = any>(endpoint: string = '', config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
      const response = await apiService.delete<ApiResponse<T>>(buildUrl(endpoint), config);
      return response.data;
    },
    patch: async <T = any>(endpoint: string = '', data?: any, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
      const response = await apiService.patch<ApiResponse<T>>(buildUrl(endpoint), data, config);
      return response.data;
    },
  };
};

// Declaración global para window
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

export default apiService;
