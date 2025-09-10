# 🚀 Backend ISO 9001 - Sistema de Gestión de Calidad

Backend desarrollado con **Node.js + Express + TypeScript ES6 + MongoDB** para el sistema de gestión de calidad ISO 9001.

## 📋 Características

- ✅ **Autenticación JWT** multi-tenant
- ✅ **Sistema de usuarios** por organización
- ✅ **Módulos RRHH** (Departamentos, Puestos, Personal)
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **TypeScript ES6** moderno
- ✅ **Manejo de errores** robusto
- ✅ **Validaciones** con Joi
- ✅ **Rate limiting** y seguridad
- ✅ **CORS** configurado

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Lenguaje:** TypeScript ES6
- **Base de datos:** MongoDB Atlas
- **ORM:** Mongoose
- **Autenticación:** JWT
- **Validación:** Joi
- **Seguridad:** Helmet, CORS, Rate Limiting

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Sergiocharata1977/9001app-v4.git
cd 9001app-v4/backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://9001app:password@cluster0.mongodb.net/9001app
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
FRONTEND_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuración de base de datos
│   ├── middleware/       # Middlewares (auth, error handling)
│   ├── modules/          # Módulos por funcionalidad
│   │   ├── auth/         # Autenticación
│   │   ├── users/        # Gestión de usuarios
│   │   ├── organizations/ # Organizaciones
│   │   ├── departments/  # Departamentos
│   │   ├── positions/    # Puestos
│   │   └── personnel/    # Personal
│   └── index.ts          # Punto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh-token` - Renovar token
- `GET /api/auth/profile` - Obtener perfil

### Usuarios
- `GET /api/users` - Listar usuarios de la organización
- `GET /api/users/:id` - Obtener usuario específico

### Organizaciones
- `GET /api/organizations/current` - Obtener organización actual

### Departamentos
- `GET /api/departamentos` - Listar departamentos
- `POST /api/departamentos` - Crear departamento
- `PUT /api/departamentos/:id` - Actualizar departamento
- `DELETE /api/departamentos/:id` - Eliminar departamento

### Puestos
- `GET /api/puestos` - Listar puestos
- `POST /api/puestos` - Crear puesto
- `PUT /api/puestos/:id` - Actualizar puesto
- `DELETE /api/puestos/:id` - Eliminar puesto

### Personal
- `GET /api/personal` - Listar personal
- `POST /api/personal` - Crear personal
- `PUT /api/personal/:id` - Actualizar personal
- `DELETE /api/personal/:id` - Eliminar personal

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** con dos tipos de tokens:

- **Access Token:** Válido por 15 minutos
- **Refresh Token:** Válido por 7 días

### Headers requeridos:
```
Authorization: Bearer <access_token>
```

## 🏗️ Sistema Multi-tenant

Cada usuario pertenece a una organización específica. Los datos están aislados por organización usando `organization_id`.

## 📊 Base de Datos

### Colecciones principales:
- **users** - Usuarios del sistema
- **organizations** - Organizaciones
- **departments** - Departamentos
- **positions** - Puestos de trabajo
- **personnel** - Personal

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run start        # Ejecutar versión compilada
npm run lint         # Linter
npm run lint:fix     # Corregir errores de linting
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Configuración de Desarrollo

### MongoDB Atlas
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear cluster
3. Obtener connection string
4. Configurar en `.env`

### Variables de entorno importantes:
- `MONGODB_URI` - URL de conexión a MongoDB
- `JWT_SECRET` - Clave secreta para JWT
- `JWT_REFRESH_SECRET` - Clave secreta para refresh tokens
- `FRONTEND_URL` - URL del frontend para CORS

## 🚀 Despliegue

### Producción
```bash
npm run build
npm start
```

### Docker (opcional)
```bash
docker build -t iso9001-backend .
docker run -p 5000:5000 iso9001-backend
```

## 📈 Próximas Funcionalidades

- [ ] Módulos SGC (Procesos, Objetivos, Indicadores)
- [ ] Sistema de auditorías
- [ ] Gestión de documentos
- [ ] Reportes y estadísticas
- [ ] Notificaciones por email
- [ ] Subida de archivos
- [ ] API de integración

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@iso9001app.com
- GitHub Issues: [Crear issue](https://github.com/Sergiocharata1977/9001app-v4/issues)

---

**Desarrollado con ❤️ para la gestión de calidad ISO 9001**
