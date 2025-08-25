import React, { useState } from 'react';
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle, XCircle, Clock, Target, Shield, TrendingUp, AlertTriangle } from 'lucide-react';

// Componente principal para gestionar normas SGC de un proceso
export default function ProcesoNormas({ procesoId, normas = [], onNormasChange }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNorma, setCurrentNorma] = useState(null);
  const [normaToDelete, setNormaToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    norma_id: '',
    punto_norma: '',
    clausula_descripcion: '',
    tipo_relacion: 'aplica',
    nivel_cumplimiento: 'pendiente',
    observaciones: '',
    evidencias: '',
    acciones_requeridas: ''
  });

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      norma_id: '',
      punto_norma: '',
      clausula_descripcion: '',
      tipo_relacion: 'aplica',
      nivel_cumplimiento: 'pendiente',
      observaciones: '',
      evidencias: '',
      acciones_requeridas: ''
    });
    setCurrentNorma(null);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal para agregar norma
  const handleAddNorma = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Abrir modal para editar norma
  const handleEditNorma = (norma) => {
    setFormData({
      norma_id: norma.norma_id?.toString() || '',
      punto_norma: norma.punto_norma || '',
      clausula_descripcion: norma.clausula_descripcion || '',
      tipo_relacion: norma.tipo_relacion || 'aplica',
      nivel_cumplimiento: norma.nivel_cumplimiento || 'pendiente',
      observaciones: norma.observaciones || '',
      evidencias: norma.evidencias || '',
      acciones_requeridas: norma.acciones_requeridas || ''
    });
    setCurrentNorma(norma);
    setIsModalOpen(true);
  };

  // Guardar norma (crear o actualizar)
  const handleSaveNorma = async () => {
    try {
      setLoading(true);
      
      if (!formData.norma_id || !formData.punto_norma) {
        toast({
          title: 'Error',
          description: 'La norma y el punto de norma son obligatorios',
          variant: 'destructive'
        });
        return;
      }

      const url = currentNorma 
        ? `/api/procesos/${procesoId}/normas/${currentNorma.id}`
        : `/api/procesos/${procesoId}/normas`;
      
      const method = currentNorma ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          norma_id: parseInt(formData.norma_id)
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar norma');
      }

      const result = await response.json();
      
      toast({
        title: 'Éxito',
        description: `Norma ${currentNorma ? 'actualizada' : 'agregada'} exitosamente`
      });

      // Notificar cambio al componente padre
      if (onNormasChange) {
        onNormasChange();
      }

      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la norma',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar norma
  const handleDeleteNorma = async (normaId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/procesos/${procesoId}/normas/${normaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar norma');
      }

      toast({
        title: 'Éxito',
        description: 'Norma eliminada exitosamente'
      });

      // Notificar cambio al componente padre
      if (onNormasChange) {
        onNormasChange();
      }

      setNormaToDelete(null);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la norma',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono según el tipo de relación
  const getTipoIcon = (tipoRelacion) => {
    switch (tipoRelacion) {
      case 'evidencia': return <Shield className="h-4 w-4" />;
      case 'mejora': return <TrendingUp className="h-4 w-4" />;
      case 'control': return <Target className="h-4 w-4" />;
      case 'medicion': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Obtener color del badge según el nivel de cumplimiento
  const getCumplimientoColor = (nivelCumplimiento) => {
    switch (nivelCumplimiento) {
      case 'cumple_completo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cumple_parcial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'no_cumple': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'en_proceso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Obtener icono según el nivel de cumplimiento
  const getCumplimientoIcon = (nivelCumplimiento) => {
    switch (nivelCumplimiento) {
      case 'cumple_completo': return <CheckCircle className="h-4 w-4" />;
      case 'cumple_parcial': return <Clock className="h-4 w-4" />;
      case 'no_cumple': return <XCircle className="h-4 w-4" />;
      case 'en_proceso': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Obtener color del badge según el tipo de relación
  const getTipoColor = (tipoRelacion) => {
    switch (tipoRelacion) {
      case 'evidencia': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mejora': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'control': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'medicion': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Normas ISO SGC</h3>
          <Badge variant="secondary">{normas.length}</Badge>
        </div>
        
        <Button 
          onClick={handleAddNorma}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Norma
        </Button>
      </div>

      {/* Lista de normas */}
      {normas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">No hay normas</h4>
            <p className="text-sm text-gray-500 mb-4">Relaciona puntos de normas ISO con este proceso</p>
            <Button 
              onClick={handleAddNorma}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Norma
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {normas.map((norma, index) => (
            <motion.div
              key={norma.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(norma.tipo_relacion)}
                      <CardTitle className="text-sm font-medium">
                        {norma.norma_nombre || `Norma ${norma.norma_id}`}
                      </CardTitle>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEditNorma(norma)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => setNormaToDelete(norma.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Punto de norma */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Punto {norma.punto_norma}
                    </Badge>
                    <Badge className={getTipoColor(norma.tipo_relacion)}>
                      {norma.tipo_relacion}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Nivel de cumplimiento */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Cumplimiento:</span>
                    <div className="flex items-center gap-1">
                      {getCumplimientoIcon(norma.nivel_cumplimiento)}
                      <Badge className={getCumplimientoColor(norma.nivel_cumplimiento)}>
                        {norma.nivel_cumplimiento?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Descripción de la cláusula */}
                  {norma.clausula_descripcion && (
                    <div>
                      <span className="text-xs text-gray-500">Cláusula:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{norma.clausula_descripcion}</p>
                    </div>
                  )}
                  
                  {/* Observaciones */}
                  {norma.observaciones && (
                    <div>
                      <span className="text-xs text-gray-500">Observaciones:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{norma.observaciones}</p>
                    </div>
                  )}
                  
                  {/* Evidencias */}
                  {norma.evidencias && (
                    <div>
                      <span className="text-xs text-gray-500">Evidencias:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-1">{norma.evidencias}</p>
                    </div>
                  )}
                  
                  {/* Acciones requeridas */}
                  {norma.acciones_requeridas && (
                    <div>
                      <span className="text-xs text-gray-500">Acciones:</span>
                      <p className="text-xs text-gray-700 mt-1 line-clamp-2">{norma.acciones_requeridas}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar norma */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentNorma ? 'Editar Norma' : 'Agregar Norma'}
            </DialogTitle>
            <DialogDescription>
              {currentNorma ? 'Actualiza' : 'Agrega'} la relación de la norma ISO con el proceso
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* ID Norma */}
              <div className="space-y-2">
                <Label htmlFor="norma_id">
                  ID Norma <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="norma_id"
                  name="norma_id"
                  type="number"
                  value={formData.norma_id}
                  onChange={handleInputChange}
                  placeholder="Ej: 1 (ISO 9001)"
                  required
                />
              </div>

              {/* Punto de Norma */}
              <div className="space-y-2">
                <Label htmlFor="punto_norma">
                  Punto de Norma <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="punto_norma"
                  name="punto_norma"
                  value={formData.punto_norma}
                  onChange={handleInputChange}
                  placeholder="Ej: 4.1, 7.5.3"
                  required
                />
              </div>
            </div>

            {/* Descripción de la Cláusula */}
            <div className="space-y-2">
              <Label htmlFor="clausula_descripcion">Descripción de la Cláusula</Label>
              <Textarea
                id="clausula_descripcion"
                name="clausula_descripcion"
                value={formData.clausula_descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del punto de la norma"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Relación */}
              <div className="space-y-2">
                <Label htmlFor="tipo_relacion">Tipo de Relación</Label>
                <Select 
                  value={formData.tipo_relacion} 
                  onValueChange={(value) => setFormData(prev => ({...prev, tipo_relacion: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aplica">Aplica</SelectItem>
                    <SelectItem value="evidencia">Evidencia</SelectItem>
                    <SelectItem value="mejora">Mejora</SelectItem>
                    <SelectItem value="control">Control</SelectItem>
                    <SelectItem value="medicion">Medición</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nivel de Cumplimiento */}
              <div className="space-y-2">
                <Label htmlFor="nivel_cumplimiento">Nivel de Cumplimiento</Label>
                <Select 
                  value={formData.nivel_cumplimiento} 
                  onValueChange={(value) => setFormData(prev => ({...prev, nivel_cumplimiento: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="cumple_parcial">Cumple Parcial</SelectItem>
                    <SelectItem value="cumple_completo">Cumple Completo</SelectItem>
                    <SelectItem value="no_cumple">No Cumple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Observaciones sobre el cumplimiento"
                className="min-h-[60px]"
              />
            </div>

            {/* Evidencias */}
            <div className="space-y-2">
              <Label htmlFor="evidencias">Evidencias</Label>
              <Textarea
                id="evidencias"
                name="evidencias"
                value={formData.evidencias}
                onChange={handleInputChange}
                placeholder="Evidencias del cumplimiento"
                className="min-h-[60px]"
              />
            </div>

            {/* Acciones Requeridas */}
            <div className="space-y-2">
              <Label htmlFor="acciones_requeridas">Acciones Requeridas</Label>
              <Textarea
                id="acciones_requeridas"
                name="acciones_requeridas"
                value={formData.acciones_requeridas}
                onChange={handleInputChange}
                placeholder="Acciones necesarias para el cumplimiento"
                className="min-h-[60px]"
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
              onClick={handleSaveNorma}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!normaToDelete} onOpenChange={() => setNormaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la relación de la norma con el proceso SGC. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteNorma(normaToDelete)}
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
