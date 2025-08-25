import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Shield, Edit, Check, X } from 'lucide-react';
import minutasService from '@/services/minutasService';

const MinutaNormas = ({ minutaId, isOpen }) => {
  const [normas, setNormas] = useState([]);
  const [normasDisponibles, setNormasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNorma, setEditingNorma] = useState(null);
  const [newNorma, setNewNorma] = useState({
    norma_id: '',
    punto_norma: '',
    clausula_descripcion: '',
    tipo_relacion: 'aplica',
    nivel_cumplimiento: 'pendiente',
    observaciones: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && minutaId) {
      fetchNormas();
      fetchNormasDisponibles();
    }
  }, [minutaId, isOpen]);

  const fetchNormas = async () => {
    try {
      setLoading(true);
      const data = await minutasService.getNormas(minutaId);
      setNormas(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar normas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNormasDisponibles = async () => {
    try {
      const data = await minutasService.getNormasDisponibles();
      setNormasDisponibles(data);
    } catch (error) {
      console.error('Error al cargar normas disponibles:', error);
    }
  };

  const handleAddNorma = async () => {
    if (!newNorma.norma_id || !newNorma.punto_norma) {
      toast({
        title: 'Error',
        description: 'Norma y punto son obligatorios',
        variant: 'destructive'
      });
      return;
    }

    try {
      await minutasService.addNorma(minutaId, newNorma);
      
      toast({
        title: 'Éxito',
        description: 'Norma agregada'
      });
      
      setNewNorma({
        norma_id: '',
        punto_norma: '',
        clausula_descripcion: '',
        tipo_relacion: 'aplica',
        nivel_cumplimiento: 'pendiente',
        observaciones: ''
      });
      setShowAddForm(false);
      fetchNormas();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al agregar norma',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateNorma = async (normaId, updateData) => {
    try {
      await minutasService.updateNorma(minutaId, normaId, updateData);
      toast({
        title: 'Éxito',
        description: 'Norma actualizada'
      });
      setEditingNorma(null);
      fetchNormas();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar norma',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveNorma = async (normaId) => {
    try {
      await minutasService.removeNorma(minutaId, normaId);
      toast({
        title: 'Éxito',
        description: 'Norma eliminada'
      });
      fetchNormas();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar norma',
        variant: 'destructive'
      });
    }
  };

  const getNivelCumplimientoBadgeColor = (nivel) => {
    switch (nivel) {
      case 'cumple': return 'bg-green-100 text-green-800';
      case 'no_cumple': return 'bg-red-100 text-red-800';
      case 'cumple_parcial': return 'bg-yellow-100 text-yellow-800';
      case 'no_aplica': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTipoRelacionIcon = (tipo) => {
    switch (tipo) {
      case 'cumple': return <Check className="w-4 h-4 text-green-600" />;
      case 'no_cumple': return <X className="w-4 h-4 text-red-600" />;
      case 'aplica': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNormaSelectedName = (normaId) => {
    const norma = normasDisponibles.find(n => n.id.toString() === normaId);
    return norma ? `${norma.nombre} ${norma.version}` : 'Seleccionar norma';
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Normas ISO ({normas.length})
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="norma">Norma</Label>
                  <Select 
                    value={newNorma.norma_id} 
                    onValueChange={(value) => setNewNorma(prev => ({...prev, norma_id: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar norma" />
                    </SelectTrigger>
                    <SelectContent>
                      {normasDisponibles.map((norma) => (
                        <SelectItem key={norma.id} value={norma.id.toString()}>
                          {norma.nombre} {norma.version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="punto">Punto/Cláusula *</Label>
                  <Input
                    id="punto"
                    value={newNorma.punto_norma}
                    onChange={(e) => setNewNorma(prev => ({...prev, punto_norma: e.target.value}))}
                    placeholder="ej: 5.3, 9.2.1"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="clausula_desc">Descripción de la Cláusula</Label>
                <Input
                  id="clausula_desc"
                  value={newNorma.clausula_descripcion}
                  onChange={(e) => setNewNorma(prev => ({...prev, clausula_descripcion: e.target.value}))}
                  placeholder="ej: Liderazgo y compromiso"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="tipo_relacion">Tipo de Relación</Label>
                  <Select 
                    value={newNorma.tipo_relacion} 
                    onValueChange={(value) => setNewNorma(prev => ({...prev, tipo_relacion: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aplica">Aplica</SelectItem>
                      <SelectItem value="cumple">Cumple</SelectItem>
                      <SelectItem value="no_cumple">No Cumple</SelectItem>
                      <SelectItem value="no_aplica">No Aplica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nivel_cumplimiento">Nivel de Cumplimiento</Label>
                  <Select 
                    value={newNorma.nivel_cumplimiento} 
                    onValueChange={(value) => setNewNorma(prev => ({...prev, nivel_cumplimiento: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="cumple">Cumple</SelectItem>
                      <SelectItem value="no_cumple">No Cumple</SelectItem>
                      <SelectItem value="cumple_parcial">Cumple Parcial</SelectItem>
                      <SelectItem value="no_aplica">No Aplica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={newNorma.observaciones}
                  onChange={(e) => setNewNorma(prev => ({...prev, observaciones: e.target.value}))}
                  placeholder="Observaciones sobre el cumplimiento"
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddNorma} size="sm">
                  Agregar Norma
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
          <div className="text-center py-4">Cargando normas...</div>
        ) : normas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay normas ISO relacionadas</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Agregar primera norma
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {normas.map((norma) => (
              <div 
                key={norma.id} 
                className="p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTipoRelacionIcon(norma.tipo_relacion)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {norma.norma_nombre} - {norma.punto_norma}
                        </span>
                        <Badge className={getNivelCumplimientoBadgeColor(norma.nivel_cumplimiento)}>
                          {norma.nivel_cumplimiento.replace('_', ' ')}
                        </Badge>
                      </div>
                      {norma.clausula_descripcion && (
                        <p className="text-sm text-gray-600 mb-1">
                          {norma.clausula_descripcion}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Tipo: {norma.tipo_relacion} | Versión: {norma.norma_version}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setEditingNorma(norma)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleRemoveNorma(norma.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {norma.observaciones && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Observaciones:</strong> {norma.observaciones}
                  </div>
                )}
                
                {editingNorma && editingNorma.id === norma.id && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <Select 
                        value={editingNorma.nivel_cumplimiento}
                        onValueChange={(value) => setEditingNorma(prev => ({...prev, nivel_cumplimiento: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="cumple">Cumple</SelectItem>
                          <SelectItem value="no_cumple">No Cumple</SelectItem>
                          <SelectItem value="cumple_parcial">Cumple Parcial</SelectItem>
                          <SelectItem value="no_aplica">No Aplica</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={editingNorma.tipo_relacion}
                        onValueChange={(value) => setEditingNorma(prev => ({...prev, tipo_relacion: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aplica">Aplica</SelectItem>
                          <SelectItem value="cumple">Cumple</SelectItem>
                          <SelectItem value="no_cumple">No Cumple</SelectItem>
                          <SelectItem value="no_aplica">No Aplica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      value={editingNorma.observaciones || ''}
                      onChange={(e) => setEditingNorma(prev => ({...prev, observaciones: e.target.value}))}
                      placeholder="Observaciones"
                      rows={2}
                      className="mb-3"
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleUpdateNorma(norma.id, {
                          nivel_cumplimiento: editingNorma.nivel_cumplimiento,
                          tipo_relacion: editingNorma.tipo_relacion,
                          observaciones: editingNorma.observaciones
                        })}
                        size="sm"
                      >
                        Guardar
                      </Button>
                      <Button 
                        onClick={() => setEditingNorma(null)}
                        variant="outline" 
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MinutaNormas;
