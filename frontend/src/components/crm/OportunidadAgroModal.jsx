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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { oportunidadesAgroService, clientesAgroService, referenciaService } from '@/services/crmService';
import toast from 'react-hot-toast';

const OportunidadAgroModal = ({ oportunidad, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Cliente
    tipo_cliente: 'existente', // 'existente' o 'nuevo'
    cliente_id: '',
    nuevo_cliente: {
      razon_social: '',
      rfc: '',
      tipo_cliente: 'mediano',
      zona_geografica: '',
      superficie_total: '',
      cultivos_principales: ''
    },

    // Oportunidad
    titulo: '',
    descripcion: '',
    tipo_oportunidad: 'nueva',
    etapa: 'prospeccion',
    probabilidad: 25,
    valor_estimado: '',

    // Asignación
    vendedor_id: '',

    // Información adicional
    cultivo_objetivo: '',
    superficie_objetivo: '',
    temporada_objetivo: '',
    necesidad_tecnica: '',
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);

  // Cargar datos de referencia
  useEffect(() => {
    const loadReferencias = async () => {
      try {
        const [clientesRes, vendedoresRes] = await Promise.all([
          clientesAgroService.getClientesAgro(),
          referenciaService.getVendedores()
        ]);

        setClientes(clientesRes.data || []);
        setVendedores(vendedoresRes.data || []);
      } catch (error) {
        console.error('Error cargando referencias:', error);
        toast.error('Error al cargar datos de referencia');
      }
    };

    loadReferencias();
  }, []);

  // Cargar datos de la oportunidad si es edición
  useEffect(() => {
    if (oportunidad) {
      setFormData({
        tipo_cliente: oportunidad.cliente_id ? 'existente' : 'nuevo',
        cliente_id: oportunidad.cliente_id || '',
        nuevo_cliente: {
          razon_social: oportunidad.nuevo_cliente?.razon_social || '',
          rfc: oportunidad.nuevo_cliente?.rfc || '',
          tipo_cliente: oportunidad.nuevo_cliente?.tipo_cliente || 'mediano',
          zona_geografica: oportunidad.nuevo_cliente?.zona_geografica || '',
          superficie_total: oportunidad.nuevo_cliente?.superficie_total || '',
          cultivos_principales: oportunidad.nuevo_cliente?.cultivos_principales || ''
        },
        titulo: oportunidad.titulo || '',
        descripcion: oportunidad.descripcion || '',
        tipo_oportunidad: oportunidad.tipo_oportunidad || 'nueva',
        etapa: oportunidad.etapa || 'prospeccion',
        probabilidad: oportunidad.probabilidad || 25,
        valor_estimado: oportunidad.valor_estimado || '',
        vendedor_id: oportunidad.vendedor_id || '',
        cultivo_objetivo: oportunidad.cultivo_objetivo || '',
        superficie_objetivo: oportunidad.superficie_objetivo || '',
        temporada_objetivo: oportunidad.temporada_objetivo || '',
        necesidad_tecnica: oportunidad.necesidad_tecnica || '',
        observaciones: oportunidad.observaciones || ''
      });
    }
  }, [oportunidad]);

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar cambios en nuevo cliente
  const handleNuevoClienteChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      nuevo_cliente: {
        ...prev.nuevo_cliente,
        [field]: value
      }
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!formData.vendedor_id) {
      toast.error('Debe seleccionar un vendedor');
      return;
    }

    if (formData.tipo_cliente === 'existente' && !formData.cliente_id) {
      toast.error('Debe seleccionar un cliente');
      return;
    }

    if (formData.tipo_cliente === 'nuevo' && !formData.nuevo_cliente.razon_social.trim()) {
      toast.error('La razón social del nuevo cliente es obligatoria');
      return;
    }

    try {
      setLoading(true);

      const oportunidadData = {
        ...formData,
        // Si es cliente nuevo, incluir los datos del nuevo cliente
        ...(formData.tipo_cliente === 'nuevo' && {
          nuevo_cliente: formData.nuevo_cliente
        })
      };

      if (oportunidad) {
        await oportunidadesAgroService.updateOportunidadAgro(oportunidad.id, oportunidadData);
        toast.success('Oportunidad agro actualizada exitosamente');
      } else {
        await oportunidadesAgroService.createOportunidadAgro(oportunidadData);
        toast.success('Oportunidad agro creada exitosamente');
      }

      onSave();
    } catch (error) {
      console.error('Error guardando oportunidad agro:', error);
      toast.error('Error al guardar la oportunidad agro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contenedor con scroll */}
      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">

        {/* Pestaña de Cliente */}
        <Tabs defaultValue="cliente" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="oportunidad">Oportunidad</TabsTrigger>
            <TabsTrigger value="adicional">Adicional</TabsTrigger>
          </TabsList>

          {/* Pestaña Cliente */}
          <TabsContent value="cliente" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Cliente</Label>
                <Select
                  value={formData.tipo_cliente}
                  onValueChange={(value) => handleChange('tipo_cliente', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existente">Cliente Existente</SelectItem>
                    <SelectItem value="nuevo">Nuevo Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipo_cliente === 'existente' ? (
                <div className="space-y-2">
                  <Label htmlFor="cliente_id">Seleccionar Cliente *</Label>
                  <Select
                    value={formData.cliente_id}
                    onValueChange={(value) => handleChange('cliente_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente existente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.razon_social} - {cliente.zona_geografica || 'Sin zona'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razon_social">Razón Social *</Label>
                    <Input
                      id="razon_social"
                      value={formData.nuevo_cliente.razon_social}
                      onChange={(e) => handleNuevoClienteChange('razon_social', e.target.value)}
                      placeholder="Nombre de la empresa"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input
                      id="rfc"
                      value={formData.nuevo_cliente.rfc}
                      onChange={(e) => handleNuevoClienteChange('rfc', e.target.value)}
                      placeholder="RFC de la empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_cliente">Tipo de Cliente</Label>
                    <Select
                      value={formData.nuevo_cliente.tipo_cliente}
                      onValueChange={(value) => handleNuevoClienteChange('tipo_cliente', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeño (&lt; 10 ha)</SelectItem>
                        <SelectItem value="mediano">Mediano (10-100 ha)</SelectItem>
                        <SelectItem value="grande">Grande (&gt; 100 ha)</SelectItem>
                        <SelectItem value="cooperativa">Cooperativa</SelectItem>
                        <SelectItem value="distribuidor">Distribuidor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zona_geografica">Zona Geográfica</Label>
                    <Input
                      id="zona_geografica"
                      value={formData.nuevo_cliente.zona_geografica}
                      onChange={(e) => handleNuevoClienteChange('zona_geografica', e.target.value)}
                      placeholder="Zona geográfica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="superficie_total">Superficie Total (ha)</Label>
                    <Input
                      id="superficie_total"
                      type="number"
                      value={formData.nuevo_cliente.superficie_total}
                      onChange={(e) => handleNuevoClienteChange('superficie_total', e.target.value)}
                      placeholder="Superficie en hectáreas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cultivos_principales">Cultivos Principales</Label>
                    <Input
                      id="cultivos_principales"
                      value={formData.nuevo_cliente.cultivos_principales}
                      onChange={(e) => handleNuevoClienteChange('cultivos_principales', e.target.value)}
                      placeholder="Maíz, trigo, soya..."
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña Oportunidad */}
          <TabsContent value="oportunidad" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título de la Oportunidad *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  placeholder="Título de la oportunidad"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_oportunidad">Tipo de Oportunidad</Label>
                <Select
                  value={formData.tipo_oportunidad}
                  onValueChange={(value) => handleChange('tipo_oportunidad', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nueva">Nueva</SelectItem>
                    <SelectItem value="renovacion">Renovación</SelectItem>
                    <SelectItem value="ampliacion">Ampliación</SelectItem>
                    <SelectItem value="servicio_tecnico">Servicio Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="etapa">Etapa</Label>
                <Select
                  value={formData.etapa}
                  onValueChange={(value) => handleChange('etapa', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospeccion">Prospección</SelectItem>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    <SelectItem value="propuesta_tecnica">Propuesta Técnica</SelectItem>
                    <SelectItem value="demostracion">Demostración</SelectItem>
                    <SelectItem value="negociacion">Negociación</SelectItem>
                    <SelectItem value="cerrada_ganada">Cerrada Ganada</SelectItem>
                    <SelectItem value="cerrada_perdida">Cerrada Perdida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="probabilidad">Probabilidad (%)</Label>
                <Select
                  value={formData.probabilidad.toString()}
                  onValueChange={(value) => handleChange('probabilidad', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_estimado">Valor Estimado</Label>
                <Input
                  id="valor_estimado"
                  type="number"
                  value={formData.valor_estimado}
                  onChange={(e) => handleChange('valor_estimado', e.target.value)}
                  placeholder="Valor estimado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendedor_id">Vendedor Asignado *</Label>
                <Select
                  value={formData.vendedor_id}
                  onValueChange={(value) => handleChange('vendedor_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map((vendedor) => (
                      <SelectItem key={vendedor.id} value={vendedor.id}>
                        {vendedor.nombres} {vendedor.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                placeholder="Descripción detallada de la oportunidad"
                rows={4}
              />
            </div>
          </TabsContent>

          {/* Pestaña Adicional */}
          <TabsContent value="adicional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cultivo_objetivo">Cultivo Objetivo</Label>
                <Input
                  id="cultivo_objetivo"
                  value={formData.cultivo_objetivo}
                  onChange={(e) => handleChange('cultivo_objetivo', e.target.value)}
                  placeholder="Cultivo objetivo de la oportunidad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="superficie_objetivo">Superficie Objetivo (ha)</Label>
                <Input
                  id="superficie_objetivo"
                  type="number"
                  value={formData.superficie_objetivo}
                  onChange={(e) => handleChange('superficie_objetivo', e.target.value)}
                  placeholder="Superficie objetivo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temporada_objetivo">Temporada Objetivo</Label>
                <Input
                  id="temporada_objetivo"
                  value={formData.temporada_objetivo}
                  onChange={(e) => handleChange('temporada_objetivo', e.target.value)}
                  placeholder="Primavera-Verano 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="necesidad_tecnica">Necesidad Técnica</Label>
                <Input
                  id="necesidad_tecnica"
                  value={formData.necesidad_tecnica}
                  onChange={(e) => handleChange('necesidad_tecnica', e.target.value)}
                  placeholder="Necesidad técnica específica"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales"
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Botones fijos en la parte inferior */}
      <div className="flex justify-end gap-3 pt-4 border-t">
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
          {loading ? 'Guardando...' : (oportunidad ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
};

export default OportunidadAgroModal;
