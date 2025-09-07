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
  Plus, Trash2, X, FileText, User, Building2, Calendar, Target, 
  AlertTriangle, CheckCircle, Clock, Workflow, Hash, GitBranch
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

interface ProcesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procesoData: any) => void;
  proceso?: any;
}

const ProcesoModal: React.FC<ProcesoModalProps> = ({ isOpen, onClose, onSave, proceso }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = Boolean(proceso);

  const initialFormData = {
    codigo: '',
    nombre: '',
    descripcion: '',
    objetivo: '',
    alcance: '',
    version: '1.0',
    tipo: 'operativo',
    categoria: 'proceso',
    nivel_critico: 'medio',
    responsable_id: '',
    departamento_id: '',
    supervisor_id: '',
    entradas: '',
    salidas: '',
    proveedores: '',
    clientes: '',
    recursos_requeridos: '',
    competencias_requeridas: '',
    indicadores: '',
    metodos_seguimiento: '',
    criterios_control: '',
    procedimientos_documentados: '',
    registros_requeridos: '',
    riesgos_identificados: '',
    oportunidades_mejora: '',
    fecha_vigencia: '',
    fecha_revision: '',
    motivo_cambio: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (proceso) {
      setFormData({
        codigo: proceso.codigo || '',
        nombre: proceso.nombre || '',
        descripcion: proceso.descripcion || '',
        objetivo: proceso.objetivo || '',
        alcance: proceso.alcance || '',
        version: proceso.version || '1.0',
        tipo: proceso.tipo || 'operativo',
        categoria: proceso.categoria || 'proceso',
        nivel_critico: proceso.nivel_critico || 'medio',
        responsable_id: proceso.responsable_id || '',
        departamento_id: proceso.departamento_id || '',
        supervisor_id: proceso.supervisor_id || '',
        entradas: proceso.entradas || '',
        salidas: proceso.salidas || '',
        proveedores: proceso.proveedores || '',
        clientes: proceso.clientes || '',
        recursos_requeridos: proceso.recursos_requeridos || '',
        competencias_requeridas: proceso.competencias_requeridas || '',
        indicadores: proceso.indicadores || '',
        metodos_seguimiento: proceso.metodos_seguimiento || '',
        criterios_control: proceso.criterios_control || '',
        procedimientos_documentados: proceso.procedimientos_documentados || '',
        registros_requeridos: proceso.registros_requeridos || '',
        riesgos_identificados: proceso.riesgos_identificados || '',
        oportunidades_mejora: proceso.oportunidades_mejora || '',
        fecha_vigencia: proceso.fecha_vigencia || '',
        fecha_revision: proceso.fecha_revision || '',
        motivo_cambio: proceso.motivo_cambio || ''
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [proceso, isOpen]);

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

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.objetivo.trim()) {
      newErrors.objetivo = 'El objetivo es obligatorio';
    }

    if (formData.fecha_vigencia && formData.fecha_revision) {
      const fechaVigencia = new Date(formData.fecha_vigencia);
      const fechaRevision = new Date(formData.fecha_revision);
      
      if (fechaRevision <= fechaVigencia) {
        newErrors.fecha_revision = 'La fecha de revisión debe ser posterior a la fecha de vigencia';
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
      const procesoData = {
        ...formData,
        organization_id: user?.organization_id
      };

      await onSave(procesoData);
      
      toast({
        title: `Proceso ${isEditMode ? 'actualizado' : 'creado'}`,
        description: `El proceso "${formData.nombre}" se guardó correctamente`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el proceso",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNivelCriticoColor = (nivel: string) => {
    switch (nivel) {
      case 'bajo': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'estrategico': return 'bg-purple-100 text-purple-800';
      case 'operativo': return 'bg-blue-100 text-blue-800';
      case 'apoyo': return 'bg-green-100 text-green-800';
      case 'mejora': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditMode ? "Editar Proceso" : "Nuevo Proceso"}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} id="proceso-form" className="space-y-6">
          <Tabs defaultValue="datos-basicos" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="datos-basicos" className="data-[state=active]:bg-slate-600 text-white">
                Datos Básicos
              </TabsTrigger>
              <TabsTrigger value="caracteristicas" className="data-[state=active]:bg-slate-600 text-white">
                Características
              </TabsTrigger>
              <TabsTrigger value="entradas-salidas" className="data-[state=active]:bg-slate-600 text-white">
                Entradas/Salidas
              </TabsTrigger>
              <TabsTrigger value="seguimiento" className="data-[state=active]:bg-slate-600 text-white">
                Seguimiento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="datos-basicos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-white flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Código del Proceso *
                  </Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Ej: PROC-001"
                  />
                  {errors.codigo && <p className="text-red-400 text-sm">{errors.codigo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-white flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Versión
                  </Label>
                  <Input
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="1.0"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nombre" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Nombre del Proceso *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Nombre descriptivo del proceso"
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
                    placeholder="Descripción detallada del proceso"
                  />
                  {errors.descripcion && <p className="text-red-400 text-sm">{errors.descripcion}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="objetivo" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivo *
                  </Label>
                  <Textarea
                    id="objetivo"
                    name="objetivo"
                    value={formData.objetivo}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Objetivo principal del proceso"
                  />
                  {errors.objetivo && <p className="text-red-400 text-sm">{errors.objetivo}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="alcance" className="text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Alcance
                  </Label>
                  <Textarea
                    id="alcance"
                    name="alcance"
                    value={formData.alcance}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Alcance y límites del proceso"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="caracteristicas" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Tipo de Proceso
                  </Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estrategico">Estratégico</SelectItem>
                      <SelectItem value="operativo">Operativo</SelectItem>
                      <SelectItem value="apoyo">Apoyo</SelectItem>
                      <SelectItem value="mejora">Mejora</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getTipoColor(formData.tipo)}>
                    {formData.tipo}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Categoría
                  </Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleSelectChange('categoria', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proceso">Proceso</SelectItem>
                      <SelectItem value="subproceso">Subproceso</SelectItem>
                      <SelectItem value="actividad">Actividad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivel_critico" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Nivel Crítico
                  </Label>
                  <Select value={formData.nivel_critico} onValueChange={(value) => handleSelectChange('nivel_critico', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bajo">Bajo</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="critico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getNivelCriticoColor(formData.nivel_critico)}>
                    {formData.nivel_critico}
                  </Badge>
                </div>

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
                  <Label htmlFor="departamento_id" className="text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Departamento
                  </Label>
                  <Input
                    id="departamento_id"
                    name="departamento_id"
                    value={formData.departamento_id}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="ID del departamento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor_id" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Supervisor
                  </Label>
                  <Input
                    id="supervisor_id"
                    name="supervisor_id"
                    value={formData.supervisor_id}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="ID del supervisor"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="entradas-salidas" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="entradas" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Entradas
                  </Label>
                  <Textarea
                    id="entradas"
                    name="entradas"
                    value={formData.entradas}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Entradas del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salidas" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Salidas
                  </Label>
                  <Textarea
                    id="salidas"
                    name="salidas"
                    value={formData.salidas}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Salidas del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proveedores" className="text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Proveedores
                  </Label>
                  <Textarea
                    id="proveedores"
                    name="proveedores"
                    value={formData.proveedores}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Proveedores del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientes" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Clientes
                  </Label>
                  <Textarea
                    id="clientes"
                    name="clientes"
                    value={formData.clientes}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Clientes del proceso"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="recursos_requeridos" className="text-white flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    Recursos Requeridos
                  </Label>
                  <Textarea
                    id="recursos_requeridos"
                    name="recursos_requeridos"
                    value={formData.recursos_requeridos}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Recursos necesarios para el proceso"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="competencias_requeridas" className="text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Competencias Requeridas
                  </Label>
                  <Textarea
                    id="competencias_requeridas"
                    name="competencias_requeridas"
                    value={formData.competencias_requeridas}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Competencias necesarias para ejecutar el proceso"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seguimiento" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha_vigencia" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Vigencia
                  </Label>
                  <Input
                    id="fecha_vigencia"
                    name="fecha_vigencia"
                    type="date"
                    value={formData.fecha_vigencia}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_revision" className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Revisión
                  </Label>
                  <Input
                    id="fecha_revision"
                    name="fecha_revision"
                    type="date"
                    value={formData.fecha_revision}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  />
                  {errors.fecha_revision && <p className="text-red-400 text-sm">{errors.fecha_revision}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indicadores" className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Indicadores
                  </Label>
                  <Textarea
                    id="indicadores"
                    name="indicadores"
                    value={formData.indicadores}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Indicadores de seguimiento del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metodos_seguimiento" className="text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Métodos de Seguimiento
                  </Label>
                  <Textarea
                    id="metodos_seguimiento"
                    name="metodos_seguimiento"
                    value={formData.metodos_seguimiento}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Métodos para el seguimiento del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criterios_control" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Criterios de Control
                  </Label>
                  <Textarea
                    id="criterios_control"
                    name="criterios_control"
                    value={formData.criterios_control}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Criterios para el control del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedimientos_documentados" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Procedimientos Documentados
                  </Label>
                  <Textarea
                    id="procedimientos_documentados"
                    name="procedimientos_documentados"
                    value={formData.procedimientos_documentados}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Procedimientos documentados del proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registros_requeridos" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Registros Requeridos
                  </Label>
                  <Textarea
                    id="registros_requeridos"
                    name="registros_requeridos"
                    value={formData.registros_requeridos}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Registros necesarios para el proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riesgos_identificados" className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Riesgos Identificados
                  </Label>
                  <Textarea
                    id="riesgos_identificados"
                    name="riesgos_identificados"
                    value={formData.riesgos_identificados}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Riesgos identificados en el proceso"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oportunidades_mejora" className="text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Oportunidades de Mejora
                  </Label>
                  <Textarea
                    id="oportunidades_mejora"
                    name="oportunidades_mejora"
                    value={formData.oportunidades_mejora}
                    onChange={handleChange}
                    rows={3}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Oportunidades de mejora identificadas"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="motivo_cambio" className="text-white flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Motivo del Cambio
                  </Label>
                  <Textarea
                    id="motivo_cambio"
                    name="motivo_cambio"
                    value={formData.motivo_cambio}
                    onChange={handleChange}
                    rows={2}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                    placeholder="Motivo del cambio (solo para edición)"
                  />
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
            form="proceso-form" 
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
                {isEditMode ? "Actualizar Proceso" : "Crear Proceso"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcesoModal;
