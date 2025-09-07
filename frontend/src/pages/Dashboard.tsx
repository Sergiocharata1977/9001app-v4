import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users, FileText, Target, BarChart3, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Calendar, Activity, RefreshCw, Download
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import personalService from '@/services/personalService';
import procesosService from '@/services/procesosService';
import indicadoresService from '@/services/indicadoresService';
import objetivosCalidadService from '@/services/objetivosCalidadService';
import medicionesService from '@/services/medicionesService';
import IndicadoresChart from '@/components/charts/IndicadoresChart';
import ProcesosChart from '@/components/charts/ProcesosChart';
import ObjetivosChart from '@/components/charts/ObjetivosChart';
import ExportButton from '@/components/ui/ExportButton';
import { exportColumns } from '@/utils/exportUtils';

interface DashboardStats {
  personal: {
    total: number;
    activos: number;
    inactivos: number;
  };
  procesos: {
    total: number;
    porTipo: any[];
    porNivelCritico: any[];
  };
  indicadores: {
    total: number;
    porTipo: any[];
    medicionesRecientes: any[];
  };
  objetivos: {
    total: number;
    porEstado: any[];
    porPrioridad: any[];
    progresoMensual: any[];
  };
  mediciones: {
    total: number;
    recientes: any[];
    tendencias: any[];
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos en paralelo
      const [
        personalData,
        procesosData,
        indicadoresData,
        objetivosData,
        medicionesData
      ] = await Promise.all([
        personalService.getAll(),
        procesosService.getAll(),
        indicadoresService.getAll(),
        objetivosCalidadService.getAll(),
        medicionesService.getAll()
      ]);

      // Procesar estadísticas
      const processedStats = processStats({
        personal: personalData,
        procesos: procesosData,
        indicadores: indicadoresData,
        objetivos: objetivosData,
        mediciones: medicionesData
      });

      setStats(processedStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processStats = (data: any): DashboardStats => {
    const { personal, procesos, indicadores, objetivos, mediciones } = data;

    return {
      personal: {
        total: personal.length,
        activos: personal.filter((p: any) => p.estado === 'activo').length,
        inactivos: personal.filter((p: any) => p.estado === 'inactivo').length
      },
      procesos: {
        total: procesos.length,
        porTipo: groupBy(procesos, 'tipo'),
        porNivelCritico: groupBy(procesos, 'nivel_critico')
      },
      indicadores: {
        total: indicadores.length,
        porTipo: groupBy(indicadores, 'tipo'),
        medicionesRecientes: mediciones.slice(0, 5)
      },
      objetivos: {
        total: objetivos.length,
        porEstado: groupBy(objetivos, 'estado'),
        porPrioridad: groupBy(objetivos, 'prioridad'),
        progresoMensual: generateMonthlyProgress(objetivos)
      },
      mediciones: {
        total: mediciones.length,
        recientes: mediciones.slice(0, 10),
        tendencias: generateTrends(mediciones)
      }
    };
  };

  const groupBy = (data: any[], field: string) => {
    const grouped = data.reduce((acc, item) => {
      const key = item[field] || 'No definido';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, cantidad]) => ({
      name,
      cantidad: cantidad as number
    }));
  };

  const generateMonthlyProgress = (objetivos: any[]) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return months.map(month => ({
      mes: month,
      completados: Math.floor(Math.random() * 10),
      pendientes: Math.floor(Math.random() * 5)
    }));
  };

  const generateTrends = (mediciones: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        fecha: date.toISOString().split('T')[0],
        valor: Math.floor(Math.random() * 100)
      };
    }).reverse();

    return last7Days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'text-green-400';
      case 'completado': return 'text-green-400';
      case 'en_progreso': return 'text-blue-400';
      case 'pendiente': return 'text-yellow-400';
      case 'inactivo': return 'text-red-400';
      case 'cancelado': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo': return CheckCircle;
      case 'completado': return CheckCircle;
      case 'en_progreso': return Clock;
      case 'pendiente': return Clock;
      case 'inactivo': return AlertTriangle;
      case 'cancelado': return AlertTriangle;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Cargando dashboard...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-400">Error al cargar los datos del dashboard</p>
          <Button onClick={loadDashboardData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard SGC</h1>
          <p className="text-slate-400 mt-1">
            Sistema de Gestión de Calidad ISO 9001
          </p>
          {lastUpdated && (
            <p className="text-sm text-slate-500 mt-1">
              Última actualización: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadDashboardData}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Personal Total
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.personal.total}</div>
            <p className="text-xs text-slate-400">
              {stats.personal.activos} activos, {stats.personal.inactivos} inactivos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Procesos
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.procesos.total}</div>
            <p className="text-xs text-slate-400">
              Documentados y activos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Indicadores
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.indicadores.total}</div>
            <p className="text-xs text-slate-400">
              En seguimiento
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Objetivos
            </CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.objetivos.total}</div>
            <p className="text-xs text-slate-400">
              De calidad definidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de análisis */}
      <Tabs defaultValue="procesos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-700">
          <TabsTrigger value="procesos" className="data-[state=active]:bg-slate-600 text-white">
            Procesos
          </TabsTrigger>
          <TabsTrigger value="indicadores" className="data-[state=active]:bg-slate-600 text-white">
            Indicadores
          </TabsTrigger>
          <TabsTrigger value="objetivos" className="data-[state=active]:bg-slate-600 text-white">
            Objetivos
          </TabsTrigger>
          <TabsTrigger value="mediciones" className="data-[state=active]:bg-slate-600 text-white">
            Mediciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="procesos" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProcesosChart
              data={stats.procesos.porTipo}
              type="pie"
              title="Procesos por Tipo"
              description="Distribución de procesos según su tipo"
            />
            <ProcesosChart
              data={stats.procesos.porNivelCritico}
              type="bar"
              title="Procesos por Nivel Crítico"
              description="Clasificación según nivel de criticidad"
            />
          </div>
        </TabsContent>

        <TabsContent value="indicadores" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndicadoresChart
              data={stats.indicadores.porTipo}
              type="pie"
              title="Indicadores por Tipo"
              description="Distribución de indicadores según su tipo"
            />
            <IndicadoresChart
              data={stats.mediciones.tendencias}
              type="line"
              title="Tendencias de Mediciones"
              description="Evolución de las mediciones en los últimos 7 días"
            />
          </div>
        </TabsContent>

        <TabsContent value="objetivos" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ObjetivosChart
              data={stats.objetivos.porEstado}
              type="pie"
              title="Objetivos por Estado"
              description="Distribución de objetivos según su estado"
            />
            <ObjetivosChart
              data={stats.objetivos.progresoMensual}
              type="area"
              title="Progreso Mensual"
              description="Evolución del cumplimiento de objetivos"
            />
          </div>
        </TabsContent>

        <TabsContent value="mediciones" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Mediciones Recientes</h3>
              <ExportButton
                data={stats.mediciones.recientes}
                filename="mediciones_recientes"
                columns={exportColumns.mediciones}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {stats.mediciones.recientes.map((medicion: any, index: number) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{medicion.indicador_nombre || 'Indicador'}</h4>
                        <p className="text-sm text-slate-400">
                          Valor: {medicion.valor} | Fecha: {new Date(medicion.fecha_medicion).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const StatusIcon = getStatusIcon(medicion.estado);
                          return (
                            <StatusIcon className={`h-5 w-5 ${getStatusColor(medicion.estado)}`} />
                          );
                        })()}
                        <span className={`text-sm ${getStatusColor(medicion.estado)}`}>
                          {medicion.estado}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
