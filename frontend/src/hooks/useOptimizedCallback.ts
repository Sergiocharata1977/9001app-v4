import { useCallback, useRef, useMemo } from 'react';

/**
 * Hook personalizado para optimizar callbacks y prevenir re-renderizados innecesarios
 * Complementa el trabajo de TypeScript del otro agente
 */
export function useOptimizedCallback(callback, dependencies = []) {
  const callbackRef = useRef(callback);
  
  // Actualizar la referencia del callback
  callbackRef.current = callback;
  
  // Retornar un callback memoizado que siempre usa la versión más reciente
  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, dependencies);
}

/**
 * Hook para memoizar objetos complejos
 */
export function useMemoizedObject(obj, dependencies = []) {
  return useMemo(() => obj, dependencies);
}

/**
 * Hook para optimizar arrays
 */
export function useMemoizedArray(array, dependencies = []) {
  return useMemo(() => array, dependencies);
}

/**
 * Hook para optimizar filtros de datos
 */
export function useOptimizedFilter(data, filterFn, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(filterFn);
  }, [data, filterFn, ...dependencies]);
}

/**
 * Hook para optimizar ordenamiento de datos
 */
export function useOptimizedSort(data, sortFn, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort(sortFn);
  }, [data, sortFn, ...dependencies]);
}

/**
 * Hook para optimizar búsqueda en datos
 */
export function useOptimizedSearch(data, searchTerm, searchFields = [], dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data) || !searchTerm) return data;
    
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields, ...dependencies]);
}

/**
 * Hook para optimizar paginación
 */
export function useOptimizedPagination(data, page, pageSize, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return { data: [], total: 0, totalPages: 0 };
    
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }, [data, page, pageSize, ...dependencies]);
}

/**
 * Hook para optimizar estadísticas de datos
 */
export function useOptimizedStats(data, statFns = {}, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return {};
    
    const stats = {};
    
    // Estadísticas básicas
    stats.total = data.length;
    stats.isEmpty = data.length === 0;
    
    // Aplicar funciones de estadísticas personalizadas
    Object.entries(statFns).forEach(([key, fn]) => {
      try {
        stats[key] = fn(data);
      } catch (error) {
        console.warn(`Error calculating stat ${key}:`, error);
        stats[key] = null;
      }
    });
    
    return stats;
  }, [data, statFns, ...dependencies]);
}

/**
 * Hook para optimizar agrupación de datos
 */
export function useOptimizedGroupBy(data, groupBy, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data) || !groupBy) return {};
    
    return data.reduce((groups, item) => {
      const key = typeof groupBy === 'function' ? groupBy(item) : item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [data, groupBy, ...dependencies]);
}

/**
 * Hook para optimizar transformación de datos
 */
export function useOptimizedTransform(data, transformFn, dependencies = []) {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(transformFn);
  }, [data, transformFn, ...dependencies]);
}

/**
 * Hook para optimizar cálculos costosos
 */
export function useOptimizedCalculation(calculationFn, dependencies = []) {
  return useMemo(() => {
    try {
      return calculationFn();
    } catch (error) {
      console.warn('Error in optimized calculation:', error);
      return null;
    }
  }, dependencies);
}

/**
 * Hook para optimizar comparaciones
 */
export function useOptimizedComparison(value1, value2, compareFn = null) {
  return useMemo(() => {
    if (compareFn) {
      return compareFn(value1, value2);
    }
    return value1 === value2;
  }, [value1, value2, compareFn]);
}

/**
 * Hook para optimizar validaciones
 */
export function useOptimizedValidation(value, validationRules = []) {
  return useMemo(() => {
    const errors = [];
    
    validationRules.forEach(rule => {
      try {
        if (!rule.validate(value)) {
          errors.push(rule.message);
        }
      } catch (error) {
        console.warn('Error in validation rule:', error);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [value, validationRules]);
}
