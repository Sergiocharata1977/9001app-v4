import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Cog,
  Database,
  FileCheck,
  FileText,
  GraduationCap,
  LineChart,
  MessageCircle,
  PieChart,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Users2,
  X,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListMenu from './ListMenu';
import { menuColorSchemes, moduleConfigurations } from './MenuColorConfig';

const UnifiedMenuSystem = ({ isOpen, onClose, isMobile, menuType = 'sgc' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [expandedSections, setExpandedSections] = useState(['dashboard']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(menuType);

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

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleMenuSwitch = (menuType) => {
    setActiveMenu(menuType);
    if (menuType === 'crm') {
      navigate('/app/crm');
    } else {
      navigate('/app/dashboard');
    }
  };

  // Configuración de colores según el sistema de diseño
  const currentScheme = menuColorSchemes[activeMenu];

  // Obtener módulos según el tipo de menú activo
  const currentModules = moduleConfigurations[activeMenu]?.modules || [];

  const filteredModules = currentModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (module.items && module.items.some(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Función para obtener el icono dinámicamente
  const getIconComponent = (iconName) => {
    const iconMap = {
      BarChart3, Building2, UserCheck, Cog, Target, TrendingUp, MessageCircle,
      ShoppingBag, Settings, Users, Tag, Calendar, Clock, PieChart, FileText,
      LineChart, Building, Briefcase, Users2, GraduationCap, FileCheck, Award,
      Shield, CheckCircle, AlertTriangle, Zap, Database
    };
    return iconMap[iconName] || BarChart3;
  };

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className={`h-full w-80 bg-slate-800 text-white flex flex-col shadow-xl overflow-hidden`}
    >
      {/* Header del Sistema */}
      <div className={`p-6 border-b border-slate-700 bg-slate-900/50`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Star className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">9001app</h1>
              <p className="text-xs text-slate-300 font-medium">
                {moduleConfigurations[activeMenu]?.title || 'Sistema de Gestión'}
              </p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-300 hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Selector de Menú */}
        <div className="flex space-x-1 bg-slate-700/50 rounded-lg p-1 backdrop-blur-sm">
          <Button
            variant={activeMenu === 'sgc' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleMenuSwitch('sgc')}
            className={`flex-1 text-xs ${activeMenu === 'sgc'
              ? 'bg-teal-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
          >
            <Shield className="w-3 h-3 mr-1" />
            SGC
          </Button>
          <Button
            variant={activeMenu === 'crm' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleMenuSwitch('crm')}
            className={`flex-1 text-xs ${activeMenu === 'crm'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
          >
            <Users className="w-3 h-3 mr-1" />
            CRM
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder={`Buscar en ${activeMenu === 'crm' ? 'CRM' : 'SGC'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 text-white border-slate-600 focus:border-teal-500 rounded-md"
          />
        </div>
      </div>

      {/* Lista de Módulos */}
      <div className="flex-1 overflow-y-auto">
        <ListMenu
          modules={filteredModules}
          handleNavigation={handleNavigation}
          isActive={isActive}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{user?.nombre || 'Usuario'}</span>
          </div>
          <div className="px-2 py-1 bg-slate-700 rounded-md text-slate-300">
            {activeMenu === 'crm' ? 'CRM Pro' : 'SGC ISO'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedMenuSystem;
