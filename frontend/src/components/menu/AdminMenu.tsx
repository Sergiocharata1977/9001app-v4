import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Users,
  Building,
  Settings,
  FileText,
  BarChart3,
  UserCheck,
  Key,
  Database,
  Bell
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = ({ onBackToMainMenu }) => {
  const navigate = useNavigate();

  // Configuración de módulos de administración
  const adminModules = [
    {
      id: 'usuarios',
      title: 'Gestión de Usuarios',
      subtitle: 'Administrar usuarios del sistema',
      description: 'Crear, editar y gestionar usuarios, roles y permisos',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      path: '/app/usuarios',
      metrics: {
        activos: '18',
        inactivos: '3',
        roles: '5',
        permisos: '12'
      },
      features: ['Crear usuarios', 'Asignar roles', 'Gestionar permisos', 'Auditoría de acceso']
    },
    {
      id: 'organizaciones',
      title: 'Organizaciones',
      subtitle: 'Gestión multi-organización',
      description: 'Administrar organizaciones, planes y configuraciones',
      icon: Building,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      path: '/app/admin/organization',
      metrics: {
        organizaciones: '3',
        planes: '4',
        suscripciones: '8',
        configuraciones: '15'
      },
      features: ['Crear organizaciones', 'Gestionar planes', 'Configuraciones', 'Suscripciones']
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      subtitle: 'Configuración del sistema',
      description: 'Configuraciones generales, parámetros y ajustes',
      icon: Settings,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      path: '/app/configuracion',
      metrics: {
        parametros: '25',
        ajustes: '12',
        integraciones: '4',
        backups: '8'
      },
      features: ['Parámetros del sistema', 'Integraciones', 'Backups', 'Mantenimiento']
    },
    {
      id: 'reportes',
      title: 'Reportes y Analytics',
      subtitle: 'Reportes y análisis del sistema',
      description: 'Generar reportes, estadísticas y análisis',
      icon: BarChart3,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'from-orange-600 to-orange-700',
      path: '/app/reportes',
      metrics: {
        reportes: '12',
        dashboards: '6',
        exportaciones: '45',
        alertas: '8'
      },
      features: ['Reportes personalizados', 'Dashboards', 'Exportaciones', 'Alertas automáticas']
    },
    {
      id: 'seguridad',
      title: 'Seguridad',
      subtitle: 'Gestión de seguridad y auditoría',
      description: 'Configurar seguridad, logs y auditoría del sistema',
      icon: Shield,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      hoverGradient: 'from-red-600 to-red-700',
      path: '/app/seguridad',
      metrics: {
        logs: '1,234',
        alertas: '5',
        intentos: '23',
        bloqueos: '2'
      },
      features: ['Logs de auditoría', 'Alertas de seguridad', 'Políticas de acceso', 'Backup de seguridad']
    },
    {
      id: 'documentacion',
      title: 'Documentación',
      subtitle: 'Documentación técnica y guías',
      description: 'Acceso a documentación, APIs y guías técnicas',
      icon: FileText,
      color: 'slate',
      gradient: 'from-slate-500 to-slate-600',
      hoverGradient: 'from-slate-600 to-slate-700',
      path: '/app/documentacion',
      metrics: {
        guias: '15',
        apis: '8',
        ejemplos: '25',
        versiones: '3'
      },
      features: ['Guías de usuario', 'Documentación API', 'Ejemplos de uso', 'Changelog']
    }
  ];

  const handleModuleAccess = (module) => {
    navigate(module.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      {/* Botón para volver al menú principal */}
      {onBackToMainMenu && (
        <div className="max-w-6xl mx-auto mb-6">
          <Button
            onClick={onBackToMainMenu}
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Administración</h1>
            <p className="text-lg text-slate-600 mt-2">Gestión completa de la organización y el sistema</p>
          </div>
        </motion.div>
      </div>

      {/* Grid de Tarjetas de Módulos */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminModules.map((module, index) => (
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
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Funcionalidades:</h4>
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
              <span className="text-sm font-semibold text-slate-700">Panel de Administración</span>
            </div>
            <p className="text-sm text-slate-600">
              Gestiona usuarios, organizaciones, configuraciones y seguridad del sistema
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMenu;
