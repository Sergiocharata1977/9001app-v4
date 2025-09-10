import { useNavigate } from 'react-router-dom';

const DevBypass = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'CRM - Gestión de Clientes',
      description: 'Sistema de gestión de relaciones con clientes',
      path: '/access-crm',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: '👥'
    },
    {
      title: 'RRHH - Recursos Humanos',
      description: 'Gestión de personal y competencias',
      path: '/access-rrhh',
      color: 'bg-green-500 hover:bg-green-600',
      icon: '👨‍💼'
    },
    {
      title: 'Procesos - ISO 9001',
      description: 'Gestión de procesos y documentación',
      path: '/access-procesos',
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: '⚙️'
    },
    {
      title: 'Calidad - SGC',
      description: 'Sistema de gestión de calidad',
      path: '/access-calidad',
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '🎯'
    },
    {
      title: 'Dashboard Principal',
      description: 'Menú principal de tarjetas',
      path: '/app/menu-cards',
      color: 'bg-teal-500 hover:bg-teal-600',
      icon: '🏠'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-500 p-4 rounded-full mr-4">
              <span className="text-3xl">🚀</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                9001app - Acceso Directo
              </h1>
              <p className="text-gray-300 text-lg">
                Bypass temporal mientras se reconstruye el sistema de login
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-8">
            <p className="text-yellow-300 font-medium">
              ⚠️ Modo Desarrollo - Acceso directo a módulos sin autenticación
            </p>
          </div>
        </div>

        {/* Módulos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className={`${module.color} rounded-xl p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Status del Sistema */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Backend:</span>
              <span className="text-green-400 font-medium">✅ Corriendo (Puerto 5000)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Frontend:</span>
              <span className="text-green-400 font-medium">✅ Corriendo (Puerto 3000)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">MongoDB:</span>
              <span className="text-green-400 font-medium">✅ Conectado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Login:</span>
              <span className="text-yellow-400 font-medium">🔧 En reconstrucción</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Sistema de Gestión de Calidad ISO 9001 | Versión 2.0 | Desarrollo
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevBypass;