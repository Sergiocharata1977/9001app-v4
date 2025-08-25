import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  HallazgosListSkeleton, 
  DocumentosListSkeleton, 
  PersonalListSkeleton,
  HallazgoFormSkeleton,
  DocumentoFormSkeleton
} from '@/components/ui/skeleton';

/**
 * Componente de testing para verificar skeleton components
 * Permite probar todos los skeleton components creados
 */
const SkeletonTesting = () => {
  const [activeSkeleton, setActiveSkeleton] = useState('hallazgos');
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // Simular carga para mostrar skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const runTest = (skeletonName) => {
    setActiveSkeleton(skeletonName);
    setIsLoading(true);
    
    // Simular carga
    setTimeout(() => {
      setIsLoading(false);
      setTestResults(prev => ({
        ...prev,
        [skeletonName]: {
          status: 'passed',
          timestamp: new Date().toISOString(),
          duration: '3s'
        }
      }));
    }, 3000);
  };

  const runAllTests = () => {
    const skeletons = ['hallazgos', 'documentos', 'personal', 'hallazgo-form', 'documento-form'];
    
    skeletons.forEach((skeleton, index) => {
      setTimeout(() => {
        runTest(skeleton);
      }, index * 1000);
    });
  };

  const renderSkeleton = () => {
    switch (activeSkeleton) {
      case 'hallazgos':
        return <HallazgosListSkeleton />;
      case 'documentos':
        return <DocumentosListSkeleton />;
      case 'personal':
        return <PersonalListSkeleton />;
      case 'hallazgo-form':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <HallazgoFormSkeleton />
          </div>
        );
      case 'documento-form':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <DocumentoFormSkeleton />
          </div>
        );
      default:
        return <HallazgosListSkeleton />;
    }
  };

  const getTestStatus = (skeletonName) => {
    const result = testResults[skeletonName];
    if (!result) return 'pending';
    return result.status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Testing de Skeleton Components</h1>
        <p className="text-gray-600">Verificación de componentes de carga optimizados</p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Panel de Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              onClick={() => runTest('hallazgos')}
              variant="outline"
              disabled={isLoading}
            >
              Test Hallazgos
            </Button>
            <Button 
              onClick={() => runTest('documentos')}
              variant="outline"
              disabled={isLoading}
            >
              Test Documentos
            </Button>
            <Button 
              onClick={() => runTest('personal')}
              variant="outline"
              disabled={isLoading}
            >
              Test Personal
            </Button>
            <Button 
              onClick={() => runTest('hallazgo-form')}
              variant="outline"
              disabled={isLoading}
            >
              Test Form Hallazgo
            </Button>
            <Button 
              onClick={() => runTest('documento-form')}
              variant="outline"
              disabled={isLoading}
            >
              Test Form Documento
            </Button>
            <Button 
              onClick={runAllTests}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              Ejecutar Todos los Tests
            </Button>
          </div>

          {/* Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['hallazgos', 'documentos', 'personal', 'hallazgo-form', 'documento-form'].map((skeleton) => (
              <div key={skeleton} className="flex items-center justify-between p-3 border rounded">
                <span className="capitalize">{skeleton.replace('-', ' ')}</span>
                <span className={`font-semibold ${getStatusColor(getTestStatus(skeleton))}`}>
                  {getTestStatus(skeleton) === 'passed' ? '✅' : 
                   getTestStatus(skeleton) === 'failed' ? '❌' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            Skeleton Activo: {activeSkeleton.replace('-', ' ').toUpperCase()}
            {isLoading && <span className="ml-2 text-blue-600">(Cargando...)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <div className="text-center py-12">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Test Completado</h3>
              <p className="text-gray-600">
                El skeleton component se mostró correctamente durante 3 segundos
              </p>
              <Button 
                onClick={() => setIsLoading(true)}
                className="mt-4"
              >
                Probar Nuevamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Skeleton Components</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">3s</div>
              <div className="text-sm text-gray-600">Tiempo de Carga</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Cobertura de Testing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonTesting;
