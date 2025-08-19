import React, { useState, useEffect } from 'react';
import { ProcesoSgc, ProcesoSgcCompleto, ProcesoSgcFiltros, ProcesoSgcDashboard } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Filter, 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ProcesosPageProps {
  // Props específicas de la página si las hay
}

const ProcesosPage: React.FC<ProcesosPageProps> = () => {
  const [procesos, setProcesos] = useState<ProcesoSgc[]>([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState<ProcesoSgcCompleto | null>(null);
  const [dashboard, setDashboard] = useState<ProcesoSgcDashboard | null>(null);
  const [filtros, setFiltros] = useState<ProcesoSgcFiltros>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales y formularios
  const [showModalCrear, setShowModalCrear] = useState<boolean>(false);
  const [showModalEditar, setShowModalEditar] = useState<boolean>(false);
  const [showModalDetalle, setShowModalDetalle] = useState<boolean>(false);

  useEffect(() => {
    cargarProcesos();
    cargarDashboard();
  }, [filtros]);

  const cargarProcesos = async (): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API
      const response = await fetch('/api/procesos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar procesos');
      }
      
      const data = await response.json();
      setProcesos(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const cargarDashboard = async (): Promise<void> => {
    try {
      const response = await fetch('/api/procesos/dashboard/sgc', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboard(data.data);
      }
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    }
  };

  const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      case 'obsoleto': return 'bg-red-100 text-red-800';
      case 'en_revision': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerColorNivelCritico = (nivel: string): string => {
    switch (nivel) {
      case 'bajo': return 'bg-blue-100 text-blue-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerIconoTipo = (tipo: string): React.ReactNode => {
    switch (tipo) {
      case 'estrategico': return <TrendingUp className="w-4 h-4" />;
      case 'operativo': return <BarChart3 className="w-4 h-4" />;
      case 'apoyo': return <Users className="w-4 h-4" />;
      case 'mejora': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-red-800 font-medium">Error</h3>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Procesos SGC</h1>
          <p className="text-gray-600 mt-1">Sistema de Gestión de Calidad - Procesos Organizacionales</p>
        </div>
        <Button 
          onClick={() => setShowModalCrear(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proceso
        </Button>
      </div>

      {/* Dashboard Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Procesos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.resumen.total_procesos}</div>
              <p className="text-xs text-muted-foreground">
                {dashboard.resumen.activos} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estratégicos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.resumen.estrategicos}</div>
              <p className="text-xs text-muted-foreground">
                Procesos clave
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.resumen.operativos}</div>
              <p className="text-xs text-muted-foreground">
                Procesos diarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">De Apoyo</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.resumen.apoyo}</div>
              <p className="text-xs text-muted-foreground">
                Procesos de soporte
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <Input
                placeholder="Buscar procesos..."
                value={filtros.search || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiltros({ ...filtros, search: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <Select 
                value={filtros.tipo || ''} 
                onValueChange={(value: string) => setFiltros({ ...filtros, tipo: value as ProcesoTipo })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="estrategico">Estratégico</SelectItem>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="apoyo">Apoyo</SelectItem>
                  <SelectItem value="mejora">Mejora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select 
                value={filtros.estado || ''} 
                onValueChange={(value) => setFiltros({ ...filtros, estado: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="obsoleto">Obsoleto</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel Crítico
              </label>
              <Select 
                value={filtros.nivel_critico || ''} 
                onValueChange={(value) => setFiltros({ ...filtros, nivel_critico: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Procesos */}
      <Card>
        <CardHeader>
          <CardTitle>Procesos SGC</CardTitle>
        </CardHeader>
        <CardContent>
          {procesos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay procesos</h3>
              <p className="text-gray-600 mb-4">Comienza creando tu primer proceso SGC</p>
              <Button onClick={() => setShowModalCrear(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Proceso
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {procesos.map((proceso) => (
                <div 
                  key={proceso.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setProcesoSeleccionado(proceso as ProcesoSgcCompleto);
                    setShowModalDetalle(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {obtenerIconoTipo(proceso.tipo)}
                      <div>
                        <h3 className="font-medium text-gray-900">{proceso.nombre}</h3>
                        <p className="text-sm text-gray-600">{proceso.codigo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={obtenerColorEstado(proceso.estado)}>
                        {proceso.estado}
                      </Badge>
                      <Badge className={obtenerColorNivelCritico(proceso.nivel_critico)}>
                        {proceso.nivel_critico}
                      </Badge>
                    </div>
                  </div>
                  
                  {proceso.descripcion && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {proceso.descripcion}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>Versión: {proceso.version}</span>
                    <span>Actualizado: {new Date(proceso.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Implementar modales para crear, editar y ver detalles */}
    </div>
  );
};

export default ProcesosPage;
