# 9001app2 - Sistema de Gestión de Calidad ISO 9001

Sistema integral de gestión de calidad basado en la norma ISO 9001, desarrollado con React + Node.js.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+ (ver `.nvmrc`)
- npm o yarn
- Base de datos Turso (LibSQL)

### Instalación
```bash
# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Editar los archivos .env con tus valores
```

### Desarrollo
```bash
# Ejecutar backend y frontend simultáneamente
npm run dev

# O ejecutar por separado:
npm run dev:backend  # Backend en puerto 5000
npm run dev:frontend # Frontend en puerto 3000
```

### Testing
```bash
# Ejecutar todos los tests
npm test

# Smoke test para verificar servicios
npm run smoke
```

## 📁 Estructura del Proyecto

```
9001app2/
├── backend/          # API REST con Express.js
├── frontend/         # React SPA con Vite
├── docs/            # Documentación del proyecto
├── scripts/         # Scripts de utilidad y smoke tests
└── .gitlab-ci.yml   # Pipeline CI/CD
```

## 🛠️ Tecnologías

- **Frontend:** React 19, Vite, TailwindCSS, Zustand
- **Backend:** Node.js, Express, JWT, LibSQL (Turso)
- **Testing:** Jest, Supertest, Cypress
- **CI/CD:** GitLab CI, PM2, Nginx

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo completo
- `npm run build` - Build de producción
- `npm test` - Tests completos
- `npm run lint` - Linting completo
- `npm run format` - Formateo de código
- `npm run smoke` - Smoke tests

## 📚 Documentación

Ver carpeta `docs/` para documentación detallada:
- [Guía del Proyecto](docs/GUIA_PROYECTO.md)
- [Registro de Decisiones](docs/REGISTRO_DECISIONES.md)

## 🚀 Despliegue

El proyecto incluye pipeline automático de GitLab CI/CD. Ver `.gitlab-ci.yml` para detalles.

**Servidor de producción:** http://31.97.162.229

## 🤝 Contribución

1. Hacer fork del proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

Los hooks pre-commit ejecutan automáticamente linting y tests.

## 📄 Licencia

ISC - Ver archivo LICENSE para detalles.


