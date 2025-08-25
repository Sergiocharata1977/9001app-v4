import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    ClipboardCheck,
    Crown,
    FileText,
    Package,
    Shield,
    Target
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CalidadMenu = ({ onBackToMainMenu }) => {
    const navigate = useNavigate();

      // Configuración de módulos de Calidad
  const calidadModules = [
    {
      id: 'planificacion',
      title: 'Planificación',
      subtitle: 'Planificación Estratégica y Operativa',
      description: 'Planificación anual, objetivos y metas de calidad según ISO 9001',
      icon: Target,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/planificacion',
      metrics: {
        objetivos: '12',
        metas: '8',
        planes: '4',
        revisiones: '6'
      },
      features: ['Planificación anual', 'Objetivos de calidad', 'Metas estratégicas', 'Revisión por dirección']
    },
    {
      id: 'revision-direccion',
      title: 'Revisión por Dirección',
      subtitle: 'Gestión Ejecutiva del SGC',
      description: 'Revisión de la dirección, minutas y decisiones ejecutivas del sistema',
      icon: Crown,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/revision-direccion',
      metrics: {
        minutas: '15',
        decisiones: '8',
        revisiones: '4',
        seguimiento: '12'
      },
      features: ['Minutas ejecutivas', 'Decisiones de dirección', 'Revisión del SGC', 'Indicadores ejecutivos']
    },
    {
      id: 'normas',
      title: 'Normas',
      subtitle: 'Gestión de Normas y Estándares',
      description: 'Normas ISO, procedimientos y documentación técnica del sistema',
      icon: FileText,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/normas',
      metrics: {
        normas: '54',
        procedimientos: '12',
        versiones: '8',
        vigentes: '45'
      },
      features: ['Normas ISO 9001', 'Procedimientos', 'Documentación técnica', 'Control de versiones']
    },
    {
      id: 'documentos',
      title: 'Documentos',
      subtitle: 'Gestión Documental',
      description: 'Control de documentos, versiones y distribución según ISO 9001',
      icon: BookOpen,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/documentos',
      metrics: {
        documentos: '2',
        versiones: '15',
        distribuidos: '8',
        archivados: '3'
      },
      features: ['Control de documentos', 'Versiones', 'Distribución', 'Archivo']
    },
    {
      id: 'productos',
      title: 'Productos',
      subtitle: 'Gestión de Productos y Servicios',
      description: 'Control de productos, servicios y especificaciones de calidad',
      icon: Package,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/productos',
      metrics: {
        productos: '3',
        servicios: '8',
        versiones: '12',
        aprobados: '15'
      },
      features: ['Control de productos', 'Especificaciones', 'Aprobación', 'Versiones']
    },
    {
      id: 'auditorias',
      title: 'Auditorías',
      subtitle: 'Sistema de Auditorías',
      description: 'Auditorías internas, externas y de seguimiento del SGC',
      icon: ClipboardCheck,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/auditorias',
      metrics: {
        internas: '2',
        externas: '1',
        programadas: '4',
        completadas: '3'
      },
      features: ['Auditorías internas', 'Auditorías externas', 'Programa de auditorías', 'Seguimiento']
    },
    {
      id: 'hallazgos-acciones',
      title: 'Hallazgos y Acciones',
      subtitle: 'Gestión de No Conformidades',
      description: 'Hallazgos, acciones correctivas y preventivas del sistema',
      icon: AlertTriangle,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad/hallazgos-acciones',
      metrics: {
        hallazgos: '0',
        correctivas: '0',
        preventivas: '0',
        cerradas: '0'
      },
      features: ['Hallazgos', 'Acciones correctivas', 'Acciones preventivas', 'Seguimiento']
    }
  ];

    const handleModuleAccess = (module) => {
        navigate(module.path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-6">
            {/* Botón para volver al menú principal */}
            {onBackToMainMenu && (
                <div className="max-w-6xl mx-auto mb-6">
                    <Button
                        onClick={onBackToMainMenu}
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:bg-white hover:border-emerald-300 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Menú Principal
                    </Button>
                </div>
            )}

            {/* Header del Sistema de Calidad */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center space-x-3 mb-4"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-emerald-800">Sistema de Calidad</h1>
                        <p className="text-lg text-emerald-600 mt-2">Planificación, Revisión por Dirección, Normas y Documentos</p>
                    </div>
                </motion.div>
            </div>

            {/* Grid de Tarjetas de Módulos de Calidad */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {calidadModules.map((module, index) => (
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
                                                <div className="text-2xl font-bold text-emerald-800">{value}</div>
                                                <div className="text-xs text-emerald-500 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Características del módulo */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-emerald-700 mb-3">Características principales:</h4>
                                        <div className="space-y-2">
                                            {module.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-sm text-emerald-600">{feature}</span>
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
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">Sistema de Gestión de Calidad ISO 9001</span>
                        </div>
                        <p className="text-sm text-emerald-600">
                            Gestión integral de calidad, planificación estratégica y cumplimiento de estándares ISO 9001:2015
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CalidadMenu;
