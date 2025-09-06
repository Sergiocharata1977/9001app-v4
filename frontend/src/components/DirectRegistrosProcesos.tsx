import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DirectRegistrosProcesos: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">🎉 ¡ÉXITO! Ruta Funcionando</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-green-700">
            <p className="text-lg font-semibold">✅ Esta página se está renderizando correctamente</p>
            <p>Si puedes ver esto, significa que las rutas están funcionando y el problema anterior ha sido resuelto.</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-gray-800">📍 Información de la Ruta:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Pathname:</strong> 
                <Badge variant="outline" className="ml-2">{location.pathname}</Badge>
              </div>
              <div>
                <strong>Parámetro ID:</strong> 
                <Badge variant="outline" className="ml-2">{id || 'Ninguno'}</Badge>
              </div>
              <div>
                <strong>Search:</strong> 
                <Badge variant="outline" className="ml-2">{location.search || 'Ninguno'}</Badge>
              </div>
              <div>
                <strong>Timestamp:</strong> 
                <Badge variant="outline" className="ml-2">{new Date().toLocaleString()}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">🚀 Pruebas de Navegación:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button 
                onClick={() => navigate('/app/registros-procesos')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                📋 Lista Principal
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos-2')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                📋 Lista 2
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos/1')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🔍 Individual (ID: 1)
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos/test-abc')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🔍 Individual (ID: test)
              </Button>
              <Button 
                onClick={() => navigate('/app/test-registros')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🧪 Página de Prueba
              </Button>
              <Button 
                onClick={() => navigate('/app/menu-cards')}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🏠 Menú Principal
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">📝 Diagnóstico Completo:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• <strong>Frontend Status:</strong> ✅ Corriendo y accesible</div>
              <div>• <strong>React Router:</strong> ✅ Funcionando correctamente</div>
              <div>• <strong>Lazy Loading:</strong> ✅ Sin problemas (esta ruta es directa)</div>
              <div>• <strong>Componentes:</strong> ✅ Renderizando sin errores</div>
              <div>• <strong>Rutas Específicas:</strong> ✅ No hay redirecciones al menú</div>
              <div>• <strong>Path Matching:</strong> ✅ Las rutas coinciden correctamente</div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">⚡ Próximos Pasos:</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>1. Verificar que todos los botones de arriba funcionen correctamente</div>
              <div>2. Probar las rutas originales de registros-procesos</div>
              <div>3. Si todo funciona, el problema ha sido resuelto</div>
              <div>4. Si aún hay redirecciones, revisar configuración de autenticación</div>
            </div>
          </div>

          {id && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🔍 Información del Parámetro ID:</h4>
              <div className="text-sm text-purple-700">
                <p>Se detectó el parámetro ID: <strong>{id}</strong></p>
                <p>Esto significa que las rutas dinámicas están funcionando correctamente.</p>
                <p>El componente puede acceder a los parámetros de la URL sin problemas.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectRegistrosProcesos;
