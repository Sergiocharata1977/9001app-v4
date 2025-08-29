import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SecondLevelSidebar from '../menu/SecondLevelSidebar';
import TopBar from '../menu/TopBar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentModule, setCurrentModule] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Función para volver al menú principal
  const handleBackToMainMenu = () => {
    navigate('/app/menu-cards');
  };

  // Detectar el módulo actual basado en la URL
  useEffect(() => {
    const path = location.pathname;
    
    // Detectar módulo basado en la URL - incluyendo subrutas
    if (path.includes('/app/calidad') || path.includes('/app/planificacion-estrategica') || path.includes('/app/revision-direccion') || path.includes('/app/objetivos-metas') || path.includes('/app/normas') || path.includes('/app/documentos') || path.includes('/app/auditorias') || path.includes('/app/hallazgos') || path.includes('/app/acciones') || path.includes('/app/politica-calidad') || path.includes('/app/indicadores')) {
      setCurrentModule('calidad');
    } else if (path.includes('/app/rrhh') || path.includes('/app/departamentos') || path.includes('/app/puestos') || path.includes('/app/personal') || path.includes('/app/capacitaciones') || path.includes('/app/evaluaciones-individuales') || path.includes('/app/competencias')) {
      setCurrentModule('rrhh');
    } else if (path.includes('/app/procesos-menu') || path.includes('/app/procesos') || path.includes('/app/mejoras') || path.includes('/app/productos') || path.includes('/app/tratamientos') || path.includes('/app/verificaciones')) {
      setCurrentModule('procesos');
    } else if (path.includes('/app/crm') || path.includes('/app/encuestas') || path.includes('/app/satisfaccion-cliente') || path.includes('/app/tickets')) {
      setCurrentModule('crm-satisfaccion');
    } else if (path.includes('/app/administracion') || path.includes('/app/usuarios') || path.includes('/app/admin') || path.includes('/app/configuracion') || path.includes('/app/seguridad') || path.includes('/app/reportes') || path.includes('/app/documentacion')) {
      setCurrentModule('admin');
    } else {
      setCurrentModule(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar Principal - Solo se muestra si hay un módulo activo */}
      {currentModule && (
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
                w-72
                h-screen
                bg-slate-900
                shadow-xl
                transition-all duration-300 ease-in-out
              `}
            >
              <SecondLevelSidebar
                moduleType={currentModule}
                onBackToMainMenu={handleBackToMainMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && currentModule && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - Hijo del Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Bar - Dentro del Main Content */}
        <TopBar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          showSidebarToggle={!!currentModule}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {/* Contenedor principal con separación */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
