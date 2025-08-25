import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  DollarSign, 
  Calendar, 
  User, 
  Building2, 
  AlertTriangle,
  Save,
  Trash2,
  Eye,
  Edit,
  TrendingUp,
  Percent
} from 'lucide-react';
import { crmService } from '@/services/crmService';

const ETAPAS_OPORTUNIDAD = [
  { value: 'prospeccion', label: 'Prospección', probabilidad: 10, color: '#6B7280' },
  { value: 'calificacion', label: 'Calificación', probabilidad: 25, color: '#F59E0B' },
  { value: 'propuesta', label: 'Propuesta', probabilidad: 50, color: '#3B82F6' },
  { value: 'negociacion', label: 'Negociación', probabilidad: 75, color: '#8B5CF6' },
  { value: 'cierre', label: 'Cierre', probabilidad: 100, color: '#10B981' }
];

const TIPOS_OPORTUNIDAD = [
  { value: 'nueva', label: 'Nueva' },
  { value: 'renovacion', label: 'Renovación' },
  { value: 'ampliacion', label: 'Ampliación' },
  { value: 'referido', label: 'Referido' }
];

const OportunidadModal = ({ isOpen, onClose, onSave, oportunidad, mode = 'create' }) => {
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const isDeleteMode = mode === 'delete';

  const initialFormData = {
    cliente_id: '',
    vendedor_id: '',
    supervisor_id: '',
    tipo_oportunidad: 'nueva',
    etapa: 'prospeccion',
    probabilidad: 10,
    valor_estimado: '',
    moneda: 'MXN',
    fecha_cierre_esperada: '',
    descripcion: '',
    estrategia_venta: '',
    competidores: '',
    recursos_requeridos: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      if (oportunidad && (isEditMode || isViewMode)) {
        setFormData({
          cliente_id: oportunidad.cliente_id || '',
          vendedor_id: oportunidad.vendedor_id || '',
          supervisor_id: oportunidad.supervisor_id || '',
          tipo_oportunidad: oportunidad.tipo_oportunidad || 'nueva',
          etapa: oportunidad.etapa || 'prospeccion',
          probabilidad: oportunidad.probabilidad || 10,
          valor_estimado: oportunidad.valor_estimado || '',
          moneda: oportunidad.moneda || 'MXN',
          fecha_cierre_esperada: oportunidad.fecha_cierre_esperada || '',
          descripcion: oportunidad.descripcion || '',
          estrategia_venta: oportunidad.estrategia_venta || '',
          competidores: oportunidad.competidores || '',
          recursos_requeridos: oportunidad.recursos_requeridos || '',
          observaciones: oportunidad.observaciones || ''
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, oportunidad, mode]);

  const cargarDatos = async () => {
    try {
      const [clientesRes, vendedoresRes] = await Promise.all([
        crmService.getClientes(),
        crmService.getVendedores()
      ]);
      setClientes(clientesRes.data);
      setVendedores(vendedoresRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cliente_id) {
      newErrors.cliente_id = 'Debe seleccionar un cliente';
    }

    if (!formData.vendedor_id) {
      newErrors.vendedor_id = 'Debe seleccionar un vendedor';
    }

    if (!formData.descripcion?.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (formData.valor_estimado && formData.valor_estimado <= 0) {
      newErrors.valor_estimado = 'El valor debe ser mayor a 0';
    }

    if (formData.fecha_cierre_esperada && new Date(formData.fecha_cierre_esperada) < new Date()) {
      newErrors.fecha_cierre_esperada = 'La fecha de cierre no puede ser anterior a hoy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      
      if (isEditMode) {
        response = await crmService.updateOportunidad(oportunidad.id, formData);
      } else {
        response = await crmService.createOportunidad(formData);
      }

      if (response.success) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error guardando oportunidad:', error);
      setErrors({ submit: 'Error al guardar la oportunidad' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await crmService.deleteOportunidad(oportunidad.id);
      if (response.success) {
        onSave({ deleted: true, id: oportunidad.id });
        onClose();
      }
    } catch (error) {
      console.error('Error eliminando oportunidad:', error);
      setErrors({ submit: 'Error al eliminar la oportunidad' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEtapaChange = (etapa) => {
    const etapaData = ETAPAS_OPORTUNIDAD.find(e => e.value === etapa);
    setFormData(prev => ({ 
      ...prev, 
      etapa, 
      probabilidad: etapaData?.probabilidad || 10 
    }));
  };

  // Modal de confirmación de eliminación
  if (isDeleteMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la oportunidad <strong>{oportunidad?.descripcion}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isViewMode ? <Eye className="w-5 h-5" /> : 
             isEditMode ? <Edit className="w-5 h-5" /> : 
             <Target className="w-5 h-5" />}
            {isViewMode ? 'Ver Oportunidad' : 
             isEditMode ? 'Editar Oportunidad' : 
             'Nueva Oportunidad'}
          </DialogTitle>
          <DialogDescription>
            {isViewMode ? 'Información detallada de la oportunidad' :
             isEditMode ? 'Modifica la información de la oportunidad' :
             'Completa la información de la nueva oportunidad'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
              <TabsTrigger value="estrategia">Estrategia</TabsTrigger>
              <TabsTrigger value="adicional">Adicional</TabsTrigger>
            </TabsList>

            {/* Pestaña General */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente_id">Cliente *</Label>
                  <Select
                    value={formData.cliente_id}
                    onValueChange={(value) => handleInputChange('cliente_id', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className={errors.cliente_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cliente_id && <p className="text-sm text-red-500">{errors.cliente_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_oportunidad">Tipo de Oportunidad</Label>
                  <Select
                    value={formData.tipo_oportunidad}
                    onValueChange={(value) => handleInputChange('tipo_oportunidad', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_OPORTUNIDAD.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendedor_id">Vendedor *</Label>
                  <Select
                    value={formData.vendedor_id}
                    onValueChange={(value) => handleInputChange('vendedor_id', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className={errors.vendedor_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombres} {vendedor.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vendedor_id && <p className="text-sm text-red-500">{errors.vendedor_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor_id">Supervisor</Label>
                  <Select
                    value={formData.supervisor_id}
                    onValueChange={(value) => handleInputChange('supervisor_id', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombres} {vendedor.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Descripción de la oportunidad"
                    disabled={isViewMode}
                    rows={3}
                    className={errors.descripcion ? 'border-red-500' : ''}
                  />
                  {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_cierre_esperada">Fecha de Cierre Esperada</Label>
                  <Input
                    id="fecha_cierre_esperada"
                    type="date"
                    value={formData.fecha_cierre_esperada}
                    onChange={(e) => handleInputChange('fecha_cierre_esperada', e.target.value)}
                    disabled={isViewMode}
                    className={errors.fecha_cierre_esperada ? 'border-red-500' : ''}
                  />
                  {errors.fecha_cierre_esperada && <p className="text-sm text-red-500">{errors.fecha_cierre_esperada}</p>}
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Comercial */}
            <TabsContent value="comercial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="etapa">Etapa del Pipeline</Label>
                  <Select
                    value={formData.etapa}
                    onValueChange={handleEtapaChange}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ETAPAS_OPORTUNIDAD.map((etapa) => (
                        <SelectItem key={etapa.value} value={etapa.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: etapa.color }}
                            />
                            {etapa.label} ({etapa.probabilidad}%)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probabilidad">Probabilidad (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="probabilidad"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probabilidad}
                      onChange={(e) => handleInputChange('probabilidad', parseInt(e.target.value) || 0)}
                      disabled={isViewMode}
                      className="flex-1"
                    />
                    <Percent className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_estimado">Valor Estimado</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={formData.moneda}
                      onValueChange={(value) => handleInputChange('moneda', value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="valor_estimado"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.valor_estimado}
                      onChange={(e) => handleInputChange('valor_estimado', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      disabled={isViewMode}
                      className={errors.valor_estimado ? 'border-red-500' : ''}
                    />
                  </div>
                  {errors.valor_estimado && <p className="text-sm text-red-500">{errors.valor_estimado}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Valor Esperado</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-2xl font-bold text-green-600">
                      {formData.moneda} {((formData.valor_estimado || 0) * (formData.probabilidad || 0) / 100).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valor estimado × Probabilidad
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Estrategia */}
            <TabsContent value="estrategia" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estrategia_venta">Estrategia de Venta</Label>
                  <Textarea
                    id="estrategia_venta"
                    value={formData.estrategia_venta}
                    onChange={(e) => handleInputChange('estrategia_venta', e.target.value)}
                    placeholder="Describe la estrategia de venta para esta oportunidad"
                    disabled={isViewMode}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competidores">Competidores</Label>
                  <Textarea
                    id="competidores"
                    value={formData.competidores}
                    onChange={(e) => handleInputChange('competidores', e.target.value)}
                    placeholder="Lista de competidores identificados"
                    disabled={isViewMode}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recursos_requeridos">Recursos Requeridos</Label>
                  <Textarea
                    id="recursos_requeridos"
                    value={formData.recursos_requeridos}
                    onChange={(e) => handleInputChange('recursos_requeridos', e.target.value)}
                    placeholder="Recursos necesarios para cerrar la oportunidad"
                    disabled={isViewMode}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Adicional */}
            <TabsContent value="adicional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre la oportunidad"
                  disabled={isViewMode}
                  rows={4}
                />
              </div>

              {isViewMode && oportunidad && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Creación</Label>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(oportunidad.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Última Actualización</Label>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(oportunidad.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Badge variant={oportunidad.is_active ? "default" : "secondary"}>
                      {oportunidad.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </Button>
            
            {!isViewMode && (
              <>
                {isEditMode && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onSave({ mode: 'delete', oportunidad })}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OportunidadModal;
