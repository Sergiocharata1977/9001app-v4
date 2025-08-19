import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import useOptimizedList from '@/hooks/useOptimizedList';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

/**
 * Componente de testing para verificar hooks de optimización
 * Permite probar todos los hooks creados
 */
const HooksTesting = () => {
  const [activeHook, setActiveHook] = useState('optimized-list');
  const [testData, setTestData] = useState([]);

  // Generar datos de prueba
  useEffect(() => {
    const generateTestData = () => {
      const data = [];
      for (let i = 1; i <= 100; i++) {
        data.push({
          id: i,
          name: `Item ${i}`,
          description: `Descripción del item ${i}`,
          category: `Categoría ${Math.floor(Math.random() * 5) + 1}`,
          status: Math.random() > 0.5 ? 'Activo' : 'Inactivo',
          date: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        });
      }
      setTestData(data);
    };

    generateTestData();
  }, []);

  // Hook de lista optimizada
  const optimizedList = useOptimizedList(testData, {
    pageSize: 10,
    searchFields: ['name', 'description', 'category'],
    sortField: 'name'
  });

  // Hook de búsqueda con debounce
  const debouncedSearch = useDebouncedSearch({
    delay: 500,
    searchFields: ['name', 'description'],
    onSearch: (term) => {
      console.log('Búsqueda realizada:', term);
      return testData.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      );
    }
  });

  // Hook de scroll infinito
  const infiniteScroll = useInfiniteScroll({
    data: testData,
    pageSize: 15,
    hasMore: true
  });

  // Hook de monitoreo de rendimiento
  const performanceMonitor = usePerformanceMonitor({
    componentName: 'HooksTesting',
    enableMetrics: true,
    logToConsole: true
  });

  // Iniciar monitoreo de rendimiento
  useEffect(() => {
    performanceMonitor.startRender();
    const timer = setTimeout(() => {
      performanceMonitor.endRender();
    }, 100);
    return () => clearTimeout(timer);
  }, [performanceMonitor]);

  const renderOptimizedListTest = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar..."
          value={optimizedList.searchTerm}
          onChange={(e) => optimizedList.handleSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={optimizedList.reset} variant="outline">
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimizedList.data.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant={item.status === 'Activo' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {optimizedList.pagination.startIndex}-{optimizedList.pagination.endIndex} de {optimizedList.pagination.totalItems}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={optimizedList.prevPage}
            disabled={!optimizedList.pagination.hasPrevPage}
            variant="outline"
            size="sm"
          >
            Anterior
          </Button>
          <Button
            onClick={optimizedList.nextPage}
            disabled={!optimizedList.pagination.hasNextPage}
            variant="outline"
            size="sm"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDebouncedSearchTest = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar con debounce..."
          value={debouncedSearch.searchTerm}
          onChange={(e) => debouncedSearch.handleSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={debouncedSearch.clearSearch} variant="outline">
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Sugerencias</h4>
          <div className="space-y-1">
            {debouncedSearch.suggestions.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => debouncedSearch.selectSuggestion(item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Historial</h4>
          <div className="space-y-1">
            {debouncedSearch.searchHistory.slice(0, 5).map((term, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{term}</span>
                <Button
                  onClick={() => debouncedSearch.removeFromHistory(term)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>Estado: {debouncedSearch.isSearching ? 'Buscando...' : 'Listo'}</p>
        <p>Término debounced: {debouncedSearch.debouncedTerm}</p>
        <p>Válido: {debouncedSearch.isValidSearch ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );

  const renderInfiniteScrollTest = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={infiniteScroll.loadMore} variant="outline">
          Cargar Más
        </Button>
        <Button onClick={infiniteScroll.reset} variant="outline">
          Reset
        </Button>
        <Button onClick={infiniteScroll.loadAll} variant="outline">
          Cargar Todo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infiniteScroll.data.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">
          Progreso: {infiniteScroll.state.progress}% ({infiniteScroll.state.visibleItems}/{infiniteScroll.state.totalItems})
        </div>
        {infiniteScroll.state.hasMore && (
          <div ref={infiniteScroll.containerRef} className="h-4 bg-gray-100 rounded">
            <div className="text-xs text-gray-500 py-1">Scroll para cargar más</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPerformanceMonitorTest = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{performanceMonitor.metrics.renderCount}</div>
            <div className="text-sm text-gray-600">Renderizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{performanceMonitor.metrics.averageRenderTime}ms</div>
            <div className="text-sm text-gray-600">Tiempo Promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{performanceMonitor.metrics.slowRenders}</div>
            <div className="text-sm text-gray-600">Renderizados Lentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{performanceMonitor.metrics.memoryUsage}MB</div>
            <div className="text-sm text-gray-600">Memoria</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={performanceMonitor.toggleMonitoring} variant="outline">
          {performanceMonitor.isMonitoring ? 'Pausar' : 'Reanudar'} Monitoreo
        </Button>
        <Button onClick={performanceMonitor.resetMetrics} variant="outline">
          Reset Métricas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sugerencias de Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {performanceMonitor.getOptimizationSuggestions().map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 p-2 border rounded">
                <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                  {suggestion.priority}
                </Badge>
                <span className="text-sm">{suggestion.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHookTest = () => {
    switch (activeHook) {
      case 'optimized-list':
        return renderOptimizedListTest();
      case 'debounced-search':
        return renderDebouncedSearchTest();
      case 'infinite-scroll':
        return renderInfiniteScrollTest();
      case 'performance-monitor':
        return renderPerformanceMonitorTest();
      default:
        return renderOptimizedListTest();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🔧 Testing de Hooks de Optimización</h1>
        <p className="text-gray-600">Verificación de hooks de rendimiento y optimización</p>
      </div>

      {/* Hook Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Hook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveHook('optimized-list')}
              variant={activeHook === 'optimized-list' ? 'default' : 'outline'}
            >
              useOptimizedList
            </Button>
            <Button
              onClick={() => setActiveHook('debounced-search')}
              variant={activeHook === 'debounced-search' ? 'default' : 'outline'}
            >
              useDebouncedSearch
            </Button>
            <Button
              onClick={() => setActiveHook('infinite-scroll')}
              variant={activeHook === 'infinite-scroll' ? 'default' : 'outline'}
            >
              useInfiniteScroll
            </Button>
            <Button
              onClick={() => setActiveHook('performance-monitor')}
              variant={activeHook === 'performance-monitor' ? 'default' : 'outline'}
            >
              usePerformanceMonitor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hook Test Area */}
      <Card>
        <CardHeader>
          <CardTitle>Test: {activeHook.replace('-', ' ').toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderHookTest()}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Hooks Creados</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">100</div>
              <div className="text-sm text-gray-600">Items de Prueba</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">500ms</div>
              <div className="text-sm text-gray-600">Debounce Delay</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">16ms</div>
              <div className="text-sm text-gray-600">Performance Threshold</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HooksTesting;
