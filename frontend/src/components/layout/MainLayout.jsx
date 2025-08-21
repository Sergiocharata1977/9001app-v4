import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import SuperAdminRedirect from '../common/SuperAdminRedirect';
import SecondLevelSidebar from '../menu/SecondLevelSidebar';
import TopBar from '../menu/TopBar';

const MainLayout = ({ children, moduleType, onBackToMainMenu }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Mantener el sidebar cerrado por defecto en todos los casos
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    // Ejecutar al montar el componente
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Componente de redirección automática para Super Admins */}
      <SuperAdminRedirect />

      {/* Sidebar */}
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
              transition-all duration-300 ease-in-out
            `}
          >
            <SecondLevelSidebar
              moduleType={moduleType}
              onBackToMainMenu={onBackToMainMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {/* Contenedor principal con separación de 1cm */}
            <div className="p-sgc-sep">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
