import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook personalizado para monitorear el rendimiento de componentes
 * Proporciona métricas de rendimiento y optimizaciones automáticas
 */
export const usePerformanceMonitor = (options = {}) => {
  const {
    componentName = 'Component',
    enableMetrics = true,
    enableOptimizations = true,
    threshold = 16, // 60fps = 16ms per frame
    logToConsole = false,
    onPerformanceIssue = null
  } = options;

  const [metrics, setMetrics] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    slowRenders: 0,
    memoryUsage: 0,
    isOptimized: false
  });

  const [isMonitoring, setIsMonitoring] = useState(enableMetrics);
  const renderStartTime = useRef(0);
  const renderTimes = useRef([]);
  const lastRenderTime = useRef(0);
  const componentRef = useRef(null);

  // Performance observer for long tasks
  useEffect(() => {
    if (!enableMetrics || !window.PerformanceObserver) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > threshold) {
          setMetrics(prev => ({
            ...prev,
            slowRenders: prev.slowRenders + 1
          }));

          if (onPerformanceIssue) {
            onPerformanceIssue({
              type: 'long-task',
              duration: entry.duration,
              componentName
            });
          }

          if (logToConsole) {
            console.warn(`🚨 Long task detected in ${componentName}:`, entry.duration, 'ms');
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported');
    }

    return () => {
      observer.disconnect();
    };
  }, [enableMetrics, threshold, onPerformanceIssue, componentName, logToConsole]);

  // Memory usage monitoring
  useEffect(() => {
    if (!enableMetrics || !performance.memory) {
      return;
    }

    const updateMemoryUsage = () => {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: usedMB
      }));

      // Warn if memory usage is high
      if (usedMB > 100) { // 100MB threshold
        if (onPerformanceIssue) {
          onPerformanceIssue({
            type: 'high-memory',
            memoryUsage: usedMB,
            componentName
          });
        }

        if (logToConsole) {
          console.warn(`⚠️ High memory usage in ${componentName}:`, usedMB, 'MB');
        }
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000); // Check every 5 seconds
    updateMemoryUsage(); // Initial check

    return () => clearInterval(interval);
  }, [enableMetrics, onPerformanceIssue, componentName, logToConsole]);

  // Start render timing
  const startRender = useCallback(() => {
    if (!enableMetrics) return;
    
    renderStartTime.current = performance.now();
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1
    }));
  }, [enableMetrics]);

  // End render timing
  const endRender = useCallback(() => {
    if (!enableMetrics || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    lastRenderTime.current = renderTime;
    
    renderTimes.current.push(renderTime);
    
    // Keep only last 10 render times for average calculation
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    const averageTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length;

    setMetrics(prev => ({
      ...prev,
      averageRenderTime: Math.round(averageTime * 100) / 100
    }));

    // Check if render was slow
    if (renderTime > threshold) {
      setMetrics(prev => ({
        ...prev,
        slowRenders: prev.slowRenders + 1
      }));

      if (onPerformanceIssue) {
        onPerformanceIssue({
          type: 'slow-render',
          renderTime,
          componentName
        });
      }

      if (logToConsole) {
        console.warn(`🐌 Slow render in ${componentName}:`, renderTime, 'ms');
      }
    }

    renderStartTime.current = 0;
  }, [enableMetrics, threshold, onPerformanceIssue, componentName, logToConsole]);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = [];

    if (metrics.averageRenderTime > threshold) {
      suggestions.push({
        type: 'slow-renders',
        message: 'Consider using React.memo() or useMemo() to optimize re-renders',
        priority: 'high'
      });
    }

    if (metrics.slowRenders > 5) {
      suggestions.push({
        type: 'frequent-slow-renders',
        message: 'Multiple slow renders detected. Review component logic and dependencies',
        priority: 'high'
      });
    }

    if (metrics.memoryUsage > 100) {
      suggestions.push({
        type: 'high-memory',
        message: 'High memory usage. Check for memory leaks or large data structures',
        priority: 'medium'
      });
    }

    if (metrics.renderCount > 100) {
      suggestions.push({
        type: 'frequent-renders',
        message: 'Component renders frequently. Consider optimizing state updates',
        priority: 'medium'
      });
    }

    return suggestions;
  }, [metrics, threshold]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      renderCount: 0,
      averageRenderTime: 0,
      slowRenders: 0,
      memoryUsage: 0,
      isOptimized: false
    });
    renderTimes.current = [];
    lastRenderTime.current = 0;
  }, []);

  // Get performance report
  const getPerformanceReport = useCallback(() => {
    const suggestions = getOptimizationSuggestions();
    const isHealthy = metrics.averageRenderTime < threshold && metrics.slowRenders < 3;

    return {
      componentName,
      metrics,
      suggestions,
      isHealthy,
      lastRenderTime: lastRenderTime.current,
      timestamp: new Date().toISOString()
    };
  }, [componentName, metrics, getOptimizationSuggestions, threshold]);

  // Auto-optimization (experimental)
  useEffect(() => {
    if (!enableOptimizations || !isMonitoring) return;

    const shouldOptimize = metrics.averageRenderTime > threshold || metrics.slowRenders > 5;
    
    if (shouldOptimize && !metrics.isOptimized) {
      setMetrics(prev => ({
        ...prev,
        isOptimized: true
      }));

      if (logToConsole) {
        console.info(`🔧 Auto-optimization enabled for ${componentName}`);
      }
    }
  }, [enableOptimizations, isMonitoring, metrics, threshold, componentName, logToConsole]);

  return {
    // State
    metrics,
    isMonitoring,
    
    // Actions
    startRender,
    endRender,
    toggleMonitoring,
    resetMetrics,
    
    // Utilities
    getOptimizationSuggestions,
    getPerformanceReport,
    
    // Refs
    componentRef
  };
};

export default usePerformanceMonitor;
