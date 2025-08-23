import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  RefreshCw,
  Shield,
  Star as StarIcon,
  Target,
  Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuCards = ({ onBackToSidebar }) => {
  const navigate = useNavigate();

  // Configuración de módulos del sistema
  const systemModules = [
    {
      id: 'calidad',
      title: 'Calidad',
      subtitle: 'Planificación y Gestión de Calidad',
      description: 'Planificación, revisión por dirección, normas y documentos',
      icon: Target,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/calidad',
      metrics: {
        objetivos: '12',
        auditorias: '4',
        hallazgos: '8',
        documentos: '45'
      },
      features: ['Planificación estratégica', 'Revisión por dirección', 'Normas ISO', 'Gestión documental']
    },
    {
      id: 'rrhh',
      title: 'RRHH',
      subtitle: 'Recursos Humanos',
      description: 'Gestión del capital humano y desarrollo organizacional',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/rrhh',
      metrics: {
        empleados: '25',
        capacitaciones: '8',
        evaluaciones: '15',
        competencias: '12'
      },
      features: ['Gestión de personal', 'Capacitaciones', 'Evaluaciones', 'Competencias']
    },
    {
      id: 'procesos',
      title: 'Procesos',
      subtitle: 'Gestión de Procesos',
      description: 'Procesos internos, mejoras y optimización',
      icon: RefreshCw,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/procesos',
      metrics: {
        procesos: '15',
        mejoras: '6',
        indicadores: '22',
        productos: '8'
      },
      features: ['Gestión de procesos', 'Mejoras continuas', 'Indicadores', 'Productos']
    },
    {
      id: 'crm-satisfaccion',
      title: 'CRM y Satisfacción',
      subtitle: 'Gestión de Clientes y Satisfacción',
      description: 'CRM, satisfacción de clientes y gestión comercial',
      icon: Heart,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      hoverGradient: 'from-indigo-600 to-indigo-700',
      path: '/app/crm',
      metrics: {
        clientes: '45',
        oportunidades: '12',
        satisfaccion: '92%',
        ventas: '156'
      },
      features: ['Gestión de clientes', 'Satisfacción', 'Oportunidades', 'Ventas']
    }
  ];

  const handleModuleAccess = (module) => {
    navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      {/* Botón para volver al menú principal */}
      {onBackToSidebar && (
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            onClick={onBackToSidebar}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </div>
      )}

      {/* Header del Sistema */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <StarIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">9001app</h1>
            <p className="text-lg text-slate-600 mt-2">Accede a los diferentes módulos de tu sistema unificado</p>
          </div>
        </motion.div>
      </div>

      {/* Grid de Tarjetas de Módulos */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemModules.map((module, index) => (
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
                        <div className="text-2xl font-bold text-slate-800">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Características del módulo */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Características principales:</h4>
                    <div className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full bg-${module.color}-500`}></div>
                          <span className="text-sm text-slate-600">{feature}</span>
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Sistema SGC ISO 9001</span>
            </div>
            <p className="text-sm text-slate-600">
              Sistema de Gestión de Calidad certificado bajo estándares ISO 9001:2015
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainMenuCards;
