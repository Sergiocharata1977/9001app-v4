import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  FileCheck,
  Shield,
  Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RRHHMenu = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  // Configuración de módulos de RRHH
  const rrhhModules = [
    {
      id: 'personal',
      title: 'Personal',
      subtitle: 'Gestión de Empleados',
      description: 'Administración completa del personal según ISO 9001',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/rrhh/personal',
      metrics: {
        total: '9',
        activos: '9',
        inactivos: '0',
        conPuesto: '6'
      },
      features: ['Gestión de empleados', 'Datos personales', 'Estados', 'Asignación de puestos']
    },
    {
      id: 'departamentos',
      title: 'Departamentos',
      subtitle: 'Estructura Organizacional',
      description: 'Gestión de departamentos y áreas de la organización',
      icon: Building2,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/rrhh/departamentos',
      metrics: {
        departamentos: '6',
        responsables: '6',
        objetivos: '12',
        activos: '6'
      },
      features: ['Estructura organizacional', 'Responsables', 'Objetivos', 'Gestión departamental']
    },
    {
      id: 'puestos',
      title: 'Puestos',
      subtitle: 'Gestión de Puestos de Trabajo',
      description: 'Definición y gestión de puestos de trabajo',
      icon: Briefcase,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/rrhh/puestos',
      metrics: {
        puestos: '9',
        ocupados: '6',
        vacantes: '3',
        definidos: '9'
      },
      features: ['Definición de puestos', 'Responsabilidades', 'Requisitos', 'Asignación']
    },

    {
      id: 'evaluaciones',
      title: 'Evaluaciones',
      subtitle: 'Evaluación de Competencias',
      description: 'Evaluación y seguimiento del desempeño del personal',
      icon: FileCheck,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/rrhh/evaluaciones',
      metrics: {
        evaluaciones: '0',
        pendientes: '9',
        completadas: '0',
        promedio: '0%'
      },
      features: ['Evaluación de desempeño', 'Competencias', 'Seguimiento', 'Mejoras']
    }
  ];

  const handleModuleAccess = (module) => {
    navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      {/* Botón para volver al menú principal */}
      {onBackToMainMenu && (
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            onClick={onBackToMainMenu}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-white hover:border-blue-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </div>
      )}

      {/* Header del Sistema de RRHH */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-800">Recursos Humanos</h1>
            <p className="text-lg text-blue-600 mt-2">Gestión del Capital Humano y Desarrollo Organizacional</p>
          </div>
        </motion.div>
      </div>

      {/* Grid de Tarjetas de Módulos de RRHH */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rrhhModules.map((module, index) => (
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
                        <div className="text-2xl font-bold text-blue-800">{value}</div>
                        <div className="text-xs text-blue-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Características del módulo */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-blue-700 mb-3">Características principales:</h4>
                    <div className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-blue-600">{feature}</span>
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Gestión de Recursos Humanos ISO 9001</span>
            </div>
            <p className="text-sm text-blue-600">
              Desarrollo del capital humano, gestión de competencias y cumplimiento de estándares ISO 9001:2015
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RRHHMenu;
