import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Calendar,
    Heart,
    Shield,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CRMSatisfaccionMenu = ({ onBackToMainMenu }) => {
    const navigate = useNavigate();

    // Configuración de módulos de CRM y Satisfacción
    const crmSatisfaccionModules = [
        {
            id: 'clientes',
            title: 'Clientes',
            subtitle: 'Gestión de Clientes',
            description: 'Administración integral de clientes y contactos',
            icon: Users,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/clientes',
            metrics: {
                clientes: '45',
                activos: '38',
                prospectos: '12',
                categorias: '8'
            },
            features: ['Gestión de clientes', 'Datos de contacto', 'Categorización', 'Historial']
        },
        {
            id: 'oportunidades',
            title: 'Oportunidades',
            subtitle: 'Pipeline de Ventas',
            description: 'Gestión de oportunidades comerciales y pipeline',
            icon: Target,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/oportunidades',
            metrics: {
                oportunidades: '12',
                abiertas: '8',
                cerradas: '4',
                valor: '$156K'
            },
            features: ['Pipeline de ventas', 'Seguimiento', 'Valoración', 'Cierre']
        },
        {
            id: 'actividades',
            title: 'Actividades',
            subtitle: 'Actividades Comerciales',
            description: 'Gestión de actividades y seguimiento comercial',
            icon: Calendar,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/actividades',
            metrics: {
                actividades: '25',
                programadas: '8',
                completadas: '17',
                pendientes: '5'
            },
            features: ['Actividades comerciales', 'Calendario', 'Seguimiento', 'Recordatorios']
        },
        {
            id: 'satisfaccion',
            title: 'Satisfacción',
            subtitle: 'Satisfacción de Clientes',
            description: 'Medición y gestión de satisfacción de clientes',
            icon: Heart,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/satisfaccion',
            metrics: {
                encuestas: '0',
                respuestas: '0',
                promedio: '0%',
                satisfechos: '0'
            },
            features: ['Encuestas de satisfacción', 'Métricas NPS', 'Feedback', 'Mejoras']
        },
        {
            id: 'reportes',
            title: 'Reportes',
            subtitle: 'Reportes Comerciales',
            description: 'Análisis y reportes del CRM y satisfacción',
            icon: BarChart3,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/reportes',
            metrics: {
                reportes: '8',
                dashboards: '3',
                metricas: '15',
                tendencias: '6'
            },
            features: ['Reportes comerciales', 'Dashboards', 'Métricas', 'Análisis']
        },
        {
            id: 'analytics',
            title: 'Analytics',
            subtitle: 'Análisis Avanzado',
            description: 'Analytics y inteligencia comercial',
            icon: TrendingUp,
            color: 'indigo',
            gradient: 'from-indigo-500 to-indigo-600',
            hoverGradient: 'from-indigo-600 to-indigo-700',
            path: '/app/crm/analytics',
            metrics: {
                kpis: '12',
                predicciones: '4',
                insights: '8',
                recomendaciones: '6'
            },
            features: ['Analytics avanzado', 'Predicciones', 'Insights', 'Recomendaciones']
        }
    ];

    const handleModuleAccess = (module) => {
        navigate(module.path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 p-6">
            {/* Botón para volver al menú principal */}
            {onBackToMainMenu && (
                <div className="max-w-6xl mx-auto mb-6">
                    <Button
                        onClick={onBackToMainMenu}
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-white hover:border-indigo-300 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Menú Principal
                    </Button>
                </div>
            )}

            {/* Header del Sistema de CRM y Satisfacción */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center space-x-3 mb-4"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-800">CRM y Satisfacción</h1>
                        <p className="text-lg text-indigo-600 mt-2">Gestión de Clientes, Oportunidades y Satisfacción</p>
                    </div>
                </motion.div>
            </div>

            {/* Grid de Tarjetas de Módulos de CRM y Satisfacción */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {crmSatisfaccionModules.map((module, index) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Header de la tarjeta con gradiente */}
                                <div className={`bg-gradient-to-r ${module.gradient} p-6 text-white relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                    <module.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold">{module.title}</h2>
                                                    <p className="text-white/90 text-sm">{module.subtitle}</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                                {module.id.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <p className="text-white/90 text-sm leading-relaxed">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Contenido de la tarjeta */}
                                <CardContent className="p-6">
                                    {/* Métricas del módulo */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {Object.entries(module.metrics).map(([key, value]) => (
                                            <div key={key} className="text-center">
                                                <div className="text-2xl font-bold text-indigo-800">{value}</div>
                                                <div className="text-xs text-indigo-500 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Características del módulo */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-indigo-700 mb-3">Características principales:</h4>
                                        <div className="space-y-2">
                                            {module.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                    <span className="text-sm text-indigo-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Botón de acceso */}
                                    <Button
                                        onClick={() => handleModuleAccess(module)}
                                        className={`w-full bg-gradient-to-r ${module.gradient} hover:${module.hoverGradient} text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                                        size="lg"
                                    >
                                        <span>Acceder a {module.title}</span>
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Footer informativo */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-semibold text-indigo-700">CRM y Satisfacción de Clientes ISO 9001</span>
                        </div>
                        <p className="text-sm text-indigo-600">
                            Gestión integral de clientes, oportunidades comerciales y satisfacción según estándares ISO 9001:2015
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CRMSatisfaccionMenu;
