import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Settings,
  Power,
  PowerOff
} from 'lucide-react';
import { 
  SECURITY_CONFIG, 
  isSecuritySystemEnabled,
  disableAllSecuritySystems,
  enableAllSecuritySystems 
} from '@/config/securityConfig';

/**
 * Componente de control para sistemas de seguridad
 * Permite activar/desactivar sistemas de seguridad de manera visual
 */
export function SecuritySystemsControl() {
  const [config, setConfig] = useState(SECURITY_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Actualizar configuración cuando cambie
  useEffect(() => {
    setConfig(SECURITY_CONFIG);
  }, []);

  const handleToggleSystem = (systemName) => {
    const newConfig = { ...config };
    newConfig[systemName] = !newConfig[systemName];
    setConfig(newConfig);
    
    // Actualizar la configuración global
    SECURITY_CONFIG[systemName] = newConfig[systemName];
    
    console.log(`Sistema ${systemName} ${newConfig[systemName] ? 'activado' : 'desactivado'}`);
  };

  const handleDisableAll = () => {
    disableAllSecuritySystems();
    setConfig({ ...SECURITY_CONFIG });
  };

  const handleEnableAll = () => {
    enableAllSecuritySystems();
    setConfig({ ...SECURITY_CONFIG });
  };

  const getSystemStatus = () => {
    const enabledCount = Object.values(config).filter(Boolean).length;
    const totalCount = Object.keys(config).length;
    return { enabledCount, totalCount };
  };

  const { enabledCount, totalCount } = getSystemStatus();

  const systemConfigs = [
    {
      key: 'ENABLE_ERROR_HANDLER',
      name: 'Manejo de Errores Centralizado',
      description: 'Sistema de manejo de errores centralizado con clasificación automática',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      key: 'ENABLE_TOAST_STANDARDIZATION',
      name: 'Estandarización de Toast',
      description: 'Estandarización del uso de toast con control de bucles infinitos',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    },
    {
      key: 'ENABLE_REACT_QUERY',
      name: 'React Query',
      description: 'React Query para manejo optimizado del estado del servidor',
      icon: Settings,
      color: 'bg-blue-500'
    },
    {
      key: 'ENABLE_OPTIMIZED_PAGINATION',
      name: 'Paginación Optimizada',
      description: 'Sistema de paginación optimizado con filtros',
      icon: Settings,
      color: 'bg-green-500'
    },
    {
      key: 'ENABLE_REACT_MEMO',
      name: 'React.memo',
      description: 'Optimización de componentes con React.memo',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      key: 'ENABLE_OPTIMIZATION_HOOKS',
      name: 'Hooks de Optimización',
      description: 'useCallback y useMemo para optimización',
      icon: Settings,
      color: 'bg-indigo-500'
    },
    {
      key: 'ENABLE_LOADING_STATES',
      name: 'Estados de Carga',
      description: 'Feedback visual durante operaciones',
      icon: Settings,
      color: 'bg-orange-500'
    },
    {
      key: 'ENABLE_FORM_VALIDATION',
      name: 'Validación de Formularios',
      description: 'Sistema de validación de formularios',
      icon: Settings,
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Control de Sistemas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Estado general de los sistemas de seguridad
              </p>
              <div className="flex items-center gap-2">
                <Badge variant={enabledCount > 0 ? "default" : "secondary"}>
                  {enabledCount} de {totalCount} activos
                </Badge>
                {enabledCount === 0 && (
                  <Badge variant="destructive">Todos desactivados</Badge>
                )}
                {enabledCount === totalCount && (
                  <Badge variant="default">Todos activos</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisableAll}
                className="flex items-center gap-1"
              >
                <PowerOff className="h-4 w-4" />
                Desactivar Todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnableAll}
                className="flex items-center gap-1"
              >
                <Power className="h-4 w-4" />
                Activar Todo
              </Button>
            </div>
          </div>

          {/* Alerta de despliegue */}
          {enabledCount === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Modo Despliegue:</strong> Todos los sistemas de seguridad están desactivados. 
                El proyecto está listo para subir a GitHub y desplegar en el servidor.
              </AlertDescription>
            </Alert>
          )}

          {enabledCount > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Modo Desarrollo:</strong> Hay {enabledCount} sistemas de seguridad activos. 
                Desactiva todos los sistemas para el despliegue.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Lista de sistemas */}
      <div className="grid gap-4">
        {systemConfigs.map((system) => {
          const Icon = system.icon;
          const isEnabled = config[system.key];
          
          return (
            <Card key={system.key} className={isEnabled ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${system.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">
                          {system.name}
                        </Label>
                        <Badge variant={isEnabled ? "default" : "secondary"}>
                          {isEnabled ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {system.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleToggleSystem(system.key)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Información de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Para desarrollo local:</strong> Activa todos los sistemas para tener todas las funcionalidades.
          </p>
          <p>
            <strong>Para despliegue:</strong> Desactiva todos los sistemas para evitar problemas de compatibilidad.
          </p>
          <p>
            <strong>Configuración actual:</strong> Los cambios se aplican inmediatamente y persisten durante la sesión.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 