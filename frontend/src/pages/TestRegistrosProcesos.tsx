import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const TestRegistrosProcesos: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Página de Prueba - Registros de Procesos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">✅ Esta página se está renderizando correctamente</h3>
            <p className="text-gray-600">Si puedes ver esto, las rutas están funcionando.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Información de la Ruta:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Pathname:</strong> {location.pathname}</li>
              <li><strong>Search:</strong> {location.search || 'Ninguno'}</li>
              <li><strong>ID de parámetro:</strong> {id || 'Ninguno'}</li>
              <li><strong>Timestamp:</strong> {new Date().toLocaleString()}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">🔗 Enlaces de Prueba:</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => navigate('/app/registros-procesos')}
                variant="outline"
                size="sm"
              >
                Lista Principal
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos-2')}
                variant="outline"
                size="sm"
              >
                Lista 2
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos/1')}
                variant="outline"
                size="sm"
              >
                Vista Individual (ID: 1)
              </Button>
              <Button 
                onClick={() => navigate('/app/registros-procesos/test-123')}
                variant="outline"
                size="sm"
              >
                Vista Individual (ID: test-123)
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📝 Notas de Debug:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Esta es una página de prueba temporal</li>
              <li>• Verifica que las rutas no redirijan al menú principal</li>
              <li>• Los botones de arriba deben navegar correctamente</li>
              <li>• Si ves redirecciones, hay un problema en las rutas</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Estado del Sistema:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Frontend está corriendo: ✅</li>
              <li>• React Router está funcionando: ✅</li>
              <li>• Esta ruta específica funciona: ✅</li>
              <li>• Componentes se renderizan: ✅</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRegistrosProcesos;
