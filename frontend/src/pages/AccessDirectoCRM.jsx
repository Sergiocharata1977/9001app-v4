import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building2,
    Target,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDirectoCRM = () => {
    const navigate = useNavigate();

    const handleAccess = (route) => {
        // Simular autenticación temporal
        localStorage.setItem('tempAuth', 'true');
        localStorage.setItem('tempUser', JSON.stringify({
            id: 1,
            name: 'Usuario Temporal',
            email: 'temp@crm.com',
            role: 'admin',
            organization_id: 1
        }));
        navigate(route);
    };

    const crmModules = [
        {
            title: 'Dashboard CRM',
            description: 'Vista general de métricas y KPIs del CRM',
            icon: BarChart3,
            route: '/app/crm/dashboard',
            color: 'bg-blue-500',
            features: ['Métricas de ventas', 'Pipeline de oportunidades', 'Rendimiento de vendedores']
        },
        {
            title: 'Gestión de Clientes',
            description: 'Administración completa de la base de clientes',
            icon: Users,
            route: '/app/crm/clientes',
            color: 'bg-emerald-500',
            features: ['CRUD de clientes', 'Categorización A/B/C', 'Asignación de vendedores']
        },
        {
            title: 'Oportunidades',
            description: 'Pipeline de ventas y gestión de oportunidades',
            icon: Target,
            route: '/app/crm/oportunidades',
            color: 'bg-purple-500',
            features: ['Pipeline de ventas', 'Etapas configurables', 'Probabilidades de cierre']
        },
        {
            title: 'Actividades Comerciales',
            description: 'Seguimiento de actividades y tareas comerciales',
            icon: Activity,
            route: '/app/crm/actividades',
            color: 'bg-orange-500',
            features: ['Tipos de actividad', 'Programación', 'Seguimiento de estado']
        },
        {
            title: 'Vendedores',
            description: 'Gestión del equipo comercial',
            icon: Building2,
            route: '/app/crm/vendedores',
            color: 'bg-teal-500',
            features: ['Perfiles de vendedores', 'Métricas de rendimiento', 'Asignaciones']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">
                        🚀 Acceso Directo CRM
                    </h1>
                    <p className="text-lg text-slate-600 mb-2">
                        Sistema de Gestión de Relaciones con Clientes
                    </p>
                    <Badge variant="secondary" className="text-sm">
                        Acceso Temporal - Sin Autenticación
                    </Badge>
                </div>

                {/* Información del Sistema */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            📊 Estado del Sistema CRM
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-800">Backend Operativo</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-blue-800">Base de Datos Conectada</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-purple-800">API Funcional</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Módulos CRM */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crmModules.map((module, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-slate-200 hover:border-slate-300"
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
                                    className="w-full mt-4 group-hover:bg-slate-800 transition-colors"
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
                <Card className="mt-8 bg-white/80 backdrop-blur-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-slate-800">
                            ℹ️ Información del Acceso Temporal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">✅ Funcionalidades Disponibles</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• CRUD completo de clientes</li>
                                    <li>• Gestión de oportunidades de venta</li>
                                    <li>• Actividades comerciales</li>
                                    <li>• Dashboard con métricas</li>
                                    <li>• Asignación de vendedores</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-3">⚠️ Limitaciones Temporales</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li>• Sin persistencia de datos</li>
                                    <li>• Sin integración SGC completa</li>
                                    <li>• Acceso solo para desarrollo</li>
                                    <li>• Sin autenticación real</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccessDirectoCRM;
