import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  ChevronDown,
  ChevronRight,
  X,
  Users,
  Briefcase,
  GraduationCap,
  ClipboardCheck,
  ClipboardList,
  FileText,
  BarChart3,
  ActivitySquare,
  Bell,
  TrendingUp,
  Calendar,
  Settings,
  Award,
  User,
  ListChecks,
  Activity,
  Target,
  Package,
  Database,
  Star,
  BookOpen,
  HelpCircle,
  Crown,
  ArrowRight
} from 'lucide-react';
import useAuthStore from '@/store/authStore';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [expandedSections, setExpandedSections] = useState(['recursos-humanos', 'procesos']);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubmenu = (submenu) => {
    setExpandedSubmenus((prev) => ({ ...prev, [submenu]: !prev[submenu] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleSuperAdminAccess = () => {
    navigate('/super-admin/dashboard');
  };

  // Colores para los módulos
  const getColorClasses = (color, isActive = false) => {
    const colors = {
      emerald: isActive ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-50',
      blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50',
      purple: isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'bg-orange-600 text-white' : 'text-orange-600 hover:bg-orange-50',
      red: isActive ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50',
      yellow: isActive ? 'bg-yellow-600 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      pink: isActive ? 'bg-pink-600 text-white' : 'text-pink-600 hover:bg-pink-50',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50',
      teal: isActive ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50',
      cyan: isActive ? 'bg-cyan-600 text-white' : 'text-cyan-600 hover:bg-cyan-50',
      lime: isActive ? 'bg-lime-600 text-white' : 'text-lime-600 hover:bg-lime-50',
      amber: isActive ? 'bg-amber-600 text-white' : 'text-amber-600 hover:bg-amber-50',
      rose: isActive ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50',
      violet: isActive ? 'bg-violet-600 text-white' : 'text-violet-600 hover:bg-violet-50',
      fuchsia: isActive ? 'bg-fuchsia-600 text-white' : 'text-fuchsia-600 hover:bg-fuchsia-50',
      sky: isActive ? 'bg-sky-600 text-white' : 'text-sky-600 hover:bg-sky-50',
      slate: isActive ? 'bg-slate-600 text-white' : 'text-slate-600 hover:bg-slate-50',
      gray: isActive ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-50',
      zinc: isActive ? 'bg-zinc-600 text-white' : 'text-zinc-600 hover:bg-zinc-50',
      neutral: isActive ? 'bg-neutral-600 text-white' : 'text-neutral-600 hover:bg-neutral-50',
      stone: isActive ? 'bg-stone-600 text-white' : 'text-stone-600 hover:bg-stone-50'
    };
    return colors[color] || colors.emerald;
  };

  // Definir departmentModules antes del return
  const departmentModules = [
    {
      id: 'planificacion-revision',
      name: '1-PLAN - Planificación y Revisión',
      icon: Target,
      color: 'orange',
      items: [
        { name: 'Calendario', path: '/app/calendario', icon: Calendar },
        { name: 'Planificación Estratégica', path: '/app/planificacion-estrategica', icon: Target },
        { name: 'Política de Calidad', path: '/app/politica-calidad', icon: Target },
        { name: 'Revisión por la Dirección', path: '/app/revision-direccion', icon: BarChart3 },
        { name: 'Minutas', path: '/app/minutas', icon: FileText },
        { name: 'Objetivos y Metas', path: '/app/objetivos-metas', icon: TrendingUp },
      ]
    },
    {
      id: 'recursos-humanos',
      name: '2-RH - Recursos Humanos',
      icon: Users,
      color: 'emerald',
      items: [
        { name: 'Personal', path: '/app/personal', icon: Users },
        { name: 'Departamentos', path: '/app/departamentos', icon: Building },
        { name: 'Puestos', path: '/app/puestos', icon: Briefcase },
        { name: 'Capacitaciones', path: '/app/capacitaciones', icon: GraduationCap },
        { name: 'Competencias', path: '/app/competencias', icon: Award },
        { name: 'Evaluación de Competencias', path: '/app/evaluacion-competencias', icon: ClipboardCheck },
      ]
    },
    {
      id: 'procesos',
      name: 'Procesos',
      icon: ClipboardCheck,
      color: 'blue',
      items: [
        { name: 'Procesos', path: '/app/procesos', icon: ClipboardCheck },
        { name: 'Objetivos de Calidad', path: '/app/objetivos-calidad', icon: Target },
        { name: 'Indicadores', path: '/app/indicadores', icon: BarChart3 },
        { name: 'Mediciones', path: '/app/mediciones', icon: TrendingUp },
      ]
    },
    { name: '2-DOC - Documentos', path: '/app/documentos', icon: FileText, single: true },
    { name: 'Puntos de la Norma', path: '/app/normas', icon: ListChecks, single: true },
    { name: '3-AUD - Auditorías', path: '/app/auditorias', icon: ClipboardCheck, single: true },
    { name: 'Hallazgos', path: '/app/hallazgos', icon: ActivitySquare, single: true },
    { name: 'Acciones', path: '/app/acciones', icon: Activity, single: true },
    { name: '4-SAT - Satisfacción del Cliente', path: '/app/satisfaccion-cliente', icon: Award, single: true },
    {
      id: 'administracion',
      name: 'Administración',
      icon: Settings,
      color: 'orange',
      items: [
        { 
          name: 'Admin de Organización', 
          path: '/app/admin/organization', 
          icon: Building, 
          role: 'admin',
          show: () => ['admin', 'super_admin'].includes(user?.role)
        },
        { name: 'Usuarios', path: '/app/usuarios', icon: Users },
        { name: 'Planes', path: '/app/planes', icon: Star },
        { 
          name: 'Manual del Sistema', 
          path: '/documentacion', 
          icon: BookOpen,
          show: () => true
        },
        { 
          name: 'Ayuda y Soporte', 
          path: '/app/ayuda', 
          icon: HelpCircle,
          show: () => true
        },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="h-full w-80 bg-slate-800 text-white flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">SGC Pro</div>
            <div className="text-xs text-slate-400">Sistema de Gestión ISO 9001</div>
          </div>
        </div>
      </div>

      {/* Super Admin Button - Solo mostrar si es super admin */}
      {user?.role === 'super_admin' && (
        <div className="p-4 border-b border-purple-700/50">
          <Button
            onClick={handleSuperAdminAccess}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            <Crown className="w-5 h-5 mr-2" />
            <span>Panel Super Admin</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="text-xs text-purple-300 mt-2 text-center">
            Acceso al panel de control global
          </div>
        </div>
      )}

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {departmentModules.map((module, index) => {
            // Si es un elemento único (single), renderizar directamente
            if (module.single) {
              const isActive = location.pathname === module.path;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(module.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <module.icon className="w-5 h-5" />
                  <span>{module.name}</span>
                </button>
              );
            }

            // Si es un módulo con submenús
            const isExpanded = expandedSections.includes(module.id);
            return (
              <div key={module.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(module.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isExpanded
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <module.icon className="w-5 h-5" />
                    <span>{module.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1 ml-8"
                    >
                      {module.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-2">
            Sistema de Gestión de Calidad
          </div>
          <div className="text-xs text-slate-500">
            © 2024 SGC Pro v11-8
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
