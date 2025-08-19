import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Users, 
  MapPin, 
  Target, 
  TrendingUp, 
  Award,
  User,
  Building2,
  GraduationCap
} from 'lucide-react';
import { 
  Personal, 
  RolComercial, 
  EspecialidadAgro, 
  ZonaVenta,
  ROLES_COMERCIALES,
  ESPECIALIDADES_AGRO,
  ZONAS_VENTA,
  getRolColor,
  getEspecialidadColor,
  calcularComision
} from '@/types/personal';

interface VendedorSelectorProps {
  vendedorAsignado?: Personal;
  onVendedorSelect: (vendedor: Personal | null) => void;
  especialidadRequerida?: EspecialidadAgro;
  zonaRequerida?: ZonaVenta;
  isDisabled?: boolean;
  showStats?: boolean;
}

interface VendedorStats {
  clientes_asignados: number;
  prospectos_asignados: number;
  oportunidades_activas: number;
  ventas_mes: number;
  meta_mes: number;
  porcentaje_cumplimiento: number;
}

const VendedorSelector: React.FC<VendedorSelectorProps> = ({
  vendedorAsignado,
  onVendedorSelect,
  especialidadRequerida,
  zonaRequerida,
  isDisabled = false,
  showStats = true
}) => {
  const [vendedores, setVendedores] = useState<Personal[]>([]);
  const [filteredVendedores, setFilteredVendedores] = useState<Personal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRol, setSelectedRol] = useState<RolComercial>('vendedor');
  const [selectedZona, setSelectedZona] = useState<ZonaVenta>('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<EspecialidadAgro>('');
  const [isLoading, setIsLoading] = useState(false);

  // Simular datos de estadísticas (en producción vendría de la API)
  const [vendedorStats, setVendedorStats] = useState<Record<string, VendedorStats>>({});

  useEffect(() => {
    cargarVendedores();
  }, []);

  useEffect(() => {
    filtrarVendedores();
  }, [vendedores, searchTerm, selectedRol, selectedZona, selectedEspecialidad]);

  const cargarVendedores = async () => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      const response = await fetch('/api/personal/comercial');
      const data = await response.json();
      
      if (data.success) {
        setVendedores(data.data);
        // Generar estadísticas simuladas
        generarStatsSimuladas(data.data);
      }
    } catch (error) {
      console.error('Error cargando vendedores:', error);
      // Datos de ejemplo para desarrollo
      const vendedoresEjemplo = generarVendedoresEjemplo();
      setVendedores(vendedoresEjemplo);
      generarStatsSimuladas(vendedoresEjemplo);
    } finally {
      setIsLoading(false);
    }
  };

  const generarVendedoresEjemplo = (): Personal[] => {
    return [
      {
        id: '1',
        organization_id: 1,
        nombre: 'Juan Pérez',
        apellido: 'García',
        email: 'juan.perez@empresa.com',
        telefono: '+54 11 1234-5678',
        clasificacion_comercial: 'comercial',
        rol_comercial: 'vendedor',
        zona_venta: 'Zona Norte',
        especialidad_agro: 'semillas',
        comision_venta: 5.0,
        meta_venta_mensual: 50000,
        fecha_inicio_comercial: '2024-01-01',
        estado: 'activo'
      },
      {
        id: '2',
        organization_id: 1,
        nombre: 'María López',
        apellido: 'Rodríguez',
        email: 'maria.lopez@empresa.com',
        telefono: '+54 11 2345-6789',
        clasificacion_comercial: 'comercial',
        rol_comercial: 'vendedor',
        zona_venta: 'Zona Sur',
        especialidad_agro: 'fertilizantes',
        comision_venta: 4.5,
        meta_venta_mensual: 45000,
        fecha_inicio_comercial: '2024-02-01',
        estado: 'activo'
      },
      {
        id: '3',
        organization_id: 1,
        nombre: 'Carlos Silva',
        apellido: 'Martínez',
        email: 'carlos.silva@empresa.com',
        telefono: '+54 11 3456-7890',
        clasificacion_comercial: 'comercial',
        rol_comercial: 'supervisor_comercial',
        zona_venta: 'Todas las zonas',
        especialidad_agro: 'general',
        comision_venta: 3.0,
        meta_venta_mensual: 200000,
        fecha_inicio_comercial: '2023-06-01',
        estado: 'activo'
      },
      {
        id: '4',
        organization_id: 1,
        nombre: 'Ana Torres',
        apellido: 'Fernández',
        email: 'ana.torres@empresa.com',
        telefono: '+54 11 4567-8901',
        clasificacion_comercial: 'comercial',
        rol_comercial: 'especialista_tecnico',
        zona_venta: 'Zona Este',
        especialidad_agro: 'maquinaria',
        comision_venta: 6.0,
        meta_venta_mensual: 75000,
        fecha_inicio_comercial: '2024-03-01',
        estado: 'activo'
      }
    ];
  };

  const generarStatsSimuladas = (vendedores: Personal[]) => {
    const stats: Record<string, VendedorStats> = {};
    
    vendedores.forEach(vendedor => {
      stats[vendedor.id] = {
        clientes_asignados: Math.floor(Math.random() * 20) + 5,
        prospectos_asignados: Math.floor(Math.random() * 15) + 3,
        oportunidades_activas: Math.floor(Math.random() * 8) + 2,
        ventas_mes: Math.floor(Math.random() * (vendedor.meta_venta_mensual || 50000)) + 10000,
        meta_mes: vendedor.meta_venta_mensual || 50000,
        porcentaje_cumplimiento: 0
      };
      
      // Calcular porcentaje de cumplimiento
      stats[vendedor.id].porcentaje_cumplimiento = Math.round(
        (stats[vendedor.id].ventas_mes / stats[vendedor.id].meta_mes) * 100
      );
    });
    
    setVendedorStats(stats);
  };

  const filtrarVendedores = () => {
    let filtered = vendedores.filter(vendedor => 
      vendedor.clasificacion_comercial === 'comercial' && 
      vendedor.rol_comercial !== 'ninguno'
    );

    // Filtrar por rol
    if (selectedRol && selectedRol !== 'ninguno') {
      filtered = filtered.filter(vendedor => vendedor.rol_comercial === selectedRol);
    }

    // Filtrar por zona
    if (selectedZona) {
      filtered = filtered.filter(vendedor => 
        vendedor.zona_venta === selectedZona || vendedor.zona_venta === 'Todas las zonas'
      );
    }

    // Filtrar por especialidad
    if (selectedEspecialidad) {
      filtered = filtered.filter(vendedor => 
        vendedor.especialidad_agro === selectedEspecialidad || vendedor.especialidad_agro === 'general'
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(vendedor =>
        `${vendedor.nombre} ${vendedor.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.zona_venta?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priorizar vendedores que coincidan con especialidad requerida
    if (especialidadRequerida) {
      filtered.sort((a, b) => {
        const aMatch = a.especialidad_agro === especialidadRequerida;
        const bMatch = b.especialidad_agro === especialidadRequerida;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    // Priorizar vendedores que coincidan con zona requerida
    if (zonaRequerida) {
      filtered.sort((a, b) => {
        const aMatch = a.zona_venta === zonaRequerida;
        const bMatch = b.zona_venta === zonaRequerida;
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    setFilteredVendedores(filtered);
  };

  const handleVendedorSelect = (vendedor: Personal) => {
    onVendedorSelect(vendedor);
  };

  const handleClearSelection = () => {
    onVendedorSelect(null);
  };

  const getInitials = (nombre: string, apellido?: string) => {
    const first = nombre.charAt(0).toUpperCase();
    const second = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${first}${second}`;
  };

  const getCumplimientoColor = (porcentaje: number) => {
    if (porcentaje >= 100) return 'text-green-600';
    if (porcentaje >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Vendedor Asignado Actual */}
      {vendedorAsignado && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <User className="h-5 w-5" />
              Vendedor Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={vendedorAsignado.imagen} />
                <AvatarFallback>
                  {getInitials(vendedorAsignado.nombre, vendedorAsignado.apellido)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">
                  {vendedorAsignado.nombre} {vendedorAsignado.apellido}
                </h4>
                <p className="text-sm text-muted-foreground">{vendedorAsignado.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={getRolColor(vendedorAsignado.rol_comercial as RolComercial)}>
                    {ROLES_COMERCIALES[vendedorAsignado.rol_comercial as RolComercial]}
                  </Badge>
                  <Badge variant="outline">{vendedorAsignado.zona_venta}</Badge>
                  <Badge className={getEspecialidadColor(vendedorAsignado.especialidad_agro as EspecialidadAgro)}>
                    {ESPECIALIDADES_AGRO[vendedorAsignado.especialidad_agro as EspecialidadAgro]}
                  </Badge>
                </div>
              </div>
              {!isDisabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Cambiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selector de Vendedores */}
      {(!vendedorAsignado || !isDisabled) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Seleccionar Vendedor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre, email o zona..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={selectedRol} onValueChange={(value) => setSelectedRol(value as RolComercial)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="supervisor_comercial">Supervisor</SelectItem>
                    <SelectItem value="especialista_tecnico">Especialista</SelectItem>
                    <SelectItem value="gerente_comercial">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zona</Label>
                <Select value={selectedZona} onValueChange={(value) => setSelectedZona(value as ZonaVenta)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las zonas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las zonas</SelectItem>
                    {ZONAS_VENTA.map((zona) => (
                      <SelectItem key={zona} value={zona}>
                        {zona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Especialidad</Label>
                <Select value={selectedEspecialidad} onValueChange={(value) => setSelectedEspecialidad(value as EspecialidadAgro)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las especialidades</SelectItem>
                    {Object.entries(ESPECIALIDADES_AGRO).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Vendedores */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Cargando vendedores...</p>
                </div>
              ) : filteredVendedores.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron vendedores con los filtros aplicados</p>
                </div>
              ) : (
                filteredVendedores.map((vendedor) => {
                  const stats = vendedorStats[vendedor.id];
                  const isRecomendado = 
                    (especialidadRequerida && vendedor.especialidad_agro === especialidadRequerida) ||
                    (zonaRequerida && vendedor.zona_venta === zonaRequerida);

                  return (
                    <Card 
                      key={vendedor.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isRecomendado ? 'border-blue-200 bg-blue-50' : ''
                      }`}
                      onClick={() => !isDisabled && handleVendedorSelect(vendedor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={vendedor.imagen} />
                            <AvatarFallback>
                              {getInitials(vendedor.nombre, vendedor.apellido)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">
                                {vendedor.nombre} {vendedor.apellido}
                              </h4>
                              {isRecomendado && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  Recomendado
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {vendedor.email} • {vendedor.telefono}
                            </p>
                            
                            <div className="flex gap-2 mb-2">
                              <Badge className={getRolColor(vendedor.rol_comercial as RolComercial)}>
                                {ROLES_COMERCIALES[vendedor.rol_comercial as RolComercial]}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {vendedor.zona_venta}
                              </Badge>
                              <Badge className={getEspecialidadColor(vendedor.especialidad_agro as EspecialidadAgro)}>
                                {ESPECIALIDADES_AGRO[vendedor.especialidad_agro as EspecialidadAgro]}
                              </Badge>
                            </div>

                            {showStats && stats && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Clientes:</span>
                                  <p className="font-medium">{stats.clientes_asignados}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Prospectos:</span>
                                  <p className="font-medium">{stats.prospectos_asignados}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Oportunidades:</span>
                                  <p className="font-medium">{stats.oportunidades_activas}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Cumplimiento:</span>
                                  <p className={`font-medium ${getCumplimientoColor(stats.porcentaje_cumplimiento)}`}>
                                    {stats.porcentaje_cumplimiento}%
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Comisión</p>
                            <p className="font-semibold text-green-600">{vendedor.comision_venta}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendedorSelector;
