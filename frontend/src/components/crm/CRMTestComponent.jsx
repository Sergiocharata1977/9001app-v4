import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users, 
  Target, 
  Activity, 
  Briefcase 
} from 'lucide-react';
import { crmService } from '@/services/crmService';

const CRMTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Verificar servicio de clientes
      try {
        const clientesResponse = await crmService.getClientes();
        results.clientes = {
          success: true,
          message: `✅ Clientes cargados: ${clientesResponse.data?.length || 0} registros`,
          data: clientesResponse.data
        };
      } catch (error) {
        results.clientes = {
          success: false,
          message: `❌ Error cargando clientes: ${error.message}`,
          error: error
        };
      }

      // Test 2: Verificar servicio de estadísticas
      try {
        const statsResponse = await crmService.getEstadisticas();
        results.estadisticas = {
          success: true,
          message: `✅ Estadísticas cargadas correctamente`,
          data: statsResponse.data
        };
      } catch (error) {
        results.estadisticas = {
          success: false,
          message: `❌ Error cargando estadísticas: ${error.message}`,
          error: error
        };
      }

      // Test 3: Verificar servicio de vendedores
      try {
        const vendedoresResponse = await crmService.getVendedores();
        results.vendedores = {
          success: true,
          message: `✅ Vendedores cargados: ${vendedoresResponse.data?.length || 0} registros`,
          data: vendedoresResponse.data
        };
      } catch (error) {
        results.vendedores = {
          success: false,
          message: `❌ Error cargando vendedores: ${error.message}`,
          error: error
        };
      }

      // Test 4: Verificar servicio de oportunidades
      try {
        const oportunidadesResponse = await crmService.getOportunidades();
        results.oportunidades = {
          success: true,
          message: `✅ Oportunidades cargadas: ${oportunidadesResponse.data?.length || 0} registros`,
          data: oportunidadesResponse.data
        };
      } catch (error) {
        results.oportunidades = {
          success: false,
          message: `❌ Error cargando oportunidades: ${error.message}`,
          error: error
        };
      }

      // Test 5: Verificar servicio de actividades
      try {
        const actividadesResponse = await crmService.getActividades();
        results.actividades = {
          success: true,
          message: `✅ Actividades cargadas: ${actividadesResponse.data?.length || 0} registros`,
          data: actividadesResponse.data
        };
      } catch (error) {
        results.actividades = {
          success: false,
          message: `❌ Error cargando actividades: ${error.message}`,
          error: error
        };
      }

    } catch (error) {
      console.error('Error general en pruebas:', error);
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getTestIcon = (success) => {
    if (success === undefined) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    return success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getTestColor = (success) => {
    if (success === undefined) return 'bg-gray-100 text-gray-600';
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pruebas del Sistema CRM</h1>
          <p className="text-gray-600">Verificación de funcionalidades del CRM</p>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar Pruebas'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getTestIcon(testResults.clientes?.success)}
              <span>Clientes</span>
              <Users className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${getTestColor(testResults.clientes?.success)}`}>
              <p className="text-sm font-medium">
                {testResults.clientes?.message || 'No ejecutado'}
              </p>
            </div>
            {testResults.clientes?.data && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {testResults.clientes.data.length} registros
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getTestIcon(testResults.estadisticas?.success)}
              <span>Estadísticas</span>
              <Target className="w-5 h-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${getTestColor(testResults.estadisticas?.success)}`}>
              <p className="text-sm font-medium">
                {testResults.estadisticas?.message || 'No ejecutado'}
              </p>
            </div>
            {testResults.estadisticas?.data && (
              <div className="mt-3 space-y-1">
                <div className="text-xs text-gray-600">
                  Total Clientes: {testResults.estadisticas.data.total_clientes || 0}
                </div>
                <div className="text-xs text-gray-600">
                  Oportunidades: {testResults.estadisticas.data.total_oportunidades || 0}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de Vendedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getTestIcon(testResults.vendedores?.success)}
              <span>Vendedores</span>
              <Briefcase className="w-5 h-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${getTestColor(testResults.vendedores?.success)}`}>
              <p className="text-sm font-medium">
                {testResults.vendedores?.message || 'No ejecutado'}
              </p>
            </div>
            {testResults.vendedores?.data && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {testResults.vendedores.data.length} registros
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de Oportunidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getTestIcon(testResults.oportunidades?.success)}
              <span>Oportunidades</span>
              <Target className="w-5 h-5 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${getTestColor(testResults.oportunidades?.success)}`}>
              <p className="text-sm font-medium">
                {testResults.oportunidades?.message || 'No ejecutado'}
              </p>
            </div>
            {testResults.oportunidades?.data && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {testResults.oportunidades.data.length} registros
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de Actividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getTestIcon(testResults.actividades?.success)}
              <span>Actividades</span>
              <Activity className="w-5 h-5 text-cyan-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg ${getTestColor(testResults.actividades?.success)}`}>
              <p className="text-sm font-medium">
                {testResults.actividades?.message || 'No ejecutado'}
              </p>
            </div>
            {testResults.actividades?.data && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {testResults.actividades.data.length} registros
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Pruebas */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    result.success ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTestIcon(result.success)}
                  </div>
                  <p className="text-xs font-medium capitalize">{key}</p>
                  <p className={`text-xs ${
                    result.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.success ? 'Exitoso' : 'Falló'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRMTestComponent;
