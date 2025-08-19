import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, X, BarChart3, Users, Building2, Database, Settings, Shield, FileText, Activity, Bot, Workflow, Layers, Zap, Monitor, Package, Target } from 'lucide-react';

const SuperAdminSidebarUpdated = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    system: false,
    users: false,
    database: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/super-admin/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'agents',
      label: '🤖 Sistema de Agentes',
      icon: Bot,
      color: 'text-purple-600',
      subItems: [
        {
          id: 'coordination-system',
          label: '🎯 Coordinación de Agentes',
          path: '/super-admin/coordination-system',
          description: 'Sistema de pestañas verticales con agentes coordinadores',
          icon: Target,
          color: 'text-blue-500'
        },
        {
          id: 'coordination',
          label: '📊 Dashboard de Coordinación',
          path: '/super-admin/coordination',
          description: 'Vista general del sistema de agentes',
          icon: Monitor,
          color: 'text-green-500'
        },
        {
          id: 'workflow-demo',
          label: '🔄 Demo de Flujo',
          path: '/super-admin/workflow-demo',
          description: 'Demo interactivo del flujo de trabajo',
          icon: Workflow,
          color: 'text-orange-500'
        },
        {
          id: 'workflow-stages',
          label: '📋 Etapas Detalladas',
          path: '/super-admin/workflow-stages',
          description: 'Vista técnica de cada etapa',
          icon: Layers,
          color: 'text-purple-500'
        },
        {
          id: 'auto-planner',
          label: '⚡ Integración Auto-Planner',
          path: '/super-admin/auto-planner',
          description: 'Conexión con sistema existente',
          icon: Zap,
          color: 'text-indigo-500'
        }
      ]
    },
    {
      id: 'system',
      label: '⚙️ Sistema',
      icon: Settings,
      color: 'text-gray-600',
      subItems: [
        {
          id: 'stats',
          label: '📈 Estadísticas',
          path: '/super-admin/stats',
          icon: BarChart3,
          color: 'text-blue-500'
        },
        {
          id: 'monitoring',
          label: '🔍 Monitoreo',
          path: '/super-admin/monitoring',
          icon: Activity,
          color: 'text-green-500'
        },
        {
          id: 'config',
          label: '⚙️ Configuración',
          path: '/super-admin/config',
          icon: Settings,
          color: 'text-gray-500'
        },
        {
          id: 'logs',
          label: '📝 Logs',
          path: '/super-admin/logs',
          icon: FileText,
          color: 'text-orange-500'
        },
        {
          id: 'maintenance',
          label: '🔧 Mantenimiento',
          path: '/super-admin/maintenance',
          icon: Shield,
          color: 'text-red-500'
        }
      ]
    },
    {
      id: 'users',
      label: '👥 Usuarios',
      icon: Users,
      color: 'text-indigo-600',
      subItems: [
        {
          id: 'global-users',
          label: '🌍 Usuarios Globales',
          path: '/super-admin/users',
          icon: Users,
          color: 'text-blue-500'
        },
        {
          id: 'roles',
          label: '🔐 Roles y Permisos',
          path: '/super-admin/roles',
          icon: Shield,
          color: 'text-green-500'
        },
        {
          id: 'audit',
          label: '📋 Auditoría',
          path: '/super-admin/audit',
          icon: FileText,
          color: 'text-orange-500'
        }
      ]
    },
    {
      id: 'organizations',
      label: '🏢 Organizaciones',
      icon: Building2,
      path: '/super-admin/organizations',
      color: 'text-purple-600'
    },
    {
      id: 'database',
      label: '🗄️ Base de Datos',
      icon: Database,
      color: 'text-teal-600',
      subItems: [
        {
          id: 'schema',
          label: '📊 Esquema',
          path: '/super-admin/database/schema',
          icon: Database,
          color: 'text-blue-500'
        },
        {
          id: 'backup',
          label: '💾 Backup',
          path: '/super-admin/database/backup',
          icon: Package,
          color: 'text-green-500'
        }
      ]
    },
    {
      id: 'plans',
      label: '📋 Planes',
      icon: FileText,
      path: '/super-admin/plans',
      color: 'text-amber-600'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl border-r border-slate-200
      ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      transition-transform duration-300 ease-in-out
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Super Admin</h1>
            <p className="text-sm text-slate-500">Panel de Control</p>
          </div>
        </div>
        
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.subItems ? (
                // Section with sub-items
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg transition-colors
                      ${expandedSections[item.id] ? 'bg-slate-100' : 'hover:bg-slate-50'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium text-slate-900">{item.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSections[item.id] && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className={`
                            block p-3 rounded-lg transition-colors group
                            ${isActive(subItem.path) 
                              ? 'bg-purple-50 border-l-4 border-purple-500' 
                              : 'hover:bg-slate-50'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <subItem.icon className={`w-4 h-4 ${subItem.color}`} />
                            <div className="flex-1">
                              <div className={`font-medium ${isActive(subItem.path) ? 'text-purple-700' : 'text-slate-700'}`}>
                                {subItem.label}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {subItem.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Single menu item
                <Link
                  to={item.path}
                  className={`
                    block p-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-purple-50 border-l-4 border-purple-500' 
                      : 'hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className={`font-medium ${isActive(item.path) ? 'text-purple-700' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-900">Sistema de Agentes</span>
          </div>
          <p className="text-xs text-slate-600">
            Coordinación inteligente de agentes especializados
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebarUpdated;
