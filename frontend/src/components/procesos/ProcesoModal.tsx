import { useState, useEffect } from 'react';
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
import { FileText, User, FileTextIcon, Hash, GitBranch, Users, Target, Maximize, Book, Workflow, Settings, AlertTriangle, TrendingUp, Shield, Calendar, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Datos iniciales para el formulario - SGC COMPLETO
const initialFormData = {
  // Información básica
  nombre: '',
  codigo: '',
  descripcion: '',
  objetivo: '',
  alcance: '',
  version: '1.0',
  
  // Clasificación SGC
  tipo: 'operativo',
  categoria: 'proceso',
  nivel_critico: 'medio',
  
  // Responsabilidad
  responsable_id: '',
  departamento_id: '',
  supervisor_id: '',
  
  // Alcance detallado
  entradas: '',
  salidas: '',
  proveedores: '',
  clientes: '',
  
  // Recursos
  recursos_requeridos: '',
  competencias_requeridas: '',
  
  // Control y medición
  indicadores: '',
  metodos_seguimiento: '',
  criterios_control: '',
  
  // Información documental
  procedimientos_documentados: '',
  registros_requeridos: '',
  
  // Mejora
  riesgos_identificados: '',
  oportunidades_mejora: '',
  
  // Control de versiones
  fecha_vigencia: '',
  fecha_revision: '',
  estado: 'activo',
  motivo_cambio: ''
};

function ProcesoModal({ isOpen, onClose, onSave, proceso }) {
  const [formData, setFormData] = useState(initialFormData);

  // Cargar datos cuando se edita un proceso existente
  useEffect(() => {
    if (proceso) {
      setFormData({
        // Información básica
        nombre: proceso.nombre || '',
        codigo: proceso.codigo || '',
        descripcion: proceso.descripcion || '',
        objetivo: proceso.objetivo || '',
        alcance: proceso.alcance || '',
        version: proceso.version || '1.0',
        
        // Clasificación SGC
        tipo: proceso.tipo || 'operativo',
        categoria: proceso.categoria || 'proceso',
        nivel_critico: proceso.nivel_critico || 'medio',
        
        // Responsabilidad
        responsable_id: proceso.responsable_id || '',
        departamento_id: proceso.departamento_id || '',
        supervisor_id: proceso.supervisor_id || '',
        
        // Alcance detallado
        entradas: proceso.entradas || '',
        salidas: proceso.salidas || '',
        proveedores: proceso.proveedores || '',
        clientes: proceso.clientes || '',
        
        // Recursos
        recursos_requeridos: proceso.recursos_requeridos || '',
        competencias_requeridas: proceso.competencias_requeridas || '',
        
        // Control y medición
        indicadores: proceso.indicadores || '',
        metodos_seguimiento: proceso.metodos_seguimiento || '',
        criterios_control: proceso.criterios_control || '',
        
        // Información documental
        procedimientos_documentados: proceso.procedimientos_documentados || '',
        registros_requeridos: proceso.registros_requeridos || '',
        
        // Mejora
        riesgos_identificados: proceso.riesgos_identificados || '',
        oportunidades_mejora: proceso.oportunidades_mejora || '',
        
        // Control de versiones
        fecha_vigencia: proceso.fecha_vigencia || '',
        fecha_revision: proceso.fecha_revision || '',
        estado: proceso.estado || 'activo',
        motivo_cambio: proceso.motivo_cambio || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [proceso, isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark max-w-6xl bg-card text-card-foreground max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-500" />
            {proceso ? 'Editar Proceso SGC' : 'Nuevo Proceso SGC'}
            {formData.codigo && <Badge variant="secondary">{formData.codigo}</Badge>}
          </DialogTitle>
          <DialogDescription>
            Sistema de Gestión de Calidad - Completa los campos para registrar o actualizar un proceso según ISO 9001.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            
            <Tabs defaultValue="basicos" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basicos">Información Básica</TabsTrigger>
                <TabsTrigger value="clasificacion">Clasificación SGC</TabsTrigger>
                <TabsTrigger value="alcance">Alcance y Límites</TabsTrigger>
                <TabsTrigger value="control">Control y Medición</TabsTrigger>
                <TabsTrigger value="mejora">Mejora y Revisión</TabsTrigger>
              </TabsList>
              
              {/* TAB 1: INFORMACIÓN BÁSICA */}
              <TabsContent value="basicos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre del Proceso */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Nombre del Proceso <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleChange} 
                      placeholder="Ej: Gestión de Compras" 
                      required 
                    />
                  </div>

                  {/* Código */}
                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      Código del Proceso
                    </Label>
                    <Input 
                      id="codigo" 
                      name="codigo" 
                      value={formData.codigo} 
                      onChange={handleChange} 
                      placeholder="Ej: PROC-001" 
                    />
                  </div>

                  {/* Versión */}
                  <div className="space-y-2">
                    <Label htmlFor="version" className="flex items-center">
                      <GitBranch className="w-4 h-4 mr-2" />
                      Versión
                    </Label>
                    <Input 
                      id="version" 
                      name="version" 
                      value={formData.version} 
                      onChange={handleChange} 
                      placeholder="Ej: 1.0" 
                    />
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Estado
                    </Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData(prev => ({...prev, estado: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="revision">En Revisión</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="obsoleto">Obsoleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="descripcion" className="flex items-center">
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    Descripción General
                  </Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    placeholder="Describe brevemente el proceso y sus actividades principales" 
                    className="min-h-[80px]" 
                  />
                </div>

                {/* Objetivo */}
                <div className="space-y-2">
                  <Label htmlFor="objetivo" className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Objetivo del Proceso
                  </Label>
                  <Textarea 
                    id="objetivo" 
                    name="objetivo" 
                    value={formData.objetivo} 
                    onChange={handleChange} 
                    placeholder="Definir el propósito y finalidad del proceso" 
                    className="min-h-[80px]" 
                  />
                </div>

                {/* Alcance */}
                <div className="space-y-2">
                  <Label htmlFor="alcance" className="flex items-center">
                    <Maximize className="w-4 h-4 mr-2" />
                    Alcance
                  </Label>
                  <Textarea 
                    id="alcance" 
                    name="alcance" 
                    value={formData.alcance} 
                    onChange={handleChange} 
                    placeholder="Definir los límites y cobertura del proceso" 
                    className="min-h-[80px]" 
                  />
                </div>
              </TabsContent>
              
              {/* TAB 2: CLASIFICACIÓN SGC */}
              <TabsContent value="clasificacion" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tipo de Proceso */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Tipo de Proceso
                    </Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({...prev, tipo: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estrategico">Estratégico</SelectItem>
                        <SelectItem value="operativo">Operativo</SelectItem>
                        <SelectItem value="apoyo">De Apoyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Categoría */}
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Categoría
                    </Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({...prev, categoria: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proceso">Proceso</SelectItem>
                        <SelectItem value="procedimiento">Procedimiento</SelectItem>
                        <SelectItem value="actividad">Actividad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nivel Crítico */}
                  <div className="space-y-2">
                    <Label htmlFor="nivel_critico" className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Nivel Crítico
                    </Label>
                    <Select value={formData.nivel_critico} onValueChange={(value) => setFormData(prev => ({...prev, nivel_critico: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="medio">Medio</SelectItem>
                        <SelectItem value="bajo">Bajo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Responsable */}
                  <div className="space-y-2">
                    <Label htmlFor="responsable_id" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Responsable Principal
                    </Label>
                    <Input 
                      id="responsable_id" 
                      name="responsable_id" 
                      value={formData.responsable_id} 
                      onChange={handleChange} 
                      placeholder="ID del responsable" 
                    />
                  </div>

                  {/* Departamento */}
                  <div className="space-y-2">
                    <Label htmlFor="departamento_id" className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Departamento
                    </Label>
                    <Input 
                      id="departamento_id" 
                      name="departamento_id" 
                      value={formData.departamento_id} 
                      onChange={handleChange} 
                      placeholder="ID del departamento" 
                    />
                  </div>

                  {/* Supervisor */}
                  <div className="space-y-2">
                    <Label htmlFor="supervisor_id" className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Supervisor
                    </Label>
                    <Input 
                      id="supervisor_id" 
                      name="supervisor_id" 
                      value={formData.supervisor_id} 
                      onChange={handleChange} 
                      placeholder="ID del supervisor" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fechas */}
                  <div className="space-y-2">
                    <Label htmlFor="fecha_vigencia" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fecha de Vigencia
                    </Label>
                    <Input 
                      id="fecha_vigencia" 
                      name="fecha_vigencia" 
                      type="date"
                      value={formData.fecha_vigencia} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_revision" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Próxima Revisión
                    </Label>
                    <Input 
                      id="fecha_revision" 
                      name="fecha_revision" 
                      type="date"
                      value={formData.fecha_revision} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* TAB 3: ALCANCE Y LÍMITES */}
              <TabsContent value="alcance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Entradas */}
                  <div className="space-y-2">
                    <Label htmlFor="entradas" className="flex items-center">
                      <Workflow className="w-4 h-4 mr-2" />
                      Entradas (Inputs)
                    </Label>
                    <Textarea 
                      id="entradas" 
                      name="entradas" 
                      value={formData.entradas} 
                      onChange={handleChange} 
                      placeholder="Qué recursos, información o materiales entran al proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Salidas */}
                  <div className="space-y-2">
                    <Label htmlFor="salidas" className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Salidas (Outputs)
                    </Label>
                    <Textarea 
                      id="salidas" 
                      name="salidas" 
                      value={formData.salidas} 
                      onChange={handleChange} 
                      placeholder="Qué productos, servicios o resultados genera el proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Proveedores */}
                  <div className="space-y-2">
                    <Label htmlFor="proveedores" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Proveedores
                    </Label>
                    <Textarea 
                      id="proveedores" 
                      name="proveedores" 
                      value={formData.proveedores} 
                      onChange={handleChange} 
                      placeholder="Quién proporciona los inputs al proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Clientes */}
                  <div className="space-y-2">
                    <Label htmlFor="clientes" className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Clientes
                    </Label>
                    <Textarea 
                      id="clientes" 
                      name="clientes" 
                      value={formData.clientes} 
                      onChange={handleChange} 
                      placeholder="Quién recibe los outputs del proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recursos Requeridos */}
                  <div className="space-y-2">
                    <Label htmlFor="recursos_requeridos" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Recursos Requeridos
                    </Label>
                    <Textarea 
                      id="recursos_requeridos" 
                      name="recursos_requeridos" 
                      value={formData.recursos_requeridos} 
                      onChange={handleChange} 
                      placeholder="Recursos humanos, tecnológicos, financieros necesarios" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Competencias Requeridas */}
                  <div className="space-y-2">
                    <Label htmlFor="competencias_requeridas" className="flex items-center">
                      <Book className="w-4 h-4 mr-2" />
                      Competencias Requeridas
                    </Label>
                    <Textarea 
                      id="competencias_requeridas" 
                      name="competencias_requeridas" 
                      value={formData.competencias_requeridas} 
                      onChange={handleChange} 
                      placeholder="Conocimientos, habilidades y experiencia necesarios" 
                      className="min-h-[100px]" 
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* TAB 4: CONTROL Y MEDICIÓN */}
              <TabsContent value="control" className="space-y-4">
                <div className="space-y-4">
                  {/* Indicadores */}
                  <div className="space-y-2">
                    <Label htmlFor="indicadores" className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Indicadores de Desempeño
                    </Label>
                    <Textarea 
                      id="indicadores" 
                      name="indicadores" 
                      value={formData.indicadores} 
                      onChange={handleChange} 
                      placeholder="KPIs y métricas para medir el desempeño del proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Métodos de Seguimiento */}
                  <div className="space-y-2">
                    <Label htmlFor="metodos_seguimiento" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Métodos de Seguimiento
                    </Label>
                    <Textarea 
                      id="metodos_seguimiento" 
                      name="metodos_seguimiento" 
                      value={formData.metodos_seguimiento} 
                      onChange={handleChange} 
                      placeholder="Cómo se realizará el seguimiento y monitoreo del proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  {/* Criterios de Control */}
                  <div className="space-y-2">
                    <Label htmlFor="criterios_control" className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Criterios de Control
                    </Label>
                    <Textarea 
                      id="criterios_control" 
                      name="criterios_control" 
                      value={formData.criterios_control} 
                      onChange={handleChange} 
                      placeholder="Criterios y puntos de control del proceso" 
                      className="min-h-[100px]" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Procedimientos Documentados */}
                    <div className="space-y-2">
                      <Label htmlFor="procedimientos_documentados" className="flex items-center">
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        Procedimientos Documentados
                      </Label>
                      <Textarea 
                        id="procedimientos_documentados" 
                        name="procedimientos_documentados" 
                        value={formData.procedimientos_documentados} 
                        onChange={handleChange} 
                        placeholder="Documentos y procedimientos relacionados" 
                        className="min-h-[100px]" 
                      />
                    </div>

                    {/* Registros Requeridos */}
                    <div className="space-y-2">
                      <Label htmlFor="registros_requeridos" className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Registros Requeridos
                      </Label>
                      <Textarea 
                        id="registros_requeridos" 
                        name="registros_requeridos" 
                        value={formData.registros_requeridos} 
                        onChange={handleChange} 
                        placeholder="Registros que se deben mantener" 
                        className="min-h-[100px]" 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* TAB 5: MEJORA Y REVISIÓN */}
              <TabsContent value="mejora" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Riesgos Identificados */}
                  <div className="space-y-2">
                    <Label htmlFor="riesgos_identificados" className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Riesgos Identificados
                    </Label>
                    <Textarea 
                      id="riesgos_identificados" 
                      name="riesgos_identificados" 
                      value={formData.riesgos_identificados} 
                      onChange={handleChange} 
                      placeholder="Riesgos potenciales del proceso y su impacto" 
                      className="min-h-[120px]" 
                    />
                  </div>

                  {/* Oportunidades de Mejora */}
                  <div className="space-y-2">
                    <Label htmlFor="oportunidades_mejora" className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Oportunidades de Mejora
                    </Label>
                    <Textarea 
                      id="oportunidades_mejora" 
                      name="oportunidades_mejora" 
                      value={formData.oportunidades_mejora} 
                      onChange={handleChange} 
                      placeholder="Áreas de mejora identificadas y propuestas" 
                      className="min-h-[120px]" 
                    />
                  </div>
                </div>

                {/* Motivo del Cambio */}
                <div className="space-y-2">
                  <Label htmlFor="motivo_cambio" className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Motivo del Cambio
                  </Label>
                  <Textarea 
                    id="motivo_cambio" 
                    name="motivo_cambio" 
                    value={formData.motivo_cambio} 
                    onChange={handleChange} 
                    placeholder="Describir el motivo del cambio o actualización" 
                    className="min-h-[80px]" 
                  />
                </div>
              </TabsContent>
            </Tabs>
            
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {proceso ? 'Guardar Cambios' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProcesoModal;
