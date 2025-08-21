import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  ChevronRight,
  X,
  Users,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  DollarSign,
  Calendar,
  Settings,
  ArrowLeft,
  ArrowRight,
  Star,
  TrendingUp,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus,
  Target as TargetIcon,
  PieChart,
  LineChart,
  ActivitySquare,
  Zap,
  Award,
  Crown,
  Shield,
  Heart,
  ShoppingCart,
  CreditCard,
  Truck,
  Package,
  Tag,
  Percent,
  Hash,
  Hash as HashIcon,
  Brain,
  Globe,
  Lock,
  Unlock,
  Key,
  Building2,
  Database,
  Cog,
  UserCheck,
  GraduationCap,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Menu,
  Home,
  LogOut,
  User,
  Bell,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import MainMenuCards from './MainMenuCards';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [expandedSections, setExpandedSections] = useState(['dashboard', 'rh', 'procesos']);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showMainMenu, setShowMainMenu] = useState(false);

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

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleMainMenuToggle = () => {
    setShowMainMenu(!showMainMenu);
  };

  // Si estamos en el menú principal con tarjetas
  if (showMainMenu) {
    return <MainMenuCards onBackToSidebar={handleMainMenuToggle} />;
  }

  // Configuración de módulos del sistema
  const systemModules = [
    {
      id: 'dashboard',
      name: '📊 Dashboard',
      icon: BarChart3,
      path: '/app/dashboard',
      color: 'slate',
      description: 'Vista general del sistema'
    },
    {
      id: 'crm',
      name: '👥 CRM - Gestión de Clientes',
      icon: Users,
      path: '/app/crm',
      color: 'emerald',
      description: 'Sistema de gestión comercial',
      badge: 'Nuevo'
    },
    {
      id: 'rh',
      name: '👨‍💼 2-RH - Recursos Humanos',
      icon: UserCheck,
      path: '/app/personal',
      color: 'blue',
      description: 'Gestión de personal y empleados',
      items: [
        { name: 'Personal', path: '/app/personal', icon: Users, description: 'Gestión de empleados' },
        { name: 'Departamentos', path: '/app/departamentos', icon: Building2, description: 'Organización departamental' },
        { name: 'Puestos', path: '/app/puestos', icon: Briefcase, description: 'Gestión de puestos de trabajo' },
        { name: 'Capacitaciones', path: '/app/capacitaciones', icon: GraduationCap, description: 'Programas de formación' },
        { name: 'Procesos', path: '/app/procesos', icon: ClipboardList, description: 'Procesos organizacionales' }
      ]
    },
    {
      id: 'procesos',
      name: '📋 3-Procesos',
      icon: ClipboardList,
      path: '/app/procesos',
      color: 'purple',
      description: 'Gestión de procesos internos',
      items: [
        { name: 'Procesos', path: '/app/procesos', icon: ClipboardList, description: 'Gestión de procesos' },
        { name: 'Documentos', path: '/app/documentos', icon: FileText, description: 'Gestión documental' },
        { name: 'Normas', path: '/app/normas', icon: Shield, description: 'Cumplimiento normativo' }
      ]
    },
    {
      id: 'calidad',
      name: '🎯 4-Calidad',
      icon: Target,
      path: '/app/calidad',
      color: 'orange',
      description: 'Sistema de gestión de calidad',
      items: [
        { name: 'Auditorías', path: '/app/auditorias', icon: CheckCircle, description: 'Auditorías internas y externas' },
        { name: 'Hallazgos', path: '/app/hallazgos', icon: AlertTriangle, description: 'Gestión de hallazgos' },
        { name: 'Acciones', path: '/app/acciones', icon: TrendingUp, description: 'Acciones correctivas y preventivas' },
        { name: 'Mejoras', path: '/app/mejoras', icon: Zap, description: 'Gestión de mejoras' }
      ]
    },
    {
      id: 'indicadores',
      name: '📈 5-Indicadores',
      icon: TrendingUp,
      path: '/app/indicadores',
      color: 'teal',
      description: 'Métricas y KPIs del sistema',
      items: [
        { name: 'Indicadores', path: '/app/indicadores', icon: TrendingUp, description: 'Indicadores de gestión' },
        { name: 'Mediciones', path: '/app/mediciones', icon: BarChart3, description: 'Mediciones y análisis' },
        { name: 'Objetivos', path: '/app/objetivos', icon: Target, description: 'Objetivos de calidad' }
      ]
    },
    {
      id: 'comunicacion',
      name: '💬 6-Comunicación',
      icon: MessageSquare,
      path: '/app/comunicacion',
      color: 'indigo',
      description: 'Comunicación interna y externa',
      items: [
        { name: 'Minutas', path: '/app/minutas', icon: FileText, description: 'Actas de reuniones' },
        { name: 'Encuestas', path: '/app/encuestas', icon: ClipboardList, description: 'Encuestas y feedback' }
      ]
    },
    {
      id: 'productos',
      name: '📦 7-Productos',
      icon: Package,
      path: '/app/productos',
      color: 'pink',
      description: 'Gestión de productos y servicios',
      items: [
        { name: 'Productos', path: '/app/productos', icon: Package, description: 'Catálogo de productos' }
      ]
    }
  ];

  const filteredModules = systemModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (module.items && module.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="h-full w-80 bg-gradient-to-b from-slate-50 to-white text-slate-800 flex flex-col shadow-xl border-r border-slate-200"
    >
      {/* Header del Sistema */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">9001app</h1>
              <p className="text-xs text-slate-600 font-medium">Sistema de Gestión ISO 9001</p>
            </div>
          </div>
          {isMobile && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar en el sistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-300 focus:border-slate-500"
          />
        </div>

        {/* Botón para acceder al menú de tarjetas */}
        <Button
          onClick={handleMainMenuToggle}
          variant="outline"
          className="w-full mt-3 bg-gradient-to-r from-slate-600 to-slate-700 border-slate-600 text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-200"
        >
          <Home className="w-4 h-4 mr-2" />
          Menú de Tarjetas
        </Button>
      </div>

      {/* Contenido del menú */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredModules.map((module) => (
          <div key={module.id} className="space-y-2">
            {module.items ? (
              // Módulo con submenús
              <div>
                <button
                  onClick={() => toggleSection(module.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive(module.path) 
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive(module.path) 
                        ? 'bg-slate-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <module.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{module.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{module.description}</div>
                    </div>
                  </div>
                  {expandedSections.includes(module.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-2 space-y-2"
                    >
                      {module.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                            isActive(item.path) 
                              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            isActive(item.path) 
                              ? 'bg-slate-600 text-white' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <item.icon className="w-3 h-3" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Módulo simple
              <button
                onClick={() => handleNavigation(module.path)}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                  isActive(module.path) 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive(module.path) 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <module.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm flex items-center space-x-2">
                    <span>{module.name}</span>
                    {module.badge && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                        {module.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{module.description}</div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer del Sistema */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">SGC ISO 9001</span>
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">
            Sistema de Coordinación de Agentes
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
