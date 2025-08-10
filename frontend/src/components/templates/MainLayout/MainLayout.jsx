import React from 'react';
import { Header } from '../../organisms/Header';

/**
 * @component MainLayout
 * @description Plantilla principal de la aplicación
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido del layout
 * @returns {JSX.Element} Componente MainLayout
 */
export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}; 