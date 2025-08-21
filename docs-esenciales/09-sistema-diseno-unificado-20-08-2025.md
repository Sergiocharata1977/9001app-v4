# 🎨 09 - Sistema de Diseño Unificado - SGC ISO 9001
**📅 Última Actualización: 20-08-2025**

## 🎯 Visión General

Este documento establece el **Sistema de Diseño Unificado** para el Sistema SGC ISO 9001, definiendo los estándares visuales, componentes y patrones que garantizan consistencia y coherencia visual en todos los módulos del sistema, manteniendo la identidad única de cada módulo.

## 🏗️ Arquitectura del Sistema de Diseño

### 📋 Principios Fundamentales

1. **Consistencia Visual**: Todos los módulos comparten componentes base pero mantienen identidad única
2. **Jerarquía Clara**: Estructura visual que guía al usuario de forma intuitiva
3. **Accesibilidad**: Cumplimiento de estándares WCAG AA
4. **Responsive Design**: Adaptación perfecta a todos los dispositivos
5. **Performance**: Optimización para velocidad y eficiencia

### 🎨 Paleta de Colores Unificada

#### Colores Base del Sistema

```css
/* Colores base del sistema */
:root {
  /* Neutros */
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;

  /* Colores primarios por módulo */
  --crm-primary: #10b981;      /* Emerald */
  --crm-accent: #059669;
  --personal-primary: #3b82f6; /* Blue */
  --personal-accent: #2563eb;
  --admin-primary: #ef4444;    /* Red */
  --admin-accent: #dc2626;

  /* Estados del sistema */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### Esquemas de Color por Módulo

```javascript
const moduleColorSchemes = {
  crm: {
    primary: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    hoverGradient: 'from-emerald-600 to-emerald-700',
    accent: 'emerald-400',
    background: 'emerald-50',
    text: 'emerald-900'
  },
  personal: {
    primary: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-600 to-blue-700',
    accent: 'blue-400',
    background: 'blue-50',
    text: 'blue-900'
  },
  'super-admin': {
    primary: 'red',
    gradient: 'from-red-500 to-red-600',
    hoverGradient: 'from-red-600 to-red-700',
    accent: 'red-400',
    background: 'red-50',
    text: 'red-900'
  }
};
```

## 🧩 Componentes Base Unificados

### 1. **ModuleLayout** - Layout Base para Módulos

```typescript
interface ModuleLayoutProps {
  children: React.ReactNode;
  module: 'crm' | 'personal' | 'super-admin';
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export function ModuleLayout({ 
  children, 
  module, 
  title, 
  description, 
  actions,
  showBackButton = false 
}: ModuleLayoutProps) {
  const colorScheme = moduleColorSchemes[module];
  
  return (
    <div className={`module-${module} min-h-screen bg-gradient-to-br from-${colorScheme.background} via-white to-${colorScheme.background}`}>
      {/* Header del módulo */}
      <div className={`bg-gradient-to-r ${colorScheme.gradient} text-white p-6 shadow-lg`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                  <p className="text-white/90 text-sm mt-1">{description}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del módulo */}
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
```

### 2. **UnifiedCard** - Tarjeta Estandarizada

```typescript
interface UnifiedCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ComponentType;
  color: 'emerald' | 'blue' | 'red' | 'purple' | 'orange';
  metrics?: Record<string, string | number>;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function UnifiedCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  metrics,
  actions,
  children,
  onClick
}: UnifiedCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <Card 
      className={`h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                {subtitle && (
                  <p className="text-white/90 text-sm">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          {description && (
            <p className="text-white/90 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <CardContent className="p-6">
        {/* Métricas */}
        {metrics && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-xs text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contenido personalizado */}
        {children}

        {/* Acciones */}
        {actions && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 3. **UnifiedHeader** - Header Estandarizado

```typescript
interface UnifiedHeaderProps {
  title: string;
  description?: string;
  module: 'crm' | 'personal' | 'super-admin';
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onNew?: () => void;
  onExport?: () => void;
  viewMode?: 'grid' | 'list' | 'table';
  onViewModeChange?: (mode: 'grid' | 'list' | 'table') => void;
  newButtonText?: string;
  totalCount?: number;
  lastUpdated?: string;
  icon?: React.ComponentType;
}

export function UnifiedHeader({
  title,
  description,
  module,
  searchTerm,
  onSearchChange,
  onNew,
  onExport,
  viewMode,
  onViewModeChange,
  newButtonText = 'Nuevo',
  totalCount,
  lastUpdated,
  icon: Icon
}: UnifiedHeaderProps) {
  const colorScheme = moduleColorSchemes[module];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`w-10 h-10 bg-gradient-to-r ${colorScheme.gradient} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {description && (
              <p className="text-slate-600 text-sm">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onNew && (
            <Button
              onClick={onNew}
              className={`bg-gradient-to-r ${colorScheme.gradient} hover:${colorScheme.hoverGradient} text-white`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {newButtonText}
            </Button>
          )}
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}

          {totalCount !== undefined && (
            <div className="text-sm text-slate-600">
              {totalCount} elementos
            </div>
          )}

          {lastUpdated && (
            <div className="text-sm text-slate-500">
              Actualizado: {lastUpdated}
            </div>
          )}
        </div>

        {onViewModeChange && viewMode && (
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 📱 Patrones de Diseño Responsive

### Breakpoints Estandarizados

```css
/* Breakpoints del sistema */
.sm: 640px   /* Móviles grandes */
.md: 768px   /* Tablets */
.lg: 1024px  /* Laptops */
.xl: 1280px  /* Desktops */
.2xl: 1536px /* Pantallas grandes */
```

### Grid System Unificado

```css
/* Grid base para todos los módulos */
.grid-base {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Grid para tarjetas de métricas */
.grid-metrics {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

/* Grid para contenido principal */
.grid-content {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}
```

## 🎯 Patrones de Interacción

### Estados de Hover y Focus

```css
/* Estados base para todos los elementos interactivos */
.interactive {
  @apply transition-all duration-200 ease-in-out;
}

.hover-lift {
  @apply hover:-translate-y-1 hover:shadow-lg;
}

.focus-ring {
  @apply focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

/* Estados específicos por módulo */
.hover-crm {
  @apply hover:bg-emerald-50 hover:border-emerald-200;
}

.hover-personal {
  @apply hover:bg-blue-50 hover:border-blue-200;
}

.hover-admin {
  @apply hover:bg-red-50 hover:border-red-200;
}
```

### Animaciones Estandarizadas

```javascript
// Animaciones con Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};
```

## 🔧 Hooks Personalizados

### useModuleTheme

```typescript
function useModuleTheme(module: 'crm' | 'personal' | 'super-admin') {
  const colorScheme = moduleColorSchemes[module];
  
  return {
    primaryColor: colorScheme.primary,
    gradient: colorScheme.gradient,
    hoverGradient: colorScheme.hoverGradient,
    className: `module-${module}`,
    accentColor: colorScheme.accent,
    background: colorScheme.background,
    text: colorScheme.text
  };
}
```

### useResponsiveLayout

```typescript
function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
}
```

## 📊 Implementación por Módulos

### CRM (Verde/Emerald)

```typescript
// Configuración específica del CRM
const crmConfig = {
  color: 'emerald',
  metrics: ['clientes', 'oportunidades', 'ventas', 'conversion'],
  components: ['Pipeline', 'Distribución de clientes', 'Top vendedores'],
  features: ['Gestión de clientes', 'Pipeline de ventas', 'Reportes comerciales']
};
```

### Personal (Azul/Blue)

```typescript
// Configuración específica de Personal
const personalConfig = {
  color: 'blue',
  metrics: ['total', 'activos', 'inactivos', 'conPuesto'],
  components: ['Cards de empleados', 'Filtros de estado', 'Gestión de puestos'],
  features: ['Gestión de empleados', 'Puestos y departamentos', 'Capacitaciones']
};
```

### Super Admin (Rojo/Red)

```typescript
// Configuración específica de Super Admin
const adminConfig = {
  color: 'red',
  metrics: ['organizaciones', 'usuarios', 'activos', 'estado'],
  components: ['Gestión global', 'Configuración', 'Base de datos'],
  features: ['Gestión de organizaciones', 'Usuarios del sistema', 'Configuración']
};
```

## 🧪 Testing del Sistema de Diseño

### Componentes de Prueba

```typescript
// Tests para componentes unificados
describe('UnifiedCard', () => {
  test('renders with correct color scheme', () => {
    render(<UnifiedCard title="Test" color="emerald" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('applies correct gradient classes', () => {
    render(<UnifiedCard title="Test" color="blue" />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('from-blue-500', 'to-blue-600');
  });
});
```

### Validación de Accesibilidad

```typescript
// Tests de accesibilidad
describe('Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<UnifiedHeader title="Test" module="crm" />);
    expect(screen.getByRole('heading')).toHaveAccessibleName('Test');
  });

  test('supports keyboard navigation', () => {
    render(<UnifiedCard title="Test" color="emerald" />);
    const card = screen.getByRole('article');
    card.focus();
    expect(card).toHaveFocus();
  });
});
```

## 📋 Checklist de Implementación

### ✅ Para Nuevos Módulos

- [ ] Definir esquema de colores en `moduleColorSchemes`
- [ ] Implementar `ModuleLayout` con configuración específica
- [ ] Crear componentes específicos del módulo
- [ ] Implementar métricas y características únicas
- [ ] Agregar tests de accesibilidad
- [ ] Documentar características específicas

### ✅ Para Nuevos Componentes

- [ ] Seguir patrones de `UnifiedCard` o `UnifiedHeader`
- [ ] Implementar responsive design
- [ ] Agregar animaciones con Framer Motion
- [ ] Incluir estados de hover y focus
- [ ] Validar accesibilidad
- [ ] Agregar tests unitarios

## 🎯 Beneficios del Sistema Unificado

1. **Consistencia Visual**: Todos los módulos comparten la misma base visual
2. **Mantenibilidad**: Cambios centralizados en un solo lugar
3. **Escalabilidad**: Fácil agregar nuevos módulos
4. **Experiencia de Usuario**: Navegación intuitiva y familiar
5. **Performance**: Componentes optimizados y reutilizables
6. **Accesibilidad**: Cumplimiento de estándares WCAG
7. **Desarrollo Rápido**: Patrones establecidos aceleran el desarrollo

---

*Este sistema de diseño unificado garantiza que todos los módulos del Sistema SGC mantengan coherencia visual mientras preservan su identidad única, proporcionando una experiencia de usuario excepcional y un desarrollo eficiente.*

**📅 Versión**: 1.0  
**👥 Responsable**: Equipo de Diseño SGC  
**🔄 Revisión**: Trimestral
