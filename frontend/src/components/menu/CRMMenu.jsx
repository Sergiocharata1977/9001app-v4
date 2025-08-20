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

  // Colores específicos para CRM (rojo y blanco)
  const getCRMColorClasses = (isActive = false) => {
    return isActive 
      ? 'bg-red-600 text-white border-red-600' 
      : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200';
  };

  // Módulos del CRM
  const crmModules = [
    {
      id: 'dashboard',
      name: '📊 Dashboard CRM',
      icon: BarChart3,
      path: '/app/crm',
      color: 'red',
      description: 'Vista general del rendimiento comercial'
    },
    {
      id: 'clientes',
      name: '👥 Gestión de Clientes',
      icon: Users,
      color: 'red',
      items: [
        { name: 'Lista de Clientes', path: '/app/crm/clientes', icon: Users, description: 'Gestionar base de datos de clientes' },
        { name: 'Nuevo Cliente', path: '/app/crm/clientes/nuevo', icon: UserPlus, description: 'Agregar cliente al sistema' },
        { name: 'Segmentación', path: '/app/crm/clientes/segmentacion', icon: Hash, description: 'Clasificar clientes por categorías' },
        { name: 'Historial', path: '/app/crm/clientes/historial', icon: Clock, description: 'Actividad histórica de clientes' }
      ]
    },
    {
      id: 'oportunidades',
      name: '🎯 Oportunidades de Venta',
      icon: Target,
      color: 'red',
      items: [
        { name: 'Pipeline de Ventas', path: '/app/crm/oportunidades', icon: Target, description: 'Seguimiento de oportunidades' },
        { name: 'Nueva Oportunidad', path: '/app/crm/oportunidades/nueva', icon: Plus, description: 'Crear nueva oportunidad' },
        { name: 'Forecast', path: '/app/crm/oportunidades/forecast', icon: TrendingUp, description: 'Pronóstico de ventas' },
        { name: 'Análisis', path: '/app/crm/oportunidades/analisis', icon: PieChart, description: 'Análisis de oportunidades' }
      ]
    },
    {
      id: 'actividades',
      name: '📅 Actividades Comerciales',
      icon: Activity,
      color: 'red',
      items: [
        { name: 'Calendario', path: '/app/crm/actividades', icon: Calendar, description: 'Programar actividades' },
        { name: 'Tareas', path: '/app/crm/actividades/tareas', icon: CheckCircle, description: 'Gestión de tareas' },
        { name: 'Llamadas', path: '/app/crm/actividades/llamadas', icon: Phone, description: 'Registro de llamadas' },
        { name: 'Reuniones', path: '/app/crm/actividades/reuniones', icon: MessageSquare, description: 'Agendar reuniones' },
        { name: 'Visitas', path: '/app/crm/actividades/visitas', icon: MapPin, description: 'Visitas a clientes' }
      ]
    },
    {
      id: 'vendedores',
      name: '👨‍💼 Equipo de Ventas',
      icon: Briefcase,
      color: 'red',
      items: [
        { name: 'Vendedores', path: '/app/crm/vendedores', icon: Users, description: 'Gestión del equipo' },
        { name: 'Rendimiento', path: '/app/crm/vendedores/rendimiento', icon: TrendingUp, description: 'Métricas de vendedores' },
        { name: 'Comisiones', path: '/app/crm/vendedores/comisiones', icon: DollarSign, description: 'Cálculo de comisiones' },
        { name: 'Territorios', path: '/app/crm/vendedores/territorios', icon: MapPin, description: 'Asignación de territorios' }
      ]
    },
    {
      id: 'reportes',
      name: '📈 Reportes y Analytics',
      icon: LineChart,
      color: 'red',
      items: [
        { name: 'Ventas', path: '/app/crm/reportes/ventas', icon: DollarSign, description: 'Reportes de ventas' },
        { name: 'Clientes', path: '/app/crm/reportes/clientes', icon: Users, description: 'Análisis de clientes' },
        { name: 'Productividad', path: '/app/crm/reportes/productividad', icon: ActivitySquare, description: 'Métricas de productividad' },
        { name: 'KPIs', path: '/app/crm/reportes/kpis', icon: Target, description: 'Indicadores clave' }
      ]
    },
    {
      id: 'configuracion',
      name: '⚙️ Configuración CRM',
      icon: Settings,
      color: 'red',
      items: [
        { name: 'Configuración General', path: '/app/crm/configuracion', icon: Settings, description: 'Ajustes del sistema' },
        { name: 'Etapas de Venta', path: '/app/crm/configuracion/etapas', icon: Hash, description: 'Configurar pipeline' },
        { name: 'Tipos de Actividad', path: '/app/crm/configuracion/actividades', icon: Activity, description: 'Categorías de actividades' },
        { name: 'Integraciones', path: '/app/crm/configuracion/integraciones', icon: Zap, description: 'Conectar con otros sistemas' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="h-full w-80 bg-gradient-to-b from-red-50 to-white text-red-900 flex flex-col shadow-2xl border-r-2 border-red-200"
    >
      {/* Header CRM */}
      <div className="p-6 border-b-2 border-red-200 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🚀 CRM PRO</h1>
              <p className="text-xs text-red-100">Sistema de Gestión Comercial</p>
            </div>
          </div>
          {isMobile && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {/* Botón de regreso al SGC */}
        <Button
          onClick={handleBackToSGC}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al SGC
        </Button>

        {/* Botón Asistente RAG */}
        <Button
          onClick={() => setShowRAGAssistant(true)}
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-blue-500/20"
        >
          <Brain className="w-4 h-4 mr-2" />
          Asistente IA CRM
        </Button>
      </div>

      {/* Contenido del menú */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {crmModules.map((module) => (
          <div key={module.id} className="space-y-1">
            {module.items ? (
              // Módulo con submenús
              <div>
                <button
                  onClick={() => toggleSection(module.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${getCRMColorClasses(isActive(module.path))}`}
                >
                  <div className="flex items-center space-x-3">
                    <module.icon className="w-5 h-5" />
                    <span className="font-semibold">{module.name}</span>
                  </div>
                  {expandedSections.includes(module.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.includes(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-2 space-y-1"
                    >
                      {module.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${getCRMColorClasses(isActive(item.path))}`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-red-500 opacity-75">{item.description}</div>
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
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${getCRMColorClasses(isActive(module.path))}`}
              >
                <module.icon className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">{module.name}</div>
                  <div className="text-xs text-red-500 opacity-75">{module.description}</div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer CRM */}
      <div className="p-4 border-t-2 border-red-200 bg-gradient-to-r from-red-50 to-white">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-700">CRM Pro</span>
            <Star className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xs text-red-600">
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
