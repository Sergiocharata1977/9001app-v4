import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  TrendingUp,
  BarChart3,
  Package,
  ArrowRight,
  ArrowLeft,
  Star as StarIcon,
  Shield,
  CheckCircle,
  Calendar,
  Settings,
  Target,
  FileText,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  Heart,
  Crown,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  FileCheck,
  Award
} from 'lucide-react';

const ProcesosMenu = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  // Configuración de módulos de Procesos
  const procesosModules = [
    {
      id: 'procesos',
      title: 'Procesos',
      subtitle: 'Gestión de Procesos Internos',
      description: 'Definición, control y optimización de procesos internos',
      icon: RefreshCw,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/procesos/procesos',
      metrics: {
        procesos: '5',
        activos: '5',
        optimizados: '3',
        eficiencia: '85%'
      },
      features: ['Definición de procesos', 'Control de procesos', 'Optimización', 'Eficiencia']
    },
    {
      id: 'mejoras',
      title: 'Mejoras',
      subtitle: 'Mejoras Continuas',
      description: 'Sistema de mejoras y optimización de procesos',
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/procesos/mejoras',
      metrics: {
        mejoras: '22',
        implementadas: '18',
        pendientes: '4',
        efectividad: '82%'
      },
      features: ['Mejoras continuas', 'Implementación', 'Seguimiento', 'Efectividad']
    },
    {
      id: 'indicadores',
      title: 'Indicadores',
      subtitle: 'Indicadores de Proceso',
      description: 'Métricas y KPIs para el seguimiento de procesos',
      icon: BarChart3,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/procesos/indicadores',
      metrics: {
        indicadores: '4',
        activos: '4',
        mediciones: '0',
        cumplimiento: '75%'
      },
      features: ['Indicadores de proceso', 'Métricas', 'Mediciones', 'Cumplimiento']
    },
    {
      id: 'productos',
      title: 'Productos',
      subtitle: 'Gestión de Productos',
      description: 'Control de productos y servicios del sistema',
      icon: Package,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/procesos/productos',
      metrics: {
        productos: '3',
        servicios: '8',
        versiones: '12',
        aprobados: '15'
      },
      features: ['Control de productos', 'Servicios', 'Versiones', 'Aprobación']
    }
  ];

  const handleModuleAccess = (module) => {
    navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6">
      {/* Botón para volver al menú principal */}
      {onBackToMainMenu && (
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            onClick={onBackToMainMenu}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-white hover:border-purple-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </div>
      )}

      {/* Header del Sistema de Procesos */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-purple-800">Gestión de Procesos</h1>
            <p className="text-lg text-purple-600 mt-2">Procesos Internos, Mejoras Continuas e Indicadores</p>
          </div>
        </motion.div>
      </div>

      {/* Grid de Tarjetas de Módulos de Procesos */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {procesosModules.map((module, index) => (
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
                        <div className="text-2xl font-bold text-purple-800">{value}</div>
                        <div className="text-xs text-purple-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Características del módulo */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-purple-700 mb-3">Características principales:</h4>
                    <div className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-sm text-purple-600">{feature}</span>
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Gestión de Procesos ISO 9001</span>
            </div>
            <p className="text-sm text-purple-600">
              Optimización de procesos internos, mejoras continuas y control de indicadores según estándares ISO 9001:2015
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProcesosMenu;
