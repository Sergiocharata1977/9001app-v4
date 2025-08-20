import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Activity, DollarSign, CheckCircle } from 'lucide-react';

const CRMSimpleTest = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-2">🚀 CRM Pro - Test Simple</h1>
        <p className="text-gray-600">Componente de prueba para verificar que el CRM funciona</p>
      </div>

      {/* Tarjetas de prueba */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Users className="w-5 h-5 mr-2" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">24</div>
            <p className="text-xs text-gray-500">Clientes activos</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Target className="w-5 h-5 mr-2" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-gray-500">En pipeline</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Activity className="w-5 h-5 mr-2" />
              Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-gray-500">Pendientes hoy</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 hover:border-red-300 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <DollarSign className="w-5 h-5 mr-2" />
              Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$45K</div>
            <p className="text-xs text-gray-500">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de éxito */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">¡CRM Funcionando!</h3>
              <p className="text-green-600">El sistema CRM está operativo y listo para usar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de navegación */}
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          className="border-red-200 text-red-700 hover:bg-red-50"
          onClick={() => window.history.back()}
        >
          ← Volver
        </Button>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => window.location.href = '/app/crm'}
        >
          Ir al Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CRMSimpleTest;
