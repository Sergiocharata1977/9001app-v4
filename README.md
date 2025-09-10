# 🏢 ISO 9001 - Sistema de Gestión de Calidad

Sistema completo de gestión de calidad ISO 9001 desarrollado con **React + TypeScript + Node.js + MongoDB**.

## 🎯 Características Principales

- ✅ **Sistema Multi-tenant** (múltiples organizaciones)
- ✅ **Autenticación JWT** robusta
- ✅ **Módulos RRHH** completos
- ✅ **Frontend React** con TypeScript ES6
- ✅ **Backend Node.js** con Express
- ✅ **Base de datos MongoDB** Atlas
- ✅ **Diseño responsive** con Tailwind CSS

## 📁 Estructura del Proyecto

```
9001app-v4/
├── backend/                 # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── modules/        # Módulos por funcionalidad
│   │   ├── middleware/     # Middlewares
│   │   └── config/         # Configuración
│   └── README.md
├── frontend/               # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Servicios API
│   │   └── stores/         # Estado global
│   └── README.md
├── kiro/                   # Documentación y planes
└── README.md              # Este archivo
```

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Sergiocharata1977/9001app-v4.git
cd 9001app-v4
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp env.example .env
# Editar .env con tus configuraciones
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** 18+
- **Express.js** - Framework web
- **TypeScript ES6** - Lenguaje
- **MongoDB** - Base de datos
- **Mongoose** - ODM
- **JWT** - Autenticación
- **Joi** - Validaciones

### Frontend
- **React** 18+
- **TypeScript ES6** - Lenguaje
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Zustand** - Estado global
- **Axios** - HTTP client
- **React Router** - Routing

## 📋 Módulos Implementados

### ✅ Completados
- [x] **Autenticación** - Login/Register con JWT
- [x] **Usuarios** - Gestión multi-tenant
- [x] **Organizaciones** - Sistema multi-tenant

### 🚧 En Desarrollo
- [ ] **Departamentos** - CRUD con jerarquía
- [ ] **Puestos** - Gestión de puestos de trabajo
- [ ] **Personal** - Gestión de personal

### 📅 Planificados
- [ ] **Procesos SGC** - Gestión de procesos
- [ ] **Objetivos** - Objetivos de calidad
- [ ] **Indicadores** - Indicadores de gestión
- [ ] **Auditorías** - Sistema de auditorías
- [ ] **Documentos** - Gestión documental

## 🔐 Autenticación

El sistema implementa autenticación JWT con:
- **Access Token** (15 minutos)
- **Refresh Token** (7 días)
- **Multi-tenant** por organización

## 🏗️ Arquitectura

### Backend
- **Arquitectura modular** por funcionalidad
- **Middleware** de autenticación y errores
- **Validaciones** robustas con Joi
- **Manejo de errores** centralizado

### Frontend
- **Componentes reutilizables**
- **Estado global** con Zustand
- **Servicios API** organizados
- **Routing** protegido

## 📊 Base de Datos

### MongoDB Collections
- `users` - Usuarios del sistema
- `organizations` - Organizaciones
- `departments` - Departamentos
- `positions` - Puestos de trabajo
- `personnel` - Personal

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Producción
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
```

## 📝 Documentación

- [Plan de Desarrollo](kiro/PLAN_FRONTEND_REACT_VITE_TYPESCRIPT_ES6.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📞 Soporte

- **GitHub Issues:** [Crear issue](https://github.com/Sergiocharata1977/9001app-v4/issues)
- **Email:** soporte@iso9001app.com

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para la gestión de calidad ISO 9001**

🔗 **Repositorio:** https://github.com/Sergiocharata1977/9001app-v4