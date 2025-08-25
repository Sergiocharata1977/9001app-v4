import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import { clientesAgroService, oportunidadesAgroService, referenciaService } from '@/services/crmService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const OportunidadAgroModal = ({ oportunidad, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // Tipo de oportunidad
    tipo_cliente: 'cliente_existente', // 'cliente_existente' o 'posible_cliente_nuevo'
    
    // Cliente existente
    cliente_id: '',
    
    // Posible cliente nuevo (datos mínimos)
    posible_cliente: {
      titulo: '',
      nombre_contacto: '',
      telefono: '',
      email: '',
      zona_geografica: ''
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
  const [puestos, setPuestos] = useState([]);
  const [personalPorPuesto, setPersonalPorPuesto] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState('');

  // Cargar datos de referencia
  useEffect(() => {
    const loadReferencias = async () => {
      try {
        const [clientesRes, vendedoresRes, puestosRes] = await Promise.all([
          clientesAgroService.getClientesAgro(),
          referenciaService.getVendedores(),
          referenciaService.getPuestos()
        ]);

        setClientes(clientesRes.data || []);
        setVendedores(vendedoresRes.data || []);
        setPuestos(puestosRes.data || []);
      } catch (error) {
        console.error('Error cargando referencias:', error);
        toast.error('Error al cargar datos de referencia');
      }
    };

    loadReferencias();
  }, []);

  // Cargar personal por puesto cuando se selecciona un puesto
  useEffect(() => {
    const loadPersonalPorPuesto = async () => {
      if (puestoSeleccionado) {
        try {
          const response = await referenciaService.getPersonalPorPuesto(puestoSeleccionado);
          setPersonalPorPuesto(response.data || []);
        } catch (error) {
          console.error('Error cargando personal por puesto:', error);
          setPersonalPorPuesto([]);
        }
      } else {
        setPersonalPorPuesto([]);
      }
    };

    loadPersonalPorPuesto();
  }, [puestoSeleccionado]);

  // Manejar cambio de puesto
  const handlePuestoChange = (puestoId) => {
    setPuestoSeleccionado(puestoId);
    setFormData(prev => ({ ...prev, vendedor_id: '' })); // Reset vendedor cuando cambia puesto
  };

  // Cargar datos de la oportunidad si es edición
  useEffect(() => {
    if (oportunidad) {
      setFormData({
        tipo_cliente: oportunidad.cliente_id ? 'cliente_existente' : 'posible_cliente_nuevo',
        cliente_id: oportunidad.cliente_id || '',
        posible_cliente: {
          titulo: oportunidad.posible_cliente?.titulo || '',
          nombre_contacto: oportunidad.posible_cliente?.nombre_contacto || '',
          telefono: oportunidad.posible_cliente?.telefono || '',
          email: oportunidad.posible_cliente?.email || '',
          zona_geografica: oportunidad.posible_cliente?.zona_geografica || ''
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

  // Manejar cambios en posible cliente
  const handlePosibleClienteChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      posible_cliente: {
        ...prev.posible_cliente,
        [field]: value
      }
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.titulo.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!formData.vendedor_id) {
      toast.error('Debe seleccionar un vendedor');
      return;
    }

    // Validaciones según tipo de oportunidad
    if (formData.tipo_cliente === 'cliente_existente' && !formData.cliente_id) {
      toast.error('Debe seleccionar un cliente');
      return;
    }

    if (formData.tipo_cliente === 'posible_cliente_nuevo') {
      if (!formData.posible_cliente.titulo.trim()) {
        toast.error('El título del posible cliente es obligatorio');
        return;
      }
      if (!formData.posible_cliente.nombre_contacto.trim()) {
        toast.error('El nombre de contacto es obligatorio');
        return;
      }
      if (!formData.posible_cliente.telefono.trim()) {
        toast.error('El teléfono es obligatorio');
        return;
      }
    }

    try {
      setLoading(true);

      const oportunidadData = {
        ...formData,
        // Incluir datos del posible cliente si aplica
        ...(formData.tipo_cliente === 'posible_cliente_nuevo' && {
          posible_cliente: formData.posible_cliente
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

        {/* Selección de tipo de oportunidad */}
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
                <SelectItem value="cliente_existente">Cliente Existente</SelectItem>
                <SelectItem value="posible_cliente_nuevo">Posible Cliente Nuevo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cliente existente */}
          {formData.tipo_cliente === 'cliente_existente' && (
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
          )}

          {/* Posible cliente nuevo */}
          {formData.tipo_cliente === 'posible_cliente_nuevo' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Datos del Posible Cliente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo_cliente">Título del Cliente *</Label>
                  <Input
                    id="titulo_cliente"
                    value={formData.posible_cliente.titulo}
                    onChange={(e) => handlePosibleClienteChange('titulo', e.target.value)}
                    placeholder="Ej: Productor de Soja en Córdoba"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre_contacto">Nombre de Contacto *</Label>
                  <Input
                    id="nombre_contacto"
                    value={formData.posible_cliente.nombre_contacto}
                    onChange={(e) => handlePosibleClienteChange('nombre_contacto', e.target.value)}
                    placeholder="Nombre y apellido"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.posible_cliente.telefono}
                    onChange={(e) => handlePosibleClienteChange('telefono', e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.posible_cliente.email}
                    onChange={(e) => handlePosibleClienteChange('email', e.target.value)}
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="zona_geografica">Zona Geográfica</Label>
                  <Input
                    id="zona_geografica"
                    value={formData.posible_cliente.zona_geografica}
                    onChange={(e) => handlePosibleClienteChange('zona_geografica', e.target.value)}
                    placeholder="Ej: Córdoba, Santa Fe, etc."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pestañas para información de la oportunidad */}
        <Tabs defaultValue="oportunidad" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oportunidad">Oportunidad</TabsTrigger>
            <TabsTrigger value="adicional">Adicional</TabsTrigger>
          </TabsList>

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
                <Label htmlFor="puesto_id">Puesto del Vendedor</Label>
                <Select
                  value={puestoSeleccionado}
                  onValueChange={handlePuestoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar puesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {puestos.map((puesto) => (
                      <SelectItem key={puesto.id} value={puesto.id}>
                        {puesto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendedor_id">Vendedor Asignado *</Label>
                <Select
                  value={formData.vendedor_id}
                  onValueChange={(value) => handleChange('vendedor_id', value)}
                  disabled={!puestoSeleccionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={puestoSeleccionado ? "Seleccionar vendedor" : "Primero seleccione un puesto"} />
                  </SelectTrigger>
                  <SelectContent>
                    {personalPorPuesto.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.nombres} {persona.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!puestoSeleccionado && (
                  <p className="text-sm text-gray-500">Seleccione un puesto para ver los vendedores disponibles</p>
                )}
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
