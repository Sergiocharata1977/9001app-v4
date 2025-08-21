# 🏗️ 08 - Estandarización de Componentes ABM y Estructura de Tablas
**📅 Última Actualización: 20-08-2025**

## 🎯 Visión General

Este documento establece las **normas de estandarización** para los componentes ABM (Altas, Bajas, Modificaciones) y la estructura de tablas en el Sistema SGC ISO 9001. Estas normas garantizan consistencia, mantenibilidad y escalabilidad en el desarrollo de componentes de gestión de datos.

## 📋 Estructura Estandarizada de Tablas

### 🗄️ Patrón Base de Tablas

Todas las tablas del sistema siguen una estructura estandarizada que incluye:

```sql
-- Campos obligatorios para todas las tablas
id                    # Identificador único (INTEGER PRIMARY KEY o TEXT)
organization_id       # Multi-tenancy (INTEGER)
created_at           # Fecha de creación (DATETIME/TEXT)
updated_at           # Fecha de última modificación (DATETIME/TEXT)

-- Campos específicos según el tipo de entidad
-- ... campos específicos de la entidad

-- Campos de auditoría (opcionales)
created_by           # Usuario que creó el registro (INTEGER)
updated_by           # Usuario que modificó el registro (INTEGER)
estado               # Estado del registro (TEXT)
```

### 🔗 Sistema de Relaciones Estandarizado

```sql
-- Tablas unificadas para relaciones (Propuesto)
sgc_participantes          # Participantes de cualquier proceso
sgc_documentos_relacionados # Documentos relacionados
sgc_normas_relacionadas    # Cumplimiento de normas
relaciones_sgc             # Otras relaciones específicas
```

## 🎨 Estandarización de Componentes ABM

### 📁 Estructura de Archivos

```
components/
├── [entidad]/
│   ├── [Entidad]Listing.jsx      # Componente principal de listado
│   ├── [Entidad]Card.jsx         # Tarjeta individual (opcional)
│   ├── [Entidad]Modal.jsx        # Modal para crear/editar
│   ├── [Entidad]TableView.jsx    # Vista de tabla (opcional)
│   └── [Entidad]Single.jsx       # Vista detallada individual
├── common/
│   ├── UnifiedHeader.jsx         # Header estandarizado
│   ├── UnifiedCard.jsx           # Tarjeta estandarizada
│   └── UnifiedTable.jsx          # Tabla estandarizada
```

### 🧩 Componentes Unificados

#### 1. **UnifiedHeader** - Header Estandarizado

**Propósito**: Header consistente para todos los módulos ABM

**Props Requeridas**:
```javascript
{
  title: string,                    // Título del módulo
  description: string,              // Descripción del módulo
  searchTerm: string,               // Término de búsqueda
  onSearchChange: function,         // Handler de búsqueda
  onNew: function,                  // Handler para nuevo registro
  onExport: function,               // Handler de exportación
  viewMode: 'grid' | 'list',        // Modo de vista
  onViewModeChange: function,       // Handler cambio de vista
  newButtonText: string,            // Texto del botón nuevo
  totalCount: number,               // Total de registros
  lastUpdated: string,              // Última actualización
  icon: Component,                  // Icono del módulo
  primaryColor: string              // Color primario
}
```

**Características**:
- Header con gradiente personalizable
- Barra de búsqueda integrada
- Controles de vista (grid/list)
- Botones de acción (nuevo, exportar)
- Contador de registros
- Indicador de última actualización

#### 2. **UnifiedCard** - Tarjeta Estandarizada

**Propósito**: Tarjeta consistente para mostrar registros

**Props Requeridas**:
```javascript
{
  title: string,                    // Título del registro
  subtitle: string,                 // Subtítulo (opcional)
  description: string,              // Descripción
  status: string,                   // Estado del registro
  fields: Array,                    // Campos adicionales
  onEdit: function,                 // Handler de edición
  onDelete: function,               // Handler de eliminación
  onView: function,                 // Handler de visualización
  icon: Component,                  // Icono
  primaryColor: string              // Color primario
}
```

**Estructura de Fields**:
```javascript
fields: [
  {
    icon: Component,    // Icono del campo
    label: string,      // Etiqueta del campo
    value: string       // Valor del campo
  }
]
```

**Características**:
- Header con gradiente y código
- Contenido estructurado
- Footer con acciones (Ver, Editar, Eliminar)
- Estados visuales consistentes
- Animaciones con Framer Motion

### 📊 Patrón de Componente Listing

#### Estructura Estándar

