import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { crmService } from '@/services/crmService';
import { TIPOS_CLIENTE, CATEGORIAS_CLIENTE } from '@/types/crm';

const ClienteModal = ({ isOpen, onClose, onSave, cliente, mode = 'create' }) => {
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const isDeleteMode = mode === 'delete';

  const initialFormData = {
    nombre: '',
    razon_social: '',
    rfc: '',
    tipo_cliente: 'potencial',
    categoria: 'C',
    direccion: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    pais: 'México',
    telefono: '',
    email: '',
    sitio_web: '',
    representante_legal: '',
    vendedor_asignado_id: '',
    supervisor_comercial_id: '',
    zona_venta: '',
    especialidad_interes: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [vendedores, setVendedores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      cargarVendedores();
      if (cliente && (isEditMode || isViewMode)) {
        setFormData({
          nombre: cliente.nombre || '',
          razon_social: cliente.razon_social || '',
          rfc: cliente.rfc || '',
          tipo_cliente: cliente.tipo_cliente || 'potencial',
          categoria: cliente.categoria || 'C',
          direccion: cliente.direccion || '',
          ciudad: cliente.ciudad || '',
          estado: cliente.estado || '',
          codigo_postal: cliente.codigo_postal || '',
          pais: cliente.pais || 'México',
          telefono: cliente.telefono || '',
          email: cliente.email || '',
          sitio_web: cliente.sitio_web || '',
          representante_legal: cliente.representante_legal || '',
          vendedor_asignado_id: cliente.vendedor_asignado_id || '',
          supervisor_comercial_id: cliente.supervisor_comercial_id || '',
          zona_venta: cliente.zona_venta || '',
          especialidad_interes: cliente.especialidad_interes || '',
          observaciones: cliente.observaciones || ''
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, cliente, mode]);

  const cargarVendedores = async () => {
    try {
      const response = await crmService.getVendedores();
      setVendedores(response.data);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.rfc && formData.rfc.length < 12) {
      newErrors.rfc = 'RFC debe tener al menos 12 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let response;
      
      if (isEditMode) {
        response = await crmService.updateCliente(cliente.id, formData);
      } else {
        response = await crmService.createCliente(formData);
      }

      if (response.success) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setErrors({ submit: 'Error al guardar el cliente' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await crmService.deleteCliente(cliente.id);
      if (response.success) {
        onSave({ deleted: true, id: cliente.id });
        onClose();
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      setErrors({ submit: 'Error al eliminar el cliente' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Modal de confirmación de eliminación
  if (isDeleteMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el cliente <strong>{cliente?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isViewMode ? <Eye className="w-5 h-5" /> : 
             isEditMode ? <Edit className="w-5 h-5" /> : 
             <User className="w-5 h-5" />}
            {isViewMode ? 'Ver Cliente' : 
             isEditMode ? 'Editar Cliente' : 
             'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isViewMode ? 'Información detallada del cliente' :
             isEditMode ? 'Modifica la información del cliente' :
             'Completa la información del nuevo cliente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contacto">Contacto</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
              <TabsTrigger value="adicional">Adicional</TabsTrigger>
            </TabsList>

            {/* Pestaña General */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Nombre del cliente"
                    disabled={isViewMode}
                    className={errors.nombre ? 'border-red-500' : ''}
                  />
                  {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razon_social">Razón Social</Label>
                  <Input
                    id="razon_social"
                    value={formData.razon_social}
                    onChange={(e) => handleInputChange('razon_social', e.target.value)}
                    placeholder="Razón social de la empresa"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input
                    id="rfc"
                    value={formData.rfc}
                    onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                    placeholder="RFC de la empresa"
                    disabled={isViewMode}
                    className={errors.rfc ? 'border-red-500' : ''}
                  />
                  {errors.rfc && <p className="text-sm text-red-500">{errors.rfc}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representante_legal">Representante Legal</Label>
                  <Input
                    id="representante_legal"
                    value={formData.representante_legal}
                    onChange={(e) => handleInputChange('representante_legal', e.target.value)}
                    placeholder="Nombre del representante legal"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_cliente">Tipo de Cliente</Label>
                  <Select
                    value={formData.tipo_cliente}
                    onValueChange={(value) => handleInputChange('tipo_cliente', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_CLIENTE.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => handleInputChange('categoria', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_CLIENTE.map((categoria) => (
                        <SelectItem key={categoria.value} value={categoria.value}>
                          {categoria.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Contacto */}
            <TabsContent value="contacto" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@empresa.com"
                    disabled={isViewMode}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="(55) 1234-5678"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitio_web">Sitio Web</Label>
                  <Input
                    id="sitio_web"
                    value={formData.sitio_web}
                    onChange={(e) => handleInputChange('sitio_web', e.target.value)}
                    placeholder="https://www.empresa.com"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    placeholder="País"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    placeholder="Estado"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder="Ciudad"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_postal">Código Postal</Label>
                  <Input
                    id="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={(e) => handleInputChange('codigo_postal', e.target.value)}
                    placeholder="Código postal"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Dirección completa"
                    disabled={isViewMode}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Comercial */}
            <TabsContent value="comercial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendedor_asignado_id">Vendedor Asignado</Label>
                  <Select
                    value={formData.vendedor_asignado_id}
                    onValueChange={(value) => handleInputChange('vendedor_asignado_id', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombres} {vendedor.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor_comercial_id">Supervisor Comercial</Label>
                  <Select
                    value={formData.supervisor_comercial_id}
                    onValueChange={(value) => handleInputChange('supervisor_comercial_id', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={vendedor.id}>
                          {vendedor.nombres} {vendedor.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zona_venta">Zona de Venta</Label>
                  <Input
                    id="zona_venta"
                    value={formData.zona_venta}
                    onChange={(e) => handleInputChange('zona_venta', e.target.value)}
                    placeholder="Zona de venta asignada"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidad_interes">Especialidad de Interés</Label>
                  <Input
                    id="especialidad_interes"
                    value={formData.especialidad_interes}
                    onChange={(e) => handleInputChange('especialidad_interes', e.target.value)}
                    placeholder="Especialidad o área de interés"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña Adicional */}
            <TabsContent value="adicional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre el cliente"
                  disabled={isViewMode}
                  rows={4}
                />
              </div>

              {isViewMode && cliente && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Registro</Label>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(cliente.fecha_registro).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Último Contacto</Label>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {cliente.fecha_ultimo_contacto ? 
                          new Date(cliente.fecha_ultimo_contacto).toLocaleDateString() : 
                          'Sin contacto registrado'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Badge variant={cliente.is_active ? "default" : "secondary"}>
                      {cliente.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </Button>
            
            {!isViewMode && (
              <>
                {isEditMode && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => onSave({ mode: 'delete', cliente })}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteModal;
