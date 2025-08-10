# 📋 GUÍA DEL PROYECTO 9001APP2

## 🚀 Resumen Ejecutivo

**Sistema de Gestión ISO 9001 Completo**  
- **Stack:** React + Vite + Node.js + Express + Turso DB  
- **Estado:** ✅ MVP Funcionando en Producción  
- **URLs Producción:**
<<<<<<< HEAD
  - Frontend: http://31.97.162.229:3000
=======
  - frontend: http://31.97.162.229:3000
>>>>>>> temp-branch
  - Backend: http://31.97.162.229:5000

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
<<<<<<< HEAD
- **Frontend:** React 19 + Vite + TailwindCSS + React Router + Zustand
=======
- **frontend:** React 19 + Vite + TailwindCSS + React Router + Zustand
>>>>>>> temp-branch
- **Backend:** Node.js + Express + JWT Auth + CommonJS
- **Base de Datos:** Turso (LibSQL) 
- **CI/CD:** GitLab CI → VPS Hostinger
- **Servidor:** PM2 + Nginx

### Estructura del Proyecto
```
9001app2/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── services/     # APIs y servicios
│   │   ├── store/        # Zustand stores
│   │   └── routes/       # Configuración de rutas
│   └── dist/            # Build de producción
├── backend/             # API REST
│   ├── controllers/     # Lógica de negocio
│   ├── routes/         # Endpoints API
│   ├── middleware/     # Middlewares personalizados
│   ├── services/       # Servicios de backend
│   └── tests/          # Tests de contrato
├── docs/               # Documentación centralizada
├── scripts/            # Smoke tests y utilidades
└── .gitlab-ci.yml      # Pipeline CI/CD
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Sistema Base
- **Autenticación completa:** Login/Register con JWT + Refresh Token
- **Landing Page:** Página principal responsive
- **API REST:** Endpoints CRUD funcionando
- **Base de Datos:** Conexión Turso operativa
- **Deploy Automático:** GitLab CI/CD configurado

### ✅ Módulos Principales
- **Personal:** Gestión de empleados y competencias
- **Departamentos:** Organización empresarial
- **Capacitaciones:** Sistema de formación
- **Documentos:** Gestión documental ISO
- **Auditorías:** Seguimiento y control
- **Mejoras:** Sistema de acciones correctivas

---

## 🛠️ Estándares de Desarrollo

### Backend (CommonJS)
```javascript
// ✅ CORRECTO - CommonJS para backend
const express = require('express');
const cors = require('cors');
module.exports = router;

// Estructura de controladores
const controllerName = {
  async getAll(req, res) {
    try {
      // Lógica aquí
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
```

<<<<<<< HEAD
### Frontend (ESM)
=======
### frontend (ESM)
>>>>>>> temp-branch
```javascript
// ✅ CORRECTO - ES Modules para frontend
import React, { memo } from 'react';
import { useStore } from '../store/authStore';

const Component = memo(({ data, onAction }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{data.title}</h2>
      <button onClick={onAction} className="btn-primary">
        Acción
      </button>
    </div>
  );
});

export default Component;
```

### Nomenclatura
- **Archivos:** kebab-case (`user-controller.js`)
- **Componentes:** PascalCase (`UserCard.jsx`)
- **Variables:** camelCase (`userData`)
- **Constantes:** UPPER_SNAKE_CASE (`API_URL`)

---

## 🔧 Configuración y Variables

### Variables de Entorno Backend
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

<<<<<<< HEAD
### Variables de Entorno Frontend
=======
### Variables de Entorno frontend
>>>>>>> temp-branch
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

---

## 🧪 Testing y Calidad

### Tests de Contrato API
- Verifican endpoints críticos: `/api/health`, `/api/auth/verify`, `/api/auth/refresh`
- Validan estructura de respuestas y códigos de estado
- Se ejecutan en CI antes del deploy

### Smoke Tests
- Verificación rápida de servicios en funcionamiento
<<<<<<< HEAD
- Frontend, Backend y endpoints críticos
=======
- frontend, Backend y endpoints críticos
>>>>>>> temp-branch
- Post-deploy validation

### Linting y Formateo
- **Backend:** ESLint + Prettier configurado para CommonJS
<<<<<<< HEAD
- **Frontend:** ESLint + Prettier configurado para ESM
=======
- **frontend:** ESLint + Prettier configurado para ESM
>>>>>>> temp-branch
- **Pre-commit hooks:** Husky + lint-staged ejecuta automáticamente

---

## 🚀 Deployment y CI/CD

### Pipeline GitLab CI
1. **Validate:** Linting backend y frontend
2. **Test:** Tests de contrato y unitarios
3. **Build:** Build del frontend
4. **Deploy:** Despliegue automático a servidor
5. **Smoke Test:** Verificación post-deploy

### Configuración Servidor
- **PM2:** Gestión de procesos Node.js
- **Nginx:** Proxy reverso + archivos estáticos
- **SSL:** Configurado para HTTPS
- **Logs:** Centralizados en `/var/log/pm2/`

---

## 🔍 Troubleshooting

### Problemas Comunes

**Error 404 en rutas frontend:**
- Verificar configuración nginx `try_files`
- Confirmar `@fallback` location para SPA

**Token refresh no funciona:**
- Verificar endpoint `/api/auth/refresh` en backend
- Confirmar `refreshAccessToken` en authStore
- Validar JWT_REFRESH_SECRET

**Build errors:**
- Verificar versión Node.js (usar .nvmrc)
- Limpiar cache: `rm -rf node_modules package-lock.json`
- Reinstalar: `npm install`

### Comandos Útiles
```bash
# Logs en producción
pm2 logs 9001app2-backend

# Reiniciar servicios
pm2 restart ecosystem.config.cjs
systemctl reload nginx

# Verificar estado
npm run smoke
curl -I http://localhost/api/health
```

---

## 📚 Recursos Adicionales

- **Documentación API:** Endpoints documentados en código
- **Componentes UI:** Storybook disponible en desarrollo
- **Base de Datos:** Schema documentado en `/database/`
- **Deploy Scripts:** Automatización en `scripts/`

Para más detalles técnicos, consultar el código fuente y comentarios inline.


