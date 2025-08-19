import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Users, 
  Target, 
  DollarSign, 
  MapPin, 
  Award,
  TrendingUp,
  Calendar,
  Building2,
  GraduationCap
} from 'lucide-react';
import { 
  Personal, 
  RolComercial, 
  ClasificacionComercial, 
  EspecialidadAgro, 
  ZonaVenta,
  ROLES_COMERCIALES,
  CLASIFICACIONES_COMERCIALES,
  ESPECIALIDADES_AGRO,
  ZONAS_VENTA,
  getRolColor,
  getEspecialidadColor,
  getComisionConfig,
  calcularComision
} from '@/types/personal';

interface ClasificacionComercialProps {
  personal: Personal;
  onUpdate: (personal: Personal) => void;
  isEditing?: boolean;
}

const ClasificacionComercial: React.FC<ClasificacionComercialProps> = ({
  personal,
  onUpdate,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    clasificacion_comercial: personal.clasificacion_comercial || 'general',
    rol_comercial: personal.rol_comercial || 'ninguno',
    zona_venta: personal.zona_venta || '',
    comision_venta: personal.comision_venta || 0,
    meta_venta_mensual: personal.meta_venta_mensual || 0,
    fecha_inicio_comercial: personal.fecha_inicio_comercial || '',
    supervisor_comercial_id: personal.supervisor_comercial_id || undefined,
    especialidad_agro: personal.especialidad_agro || 'general'
  });

  const [ventasSimuladas, setVentasSimuladas] = useState(0);

  // Calcular comisión simulada
  const comisionSimulada = calcularComision(
    ventasSimuladas,
    formData.meta_venta_mensual,
    formData.rol_comercial as RolComercial,
    formData.especialidad_agro as EspecialidadAgro
  );

  // Obtener configuración de comisión
  const configComision = getComisionConfig(formData.rol_comercial as RolComercial);

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Actualizar personal
    onUpdate({
      ...personal,
      ...newFormData
    });
  };

  const isComercial = formData.clasificacion_comercial === 'comercial';
  const hasRolComercial = formData.rol_comercial !== 'ninguno';

  return (
    <div className="space-y-6">
      {/* Clasificación Comercial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Clasificación Comercial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clasificacion_comercial">Clasificación</Label>
              <Select
                value={formData.clasificacion_comercial}
                onValueChange={(value) => handleInputChange('clasificacion_comercial', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar clasificación" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASIFICACIONES_COMERCIALES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol_comercial">Rol Comercial</Label>
              <Select
                value={formData.rol_comercial}
                onValueChange={(value) => handleInputChange('rol_comercial', value)}
                disabled={!isEditing || !isComercial}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES_COMERCIALES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isComercial && hasRolComercial && (
            <>
              <Separator />
              
              {/* Información Comercial */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zona_venta">Zona de Venta</Label>
                  <Select
                    value={formData.zona_venta}
                    onValueChange={(value) => handleInputChange('zona_venta', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONAS_VENTA.map((zona) => (
                        <SelectItem key={zona} value={zona}>
                          {zona}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidad_agro">Especialidad Agro</Label>
                  <Select
                    value={formData.especialidad_agro}
                    onValueChange={(value) => handleInputChange('especialidad_agro', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ESPECIALIDADES_AGRO).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio_comercial">Fecha Inicio Comercial</Label>
                  <Input
                    type="date"
                    value={formData.fecha_inicio_comercial}
                    onChange={(e) => handleInputChange('fecha_inicio_comercial', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Comisiones */}
      {isComercial && hasRolComercial && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configuración de Comisiones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meta_venta_mensual">Meta de Venta Mensual ($)</Label>
                <Input
                  type="number"
                  value={formData.meta_venta_mensual}
                  onChange={(e) => handleInputChange('meta_venta_mensual', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comision_venta">Comisión Personalizada (%)</Label>
                <Input
                  type="number"
                  value={formData.comision_venta}
                  onChange={(e) => handleInputChange('comision_venta', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Configuración por Rol */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Configuración por Rol: {ROLES_COMERCIALES[formData.rol_comercial as RolComercial]}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Comisión Base:</span>
                  <p className="font-medium">{configComision.comision_base}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Comisión Meta:</span>
                  <p className="font-medium">{configComision.comision_meta}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Comisión Exceso:</span>
                  <p className="font-medium">{configComision.comision_exceso}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Meta Mínima:</span>
                  <p className="font-medium">${configComision.meta_minima.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Simulador de Comisiones */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Simulador de Comisiones</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ventas_simuladas">Ventas Simuladas ($)</Label>
                  <Input
                    type="number"
                    value={ventasSimuladas}
                    onChange={(e) => setVentasSimuladas(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Comisión Calculada</Label>
                  <div className="text-2xl font-bold text-green-600">
                    ${comisionSimulada.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Clasificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Resumen de Clasificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Clasificación</p>
                <p className="font-medium">{CLASIFICACIONES_COMERCIALES[formData.clasificacion_comercial as ClasificacionComercial]}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Rol Comercial</p>
                <Badge className={getRolColor(formData.rol_comercial as RolComercial)}>
                  {ROLES_COMERCIALES[formData.rol_comercial as RolComercial]}
                </Badge>
              </div>
            </div>

            {isComercial && hasRolComercial && (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Zona de Venta</p>
                    <p className="font-medium">{formData.zona_venta || 'No asignada'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Especialidad</p>
                    <Badge className={getEspecialidadColor(formData.especialidad_agro as EspecialidadAgro)}>
                      {ESPECIALIDADES_AGRO[formData.especialidad_agro as EspecialidadAgro]}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Meta Mensual</p>
                    <p className="font-medium">${formData.meta_venta_mensual.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Comisión</p>
                    <p className="font-medium">{formData.comision_venta}%</p>
                  </div>
                </div>

                {formData.fecha_inicio_comercial && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Inicio Comercial</p>
                      <p className="font-medium">{new Date(formData.fecha_inicio_comercial).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClasificacionComercial;
