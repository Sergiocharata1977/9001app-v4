import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, User } from 'lucide-react';

interface Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  estado?: string;
  tipo?: string;
  categoria?: string;
  responsable?: string;
  fecha_creacion?: string;
  fecha_revision?: string;
  version?: string;
  especificaciones?: string;
  requisitos_calidad?: string;
  proceso_aprobacion?: string;
  documentos_asociados?: string;
  observaciones?: string;
}

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: Producto) => void;
  producto?: Producto | null;
}

interface FormData {
  nombre: string;
  descripcion: string;
  codigo: string;
  estado: string;
  tipo: string;
  categoria: string;
  responsable: string;
  fecha_creacion: string;
  fecha_revision: string;
  version: string;
  especificaciones: string;
  requisitos_calidad: string;
  proceso_aprobacion: string;
  documentos_asociados: string;
  observaciones: string;
}

interface EstadoISO {
  value: string;
  label: string;
  color: string;
}

const ProductoModal: React.FC<ProductoModalProps> = ({ isOpen, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    codigo: '',
    estado: 'planificacion',
    tipo: 'Producto',
    categoria: '',
    responsable: '',
    fecha_creacion: new Date().toISOString().split('T')[0],
    fecha_revision: '',
    version: '1.0',
    especificaciones: '',
    requisitos_calidad: '',
    proceso_aprobacion: '',
    documentos_asociados: '',
    observaciones: ''
  });

  const estadosISO: EstadoISO[] = [
    { value: 'planificacion', label: 'Planificación', color: 'bg-blue-100 text-blue-800' },
    { value: 'entrada', label: 'Entradas', color: 'bg-purple-100 text-purple-800' },
    { value: 'diseno', label: 'Diseño', color: 'bg-orange-100 text-orange-800' },
    { value: 'verificacion', label: 'Verificación', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'validacion', label: 'Validación', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    { value: 'produccion', label: 'En Producción', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'obsoleto', label: 'Obsoleto', color: 'bg-red-100 text-red-800' }
  ];

  const tiposProducto: string[] = [
    'Producto',
    'Servicio',
    'Software',
    'Documento',
    'Proceso'
  ];

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        codigo: producto.codigo || '',
        estado: producto.estado || 'planificacion',
        tipo: producto.tipo || 'Producto',
        categoria: producto.categoria || '',
        responsable: producto.responsable || '',
        fecha_creacion: producto.fecha_creacion || new Date().toISOString().split('T')[0],
        fecha_revision: producto.fecha_revision || '',
        version: producto.version || '1.0',
        especificaciones: producto.especificaciones || '',
        requisitos_calidad: producto.requisitos_calidad || '',
        proceso_aprobacion: producto.proceso_aprobacion || '',
        documentos_asociados: producto.documentos_asociados || '',
        observaciones: producto.observaciones || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        codigo: '',
        estado: 'planificacion',
        tipo: 'Producto',
        categoria: '',
        responsable: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_revision: '',
        version: '1.0',
        especificaciones: '',
        requisitos_calidad: '',
        proceso_aprobacion: '',
        documentos_asociados: '',
        observaciones: ''
      });
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            {producto ? 'Editar Proyecto de Diseño' : 'Nuevo Proyecto de Diseño'}
          </DialogTitle>
          <DialogDescription>
            {producto ? 'Modifica la información del proyecto de diseño y desarrollo' : 'Crea un nuevo proyecto de diseño y desarrollo según ISO 9001:8.3'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Software SGC Pro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Ej: PROD-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe el producto o servicio..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              placeholder="Ej: Software, Hardware, Servicio, Documento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposProducto.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estadosISO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={estado.color}>{estado.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => handleInputChange('responsable', e.target.value)}
                  placeholder="Nombre del responsable"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_creacion">Fecha de Creación</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha_creacion"
                  type="date"
                  value={formData.fecha_creacion}
                  onChange={(e) => handleInputChange('fecha_creacion', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">ISO 9001:8.3 - Proceso de Diseño y Desarrollo</h3>
            
            <div className="space-y-4 mb-6">
              <h4 className="text-md font-medium text-gray-700">8.3.3 - Entradas del Diseño</h4>
              
              <div className="space-y-2">
                <Label htmlFor="especificaciones">Especificaciones Técnicas (Requisitos Funcionales)</Label>
                <Textarea
                  id="especificaciones"
                  value={formData.especificaciones}
                  onChange={(e) => handleInputChange('especificaciones', e.target.value)}
                  placeholder="Define los requisitos funcionales y de desempeño del producto/servicio..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requisitos_calidad">Requisitos de Calidad y Legales</Label>
                <Textarea
                  id="requisitos_calidad"
                  value={formData.requisitos_calidad}
                  onChange={(e) => handleInputChange('requisitos_calidad', e.target.value)}
                  placeholder="Normas ISO aplicables, requisitos legales y reglamentarios..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-md font-medium text-gray-700">8.3.4 - Controles del Diseño</h4>
              
              <div className="space-y-2">
                <Label htmlFor="proceso_aprobacion">Proceso de Aprobación (Verificación y Validación)</Label>
                <Textarea
                  id="proceso_aprobacion"
                  value={formData.proceso_aprobacion}
                  onChange={(e) => handleInputChange('proceso_aprobacion', e.target.value)}
                  placeholder="Actividades de verificación y validación programadas..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_revision">Fecha de Última Revisión</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fecha_revision"
                    type="date"
                    value={formData.fecha_revision}
                    onChange={(e) => handleInputChange('fecha_revision', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-md font-medium text-gray-700">8.3.2 - Planificación y 8.3.6 - Control de Cambios</h4>
              
              <div className="space-y-2">
                <Label htmlFor="documentos_asociados">Documentos Asociados (Planificación y Evidencias)</Label>
                <Textarea
                  id="documentos_asociados"
                  value={formData.documentos_asociados}
                  onChange={(e) => handleInputChange('documentos_asociados', e.target.value)}
                  placeholder="Documentos de planificación, evidencias de revisiones, autorizaciones..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones (Registros de Cambios y Revisiones)</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Registros de revisiones, cambios realizados, autorizaciones..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {producto ? 'Actualizar' : 'Crear'} Proyecto de Diseño
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductoModal;
