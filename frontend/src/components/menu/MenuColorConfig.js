// 🎨 Configuración de Colores para Sistema de Menús Unificado
// Basado en el Sistema de Diseño Unificado del SGC ISO 9001

export const menuColorSchemes = {
  // 🟢 Calidad - Planificación y Gestión de Calidad
  calidad: {
    primary: 'emerald',
    gradient: 'from-emerald-600 to-emerald-700',
    hoverGradient: 'from-emerald-700 to-emerald-800',
    accent: 'emerald-400',
    background: 'emerald-50',
    text: 'emerald-900',
    border: 'emerald-200',
    sidebar: 'from-emerald-50 to-white',
    header: 'from-emerald-600 to-emerald-700',
    light: 'emerald-100',
    dark: 'emerald-800',
    success: 'emerald-500',
    warning: 'amber-500',
    error: 'red-500'
  },

  // 🔵 RRHH - Recursos Humanos
  rrhh: {
    primary: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    hoverGradient: 'from-blue-700 to-blue-800',
    accent: 'blue-400',
    background: 'blue-50',
    text: 'blue-900',
    border: 'blue-200',
    sidebar: 'from-blue-50 to-white',
    header: 'from-blue-600 to-blue-700',
    light: 'blue-100',
    dark: 'blue-800',
    success: 'blue-500',
    warning: 'amber-500',
    error: 'red-500'
  },

  // 🟣 Procesos - Gestión de Procesos
  procesos: {
    primary: 'purple',
    gradient: 'from-purple-600 to-purple-700',
    hoverGradient: 'from-purple-700 to-purple-800',
    accent: 'purple-400',
    background: 'purple-50',
    text: 'purple-900',
    border: 'purple-200',
    sidebar: 'from-purple-50 to-white',
    header: 'from-purple-600 to-purple-700',
    light: 'purple-100',
    dark: 'purple-800',
    success: 'purple-500',
    warning: 'amber-500',
    error: 'red-500'
  },

  // 🟦 CRM y Satisfacción
  'crm-satisfaccion': {
    primary: 'indigo',
    gradient: 'from-indigo-600 to-indigo-700',
    hoverGradient: 'from-indigo-700 to-indigo-800',
    accent: 'indigo-400',
    background: 'indigo-50',
    text: 'indigo-900',
    border: 'indigo-200',
    sidebar: 'from-indigo-50 to-white',
    header: 'from-indigo-600 to-indigo-700',
    light: 'indigo-100',
    dark: 'indigo-800',
    success: 'indigo-500',
    warning: 'amber-500',
    error: 'red-500'
  },

  // 🔴 Super Admin - Administración del Sistema (Rojo)
  'super-admin': {
    primary: 'red',
    gradient: 'from-red-600 to-red-700',
    hoverGradient: 'from-red-700 to-red-800',
    accent: 'red-400',
    background: 'red-50',
    text: 'red-900',
    border: 'red-200',
    sidebar: 'from-red-50 to-white',
    header: 'from-red-600 to-red-700',
    light: 'red-100',
    dark: 'red-800',
    success: 'red-500',
    warning: 'amber-500',
    error: 'red-500'
  }
};

