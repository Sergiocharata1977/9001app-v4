import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  UserCheck, 
  UserX, 
  Plus, 
  Trash2, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const EvaluacionParticipantes = ({ evaluacionId, participantes = [], onParticipantesChange, readonly = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipante, setNewParticipante] = useState({
    personal_id: '',
    rol: 'evaluado',
    observaciones: ''
  });

  // Función para obtener el color del badge según el rol
  const getRolColor = (rol) => {
    switch (rol) {
      case 'evaluador':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'evaluado':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'supervisor':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'coordinador':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Función para obtener el ícono según el rol
  const getRolIcon = (rol) => {
    switch (rol) {
      case 'evaluador':
        return <UserCheck className="h-4 w-4" />;
      case 'evaluado':
        return <User className="h-4 w-4" />;
      case 'supervisor':
        return <Star className="h-4 w-4" />;
      case 'coordinador':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Función para obtener estadísticas de participantes
  const getEstadisticas = () => {
    const stats = participantes.reduce((acc, p) => {
      acc[p.rol] = (acc[p.rol] || 0) + 1;
      if (p.asistio) acc.asistieron = (acc.asistieron || 0) + 1;
      return acc;
    }, {});

    return {
      total: participantes.length,
      evaluadores: stats.evaluador || 0,
      evaluados: stats.evaluado || 0,
      supervisores: stats.supervisor || 0,
      coordinadores: stats.coordinador || 0,
      asistieron: stats.asistieron || 0
    };
  };

  const stats = getEstadisticas();

  const handleAddParticipante = async () => {
    if (!newParticipante.personal_id) {
      toast.error('Debe seleccionar un empleado');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí se haría la llamada a la API para agregar el participante
      // Por ahora simularemos el éxito
      const participanteData = {
        id: `PART_${Date.now()}`,
        entidad_id: evaluacionId,
        personal_id: newParticipante.personal_id,
        rol: newParticipante.rol,
        asistio: 1,
        observaciones: newParticipante.observaciones,
        // Simular datos del empleado
        nombres: 'Nuevo',
        apellidos: 'Participante',
        cargo: 'Empleado'
      };

      onParticipantesChange && onParticipantesChange([...participantes, participanteData]);
      setNewParticipante({ personal_id: '', rol: 'evaluado', observaciones: '' });
      setShowAddForm(false);
      toast.success('Participante agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar participante:', error);
      toast.error('Error al agregar participante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveParticipante = async (participanteId) => {
    if (readonly) return;

    setIsLoading(true);
    try {
      // Aquí se haría la llamada a la API para eliminar el participante
      const nuevosParticipantes = participantes.filter(p => p.id !== participanteId);
      onParticipantesChange && onParticipantesChange(nuevosParticipantes);
      toast.success('Participante eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar participante:', error);
      toast.error('Error al eliminar participante');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
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
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluados</p>
                <p className="text-2xl font-bold text-green-700">{stats.evaluados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Evaluadores</p>
                <p className="text-2xl font-bold text-purple-700">{stats.evaluadores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.asistieron}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Participantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Participantes de la Evaluación</span>
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
          {/* Formulario para agregar participante */}
          {showAddForm && !readonly && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="personal_id">Empleado</Label>
                    <Select
                      value={newParticipante.personal_id}
                      onValueChange={(value) => 
                        setNewParticipante(prev => ({ ...prev, personal_id: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Juan Pérez</SelectItem>
                        <SelectItem value="2">María García</SelectItem>
                        <SelectItem value="3">Carlos López</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={newParticipante.rol}
                      onValueChange={(value) => 
                        setNewParticipante(prev => ({ ...prev, rol: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evaluado">Evaluado</SelectItem>
                        <SelectItem value="evaluador">Evaluador</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="coordinador">Coordinador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end space-x-2">
                    <Button
                      onClick={handleAddParticipante}
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
                    value={newParticipante.observaciones}
                    onChange={(e) => 
                      setNewParticipante(prev => ({ ...prev, observaciones: e.target.value }))
                    }
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de participantes */}
          <div className="space-y-2">
            {participantes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No hay participantes agregados</p>
                {!readonly && (
                  <p className="text-sm">Haz clic en "Agregar" para incluir participantes</p>
                )}
              </div>
            ) : (
              participantes.map((participante) => (
                <div
                  key={participante.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRolIcon(participante.rol)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {participante.nombres} {participante.apellidos}
                        </h4>
                        <Badge className={getRolColor(participante.rol)}>
                          {participante.rol}
                        </Badge>
                        {participante.asistio ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {participante.cargo}
                      </p>
                      {participante.observaciones && (
                        <p className="text-sm text-gray-500 mt-1">
                          {participante.observaciones}
                        </p>
                      )}
                    </div>
                  </div>

                  {!readonly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipante(participante.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluacionParticipantes;
