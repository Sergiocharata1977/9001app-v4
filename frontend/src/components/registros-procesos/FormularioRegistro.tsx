import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, X, Calendar, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  id: string;
  nombre: string;
  descripcion: string;
  estados: Estado[];
  campos: Campo[];
  activa: boolean;
}

interface FormularioRegistroProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (datos: any) => void;
  plantilla: PlantillaRegistro | null;
}

export default function FormularioRegistro({ isOpen, onClose, onSave, plantilla }: FormularioRegistroProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [estadoActual, setEstadoActual] = useState<string>('');

  useEffect(() => {
    if (plantilla && isOpen) {
      // Inicializar con el primer estado
      const primerEstado = plantilla.estados[0];
      setEstadoActual(primerEstado?.id || '');
      
      // Inicializar datos del formulario
      const datosIniciales: Record<string, any> = {};
      plantilla.campos.forEach(campo => {
        switch (campo.tipo) {
          case 'checkbox':
            datosIniciales[campo.id] = false;
            break;
          case 'number':
            datosIniciales[campo.id] = 0;
            break;
          default:
            datosIniciales[campo.id] = '';
        }
      });
      setFormData(datosIniciales);
    }
  }, [plantilla, isOpen]);

  const handleSave = () => {
    // Validar campos requeridos
    const camposRequeridos = plantilla?.campos.filter(campo => campo.requerido) || [];
    const camposFaltantes = camposRequeridos.filter(campo => {
      const valor = formData[campo.id];
      return valor === '' || valor === null || valor === undefined;
    });

    if (camposFaltantes.length > 0) {
      toast({ 
        title: 'Error', 
        description: `Los siguientes campos son requeridos: ${camposFaltantes.map(c => c.nombre).join(', ')}`, 
        variant: 'destructive' 
      });
      return;
    }

    if (!estadoActual) {
      toast({ 
        title: 'Error', 
        description: 'Debe seleccionar un estado', 
        variant: 'destructive' 
      });
      return;
    }

    const datosCompletos = {
      plantilla_id: plantilla?.id,
      estado: estadoActual,
      datos: formData,
      creado: new Date().toISOString(),
      modificado: new Date().toISOString()
    };

    onSave(datosCompletos);
    onClose();
  };

  const renderCampo = (campo: Campo) => {
    const valor = formData[campo.id] || '';

    switch (campo.tipo) {
      case 'text':
        return (
          <Input
            value={valor}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo.id]: e.target.value }))}
            placeholder={campo.descripcion}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={valor}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo.id]: e.target.value }))}
            placeholder={campo.descripcion}
            rows={3}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={valor}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo.id]: e.target.value }))}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={valor}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo.id]: Number(e.target.value) }))}
            placeholder={campo.descripcion}
          />
        );

      case 'select':
        return (
          <Select
            value={valor}
            onValueChange={(value) => setFormData(prev => ({ ...prev, [campo.id]: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={campo.descripcion} />
            </SelectTrigger>
            <SelectContent>
              {campo.opciones?.map((opcion, index) => (
                <SelectItem key={index} value={opcion}>
                  {opcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={campo.id}
              checked={valor}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [campo.id]: checked }))}
            />
            <Label htmlFor={campo.id} className="text-sm">
              {campo.descripcion}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            value={valor}
            onChange={(e) => setFormData(prev => ({ ...prev, [campo.id]: e.target.value }))}
            placeholder={campo.descripcion}
          />
        );
    }
  };

  if (!isOpen || !plantilla) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Nuevo Registro</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{plantilla.nombre}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Estado actual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Estado del Registro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="estado">Estado Actual</Label>
                  <Select
                    value={estadoActual}
                    onValueChange={setEstadoActual}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantilla.estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: estado.color }}
                            />
                            {estado.nombre}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Campos del formulario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Datos del Registro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plantilla.campos.map((campo) => (
                  <div key={campo.id}>
                    <Label htmlFor={campo.id} className="flex items-center gap-2">
                      {campo.nombre}
                      {campo.requerido && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <div className="mt-1">
                      {renderCampo(campo)}
                    </div>
                    {campo.descripcion && (
                      <p className="text-sm text-gray-500 mt-1">{campo.descripcion}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Crear Registro
          </Button>
        </div>
      </div>
    </div>
  );
}

