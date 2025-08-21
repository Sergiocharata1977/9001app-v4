import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Brain
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import RAGAssistant from '@/components/assistant/RAGAssistant';

const CRMMenu = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [expandedSections, setExpandedSections] = useState(['dashboard', 'clientes', 'oportunidades']);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});
  const [showRAGAssistant, setShowRAGAssistant] = useState(false);

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

  const handleBackToSGC = () => {
    navigate('/app/dashboard');
  };

  // Nuevo sistema de colores equilibrado para CRM
  const getCRMColorClasses = (isActive = false) => {
    return isActive 
      ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg' 
      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md';
  };

  // Módulos del CRM con diseño mejorado - SIGUIENDO EL PATRÓN ESTANDARIZADO
  const crmModules = [
    {
      id: 'dashboard',
      name: '📊 Dashboard CRM',
      icon: BarChart3,
      path: '/app/crm',
      color: 'slate',
      description: 'Vista general del rendimiento comercial'
    },
    {
      id: 'clientes',
      name: '👥 Gestión de Clientes',
      icon: Users,
      path: '/app/crm/clientes',
      color: 'slate',
      description: 'Administra la base de datos de clientes'
    },
    {
      id: 'oportunidades',
      name: '🎯 Oportunidades de Venta',
      icon: Target,
      path: '/app/crm/oportunidades',
      color: 'slate',
      description: 'Seguimiento de oportunidades comerciales'
    },
    {
      id: 'actividades',
      name: '📅 Actividades Comerciales',
      icon: Activity,
      path: '/app/crm/actividades',
      color: 'slate',
      description: 'Programar y gestionar actividades'
    },
    {
      id: 'vendedores',
      name: '👨‍💼 Equipo de Ventas',
      icon: Briefcase,
      path: '/app/crm/vendedores',
      color: 'slate',
      description: 'Gestión del equipo comercial'
    },
    {
      id: 'reportes',
      name: '📈 Reportes y Analytics',
      icon: LineChart,
      path: '/app/crm/reportes',
      color: 'slate',
      description: 'Análisis y reportes comerciales'
    },
    {
      id: 'configuracion',
      name: '⚙️ Configuración CRM',
      icon: Settings,
      path: '/app/crm/configuracion',
      color: 'slate',
      description: 'Ajustes del sistema CRM'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="h-full w-72 bg-gradient-to-b from-slate-50 to-white text-slate-800 flex flex-col shadow-xl border-r border-slate-200"
    >
      {/* Header CRM - Diseño compacto */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">🚀 CRM Pro</h1>
              <p className="text-xs text-slate-600 font-medium">Sistema de Gestión Comercial</p>
            </div>
          </div>
          {isMobile && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Botón de regreso al SGC - Compacto */}
        <Button
          onClick={handleBackToSGC}
          variant="outline"
          className="w-full bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 mb-2 transition-all duration-200 text-xs"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Volver al SGC
        </Button>

        {/* Botón Asistente RAG - Compacto */}
        <Button
          onClick={() => setShowRAGAssistant(true)}
          variant="outline"
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 border-slate-600 text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-200 text-xs"
        >
          <Brain className="w-3 h-3 mr-1" />
          Asistente IA CRM
        </Button>
      </div>

      {/* Contenido del menú - Diseño compacto SIGUIENDO EL PATRÓN ESTANDARIZADO */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {crmModules.map((module) => (
          <div key={module.id} className="space-y-1">
            {/* Módulo simple - SIGUIENDO EL PATRÓN ESTANDARIZADO */}
            <button
              onClick={() => handleNavigation(module.path)}
              className={`w-full flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${getCRMColorClasses(isActive(module.path))}`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                isActive(module.path) 
                  ? 'bg-slate-600 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <module.icon className="w-3 h-3" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">{module.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{module.description}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Footer CRM - Compacto */}
      <div className="p-3 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">CRM Pro</span>
            <Star className="w-3 h-3 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500">
            Sistema de Coordinación de Agentes
          </p>
        </div>
      </div>

      {/* Asistente RAG */}
      {showRAGAssistant && (
        <RAGAssistant 
          onClose={() => setShowRAGAssistant(false)}
          organizationId={user?.organization_id || 1}
        />
      )}
    </motion.div>
  );
};

export default CRMMenu;