```javascript
const [entidad]Listing = () => {
  // Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Handlers estandarizados
  const handleOpenModal = (item = null) => { /* ... */ };
  const handleCloseModal = () => { /* ... */ };
  const handleSave = async (itemData) => { /* ... */ };
  const handleDelete = async (item) => { /* ... */ };
  const handleCardClick = (item) => { /* ... */ };
  const handleExport = () => { /* ... */ };

  // Filtrado
  const filteredData = data.filter(item => /* lógica de filtrado */);

  // Estadísticas
  const getStats = () => { /* ... */ };

  // Renderizado
  return (
    <div className="p-6 space-y-6">
      <UnifiedHeader /* props */ />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Cards de estadísticas */}
      </div>

      {/* Contenido */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Modal */}
      <[Entidad]Modal /* props */ />
    </div>
  );
};
```

#### ⚠️ **IMPORTANTE: Ubicación de Botones de Acción**

**Patrón Correcto (Seguir este patrón):**
- ✅ **Botón "Nuevo"**: En el `UnifiedHeader` (como en Personal y Puestos)
- ✅ **Botones de Acción**: Dentro de cada tarjeta/registro (Ver, Editar, Eliminar)
- ✅ **Botón "Exportar"**: En el `UnifiedHeader`

**Patrón Incorrecto (NO seguir):**
- ❌ **Botones de acción en el menú lateral**: Los botones como "Nuevo Cliente", "Lista de Clientes", etc. NO deben estar en el menú lateral
- ❌ **Acciones duplicadas**: No tener el mismo botón en múltiples lugares

**Ejemplo de Implementación Correcta:**
```javascript
// ✅ CORRECTO - En UnifiedHeader
<UnifiedHeader
  title="Gestión de Clientes"
  description="Administra la base de datos de clientes"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onNew={() => handleOpenModal()}  // ← Botón "Nuevo" aquí
  onExport={handleExport}          // ← Botón "Exportar" aquí
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  newButtonText="Nuevo Cliente"    // ← Texto del botón
  totalCount={clientes.length}
  lastUpdated="hoy"
  icon={Users}
  primaryColor="slate"
/>

// ✅ CORRECTO - En cada tarjeta
<UnifiedCard
  title={cliente.nombre}
  description={cliente.descripcion}
  onView={() => handleCardClick(cliente)}    // ← Ver
  onEdit={() => handleOpenModal(cliente)}    // ← Editar
  onDelete={() => handleDelete(cliente)}     // ← Eliminar
  // ... otros props
/>
```

#### Funciones Estandarizadas

1. **fetchData()**: Carga de datos desde API
2. **handleOpenModal()**: Apertura de modal para crear/editar
3. **handleSave()**: Guardado de datos (crear/actualizar)
4. **handleDelete()**: Eliminación con confirmación
5. **handleCardClick()**: Navegación a vista detallada
6. **handleExport()**: Exportación de datos
7. **getStats()**: Cálculo de estadísticas
8. **renderGridView()**: Vista en cuadrícula
9. **renderListView()**: Vista en lista

### 🎨 Sistema de Colores Estandarizado

#### Paleta de Colores por Módulo

```javascript
const colorSchemes = {
  emerald: {  // Personal, Recursos Humanos
    gradient: 'from-emerald-500 to-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconColor: 'text-emerald-500',
    viewButton: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
  },
  blue: {     // Procesos, Documentos
    gradient: 'from-blue-500 to-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-500',
    viewButton: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
  },
  purple: {   // Auditorías, Hallazgos
    gradient: 'from-purple-500 to-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    iconColor: 'text-purple-500',
    viewButton: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
  },
  orange: {   // Acciones, Mejoras
    gradient: 'from-orange-500 to-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-500',
    viewButton: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
  },
  slate: {    // CRM, Configuración
    gradient: 'from-slate-500 to-slate-600',
    button: 'bg-slate-600 hover:bg-slate-700 text-white',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    iconColor: 'text-slate-500',
    viewButton: 'text-slate-600 hover:text-slate-700 hover:bg-slate-50'
  }
};
```

#### Estados Visuales Estandarizados

```javascript
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'activo':
    case 'completado':
    case 'completada':
    case 'excelente':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'en_proceso':
    case 'en progreso':
    case 'pendiente':
    case 'bueno':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelado':
    case 'cancelada':
    case 'inactivo':
    case 'regular':
    case 'necesita mejora':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
```

## 🔧 Patrones de Implementación

### 1. **Patrón de Servicios**

```javascript
// services/[entidad]Service.js
class [Entidad]Service {
  static async getAll[Entidad]() { /* ... */ }
  static async get[Entidad]ById(id) { /* ... */ }
  static async create[Entidad](data) { /* ... */ }
  static async update[Entidad](id, data) { /* ... */ }
  static async delete[Entidad](id) { /* ... */ }
  static async export[Entidad]() { /* ... */ }
}
```

