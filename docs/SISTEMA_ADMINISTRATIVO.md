# 🏛️ Sistema Administrativo - ISOFlow4

## 📋 Resumen Ejecutivo

El sistema administrativo de 9001 App proporciona dos niveles de administración:

1. **Super Administrador** - Gestión global multi-tenant
2. **Administrador de Organización** - Gestión local de su organización

## 🎯 Funcionalidades Implementadas

### ✅ Super Administrador (`super_admin`)

#### **Gestión de Organizaciones**
- ✅ Crear, editar y eliminar organizaciones
- ✅ Configurar planes (Básico, Premium, Empresarial)
- ✅ Activar/desactivar organizaciones
- ✅ Ver estadísticas globales

#### **Gestión Global de Usuarios**
- ✅ Crear usuarios en cualquier organización
- ✅ Asignar roles (super_admin, admin, manager, employee)
- ✅ Editar y eliminar usuarios globalmente
- ✅ Ver todos los usuarios del sistema

#### **Dashboard y Monitoreo**
- ✅ Estadísticas globales del sistema
- ✅ Actividad reciente
- ✅ Métricas de organizaciones y usuarios
- ✅ Monitoreo de sesiones activas

### ✅ Administrador de Organización (`admin`)

#### **Gestión de Usuarios de su Organización**
- ✅ Crear usuarios solo en su organización
- ✅ Asignar roles (admin, manager, employee)
- ✅ Editar y eliminar usuarios de su organización
- ✅ Ver usuarios de su organización

#### **Configuración de Organización**
- ✅ Editar información de la organización
- ✅ Cambiar plan de suscripción
- ✅ Configurar datos de contacto

#### **Dashboard Local**
- ✅ Estadísticas de su organización
- ✅ Actividad reciente de su organización
- ✅ Métricas de usuarios locales

## 🏗️ Arquitectura Técnica

### **Backend (Node.js + Express)**

#### **Controladores**
```javascript
// adminController.js - Funciones principales
- getAllOrganizations()     // Super Admin
- createOrganization()      // Super Admin
- updateOrganization()      // Super Admin
- getAllUsers()            // Super Admin
- createUser()             // Super Admin
- updateUser()             // Super Admin
- deleteUser()             // Super Admin
- getOrganizationUsers()   // Admin Org
- createOrganizationUser() // Admin Org
- updateOrganizationUser() // Admin Org
- deleteOrganizationUser() // Admin Org
```

#### **Rutas API**
```javascript
// admin.routes.js
POST   /api/admin/organizations           // Crear organización
GET    /api/admin/organizations           // Listar organizaciones
PUT    /api/admin/organizations/:id       // Actualizar organización
GET    /api/admin/organizations/:id       // Obtener organización

POST   /api/admin/users                   // Crear usuario global
GET    /api/admin/users                   // Listar usuarios globales
PUT    /api/admin/users/:id               // Actualizar usuario global
DELETE /api/admin/users/:id               // Eliminar usuario global

GET    /api/admin/organization/:id/users  // Usuarios de organización
POST   /api/admin/organization/:id/users  // Crear usuario en organización
PUT    /api/admin/organization/:id/users/:userId  // Actualizar usuario org
DELETE /api/admin/organization/:id/users/:userId  // Eliminar usuario org
```

#### **Middleware de Autorización**
```javascript
// Verificación de roles
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de Super Administrador'
    });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!['super_admin', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de Administrador'
    });
  }
  next();
};
```

### **Frontend (React + Vite)**

#### **Componentes Principales**
```javascript
// SuperAdminPanel.jsx - Panel principal super admin
- Dashboard con estadísticas globales
- Gestión de organizaciones
- Gestión global de usuarios
- Monitoreo del sistema

// OrganizationAdminPanel.jsx - Panel admin organización
- Dashboard local
- Gestión de usuarios de la organización
- Configuración de la organización
- Actividad reciente

// UserModal.jsx - Modal para crear/editar usuarios
- Funciona para ambos tipos de admin
- Validación de roles según tipo de admin
- Generación automática de contraseñas

// OrganizationModal.jsx - Modal para organizaciones
- Crear y editar organizaciones
- Configuración de planes
- Validación de datos
```

