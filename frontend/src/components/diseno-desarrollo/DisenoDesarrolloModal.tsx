import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import disenoDesarrolloService, { CreateProyectoData, ProyectoDisenoDesarrollo } from '../../services/disenoDesarrolloService';

interface DisenoDesarrolloModalProps {
    isOpen: boolean;
    onClose: () => void;
    proyecto?: ProyectoDisenoDesarrollo | null;
    onSuccess: () => void;
}

const DisenoDesarrolloModal: React.FC<DisenoDesarrolloModalProps> = ({
    isOpen,
    onClose,
    proyecto,
    onSuccess
}) => {
    const [formData, setFormData] = useState<CreateProyectoData>({
        nombre_producto: '',
        descripcion: '',
        etapa_actual: 'planificacion',
        responsable_id: '',
        fecha_inicio: '',
        fecha_fin_estimada: '',
        requisitos_cliente: '',
        especificaciones_tecnicas: '',
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const etapas = [
        { value: 'planificacion', label: 'Planificación' },
        { value: 'entradas', label: 'Entradas' },
        { value: 'diseno', label: 'Diseño' },
        { value: 'revision', label: 'Revisión' },
        { value: 'verificacion', label: 'Verificación' },
        { value: 'validacion', label: 'Validación' },
        { value: 'salidas', label: 'Salidas' },
        { value: 'control_cambios', label: 'Control de Cambios' }
    ];

    useEffect(() => {
        if (proyecto) {
            setFormData({
                nombre_producto: proyecto.nombre_producto || '',
                descripcion: proyecto.descripcion || '',
                etapa_actual: proyecto.etapa_actual || 'planificacion',
                responsable_id: proyecto.responsable_id || '',
                fecha_inicio: proyecto.fecha_inicio || '',
                fecha_fin_estimada: proyecto.fecha_fin_estimada || '',
                requisitos_cliente: proyecto.requisitos_cliente || '',
                especificaciones_tecnicas: proyecto.especificaciones_tecnicas || '',
                observaciones: proyecto.observaciones || ''
            });
        } else {
            setFormData({
                nombre_producto: '',
                descripcion: '',
                etapa_actual: 'planificacion',
                responsable_id: '',
                fecha_inicio: '',
                fecha_fin_estimada: '',
                requisitos_cliente: '',
                especificaciones_tecnicas: '',
                observaciones: ''
            });
        }
        setError(null);
    }, [proyecto, isOpen]);

    const handleInputChange = (field: keyof CreateProyectoData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.nombre_producto.trim()) {
                throw new Error('El nombre del producto es obligatorio');
            }

            if (proyecto) {
                await disenoDesarrolloService.updateProyecto(proyecto.id, formData);
                console.log('✅ Proyecto actualizado exitosamente');
            } else {
                await disenoDesarrolloService.createProyecto(formData);
                console.log('✅ Proyecto creado exitosamente');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error guardando proyecto:', error);
            setError(error instanceof Error ? error.message : 'Error al guardar el proyecto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold">
                        {proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto de Diseño y Desarrollo'}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre_producto">Nombre del Producto *</Label>
                                <Input
                                    id="nombre_producto"
                                    value={formData.nombre_producto}
                                    onChange={(e) => handleInputChange('nombre_producto', e.target.value)}
                                    placeholder="Nombre del producto o servicio"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="etapa_actual">Etapa Actual</Label>
                                <Select
                                    value={formData.etapa_actual}
                                    onValueChange={(value) => handleInputChange('etapa_actual', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar etapa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {etapas.map((etapa) => (
                                            <SelectItem key={etapa.value} value={etapa.value}>
                                                {etapa.label}
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
                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                placeholder="Descripción del producto o servicio"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="responsable_id">Responsable</Label>
                                <Input
                                    id="responsable_id"
                                    value={formData.responsable_id}
                                    onChange={(e) => handleInputChange('responsable_id', e.target.value)}
                                    placeholder="ID del responsable"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={formData.fecha_inicio}
                                    onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha_fin_estimada">Fecha de Fin Estimada</Label>
                            <Input
                                id="fecha_fin_estimada"
                                type="date"
                                value={formData.fecha_fin_estimada}
                                onChange={(e) => handleInputChange('fecha_fin_estimada', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requisitos_cliente">Requisitos del Cliente</Label>
                            <Textarea
                                id="requisitos_cliente"
                                value={formData.requisitos_cliente}
                                onChange={(e) => handleInputChange('requisitos_cliente', e.target.value)}
                                placeholder="Requisitos funcionales y de desempeño del cliente"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="especificaciones_tecnicas">Especificaciones Técnicas</Label>
                            <Textarea
                                id="especificaciones_tecnicas"
                                value={formData.especificaciones_tecnicas}
                                onChange={(e) => handleInputChange('especificaciones_tecnicas', e.target.value)}
                                placeholder="Especificaciones técnicas del producto"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observaciones">Observaciones</Label>
                            <Textarea
                                id="observaciones"
                                value={formData.observaciones}
                                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                placeholder="Observaciones adicionales"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : (proyecto ? 'Actualizar' : 'Crear')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DisenoDesarrolloModal;
