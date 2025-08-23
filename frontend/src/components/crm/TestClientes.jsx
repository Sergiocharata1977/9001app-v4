import React, { useState, useEffect } from 'react';
import { crmService } from '@/services/crmService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const TestClientes = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const testService = async () => {
    setLoading(true);
    setTestResult('Iniciando prueba...\n');
    
    try {
      // Prueba 1: Verificar usuario
      setTestResult(prev => prev + `👤 Usuario: ${JSON.stringify(user, null, 2)}\n`);
      
      // Prueba 2: Llamar al servicio
      setTestResult(prev => prev + '📡 Llamando a crmService.getClientes()...\n');
      const response = await crmService.getClientes();
      
      setTestResult(prev => prev + `✅ Respuesta recibida: ${JSON.stringify(response, null, 2)}\n`);
      
      // Prueba 3: Verificar estructura
      if (Array.isArray(response)) {
        setTestResult(prev => prev + `✅ Es array con ${response.length} elementos\n`);
      } else if (response && response.data) {
        setTestResult(prev => prev + `✅ Tiene propiedad data: ${JSON.stringify(response.data, null, 2)}\n`);
      } else {
        setTestResult(prev => prev + `⚠️ Formato inesperado\n`);
      }
      
    } catch (error) {
      setTestResult(prev => prev + `❌ Error: ${error.message}\n`);
      console.error('Error en prueba:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prueba de Servicio CRM</h1>
      
      <Button 
        onClick={testService} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Probando...' : 'Ejecutar Prueba'}
      </Button>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
      </div>
    </div>
  );
};

export default TestClientes;
