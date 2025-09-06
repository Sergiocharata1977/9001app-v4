import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcesoSgcFiltros } from '@/types/procesos';
import {
    Download,
    Filter,
    RefreshCw,
    Search,
    Upload,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProcesosFiltrosProps {
  filtros: ProcesoSgcFiltros;
  onFiltrosChange: (filtros: ProcesoSgcFiltros) => void;
  onExport?: () => void;
  onImport?: () => void;
}

const ProcesosFiltros: React.FC<ProcesosFiltrosProps> = ({
  filtros,
  onFiltrosChange,
  onExport,
  onImport
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState<ProcesoSgcFiltros>(filtros);
  const [mostrarAvanzados, setMostrarAvanzados] = useState<boolean>(false);

  useEffect(() => {
    setFiltrosLocales(filtros);
  }, [filtros]);

  const aplicarFiltros = () => {
    onFiltrosChange(filtrosLocales);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios: ProcesoSgcFiltros = {
      search: '',
      tipo: undefined,
      categoria: undefined,
      estado: undefined,
      nivel_critico: undefined,
      departamento_id: undefined,
      responsable_id: undefined
    };
    setFiltrosLocales(filtrosLimpios);
    onFiltrosChange(filtrosLimpios);
  };

  const actualizarFiltro = (campo: keyof ProcesoSgcFiltros, valor: any) => {
    setFiltrosLocales(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const filtrosActivos = Object.values(filtrosLocales).filter(valor => 
    valor !== undefined && valor !== '' && valor !== null
  ).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
            {filtrosActivos > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filtrosActivos} activos
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarAvanzados(!mostrarAvanzados)}
            >
              {mostrarAvanzados ? 'Ocultar' : 'Mostrar'} Avanzados
            </Button>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
            {onImport && (
              <Button variant="outline" size="sm" onClick={onImport}>
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="search">Búsqueda</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Buscar procesos..."
                value={filtrosLocales.search || ''}
                onChange={(e) => actualizarFiltro('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={filtrosLocales.tipo || ''}
              onValueChange={(valor) => actualizarFiltro('tipo', valor || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                <SelectItem value="estrategico">Estratégico</SelectItem>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="apoyo">Apoyo</SelectItem>
                <SelectItem value="mejora">Mejora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filtrosLocales.estado || ''}
              onValueChange={(valor) => actualizarFiltro('estado', valor || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="obsoleto">Obsoleto</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Avanzados */}
        {mostrarAvanzados && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={filtrosLocales.categoria || ''}
                onValueChange={(valor) => actualizarFiltro('categoria', valor || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  <SelectItem value="proceso">Proceso</SelectItem>
                  <SelectItem value="subproceso">Subproceso</SelectItem>
                  <SelectItem value="actividad">Actividad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel_critico">Nivel Crítico</Label>
              <Select
                value={filtrosLocales.nivel_critico || ''}
                onValueChange={(valor) => actualizarFiltro('nivel_critico', valor || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los niveles</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                placeholder="ID del departamento"
                value={filtrosLocales.departamento_id || ''}
                onChange={(e) => actualizarFiltro('departamento_id', e.target.value || undefined)}
              />
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={aplicarFiltros} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
            
            <Button variant="outline" onClick={limpiarFiltros}>
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
          </div>

          {filtrosActivos > 0 && (
            <div className="text-sm text-gray-600">
              {filtrosActivos} filtro{filtrosActivos !== 1 ? 's' : ''} activo{filtrosActivos !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcesosFiltros;
