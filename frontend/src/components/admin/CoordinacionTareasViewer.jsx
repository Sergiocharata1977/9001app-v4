import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { coordinacionService } from '@/services/coordinacionService';

const CoordinacionTareasViewer = () => {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModulo, setFilterModulo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [activeTab, setActiveTab] = useState('todas');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [tareasData, estadisticasData] = await Promise.all([
        coordinacionService.obtenerTareas(),
        coordinacionService.obtenerEstadisticas()
      ]);
      
      setTareas(tareasData.data || []);
      setEstadisticas(estadisticasData.data || {});
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(tarea => {
    const cumpleBusqueda = !searchTerm || 
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.problema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.solucion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const cumpleModulo = filterModulo === 'todos' || tarea.modulo === filterModulo;
    const cumpleEstado = filterEstado === 'todos' || tarea.estado === filterEstado;
    
    return cumpleBusqueda && cumpleModulo && cumpleEstado;
  });

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'terminado': return 'bg-green-100 text-green-800';
      case 'en_proceso': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color de prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baja': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatear tiempo
  const formatearTiempo = (minutos) => {
    if (!minutos) return 'N/A';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sincronizar desde documentación
  const sincronizarDocumentacion = async () => {
    try {
      await coordinacionService.sincronizarDocumentacion();
      await cargarDatos();
      alert('Sincronización completada exitosamente');
    } catch (error) {
      console.error('Error sincronizando:', error);
      alert('Error en la sincronización');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Cargando tareas de coordinación...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Coordinación</h1>
          <p className="text-gray-600">Gestión y seguimiento de tareas de desarrollo</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cargarDatos} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={sincronizarDocumentacion} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Terminadas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.estados?.terminado || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.estados?.en_proceso || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatearTiempo(estadisticas.tiempo?.total || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterModulo} onValueChange={setFilterModulo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los módulos</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
                <SelectItem value="calidad">Calidad</SelectItem>
                <SelectItem value="rrhh">RRHH</SelectItem>
                <SelectItem value="procesos">Procesos</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="terminado">Terminado</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas ({tareasFiltradas.length})</TabsTrigger>
          <TabsTrigger value="terminadas">Terminadas ({estadisticas.estados?.terminado || 0})</TabsTrigger>
          <TabsTrigger value="proceso">En Proceso ({estadisticas.estados?.en_proceso || 0})</TabsTrigger>
          <TabsTrigger value="criticas">Críticas ({estadisticas.prioridades?.critica || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <TareasList tareas={tareasFiltradas} />
        </TabsContent>

        <TabsContent value="terminadas" className="space-y-4">
          <TareasList tareas={tareasFiltradas.filter(t => t.estado === 'terminado')} />
        </TabsContent>

        <TabsContent value="proceso" className="space-y-4">
          <TareasList tareas={tareasFiltradas.filter(t => t.estado === 'en_proceso')} />
        </TabsContent>

        <TabsContent value="criticas" className="space-y-4">
          <TareasList tareas={tareasFiltradas.filter(t => t.prioridad === 'critica')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para listar tareas
const TareasList = ({ tareas }) => {
  if (tareas.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron tareas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tareas.map((tarea) => (
        <Card key={tarea.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">Tarea #{tarea.tarea_numero}</h3>
                  <Badge className={getEstadoColor(tarea.estado)}>
                    {tarea.estado.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPrioridadColor(tarea.prioridad)}>
                    {tarea.prioridad}
                  </Badge>
                  <Badge variant="outline">{tarea.modulo}</Badge>
                </div>
                
                <p className="text-gray-700 mb-2">{tarea.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatearFecha(tarea.fecha)} {tarea.hora_inicio}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatearTiempo(tarea.tiempo_real)}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {tarea.archivos_creados || 'N/A'}
                  </div>
                </div>

                {tarea.problema && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">Problema:</p>
                    <p className="text-sm text-red-700">{tarea.problema}</p>
                  </div>
                )}

                {tarea.solucion && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Solución:</p>
                    <p className="text-sm text-green-700">{tarea.solucion}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoordinacionTareasViewer;
