import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, DialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Users, Plus, Trash2, Edit2, User, Shield, Eye, UserCheck } from 'lucide-react';

// Componente principal para gestionar participantes SGC de un proceso
export default function ProcesoParticipantes({ procesoId, participantes = [], onParticipantesChange }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParticipante, setCurrentParticipante] = useState(null);
  const [participanteToDelete, setParticipanteToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    personal_id: '',
    rol: 'participante',
    observaciones: ''
  });

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      personal_id: '',
      rol: 'participante',
      observaciones: ''
    });
    setCurrentParticipante(null);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal para agregar participante
  const handleAddParticipante = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Abrir modal para editar participante
  const handleEditParticipante = (participante) => {
    setFormData({
      personal_id: participante.personal_id || '',
      rol: participante.rol || 'participante',
      observaciones: participante.observaciones || ''
    });
    setCurrentParticipante(participante);
    setIsModalOpen(true);
  };

  // Guardar participante (crear o actualizar)
  const handleSaveParticipante = async () => {
    try {
      setLoading(true);
      
      if (!formData.personal_id) {
        toast({
          title: 'Error',
          description: 'El ID del personal es obligatorio',
          variant: 'destructive'
        });
        return;
      }

      const url = currentParticipante 
        ? `/api/procesos/${procesoId}/participantes/${currentParticipante.id}`
        : `/api/procesos/${procesoId}/participantes`;
      
      const method = currentParticipante ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar participante');
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: `Participante ${currentParticipante ? 'actualizado' : 'agregado'} exitosamente`
      });

      // Notificar cambio al componente padre
      if (onParticipantesChange) {
        onParticipantesChange();
      }

      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el participante',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar participante
  const handleDeleteParticipante = async (participanteId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/procesos/${procesoId}/participantes/${participanteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar participante');
      }

      toast({
        title: 'Éxito',
        description: 'Participante eliminado exitosamente'
      });

      // Notificar cambio al componente padre
      if (onParticipantesChange) {
        onParticipantesChange();
      }

      setParticipanteToDelete(null);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el participante',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono según el rol
  const getRoleIcon = (rol) => {
    switch (rol) {
      case 'responsable': return <Shield className="h-4 w-4" />;
      case 'ejecutor': return <UserCheck className="h-4 w-4" />;
      case 'supervisor': return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Obtener color del badge según el rol
  const getRoleColor = (rol) => {
    switch (rol) {
      case 'responsable': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ejecutor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'supervisor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'apoyo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Participantes SGC</h3>
          <Badge variant="secondary">{participantes.length}</Badge>
        </div>
        
        <Button 
          onClick={handleAddParticipante}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Participante
        </Button>
      </div>

      {/* Lista de participantes */}
      {participantes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No hay participantes</h4>
            <p className="text-sm text-gray-500 mb-4">Agrega participantes SGC a este proceso</p>
            <Button 
              onClick={handleAddParticipante}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Participante
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participantes.map((participante, index) => (
            <motion.div
              key={participante.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(participante.rol)}
                      <CardTitle className="text-sm font-medium">
                        {participante.nombre_completo || participante.personal_id}
                      </CardTitle>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEditParticipante(participante)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => setParticipanteToDelete(participante.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Rol:</span>
                    <Badge className={getRoleColor(participante.rol)}>
                      {participante.rol}
                    </Badge>
                  </div>
                  
                  {participante.puesto && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Puesto:</span>
                      <span className="text-xs font-medium">{participante.puesto}</span>
                    </div>
                  )}
                  
                  {participante.observaciones && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Observaciones:</span>
                      <p className="text-xs text-gray-700 mt-1">{participante.observaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar participante */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentParticipante ? 'Editar Participante' : 'Agregar Participante'}
            </DialogTitle>
            <DialogDescription>
              {currentParticipante ? 'Actualiza' : 'Agrega'} los datos del participante SGC
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* ID Personal */}
            <div className="space-y-2">
              <Label htmlFor="personal_id">
                ID Personal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="personal_id"
                name="personal_id"
                value={formData.personal_id}
                onChange={handleInputChange}
                placeholder="Ej: PER-001"
                required
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="rol">Rol en el Proceso</Label>
              <Select 
                value={formData.rol} 
                onValueChange={(value) => setFormData(prev => ({...prev, rol: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="responsable">Responsable</SelectItem>
                  <SelectItem value="ejecutor">Ejecutor</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="apoyo">Apoyo</SelectItem>
                  <SelectItem value="participante">Participante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Observaciones sobre la participación"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveParticipante}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!participanteToDelete} onOpenChange={() => setParticipanteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al participante del proceso SGC. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteParticipante(participanteToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
