import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Shield,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const SuperAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleBackToApp = () => {
    navigate('/app/menu-cards');
  };
  
  const navItems = [
    {
      path: '/super-admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/super-admin/organizations',
      icon: Building2,
      label: 'Organizaciones'
    },
    {
      path: '/super-admin/users',
      icon: Users,
      label: 'Usuarios Globales'
    },
    {
      path: '/super-admin/settings',
      icon: Settings,
      label: 'Configuración'
    }
  ];
  
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="text-lg font-bold text-white">Super Admin</h2>
                <p className="text-xs text-gray-400">Panel de Control</p>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="text-sm">
              <p className="text-gray-400">Usuario actual:</p>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Actions */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={handleBackToApp}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a la App</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminLayout;

