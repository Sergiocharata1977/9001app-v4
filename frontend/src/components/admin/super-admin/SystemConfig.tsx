import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, Shield, Globe, Server } from 'lucide-react';

const SystemConfig: React.FC = () => {
  console.log('⚙️ SystemConfig renderizado');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-2">Configuración global y parámetros del sistema</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Configuraciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Configuración de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">MongoDB Atlas URI</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border rounded-md"
                value="mongodb+srv://***:***@cluster0.mongodb.net/9001app"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Estado de Conexión</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Probar Conexión
            </Button>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">JWT Secret</label>
              <input 
                type="password" 
                className="w-full mt-1 p-2 border rounded-md"
                value="••••••••••••••••"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tiempo de Expiración de Token</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>24 horas</option>
                <option>12 horas</option>
                <option>7 días</option>
              </select>
            </div>
            <Button variant="outline" size="sm">
              Regenerar Secret
            </Button>
          </CardContent>
        </Card>

        {/* Servidor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Configuración del Servidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Puerto del Servidor</label>
              <input 
                type="number" 
                className="w-full mt-1 p-2 border rounded-md"
                value="5000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Modo de Desarrollo</label>
              <div className="mt-1">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Habilitar logs detallados</span>
                </label>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Reiniciar Servidor
            </Button>
          </CardContent>
        </Card>

        {/* Internacionalización */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configuración Regional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Idioma por Defecto</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>Español</option>
                <option>English</option>
                <option>Português</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Zona Horaria</label>
              <select className="w-full mt-1 p-2 border rounded-md">
                <option>America/Argentina/Buenos_Aires</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
            <Button variant="outline" size="sm">
              Aplicar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configuraciones Avanzadas */}
      <Card>
        <CardHeader>
          <CardTitle>Configuraciones Avanzadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Database className="w-6 h-6 mb-2" />
              <span>Backup Automático</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Shield className="w-6 h-6 mb-2" />
              <span>Configurar Firewall</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Server className="w-6 h-6 mb-2" />
              <span>Optimizar Rendimiento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfig;
