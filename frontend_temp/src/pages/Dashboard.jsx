import React from 'react';
import { 
  Users, 
  Building, 
  FileText, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  // Datos de ejemplo para los indicadores principales
  const indicadoresData = [
    {
      name: "Usuarios",
      valor: 24,
      delta: "+8.1%",
      deltaType: "increase",
      descripcion: "Total de usuarios registrados",
      icon: Users,
      color: "blue"
    },
    {
      name: "Departamentos",
      valor: 12,
      delta: "+2",
      deltaType: "increase",
      descripcion: "Departamentos activos",
      icon: Building,
      color: "green"
    },
    {
      name: "Documentos",
      valor: 156,
      delta: "+15",
      deltaType: "increase",
      descripcion: "Documentos gestionados",
      icon: FileText,
      color: "purple"
    },
    {
      name: "Auditorías",
      valor: 8,
      delta: "-2",
      deltaType: "decrease",
      descripcion: "Auditorías pendientes",
      icon: Target,
      color: "orange"
    },
    {
      name: "Acciones",
      valor: 23,
      delta: "+5",
      deltaType: "increase",
      descripcion: "Acciones en progreso",
      icon: AlertTriangle,
      color: "red"
    },
    {
      name: "Cumplimiento",
      valor: 89.2,
      delta: "+5.4%",
      deltaType: "increase",
      descripcion: "Porcentaje de cumplimiento",
      icon: CheckCircle,
      color: "emerald"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      purple: 'bg-purple-500 text-purple-100',
      orange: 'bg-orange-500 text-orange-100',
      red: 'bg-red-500 text-red-100',
      emerald: 'bg-emerald-500 text-emerald-100'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-100';
  };

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
      </div>

      {/* Tarjetas de KPI principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicadoresData.map((indicador, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{indicador.name}</p>
                <p className="text-3xl font-bold text-gray-900">{indicador.valor}</p>
                <p className="text-sm text-gray-500">{indicador.descripcion}</p>
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(indicador.color)}`}>
                <indicador.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                indicador.deltaType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {indicador.delta}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de actividad reciente */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
              <p className="text-sm text-gray-500">María García se unió al sistema</p>
            </div>
            <span className="text-xs text-gray-400">Hace 2 horas</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Documento actualizado</p>
              <p className="text-sm text-gray-500">Procedimiento de auditoría interna</p>
            </div>
            <span className="text-xs text-gray-400">Hace 4 horas</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-full">
              <Target className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Auditoría programada</p>
              <p className="text-sm text-gray-500">Auditoría de calidad para el próximo mes</p>
            </div>
            <span className="text-xs text-gray-400">Hace 1 día</span>
          </div>
        </div>
      </div>

      {/* Sección de gráficos (placeholder) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendencias</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráficos de tendencias próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 