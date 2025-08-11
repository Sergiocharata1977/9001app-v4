# ISO Flow - Sistema de Gestión de Calidad ISO 9001

Sistema integral de gestión de calidad basado en la norma ISO 9001:2015, desarrollado con tecnologías modernas para organizaciones que buscan la excelencia operativa.

## 🚀 Características Principales

- **Sistema de Gestión de Calidad**: Implementación completa de ISO 9001:2015
- **Gestión de Recursos Humanos**: Administración integral del personal, capacitaciones y evaluaciones
- **Documentación Digital**: Control total de documentos, versiones y cumplimiento normativo
- **Auditorías y Mejoras**: Sistema de auditorías internas y gestión de hallazgos
- **Procesos y Productos**: Diseño y control de procesos, productos y servicios
- **Gestión Organizacional**: Administración multi-tenant para organizaciones

## 🏗️ Arquitectura del Sistema

### Frontend
- **React 19** con Vite
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Zustand** para gestión de estado
- **React Query** para manejo de datos
- **Framer Motion** para animaciones

### Backend
- **Node.js** con Express
- **Turso (libSQL)** como base de datos
- **JWT** para autenticación
- **Middleware** personalizado para seguridad

## 📁 Estructura del Proyecto

```
9001app2/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios API
│   │   ├── store/          # Estado global (Zustand)
│   │   └── utils/          # Utilidades
│   └── package.json
├── backend/                 # API Node.js
│   ├── controllers/        # Controladores
│   ├── middleware/         # Middleware personalizado
│   ├── routes/            # Rutas de la API
│   ├── services/          # Servicios de negocio
│   └── package.json
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Sergiocharata1977/9001app.git
cd 9001app
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**
```bash
# En el directorio backend, crear archivo .env.local
cp env.example env-local.txt
# Editar env-local.txt con tus configuraciones
```

### Ejecución en Desarrollo

1. **Ejecutar el backend** (puerto 5000)
```bash
cd backend
npm run dev
```

2. **Ejecutar el frontend** (puerto 3000/3001)
```bash
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000/ o http://localhost:3001/
- **Backend API**: http://localhost:5000/api
- **Autenticación**: http://localhost:5000/api/auth

## 📚 Funcionalidades Principales

### Gestión de Personal
- Administración de departamentos y puestos
- Gestión de personal y competencias
- Evaluaciones de desempeño
- Capacitaciones y formación

### Sistema de Calidad
- Gestión de procesos
- Control de documentos
- Auditorías internas
- Gestión de hallazgos y acciones correctivas

### Planificación y Revisión
- Planificación estratégica
- Política de calidad
- Objetivos y metas
- Revisión por la dirección

## 🔐 Autenticación y Seguridad

- Autenticación JWT con refresh tokens
- Middleware de seguridad personalizado
- Control de acceso basado en roles
- Gestión multi-tenant

## 🗄️ Base de Datos

El sistema utiliza **Turso (libSQL)** como base de datos principal:
- Conexión segura con SSL
- Esquema optimizado para ISO 9001
- Soporte para múltiples organizaciones

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
# Construir frontend
cd frontend && npm run build

# Ejecutar backend en producción
cd backend && npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o consultas:
- Email: info@isoflow.com
- Teléfono: +54 11 1234-5678

## 📈 Roadmap

- [ ] Integración con sistemas ERP
- [ ] Dashboard avanzado con BI
- [ ] App móvil nativa
- [ ] Integración con APIs externas
- [ ] Módulo de reportes avanzados

---

© 2024 ISO Flow. Todos los derechos reservados.