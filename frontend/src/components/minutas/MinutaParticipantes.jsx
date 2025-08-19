import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, User, Check, X } from 'lucide-react';
import minutasService from '@/services/minutasService';

const MinutaParticipantes = ({ minutaId, isOpen }) => {
  const [participantes, setParticipantes] = useState([]);
  const [personalDisponible, setPersonalDisponible] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipante, setNewParticipante] = useState({
    personal_id: '',
    rol: 'participante',
    asistio: false
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && minutaId) {
      fetchParticipantes();
      fetchPersonalDisponible();
    }
  }, [minutaId, isOpen]);

  const fetchParticipantes = async () => {
    try {
      setLoading(true);
      const data = await minutasService.getParticipantes(minutaId);
      setParticipantes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar participantes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalDisponible = async () => {
    try {
      const data = await minutasService.getPersonalDisponible();
      setPersonalDisponible(data);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    }
  };

  const handleAddParticipante = async () => {
    if (!newParticipante.personal_id) {
      toast({
        title: 'Error',
        description: 'Seleccione una persona',
        variant: 'destructive'
      });
      return;
    }

    try {
      await minutasService.addParticipante(minutaId, {
        ...newParticipante,
        asistio: newParticipante.asistio ? 1 : 0
      });
      
      toast({
        title: 'Éxito',
        description: 'Participante agregado'
      });
      
      setNewParticipante({
        personal_id: '',
        rol: 'participante',
        asistio: false
      });
      setShowAddForm(false);
      fetchParticipantes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al agregar participante',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveParticipante = async (participanteId) => {
    try {
      await minutasService.removeParticipante(minutaId, participanteId);
      toast({
        title: 'Éxito',
        description: 'Participante eliminado'
      });
      fetchParticipantes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar participante',
        variant: 'destructive'
      });
    }
  };

  const handleToggleAsistencia = async (participante) => {
    try {
      await minutasService.updateParticipante(minutaId, participante.id, {
        asistio: participante.asistio === 1 ? 0 : 1
      });
      fetchParticipantes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar asistencia',
        variant: 'destructive'
      });
    }
  };

  const getRolBadgeColor = (rol) => {
    switch (rol) {
      case 'organizador': return 'bg-blue-100 text-blue-800';
      case 'responsable': return 'bg-green-100 text-green-800';
      case 'secretario': return 'bg-purple-100 text-purple-800';
      case 'invitado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Participantes ({participantes.length})
          </CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm" 
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {showAddForm && (
          <Card className="mb-4 bg-gray-50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="personal">Persona</Label>
                  <Select 
                    value={newParticipante.personal_id} 
                    onValueChange={(value) => setNewParticipante(prev => ({...prev, personal_id: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalDisponible.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id.toString()}>
                          {persona.nombres} {persona.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rol">Rol</Label>
                  <Select 
                    value={newParticipante.rol} 
                    onValueChange={(value) => setNewParticipante(prev => ({...prev, rol: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participante">Participante</SelectItem>
                      <SelectItem value="organizador">Organizador</SelectItem>
                      <SelectItem value="secretario">Secretario</SelectItem>
                      <SelectItem value="invitado">Invitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="asistio"
                    checked={newParticipante.asistio}
                    onCheckedChange={(checked) => setNewParticipante(prev => ({...prev, asistio: checked}))}
                  />
                  <Label htmlFor="asistio">Asistió</Label>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddParticipante} size="sm">
                  Agregar Participante
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-4">Cargando participantes...</div>
        ) : participantes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay participantes registrados</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Agregar primer participante
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {participantes.map((participante) => (
              <div 
                key={participante.id} 
                className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {participante.nombre_personal}
                      </span>
                      <Badge className={getRolBadgeColor(participante.rol)}>
                        {participante.rol}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {participante.participante_email}
                    </p>
                    {participante.departamento_nombre && (
                      <p className="text-xs text-gray-500">
                        {participante.departamento_nombre}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleAsistencia(participante)}
                    size="sm"
                    variant={participante.asistio === 1 ? "default" : "outline"}
                    className={participante.asistio === 1 ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {participante.asistio === 1 ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {participante.asistio === 1 ? 'Asistió' : 'No asistió'}
                  </Button>
                  
                  <Button
                    onClick={() => handleRemoveParticipante(participante.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MinutaParticipantes;
