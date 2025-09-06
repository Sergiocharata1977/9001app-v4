import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { ProcesoSgcDashboard } from '@/types/procesos';

interface ProcesosDashboardProps {
  organizationId?: number;
}

const ProcesosDashboard: React.FC<ProcesosDashboardProps> = ({ organizationId = 1 }) => {
  const [dashboard, setDashboard] = useState<ProcesoSgcDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDashboard();
  }, [organizationId]);

  const cargarDashboard = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/procesos-mongodb/dashboard/sgc', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar dashboard');
      }
      
      const data = await response.json();
      setDashboard(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Error al cargar dashboard: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <p>No hay datos disponibles para el dashboard</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { resumen, distribucion_tipos, cumplimiento_normas } = dashboard;

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Procesos
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {resumen.total_procesos || 0}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Procesos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Procesos Activos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {resumen.activos || 0}
            </div>
            <p className="text-xs text-green-600 mt-1">
              En operación
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Estratégicos
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {resumen.estrategicos || 0}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Procesos clave
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Operativos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {resumen.operativos || 0}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Procesos diarios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por Tipos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribución por Tipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {distribucion_tipos && distribucion_tipos.length > 0 ? (
              <div className="space-y-3">
                {distribucion_tipos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          item.tipo === 'estrategico' ? 'border-purple-200 text-purple-700' :
                          item.tipo === 'operativo' ? 'border-orange-200 text-orange-700' :
                          item.tipo === 'apoyo' ? 'border-blue-200 text-blue-700' :
                          'border-green-200 text-green-700'
                        }`}
                      >
                        {item.tipo}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {item.categoria}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <PieChart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay datos de distribución</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cumplimiento de Normas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cumplimiento de Normas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cumplimiento_normas && cumplimiento_normas.length > 0 ? (
              <div className="space-y-3">
                {cumplimiento_normas.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          item.nivel_cumplimiento === 'cumple' ? 'border-green-200 text-green-700' :
                          item.nivel_cumplimiento === 'cumple_parcialmente' ? 'border-yellow-200 text-yellow-700' :
                          item.nivel_cumplimiento === 'no_cumple' ? 'border-red-200 text-red-700' :
                          'border-gray-200 text-gray-700'
                        }`}
                      >
                        {item.nivel_cumplimiento}
                      </Badge>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay datos de cumplimiento</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Métricas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Métricas de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((resumen.activos / resumen.total_procesos) * 100) || 0}%
              </div>
              <p className="text-sm text-gray-600">Tasa de Actividad</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((resumen.estrategicos / resumen.total_procesos) * 100) || 0}%
              </div>
              <p className="text-sm text-gray-600">Procesos Estratégicos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {resumen.apoyo || 0}
              </div>
              <p className="text-sm text-gray-600">Procesos de Soporte</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcesosDashboard;
