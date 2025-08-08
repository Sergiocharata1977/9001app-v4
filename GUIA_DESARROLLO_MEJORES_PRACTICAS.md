# 🛠️ GUÍA DE DESARROLLO - MEJORES PRÁCTICAS 9001APP2

## 📋 INTRODUCCIÓN

Esta guía consolida las mejores prácticas implementadas en el proyecto 9001APP2, incluyendo arquitectura, desarrollo y despliegue.

---

## 🏗️ ARQUITECTURA Y ESTRUCTURA

### **Principios de Diseño**
- **Separación clara:** Frontend y Backend independientes
- **Modularidad:** Componentes y servicios reutilizables  
- **Escalabilidad:** Preparado para crecimiento
- **Mantenibilidad:** Código limpio y documentado

### **Estructura de Directorios**
```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── forms/          # Formularios específicos
│   └── ui/             # Elementos de interfaz
├── pages/              # Páginas principales
├── services/           # Servicios de API
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y helpers
└── config/             # Configuraciones
```

---

## 🔧 DESARROLLO FRONTEND

### **Componentes React**
```javascript
// ✅ Buena práctica
import React, { memo } from 'react';

const MyComponent = memo(({ data, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{data.title}</h2>
      <button onClick={onAction} className="btn-primary">
        Acción
      </button>
    </div>
  );
});

export default MyComponent;
```

### **Servicios de API**
```javascript
// ✅ Estructura estándar de servicios
const departamentosService = {
  getAll: () => apiService.get('/departamentos'),
  getById: (id) => apiService.get(`/departamentos/${id}`),
  create: (data) => apiService.post('/departamentos', data),
  update: (id, data) => apiService.put(`/departamentos/${id}`, data),
  delete: (id) => apiService.delete(`/departamentos/${id}`)
};
```

### **Hooks Personalizados**
```javascript
// ✅ Hook para operaciones CRUD
const useDepartamentos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await departamentosService.getAll();
      setData(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
```

---

## ⚙️ DESARROLLO BACKEND

### **Estructura de Controladores**
```javascript
// ✅ Controlador estándar
const getDepartamentos = async (req, res) => {
  try {
    const departamentos = await departamentosService.getAll();
    res.status(200).json({
      success: true,
      data: departamentos
    });
  } catch (error) {
    console.error('Error en getDepartamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### **Middleware de Autenticación**
```javascript
// ✅ Middleware JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
```

### **Rutas RESTful**
```javascript
// ✅ Rutas estándar
router.get('/departamentos', authMiddleware, getDepartamentos);
router.get('/departamentos/:id', authMiddleware, getDepartamentoById);
router.post('/departamentos', authMiddleware, createDepartamento);
router.put('/departamentos/:id', authMiddleware, updateDepartamento);
router.delete('/departamentos/:id', authMiddleware, deleteDepartamento);
```

---

## 🎯 GESTIÓN DE ESTADO

### **Estado Local con useState**
```javascript
// ✅ Para estado simple
const [formData, setFormData] = useState({
  nombre: '',
  descripcion: ''
});
```

### **Estado Global con Context**
```javascript
// ✅ Para estado compartido
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### **React Query (Cuando esté activado)**
```javascript
// ✅ Para estado del servidor
const { data: departamentos, isLoading, error } = useQuery(
  ['departamentos'],
  departamentosService.getAll,
  {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  }
);
```

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### **Validación de Entrada**
```javascript
// ✅ Validación con esquemas
const departamentoSchema = {
  nombre: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  descripcion: {
    required: false,
    maxLength: 500
  }
};
```

### **Manejo de Tokens**
```javascript
// ✅ Almacenamiento seguro
const authService = {
  setToken: (token) => localStorage.setItem('auth_token', token),
  getToken: () => localStorage.getItem('auth_token'),
  removeToken: () => localStorage.removeItem('auth_token'),
  
  isValidToken: (token) => {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};
```

---

## 🚀 DESPLIEGUE Y DEVOPS

