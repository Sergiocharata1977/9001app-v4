# 🤖 Agent Coordinator - 9001app-v2

Sistema de coordinación de agentes inteligentes para la migración y optimización del proyecto **9001app-v2** a **MongoDB**.

## 🎯 Objetivo

Rehabilitar, mejorar y optimizar el sistema de coordinación de agentes existente, implementando una jerarquía robusta y escalable para la gestión de múltiples agentes especializados en la migración de **9001app** a **9001app-v2** con **MongoDB**.

## 🏗️ Arquitectura

### Componentes Principales

- **🤖 BaseAgent**: Clase base para todos los agentes con funcionalidades comunes
- **🎯 AgentCoordinator**: Coordinador principal que gestiona todos los agentes
- **📡 MessageBus**: Sistema de comunicación entre agentes
- **📊 HealthMonitor**: Monitoreo de salud y recursos del sistema
- **⏰ TaskScheduler**: Programación y gestión de tareas
- **🔄 WorkflowEngine**: Motor de workflows para flujos complejos

### Agentes Especializados

1. **🔒 SecurityAgent**: Auditoría y configuración de seguridad
2. **🏗️ StructureAgent**: Gestión de estructura del proyecto
3. **🍃 MongoDBAgent**: Migración y configuración de MongoDB
4. **📝 TypeScriptAgent**: Migración de código a TypeScript
5. **🔌 ApiAgent**: Optimización de APIs
6. **🌐 WebAgent**: Interfaz web del coordinador

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/9001app-v2/agent-coordinator.git
cd agent-coordinator

# Instalar dependencias
npm install

# Construir el proyecto
npm run build
```

## 📋 Uso

### Comandos Principales

```bash
# Migración completa (recomendado)
npm run full-migration

# Migración específica de MongoDB
npm run mongodb

# Migración específica de TypeScript
npm run typescript

# Solo agente de seguridad
npm run security

# Solo agente de estructura
npm run structure

# Solo agente API
npm run api

# Interfaz web del coordinador
npm run web

# Estado del sistema
npm run status
```

### Comandos Directos

```bash
# Usando el ejecutable directamente
node dist/index.js full-migration
node dist/index.js mongodb
node dist/index.js typescript
node dist/index.js web
node dist/index.js status
```

## 🔧 Configuración

### Variables de Entorno

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=9001app_v2

# Logging
LOG_LEVEL=info
LOG_FILE=logs/agent-coordinator.log

# Sistema
MAX_CONCURRENT_TASKS=10
HEALTH_CHECK_INTERVAL=30000
```

### Configuración de Agentes

Cada agente puede ser configurado individualmente:

```typescript
// Ejemplo de configuración del agente MongoDB
const mongodbConfig = {
  connectionString: 'mongodb://localhost:27017',
  databaseName: '9001app_v2',
  collections: ['users', 'roles', 'permissions', 'audits'],
  backupEnabled: true,
  migrationMode: 'full'
};
```

## 📊 Monitoreo

### Interfaz Web

Accede al dashboard en: `http://localhost:8000`

- **Estado de agentes en tiempo real**
- **Métricas del sistema**
- **Logs de ejecución**
- **Control de tareas**

### API REST

```bash
# Estado del sistema
GET http://localhost:8000/api/status

# Ejecutar agente específico
POST http://localhost:8000/api/run
{
  "agent": "mongodb"
}

# Ejecutar todos los agentes
POST http://localhost:8000/api/run-all
```

## 🔍 Logs

Los logs se almacenan en:
- **Consola**: Salida en tiempo real con colores
- **Archivo**: `logs/agent-coordinator-YYYY-MM-DD.log`
- **Rotación**: Automática cada 10MB, máximo 5 archivos

### Niveles de Log

- `debug`: Información detallada para desarrollo
- `info`: Información general del sistema
- `warn`: Advertencias y situaciones no críticas
- `error`: Errores que requieren atención

## 🛠️ Desarrollo

### Estructura del Proyecto

```
agent-coordinator/
├── src/
│   ├── agents/           # Agentes especializados
│   ├── core/             # Componentes principales
│   ├── communication/    # Sistema de comunicación
│   ├── monitoring/       # Monitoreo y salud
│   ├── scheduling/       # Programación de tareas
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilidades
│   └── index.ts          # Punto de entrada
├── dist/                 # Código compilado
├── logs/                 # Archivos de log
└── docs/                 # Documentación
```

