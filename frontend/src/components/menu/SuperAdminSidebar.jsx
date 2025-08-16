import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Building2,
  Users,
  Database,
  Settings,
  Shield,
  BarChart3,
  FileText,
  Globe,
  Server,
  Activity,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const SuperAdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [expandedSections, setExpandedSections] = useState(['system', 'organizations']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleBackToApp = () => {
    navigate('/app/tablero');
  };

  // Solo mostrar si es super admin
  if (user?.role !== 'super_admin') {
    return null;
  }

  const menuSections = [
    {
      id: 'system',
      name: '🏛️ Sistema Global',
      icon: Crown,
      color: 'purple',
      items: [
        { 
          name: 'Dashboard Global', 
          path: '/super-admin/dashboard', 
          icon: BarChart3,
          description: 'Vista general de todas las organizaciones'
        },
        { 
          name: 'Estadísticas Globales', 
          path: '/super-admin/stats', 
          icon: Activity,
          description: 'Métricas del sistema completo'
        },
        { 
          name: 'Monitoreo en Tiempo Real', 
          path: '/super-admin/monitoring', 
          icon: Zap,
          description: 'Estado de servicios y rendimiento'
        }
      ]
    },
    {
      id: 'organizations',
      name: '🏢 Gestión de Organizaciones',
      icon: Building2,
      color: 'blue',
      items: [
        { 
          name: 'Todas las Organizaciones', 
          path: '/super-admin/organizations', 
          icon: Building2,
          description: 'Administrar todas las organizaciones'
        },
        { 
          name: 'Crear Organización', 
          path: '/super-admin/organizations/create', 
          icon: Building2,
          description: 'Registrar nueva organización'
        },
        { 
          name: 'Planes y Suscripciones', 
          path: '/super-admin/plans', 
          icon: Shield,
          description: 'Gestionar planes de suscripción'
        }
      ]
    },
    {
      id: 'users',
      name: '👥 Gestión de Usuarios',
      icon: Users,
      color: 'green',
      items: [
        { 
          name: 'Usuarios Globales', 
          path: '/super-admin/users', 
          icon: Users,
          description: 'Todos los usuarios del sistema'
        },
        { 
          name: 'Roles y Permisos', 
          path: '/super-admin/roles', 
          icon: Shield,
          description: 'Configurar roles del sistema'
        },
        { 
          name: 'Auditoría de Accesos', 
          path: '/super-admin/audit', 
          icon: Activity,
          description: 'Logs de acceso y actividad'
        }
      ]
    },
    {
      id: 'database',
      name: '🗄️ Base de Datos',
      icon: Database,
      color: 'orange',
      items: [
        { 
          name: 'Esquema de BD', 
          path: '/super-admin/database/schema', 
          icon: Database,
          description: 'Estructura de la base de datos'
        },
        { 
          name: 'Documentación BD', 
          path: '/super-admin/database/docs', 
          icon: FileText,
          description: 'Documentación técnica completa'
        },
        { 
          name: 'Backup y Restore', 
          path: '/super-admin/database/backup', 
          icon: Server,
          description: 'Gestión de respaldos'
        }
      ]
    },
    {
      id: 'system-admin',
      name: '⚙️ Administración del Sistema',
      icon: Settings,
      color: 'red',
      items: [
        { 
          name: 'Configuración Global', 
          path: '/super-admin/config', 
          icon: Settings,
          description: 'Configuración del sistema'
        },
        { 
          name: 'Features del Sistema', 
          path: '/super-admin/features', 
          icon: Zap,
          description: 'Habilitar/deshabilitar features'
        },
        { 
          name: 'Logs del Sistema', 
          path: '/super-admin/logs', 
          icon: Activity,
          description: 'Logs de errores y eventos'
        },
        { 
          name: 'Mantenimiento', 
          path: '/super-admin/maintenance', 
          icon: Server,
          description: 'Modo mantenimiento'
        }
      ]
    }
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      purple: isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50',
      blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-50',
      orange: isActive ? 'bg-orange-600 text-white' : 'text-orange-600 hover:bg-orange-50',
      red: isActive ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'
    };
    return colors[color] || colors.purple;
  };

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="h-full w-80 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">Super Admin</div>
              <div className="text-xs text-purple-300">Panel de Control Global</div>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-purple-700/50"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Botón para volver a la app */}
        <Button
          onClick={handleBackToApp}
          variant="outline"
          className="w-full border-purple-500 text-purple-300 hover:bg-purple-700/50 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la Aplicación
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-purple-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{user?.name}</div>
            <div className="text-xs text-purple-300">{user?.email}</div>
          </div>
          <Badge variant="secondary" className="bg-purple-600 text-white">
            Super Admin
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuSections.map((section) => (
          <div key={section.id} className="space-y-2">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                expandedSections.includes(section.id)
                  ? 'bg-purple-700/50 text-white'
                  : 'text-purple-200 hover:bg-purple-700/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </div>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 ml-8"
                >
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-purple-200 hover:bg-purple-700/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-700/50">
        <div className="text-center">
          <div className="text-xs text-purple-300 mb-2">
            Sistema de Gestión de Calidad
          </div>
          <div className="text-xs text-purple-400">
            © 2024 ISO Flow - Super Admin Panel
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminSidebar;
