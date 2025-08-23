import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus, Trash2, X, Users, Mail, Phone, Building2, MapPin, FileText, Calendar, Globe, User, Award
} from "lucide-react";
import { crmService } from '@/services/crmService';
import { useToast } from "@/components/ui/use-toast";

function ClienteModal({ isOpen, onClose, onSave, cliente, organizacionId }) {
  const isEditMode = Boolean(cliente);
  const { toast } = useToast();

  const initialFormData = {
    nombre: "",
    razon_social: "",
    rfc: "",
    tipo_cliente: "potencial",
    categoria: "C",
    direccion: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    pais: "México",
    telefono: "",
    email: "",
    sitio_web: "",
    representante_legal: "",
    vendedor_asignado_id: "",
    supervisor_comercial_id: "",
    zona_venta: "",
    especialidad_interes: "",
    observaciones: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadVendedores();
    }
  }, [isOpen]);

  useEffect(() => {
    if (cliente) {
      setFormData({
        ...initialFormData,
        ...cliente
      });
    } else {
      setFormData(initialFormData);
    }
  }, [cliente, isOpen]);

  const loadVendedores = async () => {
    try {
      const response = await crmService.getVendedores();
      setVendedores(response.data || []);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (formData.rfc && formData.rfc.length < 12) {
      errors.rfc = 'RFC debe tener al menos 12 caracteres';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Error de validación",
        description: Object.values(errors).join(', '),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        organization_id: organizacionId
      };

      let response;
      if (isEditMode) {
        response = await crmService.updateCliente(cliente.id, dataToSave);
      } else {
        response = await crmService.createCliente(dataToSave);
      }

      if (response.success) {
        onSave(response.data);
        toast({
          title: isEditMode ? "Cliente actualizado" : "Cliente creado",
          description: isEditMode ? "El cliente ha sido actualizado exitosamente" : "El cliente ha sido creado exitosamente",
          variant: "default"
        });
      } else {
        throw new Error(response.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error guardando cliente:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contacto">Contacto</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
              <TabsTrigger value="adicional">Adicional</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razon_social">Razón Social</Label>
                  <Input
                    id="razon_social"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleChange}
                    placeholder="Razón social de la empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input
                    id="rfc"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    placeholder="RFC de la empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_cliente">Tipo de Cliente</Label>
                  <Select value={formData.tipo_cliente} onValueChange={(value) => handleSelectChange('tipo_cliente', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="potencial">Potencial</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleSelectChange('categoria', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Alta prioridad</SelectItem>
                      <SelectItem value="B">B - Media prioridad</SelectItem>
                      <SelectItem value="C">C - Baja prioridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacto" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="(55) 1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitio_web">Sitio Web</Label>
                  <Input
                    id="sitio_web"
                    name="sitio_web"
                    value={formData.sitio_web}
                    onChange={handleChange}
                    placeholder="https://www.empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representante_legal">Representante Legal</Label>
                  <Input
                    id="representante_legal"
                    name="representante_legal"
                    value={formData.representante_legal}
                    onChange={handleChange}
                    placeholder="Nombre del representante"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle y número"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ciudad"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    placeholder="Estado"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo_postal">Código Postal</Label>
                  <Input
                    id="codigo_postal"
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleChange}
                    placeholder="12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    placeholder="País"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comercial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendedor_asignado_id">Vendedor Asignado</Label>
                  <Select value={formData.vendedor_asignado_id} onValueChange={(value) => handleSelectChange('vendedor_asignado_id', value)}>
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
                  <Select value={formData.supervisor_comercial_id} onValueChange={(value) => handleSelectChange('supervisor_comercial_id', value)}>
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
                    name="zona_venta"
                    value={formData.zona_venta}
                    onChange={handleChange}
                    placeholder="Zona de venta asignada"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidad_interes">Especialidad de Interés</Label>
                  <Input
                    id="especialidad_interes"
                    name="especialidad_interes"
                    value={formData.especialidad_interes}
                    onChange={handleChange}
                    placeholder="Especialidad o área de interés"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adicional" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones adicionales sobre el cliente"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  {isEditMode ? 'Actualizar' : 'Crear'} Cliente
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ClienteModal;
