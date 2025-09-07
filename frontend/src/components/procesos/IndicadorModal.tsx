<<<<<<< Current (Your changes)

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
=======
import React, { useState, useEffect } from 'react';
>>>>>>> Incoming (Background Agent changes)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Trash2, X, BarChart3, Target, Calendar, User, 
  TrendingUp, Hash, Clock, CheckCircle, AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

interface IndicadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (indicadorData: any) => void;
  indicador?: any;
}

const IndicadorModal: React.FC<IndicadorModalProps> = ({ isOpen, onClose, onSave, indicador }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = Boolean(indicador);

  const initialFormData = {
    nombre: '',
    descripcion: '',
    tipo: 'efectividad',
    unidad: '',
    meta: '',
    frecuencia: 'mensual',
    responsable_id: '',
    proceso_id: '',
    formula: '',
    tolerancia_inferior: '',
    tolerancia_superior: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (indicador) {
      setFormData({
        nombre: indicador.nombre || '',
        descripcion: indicador.descripcion || '',
        tipo: indicador.tipo || 'efectividad',
        unidad: indicador.unidad || '',
        meta: indicador.meta || '',
        frecuencia: indicador.frecuencia || 'mensual',
        responsable_id: indicador.responsable_id || '',
        proceso_id: indicador.proceso_id || '',
        formula: indicador.formula || '',
        tolerancia_inferior: indicador.tolerancia_inferior || '',
        tolerancia_superior: indicador.tolerancia_superior || '',
        observaciones: indicador.observaciones || ''
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [indicador, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario seleccione
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.unidad.trim()) {
      newErrors.unidad = 'La unidad de medida es obligatoria';
    }

    if (!formData.meta.trim()) {
      newErrors.meta = 'La meta es obligatoria';
    } else if (isNaN(Number(formData.meta))) {
      newErrors.meta = 'La meta debe ser un número válido';
    }

    if (formData.tolerancia_inferior && isNaN(Number(formData.tolerancia_inferior))) {
      newErrors.tolerancia_inferior = 'La tolerancia inferior debe ser un número válido';
    }

    if (formData.tolerancia_superior && isNaN(Number(formData.tolerancia_superior))) {
      newErrors.tolerancia_superior = 'La tolerancia superior debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const indicadorData = {
        ...formData,
        meta: Number(formData.meta),
        tolerancia_inferior: formData.tolerancia_inferior ? Number(formData.tolerancia_inferior) : null,
        tolerancia_superior: formData.tolerancia_superior ? Number(formData.tolerancia_superior) : null,
        organization_id: user?.organization_id
      };

      await onSave(indicadorData);
      
      toast({
        title: `Indicador ${isEditMode ? 'actualizado' : 'creado'}`,
        description: `El indicador "${formData.nombre}" se guardó correctamente`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el indicador",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'efectividad': return 'bg-green-100 text-green-800';
      case 'eficiencia': return 'bg-blue-100 text-blue-800';
      case 'satisfaccion': return 'bg-purple-100 text-purple-800';
      case 'cumplimiento': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrecuenciaColor = (frecuencia: string) => {
    switch (frecuencia) {
      case 'diario': return 'bg-red-100 text-red-800';
      case 'semanal': return 'bg-orange-100 text-orange-800';
      case 'mensual': return 'bg-blue-100 text-blue-800';
      case 'trimestral': return 'bg-green-100 text-green-800';
      case 'anual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {isEditMode ? "Editar Indicador" : "Nuevo Indicador"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} id="indicador-form" className="space-y-6">
          <Tabs defaultValue="datos-basicos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="datos-basicos" className="data-[state=active]:bg-slate-600 text-white">
                Datos Básicos
              </TabsTrigger>
              <TabsTrigger value="configuracion" className="data-[state=active]:bg-slate-600 text-white">
                Configuración
              </TabsTrigger>
              <TabsTrigger value="seguimiento" className="data-[state=active]:bg-slate-600 text-white">
                Seguimiento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos-basicos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nombre" className="text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Nombre del Indicador *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Nombre descriptivo del indicador"
                  />
                  {errors.nombre && <p className="text-red-400 text-sm">{errors.nombre}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción *
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Descripción detallada del indicador"
                  />
                  {errors.descripcion && <p className="text-red-400 text-sm">{errors.descripcion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Tipo de Indicador
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectividad">Efectividad</SelectItem>
                      <SelectItem value="eficiencia">Eficiencia</SelectItem>
                      <SelectItem value="satisfaccion">Satisfacción</SelectItem>
                      <SelectItem value="cumplimiento">Cumplimiento</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getTipoColor(formData.tipo)}>
                    {formData.tipo}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidad" className="text-white flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Unidad de Medida *
                  </Label>
                  <Input
                    id="unidad"
                    name="unidad"
                    value={formData.unidad}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: %, días, unidades, etc."
                  />
                  {errors.unidad && <p className="text-red-400 text-sm">{errors.unidad}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Meta *
                  </Label>
                  <Input
                    id="meta"
                    name="meta"
                    type="number"
                    value={formData.meta}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Valor objetivo"
                  />
                  {errors.meta && <p className="text-red-400 text-sm">{errors.meta}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frecuencia" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Frecuencia de Medición
                  </Label>
                  <Select value={formData.frecuencia} onValueChange={(value) => handleSelectChange('frecuencia', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getFrecuenciaColor(formData.frecuencia)}>
                    {formData.frecuencia}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configuracion" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="responsable_id" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsable
                  </Label>
                  <Input
                    id="responsable_id"
                    name="responsable_id"
                    value={formData.responsable_id}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="ID del responsable"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proceso_id" className="text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Proceso Asociado
                  </Label>
                  <Input
                    id="proceso_id"
                    name="proceso_id"
                    value={formData.proceso_id}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="ID del proceso"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="formula" className="text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Fórmula de Cálculo
                  </Label>
                  <Textarea
                    id="formula"
                    name="formula"
                    value={formData.formula}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Fórmula para calcular el indicador (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tolerancia_inferior" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Tolerancia Inferior
                  </Label>
                  <Input
                    id="tolerancia_inferior"
                    name="tolerancia_inferior"
                    type="number"
                    value={formData.tolerancia_inferior}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Valor mínimo aceptable"
                  />
                  {errors.tolerancia_inferior && <p className="text-red-400 text-sm">{errors.tolerancia_inferior}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tolerancia_superior" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Tolerancia Superior
                  </Label>
                  <Input
                    id="tolerancia_superior"
                    name="tolerancia_superior"
                    type="number"
                    value={formData.tolerancia_superior}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Valor máximo aceptable"
                  />
                  {errors.tolerancia_superior && <p className="text-red-400 text-sm">{errors.tolerancia_superior}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seguimiento" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Observaciones
                  </Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Observaciones adicionales sobre el indicador"
                  />
                </div>

                {/* Información de seguimiento */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Información de Seguimiento
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Meta:</span>
                      <span className="text-white font-medium">{formData.meta || 'No definida'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Frecuencia:</span>
                      <span className="text-white font-medium">{formData.frecuencia}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Unidad:</span>
                      <span className="text-white font-medium">{formData.unidad || 'No definida'}</span>
                    </div>
                  </div>

                  {(formData.tolerancia_inferior || formData.tolerancia_superior) && (
                    <div className="border-t border-slate-600 pt-3">
                      <h5 className="text-white font-medium mb-2">Rango de Tolerancia:</h5>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-300">Entre</span>
                        <span className="text-white font-medium">
                          {formData.tolerancia_inferior || '∞'}
                        </span>
                        <span className="text-slate-300">y</span>
                        <span className="text-white font-medium">
                          {formData.tolerancia_superior || '∞'}
                        </span>
                        <span className="text-slate-300">{formData.unidad}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="indicador-form" 
            className="bg-teal-600 text-white hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isEditMode ? "Actualizar Indicador" : "Crear Indicador"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IndicadorModal;
