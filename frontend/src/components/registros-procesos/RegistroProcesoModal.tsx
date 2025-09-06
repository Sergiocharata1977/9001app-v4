import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Estado {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  orden: number;
}

interface Campo {
  id: string;
  nombre: string;
  tipo: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'checkbox';
  requerido: boolean;
  descripcion: string;
  opciones?: string[];
}

interface PlantillaRegistro {
  id?: string;
  nombre: string;
  descripcion: string;
  estados: Estado[];
  campos: Campo[];
  activa: boolean;
  responsable: string;
}

interface RegistroProcesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plantilla: PlantillaRegistro) => void;
  plantilla?: PlantillaRegistro | null;
}

const tiposCampo = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'date', label: 'Fecha' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Selección' },
  { value: 'checkbox', label: 'Casilla de verificación' }
];

const colores = [
  { value: '#f59e0b', label: 'Amarillo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#10b981', label: 'Verde' },
  { value: '#ef4444', label: 'Rojo' },
  { value: '#8b5cf6', label: 'Púrpura' },
  { value: '#f97316', label: 'Naranja' },
  { value: '#06b6d4', label: 'Cian' },
  { value: '#84cc16', label: 'Lima' }
];

export default function RegistroProcesoModal({ isOpen, onClose, onSave, plantilla }: RegistroProcesoModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PlantillaRegistro>({
    nombre: '',
    descripcion: '',
    estados: [],
    campos: [],
    activa: true,
    responsable: ''
  });

  useEffect(() => {
    if (plantilla) {
      setFormData(plantilla);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        estados: [],
        campos: [],
        activa: true,
        responsable: ''
      });
    }
  }, [plantilla, isOpen]);

  const handleSave = () => {
    if (!formData.nombre.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido.', variant: 'destructive' });
      return;
    }

    if (formData.estados.length === 0) {
      toast({ title: 'Error', description: 'Debe agregar al menos un estado.', variant: 'destructive' });
      return;
    }

    onSave(formData);
    onClose();
  };

  const addEstado = () => {
    const nuevoEstado: Estado = {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      color: '#3b82f6',
      orden: formData.estados.length + 1
    };
    setFormData(prev => ({
      ...prev,
      estados: [...prev.estados, nuevoEstado]
    }));
  };

  const updateEstado = (id: string, field: keyof Estado, value: any) => {
    setFormData(prev => ({
      ...prev,
      estados: prev.estados.map(estado =>
        estado.id === id ? { ...estado, [field]: value } : estado
      )
    }));
  };

  const removeEstado = (id: string) => {
    setFormData(prev => ({
      ...prev,
      estados: prev.estados.filter(estado => estado.id !== id)
    }));
  };

  const addCampo = () => {
    const nuevoCampo: Campo = {
      id: Date.now().toString(),
      nombre: '',
      tipo: 'text',
      requerido: false,
      descripcion: '',
      opciones: []
    };
    setFormData(prev => ({
      ...prev,
      campos: [...prev.campos, nuevoCampo]
    }));
  };

  const updateCampo = (id: string, field: keyof Campo, value: any) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.map(campo =>
        campo.id === id ? { ...campo, [field]: value } : campo
      )
    }));
  };

  const removeCampo = (id: string) => {
    setFormData(prev => ({
      ...prev,
      campos: prev.campos.filter(campo => campo.id !== id)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {plantilla ? 'Editar Plantilla' : 'Nueva Plantilla de Registro'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="estados">Estados</TabsTrigger>
              <TabsTrigger value="campos">Campos</TabsTrigger>
            </TabsList>

            {/* Pestaña General */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la Plantilla</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ej: Limpieza de Cilindros"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      placeholder="Describe el propósito de esta plantilla..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="responsable">Responsable</Label>
                    <Input
                      id="responsable"
                      value={formData.responsable}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                      placeholder="Nombre del responsable"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activa"
                      checked={formData.activa}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activa: checked }))}
                    />
                    <Label htmlFor="activa">Plantilla activa</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Estados */}
            <TabsContent value="estados" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Estados del Flujo</CardTitle>
                    <Button onClick={addEstado} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Estado
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.estados.map((estado, index) => (
                    <Card key={estado.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: estado.color }}
                            />
                            <span className="font-medium">Estado {index + 1}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEstado(estado.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nombre del Estado</Label>
                            <Input
                              value={estado.nombre}
                              onChange={(e) => updateEstado(estado.id, 'nombre', e.target.value)}
                              placeholder="Ej: Pendiente"
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <Select
                              value={estado.color}
                              onValueChange={(value) => updateEstado(estado.id, 'color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {colores.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label>Descripción</Label>
                          <Textarea
                            value={estado.descripcion}
                            onChange={(e) => updateEstado(estado.id, 'descripcion', e.target.value)}
                            placeholder="Describe este estado..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.estados.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay estados configurados</p>
                      <p className="text-sm">Agrega al menos un estado para el flujo</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña Campos */}
            <TabsContent value="campos" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Campos del Formulario</CardTitle>
                    <Button onClick={addCampo} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.campos.map((campo, index) => (
                    <Card key={campo.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">Campo {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCampo(campo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nombre del Campo</Label>
                            <Input
                              value={campo.nombre}
                              onChange={(e) => updateCampo(campo.id, 'nombre', e.target.value)}
                              placeholder="Ej: Fecha de Limpieza"
                            />
                          </div>
                          <div>
                            <Label>Tipo de Campo</Label>
                            <Select
                              value={campo.tipo}
                              onValueChange={(value) => updateCampo(campo.id, 'tipo', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposCampo.map((tipo) => (
                                  <SelectItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label>Descripción</Label>
                          <Textarea
                            value={campo.descripcion}
                            onChange={(e) => updateCampo(campo.id, 'descripcion', e.target.value)}
                            placeholder="Describe este campo..."
                            rows={2}
                          />
                        </div>

                        <div className="mt-4 flex items-center space-x-2">
                          <Switch
                            id={`requerido-${campo.id}`}
                            checked={campo.requerido}
                            onCheckedChange={(checked) => updateCampo(campo.id, 'requerido', checked)}
                          />
                          <Label htmlFor={`requerido-${campo.id}`}>Campo requerido</Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.campos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay campos configurados</p>
                      <p className="text-sm">Agrega campos para el formulario de registro</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            {plantilla ? 'Actualizar' : 'Crear'} Plantilla
          </Button>
        </div>
      </div>
    </div>
  );
}

