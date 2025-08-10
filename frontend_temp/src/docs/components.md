# 📚 Documentación de Componentes - ISOFlow4

## 🎯 Estructura de Componentes

### Atoms (Componentes Atómicos)
Componentes básicos y reutilizables que forman la base del sistema de diseño.

#### Button
- **Propósito**: Botón reutilizable con múltiples variantes
- **Props**: `variant`, `size`, `disabled`, `onClick`, `children`, `className`
- **Variantes**: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- **Tamaños**: `sm`, `md`, `lg`

```jsx
import { Button } from '../components/atoms/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

#### Input
- **Propósito**: Campo de entrada de texto
- **Props**: `type`, `placeholder`, `value`, `onChange`, `disabled`, `className`
- **Tipos**: `text`, `email`, `password`, `number`, etc.

```jsx
import { Input } from '../components/atoms/Input';

<Input 
  type="email" 
  placeholder="Enter email" 
  value={email} 
  onChange={setEmail} 
/>
```

#### Card
- **Propósito**: Contenedor de contenido con múltiples subcomponentes
- **Subcomponentes**: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/atoms/Card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Molecules (Componentes Moleculares)
Combinaciones de átomos que forman componentes más complejos.

#### SearchBar
- **Propósito**: Barra de búsqueda con debounce
- **Props**: `onSearch`, `placeholder`, `debounceMs`, `className`
- **Características**: Debounce automático, icono de búsqueda

```jsx
import { SearchBar } from '../components/molecules/SearchBar';

<SearchBar 
  onSearch={handleSearch} 
  placeholder="Buscar documentos..." 
  debounceMs={300} 
/>
```

#### FormField
- **Propósito**: Campo de formulario con etiqueta y validación
- **Props**: `label`, `name`, `type`, `value`, `onChange`, `error`, `required`
- **Características**: Validación visual, etiquetas requeridas

```jsx
import { FormField } from '../components/molecules/FormField';

<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

### Organisms (Componentes Orgánicos)
Componentes complejos que combinan moléculas y átomos.

#### Header
- **Propósito**: Encabezado principal de la aplicación
- **Características**: Logo, navegación, información de usuario, logout
- **Integración**: Conectado con `useAuthStore`

```jsx
import { Header } from '../components/organisms/Header';

<Header />
```

### Templates (Plantillas)
Estructuras de página que definen el layout.

#### MainLayout
- **Propósito**: Layout principal de la aplicación
- **Características**: Header, contenido principal, responsive
- **Uso**: Envuelve páginas completas

```jsx
import { MainLayout } from '../components/templates/MainLayout';

<MainLayout>
  <YourPageContent />
</MainLayout>
```

### Pages (Páginas)
Componentes completos que representan páginas de la aplicación.

#### Dashboard
- **Propósito**: Página principal del dashboard
- **Características**: Métricas, actividad reciente, información de usuario
- **Integración**: Usa `MainLayout` y `useAuthStore`

```jsx
import { Dashboard } from '../components/pages/Dashboard';

<Dashboard />
```

## 🎨 Sistema de Diseño

### Colores
- **Primary**: Azul principal (#3B82F6)
- **Secondary**: Gris secundario (#6B7280)
- **Success**: Verde (#10B981)
- **Warning**: Amarillo (#F59E0B)
- **Error**: Rojo (#EF4444)

### Tipografía
- **Headings**: Font-semibold, diferentes tamaños
- **Body**: Text-sm para contenido regular
- **Captions**: Text-xs para información secundaria

### Espaciado
- **Grid**: Sistema de grid responsive
- **Gap**: Espaciado consistente entre elementos
- **Padding**: Padding uniforme en componentes

## 🔧 Hooks Personalizados

### useApi
- **Propósito**: Manejo centralizado de llamadas API
- **Retorna**: `data`, `loading`, `error`, `execute`, `post`, `put`, `delete`

```jsx
import { useApi } from '../hooks/useApi';

const { data, loading, error, execute } = useApi('/users');
```

### useLocalStorage
- **Propósito**: Manejo de localStorage con sincronización
- **Retorna**: `[storedValue, setValue]`

```jsx
import { useLocalStorage } from '../hooks/useLocalStorage';

const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### useDebounce
- **Propósito**: Debounce de valores para optimizar rendimiento
- **Retorna**: Valor debounced

```jsx
import { useDebounce } from '../hooks/useDebounce';

const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

## 📦 Stores (Estado Global)

### useAuthStore
- **Propósito**: Manejo de autenticación
- **Estado**: `user`, `token`, `isAuthenticated`, `loading`, `error`
- **Acciones**: `login`, `logout`, `register`, `verifyToken`

### useAppStore
- **Propósito**: Estado global de la aplicación
- **Estado**: `isLoading`, `error`, `notifications`
- **Acciones**: `setLoading`, `setError`, `addNotification`

## 🚀 Mejores Prácticas

### 1. Naming Conventions
- **Componentes**: PascalCase (ej: `Button`, `SearchBar`)
- **Hooks**: camelCase con prefijo `use` (ej: `useApi`, `useLocalStorage`)
- **Archivos**: kebab-case (ej: `search-bar.jsx`)

### 2. Props
- **Siempre usar PropTypes o JSDoc**
- **Props opcionales con valores por defecto**
- **Spread operator para props adicionales**

### 3. Performance
- **React.memo para componentes puros**
- **useCallback para funciones que se pasan como props**
- **useMemo para cálculos costosos**

### 4. Accesibilidad
- **Labels apropiados**
- **ARIA attributes cuando sea necesario**
- **Navegación por teclado**

### 5. Testing
- **Tests unitarios para componentes**
- **Tests de integración para flujos**
- **Tests E2E para casos críticos**

## 📝 Convenciones de Código

### Estructura de Archivos
```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── index.js
│   └── Input/
│       ├── Input.jsx
│       └── index.js
├── molecules/
├── organisms/
├── templates/
└── pages/
```

### Imports
```jsx
// ✅ Correcto
import { Button } from '../components/atoms/Button';
import { useApi } from '../hooks/useApi';

// ❌ Incorrecto
import Button from '../components/atoms/Button/Button.jsx';
```

### Exports
```jsx
// ✅ Correcto - index.js
export { Button } from './Button';

// ✅ Correcto - Componente
export const Button = React.memo(({ children, ...props }) => {
  // ...
});
```

## 🔄 Migración

### De Componentes Antiguos
1. **Identificar componentes grandes**
2. **Separar en átomos, moléculas, organismos**
3. **Extraer lógica a hooks personalizados**
4. **Implementar memoización**
5. **Agregar documentación**

### Checklist de Refactorización
- [ ] Componente < 50 líneas
- [ ] Props documentadas con JSDoc
- [ ] Hooks personalizados para lógica
- [ ] Tests unitarios
- [ ] Accesibilidad implementada
- [ ] Performance optimizada 