import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  LineChart,
  Plus
} from 'lucide-react';
import { crmService } from '@/services/crmService';

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(valor || 0);
};

const CRMDashboard = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalClientes: 0,
    totalOportunidades: 0,
    ventasMes: 0,
    actividadesPendientes: 0
  });
  const [vendedores, setVendedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      
      // Inicializar estadísticas básicas con datos de prueba
      const stats = {
        totalClientes: 0,
        totalOportunidades: 0,
        ventasMes: 0,
        actividadesPendientes: 0
      };

      setEstadisticas(stats);
      setVendedores([]);
      setClientes([]);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      // Inicializar con arrays vacíos para evitar errores
      setEstadisticas({
        totalClientes: 0,
        totalOportunidades: 0,
        ventasMes: 0,
        actividadesPendientes: 0
      });
      setVendedores([]);
      setClientes([]);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard CRM</h1>
          <p className="text-muted-foreground">
            Vista general de tu gestión comercial
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Calendario
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalOportunidades}</div>
            <p className="text-xs text-muted-foreground">
              +5% desde la semana pasada
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
              {formatearMoneda(estadisticas.ventasMes)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividades Pendientes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.actividadesPendientes}</div>
            <p className="text-xs text-muted-foreground">
              -3 desde ayer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividades Recientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Actividades Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay actividades recientes</p>
                <Button variant="outline" className="mt-4">
                  Crear Actividad
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Vendedores */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendedores</CardTitle>
          </CardHeader>
          <CardContent>
            {vendedores.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay vendedores registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendedores.slice(0, 5).map((vendedor) => (
                  <div key={vendedor.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {vendedor.nombres?.charAt(0) || 'V'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {vendedor.nombres} {vendedor.apellidos}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vendedor.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline de Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay oportunidades activas</p>
            <Button variant="outline" className="mt-4">
              Crear Oportunidad
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;
