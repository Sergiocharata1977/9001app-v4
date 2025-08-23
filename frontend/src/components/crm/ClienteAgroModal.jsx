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
import { Textarea } from '@/components/ui/textarea';
import { clientesAgroService, contactosService, referenciaService } from '@/services/crmService';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ClienteAgroModal = ({ cliente, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        contacto_id: '',
        razon_social: '',
        rfc: '',
        tipo_cliente: 'mediano',
        categoria_agro: 'C',
        zona_geografica: '',
        region: '',
        clima_zona: '',
        tipo_suelo: '',
        direccion: '',
        ciudad: '',
        estado: '',
        superficie_total: '',
        cultivos_principales: '',
        sistema_riego: '',
        tipo_agricultura: 'convencional',
        vendedor_asignado_id: '',
        tecnico_asignado_id: '',
        supervisor_comercial_id: '',
        preferencias_estacionales: '',
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);
    const [contactos, setContactos] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);

    // Cargar datos de referencia
    useEffect(() => {
        const loadReferencias = async () => {
            try {
                const [contactosRes, vendedoresRes, tecnicosRes] = await Promise.all([
                    contactosService.getContactos(),
                    referenciaService.getVendedores(),
                    referenciaService.getTecnicos()
                ]);

                setContactos(contactosRes.data || []);
                setVendedores(vendedoresRes.data || []);
                setTecnicos(tecnicosRes.data || []);
            } catch (error) {
                console.error('Error cargando referencias:', error);
            }
        };

        loadReferencias();
    }, []);

    // Cargar datos del cliente si es edición
    useEffect(() => {
        if (cliente) {
            setFormData({
                contacto_id: cliente.contacto_id || '',
                razon_social: cliente.razon_social || '',
                rfc: cliente.rfc || '',
                tipo_cliente: cliente.tipo_cliente || 'mediano',
                categoria_agro: cliente.categoria_agro || 'C',
                zona_geografica: cliente.zona_geografica || '',
                region: cliente.region || '',
                clima_zona: cliente.clima_zona || '',
                tipo_suelo: cliente.tipo_suelo || '',
                direccion: cliente.direccion || '',
                ciudad: cliente.ciudad || '',
                estado: cliente.estado || '',
                superficie_total: cliente.superficie_total || '',
                cultivos_principales: cliente.cultivos_principales || '',
                sistema_riego: cliente.sistema_riego || '',
                tipo_agricultura: cliente.tipo_agricultura || 'convencional',
                vendedor_asignado_id: cliente.vendedor_asignado_id || '',
                tecnico_asignado_id: cliente.tecnico_asignado_id || '',
                supervisor_comercial_id: cliente.supervisor_comercial_id || '',
                preferencias_estacionales: cliente.preferencias_estacionales || '',
                observaciones: cliente.observaciones || ''
            });
        }
    }, [cliente]);

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

        if (!formData.razon_social.trim()) {
            toast.error('La razón social es obligatoria');
            return;
        }

        if (!formData.contacto_id) {
            toast.error('Debe seleccionar un contacto');
            return;
        }

        try {
            setLoading(true);

            if (cliente) {
                // Actualizar cliente existente
                await clientesAgroService.updateClienteAgro(cliente.id, formData);
                toast.success('Cliente agro actualizado exitosamente');
            } else {
                // Crear nuevo cliente
                await clientesAgroService.createClienteAgro(formData);
                toast.success('Cliente agro creado exitosamente');
            }

            onSave();
        } catch (error) {
            console.error('Error guardando cliente agro:', error);
            toast.error('Error al guardar el cliente agro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contenedor con scroll */}
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6">
                {/* Campos básicos esenciales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contacto_id">Contacto *</Label>
                        <Select
                            value={formData.contacto_id}
                            onValueChange={(value) => handleChange('contacto_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar contacto" />
                            </SelectTrigger>
                            <SelectContent>
                                {contactos.map((contacto) => (
                                    <SelectItem key={contacto.id} value={contacto.id}>
                                        {contacto.nombre} {contacto.apellidos} - {contacto.empresa || 'Sin empresa'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="razon_social">Razón Social *</Label>
                        <Input
                            id="razon_social"
                            value={formData.razon_social}
                            onChange={(e) => handleChange('razon_social', e.target.value)}
                            placeholder="Nombre de la empresa"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rfc">RFC</Label>
                        <Input
                            id="rfc"
                            value={formData.rfc}
                            onChange={(e) => handleChange('rfc', e.target.value)}
                            placeholder="RFC de la empresa"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo_cliente">Tipo de Cliente</Label>
                        <Select
                            value={formData.tipo_cliente}
                            onValueChange={(value) => handleChange('tipo_cliente', value)}
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
                        <Label htmlFor="categoria_agro">Categoría Agro</Label>
                        <Select
                            value={formData.categoria_agro}
                            onValueChange={(value) => handleChange('categoria_agro', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">Categoría A (Alto valor)</SelectItem>
                                <SelectItem value="B">Categoría B (Medio-alto valor)</SelectItem>
                                <SelectItem value="C">Categoría C (Medio valor)</SelectItem>
                                <SelectItem value="D">Categoría D (Bajo valor)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="superficie_total">Superficie Total (ha)</Label>
                        <Input
                            id="superficie_total"
                            type="number"
                            value={formData.superficie_total}
                            onChange={(e) => handleChange('superficie_total', e.target.value)}
                            placeholder="Hectáreas totales"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo_agricultura">Tipo de Agricultura</Label>
                        <Select
                            value={formData.tipo_agricultura}
                            onValueChange={(value) => handleChange('tipo_agricultura', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="convencional">Convencional</SelectItem>
                                <SelectItem value="organica">Orgánica</SelectItem>
                                <SelectItem value="mixta">Mixta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Dirección básica */}
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

                {/* Campos adicionales opcionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="region">Región</Label>
                        <Input
                            id="region"
                            value={formData.region}
                            onChange={(e) => handleChange('region', e.target.value)}
                            placeholder="Región específica"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clima_zona">Clima de la Zona</Label>
                        <Input
                            id="clima_zona"
                            value={formData.clima_zona}
                            onChange={(e) => handleChange('clima_zona', e.target.value)}
                            placeholder="Tipo de clima"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo_suelo">Tipo de Suelo</Label>
                        <Input
                            id="tipo_suelo"
                            value={formData.tipo_suelo}
                            onChange={(e) => handleChange('tipo_suelo', e.target.value)}
                            placeholder="Tipo de suelo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sistema_riego">Sistema de Riego</Label>
                        <Input
                            id="sistema_riego"
                            value={formData.sistema_riego}
                            onChange={(e) => handleChange('sistema_riego', e.target.value)}
                            placeholder="Tipo de riego"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vendedor_asignado_id">Vendedor Asignado</Label>
                        <Select
                            value={formData.vendedor_asignado_id}
                            onValueChange={(value) => handleChange('vendedor_asignado_id', value)}
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

                {/* Campos de texto largos */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cultivos_principales">Cultivos Principales</Label>
                        <Textarea
                            id="cultivos_principales"
                            value={formData.cultivos_principales}
                            onChange={(e) => handleChange('cultivos_principales', e.target.value)}
                            placeholder="Lista de cultivos principales (separados por comas)"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preferencias_estacionales">Preferencias Estacionales</Label>
                        <Textarea
                            id="preferencias_estacionales"
                            value={formData.preferencias_estacionales}
                            onChange={(e) => handleChange('preferencias_estacionales', e.target.value)}
                            placeholder="Preferencias de temporada y estacionalidad"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            value={formData.observaciones}
                            onChange={(e) => handleChange('observaciones', e.target.value)}
                            placeholder="Observaciones adicionales sobre el cliente"
                            rows={3}
                        />
                    </div>
                </div>
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
                    {loading ? 'Guardando...' : (cliente ? 'Actualizar' : 'Crear')}
                </Button>
            </div>
        </form>
    );
};

export default ClienteAgroModal;
