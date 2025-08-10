import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../atoms/Card';
import { MainLayout } from '../../templates/MainLayout';
import { useAuthStore } from '../../../store/authStore';

/**
 * @component Dashboard
 * @description Página principal del dashboard
 * @returns {JSX.Element} Componente Dashboard
 */
export const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bienvenido al sistema de gestión ISO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-gray-600">Documentos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hallazgos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-gray-600">Pendientes de resolver</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auditorías</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600">Programadas este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">En progreso</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Nuevo documento agregado</span>
                  <span className="text-xs text-gray-500">Hace 2 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Hallazgo actualizado</span>
                  <span className="text-xs text-gray-500">Hace 4 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Auditoría programada</span>
                  <span className="text-xs text-gray-500">Hace 1 día</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {user?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Rol:</strong> {user?.role || 'N/A'}</p>
                <p><strong>Organización:</strong> {user?.organization?.name || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}; 