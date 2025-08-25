import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AnalisisRiesgo, CreateAnalisisRiesgoData } from '@/services/analisisRiesgoService';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AnalisisRiesgoModalProps {
  analisis?: AnalisisRiesgo | null;
  onClose: () => void;
  onSave: (data: CreateAnalisisRiesgoData) => void;
}

export default function AnalisisRiesgoModal({ analisis, onClose, onSave }: AnalisisRiesgoModalProps) {
  const [formData, setFormData] = useState<CreateAnalisisRiesgoData>({
    organization_id: '1', // Default organization
    cliente_id: '',
    fecha_analisis: new Date().toISOString().split('T')[0],
    periodo_analisis: '',
    puntaje_riesgo: 50,
    categoria_riesgo: 'media',
    capacidad_pago: 0,
    ingresos_mensuales: 0,
    gastos_mensuales: 0,
    margen_utilidad: 0,
    liquidez: 0,
    solvencia: 0,
    endeudamiento: 0,
    recomendaciones: '',
    observaciones: '',
    estado: 'identificado'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analisis) {
      setFormData({
        organization_id: analisis.organization_id,
        cliente_id: analisis.cliente_id,
        fecha_analisis: analisis.fecha_analisis,
        periodo_analisis: analisis.periodo_analisis,
        puntaje_riesgo: analisis.puntaje_riesgo,
        categoria_riesgo: analisis.categoria_riesgo,
        capacidad_pago: analisis.capacidad_pago,
        ingresos_mensuales: analisis.ingresos_mensuales,
        gastos_mensuales: analisis.gastos_mensuales,
        margen_utilidad: analisis.margen_utilidad,
        liquidez: analisis.liquidez,
        solvencia: analisis.solvencia,
        endeudamiento: analisis.endeudamiento,
        recomendaciones: analisis.recomendaciones,
        observaciones: analisis.observaciones,
        estado: analisis.estado
      });
    }
  }, [analisis]);

  const handleInputChange = (field: keyof CreateAnalisisRiesgoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_id || !formData.periodo_analisis) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'baja': return 'text-green-600';
      case 'media': return 'text-yellow-600';
      case 'alta': return 'text-orange-600';
      case 'muy_alta': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {analisis ? 'Editar Análisis de Riesgo' : 'Nuevo Análisis de Riesgo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_id">Cliente ID *</Label>
              <Input
                id="cliente_id"
                value={formData.cliente_id}
                onChange={(e) => handleInputChange('cliente_id', e.target.value)}
                placeholder="ID del cliente"
                required
              />
            </div>

            <div>
              <Label htmlFor="periodo_analisis">Período de Análisis *</Label>
              <Input
                id="periodo_analisis"
                value={formData.periodo_analisis}
                onChange={(e) => handleInputChange('periodo_analisis', e.target.value)}
                placeholder="Ej: 2024-Q1"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_analisis">Fecha de Análisis</Label>
              <Input
                id="fecha_analisis"
                type="date"
                value={formData.fecha_analisis}
                onChange={(e) => handleInputChange('fecha_analisis', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identificado">Identificado</SelectItem>
                  <SelectItem value="evaluado">Evaluado</SelectItem>
                  <SelectItem value="mitigado">Mitigado</SelectItem>
                  <SelectItem value="monitoreado">Monitoreado</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Evaluación de Riesgo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Evaluación de Riesgo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="puntaje_riesgo">Puntaje de Riesgo (1-100)</Label>
                <Input
                  id="puntaje_riesgo"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.puntaje_riesgo}
                  onChange={(e) => handleInputChange('puntaje_riesgo', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="categoria_riesgo">Categoría de Riesgo</Label>
                <Select
                  value={formData.categoria_riesgo}
                  onValueChange={(value) => handleInputChange('categoria_riesgo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="muy_alta">Muy Alta</SelectItem>
                  </SelectContent>
                </Select>
                <p className={`text-sm mt-1 ${getCategoriaColor(formData.categoria_riesgo)}`}>
                  Puntaje: {formData.puntaje_riesgo}/100
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores Financieros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Indicadores Financieros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacidad_pago">Capacidad de Pago</Label>
                <Input
                  id="capacidad_pago"
                  type="number"
                  step="0.01"
                  value={formData.capacidad_pago}
                  onChange={(e) => handleInputChange('capacidad_pago', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="ingresos_mensuales">Ingresos Mensuales</Label>
                <Input
                  id="ingresos_mensuales"
                  type="number"
                  step="0.01"
                  value={formData.ingresos_mensuales}
                  onChange={(e) => handleInputChange('ingresos_mensuales', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="gastos_mensuales">Gastos Mensuales</Label>
                <Input
                  id="gastos_mensuales"
                  type="number"
                  step="0.01"
                  value={formData.gastos_mensuales}
                  onChange={(e) => handleInputChange('gastos_mensuales', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="margen_utilidad">Margen de Utilidad (%)</Label>
                <Input
                  id="margen_utilidad"
                  type="number"
                  step="0.1"
                  value={formData.margen_utilidad}
                  onChange={(e) => handleInputChange('margen_utilidad', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="liquidez">Liquidez</Label>
                <Input
                  id="liquidez"
                  type="number"
                  step="0.01"
                  value={formData.liquidez}
                  onChange={(e) => handleInputChange('liquidez', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="solvencia">Solvencia</Label>
                <Input
                  id="solvencia"
                  type="number"
                  step="0.01"
                  value={formData.solvencia}
                  onChange={(e) => handleInputChange('solvencia', parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="endeudamiento">Endeudamiento (%)</Label>
                <Input
                  id="endeudamiento"
                  type="number"
                  step="0.1"
                  value={formData.endeudamiento}
                  onChange={(e) => handleInputChange('endeudamiento', parseFloat(e.target.value))}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          {/* Observaciones y Recomendaciones */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones sobre el análisis de riesgo..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="recomendaciones">Recomendaciones</Label>
              <Textarea
                id="recomendaciones"
                value={formData.recomendaciones}
                onChange={(e) => handleInputChange('recomendaciones', e.target.value)}
                placeholder="Recomendaciones para mitigar el riesgo..."
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (analisis ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

