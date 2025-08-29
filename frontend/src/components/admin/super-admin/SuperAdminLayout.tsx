import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowLeft,
    BarChart3,
    Bell,
    Building2,
    Crown,
    Database,
    LogOut,
    Menu,
    Settings,
    User,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isLoading, verifyToken } = useAuthStore();

  // Inicializar autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await verifyToken();
      } catch (error) {
        console.error('Error verificando token:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [verifyToken, isInitialized]);

  // Detectar si es móvil y configurar sidebar
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // En desktop, sidebar abierto por defecto; en móvil, cerrado
      setSidebarOpen(!mobile);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToApp = () => {
    navigate('/app/menu-cards');
  };

  console.log('🔍 Estado completo:', { 
    user: !!user, 
    isAuthenticated, 
    isLoading, 
    isInitialized,
    role: user?.role 
  });
  
  // Mostrar loading mientras se inicializa
  if (!isInitialized || isLoading) {
    console.log('⏳ Inicializando autenticación...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Cargando Panel Super Admin</h2>
          <p className="text-purple-600">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated || !user) {
    console.log('❌ No autenticado, redirigiendo...');
    setTimeout(() => navigate('/login'), 100);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }
  
  if (user?.role !== 'super_admin') {
    console.log('🚫 Acceso denegado - Usuario no es super_admin:', user?.role);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Acceso Denegado</h1>
          <p className="text-red-600 mb-4">No tienes permisos para acceder al panel de Super Administrador</p>
          <Button onClick={handleBackToApp} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la Aplicación
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ SuperAdminLayout renderizado - Usuario:', user?.name, 'Rol:', user?.role);
  console.log('📍 Ruta actual:', location.pathname);
  console.log('📱 Es móvil:', isMobile, 'Sidebar abierto:', sidebarOpen);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/super-admin/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'organizations',
      label: 'Organizaciones',
      icon: Building2,
      path: '/super-admin/organizations',
      color: 'text-purple-600'
    },
    {
      id: 'users',
      label: 'Usuarios Globales',
      icon: Users,
      path: '/super-admin/users',
      color: 'text-green-600'
    },
    // {
    //   id: 'agents',
    //   label: 'Agent Coordinator',
    //   icon: Bot,
    //   path: '/super-admin/agents',
    //   color: 'text-indigo-600'
    // },
    {
      id: 'system',
      label: 'Sistema',
      icon: Settings,
      path: '/super-admin/system',
      color: 'text-gray-600'
    },
    {
      id: 'database',
      label: 'Base de Datos',
      icon: Database,
      path: '/super-admin/database',
      color: 'text-orange-600'
    },
    {
      id: 'monitoring',
      label: 'Monitoreo',
      icon: Activity,
      path: '/super-admin/monitoring',
      color: 'text-red-600'
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 shadow-xl
          ${isMobile ? '' : 'lg:translate-x-0'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Super Admin</h1>
              <p className="text-xs text-slate-400">Panel de Control</p>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navegación */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`
                  w-full justify-start h-12 px-4
                  ${isActive 
                    ? 'bg-slate-800 text-white border-slate-600' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }
                `}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
              >
                <Icon className={`w-5 h-5 mr-3 ${item.color}`} />
                {item.label}
                                 {isActive && (
                   <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                     Activo
                   </span>
                 )}
              </Button>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name || 'Super Admin'}</p>
                <p className="text-xs text-slate-400">super_admin</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-72' : 'ml-0'}`}>
        {/* Header Principal */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              
              {/* Logo y título */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => navigate('/super-admin/dashboard')}
                >
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Panel Super Administrador</h1>
                  <p className="text-sm text-gray-500">Gestión global del sistema</p>
                </div>
              </div>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleBackToApp}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a App
              </Button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
