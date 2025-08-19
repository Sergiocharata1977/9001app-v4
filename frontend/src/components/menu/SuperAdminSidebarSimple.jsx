import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Crown, 
  X, 
  BarChart3, 
  Users, 
  Building2, 
  Database, 
  Settings, 
  Shield, 
  FileText, 
  Activity, 
  Bot, 
  Workflow, 
  Layers, 
  Zap, 
  Monitor, 
  Package, 
  Target,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FolderTree
} from 'lucide-react';

const SuperAdminSidebarSimple = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    projectStructure: false,
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
          id: 'coordinacion-documento',
          label: '📄 Documento de Coordinación',
          path: '/super-admin/coordinacion-documento',
          description: 'Documento MD en tiempo real',
          icon: FileText,
          color: 'text-blue-500'
        }
      ]
    },
    {
      id: 'projectStructure',
      label: '📁 Estructura del Proyecto',
      icon: FolderOpen,
      color: 'text-green-600',
      subItems: [
        {
          id: 'database-flow',
          label: '🗄️ Flujo de BD',
          path: '/super-admin/database/structure',
          description: 'Diagrama de actualización automática',
          icon: Database,
          color: 'text-blue-500'
        },
        {
          id: 'file-structure',
          label: '📂 Estructura de Archivos',
          path: '/super-admin/database/structure',
          description: 'Organización del proyecto',
          icon: FolderTree,
          color: 'text-green-500'
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
      color: 'text-orange-600',
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
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    
    if (item.subItems) {
      const isExpanded = expandedSections[item.id];
      
      return (
        <div key={item.id} className="mb-2">
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              isExpanded ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-2 ml-8 space-y-1">
              {item.subItems.map((subItem) => {
                const SubIcon = subItem.icon;
                return (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`block p-2 rounded-md transition-colors ${
                      isActive(subItem.path)
                        ? 'bg-purple-100 text-purple-700 border-l-2 border-purple-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SubIcon className={`w-4 h-4 ${subItem.color}`} />
                      <span className="text-sm">{subItem.label}</span>
                    </div>
                    {subItem.description && (
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        {subItem.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Link
        key={item.id}
        to={item.path}
        className={`block p-3 rounded-lg transition-colors ${
          isActive(item.path)
            ? 'bg-purple-100 text-purple-700 border-l-2 border-purple-500'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${item.color}`} />
          <span className="font-medium">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Super Admin</div>
            <div className="text-xs text-gray-500">Panel de Control</div>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
        {menuItems.map(renderMenuItem)}
      </div>
    </div>
  );
};

export default SuperAdminSidebarSimple;
