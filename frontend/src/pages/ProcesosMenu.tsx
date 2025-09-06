import ProcesosListing from '@/components/procesos/ProcesosListing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ClipboardList,
    FileText,
    Kanban,
    Plus
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProcesosMenuProps {
  onBackToMainMenu?: () => void;
}

const ProcesosMenu: React.FC<ProcesosMenuProps> = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'registros-procesos',
      title: 'Registros de Procesos',
      description: 'Crear registros personalizables con estados y campos editables',
      icon: ClipboardList,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      path: '/app/registros-procesos',
      features: ['Estados personalizables', 'Campos editables', 'Vista Kanban', 'Plantillas']
    },
    {
      id: 'numeracion-correlativa',
      title: 'Numeración Correlativa',
      description: 'Sistema de numeración ISO 9001 para trazabilidad',
      icon: FileText,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      path: '/app/numeracion-correlativa',
      features: ['Códigos automáticos', 'Trazabilidad', 'ISO 9001', 'Flujos']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del Módulo */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToMainMenu}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Módulo de Procesos
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gestión de procesos documentales, registros personalizables y trazabilidad ISO 9001
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                SGC ISO 9001
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de Procesos Documentales */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Procesos Documentales
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crear, editar y gestionar procesos documentados según ISO 9001
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/app/registros-procesos')}
                className="flex items-center space-x-2"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Registros</span>
              </Button>
            </div>
          </div>
          
          {/* Lista de Procesos */}
          <ProcesosListing />
        </div>

        {/* Herramientas Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 h-full"
                onClick={() => navigate(item.path)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((feature, idx) => (
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
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/registros-procesos')}
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Crear Registro</span>
              </div>
              <span className="text-xs text-gray-500">
                Nuevo registro de proceso personalizable
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/numeracion-correlativa')}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Generar Código</span>
              </div>
              <span className="text-xs text-gray-500">
                Código correlativo ISO 9001
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/app/registros-procesos')}
            >
              <div className="flex items-center space-x-2">
                <Kanban className="h-4 w-4" />
                <span className="font-medium">Vista Kanban</span>
              </div>
              <span className="text-xs text-gray-500">
                Gestión visual de registros
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcesosMenu;
