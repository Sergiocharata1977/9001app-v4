import { useCallback, useMemo } from 'react';

/**
 * Hook para optimizar callbacks y prevenir re-renderizados
 */
export function useOptimizedCallback(callback, dependencies = []) {
  return useCallback(callback, dependencies);
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
 * Hook para optimizar búsqueda
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
