import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    AlertTriangle,
    Building2,
    CheckCircle,
    Database,
    Shield,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';

const SuperAdminDashboard: React.FC = () => {
  // Datos estáticos para prueba
  const stats = {
    totalOrganizations: 5,
    activeOrganizations: 4,
    totalUsers: 25,
    activeUsers: 22,
    systemStatus: 'OK' as const,
    databaseStatus: 'OK' as const,
    activeSessions: 15,
    lastBackup: '2024-01-15'
  };

  const getStatusBadge = (status: string) => {
    const config = {
      OK: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      WARNING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      ERROR: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.OK;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig.color} flex items-center`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  console.log('🎯 SuperAdminDashboard renderizado');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
          <p className="text-gray-600 mt-2">Vista general del sistema y métricas clave</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Reporte Completo
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeOrganizations} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              En tiempo real
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Sistema</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(stats.systemStatus)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Todo funcionando correctamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Estado de la Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">MongoDB Atlas</span>
                {getStatusBadge(stats.databaseStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Último Backup</span>
                <span className="text-sm text-muted-foreground">{stats.lastBackup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conexiones Activas</span>
                <span className="text-sm text-muted-foreground">24</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Nueva organización registrada</span>
                <span className="text-xs text-muted-foreground ml-auto">2 min</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Usuario actualizado</span>
                <span className="text-xs text-muted-foreground ml-auto">5 min</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Backup automático completado</span>
                <span className="text-xs text-muted-foreground ml-auto">1 hora</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Building2 className="w-6 h-6 mb-2" />
              <span>Gestionar Organizaciones</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 mb-2" />
              <span>Gestionar Usuarios</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Database className="w-6 h-6 mb-2" />
              <span>Configurar Base de Datos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
