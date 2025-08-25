import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Plus, 
  Trash2, 
  BarChart3,
  Award,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const EvaluacionCompetencias = ({ evaluacionId, competencias = [], onCompetenciasChange, readonly = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetencia, setNewCompetencia] = useState({
    competencia_id: '',
    puntaje: '',
    observaciones: ''
  });

  // Función para obtener el color del nivel de cumplimiento
  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'cumple_completo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cumple_parcial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_cumple':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el ícono del nivel
  const getNivelIcon = (nivel) => {
    switch (nivel) {
      case 'cumple_completo':
        return <CheckCircle className="h-4 w-4" />;
      case 'cumple_parcial':
        return <AlertTriangle className="h-4 w-4" />;
      case 'no_cumple':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  // Función para determinar el nivel basado en puntaje
  const determinarNivel = (puntaje) => {
    if (puntaje >= 80) return 'cumple_completo';
    if (puntaje >= 60) return 'cumple_parcial';
    return 'no_cumple';
  };

  // Función para obtener estadísticas
  const getEstadisticas = () => {
    const total = competencias.length;
    const cumpleCompleto = competencias.filter(c => c.nivel_cumplimiento === 'cumple_completo').length;
    const cumpleParcial = competencias.filter(c => c.nivel_cumplimiento === 'cumple_parcial').length;
    const noCumple = competencias.filter(c => c.nivel_cumplimiento === 'no_cumple').length;
    
    const puntajePromedio = total > 0 
      ? competencias.reduce((sum, c) => sum + (parseInt(c.puntaje) || 0), 0) / total 
      : 0;

    return {
      total,
      cumpleCompleto,
      cumpleParcial,
      noCumple,
      puntajePromedio: Math.round(puntajePromedio * 10) / 10,
      porcentajeExito: total > 0 ? Math.round((cumpleCompleto / total) * 100) : 0
    };
  };

  const stats = getEstadisticas();

  const handleAddCompetencia = async () => {
    if (!newCompetencia.competencia_id || !newCompetencia.puntaje) {
      toast.error('Debe seleccionar una competencia y asignar un puntaje');
      return;
    }

    const puntaje = parseInt(newCompetencia.puntaje);
    if (puntaje < 0 || puntaje > 100) {
      toast.error('El puntaje debe estar entre 0 y 100');
      return;
    }

    setIsLoading(true);
    try {
      const competenciaData = {
        id: `COMP_${Date.now()}`,
        entidad_id: evaluacionId,
        norma_id: newCompetencia.competencia_id,
        puntaje: puntaje,
        nivel_cumplimiento: determinarNivel(puntaje),
        observaciones: newCompetencia.observaciones,
        competencia_nombre: 'Nueva Competencia',
        competencia_descripcion: 'Descripción de la competencia'
      };

      onCompetenciasChange && onCompetenciasChange([...competencias, competenciaData]);
      setNewCompetencia({ competencia_id: '', puntaje: '', observaciones: '' });
      setShowAddForm(false);
      toast.success('Competencia agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar competencia:', error);
      toast.error('Error al agregar competencia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCompetencia = async (competenciaId) => {
    if (readonly) return;

    setIsLoading(true);
    try {
      const nuevasCompetencias = competencias.filter(c => c.id !== competenciaId);
      onCompetenciasChange && onCompetenciasChange(nuevasCompetencias);
      toast.success('Competencia eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar competencia:', error);
      toast.error('Error al eliminar competencia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePuntaje = async (competenciaId, nuevoPuntaje) => {
    if (readonly) return;

    const puntaje = parseInt(nuevoPuntaje);
    if (puntaje < 0 || puntaje > 100) return;

    const competenciasActualizadas = competencias.map(c => 
      c.id === competenciaId 
        ? { 
            ...c, 
            puntaje: puntaje, 
            nivel_cumplimiento: determinarNivel(puntaje) 
          }
        : c
    );

    onCompetenciasChange && onCompetenciasChange(competenciasActualizadas);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Cumple</p>
                <p className="text-2xl font-bold text-green-700">{stats.cumpleCompleto}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Parcial</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.cumpleParcial}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold text-purple-700">{stats.puntajePromedio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Éxito</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.porcentajeExito}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso general */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-gray-600">{stats.puntajePromedio}/100</span>
            </div>
            <Progress value={stats.puntajePromedio} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Competencias */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Competencias Evaluadas</span>
          </CardTitle>
          {!readonly && (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulario para agregar competencia */}
          {showAddForm && !readonly && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="competencia_id">Competencia</Label>
                    <Select
                      value={newCompetencia.competencia_id}
                      onValueChange={(value) => 
                        setNewCompetencia(prev => ({ ...prev, competencia_id: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar competencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Comunicación Efectiva</SelectItem>
                        <SelectItem value="2">Trabajo en Equipo</SelectItem>
                        <SelectItem value="3">Liderazgo</SelectItem>
                        <SelectItem value="4">Resolución de Problemas</SelectItem>
                        <SelectItem value="5">Adaptabilidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="puntaje">Puntaje (0-100)</Label>
                    <Input
                      id="puntaje"
                      type="number"
                      min="0"
                      max="100"
                      value={newCompetencia.puntaje}
                      onChange={(e) => 
                        setNewCompetencia(prev => ({ ...prev, puntaje: e.target.value }))
                      }
                      placeholder="Ej: 85"
                    />
                  </div>

                  <div className="flex items-end space-x-2">
                    <Button
                      onClick={handleAddCompetencia}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Agregando...' : 'Agregar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Input
                    id="observaciones"
                    value={newCompetencia.observaciones}
                    onChange={(e) => 
                      setNewCompetencia(prev => ({ ...prev, observaciones: e.target.value }))
                    }
                    placeholder="Comentarios sobre la evaluación..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de competencias */}
          <div className="space-y-4">
            {competencias.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No hay competencias evaluadas</p>
                {!readonly && (
                  <p className="text-sm">Haz clic en "Agregar" para evaluar competencias</p>
                )}
              </div>
            ) : (
              competencias.map((competencia) => (
                <Card key={competencia.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {competencia.competencia_nombre}
                          </h4>
                          <Badge className={getNivelColor(competencia.nivel_cumplimiento)}>
                            {getNivelIcon(competencia.nivel_cumplimiento)}
                            <span className="ml-1">
                              {competencia.nivel_cumplimiento === 'cumple_completo' && 'Cumple Completo'}
                              {competencia.nivel_cumplimiento === 'cumple_parcial' && 'Cumple Parcial'}
                              {competencia.nivel_cumplimiento === 'no_cumple' && 'No Cumple'}
                            </span>
                          </Badge>
                        </div>
                        
                        {competencia.competencia_descripcion && (
                          <p className="text-sm text-gray-600 mb-3">
                            {competencia.competencia_descripcion}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Puntaje:</Label>
                            {readonly ? (
                              <span className="font-bold text-lg">
                                {competencia.puntaje}/100
                              </span>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={competencia.puntaje}
                                onChange={(e) => 
                                  handleUpdatePuntaje(competencia.id, e.target.value)
                                }
                                className="w-20 text-center"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <Progress 
                              value={parseInt(competencia.puntaje) || 0} 
                              className="h-2"
                            />
                          </div>
                        </div>

                        {competencia.observaciones && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Observaciones:</strong> {competencia.observaciones}
                            </p>
                          </div>
                        )}
                      </div>

                      {!readonly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCompetencia(competencia.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluacionCompetencias;