### **Flujo de Trabajo**
```
LOCAL DEVELOPMENT → GIT COMMIT → GITLAB PUSH → AUTO DEPLOY → PRODUCTION
```

### **Script de Despliegue**
```bash
# ✅ Script automático disponible
/root/deploy-9001app2.sh

# Proceso:
# 1. Git pull origin master
# 2. npm install (backend y frontend)
# 3. npm run build (frontend)
# 4. pm2 restart servicios
# 5. Health check automático
```

### **Variables de Entorno**
```bash
# ✅ Configuración segura
NODE_ENV=production
JWT_SECRET=your-secret-key
DATABASE_URL=your-database-url
API_BASE_URL=http://localhost:5000
```

---

## 🧪 TESTING

### **Tests Unitarios**
```javascript
// ✅ Estructura de test básica
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renderiza correctamente', () => {
    render(<MyComponent data={{ title: 'Test' }} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### **Tests de Integración**
```javascript
// ✅ Test de API
describe('API Departamentos', () => {
  test('GET /api/departamentos', async () => {
    const response = await request(app)
      .get('/api/departamentos')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

---

## 📊 OPTIMIZACIÓN Y RENDIMIENTO

### **Componentes Optimizados**
```javascript
// ✅ Usar React.memo para componentes pesados
const HeavyComponent = memo(({ data }) => {
  return <ExpensiveCalculation data={data} />;
});

// ✅ useCallback para funciones
const handleSubmit = useCallback((formData) => {
  onSubmit(formData);
}, [onSubmit]);

// ✅ useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### **Lazy Loading**
```javascript
// ✅ Carga perezosa de componentes
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

---

## 🛡️ MANEJO DE ERRORES

### **Manejo Global de Errores**
```javascript
// ✅ Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>;
    }
    return this.props.children;
  }
}
```

### **Manejo de Errores en Servicios**
```javascript
// ✅ Manejo consistente
const apiService = {
  async request(method, url, data = null) {
    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error de conexión';
      throw new Error(message);
    }
  }
};
```

---

## 📝 DOCUMENTACIÓN

### **Comentarios de Código**
```javascript
// ✅ Comentarios útiles
/**
 * Obtiene todos los departamentos activos
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<Array>} Lista de departamentos
 */
const getDepartamentos = async (filters = {}) => {
  // Implementación
};
```

### **Documentación de API**
```javascript
// ✅ Documentar endpoints
/**
 * @route   GET /api/departamentos
 * @desc    Obtener todos los departamentos
 * @access  Private
 * @param   {string} search - Búsqueda opcional
 * @returns {Object} { success: boolean, data: Array }
 */
```

---

## 🔄 CONTROL DE VERSIONES

### **Commits Descriptivos**
```bash
# ✅ Formato de commits
feat: agregar CRUD de departamentos
fix: corregir error de autenticación
docs: actualizar README con nuevas funcionalidades
refactor: optimizar componente de listado
```

### **Branching Strategy**
```
main/master    → Producción estable
develop        → Desarrollo en curso
feature/xxx    → Nuevas funcionalidades
hotfix/xxx     → Correcciones urgentes
```

---

## 📞 COMANDOS ÚTILES

### **Desarrollo**
```bash
# Frontend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview build

# Backend
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm test             # Tests
```

### **Despliegue**
```bash
# Servidor
pm2 status           # Estado servicios
pm2 logs             # Ver logs
pm2 restart all      # Reiniciar servicios
/root/deploy-9001app2.sh  # Despliegue automático
```

---

## 🎯 CHECKLIST DE CALIDAD

### **Antes de Commit**
- [ ] Código funciona localmente
- [ ] No hay errores en consola
- [ ] Tests pasan (cuando existan)
- [ ] Documentación actualizada
- [ ] Variables de entorno configuradas

### **Antes de Deploy**
- [ ] Build exitoso
- [ ] Health checks pasan
- [ ] Backup realizado
- [ ] Comunicación de mantenimiento (si necesario)

---

**Esta guía debe actualizarse conforme evoluciona el proyecto**

**Última actualización:** 2025-01-27
