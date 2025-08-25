import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    CheckCircle,
    FileText,
    Gauge,
    Settings,
    Target,
    TrendingUp
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDirectoProcesos = () => {
    const navigate = useNavigate();

    const handleAccess = (route) => {
        // Simular autenticación temporal
        localStorage.setItem('tempAuth', 'true');
        localStorage.setItem('tempUser', JSON.stringify({
            id: 1,
            name: 'Usuario Temporal Procesos',
            email: 'temp@procesos.com',
            role: 'admin',
            organization_id: 1
        }));
        navigate(route);
    };

    const procesosModules = [
        {
            title: 'Gestión de Procesos',
            description: 'Administración y documentación de procesos organizacionales',
            icon: Settings,
            route: '/app/procesos',
            color: 'bg-blue-500',
            features: ['Mapeo de procesos', 'Documentación', 'Flujos de trabajo']
        },
        {
            title: 'Mejoras Continuas',
            description: 'Sistema de gestión de mejoras y optimizaciones',
            icon: TrendingUp,
            route: '/app/mejoras',
            color: 'bg-green-500',
            features: ['Propuestas de mejora', 'Seguimiento', 'Implementación']
        },
        {
            title: 'Indicadores',
            description: 'Gestión de indicadores de rendimiento y métricas',
            icon: Target,
            route: '/app/indicadores',
            color: 'bg-purple-500',
            features: ['KPIs organizacionales', 'Mediciones', 'Análisis de tendencias']
        },
        {
            title: 'Productos',
            description: 'Gestión de productos y servicios de la organización',
            icon: FileText,
            route: '/app/productos',
            color: 'bg-orange-500',
            features: ['Catálogo de productos', 'Especificaciones', 'Control de calidad']
        },
        {
            title: 'Objetivos de Calidad',
            description: 'Definición y seguimiento de objetivos de calidad',
            icon: CheckCircle,
            route: '/app/objetivos-calidad',
            color: 'bg-teal-500',
            features: ['Objetivos estratégicos', 'Metas', 'Seguimiento de cumplimiento']
        },
        {
            title: 'Mediciones',
            description: 'Sistema de mediciones y análisis de datos',
            icon: Gauge,
            route: '/app/mediciones',
            color: 'bg-indigo-500',
            features: ['Recolección de datos', 'Análisis estadístico', 'Reportes']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">
                        ⚙️ Acceso Directo Procesos
                    </h1>
                    <p className="text-lg text-slate-600 mb-2">
                        Sistema de Gestión de Procesos y Mejoras Continuas
                    </p>
                    <Badge variant="secondary" className="text-sm">
                        Acceso Temporal - Sin Autenticación
                    </Badge>
                </div>

                {/* Información del Sistema */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            📊 Estado del Sistema de Procesos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">Procesos Documentados</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">Indicadores Activos</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-purple-800">Mejoras en Proceso</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Módulos de Procesos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {procesosModules.map((module, index) => (
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
                            ℹ️ Información del Acceso Temporal Procesos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">✅ Funcionalidades Disponibles</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Mapeo y documentación de procesos</li>
                                    <li>• Gestión de mejoras continuas</li>
                                    <li>• Indicadores de rendimiento</li>
                                    <li>• Catálogo de productos</li>
                                    <li>• Objetivos de calidad</li>
                                    <li>• Sistema de mediciones</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">⚠️ Limitaciones Temporales</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Sin persistencia de datos</li>
                                    <li>• Sin integración SGC completa</li>
                                    <li>• Acceso solo para desarrollo</li>
                                    <li>• Sin autenticación real</li>
                                    <li>• Sin workflow automatizado</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccessDirectoProcesos;
