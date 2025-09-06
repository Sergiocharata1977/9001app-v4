import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Check, Copy, Loader2, RefreshCw, Settings } from 'lucide-react';
import React, { useState } from 'react';

// Tipos para el componente
interface IConfiguracionNumeracion {
  tipo_entidad: 'reunion' | 'auditoria' | 'hallazgo' | 'accion';
  prefijo: string;
  formato?: string;
  reiniciar_anual?: boolean;
  reiniciar_mensual?: boolean;
  configuracion_avanzada?: {
    longitud_numero?: number;
    incluir_ceros?: boolean;
    separador?: string;
    sufijo?: string;
  };
}

interface ICodigoGenerado {
  codigo: string;
  numero: number;
  proximo_codigo: string;
}

const NumeracionCorrelativa: React.FC = () => {
  // Estados del componente
  const [configuracion, setConfiguracion] = useState<IConfiguracionNumeracion>({
    tipo_entidad: 'reunion',
    prefijo: 'REV',
    formato: 'REV-{año}-{numero}',
    reiniciar_anual: true,
    reiniciar_mensual: false
  });
  
  const [codigoGenerado, setCodigoGenerado] = useState<ICodigoGenerado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  // Generar código correlativo
  const generarCodigo = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/numeracion-correlativa/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(configuracion)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCodigoGenerado({
          codigo: data.data.codigo,
          numero: data.data.numero,
          proximo_codigo: data.data.proximo_codigo
        });
        setSuccess('Código generado exitosamente');
      } else {
        setError(data.message || 'Error al generar código');
      }
    } catch (err) {
      setError('Error de conexión al generar código');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Copiar código al portapapeles
  const copiarCodigo = async () => {
    if (codigoGenerado) {
      try {
        await navigator.clipboard.writeText(codigoGenerado.codigo);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  // Generar código de ejemplo
  const generarEjemplo = async (tipo: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/numeracion-correlativa/ejemplo/${tipo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCodigoGenerado({
          codigo: data.data.codigo_ejemplo,
          numero: 1,
          proximo_codigo: data.data.proximo_codigo
        });
        setSuccess(`Código de ejemplo generado para ${tipo}`);
      } else {
        setError(data.message || 'Error al generar ejemplo');
      }
    } catch (err) {
      setError('Error de conexión al generar ejemplo');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar configuración
  const actualizarConfiguracion = (campo: string, valor: any) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Numeración Correlativa ISO 9001</h1>
          <p className="text-gray-600 mt-2">Genera códigos únicos y correlativos para documentos de calidad</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Estadísticas
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Generación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Generar Código Correlativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo de Entidad */}
            <div>
              <Label htmlFor="tipo_entidad">Tipo de Entidad</Label>
              <Select
                value={configuracion.tipo_entidad}
                onValueChange={(value) => actualizarConfiguracion('tipo_entidad', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reunion">Reunión de Dirección</SelectItem>
                  <SelectItem value="auditoria">Auditoría</SelectItem>
                  <SelectItem value="hallazgo">Hallazgo</SelectItem>
                  <SelectItem value="accion">Acción</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prefijo */}
            <div>
              <Label htmlFor="prefijo">Prefijo del Código</Label>
              <Input
                id="prefijo"
                value={configuracion.prefijo}
                onChange={(e) => actualizarConfiguracion('prefijo', e.target.value.toUpperCase())}
                placeholder="REV, AUD, HAL, ACC"
                maxLength={10}
              />
            </div>

            {/* Configuración Avanzada */}
            {mostrarConfiguracion && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold">Configuración Avanzada</h4>
                
                <div>
                  <Label htmlFor="formato">Formato del Código</Label>
                  <Input
                    id="formato"
                    value={configuracion.formato || ''}
                    onChange={(e) => actualizarConfiguracion('formato', e.target.value)}
                    placeholder="{prefijo}-{año}-{numero}"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Variables disponibles: {'{prefijo}'}, {'{año}'}, {'{mes}'}, {'{numero}'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="longitud_numero">Longitud del Número</Label>
                    <Input
                      id="longitud_numero"
                      type="number"
                      min="1"
                      max="10"
                      value={configuracion.configuracion_avanzada?.longitud_numero || 5}
                      onChange={(e) => actualizarConfiguracion('configuracion_avanzada', {
                        ...configuracion.configuracion_avanzada,
                        longitud_numero: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="separador">Separador</Label>
                    <Input
                      id="separador"
                      value={configuracion.configuracion_avanzada?.separador || '-'}
                      onChange={(e) => actualizarConfiguracion('configuracion_avanzada', {
                        ...configuracion.configuracion_avanzada,
                        separador: e.target.value
                      })}
                      maxLength={5}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={configuracion.reiniciar_anual || false}
                      onChange={(e) => actualizarConfiguracion('reiniciar_anual', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Reiniciar anualmente</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={configuracion.reiniciar_mensual || false}
                      onChange={(e) => actualizarConfiguracion('reiniciar_mensual', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Reiniciar mensualmente</span>
                  </label>
                </div>
              </div>
            )}

            {/* Botón de Generación */}
            <Button
              onClick={generarCodigo}
              disabled={loading || !configuracion.prefijo}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generar Código
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Resultado */}
        <Card>
          <CardHeader>
            <CardTitle>Código Generado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {codigoGenerado ? (
              <>
                {/* Código Principal */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Código Actual</p>
                      <p className="text-2xl font-bold text-blue-900">{codigoGenerado.codigo}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copiarCodigo}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      {copiado ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Número Secuencial</p>
                    <p className="text-lg font-semibold">{codigoGenerado.numero}</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Próximo Código</p>
                    <p className="text-lg font-semibold text-gray-700">{codigoGenerado.proximo_codigo}</p>
                  </div>
                </div>

                {/* Badges de Información */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {configuracion.tipo_entidad.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    Prefijo: {configuracion.prefijo}
                  </Badge>
                  {configuracion.reiniciar_anual && (
                    <Badge variant="outline" className="text-green-600">
                      Reinicio Anual
                    </Badge>
                  )}
                  {configuracion.reiniciar_mensual && (
                    <Badge variant="outline" className="text-blue-600">
                      Reinicio Mensual
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay código generado</p>
                <p className="text-sm">Genera un código para verlo aquí</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Panel de Ejemplos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => generarEjemplo('reunion')}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <div className="text-2xl">🏢</div>
              <div>
                <p className="font-medium">Reunión</p>
                <p className="text-xs text-gray-500">REV-2024-00001</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => generarEjemplo('auditoria')}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <div className="text-2xl">📋</div>
              <div>
                <p className="font-medium">Auditoría</p>
                <p className="text-xs text-gray-500">AUD-2024-00001</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => generarEjemplo('hallazgo')}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <div className="text-2xl">🔍</div>
              <div>
                <p className="font-medium">Hallazgo</p>
                <p className="text-xs text-gray-500">HAL-2024-00001</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => generarEjemplo('accion')}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <div className="text-2xl">⚡</div>
              <div>
                <p className="font-medium">Acción</p>
                <p className="text-xs text-gray-500">ACC-2024-00001</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumeracionCorrelativa;
