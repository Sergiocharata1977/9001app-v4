import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useAuthInitializer } from './hooks/useAuthInitializer.js';
import { QueryProvider } from './hooks/useQueryClient.jsx';
import './index.css';
import AppRoutes from './routes/AppRoutes.tsx';

// Componente interno que maneja la inicialización de auth
const AppContent = () => {
  const { isLoading } = useAuthInitializer();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Usar AppRoutes, toda la app va bajo /app y públicas fuera */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
      
      {/* Componente de debug para desarrollo */}
      {/* <LoginDebug /> */}
      
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
