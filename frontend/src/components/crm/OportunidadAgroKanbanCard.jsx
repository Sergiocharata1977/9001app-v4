import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building, Calendar, Crop, DollarSign, Edit, Eye, Target, TrendingUp, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card.jsx';

const OportunidadAgroKanbanCard = ({ oportunidad, onCardClick }) => {
    const navigate = useNavigate();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: oportunidad.id,
        data: {
            type: 'OportunidadAgro',
            oportunidad,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
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

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {oportunidad.titulo}
                    </CardTitle>
                    <div className="flex gap-1">
                        <Badge className={`text-xs ${getEtapaBadgeColor(oportunidad.etapa)}`}>
                            {getEtapaLabel(oportunidad.etapa)}
                        </Badge>
                    </div>
                </div>
                <Badge className={`text-xs ${getTipoOportunidadColor(oportunidad.tipo_oportunidad)}`}>
                    {getTipoOportunidadLabel(oportunidad.tipo_oportunidad)}
                </Badge>
            </CardHeader>

            <CardContent className="pt-0 pb-2">
                <div className="space-y-2 text-xs text-gray-600">
                    {oportunidad.descripcion && (
                        <p className="line-clamp-2 text-gray-700">
                            {oportunidad.descripcion}
                        </p>
                    )}

                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span className="font-medium">
                            ${oportunidad.valor_estimado ? Number(oportunidad.valor_estimado).toLocaleString() : '0'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{oportunidad.probabilidad}%</span>
                    </div>

                    {oportunidad.cultivo_objetivo && (
                        <div className="flex items-center gap-1">
                            <Crop className="w-3 h-3" />
                            <span>{oportunidad.cultivo_objetivo}</span>
                        </div>
                    )}

                    {oportunidad.superficie_objetivo && (
                        <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{oportunidad.superficie_objetivo} ha</span>
                        </div>
                    )}

                    {oportunidad.cliente_nombre && (
                        <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            <span className="truncate">{oportunidad.cliente_nombre}</span>
                        </div>
                    )}

                    {oportunidad.vendedor_nombre && (
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{oportunidad.vendedor_nombre}</span>
                        </div>
                    )}

                    {oportunidad.fecha_cierre_esperada && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(oportunidad.fecha_cierre_esperada)}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-2">
                <div className="flex items-center justify-between w-full">
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/crm/oportunidades/${oportunidad.id}`);
                            }}
                        >
                            <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCardClick && onCardClick(oportunidad, 'edit');
                            }}
                        >
                            <Edit className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                        {oportunidad.created_at && formatDate(oportunidad.created_at)}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default OportunidadAgroKanbanCard;
