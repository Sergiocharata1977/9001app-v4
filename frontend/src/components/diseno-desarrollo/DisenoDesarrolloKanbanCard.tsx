import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Edit, Eye, FileText, Star, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

const DisenoDesarrolloKanbanCard = ({ proyecto, onCardClick }) => {
    const navigate = useNavigate();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: proyecto.id,
        data: {
            type: 'ProyectoDisenoDesarrollo',
            proyecto,
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
            case 'planificacion':
                return 'bg-blue-100 text-blue-800';
            case 'entradas':
                return 'bg-purple-100 text-purple-800';
            case 'diseno':
                return 'bg-green-100 text-green-800';
            case 'revision':
                return 'bg-orange-100 text-orange-800';
            case 'verificacion':
                return 'bg-yellow-100 text-yellow-800';
            case 'validacion':
                return 'bg-indigo-100 text-indigo-800';
            case 'salidas':
                return 'bg-teal-100 text-teal-800';
            case 'control_cambios':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEtapaLabel = (etapa) => {
        const etapas = {
            'planificacion': 'Planificación',
            'entradas': 'Entradas',
            'diseno': 'Diseño',
            'revision': 'Revisión',
            'verificacion': 'Verificación',
            'validacion': 'Validación',
            'salidas': 'Salidas',
            'control_cambios': 'Control de Cambios'
        };
        return etapas[etapa] || etapa;
    };

    // Calcular prioridad basada en fecha de fin estimada
    const calcularPrioridad = () => {
        if (!proyecto.fecha_fin_estimada) return 'baja';
        
        const fechaFin = new Date(proyecto.fecha_fin_estimada);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes < 7) return 'alta';
        if (diasRestantes < 30) return 'media';
        return 'baja';
    };

    const getPrioridadColor = (prioridad) => {
        switch (prioridad) {
            case 'alta':
                return 'text-red-600';
            case 'media':
                return 'text-yellow-600';
            case 'baja':
                return 'text-gray-400';
            default:
                return 'text-gray-400';
        }
    };

    const prioridad = calcularPrioridad();

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
                        {proyecto.nombre_producto}
                    </CardTitle>
                    <div className="flex gap-1">
                        <Badge className={`text-xs ${getEtapaBadgeColor(proyecto.etapa_actual)}`}>
                            {getEtapaLabel(proyecto.etapa_actual)}
                        </Badge>
                        <Star className={`w-3 h-3 ${getPrioridadColor(prioridad)}`} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-2">
                <div className="space-y-2 text-xs text-gray-600">
                    {proyecto.descripcion && (
                        <p className="line-clamp-2 text-gray-700">
                            {proyecto.descripcion}
                        </p>
                    )}

                    {proyecto.responsable_id && (
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">Responsable: {proyecto.responsable_id}</span>
                        </div>
                    )}

                    {proyecto.fecha_inicio && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Inicio: {formatDate(proyecto.fecha_inicio)}</span>
                        </div>
                    )}

                    {proyecto.fecha_fin_estimada && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Fin: {formatDate(proyecto.fecha_fin_estimada)}</span>
                        </div>
                    )}

                    {proyecto.requisitos_cliente && (
                        <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span className="truncate">Requisitos: {proyecto.requisitos_cliente.substring(0, 50)}...</span>
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
                                navigate(`/app/diseno-desarrollo/${proyecto.id}`);
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
                                onCardClick && onCardClick(proyecto, 'edit');
                            }}
                        >
                            <Edit className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                        {proyecto.created_at && formatDate(proyecto.created_at)}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default DisenoDesarrolloKanbanCard;
