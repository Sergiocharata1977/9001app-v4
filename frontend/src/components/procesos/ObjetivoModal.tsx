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
  Plus, Trash2, X, Target, Calendar, User, 
  TrendingUp, Hash, Clock, CheckCircle, AlertTriangle,
  FileText, Workflow
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

interface ObjetivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (objetivoData: any) => void;
  objetivo?: any;
  procesoId?: string;
}

const ObjetivoModal: React.FC<ObjetivoModalProps> = ({ isOpen, onClose, onSave, objetivo, procesoId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = Boolean(objetivo);

  const initialFormData = {
    codigo: '',
    nombre_objetivo: '',
    descripcion: '',
    meta: '',
    responsable: '',
    fecha_inicio: '',
    fecha_limite: '',
    estado: 'activo',
    proceso_id: procesoId || '',
    prioridad: 'media',
    tipo: 'mejora',
    recursos_requeridos: '',
    criterios_exito: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (objetivo) {
      setFormData({
        codigo: objetivo.codigo || '',
        nombre_objetivo: objetivo.nombre_objetivo || '',
        descripcion: objetivo.descripcion || '',
        meta: objetivo.meta || '',
        responsable: objetivo.responsable || '',
        fecha_inicio: objetivo.fecha_inicio || '',
        fecha_limite: objetivo.fecha_limite || '',
        estado: objetivo.estado || 'activo',
        proceso_id: objetivo.proceso_id || procesoId || '',
        prioridad: objetivo.prioridad || 'media',
        tipo: objetivo.tipo || 'mejora',
        recursos_requeridos: objetivo.recursos_requeridos || '',
        criterios_exito: objetivo.criterios_exito || '',
        observaciones: objetivo.observaciones || ''
      });
    } else {
      setFormData({
        ...initialFormData,
        proceso_id: procesoId || ''
      });
    }
    setErrors({});
  }, [objetivo, procesoId, isOpen]);

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

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    }

    if (!formData.nombre_objetivo.trim()) {
      newErrors.nombre_objetivo = 'El nombre del objetivo es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.meta.trim()) {
      newErrors.meta = 'La meta es obligatoria';
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es obligatorio';
    }

    if (!formData.fecha_inicio.trim()) {
      newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fecha_limite.trim()) {
      newErrors.fecha_limite = 'La fecha límite es obligatoria';
    }

    if (formData.fecha_inicio && formData.fecha_limite) {
      const fechaInicio = new Date(formData.fecha_inicio);
      const fechaLimite = new Date(formData.fecha_limite);
      
      if (fechaLimite <= fechaInicio) {
        newErrors.fecha_limite = 'La fecha límite debe ser posterior a la fecha de inicio';
      }
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
      const objetivoData = {
        ...formData,
        organization_id: user?.organization_id
      };

      await onSave(objetivoData);
      
      toast({
        title: `Objetivo ${isEditMode ? 'actualizado' : 'creado'}`,
        description: `El objetivo "${formData.nombre_objetivo}" se guardó correctamente`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el objetivo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'completado': return 'bg-purple-100 text-purple-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'baja': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'critica': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'mejora': return 'bg-blue-100 text-blue-800';
      case 'prevencion': return 'bg-green-100 text-green-800';
      case 'correccion': return 'bg-red-100 text-red-800';
      case 'innovacion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isEditMode ? "Editar Objetivo" : "Nuevo Objetivo"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} id="objetivo-form" className="space-y-6">
          <Tabs defaultValue="datos-basicos" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="datos-basicos" className="data-[state=active]:bg-slate-600 text-white">
                Datos Básicos
              </TabsTrigger>
              <TabsTrigger value="configuracion" className="data-[state=active]:bg-slate-600 text-white">
                Configuración
              </TabsTrigger>
              <TabsTrigger value="seguimiento" className="data-[state=active]:bg-slate-600 text-white">
                Seguimiento
              </TabsTrigger>
              <TabsTrigger value="recursos" className="data-[state=active]:bg-slate-600 text-white">
                Recursos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos-basicos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-white flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Código del Objetivo *
                  </Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: OBJ-001"
                  />
                  {errors.codigo && <p className="text-red-400 text-sm">{errors.codigo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Tipo de Objetivo
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mejora">Mejora</SelectItem>
                      <SelectItem value="prevencion">Prevención</SelectItem>
                      <SelectItem value="correccion">Corrección</SelectItem>
                      <SelectItem value="innovacion">Innovación</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getTipoColor(formData.tipo)}>
                    {formData.tipo}
                  </Badge>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nombre_objetivo" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Nombre del Objetivo *
                  </Label>
                  <Input
                    id="nombre_objetivo"
                    name="nombre_objetivo"
                    value={formData.nombre_objetivo}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Nombre descriptivo del objetivo"
                  />
                  {errors.nombre_objetivo && <p className="text-red-400 text-sm">{errors.nombre_objetivo}</p>}
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
                    placeholder="Descripción detallada del objetivo"
                  />
                  {errors.descripcion && <p className="text-red-400 text-sm">{errors.descripcion}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="meta" className="text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Meta *
                  </Label>
                  <Textarea
                    id="meta"
                    name="meta"
                    value={formData.meta}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Meta específica y medible del objetivo"
                  />
                  {errors.meta && <p className="text-red-400 text-sm">{errors.meta}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configuracion" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="responsable" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsable *
                  </Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Nombre del responsable"
                  />
                  {errors.responsable && <p className="text-red-400 text-sm">{errors.responsable}</p>}
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

                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Inicio *
                  </Label>
                  <Input
                    id="fecha_inicio"
                    name="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  />
                  {errors.fecha_inicio && <p className="text-red-400 text-sm">{errors.fecha_inicio}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_limite" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha Límite *
                  </Label>
                  <Input
                    id="fecha_limite"
                    name="fecha_limite"
                    type="date"
                    value={formData.fecha_limite}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  />
                  {errors.fecha_limite && <p className="text-red-400 text-sm">{errors.fecha_limite}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Estado
                  </Label>
                  <Select value={formData.estado} onValueChange={(value) => handleSelectChange('estado', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="en_progreso">En Progreso</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getEstadoColor(formData.estado)}>
                    {formData.estado}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridad" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Prioridad
                  </Label>
                  <Select value={formData.prioridad} onValueChange={(value) => handleSelectChange('prioridad', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getPrioridadColor(formData.prioridad)}>
                    {formData.prioridad}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seguimiento" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="criterios_exito" className="text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Criterios de Éxito
                  </Label>
                  <Textarea
                    id="criterios_exito"
                    name="criterios_exito"
                    value={formData.criterios_exito}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Criterios específicos para considerar el objetivo como exitoso"
                  />
                </div>

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
                    placeholder="Observaciones adicionales sobre el objetivo"
                  />
                </div>

                {/* Información de seguimiento */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Información de Seguimiento
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Responsable:</span>
                      <span className="text-white font-medium">{formData.responsable || 'No asignado'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Período:</span>
                      <span className="text-white font-medium">
                        {formData.fecha_inicio && formData.fecha_limite 
                          ? `${formData.fecha_inicio} - ${formData.fecha_limite}`
                          : 'No definido'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getEstadoColor(formData.estado)}>
                      Estado: {formData.estado}
                    </Badge>
                    <Badge className={getPrioridadColor(formData.prioridad)}>
                      Prioridad: {formData.prioridad}
                    </Badge>
                    <Badge className={getTipoColor(formData.tipo)}>
                      Tipo: {formData.tipo}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recursos" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="recursos_requeridos" className="text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Recursos Requeridos
                  </Label>
                  <Textarea
                    id="recursos_requeridos"
                    name="recursos_requeridos"
                    value={formData.recursos_requeridos}
                    onChange={handleChange}
                    rows={6}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Recursos humanos, materiales, tecnológicos y financieros necesarios para alcanzar el objetivo"
                  />
                </div>

                {/* Información de recursos */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Resumen de Recursos
                  </h4>
                  
                  <div className="text-sm text-slate-300">
                    <p>Recursos definidos: {formData.recursos_requeridos ? 'Sí' : 'No'}</p>
                    {formData.recursos_requeridos && (
                      <p className="mt-2 text-white">
                        {formData.recursos_requeridos.length} caracteres de descripción
                      </p>
                    )}
                  </div>
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
            form="objetivo-form" 
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
                {isEditMode ? "Actualizar Objetivo" : "Crear Objetivo"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ObjetivoModal;
