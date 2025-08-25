import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook personalizado para scroll infinito
 * Optimiza la carga de datos en listas largas
 */
export const useInfiniteScroll = (options = {}) => {
  const {
    data = [],
    pageSize = 20,
    threshold = 100, // pixels from bottom to trigger load
    enableAutoLoad = true,
    onLoadMore = null,
    hasMore = true,
    loading = false,
    error = null
  } = options;

  const [visibleItems, setVisibleItems] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(hasMore);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Update visible items when data changes
  useEffect(() => {
    setVisibleItems(Math.min(pageSize, data.length));
  }, [data.length, pageSize]);

  // Update hasMoreData when prop changes
  useEffect(() => {
    setHasMoreData(hasMore);
  }, [hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enableAutoLoad || !hasMoreData || loading || isLoadingMore) {
      return;
    }

    const options = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1
    };

    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreData && !loading && !isLoadingMore) {
        loadMore();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableAutoLoad, hasMoreData, loading, isLoadingMore, threshold]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreData || loading) {
      return;
    }

    setIsLoadingMore(true);

    try {
      if (onLoadMore) {
        await onLoadMore();
      } else {
        // Default behavior: increase visible items
        setVisibleItems(prev => Math.min(prev + pageSize, data.length));
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreData, loading, onLoadMore, pageSize, data.length]);

  // Manual load more
  const loadMoreManual = useCallback(() => {
    loadMore();
  }, [loadMore]);

  // Reset to initial state
  const reset = useCallback(() => {
    setVisibleItems(pageSize);
    setIsLoadingMore(false);
    setHasMoreData(hasMore);
  }, [pageSize, hasMore]);

  // Get current visible data
  const getVisibleData = useCallback(() => {
    return data.slice(0, visibleItems);
  }, [data, visibleItems]);

  // Check if we're near the end
  const isNearEnd = useCallback(() => {
    return visibleItems >= data.length - pageSize;
  }, [visibleItems, data.length, pageSize]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, []);

  // Load all data at once
  const loadAll = useCallback(() => {
    setVisibleItems(data.length);
    setHasMoreData(false);
  }, [data.length]);

  // State information
  const state = {
    visibleItems,
    totalItems: data.length,
    hasMore: hasMoreData,
    isLoading: loading || isLoadingMore,
    error,
    isNearEnd: isNearEnd(),
    progress: Math.round((visibleItems / data.length) * 100) || 0
  };

  return {
    // Data
    data: getVisibleData(),
    allData: data,
    
    // State
    state,
    
    // Actions
    loadMore: loadMoreManual,
    reset,
    scrollToTop,
    scrollToBottom,
    loadAll,
    
    // Refs
    containerRef,
    
    // Utilities
    getVisibleData,
    isNearEnd
  };
};

export default useInfiniteScroll;
