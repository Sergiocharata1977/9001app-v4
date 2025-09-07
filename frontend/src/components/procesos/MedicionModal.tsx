import React, { useState, useEffect } from 'react';
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
  Plus, Trash2, X, Activity, BarChart3, Calendar, User, 
  TrendingUp, Hash, Clock, CheckCircle, AlertTriangle,
  Target, FileText
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import indicadoresService from '@/services/indicadoresService';

interface MedicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicionData: any) => void;
  medicion?: any;
}

const MedicionModal: React.FC<MedicionModalProps> = ({ isOpen, onClose, onSave, medicion }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = Boolean(medicion);

  const initialFormData = {
    indicador_id: '',
    valor: '',
    fecha_medicion: '',
    responsable_id: '',
    observaciones: '',
    metodo_medicion: '',
    fuente_datos: '',
    confiabilidad: 'alta',
    estado: 'completada'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [indicadores, setIndicadores] = useState<any[]>([]);
  const [selectedIndicador, setSelectedIndicador] = useState<any>(null);

  useEffect(() => {
      if (medicion) {
        setFormData({
          indicador_id: medicion.indicador_id || '',
          valor: medicion.valor || '',
        fecha_medicion: medicion.fecha_medicion || '',
        responsable_id: medicion.responsable_id || '',
          observaciones: medicion.observaciones || '',
        metodo_medicion: medicion.metodo_medicion || '',
        fuente_datos: medicion.fuente_datos || '',
        confiabilidad: medicion.confiabilidad || 'alta',
        estado: medicion.estado || 'completada'
        });
      } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [medicion, isOpen]);

  useEffect(() => {
    loadIndicadores();
  }, [isOpen]);

  useEffect(() => {
    if (formData.indicador_id) {
      const indicador = indicadores.find(i => i.id === formData.indicador_id);
      setSelectedIndicador(indicador);
    } else {
      setSelectedIndicador(null);
    }
  }, [formData.indicador_id, indicadores]);

  const loadIndicadores = async () => {
    try {
      const data = await indicadoresService.getAll();
      setIndicadores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando indicadores:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los indicadores",
        variant: "destructive"
      });
    }
  };

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

    if (!formData.indicador_id.trim()) {
      newErrors.indicador_id = 'El indicador es obligatorio';
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'El valor es obligatorio';
    } else if (isNaN(Number(formData.valor))) {
      newErrors.valor = 'El valor debe ser un número válido';
    }

    if (!formData.fecha_medicion.trim()) {
      newErrors.fecha_medicion = 'La fecha de medición es obligatoria';
    }

    if (!formData.responsable_id.trim()) {
      newErrors.responsable_id = 'El responsable es obligatorio';
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
      const medicionData = {
        ...formData,
        valor: Number(formData.valor),
        organization_id: user?.organization_id
      };

      await onSave(medicionData);
      
      toast({
        title: `Medición ${isEditMode ? 'actualizada' : 'creada'}`,
        description: `La medición se guardó correctamente`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la medición",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfiabilidadColor = (confiabilidad: string) => {
    switch (confiabilidad) {
      case 'alta': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValorStatus = () => {
    if (!selectedIndicador || !formData.valor) return null;
    
    const valor = Number(formData.valor);
    const meta = Number(selectedIndicador.meta);
    
    if (valor >= meta) {
      return { status: 'cumple', color: 'text-green-400', icon: CheckCircle };
    } else {
      return { status: 'no_cumple', color: 'text-red-400', icon: AlertTriangle };
    }
  };

  const valorStatus = getValorStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {isEditMode ? "Editar Medición" : "Nueva Medición"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} id="medicion-form" className="space-y-6">
          <Tabs defaultValue="datos-basicos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="datos-basicos" className="data-[state=active]:bg-slate-600 text-white">
                Datos Básicos
              </TabsTrigger>
              <TabsTrigger value="configuracion" className="data-[state=active]:bg-slate-600 text-white">
                Configuración
              </TabsTrigger>
              <TabsTrigger value="analisis" className="data-[state=active]:bg-slate-600 text-white">
                Análisis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos-basicos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
                  <Label htmlFor="indicador_id" className="text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Indicador *
                  </Label>
                  <Select value={formData.indicador_id} onValueChange={(value) => handleSelectChange('indicador_id', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue placeholder="Seleccionar indicador" />
              </SelectTrigger>
              <SelectContent>
                      {indicadores.map((indicador) => (
                        <SelectItem key={indicador.id} value={indicador.id}>
                          {indicador.nombre} ({indicador.unidad})
                    </SelectItem>
                      ))}
              </SelectContent>
            </Select>
                  {errors.indicador_id && <p className="text-red-400 text-sm">{errors.indicador_id}</p>}
          </div>

            <div className="space-y-2">
                  <Label htmlFor="valor" className="text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Valor Medido *
                  </Label>
              <Input
                id="valor"
                    name="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Valor numérico"
                  />
                  {errors.valor && <p className="text-red-400 text-sm">{errors.valor}</p>}
                  {selectedIndicador && (
                    <p className="text-slate-400 text-sm">
                      Unidad: {selectedIndicador.unidad}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_medicion" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Medición *
                  </Label>
                  <Input
                    id="fecha_medicion"
                    name="fecha_medicion"
                    type="date"
                    value={formData.fecha_medicion}
                    onChange={handleChange}
                required
                    className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
              />
                  {errors.fecha_medicion && <p className="text-red-400 text-sm">{errors.fecha_medicion}</p>}
            </div>

            <div className="space-y-2">
                  <Label htmlFor="responsable_id" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Responsable *
                  </Label>
                  <Input
                    id="responsable_id"
                    name="responsable_id"
                    value={formData.responsable_id}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="ID del responsable"
                  />
                  {errors.responsable_id && <p className="text-red-400 text-sm">{errors.responsable_id}</p>}
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
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getEstadoColor(formData.estado)}>
                    {formData.estado}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confiabilidad" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Confiabilidad
                  </Label>
                  <Select value={formData.confiabilidad} onValueChange={(value) => handleSelectChange('confiabilidad', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getConfiabilidadColor(formData.confiabilidad)}>
                    {formData.confiabilidad}
                  </Badge>
            </div>
          </div>
            </TabsContent>

            <TabsContent value="configuracion" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
                  <Label htmlFor="metodo_medicion" className="text-white flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Método de Medición
                  </Label>
                  <Textarea
                    id="metodo_medicion"
                    name="metodo_medicion"
                    value={formData.metodo_medicion}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Descripción del método utilizado para la medición"
            />
          </div>

          <div className="space-y-2">
                  <Label htmlFor="fuente_datos" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Fuente de Datos
                  </Label>
                  <Textarea
                    id="fuente_datos"
                    name="fuente_datos"
                    value={formData.fuente_datos}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Fuente de donde se obtuvieron los datos"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
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
                    placeholder="Observaciones adicionales sobre la medición"
            />
          </div>
              </div>
            </TabsContent>

            <TabsContent value="analisis" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Información del indicador seleccionado */}
                {selectedIndicador && (
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Información del Indicador
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-teal-400" />
                        <span className="text-slate-300">Meta:</span>
                        <span className="text-white font-medium">
                          {selectedIndicador.meta} {selectedIndicador.unidad}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-teal-400" />
                        <span className="text-slate-300">Tipo:</span>
                        <span className="text-white font-medium">{selectedIndicador.tipo}</span>
                      </div>
                    </div>
                    
                    {selectedIndicador.descripcion && (
                      <div className="text-sm">
                        <span className="text-slate-300">Descripción:</span>
                        <p className="text-white mt-1">{selectedIndicador.descripcion}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Análisis de la medición */}
                {formData.valor && selectedIndicador && (
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Análisis de la Medición
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-teal-400" />
                        <span className="text-slate-300">Valor Medido:</span>
                        <span className="text-white font-medium">
                          {formData.valor} {selectedIndicador.unidad}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-teal-400" />
                        <span className="text-slate-300">Meta:</span>
                        <span className="text-white font-medium">
                          {selectedIndicador.meta} {selectedIndicador.unidad}
                        </span>
                      </div>
                      
              <div className="flex items-center gap-2">
                        {valorStatus && (
                          <>
                            <valorStatus.icon className={`h-4 w-4 ${valorStatus.color}`} />
                            <span className="text-slate-300">Estado:</span>
                            <span className={`font-medium ${valorStatus.color}`}>
                              {valorStatus.status === 'cumple' ? 'Cumple Meta' : 'No Cumple Meta'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cálculo de desviación */}
                    {formData.valor && selectedIndicador.meta && (
                      <div className="border-t border-slate-600 pt-3">
                        <div className="text-sm">
                          <span className="text-slate-300">Desviación:</span>
                          <span className={`ml-2 font-medium ${
                            Number(formData.valor) >= Number(selectedIndicador.meta) 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {((Number(formData.valor) - Number(selectedIndicador.meta)) / Number(selectedIndicador.meta) * 100).toFixed(1)}%
                </span>
              </div>
                      </div>
                    )}
            </div>
          )}

                {/* Resumen de la medición */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Resumen de la Medición
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Fecha:</span>
                      <span className="text-white font-medium">
                        {formData.fecha_medicion || 'No definida'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-teal-400" />
                      <span className="text-slate-300">Responsable:</span>
                      <span className="text-white font-medium">
                        {formData.responsable_id || 'No asignado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getEstadoColor(formData.estado)}>
                      Estado: {formData.estado}
                    </Badge>
                    <Badge className={getConfiabilidadColor(formData.confiabilidad)}>
                      Confiabilidad: {formData.confiabilidad}
                    </Badge>
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
            form="medicion-form" 
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
                {isEditMode ? "Actualizar Medición" : "Crear Medición"}
              </>
            )}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicionModal; 