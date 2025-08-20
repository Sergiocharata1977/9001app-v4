import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import CRMMenu from '@/components/menu/CRMMenu';
import TopBar from '@/components/menu/TopBar';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowLeft } from 'lucide-react';

const CRMLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En desktop, mostrar el sidebar por defecto
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-red-50 via-white to-red-50 flex">
      {/* Overlay para móvil */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar CRM - Siempre visible en desktop */}
      <div className="fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:block">
        <CRMMenu 
          isOpen={true} 
          onClose={closeSidebar} 
          isMobile={isMobile} 
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
        {/* TopBar personalizado para CRM */}
        <div className="bg-white border-b-2 border-red-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="lg:hidden text-red-600 hover:bg-red-50"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-red-700">CRM Pro</h1>
                  <p className="text-xs text-red-500">Sistema de Gestión Comercial</p>
                </div>
              </div>
            </div>

            {/* Botón de regreso al SGC */}
            <Button
              onClick={() => navigate('/app/dashboard')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al SGC</span>
            </Button>
          </div>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-red-50/50 to-white">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Indicador de que estamos en el CRM */}
      {!sidebarOpen && (
        <div className="fixed top-4 left-4 z-30 lg:hidden">
          <Button
            onClick={toggleSidebar}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700 shadow-lg"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CRMLayout;
