# 🧠 RAG-Frontend - Módulo de Inteligencia Artificial

## 📋 Descripción

Módulo independiente de interfaz de usuario para el sistema RAG (Retrieval-Augmented Generation) de ISOFlow3. Este módulo proporciona una interfaz moderna y intuitiva para realizar consultas inteligentes sobre la documentación y datos del sistema ISO 9001.

## 🏗️ Arquitectura

```
RAG-Frontend/
├── components/          # Componentes React RAG
├── context/            # Contexto RAG
├── hooks/              # Hooks personalizados RAG
├── services/           # Servicios API RAG
├── utils/              # Utilidades RAG
├── styles/             # Estilos específicos RAG
├── tests/              # Tests del módulo
└── docs/               # Documentación técnica
```

## 🚀 Características

- ✅ **Chat Interface**: Interfaz de chat moderna y responsive
- ✅ **Búsqueda Semántica**: Consultas inteligentes con autocompletado
- ✅ **Sugerencias**: Preguntas frecuentes y sugerencias contextuales
- ✅ **Trazabilidad**: Visualización de fuentes y metadatos
- ✅ **Activación/Desactivación**: Control granular del módulo
- ✅ **Historial**: Consultas anteriores y respuestas
- ✅ **Responsive**: Diseño adaptativo para todos los dispositivos

## 🔧 Tecnologías

- **React 18**: Framework principal
- **TypeScript**: Tipado estático
- **TailwindCSS**: Estilos y diseño
- **Framer Motion**: Animaciones
- **React Query**: Gestión de estado
- **Lucide React**: Iconografía

## 📦 Instalación

```bash
# Instalar dependencias RAG Frontend
npm install @tanstack/react-query framer-motion lucide-react
```

## ⚙️ Configuración

```javascript
// Configuración RAG en el contexto
const RAGConfig = {
  enabled: true,
  apiEndpoint: '/api/rag',
  maxSuggestions: 5,
  autoComplete: true,
  showSources: true
};
```

## 🎯 Uso

### Componente Principal
```jsx
import { RAGProvider } from './context/RAGContext';
import { RAGChatInterface } from './components/RAGChatInterface';

function App() {
  return (
    <RAGProvider>
      <RAGChatInterface />
    </RAGProvider>
  );
}
```

### Activación/Desactivación
```jsx
import { RAGToggle } from './components/RAGToggle';

<RAGToggle 
  isEnabled={ragEnabled}
  onToggle={handleRAGToggle}
  organizationId={currentOrg}
/>
```

## 🎨 Componentes Principales

### 1. RAGChatInterface
Interfaz principal de chat con búsqueda semántica y generación de respuestas.

### 2. RAGToggle
Componente para activar/desactivar el módulo RAG por organización.

### 3. QuerySuggestions
Sugerencias de preguntas frecuentes y autocompletado.

### 4. SourceDisplay
Visualización de fuentes y metadatos de las respuestas.

### 5. RAGHistory
Historial de consultas y respuestas anteriores.

## 🔒 Seguridad

- Validación de inputs
- Sanitización de contenido
- Control de acceso por roles
- Rate limiting en frontend
- Logging de auditoría

## 📊 Estado del Módulo

- [x] Arquitectura definida
- [x] Estructura de archivos
- [ ] Implementación de componentes
- [ ] Tests unitarios
- [ ] Integración con sistema principal
- [ ] Despliegue en producción

## 🎨 Diseño UI/UX

### Paleta de Colores
```css
:root {
  --rag-primary: #3b82f6;
  --rag-secondary: #1e40af;
  --rag-accent: #60a5fa;
  --rag-success: #10b981;
  --rag-warning: #f59e0b;
  --rag-error: #ef4444;
  --rag-background: #f8fafc;
  --rag-surface: #ffffff;
  --rag-text: #1f2937;
}
```

### Tipografía
- **Títulos**: Inter, sans-serif
- **Cuerpo**: Inter, sans-serif
- **Monospace**: JetBrains Mono

### Espaciado
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- Chat interface colapsable en móvil
- Sugerencias en modal en pantallas pequeñas
- Fuentes escalables según dispositivo

## 🧪 Testing

### Tests Unitarios
```bash
npm run test:rag
```

### Tests de Integración
```bash
npm run test:rag:integration
```

### Tests E2E
```bash
npm run test:rag:e2e
```

## 📈 Métricas

### Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Usabilidad
- **Tiempo de respuesta**: < 3s
- **Precisión de búsqueda**: > 85%
- **Satisfacción de usuario**: > 4.5/5

---

**Nota**: Este módulo está diseñado para ser completamente independiente y puede activarse/desactivarse sin afectar el funcionamiento del sistema principal. 