### 2. **Patrón de Validación**

```javascript
// schemas/[entidad]Schemas.js
import { z } from 'zod';

export const [entidad]Schema = z.object({
  // Campos específicos de la entidad
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  estado: z.enum(['activo', 'inactivo']).default('activo'),
  // ... otros campos
});
```

### 3. **Patrón de Estados**

```javascript
// Estados estandarizados para todas las entidades
const estados = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
  completado: 'Completado',
  cancelado: 'Cancelado'
};
```

## 📱 Responsive Design Estandarizado

### Breakpoints

```css
/* Grid responsive estandarizado */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Espaciado estandarizado */
.p-6 space-y-6
.gap-4 md:gap-6
```

### Modos de Vista

1. **Grid View**: Vista en cuadrícula para pantallas grandes
2. **List View**: Vista en lista para pantallas pequeñas
3. **Table View**: Vista de tabla para datos complejos

## 🔄 Flujo de Datos Estandarizado

### 1. **Carga de Datos**
```javascript
useEffect(() => {
  fetchData();
}, []);
```

### 2. **Gestión de Estados**
```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState([]);
```

### 3. **Manejo de Errores**
```javascript
try {
  // Operación
} catch (error) {
  console.error('Error:', error);
  toast({ 
    variant: "destructive", 
    title: "Error", 
    description: "Mensaje de error" 
  });
}
```

### 4. **Feedback al Usuario**
```javascript
// Toast notifications estandarizadas
toast({ title: "Éxito", description: "Operación completada" });
toast({ variant: "destructive", title: "Error", description: "Error en operación" });
```

## 📊 Componentes de Mejoras (Workflow)

### Estructura de Workflow

```javascript
// Componentes de workflow estandarizados
- WorkflowStepper.jsx      # Stepper de etapas
- WorkflowState.jsx        # Estado del workflow
- WorkflowStage.jsx        # Etapa individual
- TiemposWorkflow.jsx      # Control de tiempos
- KanbanBoard.jsx          # Tablero Kanban
- KanbanColumn.jsx         # Columna Kanban
- KanbanCard.jsx           # Tarjeta Kanban
```

### Patrón de Workflow

```javascript
const stages = [
  { id: 'deteccion', name: 'Detección', color: 'purple' },
  { id: 'analisis', name: 'Análisis', color: 'blue' },
  { id: 'planificacion', name: 'Planificación', color: 'orange' },
  { id: 'ejecucion', name: 'Ejecución', color: 'green' },
  { id: 'verificacion', name: 'Verificación', color: 'teal' },
  { id: 'cierre', name: 'Cierre', color: 'gray' }
];
```

## 🧪 Testing Estandarizado

### Estructura de Tests

```javascript
// tests/[entidad].test.js
describe('[Entidad] Component', () => {
  test('should render correctly', () => { /* ... */ });
  test('should handle create', () => { /* ... */ });
  test('should handle update', () => { /* ... */ });
  test('should handle delete', () => { /* ... */ });
  test('should handle search', () => { /* ... */ });
});
```

## 📋 Checklist de Implementación

### ✅ Para Nuevos Componentes ABM

- [ ] Crear estructura de archivos estandarizada
- [ ] Implementar UnifiedHeader con props correctas
- [ ] Implementar UnifiedCard con estructura de fields
- [ ] Crear servicio con métodos CRUD
- [ ] Implementar validación con Zod
- [ ] Agregar manejo de errores estandarizado
- [ ] Implementar responsive design
- [ ] Agregar estadísticas del módulo
- [ ] Implementar exportación de datos
- [ ] Crear tests unitarios
- [ ] Documentar el componente

### ✅ Para Nuevas Tablas

- [ ] Incluir campos obligatorios (id, organization_id, created_at, updated_at)
- [ ] Definir relaciones con otras tablas
- [ ] Crear índices apropiados
- [ ] Implementar constraints de integridad
- [ ] Documentar la estructura
- [ ] Crear migraciones

## 🎯 Beneficios de la Estandarización

1. **Consistencia**: Interfaz uniforme en todo el sistema
2. **Mantenibilidad**: Código fácil de mantener y actualizar
3. **Escalabilidad**: Fácil agregar nuevos módulos
4. **Reutilización**: Componentes reutilizables
5. **Calidad**: Menos errores y mejor testing
6. **Productividad**: Desarrollo más rápido
7. **Experiencia de Usuario**: Navegación intuitiva

---

*Esta estandarización garantiza que todos los componentes ABM del sistema SGC sigan las mismas normas y patrones, proporcionando una experiencia de usuario consistente y un código mantenible.*

**📅 Versión**: 1.0  
**👥 Responsable**: Equipo de Desarrollo SGC  
**�� Revisión**: Anual
