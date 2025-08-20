import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { crmService, crmUtils } from '@/services/crmService';
import { 
  TIPOS_CLIENTE, 
  ETAPAS_OPORTUNIDAD, 
  TIPOS_ACTIVIDAD,
  formatearMoneda 
} from '@/types/crm';
import CRMKanbanBoard from './CRMKanbanBoard';

const CRMDashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos en paralelo
      const [statsRes, vendedoresRes, clientesRes, oportunidadesRes, actividadesRes] = await Promise.all([
        crmService.getEstadisticas(),
        crmService.getVendedores(),
        crmService.getClientes(),
        crmService.getOportunidades(),
        crmService.getActividades()
      ]);

      setEstadisticas(statsRes.data);
      setVendedores(vendedoresRes.data);
      setClientes(clientesRes.data);
      setOportunidades(oportunidadesRes.data);
      setActividades(actividadesRes.data);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600">Gestión de clientes, oportunidades y ventas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Reporte Mensual
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.total_clientes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {estadisticas?.clientes_activos || 0} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.oportunidades_activas || 0}</div>
            <p className="text-xs text-muted-foreground">
              {formatearMoneda(estadisticas?.valor_pipeline || 0)} en pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatearMoneda(estadisticas?.valor_total_ventas || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {estadisticas?.oportunidades_ganadas || 0} oportunidades ganadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas?.tasa_conversion_global?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {estadisticas?.actividades_completadas || 0} actividades completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="kanban">Pipeline</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Distribución de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TIPOS_CLIENTE.map((tipo) => {
                    const count = tipo.value === 'potencial' ? estadisticas?.clientes_potenciales :
                                 tipo.value === 'activo' ? estadisticas?.clientes_activos :
                                 estadisticas?.clientes_inactivos || 0;
                    const porcentaje = estadisticas?.total_clientes > 0 
                      ? ((count / estadisticas.total_clientes) * 100).toFixed(1) 
                      : 0;
                    
                    return (
                      <div key={tipo.value} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" style={{ borderColor: tipo.color }}>
                            {tipo.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-gray-500">{porcentaje}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline de Ventas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Pipeline de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ETAPAS_OPORTUNIDAD.filter(etapa => 
                    etapa.value !== 'cerrada_ganada' && etapa.value !== 'cerrada_perdida'
                  ).map((etapa) => {
                    const count = oportunidades.filter(op => op.etapa === etapa.value).length;
                    const valor = oportunidades
                      .filter(op => op.etapa === etapa.value)
                      .reduce((sum, op) => sum + (op.valor_estimado || 0), 0);
                    
                    return (
                      <div key={etapa.value} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" style={{ borderColor: etapa.color }}>
                            {etapa.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-gray-500">{formatearMoneda(valor)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendedores.slice(0, 5).map((vendedor, index) => (
                  <div key={vendedor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {vendedor.nombre?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{vendedor.nombre}</div>
                        <div className="text-sm text-gray-500">{vendedor.puesto}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatearMoneda(vendedor.valor_ventas || 0)}</div>
                      <div className="text-sm text-gray-500">
                        {vendedor.oportunidades_ganadas || 0} ventas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oportunidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {oportunidades.slice(0, 5).map((oportunidad) => (
                  <div key={oportunidad.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{oportunidad.titulo}</div>
                      <div className="text-sm text-gray-500">{oportunidad.cliente_nombre}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: crmUtils.getEtapaOportunidadColor(oportunidad.etapa) }}
                      >
                        {ETAPAS_OPORTUNIDAD.find(e => e.value === oportunidad.etapa)?.label}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">{formatearMoneda(oportunidad.valor_estimado || 0)}</div>
                        <div className="text-sm text-gray-500">{oportunidad.probabilidad}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <CRMKanbanBoard 
            oportunidades={oportunidades}
            onOportunidadClick={(oportunidad) => {
              console.log('Oportunidad clickeada:', oportunidad);
              // Aquí puedes abrir un modal o navegar a la página de detalles
            }}
            onEstadoChange={async (oportunidadId, nuevaEtapa) => {
              try {
                await crmService.updateOportunidad(oportunidadId, { etapa: nuevaEtapa });
                // Recargar datos
                cargarDatos();
              } catch (error) {
                console.error('Error actualizando oportunidad:', error);
                throw error;
              }
            }}
          />
        </TabsContent>

        <TabsContent value="actividades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividades Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actividades.slice(0, 5).map((actividad) => (
                  <div key={actividad.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center`}
                           style={{ backgroundColor: `${crmUtils.getTipoActividadColor(actividad.tipo_actividad)}20` }}>
                        {actividad.tipo_actividad === 'llamada' && <Phone className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'email' && <Mail className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'reunion' && <Users className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'visita' && <MapPin className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'propuesta' && <Activity className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'seguimiento' && <TrendingUp className="w-4 h-4" />}
                        {actividad.tipo_actividad === 'otro' && <Activity className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{actividad.titulo}</div>
                        <div className="text-sm text-gray-500">
                          {TIPOS_ACTIVIDAD.find(t => t.value === actividad.tipo_actividad)?.label} • 
                          {actividad.cliente_nombre}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(actividad.fecha_actividad).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {actividad.duracion_minutos} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;