#### **Servicios API**
```javascript
// adminService.js
export const adminService = {
  // Super Admin functions
  getAllOrganizations: () => apiService.get('/admin/organizations'),
  createOrganization: (data) => apiService.post('/admin/organizations', data),
  updateOrganization: (id, data) => apiService.put(`/admin/organizations/${id}`, data),
  getAllUsers: () => apiService.get('/admin/users'),
  createUser: (data) => apiService.post('/admin/users', data),
  updateUser: (id, data) => apiService.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiService.delete(`/admin/users/${id}`),

  // Organization Admin functions
  getOrganizationUsers: (orgId) => apiService.get(`/admin/organization/${orgId}/users`),
  createOrganizationUser: (orgId, data) => apiService.post(`/admin/organization/${orgId}/users`, data),
  updateOrganizationUser: (orgId, userId, data) => apiService.put(`/admin/organization/${orgId}/users/${userId}`, data),
  deleteOrganizationUser: (orgId, userId) => apiService.delete(`/admin/organization/${orgId}/users/${userId}`)
};
```

#### **Protección de Rutas**
```javascript
// ProtectedRoute.jsx
const SuperAdminRoute = ({ children }) => {
  // Solo permite acceso a super_admin
};

const OrganizationAdminRoute = ({ children }) => {
  // Permite acceso a super_admin y admin
};
```

## 🔐 Sistema de Roles y Permisos

### **Jerarquía de Roles**
```
super_admin (Super Administrador)
├── Acceso completo al sistema
├── Gestión de todas las organizaciones
├── Crear super admins y admins
└── Configuración global

admin (Administrador de Organización)
├── Gestión de su organización
├── Crear managers y employees
├── Configuración local
└── Reportes de su organización

manager (Gerente)
├── Supervisar procesos de su área
├── Gestionar personal asignado
└── Aprobar acciones y hallazgos

employee (Empleado)
├── Acceso a módulos asignados
├── Crear y gestionar registros
└── Ver reportes de su área
```

### **Matriz de Permisos**
| Acción | super_admin | admin | manager | employee |
|--------|-------------|-------|---------|----------|
| Crear organizaciones | ✅ | ❌ | ❌ | ❌ |
| Editar organizaciones | ✅ | ✅ (solo suya) | ❌ | ❌ |
| Crear super admins | ✅ | ❌ | ❌ | ❌ |
| Crear admins | ✅ | ✅ | ❌ | ❌ |
| Crear managers | ✅ | ✅ | ❌ | ❌ |
| Crear employees | ✅ | ✅ | ❌ | ❌ |
| Ver usuarios globales | ✅ | ❌ | ❌ | ❌ |
| Ver usuarios organización | ✅ | ✅ | ❌ | ❌ |
| Configuración global | ✅ | ❌ | ❌ | ❌ |
| Configuración local | ✅ | ✅ | ❌ | ❌ |

## 🚀 Scripts de Configuración

### **Crear Usuarios Administrativos**
```bash
# Crear super admin
cd backend
node scripts/create-admin-user.js

# Crear admin de organización
node scripts/create-org-admin-user.js

# Crear ambos usuarios
node scripts/setup-admin-users.js
```

### **Credenciales por Defecto**
```
Super Administrador:
- Email: admin@demo.com
- Password: admin123
- Role: super_admin
- Organización: ID 21

Administrador de Organización:
- Email: orgadmin@demo.com
- Password: orgadmin123
- Role: admin
- Organización: ID 21
```

## 📊 Dashboard y Métricas

### **Super Admin Dashboard**
- **Organizaciones**: Total y activas
- **Usuarios**: Total y activos por organización
- **Tasa de Actividad**: Porcentaje de usuarios activos
- **Sesiones Activas**: En tiempo real
- **Actividad Reciente**: Logs del sistema

### **Admin Organización Dashboard**
- **Usuarios**: Total y activos en su organización
- **Tasa de Actividad**: Porcentaje de usuarios activos
- **Actividad Reciente**: Logs de su organización
- **Configuración**: Datos de su organización

## 🔧 Configuración y Variables

### **Variables de Entorno Backend**
```bash
# Base de datos
DATABASE_URL=libsql://tu_base_datos
DATABASE_AUTH_TOKEN=tu_token_turso

# JWT
JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
JWT_REFRESH_SECRET=tu_jwt_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

### **Variables de Entorno Frontend**
```bash
# API
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Auth
VITE_AUTH_TOKEN_KEY=iso_auth_token
VITE_AUTH_REFRESH_KEY=iso_refresh_token

