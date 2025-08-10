import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  Building,
  FileText,
  Settings,
  Search,
  Menu,
  X,
  ChevronRight,
  Shield,
  Target,
  AlertTriangle,
  ClipboardList,
  BookOpen,
  BarChart3
} from 'lucide-react';

const MenuLateral = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      path: '/'
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      icon: Users,
      path: '/usuarios'
    },
    {
      id: 'departamentos',
      title: 'Departamentos',
      icon: Building,
      path: '/departamentos'
    },
    {
      id: 'puestos',
      title: 'Puestos',
      icon: Shield,
      path: '/puestos'
    },
    {
      id: 'documentos',
      title: 'Documentos',
      icon: FileText,
      path: '/documentos'
    },
    {
      id: 'procesos',
      title: 'Procesos',
      icon: ClipboardList,
      path: '/procesos'
    },
    {
      id: 'normas',
      title: 'Normas',
      icon: BookOpen,
      path: '/normas'
    },
    {
      id: 'auditorias',
      title: 'Auditorías',
      icon: Target,
      path: '/auditorias'
    },
    {
      id: 'acciones',
      title: 'Acciones',
      icon: AlertTriangle,
      path: '/acciones'
    },
    {
      id: 'hallazgos',
      title: 'Hallazgos',
      icon: AlertTriangle,
      path: '/hallazgos'
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: BarChart3,
      path: '/reportes'
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: Settings,
      path: '/configuracion'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-50 border-r border-gray-200 overflow-hidden`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">ISOFlow4</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 hover:bg-gray-200 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav>
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                  {item.submenu && (
                    <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                      isActive(item.path) ? 'rotate-90' : ''
                    }`} />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && isActive(item.path) && (
                  <div className="ml-8 mt-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => handleNavigation(subItem.path)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          location.pathname === subItem.path
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`lg:hidden fixed top-4 ${sidebarOpen ? 'left-64' : 'left-4'} z-50 p-2 bg-white shadow-md rounded-lg transition-all duration-300`}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 max-w-5xl mx-auto">
          {/* Aquí irá el contenido de cada página */}
        </div>
      </main>
    </div>
  );
};

export default MenuLateral; 