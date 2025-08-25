import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    Award,
    BarChart3,
    CheckCircle,
    ClipboardList,
    FileText,
    Search,
    Shield,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDirectoCalidad = () => {
    const navigate = useNavigate();

    const handleAccess = (route) => {
        // Simular autenticación temporal
        localStorage.setItem('tempAuth', 'true');
        localStorage.setItem('tempUser', JSON.stringify({
            id: 1,
            name: 'Usuario Temporal Calidad',
            email: 'temp@calidad.com',
            role: 'admin',
            organization_id: 1
        }));
        navigate(route);
    };

    const calidadModules = [
        {
            title: 'Planificación de Calidad',
            description: 'Gestión de la planificación estratégica de calidad',
            icon: Target,
            route: '/app/planificacion-calidad',
            color: 'bg-blue-500',
            features: ['Objetivos de calidad', 'Planificación estratégica', 'Metas organizacionales']
        },
        {
            title: 'Revisión por Dirección',
            description: 'Sistema de revisión y evaluación por la dirección',
            icon: Users,
            route: '/app/revision-direccion',
            color: 'bg-purple-500',
            features: ['Revisiones periódicas', 'Evaluación de resultados', 'Decisiones estratégicas']
        },
        {
            title: 'Normas y Documentos',
            description: 'Gestión de normas y documentación del SGC',
            icon: FileText,
            route: '/app/normas',
            color: 'bg-emerald-500',
            features: ['Normas ISO 9001', 'Documentación del SGC', 'Control de versiones']
        },
        {
            title: 'Documentos del SGC',
            description: 'Administración de documentos del sistema de calidad',
            icon: ClipboardList,
            route: '/app/documentos',
            color: 'bg-orange-500',
            features: ['Manual de calidad', 'Procedimientos', 'Instrucciones de trabajo']
        },
        {
            title: 'Productos y Servicios',
            description: 'Gestión de productos y control de calidad',
            icon: Award,
            route: '/app/productos',
            color: 'bg-teal-500',
            features: ['Catálogo de productos', 'Especificaciones', 'Control de calidad']
        },
        {
            title: 'Auditorías',
            description: 'Sistema de auditorías internas y externas',
            icon: Search,
            route: '/app/auditorias',
            color: 'bg-indigo-500',
            features: ['Auditorías internas', 'Auditorías externas', 'Programa de auditorías']
        },
        {
            title: 'Hallazgos y Acciones',
            description: 'Gestión de hallazgos y acciones correctivas',
            icon: Shield,
            route: '/app/hallazgos',
            color: 'bg-red-500',
            features: ['Hallazgos de auditoría', 'Acciones correctivas', 'Seguimiento']
        },
        {
            title: 'Indicadores de Calidad',
            description: 'Métricas y KPIs del sistema de calidad',
            icon: BarChart3,
            route: '/app/indicadores',
            color: 'bg-green-500',
            features: ['KPIs de calidad', 'Mediciones', 'Análisis de tendencias']
        },
        {
            title: 'Mejoras Continuas',
            description: 'Sistema de gestión de mejoras y optimizaciones',
            icon: TrendingUp,
            route: '/app/mejoras',
            color: 'bg-yellow-500',
            features: ['Propuestas de mejora', 'Seguimiento', 'Implementación']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">
                        🎯 Acceso Directo Calidad
                    </h1>
                    <p className="text-lg text-slate-600 mb-2">
                        Sistema de Gestión de Calidad ISO 9001
                    </p>
                    <Badge variant="secondary" className="text-sm">
                        Acceso Temporal - Sin Autenticación
                    </Badge>
                </div>

                {/* Información del Sistema */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            📊 Estado del Sistema de Calidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">SGC Operativo</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">Normas Implementadas</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-purple-800">Auditorías Activas</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Módulos de Calidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {calidadModules.map((module, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-blue-200 hover:border-blue-300"
                            onClick={() => handleAccess(module.route)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-lg ${module.color} text-white`}>
                                        <module.icon className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                </div>
                                <CardTitle className="text-lg text-slate-800 mt-3">
                                    {module.title}
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    {module.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {module.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full mt-4 group-hover:bg-blue-800 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccess(module.route);
                                    }}
                                >
                                    Acceder
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Información Adicional */}
                <Card className="mt-8 bg-white/80 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-slate-800">
                            ℹ️ Información del Acceso Temporal Calidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">✅ Funcionalidades Disponibles</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Planificación estratégica de calidad</li>
                                    <li>• Revisión por dirección</li>
                                    <li>• Gestión de normas ISO 9001</li>
                                    <li>• Documentación del SGC</li>
                                    <li>• Control de productos y servicios</li>
                                    <li>• Sistema de auditorías</li>
                                    <li>• Gestión de hallazgos</li>
                                    <li>• Indicadores de calidad</li>
                                    <li>• Mejoras continuas</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">⚠️ Limitaciones Temporales</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Sin persistencia de datos</li>
                                    <li>• Sin integración completa con otros módulos</li>
                                    <li>• Acceso solo para desarrollo</li>
                                    <li>• Sin autenticación real</li>
                                    <li>• Sin workflow automatizado</li>
                                    <li>• Sin reportes avanzados</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccessDirectoCalidad;
