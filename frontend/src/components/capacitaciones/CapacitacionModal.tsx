import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, FileText, Calendar, Activity, X } from "lucide-react";
import { Capacitacion, CapacitacionFormData } from "@/types/capacitaciones";

interface CapacitacionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: CapacitacionFormData) => Promise<void>;
  capacitacion?: Capacitacion | null;
}

interface Tema {
  id?: number;
  titulo: string;
  descripcion: string;
}

interface FormErrors {
  titulo?: string;
  fecha_inicio?: string;
  [key: string]: string | undefined;
}

function CapacitacionModal({ open, onOpenChange, onSave, capacitacion }: CapacitacionModalProps): JSX.Element {
  const [formData, setFormData] = useState<CapacitacionFormData>({
    nombre: "",
    descripcion: "",
    instructor: "",
    fecha_inicio: "",
    fecha_fin: "",
    duracion_horas: 0,
    modalidad: "",
    estado: "Programada",
    ubicacion: "",
    costo: 0,
    cupo_maximo: 0,
    requisitos: "",
    objetivos: "",
    contenido: "",
    metodologia: "",
    evaluacion: "",
    certificacion: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [temaInput, setTemaInput] = useState<Tema>({ titulo: '', descripcion: '' });
  const [temaEditIndex, setTemaEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (capacitacion) {
      setFormData({
        nombre: capacitacion.nombre || capacitacion.titulo || "",
        descripcion: capacitacion.descripcion || "",
        instructor: capacitacion.instructor || "",
        fecha_inicio: capacitacion.fecha_inicio || "",
        fecha_fin: capacitacion.fecha_fin || "",
        duracion_horas: capacitacion.duracion_horas || 0,
        modalidad: capacitacion.modalidad || "",
        estado: capacitacion.estado || "Programada",
        ubicacion: capacitacion.ubicacion || "",
        costo: capacitacion.costo || 0,
        cupo_maximo: capacitacion.cupo_maximo || 0,
        requisitos: capacitacion.requisitos || "",
        objetivos: capacitacion.objetivos || "",
        contenido: capacitacion.contenido || "",
        metodologia: capacitacion.metodologia || "",
        evaluacion: capacitacion.evaluacion || "",
        certificacion: capacitacion.certificacion || false
      });
      setTemas(capacitacion.temas || []); // Si viene con temas
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        instructor: "",
        fecha_inicio: "",
        fecha_fin: "",
        duracion_horas: 0,
        modalidad: "",
        estado: "Programada",
        ubicacion: "",
        costo: 0,
        cupo_maximo: 0,
        requisitos: "",
        objetivos: "",
        contenido: "",
        metodologia: "",
        evaluacion: "",
        certificacion: false
      });
      setTemas([]);
    }
    setErrors({});
  }, [capacitacion, open]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El título es obligatorio";
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
    }

    return newErrors;
  };

  const handleTemaInputChange = (field: keyof Tema, value: string): void => {
    setTemaInput(prev => ({ ...prev, [field]: value }));
  };

  const addTema = (): void => {
    if (temaInput.titulo.trim() && temaInput.descripcion.trim()) {
      if (temaEditIndex !== null) {
        // Editar tema existente
        const updatedTemas = [...temas];
        updatedTemas[temaEditIndex] = { ...temaInput };
        setTemas(updatedTemas);
        setTemaEditIndex(null);
      } else {
        // Agregar nuevo tema
        setTemas(prev => [...prev, { ...temaInput }]);
      }
      setTemaInput({ titulo: '', descripcion: '' });
    }
  };

  const editTema = (index: number): void => {
    setTemaInput(temas[index]);
    setTemaEditIndex(index);
  };

  const removeTema = (index: number): void => {
    setTemas(prev => prev.filter((_, i) => i !== index));
    if (temaEditIndex === index) {
      setTemaEditIndex(null);
      setTemaInput({ titulo: '', descripcion: '' });
    }
  };

  const handleChange = (field: keyof CapacitacionFormData, value: string | number | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al guardar capacitación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] max-w-[70vw] bg-slate-800 border-slate-700 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-white">
            {capacitacion ? "Editar Capacitación" : "Nueva Capacitación"}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda: Formulario */}
          <form id="capacitacion-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Título <span className="text-red-400">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 ${
                  errors.nombre ? "border-red-500" : ""
                }`}
                placeholder="Ej: Introducción a ISO 9001"
              />
              {errors.nombre && (
                <p className="text-sm text-red-400">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Descripción detallada de la capacitación"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-white flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Instructor
              </Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Nombre del instructor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha Inicio <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                  className={`bg-slate-700 border-slate-600 text-white focus:border-teal-500 ${
                    errors.fecha_inicio ? "border-red-500" : ""
                  }`}
                />
                {errors.fecha_inicio && (
                  <p className="text-sm text-red-400">{errors.fecha_inicio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_fin" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha Fin
                </Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => handleChange('fecha_fin', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracion_horas" className="text-white">
                  Duración (horas)
                </Label>
                <Input
                  id="duracion_horas"
                  type="number"
                  value={formData.duracion_horas}
                  onChange={(e) => handleChange('duracion_horas', parseInt(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="8"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado" className="text-white">
                  Estado
                </Label>
                <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Programada">Programada</SelectItem>
                    <SelectItem value="En Preparación">En Preparación</SelectItem>
                    <SelectItem value="En Curso">En Curso</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalidad" className="text-white">
                Modalidad
              </Label>
              <Select value={formData.modalidad} onValueChange={(value) => handleChange('modalidad', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                  <SelectItem value="Híbrida">Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion" className="text-white">
                Ubicación
              </Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Sala de conferencias, Zoom, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo" className="text-white">
                  Costo
                </Label>
                <Input
                  id="costo"
                  type="number"
                  value={formData.costo}
                  onChange={(e) => handleChange('costo', parseFloat(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cupo_maximo" className="text-white">
                  Cupo Máximo
                </Label>
                <Input
                  id="cupo_maximo"
                  type="number"
                  value={formData.cupo_maximo}
                  onChange={(e) => handleChange('cupo_maximo', parseInt(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requisitos" className="text-white">
                Requisitos
              </Label>
              <Textarea
                id="requisitos"
                value={formData.requisitos}
                onChange={(e) => handleChange('requisitos', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Requisitos previos para participar"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivos" className="text-white">
                Objetivos
              </Label>
              <Textarea
                id="objetivos"
                value={formData.objetivos}
                onChange={(e) => handleChange('objetivos', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Objetivos de aprendizaje"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido" className="text-white">
                Contenido
              </Label>
              <Textarea
                id="contenido"
                value={formData.contenido}
                onChange={(e) => handleChange('contenido', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Contenido del curso"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodologia" className="text-white">
                Metodología
              </Label>
              <Textarea
                id="metodologia"
                value={formData.metodologia}
                onChange={(e) => handleChange('metodologia', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Metodología de enseñanza"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluacion" className="text-white">
                Evaluación
              </Label>
              <Textarea
                id="evaluacion"
                value={formData.evaluacion}
                onChange={(e) => handleChange('evaluacion', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500"
                placeholder="Criterios de evaluación"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="certificacion"
                type="checkbox"
                checked={formData.certificacion}
                onChange={(e) => handleChange('certificacion', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500"
              />
              <Label htmlFor="certificacion" className="text-white">
                Incluye certificación
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isSubmitting ? "Guardando..." : (capacitacion ? "Actualizar" : "Crear")}
              </Button>
            </div>
          </form>

          {/* Columna derecha: Gestión de Temas */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Temas de la Capacitación</h3>
              
              {/* Formulario para agregar/editar tema */}
              <div className="space-y-3 p-4 bg-slate-700 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="tema-titulo" className="text-white text-sm">
                    Título del Tema
                  </Label>
                  <Input
                    id="tema-titulo"
                    value={temaInput.titulo}
                    onChange={(e) => handleTemaInputChange('titulo', e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                    placeholder="Ej: Introducción a la Norma"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tema-descripcion" className="text-white text-sm">
                    Descripción
                  </Label>
                  <Textarea
                    id="tema-descripcion"
                    value={temaInput.descripcion}
                    onChange={(e) => handleTemaInputChange('descripcion', e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                    placeholder="Descripción del tema"
                    rows={2}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={addTema}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm"
                  >
                    {temaEditIndex !== null ? "Actualizar Tema" : "Agregar Tema"}
                  </Button>
                  {temaEditIndex !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setTemaEditIndex(null);
                        setTemaInput({ titulo: '', descripcion: '' });
                      }}
                      className="border-slate-500 text-white hover:bg-slate-600 text-sm"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de temas */}
              <div className="space-y-2">
                {temas.map((tema, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{tema.titulo}</h4>
                      <p className="text-slate-300 text-sm">{tema.descripcion}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editTema(index)}
                        className="text-slate-300 hover:text-white hover:bg-slate-600"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTema(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-600"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
                
                {temas.length === 0 && (
                  <p className="text-slate-400 text-center py-4">
                    No hay temas agregados
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CapacitacionModal;
