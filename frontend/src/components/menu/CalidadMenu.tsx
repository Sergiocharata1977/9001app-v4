import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    FileSearch,
    Plus,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CalidadMenuProps {
  onBackToMainMenu: () => void;
}

const CalidadMenu: React.FC<CalidadMenuProps> = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  const qualityModules = [
    {
      id: 'objetivos',
      title: 'Objetivos de Calidad',
      description: 'Definir y seguir objetivos estratégicos de calidad',
      icon: Target,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      path: '/app/objetivos',
      metrics: { total: '12', cumplidos: '8', pendientes: '4' },
      features: ['Metas SMART', 'Seguimiento', 'KPIs', 'Reportes']
    },
    {
      id: 'auditorias',
      title: 'Auditorías',
      description: 'Planificar y gestionar auditorías internas y externas',
      icon: FileSearch,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      path: '/app/auditorias',
      metrics: { programadas: '4', realizadas: '2', pendientes: '2' },
      features: ['Planificación', 'Checklists', 'Hallazgos', 'Seguimiento']
    },
    {
      id: 'hallazgos',
      title: 'Hallazgos',
      description: 'Gestionar no conformidades y oportunidades de mejora',
      icon: CheckCircle,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      path: '/app/hallazgos',
      metrics: { abiertos: '8', cerrados: '15', críticos: '2' },
      features: ['Clasificación', 'Análisis', 'Acciones', 'Seguimiento']
    },
    {
      id: 'documentos',
      title: 'Documentos SGC',
      description: 'Gestión documental del Sistema de Gestión de Calidad',
      icon: BookOpen,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      path: '/app/documentos',
      metrics: { vigentes: '45', revision: '8', obsoletos: '3' },
      features: ['Control versiones', 'Aprobaciones', 'Distribución', 'Archivo']
    },
    {
      id: 'revision-direccion',
      title: 'Revisión por Dirección',
      description: 'Preparar y gestionar revisiones del sistema por la dirección',
      icon: Users,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      path: '/app/revision-direccion',
      metrics: { programadas: '4', realizadas: '3', acciones: '12' },
      features: ['Agenda', 'Informes', 'Decisiones', 'Seguimiento']
    },
    {
      id: 'mejora-continua',
      title: 'Mejora Continua',
      description: 'Gestionar iniciativas de mejora y acciones correctivas',
      icon: TrendingUp,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      path: '/app/mejora-continua',
      metrics: { iniciativas: '6', implementadas: '4', eficacia: '85%' },
      features: ['PDCA', 'Análisis causa', 'Acciones', 'Eficacia']
    }
  ];

  return (
    <div className="p-6">
      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto">
        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {qualityModules.map((module, index) => (
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
                  <div className="flex flex-wrap gap-1">
                    {module.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
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
              onClick={() => navigate('/app/hallazgos')}
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Nuevo Hallazgo</span>
              </div>
              <span className="text-xs text-gray-500">
                Registrar no conformidad u oportunidad
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/auditorias')}
            >
              <div className="flex items-center space-x-2">
                <FileSearch className="h-4 w-4" />
                <span className="font-medium">Programar Auditoría</span>
              </div>
              <span className="text-xs text-gray-500">
                Nueva auditoría interna o externa
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/objetivos')}
            >
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Definir Objetivo</span>
              </div>
              <span className="text-xs text-gray-500">
                Nuevo objetivo de calidad
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/documentos')}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Crear Documento</span>
              </div>
              <span className="text-xs text-gray-500">
                Nuevo documento SGC
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalidadMenu;
