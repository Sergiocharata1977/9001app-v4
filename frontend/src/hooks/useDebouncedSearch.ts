import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook personalizado para búsquedas con debounce
 * Optimiza las búsquedas para evitar llamadas innecesarias a la API
 */
export const useDebouncedSearch = (options = {}) => {
  const {
    initialValue = '',
    delay = 300,
    minLength = 2,
    maxLength = 100,
    searchFields = [],
    onSearch = null,
    enableRealTime = true
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  // Search effect
  useEffect(() => {
    if (!enableRealTime || !onSearch) return;

    const performSearch = async () => {
      if (debouncedTerm.length < minLength) {
        setIsSearching(false);
        setSuggestions([]);
        return;
      }

      if (debouncedTerm.length > maxLength) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      try {
        const results = await onSearch(debouncedTerm);
        setSuggestions(Array.isArray(results) ? results : []);
        
        // Add to search history
        if (debouncedTerm && !searchHistory.includes(debouncedTerm)) {
          setSearchHistory(prev => [debouncedTerm, ...prev.slice(0, 9)]);
        }
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedTerm, onSearch, minLength, maxLength, enableRealTime, searchHistory]);

  // Memoized search validation
  const isValidSearch = useMemo(() => {
    return searchTerm.length >= minLength && searchTerm.length <= maxLength;
  }, [searchTerm, minLength, maxLength]);

  // Search functions
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleSearchSubmit = useCallback((term = searchTerm) => {
    if (onSearch && isValidSearch) {
      onSearch(term);
    }
  }, [searchTerm, onSearch, isValidSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    setSuggestions([]);
  }, []);

  const selectSuggestion = useCallback((suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  }, []);

  const selectFromHistory = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const removeFromHistory = useCallback((term) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Filter data locally
  const filterData = useCallback((data, term = debouncedTerm) => {
    if (!term || term.length < minLength || !Array.isArray(data)) {
      return data;
    }

    const searchLower = term.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchLower);
      })
    );
  }, [debouncedTerm, minLength, searchFields]);

  // Search statistics
  const searchStats = useMemo(() => ({
    term: searchTerm,
    debouncedTerm,
    isValid: isValidSearch,
    isSearching,
    suggestionsCount: suggestions.length,
    historyCount: searchHistory.length,
    hasResults: suggestions.length > 0
  }), [searchTerm, debouncedTerm, isValidSearch, isSearching, suggestions.length, searchHistory.length]);

  return {
    // State
    searchTerm,
    debouncedTerm,
    isSearching,
    suggestions,
    searchHistory,
    
    // Actions
    handleSearch,
    handleSearchSubmit,
    clearSearch,
    selectSuggestion,
    selectFromHistory,
    removeFromHistory,
    clearHistory,
    
    // Utilities
    filterData,
    isValidSearch,
    searchStats
  };
};

export default useDebouncedSearch;
