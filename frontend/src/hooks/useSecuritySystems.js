import { useCallback, useMemo, useState, useEffect } from 'react';
import { isSecuritySystemEnabled } from '@/config/securityConfig';

/**
 * Hook personalizado para manejar sistemas de seguridad de manera condicional
 * Permite activar/desactivar sistemas según la configuración
 */
export function useSecuritySystems() {
  
  // Sistema de manejo de errores centralizado
  const useErrorHandler = useCallback((toast) => {
    if (!isSecuritySystemEnabled('ENABLE_ERROR_HANDLER')) {
      // Retornar funciones simples si el sistema está deshabilitado
      return {
        handleError: (error) => {
          console.error('Error (sistema deshabilitado):', error);
          if (toast) {
            toast({
              title: "Error",
              description: error?.message || "Ha ocurrido un error",
              variant: "destructive"
            });
          }
        },
        withErrorHandling: (asyncFn) => asyncFn,
        extractErrorMessage: (error) => error?.message || "Error desconocido",
        classifyError: () => "UNKNOWN"
      };
    }
    
    // Importar el sistema real si está habilitado
    const { useErrorHandler: realUseErrorHandler } = require('@/lib/errorHandler');
    return realUseErrorHandler(toast);
  }, []);

  // Estandarización del uso de toast
  const useToastEffect = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_TOAST_STANDARDIZATION')) {
      // Retornar funciones simples si el sistema está deshabilitado
      return {
        showSuccessToast: (title, description) => {
          console.log('Toast de éxito (sistema deshabilitado):', title, description);
        },
        showErrorToast: (error, options = {}) => {
          console.error('Toast de error (sistema deshabilitado):', error, options);
        },
        showInfoToast: (title, description) => {
          console.log('Toast de info (sistema deshabilitado):', title, description);
        },
        showWarningToast: (title, description) => {
          console.log('Toast de advertencia (sistema deshabilitado):', title, description);
        },
        setToastRef: () => {},
        useAsyncToast: (asyncFn) => asyncFn
      };
    }
    
    // Importar el sistema real si está habilitado
    const { useToastEffect: realUseToastEffect } = require('@/hooks/useToastEffect');
    return realUseToastEffect();
  }, []);

  // React Query para estado del servidor
  const useQueryClient = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_REACT_QUERY')) {
      // Retornar funciones simples si el sistema está deshabilitado
      return {
        QueryProvider: ({ children }) => children,
        useCustomQuery: (queryKey, queryFn, options = {}) => {
          const [data, setData] = useState(null);
          const [isLoading, setIsLoading] = useState(false);
          const [error, setError] = useState(null);
          
          useEffect(() => {
            setIsLoading(true);
            queryFn()
              .then(result => {
                setData(result);
                setError(null);
              })
              .catch(err => {
                setError(err);
                console.error('Query error (sistema deshabilitado):', err);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }, [queryKey]);
          
          return { data, isLoading, error };
        },
        useCustomMutation: (mutationFn, options = {}) => {
          const [isLoading, setIsLoading] = useState(false);
          const [error, setError] = useState(null);
          
          const mutate = useCallback(async (variables) => {
            setIsLoading(true);
            setError(null);
            try {
              const result = await mutationFn(variables);
              return result;
            } catch (err) {
              setError(err);
              console.error('Mutation error (sistema deshabilitado):', err);
              throw err;
            } finally {
              setIsLoading(false);
            }
          }, [mutationFn]);
          
          return { mutate, isLoading, error };
        }
      };
    }
    
    // Importar el sistema real si está habilitado
    const { QueryProvider, useCustomQuery, useCustomMutation } = require('@/hooks/useQueryClient');
    return { QueryProvider, useCustomQuery, useCustomMutation };
  }, []);

  // Paginación optimizada
  const usePagination = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_OPTIMIZED_PAGINATION')) {
      // Retornar paginación simple si el sistema está deshabilitado
      return {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
        goToPage: () => {},
        nextPage: () => {},
        prevPage: () => {},
        setPageSize: () => {},
        getPaginatedData: (data) => data
      };
    }
    
    // Importar el sistema real si está habilitado
    const { usePagination: realUsePagination } = require('@/hooks/usePagination');
    return realUsePagination();
  }, []);

  // React.memo para componentes
  const createMemoizedComponent = useCallback((Component) => {
    if (!isSecuritySystemEnabled('ENABLE_REACT_MEMO')) {
      return Component; // Retornar componente sin memo si está deshabilitado
    }
    
    const { memo } = require('react');
    return memo(Component);
  }, []);

  // useCallback y useMemo
  const useOptimization = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_OPTIMIZATION_HOOKS')) {
      // Retornar hooks simples si el sistema está deshabilitado
      return {
        useOptimizedCallback: (callback) => callback,
        useOptimizedMemo: (factory) => factory(),
        useOptimizedFilter: (data, filterFn) => data.filter(filterFn),
        useOptimizedSort: (data, sortFn) => [...data].sort(sortFn)
      };
    }
    
    // Importar el sistema real si está habilitado
    const { useOptimization: realUseOptimization } = require('@/hooks/useOptimization');
    return realUseOptimization();
  }, []);

  // Feedback visual durante operaciones
  const useLoadingStates = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_LOADING_STATES')) {
      // Retornar estados simples si el sistema está deshabilitado
      return {
        isLoading: false,
        setIsLoading: () => {},
        LoadingSpinner: () => null,
        LoadingSkeleton: () => null
      };
    }
    
    // Importar el sistema real si está habilitado
    const { useLoadingStates: realUseLoadingStates } = require('@/hooks/useLoadingStates');
    return realUseLoadingStates();
  }, []);

  // Validación de formularios
  const useFormValidation = useCallback(() => {
    if (!isSecuritySystemEnabled('ENABLE_FORM_VALIDATION')) {
      // Retornar validación simple si el sistema está deshabilitado
      return {
        validateField: () => ({ isValid: true, error: null }),
        validateForm: () => ({ isValid: true, errors: {} }),
        getFieldError: () => null,
        clearErrors: () => {},
        setFieldError: () => {}
      };
    }
    
    // Importar el sistema real si está habilitado
    const { useFormValidation: realUseFormValidation } = require('@/hooks/useFormValidation');
    return realUseFormValidation();
  }, []);

  return {
    useErrorHandler,
    useToastEffect,
    useQueryClient,
    usePagination,
    createMemoizedComponent,
    useOptimization,
    useLoadingStates,
    useFormValidation,
    isSecuritySystemEnabled
  };
} 