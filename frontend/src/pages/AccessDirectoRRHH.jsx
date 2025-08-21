import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    Award,
    Briefcase,
    Building2,
    GraduationCap,
    Target,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDirectoRRHH = () => {
    const navigate = useNavigate();

    const handleAccess = (route) => {
        // Simular autenticación temporal
        localStorage.setItem('tempAuth', 'true');
        localStorage.setItem('tempUser', JSON.stringify({
            id: 1,
            name: 'Usuario Temporal RRHH',
            email: 'temp@rrhh.com',
            role: 'admin',
            organization_id: 1
        }));
        navigate(route);
    };

    const rrhhModules = [
        {
            title: 'Gestión de Personal',
            description: 'Administración completa del personal de la organización',
            icon: Users,
            route: '/app/personal',
            color: 'bg-emerald-500',
            features: ['CRUD de empleados', 'Perfiles completos', 'Asignación de puestos']
        },
        {
            title: 'Departamentos',
            description: 'Organización y estructura departamental',
            icon: Building2,
            route: '/app/departamentos',
            color: 'bg-blue-500',
            features: ['Estructura organizacional', 'Jerarquías', 'Responsabilidades']
        },
        {
            title: 'Puestos de Trabajo',
            description: 'Definición y gestión de roles organizacionales',
            icon: Briefcase,
            route: '/app/puestos',
            color: 'bg-purple-500',
            features: ['Descripción de puestos', 'Competencias requeridas', 'Escalas salariales']
        },
        {
            title: 'Capacitaciones',
            description: 'Gestión de programas de formación y desarrollo',
            icon: GraduationCap,
            route: '/app/capacitaciones',
            color: 'bg-orange-500',
            features: ['Programas de capacitación', 'Seguimiento de asistencia', 'Evaluaciones']
        },
        {
            title: 'Evaluaciones',
            description: 'Sistema de evaluación del desempeño',
            icon: Target,
            route: '/app/evaluaciones',
            color: 'bg-teal-500',
            features: ['Evaluaciones de desempeño', 'Metas y objetivos', 'Feedback']
        },
        {
            title: 'Competencias',
            description: 'Gestión de competencias y habilidades',
            icon: Award,
            route: '/app/competencias',
            color: 'bg-indigo-500',
            features: ['Mapeo de competencias', 'Evaluación de habilidades', 'Plan de desarrollo']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">
                        👥 Acceso Directo RRHH
                    </h1>
                    <p className="text-lg text-slate-600 mb-2">
                        Sistema de Gestión de Recursos Humanos
                    </p>
                    <Badge variant="secondary" className="text-sm">
                        Acceso Temporal - Sin Autenticación
                    </Badge>
                </div>

                {/* Información del Sistema */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm border-emerald-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            📊 Estado del Sistema RRHH
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">Personal Operativo</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">Departamentos Activos</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-purple-800">Puestos Definidos</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Módulos RRHH */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rrhhModules.map((module, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-emerald-200 hover:border-emerald-300"
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
                                    className="w-full mt-4 group-hover:bg-emerald-800 transition-colors"
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
                <Card className="mt-8 bg-white/80 backdrop-blur-sm border-emerald-200">
                    <CardHeader>
                        <CardTitle className="text-slate-800">
                            ℹ️ Información del Acceso Temporal RRHH
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">✅ Funcionalidades Disponibles</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Gestión completa de personal</li>
                                    <li>• Estructura departamental</li>
                                    <li>• Definición de puestos</li>
                                    <li>• Programas de capacitación</li>
                                    <li>• Evaluaciones de desempeño</li>
                                    <li>• Gestión de competencias</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">⚠️ Limitaciones Temporales</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Sin persistencia de datos</li>
                                    <li>• Sin integración SGC completa</li>
                                    <li>• Acceso solo para desarrollo</li>
                                    <li>• Sin autenticación real</li>
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

export default AccessDirectoRRHH;
