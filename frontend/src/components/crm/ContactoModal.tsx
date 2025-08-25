import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { contactosService } from '@/services/crmService';
import toast from 'react-hot-toast';

const ContactoModal = ({ contacto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    cargo: '',
    empresa: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    estado: '',
    zona_geografica: '',
    tipo_contacto: 'prospecto',
    fuente_contacto: 'referido',
    estado_contacto: 'activo',
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos del contacto si es edición
  useEffect(() => {
    if (contacto) {
      setFormData({
        nombre: contacto.nombre || '',
        apellidos: contacto.apellidos || '',
        cargo: contacto.cargo || '',
        empresa: contacto.empresa || '',
        telefono: contacto.telefono || '',
        email: contacto.email || '',
        direccion: contacto.direccion || '',
        ciudad: contacto.ciudad || '',
        estado: contacto.estado || '',
        zona_geografica: contacto.zona_geografica || '',
        tipo_contacto: contacto.tipo_contacto || 'prospecto',
        fuente_contacto: contacto.fuente_contacto || 'referido',
        estado_contacto: contacto.estado_contacto || 'activo',
        observaciones: contacto.observaciones || ''
      });
    }
  }, [contacto]);

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    try {
      setLoading(true);
      
      if (contacto) {
        // Actualizar contacto existente
        await contactosService.updateContacto(contacto.id, formData);
        toast.success('Contacto actualizado exitosamente');
      } else {
        // Crear nuevo contacto
        await contactosService.createContacto(formData);
        toast.success('Contacto creado exitosamente');
      }
      
      onSave();
    } catch (error) {
      console.error('Error guardando contacto:', error);
      toast.error('Error al guardar el contacto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Nombre del contacto"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            placeholder="Apellidos del contacto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            value={formData.cargo}
            onChange={(e) => handleChange('cargo', e.target.value)}
            placeholder="Cargo o puesto"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            value={formData.empresa}
            onChange={(e) => handleChange('empresa', e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="Número de teléfono"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Correo electrónico"
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Dirección completa"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            placeholder="Ciudad"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Input
            id="estado"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            placeholder="Estado o provincia"
          />
        </div>
      </div>

      {/* Clasificación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zona_geografica">Zona Geográfica</Label>
          <Input
            id="zona_geografica"
            value={formData.zona_geografica}
            onChange={(e) => handleChange('zona_geografica', e.target.value)}
            placeholder="Zona o región"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipo_contacto">Tipo de Contacto</Label>
          <Select 
            value={formData.tipo_contacto} 
            onValueChange={(value) => handleChange('tipo_contacto', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospecto">Prospecto</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="distribuidor">Distribuidor</SelectItem>
              <SelectItem value="proveedor">Proveedor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estado_contacto">Estado</Label>
          <Select 
            value={formData.estado_contacto} 
            onValueChange={(value) => handleChange('estado_contacto', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="calificado">Calificado</SelectItem>
              <SelectItem value="descalificado">Descalificado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fuente de Contacto */}
      <div className="space-y-2">
        <Label htmlFor="fuente_contacto">Fuente de Contacto</Label>
        <Select 
          value={formData.fuente_contacto} 
          onValueChange={(value) => handleChange('fuente_contacto', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="referido">Referido</SelectItem>
            <SelectItem value="evento">Evento</SelectItem>
            <SelectItem value="web">Sitio Web</SelectItem>
            <SelectItem value="cold_call">Cold Call</SelectItem>
            <SelectItem value="redes_sociales">Redes Sociales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => handleChange('observaciones', e.target.value)}
          placeholder="Notas adicionales sobre el contacto"
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Guardando...' : (contacto ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
};

export default ContactoModal;