// 🎯 Configuración de Módulos por Sistema
export const moduleConfigurations = {
  // 📋 Módulos SGC - Organización Secuencial y Temática
  sgc: {
    title: 'Sistema de Gestión ISO 9001',
    subtitle: 'Gestión Integral de Calidad',
    modules: [
      {
        id: 'dashboard',
        name: '📊 1. Dashboard Central',
        icon: 'BarChart3',
        path: '/app/dashboard',
        description: 'Vista general del sistema SGC',
        priority: 1,
        color: 'emerald'
      },
      {
        id: 'organizacion',
        name: '🏢 2. Organización',
        icon: 'Building2',
        path: '/app/organizacion',
        description: 'Estructura organizacional',
        priority: 2,
        color: 'emerald',
        items: [
          { name: 'Departamentos', path: '/app/departamentos', icon: 'Building', description: 'Gestión departamental', priority: 1 },
          { name: 'Puestos', path: '/app/puestos', icon: 'Briefcase', description: 'Gestión de puestos', priority: 2 },
          { name: 'Personal', path: '/app/personal', icon: 'Users2', description: 'Gestión de empleados', priority: 3 }
        ]
      },
      {
        id: 'recursos-humanos',
        name: '👥 3. Recursos Humanos',
        icon: 'UserCheck',
        path: '/app/recursos-humanos',
        description: 'Gestión del capital humano',
        priority: 3,
        color: 'emerald',
        items: [
          { name: 'Capacitaciones', path: '/app/capacitaciones', icon: 'GraduationCap', description: 'Programas de formación', priority: 1 },
          { name: 'Evaluaciones', path: '/app/evaluaciones', icon: 'FileCheck', description: 'Evaluaciones de competencias', priority: 2 },
          { name: 'Competencias', path: '/app/competencias', icon: 'Award', description: 'Gestión de competencias', priority: 3 }
        ]
      },
      {
        id: 'procesos',
        name: '⚙️ 4. Procesos',
        icon: 'Cog',
        path: '/app/procesos',
        description: 'Gestión de procesos internos',
        priority: 4,
        color: 'emerald',
        items: [
          { name: 'Procesos', path: '/app/procesos', icon: 'Cog', description: 'Mapeo y gestión de procesos', priority: 1 },
          { name: 'Documentos', path: '/app/documentos', icon: 'FileText', description: 'Gestión documental', priority: 2 },
          { name: 'Normas', path: '/app/normas', icon: 'Shield', description: 'Cumplimiento normativo', priority: 3 }
        ]
      },
      {
        id: 'calidad',
        name: '🎯 5. Gestión de Calidad',
        icon: 'Target',
        path: '/app/calidad',
        description: 'Sistema de gestión de calidad',
        priority: 5,
        color: 'emerald',
        items: [
          { name: 'Auditorías', path: '/app/auditorias', icon: 'CheckCircle', description: 'Auditorías internas y externas', priority: 1 },
          { name: 'Hallazgos', path: '/app/hallazgos', icon: 'AlertTriangle', description: 'Gestión de hallazgos', priority: 2 },
          { name: 'Acciones', path: '/app/acciones', icon: 'TrendingUp', description: 'Acciones correctivas y preventivas', priority: 3 },
          { name: 'Mejoras', path: '/app/mejoras', icon: 'Zap', description: 'Gestión de mejoras', priority: 4 }
        ]
      },
      {
        id: 'indicadores',
        name: '📈 6. Indicadores y Métricas',
        icon: 'TrendingUp',
        path: '/app/indicadores',
        description: 'Métricas y KPIs del sistema',
        priority: 6,
        color: 'emerald',
        items: [
          { name: 'Indicadores', path: '/app/indicadores', icon: 'TrendingUp', description: 'Indicadores de gestión', priority: 1 },
          { name: 'Mediciones', path: '/app/mediciones', icon: 'BarChart3', description: 'Mediciones y análisis', priority: 2 },
          { name: 'Objetivos', path: '/app/objetivos', icon: 'Target', description: 'Objetivos de calidad', priority: 3 }
        ]
      },
      {
        id: 'comunicacion',
        name: '💬 7. Comunicación',
        icon: 'MessageCircle',
        path: '/app/comunicacion',
        description: 'Comunicación interna y externa',
        priority: 7,
        color: 'emerald',
        items: [
          { name: 'Minutas', path: '/app/minutas', icon: 'FileText', description: 'Actas de reuniones', priority: 1 },
          { name: 'Noticias', path: '/app/noticias', icon: 'MessageCircle', description: 'Comunicaciones internas', priority: 2 }
        ]
      },
      {
        id: 'productos',
        name: '📦 8. Productos y Servicios',
        icon: 'ShoppingBag',
        path: '/app/productos',
        description: 'Gestión de productos y servicios',
        priority: 8,
        color: 'emerald',
        items: [
          { name: 'Productos', path: '/app/productos', icon: 'ShoppingBag', description: 'Catálogo de productos', priority: 1 }
        ]
      },
      {
        id: 'configuracion',
        name: '⚙️ 9. Configuración',
        icon: 'Settings',
        path: '/app/configuracion',
        description: 'Configuración del sistema',
        priority: 9,
        color: 'emerald',
        items: [
          { name: 'Configuración', path: '/app/configuracion', icon: 'Settings', description: 'Configuración general', priority: 1 },
          { name: 'Base de Datos', path: '/app/database', icon: 'Database', description: 'Gestión de base de datos', priority: 2 }
        ]
      }
    ]
  },

  // 👥 Módulos CRM - Organización Secuencial y Temática
  crm: {
    title: 'Sistema CRM',
    subtitle: 'Gestión de Relaciones con Clientes',
    modules: [
      {
        id: 'crm-dashboard',
        name: '📊 1. Dashboard CRM',
        icon: 'BarChart3',
        path: '/app/crm',
        description: 'Vista general del CRM',
        priority: 1,
        color: 'blue'
      },
      {
        id: 'contactos',
        name: '📞 2. Contactos',
        icon: 'Users',
        path: '/app/crm/contactos',
        description: 'Gestión de contactos y prospectos',
        priority: 2,
        color: 'blue'
      },
      {
        id: 'clientes',
        name: '👥 3. Gestión de Clientes',
        icon: 'Building',
        path: '/app/crm/clientes',
        description: 'Gestión integral de clientes agro',
        priority: 3,
        color: 'blue'
      },
      {
        id: 'oportunidades',
        name: '💼 4. Oportunidades',
        icon: 'Target',
        path: '/app/crm/oportunidades',
        description: 'Pipeline de ventas',
        priority: 4,
        color: 'blue'
      },
      {
        id: 'actividades',
        name: '📅 5. Actividades',
        icon: 'Calendar',
        path: '/app/crm/actividades',
        description: 'Gestión de actividades comerciales',
        priority: 5,
        color: 'blue'
      },
      {
        id: 'vendedores',
        name: '👨‍💼 6. Vendedores',
        icon: 'UserCheck',
        path: '/app/crm/vendedores',
        description: 'Gestión del equipo comercial',
        priority: 6,
        color: 'blue'
      },
      {
        id: 'reportes',
        name: '📊 7. Reportes',
        icon: 'BarChart3',
        path: '/app/crm/reportes',
        description: 'Reportes y análisis',
        priority: 7,
        color: 'blue'
      }
    ]
  }
};

// 🎨 Utilidades de Colores
export const getColorClasses = (scheme, type = 'primary') => {
  const colors = menuColorSchemes[scheme];

  switch (type) {
    case 'primary':
      return `text-${colors.primary}-600 bg-${colors.primary}-50 border-${colors.primary}-200`;
    case 'active':
      return `text-white bg-gradient-to-r ${colors.gradient} border-${colors.primary}-600`;
    case 'hover':
      return `hover:text-${colors.primary}-700 hover:bg-${colors.primary}-100 hover:border-${colors.primary}-300`;
    case 'header':
      return `bg-gradient-to-r ${colors.header} text-white`;
    case 'sidebar':
      return `bg-gradient-to-b ${colors.sidebar}`;
    default:
      return `text-${colors.primary}-600 bg-${colors.primary}-50`;
  }
};

// 🎯 Configuración de Iconos
export const iconConfig = {
  sgc: 'Shield',
  crm: 'Users',
  'super-admin': 'Crown'
};

export default {
  menuColorSchemes,
  moduleConfigurations,
  getColorClasses,
  iconConfig
};