# App
VITE_APP_NAME="ISOFlow4"
VITE_ENABLE_RAG=true
```

## 🧪 Testing y Validación

### **Endpoints Críticos**
```bash
# Verificar autenticación
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"

# Verificar permisos super admin
curl -X GET http://localhost:5000/api/admin/organizations \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"

# Verificar permisos admin organización
curl -X GET http://localhost:5000/api/admin/organization/21/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### **Validaciones de Seguridad**
- ✅ Verificación de roles en middleware
- ✅ Validación de organización en admin de org
- ✅ Protección de rutas por rol
- ✅ Validación de datos en frontend y backend
- ✅ Sanitización de inputs

## 📱 Interfaz de Usuario

### **Navegación**
```javascript
// Menú lateral - Sección Administración
{
  id: 'administracion',
  name: 'Administración',
  icon: Settings,
  items: [
    { 
      name: 'Super Administrador', 
      path: '/app/admin/super', 
      role: 'super_admin',
      show: () => user?.role === 'super_admin'
    },
    { 
      name: 'Admin de Organización', 
      path: '/app/admin/organization', 
      role: 'admin',
      show: () => ['admin', 'super_admin'].includes(user?.role)
    }
  ]
}
```

### **URLs de Acceso**
- **Super Admin**: `/app/admin/super`
- **Admin Organización**: `/app/admin/organization`
- **Documentación Técnica**: `/app/documentacion/administracion`

## 🔄 Flujos de Trabajo

### **Crear Nueva Organización (Super Admin)**
1. Ir a `/app/admin/super`
2. Pestaña "Organizaciones"
3. Click "Nueva Organización"
4. Llenar formulario (nombre, email, plan)
5. Guardar organización
6. Crear admin para la organización

### **Gestionar Usuarios (Admin Org)**
1. Ir a `/app/admin/organization`
2. Pestaña "Usuarios"
3. Click "Nuevo Usuario"
4. Llenar formulario (nombre, email, rol)
5. Generar contraseña automática
6. Guardar usuario

### **Configurar Organización (Admin Org)**
1. Ir a `/app/admin/organization`
2. Pestaña "Configuración"
3. Editar datos de la organización
4. Cambiar plan si es necesario
5. Guardar cambios

## 🚨 Troubleshooting

### **Problemas Comunes**

#### **Error 403 - Acceso Denegado**
```bash
# Verificar rol del usuario
console.log(authStore.getUserRole());

# Verificar token válido
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"
```

#### **Error al Crear Usuario**
```bash
# Verificar que el email no existe
SELECT * FROM usuarios WHERE email = 'email@ejemplo.com';

# Verificar organización existe
SELECT * FROM organizations WHERE id = 21;
```

#### **Error de Conexión a Base de Datos**
```bash
# Verificar variables de entorno
echo $DATABASE_URL
echo $DATABASE_AUTH_TOKEN

# Probar conexión
node backend/scripts/test-db-connection.js
```

### **Logs y Debugging**
```bash
# Ver logs del backend
pm2 logs 9001app2-backend

# Ver logs del frontend
npm run dev

# Verificar estado de servicios
pm2 status
systemctl status nginx
```

## 📈 Roadmap y Mejoras Futuras

### **Fase 1 - Completado ✅**
- [x] Sistema de roles y permisos
- [x] CRUD de organizaciones
- [x] CRUD de usuarios
- [x] Dashboard administrativo
- [x] Protección de rutas
- [x] Scripts de configuración

### **Fase 2 - En Desarrollo 🔄**
- [ ] Sistema de logs detallado
- [ ] Auditoría de acciones administrativas
- [ ] Backup automático de configuraciones
- [ ] Notificaciones por email
- [ ] Reportes avanzados

### **Fase 3 - Planificado 📋**
- [ ] Gestión de features por organización
- [ ] Sistema de suscripciones
- [ ] Métricas avanzadas
- [ ] API para integraciones
- [ ] Panel de monitoreo en tiempo real

## 📞 Soporte y Contacto

Para soporte técnico del sistema administrativo:
- **Documentación**: `/app/documentacion/administracion`
- **Logs**: `/var/log/pm2/`
- **Configuración**: `backend/.env.local`

---

**Fecha de última actualización**: 11/08/2024  
**Versión**: 1.0.0  
**Estado**: Funcional en Producción
