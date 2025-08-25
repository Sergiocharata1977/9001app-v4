import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ClipboardCheck, 
  User, 
  Calendar, 
  Star, 
  FileText, 
  Activity, 
  Award, 
  X,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { evaluacionesService } from "@/services/evaluacionesService";
import EvaluacionParticipantes from "./EvaluacionParticipantes";
import EvaluacionCompetencias from "./EvaluacionCompetencias";

const EvaluacionModalSgc = ({ isOpen, onClose, onSave, evaluacion }) => {
  // Estado del formulario básico
  const [formData, setFormData] = useState({
    empleado_id: "",
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: "",
    estado: "pendiente"
  });

  // Estados SGC
  const [participantes, setParticipantes] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basico");

  useEffect(() => {
    if (isOpen) {
      fetchPersonal();
      if (evaluacion) {
        setFormData({
          empleado_id: evaluacion.empleado_id || "",
          fecha_evaluacion: evaluacion.fecha_evaluacion ? 
            new Date(evaluacion.fecha_evaluacion).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          observaciones: evaluacion.observaciones || "",
          estado: evaluacion.estado || "pendiente"
        });
        
        // Cargar datos SGC si existe el ID
        if (evaluacion.id) {
          fetchParticipantes(evaluacion.id);
          fetchCompetencias(evaluacion.id);
        }
      } else {
        // Reset para nueva evaluación
        setFormData({
          empleado_id: "",
          fecha_evaluacion: new Date().toISOString().split('T')[0],
          observaciones: "",
          estado: "pendiente"
        });
        setParticipantes([]);
        setCompetencias([]);
      }
    }
  }, [isOpen, evaluacion]);

  const fetchPersonal = async () => {
    try {
      const data = await evaluacionesService.getPersonal();
      setPersonal(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
      toast.error("Error al cargar lista de personal");
    }
  };

  const fetchParticipantes = async (evaluacionId) => {
    try {
      // API call para obtener participantes de la evaluación
      // const data = await evaluacionesService.getParticipantes(evaluacionId);
      // setParticipantes(data);
      
      // Simulación de datos para desarrollo
      setParticipantes([
        {
          id: 'PART_1',
          personal_id: '1',
          rol: 'evaluado',
          nombres: 'Juan',
          apellidos: 'Pérez',
          cargo: 'Desarrollador',
          asistio: 1,
          observaciones: 'Evaluado principal'
        },
        {
          id: 'PART_2',
          personal_id: '2',
          rol: 'evaluador',
          nombres: 'María',
          apellidos: 'García',
          cargo: 'Team Lead',
          asistio: 1,
          observaciones: 'Evaluador responsable'
        }
      ]);
    } catch (error) {
      console.error('Error al cargar participantes:', error);
      toast.error("Error al cargar participantes");
    }
  };

  const fetchCompetencias = async (evaluacionId) => {
    try {
      // API call para obtener competencias de la evaluación
      // const data = await evaluacionesService.getCompetencias(evaluacionId);
      // setCompetencias(data);
      
      // Simulación de datos para desarrollo
      setCompetencias([
        {
          id: 'COMP_1',
          norma_id: 1,
          competencia_nombre: 'Comunicación Efectiva',
          competencia_descripcion: 'Capacidad de comunicarse de manera clara y efectiva',
          puntaje: 85,
          nivel_cumplimiento: 'cumple_completo',
          observaciones: 'Excelente comunicación con el equipo'
        },
        {
          id: 'COMP_2',
          norma_id: 2,
          competencia_nombre: 'Trabajo en Equipo',
          competencia_descripcion: 'Colaboración efectiva con compañeros',
          puntaje: 75,
          nivel_cumplimiento: 'cumple_parcial',
          observaciones: 'Buena colaboración, puede mejorar en liderazgo'
        }
      ]);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
      toast.error("Error al cargar competencias");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.empleado_id) {
      toast.error("Debe seleccionar un empleado");
      return;
    }
    
    if (!formData.fecha_evaluacion) {
      toast.error("La fecha de evaluación es obligatoria");
      return;
    }

    if (competencias.length === 0) {
      toast.error("Debe evaluar al menos una competencia");
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        empleado_id: parseInt(formData.empleado_id),
        fecha_evaluacion: formData.fecha_evaluacion,
        observaciones: formData.observaciones?.trim() || null,
        competencias: competencias.map(c => ({
          competencia_id: c.norma_id,
          puntaje: c.puntaje
        }))
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast.error("Error al guardar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getResumenEvaluacion = () => {
    const totalCompetencias = competencias.length;
    const cumpleCompleto = competencias.filter(c => c.nivel_cumplimiento === 'cumple_completo').length;
    const puntajePromedio = totalCompetencias > 0 
      ? competencias.reduce((sum, c) => sum + (parseInt(c.puntaje) || 0), 0) / totalCompetencias 
      : 0;

    return {
      totalCompetencias,
      cumpleCompleto,
      puntajePromedio: Math.round(puntajePromedio * 10) / 10,
      evaluados: participantes.filter(p => p.rol === 'evaluado').length,
      evaluadores: participantes.filter(p => p.rol === 'evaluador').length
    };
  };

  const resumen = getResumenEvaluacion();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-white border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <ClipboardCheck className="h-6 w-6" />
            <span>{evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}</span>
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {/* Resumen de la evaluación */}
        {(participantes.length > 0 || competencias.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Participantes</p>
                    <p className="text-lg font-bold text-blue-700">
                      {resumen.evaluados}E / {resumen.evaluadores}R
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Competencias</p>
                    <p className="text-lg font-bold text-green-700">{resumen.totalCompetencias}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Promedio</p>
                    <p className="text-lg font-bold text-purple-700">{resumen.puntajePromedio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-600">Cumple</p>
                    <p className="text-lg font-bold text-emerald-700">{resumen.cumpleCompleto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basico" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Datos Básicos</span>
            </TabsTrigger>
            <TabsTrigger value="participantes" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Participantes</span>
              {participantes.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {participantes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="competencias" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Competencias</span>
              {competencias.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {competencias.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="mt-6">
            <form id="evaluacion-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="empleado_id" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Empleado a Evaluar <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.empleado_id} 
                    onValueChange={(value) => handleChange('empleado_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {personal.map((empleado) => (
                        <SelectItem 
                          key={empleado.id} 
                          value={empleado.id.toString()}
                        >
                          {empleado.nombre} {empleado.apellido}
                          {empleado.puesto && ` - ${empleado.puesto}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_evaluacion" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha de Evaluación <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fecha_evaluacion"
                    type="date"
                    value={formData.fecha_evaluacion}
                    onChange={(e) => handleChange('fecha_evaluacion', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observaciones Generales
                </Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  placeholder="Observaciones generales sobre la evaluación..."
                  rows={4}
                />
              </div>
            </form>
          </TabsContent>

          <TabsContent value="participantes" className="mt-6">
            <EvaluacionParticipantes
              evaluacionId={evaluacion?.id}
              participantes={participantes}
              onParticipantesChange={setParticipantes}
              readonly={false}
            />
          </TabsContent>

          <TabsContent value="competencias" className="mt-6">
            <EvaluacionCompetencias
              evaluacionId={evaluacion?.id}
              competencias={competencias}
              onCompetenciasChange={setCompetencias}
              readonly={false}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex space-x-2">
            {activeTab !== "basico" && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const tabs = ["basico", "participantes", "competencias"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1]);
                  }
                }}
              >
                Anterior
              </Button>
            )}
            {activeTab !== "competencias" && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const tabs = ["basico", "participantes", "competencias"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                Siguiente
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              form="evaluacion-form"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Guardando..." : evaluacion ? "Actualizar" : "Crear"} Evaluación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionModalSgc;
