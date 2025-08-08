# 🚀 PROYECTO 9001APP2 - GUÍA COMPLETA

## 📋 RESUMEN EJECUTIVO

**Proyecto:** Sistema de Gestión ISO 9001 Completo  
**Tecnologías:** React + Vite + Node.js + Express + Turso DB  
**Estado:** ✅ MVP Funcionando en Producción  
**URLs:**
- Frontend: http://31.97.162.229:3000
- Backend: http://31.97.162.229:5000

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### **Stack Tecnológico**
- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express + JWT Auth
- **Base de Datos:** Turso (libsql)
- **Despliegue:** GitLab → VPS Hostinger
- **Servidor:** PM2 + Nginx

### **Estructura del Proyecto**
```
9001app2/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── routes/
│   └── dist/          # Build para producción
├── backend/           # Node.js + Express
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── services/
└── deploy-9001app2.sh # Script de despliegue automático
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **Sistema Base Funcionando**
- **Autenticación:** Login/Register con JWT
- **Landing Page:** Página principal con navegación
- **API REST:** Endpoints básicos funcionando
- **Base de Datos:** Conexión a Turso operativa
- **Despliegue:** Automático desde GitLab

### ✅ **Módulos Principales**
- **Autenticación:** Login, registro, verificación de tokens
- **Dashboard:** Panel principal (en desarrollo)
- **Personal:** Gestión de empleados
- **Departamentos:** CRUD básico
- **Documentación:** Sistema de documentos ISO

### ✅ **Mejoras de Arquitectura**
- **Manejo de errores centralizado**
- **Sistema de toasts estandarizado**
- **React Query para estado del servidor**
- **Componentes optimizados con React.memo**
- **Hooks personalizados para operaciones comunes**

---

## 🚀 DESPLIEGUE AUTOMÁTICO

### **Script de Despliegue (`deploy-9001app2.sh`)**
```bash
# Ejecutar despliegue automático
/root/deploy-9001app2.sh
```

**Proceso automático:**
1. 📥 Descargar cambios del repositorio GitLab
2. 🔧 Instalar dependencias backend y frontend  
3. 🏗️ Construir frontend optimizado
4. 🔄 Reiniciar servicios PM2
5. 🏥 Verificar salud del sistema
6. ✅ Confirmar despliegue exitoso

### **URLs de Verificación**
```bash
# Frontend
curl http://31.97.162.229:3000

# Backend Health Check
curl http://31.97.162.229:5000/api/health

# PM2 Status
pm2 status
```

---

## 🔧 DESARROLLO LOCAL

### **Configuración Inicial**
```bash
# Backend
cd backend
npm install
npm run dev  # Puerto 5000

# Frontend
cd frontend
npm install
npm run dev  # Puerto 3000
```

### **Variables de Entorno**
```bash
# backend/.env
DATABASE_URL=your-turso-url
DATABASE_AUTH_TOKEN=your-turso-token
JWT_SECRET=your-jwt-secret
```

---

## 🛡️ SISTEMAS DE SEGURIDAD

### **Control de Funcionalidades**
El proyecto incluye un sistema para activar/desactivar funcionalidades:

```bash
# Ver estado actual
node scripts/toggle-security-systems.js --status

# Modo desarrollo (todas las funcionalidades)
node scripts/toggle-security-systems.js --mode=development

# Modo despliegue (funcionalidades básicas)
node scripts/toggle-security-systems.js --mode=deployment
```

### **Funcionalidades Controladas**
- ❌ Manejo de errores centralizado
- ❌ Estandarización de toast
- ❌ React Query
- ❌ Paginación optimizada  
- ❌ React.memo
- ❌ Hooks de optimización

**Estado actual:** Todas desactivadas para estabilidad del despliegue

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ **Completado y Funcionando**
- **Frontend:** Landing page y navegación básica
- **Backend:** API REST con autenticación
- **Base de datos:** Conexión estable a Turso
- **Despliegue:** Script automático funcionando
- **Servidor:** PM2 gestionando servicios

### 🔄 **En Desarrollo**
- **Dashboard principal:** Panel de métricas y resumen
- **Menú lateral:** Navegación completa del sistema
- **ABM Departamentos:** CRUD completo como piloto
- **Autenticación avanzada:** Rutas protegidas

### ⏳ **Planificado**
- **Todos los módulos ABM:** Personal, Documentos, Auditorías
- **Reportes y métricas:** Dashboard con indicadores
- **Optimizaciones:** React Query y mejoras de rendimiento

---

## 🎯 PRÓXIMOS PASOS PRIORITARIOS

### **Esta Semana**
1. **Completar webhook automático** para despliegue desde GitLab
2. **Implementar menú lateral** y navegación principal
3. **Finalizar autenticación** con rutas protegidas

### **Siguientes 2 Semanas**
1. **ABM Departamentos completo** como piloto
2. **Dashboard con métricas básicas**
3. **Optimizaciones de rendimiento**

### **Mediano Plazo**
1. **Replicar patrón ABM** a otros módulos
2. **Sistema de permisos y roles**
3. **Reportes avanzados**

---

## 🔧 COMANDOS ÚTILES

### **Despliegue y Mantenimiento**
```bash
# Desplegar cambios
/root/deploy-9001app2.sh

# Ver logs de despliegue
tail -f /var/log/9001app2-deploy.log

# Estado de servicios
pm2 status
pm2 logs 9001app2-backend --lines 20

# Reiniciar servicios manualmente
pm2 restart 9001app2-backend
pm2 restart 9001app2-frontend
```

### **Desarrollo Local**
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 📞 CONTACTO Y SOPORTE

### **Problemas Comunes**
1. **Error 404/401:** Verificar autenticación y rutas del backend
2. **Frontend no carga:** Verificar build y nginx configuración
3. **Backend no responde:** Revisar PM2 y logs de errores

### **Logs Importantes**
- **Despliegue:** `/var/log/9001app2-deploy.log`
- **Backend:** `pm2 logs 9001app2-backend`
- **Frontend:** `pm2 logs 9001app2-frontend`

---

**Última actualización:** 2025-01-27  
**Versión:** 2.0.0  
**Estado:** ✅ Sistema estable en producción con despliegue automático funcionando
