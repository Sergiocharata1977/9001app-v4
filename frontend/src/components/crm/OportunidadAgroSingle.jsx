import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { clientesAgroService, oportunidadesAgroService } from '@/services/crmService';
import {
    ArrowLeft,
    Building,
    FileText,
    Hash,
    Leaf,
    Pencil,
    Target,
    Trash2,
    UserCheck,
    UserCog
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OportunidadAgroSingle = () => {
    const [oportunidad, setOportunidad] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOportunidad = async () => {
            try {
                setLoading(true);
                const data = await oportunidadesAgroService.getOportunidadAgro(id);
                setOportunidad(data);

                // Cargar información del cliente si existe
                if (data.cliente_id) {
                    const clienteData = await clientesAgroService.getClienteAgro(data.cliente_id);
                    setCliente(clienteData);
                }
            } catch (err) {
                setError('No se pudo cargar la oportunidad. Es posible que haya sido eliminada.');
                toast({
                    title: 'Error',
                    description: 'No se pudo cargar la oportunidad. Inténtalo de nuevo más tarde.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOportunidad();
        }
    }, [id]);

    const handleEdit = () => {
        navigate(`/app/crm/oportunidades/editar/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta oportunidad?')) {
            try {
                await oportunidadesAgroService.deleteOportunidadAgro(id);
                toast({
                    title: 'Oportunidad eliminada',
                    description: 'La oportunidad ha sido eliminada exitosamente.',
                    variant: 'success',
                });
                navigate('/app/crm/oportunidades');
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'No se pudo eliminar la oportunidad.',
                    variant: 'destructive',
                });
            }
        }
    };

    const getEtapaBadgeColor = (etapa) => {
        switch (etapa) {
            case 'prospeccion':
                return 'bg-blue-100 text-blue-800';
            case 'diagnostico':
                return 'bg-purple-100 text-purple-800';
            case 'propuesta_tecnica':
                return 'bg-orange-100 text-orange-800';
            case 'demostracion':
                return 'bg-yellow-100 text-yellow-800';
            case 'negociacion':
                return 'bg-indigo-100 text-indigo-800';
            case 'cerrada_ganada':
                return 'bg-green-100 text-green-800';
            case 'cerrada_perdida':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTipoOportunidadColor = (tipo) => {
        switch (tipo) {
            case 'nueva':
                return 'bg-emerald-100 text-emerald-800';
            case 'renovacion':
                return 'bg-blue-100 text-blue-800';
            case 'ampliacion':
                return 'bg-purple-100 text-purple-800';
            case 'servicio_tecnico':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEtapaLabel = (etapa) => {
        const etapas = {
            'prospeccion': 'Prospección',
            'diagnostico': 'Diagnóstico',
            'propuesta_tecnica': 'Propuesta Técnica',
            'demostracion': 'Demostración',
            'negociacion': 'Negociación',
            'cerrada_ganada': 'Cerrada Ganada',
            'cerrada_perdida': 'Cerrada Perdida'
        };
        return etapas[etapa] || etapa;
    };

    const getTipoOportunidadLabel = (tipo) => {
        const tipos = {
            'nueva': 'Nueva',
            'renovacion': 'Renovación',
            'ampliacion': 'Ampliación',
            'servicio_tecnico': 'Servicio Técnico'
        };
        return tipos[tipo] || tipo;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-500">Cargando detalles de la oportunidad...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-xl font-semibold text-red-600">Error al Cargar</h2>
                <p className="text-gray-500 mt-2">{error}</p>
                <Button variant="outline" onClick={() => navigate('/app/crm/oportunidades')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Oportunidades
                </Button>
            </div>
        );
    }

    if (!oportunidad) {
        return null;
    }

    return (
        <div className="bg-gray-50/50 min-h-screen">
            {/* Header Principal */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Button onClick={() => navigate('/app/crm/oportunidades')} variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-grow">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Oportunidad: {oportunidad.titulo}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            CRM Agro - Sistema de Gestión Comercial
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleEdit} variant="outline" size="sm">
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                        <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Contenido Principal - 2 columnas */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Información General */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Título</label>
                                        <p className="text-gray-900 font-medium">{oportunidad.titulo}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Estado</label>
                                        <div className="mt-1">
                                            <Badge className={getEtapaBadgeColor(oportunidad.etapa)}>
                                                {getEtapaLabel(oportunidad.etapa)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tipo de Oportunidad</label>
                                        <div className="mt-1">
                                            <Badge className={getTipoOportunidadColor(oportunidad.tipo_oportunidad)}>
                                                {getTipoOportunidadLabel(oportunidad.tipo_oportunidad)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Probabilidad</label>
                                        <p className="text-gray-900 font-medium">{oportunidad.probabilidad}%</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Valor Estimado</label>
                                        <p className="text-gray-900 font-medium">
                                            ${oportunidad.valor_estimado ? Number(oportunidad.valor_estimado).toLocaleString() : '0'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Moneda</label>
                                        <p className="text-gray-900 font-medium">{oportunidad.moneda || 'MXN'}</p>
                                    </div>
                                </div>

                                {oportunidad.descripcion && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Descripción</label>
                                        <p className="text-gray-900 mt-1">{oportunidad.descripcion}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Información Agro Específica */}
                        {(oportunidad.cultivo_objetivo || oportunidad.superficie_objetivo || oportunidad.temporada_objetivo || oportunidad.necesidad_tecnica) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Leaf className="h-5 w-5" />
                                        Información Agro Específica
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {oportunidad.cultivo_objetivo && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Cultivo Objetivo</label>
                                                <p className="text-gray-900 font-medium">{oportunidad.cultivo_objetivo}</p>
                                            </div>
                                        )}
                                        {oportunidad.superficie_objetivo && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Superficie Objetivo</label>
                                                <p className="text-gray-900 font-medium">{oportunidad.superficie_objetivo} hectáreas</p>
                                            </div>
                                        )}
                                        {oportunidad.temporada_objetivo && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Temporada Objetivo</label>
                                                <p className="text-gray-900 font-medium">{oportunidad.temporada_objetivo}</p>
                                            </div>
                                        )}
                                        {oportunidad.necesidad_tecnica && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Necesidad Técnica</label>
                                                <p className="text-gray-900 font-medium">{oportunidad.necesidad_tecnica}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Información del Cliente */}
                        {cliente && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Información del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Razón Social</label>
                                            <p className="text-gray-900 font-medium">{cliente.razon_social}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">RFC</label>
                                            <p className="text-gray-900 font-medium">{cliente.rfc || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tipo de Cliente</label>
                                            <p className="text-gray-900 font-medium">{cliente.tipo_cliente}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Categoría Agro</label>
                                            <p className="text-gray-900 font-medium">Categoría {cliente.categoria_agro}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Zona Geográfica</label>
                                            <p className="text-gray-900 font-medium">{cliente.zona_geografica || 'No especificada'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Superficie Total</label>
                                            <p className="text-gray-900 font-medium">{cliente.superficie_total || 0} hectáreas</p>
                                        </div>
                                    </div>

                                    {cliente.cultivos_principales && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Cultivos Principales</label>
                                            <p className="text-gray-900 mt-1">{cliente.cultivos_principales}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Observaciones */}
                        {oportunidad.observaciones && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Observaciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-900">{oportunidad.observaciones}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - 1 columna */}
                    <div className="space-y-6">

                        {/* Asignación Comercial */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    Asignación Comercial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Vendedor Asignado</label>
                                    <p className="text-gray-900 font-medium">{oportunidad.vendedor_nombre || 'No asignado'}</p>
                                </div>
                                {oportunidad.tecnico_nombre && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Técnico Asignado</label>
                                        <p className="text-gray-900 font-medium">{oportunidad.tecnico_nombre}</p>
                                    </div>
                                )}
                                {oportunidad.supervisor_nombre && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Supervisor</label>
                                        <p className="text-gray-900 font-medium">{oportunidad.supervisor_nombre}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Información de Registro */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hash className="h-5 w-5" />
                                    Información de Registro
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">ID de Oportunidad</label>
                                    <p className="text-gray-900 font-mono text-sm">{oportunidad.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                                    <p className="text-gray-900 font-medium">{formatDate(oportunidad.created_at)}</p>
                                </div>
                                {oportunidad.updated_at && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                                        <p className="text-gray-900 font-medium">{formatDate(oportunidad.updated_at)}</p>
                                    </div>
                                )}
                                {oportunidad.fecha_cierre_esperada && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Fecha de Cierre Esperada</label>
                                        <p className="text-gray-900 font-medium">{formatDate(oportunidad.fecha_cierre_esperada)}</p>
                                    </div>
                                )}
                                {oportunidad.fecha_cierre_real && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Fecha de Cierre Real</label>
                                        <p className="text-gray-900 font-medium">{formatDate(oportunidad.fecha_cierre_real)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Acciones Rápidas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCog className="h-5 w-5" />
                                    Acciones Rápidas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={handleEdit} className="w-full" variant="outline">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar Oportunidad
                                </Button>
                                <Button
                                    onClick={() => navigate(`/app/crm/clientes/${oportunidad.cliente_id}`)}
                                    className="w-full"
                                    variant="outline"
                                    disabled={!oportunidad.cliente_id}
                                >
                                    <Building className="mr-2 h-4 w-4" />
                                    Ver Cliente
                                </Button>
                                <Button
                                    onClick={() => navigate('/app/crm/oportunidades')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a Oportunidades
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OportunidadAgroSingle;
