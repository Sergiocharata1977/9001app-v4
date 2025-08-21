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
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
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

      {/* Sidebar CRM - Optimizado para reducir márgenes */}
      <div className="fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:block">
        <CRMMenu 
          isOpen={true} 
          onClose={closeSidebar} 
          isMobile={isMobile} 
        />
      </div>

      {/* Contenido principal - Optimizado para mejor uso del espacio */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* TopBar personalizado para CRM - Reducido padding */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-600 hover:bg-slate-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-800">CRM Pro</h1>
                  <p className="text-xs text-slate-600 font-medium">Sistema de Gestión Comercial</p>
                </div>
              </div>
            </div>

            {/* Botón de regreso al SGC - Compacto */}
            <Button
              onClick={() => navigate('/app/dashboard')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Volver al SGC</span>
            </Button>
          </div>
        </div>

        {/* Área de contenido - Reducido padding para mejor uso del espacio */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/30 to-white">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>

      {/* Indicador de que estamos en el CRM - Compacto */}
      {!sidebarOpen && (
        <div className="fixed top-3 left-3 z-30 lg:hidden">
          <Button
            onClick={toggleSidebar}
            size="sm"
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg transition-all duration-200"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CRMLayout;
