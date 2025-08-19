import { useState, useMemo, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para optimizar listas grandes
 * Incluye memoización, paginación virtual y filtrado optimizado
 */
export const useOptimizedList = (data = [], options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    searchFields = [],
    sortField = null,
    sortDirection = 'asc',
    enableVirtualization = false,
    debounceMs = 300
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: sortField,
    direction: sortDirection
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm || searchFields.length === 0) {
      return data;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchLower);
      })
    );
  }, [data, debouncedSearchTerm, searchFields]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.field) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      hasNextPage,
      hasPrevPage,
      startIndex: (currentPage - 1) * pageSize + 1,
      endIndex: Math.min(currentPage * pageSize, totalItems)
    };
  }, [sortedData.length, currentPage, pageSize]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, paginationInfo.totalPages)));
  }, [paginationInfo.totalPages]);

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo.hasNextPage]);

  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, paginationInfo.hasPrevPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages);
  }, [paginationInfo.totalPages]);

  // Sort function
  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Search function
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setSearchTerm('');
    setSortConfig({ field: sortField, direction: sortDirection });
  }, [initialPage, sortField, sortDirection]);

  return {
    // Data
    data: paginatedData,
    filteredData: sortedData,
    allData: data,
    
    // Pagination
    pagination: paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    
    // Search
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
    
    // Sort
    sortConfig,
    handleSort,
    
    // Utilities
    reset,
    isLoading: false, // Can be extended with actual loading state
    isEmpty: sortedData.length === 0,
    hasData: sortedData.length > 0
  };
};

export default useOptimizedList;