### Agregar un Nuevo Agente

1. **Crear el agente**:
```typescript
import { BaseAgent } from '../core/BaseAgent';

export class MiNuevoAgent extends BaseAgent {
  constructor(id: string = 'mi-nuevo-agent') {
    super(id, 'Mi Nuevo Agent', 'mi-tipo', {
      maxRetries: 3,
      timeout: 30000,
      autoRestart: true
    });
    
    this.capabilities = ['mi-capacidad'];
    this.dependencies = ['security'];
  }

  async execute(params?: any): Promise<any> {
    // Implementar lógica del agente
  }

  canExecute(task: any): boolean {
    return task.type === 'mi-tipo';
  }

  getInfo(): Record<string, any> {
    return {
      agentType: 'mi-tipo',
      capabilities: this.capabilities
    };
  }
}
```

2. **Registrar en el coordinador**:
```typescript
// En src/index.ts
const miNuevoAgent = new MiNuevoAgent();
this.coordinator.registerAgent(miNuevoAgent, 'local');
this.agents.set('mi-nuevo', miNuevoAgent);
```

### Scripts de Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Construir proyecto
npm run build

# Limpiar build
npm run clean

# Ejecutar tests (cuando estén implementados)
npm test
```

## 🔒 Seguridad

### Características de Seguridad

- **Validación de entrada**: Todos los parámetros son validados
- **Logging seguro**: No se registran datos sensibles
- **Manejo de errores**: Errores capturados y manejados apropiadamente
- **Timeouts**: Prevención de tareas infinitas
- **Recuperación automática**: Reinicio automático de agentes fallidos

### Mejores Prácticas

1. **Nunca exponer credenciales** en logs o configuraciones
2. **Usar variables de entorno** para configuraciones sensibles
3. **Validar todas las entradas** antes de procesarlas
4. **Mantener actualizadas** las dependencias
5. **Revisar logs regularmente** para detectar problemas

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
mongod --version
systemctl status mongod

# Verificar conexión
mongo --eval "db.runCommand('ping')"
```

#### Error de compilación TypeScript
```bash
# Limpiar y reconstruir
npm run clean
npm run build

# Verificar configuración
npx tsc --noEmit
```

#### Agente no responde
```bash
# Verificar estado
npm run status

# Reiniciar agente específico
# (implementar en futuras versiones)
```

### Logs de Debug

Para obtener más información de debug:

```bash
# Cambiar nivel de log
export LOG_LEVEL=debug
npm run full-migration

# Ver logs en tiempo real
tail -f logs/agent-coordinator-$(date +%Y-%m-%d).log
```

## 📈 Métricas y Monitoreo

### Métricas Disponibles

- **Agentes**: Total, activos, fallidos
- **Tareas**: Total, completadas, fallidas
- **Rendimiento**: Tiempo de respuesta, uso de recursos
- **Salud**: Estado general del sistema

### Alertas

El sistema genera alertas automáticas para:
- **Agentes fallidos**
- **Uso alto de recursos**
- **Errores críticos**
- **Tiempo de respuesta lento**

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Guías de Contribución

- **Seguir** las convenciones de código existentes
- **Agregar tests** para nuevas funcionalidades
- **Actualizar documentación** cuando sea necesario
- **Verificar** que el build pase antes de hacer PR

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/9001app-v2/agent-coordinator/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/9001app-v2/agent-coordinator/wiki)
- **Email**: soporte@9001app-v2.com

## 🔄 Changelog

### v2.0.0 (Actual)
- ✨ Nueva arquitectura de coordinación de agentes
- 🍃 Soporte completo para migración a MongoDB
- 📝 Migración automática a TypeScript
- 🌐 Interfaz web mejorada
- 📊 Sistema de monitoreo avanzado
- 🔒 Mejoras de seguridad
- ⚡ Optimizaciones de rendimiento

### v1.0.0 (Anterior)
- 🎯 Sistema básico de coordinación
- 🔒 Agente de seguridad
- 📝 Agente TypeScript básico
- 🌐 Interfaz web simple

---

**Desarrollado con ❤️ para 9001app-v2**
