import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  FileText, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Tipos para el dashboard
interface IndicadorKPI {
  name: string;
  valor: number;
  delta: string;
  deltaType: 'increase' | 'decrease' | 'neutral';
  descripcion: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald' | 'gray';
  unidad?: string;
  meta?: number;
}

interface ActividadReciente {
  id: string;
  tipo: 'usuario' | 'documento' | 'auditoria' | 'accion' | 'proceso' | 'hallazgo';
  titulo: string;
  descripcion: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  usuario?: string;
}

interface DashboardStats {
  usuarios: {
    total: number;
    activos: number;
    nuevos_mes: number;
  };
  departamentos: {
    total: number;
    activos: number;
  };
  documentos: {
    total: number;
    vigentes: number;
    por_vencer: number;
  };
  auditorias: {
    total: number;
    pendientes: number;
    completadas: number;
  };
  acciones: {
    total: number;
    en_progreso: number;
    completadas: number;
  };
  cumplimiento: {
    porcentaje: number;
    tendencia: 'up' | 'down' | 'stable';
  };
  procesos: {
    total: number;
    activos: number;
    criticos: number;
  };
}

interface DashboardProps {
  // Props específicas si las hay
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDashboardStats();
  }, []);

  const cargarDashboardStats = async (): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API real
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      
      // Datos de ejemplo por ahora
      const mockStats: DashboardStats = {
        usuarios: { total: 24, activos: 22, nuevos_mes: 3 },
        departamentos: { total: 12, activos: 12 },
        documentos: { total: 156, vigentes: 142, por_vencer: 8 },
        auditorias: { total: 8, pendientes: 3, completadas: 5 },
        acciones: { total: 23, en_progreso: 15, completadas: 8 },
        cumplimiento: { porcentaje: 89.2, tendencia: 'up' },
        procesos: { total: 18, activos: 16, criticos: 4 }
      };
      
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string): string => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      purple: 'bg-purple-500 text-purple-100',
      orange: 'bg-orange-500 text-orange-100',
      red: 'bg-red-500 text-red-100',
      emerald: 'bg-emerald-500 text-emerald-100',
      gray: 'bg-gray-500 text-gray-100'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-100';
  };

  const getDeltaIcon = (deltaType: string): React.ReactNode => {
    switch (deltaType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const indicadoresData: IndicadorKPI[] = stats ? [
    {
      name: "Usuarios",
      valor: stats.usuarios.total,
      delta: `+${stats.usuarios.nuevos_mes}`,
      deltaType: "increase",
      descripcion: "Total de usuarios registrados",
      icon: Users,
      color: "blue"
    },
    {
      name: "Departamentos",
      valor: stats.departamentos.total,
      delta: `${stats.departamentos.activos}/${stats.departamentos.total}`,
      deltaType: "neutral",
      descripcion: "Departamentos activos",
      icon: Building,
      color: "green"
    },
    {
      name: "Documentos",
      valor: stats.documentos.total,
      delta: `${stats.documentos.por_vencer} por vencer`,
      deltaType: stats.documentos.por_vencer > 0 ? "decrease" : "increase",
      descripcion: "Documentos gestionados",
      icon: FileText,
      color: "purple"
    },
    {
      name: "Auditorías",
      valor: stats.auditorias.total,
      delta: `${stats.auditorias.pendientes} pendientes`,
      deltaType: stats.auditorias.pendientes > 0 ? "decrease" : "increase",
      descripcion: "Auditorías del sistema",
      icon: Target,
      color: "orange"
    },
    {
      name: "Acciones",
      valor: stats.acciones.total,
      delta: `${stats.acciones.en_progreso} en progreso`,
      deltaType: "increase",
      descripcion: "Acciones en progreso",
      icon: AlertTriangle,
      color: "red"
    },
    {
      name: "Cumplimiento",
      valor: stats.cumplimiento.porcentaje,
      delta: stats.cumplimiento.tendencia === 'up' ? '+5.4%' : '-2.1%',
      deltaType: stats.cumplimiento.tendencia === 'up' ? 'increase' : 'decrease',
      descripcion: "Porcentaje de cumplimiento SGC",
      icon: CheckCircle,
      color: "emerald",
      unidad: '%'
    },
    {
      name: "Procesos SGC",
      valor: stats.procesos.total,
      delta: `${stats.procesos.criticos} críticos`,
      deltaType: stats.procesos.criticos > 0 ? "decrease" : "increase",
      descripcion: "Procesos del sistema",
      icon: Shield,
      color: "blue"
    },
    {
      name: "Actividad",
      valor: 156,
      delta: "+12",
      deltaType: "increase",
      descripcion: "Actividades este mes",
      icon: Activity,
      color: "purple"
    }
  ] : [];

  const actividadesRecientes: ActividadReciente[] = [
    {
      id: '1',
      tipo: 'usuario',
      titulo: 'Nuevo usuario registrado',
      descripcion: 'María García se unió al sistema',
      timestamp: 'Hace 2 horas',
      icon: Users,
      color: 'blue',
      usuario: 'María García'
    },
    {
      id: '2',
      tipo: 'documento',
      titulo: 'Documento actualizado',
      descripcion: 'Procedimiento de auditoría interna',
      timestamp: 'Hace 4 horas',
      icon: FileText,
      color: 'green'
    },
    {
      id: '3',
      tipo: 'auditoria',
      titulo: 'Auditoría programada',
      descripcion: 'Auditoría de calidad para el próximo mes',
      timestamp: 'Hace 1 día',
      icon: Target,
      color: 'orange'
    },
    {
      id: '4',
      tipo: 'proceso',
      titulo: 'Proceso SGC actualizado',
      descripcion: 'Proceso de gestión de documentos revisado',
      timestamp: 'Hace 2 días',
      icon: Shield,
      color: 'blue'
    },
    {
      id: '5',
      tipo: 'accion',
      titulo: 'Acción correctiva completada',
      descripcion: 'Acción CA-2024-001 marcada como completada',
      timestamp: 'Hace 3 días',
      icon: CheckCircle,
      color: 'green'
    }
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard ISOFlow4
        </h1>
        <p className="mt-2 text-gray-600">
          Indicadores clave de desempeño del Sistema de Gestión de Calidad
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sistema SGC Activo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            ISO 9001:2015
          </Badge>
        </div>
      </div>

      {/* Tarjetas de KPI principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicadoresData.map((indicador, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{indicador.name}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {indicador.valor}
                      {indicador.unidad && <span className="text-lg text-gray-500">{indicador.unidad}</span>}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{indicador.descripcion}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(indicador.color)}`}>
                  <indicador.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDeltaIcon(indicador.deltaType)}
                  <span className={`text-sm font-medium ${
                    indicador.deltaType === 'increase' ? 'text-green-600' : 
                    indicador.deltaType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {indicador.delta}
                  </span>
                </div>
                <span className="text-xs text-gray-500">vs mes anterior</span>
              </div>
              {indicador.meta && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>{Math.round((indicador.valor / indicador.meta) * 100)}%</span>
                  </div>
                  <Progress value={(indicador.valor / indicador.meta) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sección de actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actividadesRecientes.map((actividad) => (
              <div key={actividad.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 bg-${actividad.color}-100 rounded-full`}>
                  <actividad.icon className={`h-4 w-4 text-${actividad.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{actividad.titulo}</p>
                  <p className="text-sm text-gray-500">{actividad.descripcion}</p>
                  {actividad.usuario && (
                    <p className="text-xs text-gray-400">Por: {actividad.usuario}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400">{actividad.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sección de gráficos (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Tendencias SGC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráficos de tendencias próximamente</p>
              <p className="text-sm text-gray-400">Indicadores de cumplimiento y métricas SGC</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
