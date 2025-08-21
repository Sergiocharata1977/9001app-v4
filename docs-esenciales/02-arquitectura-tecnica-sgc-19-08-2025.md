# 🏗️ 02 - Arquitectura Técnica - Sistema SGC
**📅 Última Actualización: 19-08-2025**

## 📁 Estructura del Proyecto

### Backend (`/backend`)
```
backend/
├── controllers/          # Lógica de negocio (MVC)
├── routes/              # Definición de endpoints API
├── middleware/          # Middleware personalizado
├── services/            # Servicios de negocio
├── database/            # Migraciones y esquemas DB
├── lib/                 # Utilidades y configuraciones
├── config/              # Configuraciones del sistema
├── uploads/             # Archivos subidos
├── tests/               # Pruebas unitarias e integración
└── RAG-Backend/         # Sistema de IA para asistencia
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/      # Componentes React organizados por módulo
│   ├── pages/          # Páginas principales de la aplicación
│   ├── hooks/          # Custom hooks personalizados
│   ├── services/       # Servicios de API y utilidades
│   ├── context/        # Contextos de React (Auth, Theme)
│   ├── routes/         # Configuración de rutas
│   ├── store/          # Estado global (Zustand)
│   ├── types/          # Definiciones TypeScript
│   └── utils/          # Utilidades y helpers
├── public/             # Archivos estáticos
└── cypress/            # Pruebas E2E
```

## 🔧 Stack Tecnológico

### Backend Stack
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express.js** | 4.18.0 | Framework web |
| **LibSQL** | 0.5.0 | Cliente de base de datos |
| **SQLite** | - | Base de datos local |
| **JWT** | 9.0.0 | Autenticación |
| **bcrypt** | 6.0.0 | Encriptación de contraseñas |
| **Multer** | 1.4.4 | Manejo de archivos |
| **Helmet** | 6.0.0 | Seguridad HTTP |
| **CORS** | 2.8.5 | Cross-origin requests |

### Frontend Stack
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.1.0 | Biblioteca de UI |
| **Vite** | 6.3.5 | Bundler y dev server |
| **TypeScript** | 5.9.2 | Tipado estático |
| **Tailwind CSS** | 3.4.17 | Framework CSS |
| **Radix UI** | - | Componentes accesibles |
| **Zustand** | 5.0.7 | Gestión de estado |
| **React Query** | 5.84.1 | Manejo de datos |
| **React Hook Form** | 7.48.2 | Formularios |
| **Zod** | 3.25.76 | Validación de esquemas |

## 🗄️ Arquitectura de Base de Datos

### Tablas Principales
```sql
-- Gestión de Personal
personal                    # Información del personal
departamentos              # Estructura organizacional
puestos                    # Cargos y responsabilidades
usuarios                   # Cuentas de usuario

-- Procesos SGC
procesos                   # Definición de procesos
documentos                 # Control documental
normas                     # Puntos de norma ISO
objetivos_calidad          # Objetivos y metas

-- Auditorías y Cumplimiento
auditorias                 # Auditorías internas/externas
hallazgos                  # Hallazgos de auditoría
acciones                   # Acciones correctivas/preventivas
verificaciones             # Verificaciones de cumplimiento

-- Indicadores y Mediciones
indicadores                # Definición de indicadores
mediciones                 # Datos de medición
```

### Sistema Estandarizado (Propuesto)
```sql
-- Tablas unificadas para relaciones
sgc_participantes          # Participantes de cualquier proceso
sgc_documentos_relacionados # Documentos relacionados
sgc_normas_relacionadas    # Cumplimiento de normas
relaciones_sgc             # Otras relaciones específicas
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. **Login:** Usuario envía credenciales
2. **Validación:** bcrypt verifica contraseña
3. **JWT:** Se genera token con claims del usuario
4. **Middleware:** Verifica token en requests protegidos
5. **Autorización:** Control de acceso basado en roles

### Roles del Sistema
- **Super Admin:** Acceso total al sistema
- **Admin:** Gestión de módulos específicos
- **Usuario:** Acceso a funcionalidades básicas
- **Auditor:** Acceso a módulos de auditoría

## 📡 API REST

### Estructura de Endpoints
```
/api/auth/                 # Autenticación
/api/admin/                # Funciones administrativas
/api/usuarios/             # Gestión de usuarios
/api/personal/             # Gestión de personal
/api/departamentos/        # Gestión de departamentos
/api/procesos/             # Gestión de procesos
/api/auditorias/           # Gestión de auditorías
/api/hallazgos/            # Gestión de hallazgos
/api/documentos/           # Gestión documental
/api/indicadores/          # Gestión de indicadores
```

### Patrones de Respuesta
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🎨 Arquitectura Frontend

### Patrón de Componentes
```
atoms/          # Componentes básicos (Button, Input)
molecules/      # Combinaciones de átomos
organisms/      # Componentes complejos
templates/      # Layouts y estructuras
pages/          # Páginas completas
```

### Gestión de Estado
- **Zustand:** Estado global de la aplicación
- **React Query:** Cache y sincronización de datos
- **Context:** Temas y autenticación
- **Local State:** Estado específico de componentes

### Routing
- **React Router DOM:** Navegación SPA
- **Protected Routes:** Rutas con autenticación
- **Lazy Loading:** Carga dinámica de componentes

## 🔄 Flujo de Datos

### Frontend → Backend
1. **Usuario interactúa** con componente React
2. **Hook personalizado** maneja la lógica de negocio
3. **Service layer** hace request a API
4. **Axios interceptor** agrega headers de autenticación
5. **Backend procesa** request y responde

### Backend → Database
1. **Controller** recibe request
2. **Service layer** aplica lógica de negocio
3. **Database queries** ejecutadas con LibSQL
4. **Response** formateada y enviada

## 🧪 Testing Strategy

### Backend Testing
- **Jest:** Framework de testing
- **Supertest:** Testing de APIs
- **Unit Tests:** Funciones individuales
- **Integration Tests:** Flujos completos

### Frontend Testing
- **Vitest:** Framework de testing
- **Cypress:** Testing E2E
- **Component Tests:** Testing de componentes
- **API Tests:** Testing de integración

## 🚀 Deployment

### Entorno de Desarrollo
- **Backend:** `npm run dev` (nodemon)
- **Frontend:** `npm run dev` (vite)
- **Database:** SQLite local

### Entorno de Producción
- **Backend:** Node.js con PM2
- **Frontend:** Build estático con Vite
- **Database:** Turso (LibSQL cloud)

## 📊 Monitoreo y Logging

### Logging
- **Console logging** para desarrollo
- **File logging** para producción
- **Error tracking** con try-catch

### Métricas
- **Performance:** Tiempo de respuesta
- **Errors:** Tasa de errores
- **Usage:** Métricas de uso

---

*Esta arquitectura proporciona una base sólida y escalable para el sistema SGC, permitiendo el crecimiento y evolución del sistema de manera controlada.*
