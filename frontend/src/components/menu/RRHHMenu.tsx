import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Building,
    GraduationCap,
    Plus,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RRHHMenuProps {
  onBackToMainMenu: () => void;
}

const RRHHMenu: React.FC<RRHHMenuProps> = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  const hrModules = [
    {
      id: 'organizacion',
      title: 'Estructura Organizacional',
      description: 'Gestionar la estructura y organización de la empresa',
      icon: Building,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      path: '/app/departamentos',
      metrics: { departamentos: '8', puestos: '25', personal: '47' },
      features: ['Departamentos', 'Puestos', 'Organigramas', 'Jerarquías'],
      suboptions: [
        { name: 'Departamentos', path: '/app/departamentos' },
        { name: 'Puestos', path: '/app/puestos' },
        { name: 'Personal', path: '/app/personal' }
      ]
    },
    {
      id: 'personal',
      title: 'Gestión de Personal',
      description: 'Administrar información y datos del personal',
      icon: Users,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      path: '/app/personal',
      metrics: { activos: '47', nuevos: '3', bajas: '2' },
      features: ['Expedientes', 'Contratos', 'Datos', 'Historial'],
      suboptions: [
        { name: 'Lista de Personal', path: '/app/personal' },
        { name: 'Nuevo Empleado', path: '/app/personal/nuevo' },
        { name: 'Expedientes', path: '/app/expedientes' }
      ]
    },
    {
      id: 'capacitaciones',
      title: 'Capacitaciones',
      description: 'Planificar y gestionar programas de capacitación',
      icon: GraduationCap,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      path: '/app/capacitaciones',
      metrics: { programadas: '12', realizadas: '8', pendientes: '4' },
      features: ['Programación', 'Seguimiento', 'Certificados', 'Evaluación'],
      suboptions: [
        { name: 'Capacitaciones', path: '/app/capacitaciones' },
        { name: 'Nueva Capacitación', path: '/app/capacitaciones/nueva' },
        { name: 'Certificados', path: '/app/certificados' }
      ]
    },
    {
      id: 'evaluaciones',
      title: 'Evaluaciones de Desempeño',
      description: 'Evaluar el desempeño y rendimiento del personal',
      icon: Star,
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      path: '/app/evaluaciones-individuales',
      metrics: { programadas: '15', completadas: '10', pendientes: '5' },
      features: ['Evaluaciones', 'Objetivos', 'Feedback', 'Desarrollo'],
      suboptions: [
        { name: 'Evaluaciones', path: '/app/evaluaciones-individuales' },
        { name: 'Nueva Evaluación', path: '/app/evaluaciones/nueva' },
        { name: 'Reportes', path: '/app/evaluaciones/reportes' }
      ]
    },
    {
      id: 'competencias',
      title: 'Competencias',
      description: 'Gestionar competencias y habilidades del personal',
      icon: TrendingUp,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      path: '/app/competencias',
      metrics: { definidas: '35', evaluadas: '28', gaps: '7' },
      features: ['Catálogo', 'Evaluación', 'Brechas', 'Desarrollo'],
      suboptions: [
        { name: 'Competencias', path: '/app/competencias' },
        { name: 'Evaluación', path: '/app/competencias/evaluacion' },
        { name: 'Matriz', path: '/app/competencias/matriz' }
      ]
    },
    {
      id: 'desarrollo',
      title: 'Desarrollo Profesional',
      description: 'Planes de desarrollo y crecimiento profesional',
      icon: BookOpen,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      path: '/app/desarrollo',
      metrics: { planes: '12', objetivos: '45', completados: '23' },
      features: ['Planes', 'Objetivos', 'Seguimiento', 'Carrera'],
      suboptions: [
        { name: 'Planes de Desarrollo', path: '/app/desarrollo' },
        { name: 'Objetivos', path: '/app/desarrollo/objetivos' },
        { name: 'Carrera', path: '/app/desarrollo/carrera' }
      ]
    }
  ];

  return (
    <div className="p-6">
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto">
        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {hrModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 h-full"
                onClick={() => navigate(module.path)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {module.description}
                  </p>
                  
                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(module.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {value}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {module.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Sub-opciones rápidas */}
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Acceso rápido:</span>
                    {module.suboptions.slice(0, 2).map((option, idx) => (
                      <span key={idx} className="ml-1">
                        {option.name}{idx < 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/personal/nuevo')}
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Nuevo Empleado</span>
              </div>
              <span className="text-xs text-gray-500">
                Registrar nuevo personal
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/capacitaciones/nueva')}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Nueva Capacitación</span>
              </div>
              <span className="text-xs text-gray-500">
                Programar capacitación
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/evaluaciones/nueva')}
            >
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">Nueva Evaluación</span>
              </div>
              <span className="text-xs text-gray-500">
                Evaluar desempeño
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/departamentos')}
            >
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span className="font-medium">Ver Organigrama</span>
              </div>
              <span className="text-xs text-gray-500">
                Estructura organizacional
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RRHHMenu;
