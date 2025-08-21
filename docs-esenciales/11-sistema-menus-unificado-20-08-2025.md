# 🎨 11 - Sistema de Menús Unificado - SGC ISO 9001
**📅 Última Actualización: 20-08-2025**

## 🎯 Visión General

Este documento describe el **Sistema de Menús Unificado** implementado en el SGC ISO 9001, que proporciona una experiencia de navegación consistente y organizada para todos los módulos del sistema, siguiendo las reglas de diseño establecidas.

## 🏗️ Arquitectura del Sistema de Menús

### 📋 Principios de Diseño

1. **Consistencia Visual**: Todos los menús comparten la misma estructura base
2. **Identidad por Color**: Cada sistema tiene su propia identidad cromática
3. **Organización Secuencial**: Menús organizados por prioridad y temática
4. **Navegación Intuitiva**: Estructura clara y fácil de seguir
5. **Responsive Design**: Adaptación perfecta a todos los dispositivos

### 🎨 Esquema de Colores

#### **Calidad (Sistema de Gestión de Calidad) - Verde**
```css
/* Colores principales */
primary: 'emerald'
gradient: 'from-emerald-600 to-emerald-700'
background: 'emerald-50'
text: 'emerald-900'
border: 'emerald-200'
```

#### **RRHH (Recursos Humanos) - Azul**
```css
/* Colores principales */
primary: 'blue'
gradient: 'from-blue-600 to-blue-700'
background: 'blue-50'
text: 'blue-900'
border: 'blue-200'
```

#### **Procesos (Gestión de Procesos) - Púrpura**
```css
/* Colores principales */
primary: 'purple'
gradient: 'from-purple-600 to-purple-700'
background: 'purple-50'
text: 'purple-900'
border: 'purple-200'
```

#### **CRM y Satisfacción - Índigo**
```css
/* Colores principales */
primary: 'indigo'
gradient: 'from-indigo-600 to-indigo-700'
background: 'indigo-50'
text: 'indigo-900'
border: 'indigo-200'
```

## 📁 Estructura de Archivos

### Componentes Principales

```
frontend/src/components/menu/
├── MainMenuCards.jsx           # Menú principal con 4 módulos
├── CalidadMenu.jsx            # Menú de Calidad (7 submódulos)
├── RRHHMenu.jsx               # Menú de RRHH (6 submódulos)
├── ProcesosMenu.jsx           # Menú de Procesos (4 submódulos)
├── CRMSatisfaccionMenu.jsx    # Menú CRM y Satisfacción (6 submódulos)
├── MenuColorConfig.js         # Configuración de colores
├── TopBar.jsx                 # Barra superior
└── SuperAdminSidebar.jsx      # Menú administrador
```

## 🎯 Organización de Módulos

### 📋 Menu Principal (MainMenuCards.jsx)

#### **1. Calidad**
- **Ruta:** `/app/calidad`
- **Descripción:** Planificación y Gestión de Calidad
- **Prioridad:** 1
- **Color:** Verde (emerald)
- **Submódulos:** 7 módulos de calidad

#### **2. RRHH**
- **Ruta:** `/app/rrhh`
- **Descripción:** Recursos Humanos
- **Prioridad:** 2
- **Color:** Azul (blue)
- **Submódulos:** 6 módulos de RRHH

#### **3. Procesos**
- **Ruta:** `/app/procesos`
- **Descripción:** Gestión de Procesos
- **Prioridad:** 3
- **Color:** Púrpura (purple)
- **Submódulos:** 4 módulos de procesos

#### **4. CRM y Satisfacción**
- **Ruta:** `/app/crm-satisfaccion`
- **Descripción:** Gestión de Clientes y Satisfacción
- **Prioridad:** 4
- **Color:** Índigo (indigo)
- **Submódulos:** 6 módulos de CRM y satisfacción

### 🟢 Calidad - Organización Secuencial y Temática

#### **1. Planificación**
- **Ruta:** `/app/calidad/planificacion`
- **Descripción:** Planificación Estratégica y Operativa
- **Prioridad:** 1
- **Funcionalidades:** Planificación anual, objetivos de calidad, metas estratégicas

#### **2. Revisión por Dirección**
- **Ruta:** `/app/calidad/revision-direccion`
- **Descripción:** Gestión Ejecutiva del SGC
- **Prioridad:** 2
- **Funcionalidades:** Minutas ejecutivas, decisiones de dirección, revisión del SGC

#### **3. Normas**
- **Ruta:** `/app/calidad/normas`
- **Descripción:** Gestión de Normas y Estándares
- **Prioridad:** 3
- **Funcionalidades:** Normas ISO 9001, procedimientos, documentación técnica

#### **4. Documentos**
- **Ruta:** `/app/calidad/documentos`
- **Descripción:** Gestión Documental
- **Prioridad:** 4
- **Funcionalidades:** Control de documentos, versiones, distribución

#### **5. Productos**
- **Ruta:** `/app/calidad/productos`
- **Descripción:** Gestión de Productos y Servicios
- **Prioridad:** 5
- **Funcionalidades:** Control de productos, especificaciones, aprobación

#### **6. Auditorías**
- **Ruta:** `/app/calidad/auditorias`
- **Descripción:** Sistema de Auditorías
- **Prioridad:** 6
- **Funcionalidades:** Auditorías internas, externas, programa de auditorías

#### **7. Hallazgos y Acciones**
- **Ruta:** `/app/calidad/hallazgos-acciones`
- **Descripción:** Gestión de No Conformidades
- **Prioridad:** 7
- **Funcionalidades:** Hallazgos, acciones correctivas, preventivas

### 🔵 RRHH - Organización Secuencial y Temática

#### **1. Personal**
- **Ruta:** `/app/rrhh/personal`
- **Descripción:** Gestión de Empleados
- **Prioridad:** 1
- **Funcionalidades:** Gestión de empleados, datos personales, estados

#### **2. Departamentos**
- **Ruta:** `/app/rrhh/departamentos`
- **Descripción:** Estructura Organizacional
- **Prioridad:** 2
- **Funcionalidades:** Estructura organizacional, responsables, objetivos

#### **3. Puestos**
- **Ruta:** `/app/rrhh/puestos`
- **Descripción:** Gestión de Puestos de Trabajo
- **Prioridad:** 3
- **Funcionalidades:** Definición de puestos, responsabilidades, requisitos

#### **4. Capacitaciones**
- **Ruta:** `/app/rrhh/capacitaciones`
- **Descripción:** Desarrollo del Personal
- **Prioridad:** 4
- **Funcionalidades:** Programas de formación, desarrollo profesional, evaluación

#### **5. Evaluaciones**
- **Ruta:** `/app/rrhh/evaluaciones`
- **Descripción:** Evaluación de Competencias
- **Prioridad:** 5
- **Funcionalidades:** Evaluación de desempeño, competencias, seguimiento

#### **6. Competencias**
- **Ruta:** `/app/rrhh/competencias`
- **Descripción:** Gestión de Competencias
- **Prioridad:** 6
- **Funcionalidades:** Definición de competencias, evaluación, desarrollo

### 🟣 Procesos - Organización Secuencial y Temática

#### **1. Procesos**
- **Ruta:** `/app/procesos/procesos`
- **Descripción:** Gestión de Procesos Internos
- **Prioridad:** 1
- **Funcionalidades:** Definición de procesos, control, optimización

#### **2. Mejoras**
- **Ruta:** `/app/procesos/mejoras`
- **Descripción:** Mejoras Continuas
- **Prioridad:** 2
- **Funcionalidades:** Mejoras continuas, implementación, seguimiento

#### **3. Indicadores**
- **Ruta:** `/app/procesos/indicadores`
- **Descripción:** Indicadores de Proceso
- **Prioridad:** 3
- **Funcionalidades:** Indicadores de proceso, métricas, mediciones

#### **4. Productos**
- **Ruta:** `/app/procesos/productos`
- **Descripción:** Gestión de Productos
- **Prioridad:** 4
- **Funcionalidades:** Control de productos, servicios, versiones

### 🟦 CRM y Satisfacción - Organización Secuencial y Temática

#### **1. Clientes**
- **Ruta:** `/app/crm-satisfaccion/clientes`
- **Descripción:** Gestión de Clientes
- **Prioridad:** 1
- **Funcionalidades:** Gestión de clientes, datos de contacto, categorización

#### **2. Oportunidades**
- **Ruta:** `/app/crm-satisfaccion/oportunidades`
- **Descripción:** Pipeline de Ventas
- **Prioridad:** 2
- **Funcionalidades:** Pipeline de ventas, seguimiento, valoración

#### **3. Actividades**
- **Ruta:** `/app/crm-satisfaccion/actividades`
- **Descripción:** Actividades Comerciales
- **Prioridad:** 3
- **Funcionalidades:** Actividades comerciales, calendario, seguimiento

#### **4. Satisfacción**
- **Ruta:** `/app/crm-satisfaccion/satisfaccion`
- **Descripción:** Satisfacción de Clientes
- **Prioridad:** 4
- **Funcionalidades:** Encuestas de satisfacción, métricas NPS, feedback

#### **5. Reportes**
- **Ruta:** `/app/crm-satisfaccion/reportes`
- **Descripción:** Reportes Comerciales
- **Prioridad:** 5
- **Funcionalidades:** Reportes comerciales, dashboards, métricas

#### **6. Analytics**
- **Ruta:** `/app/crm-satisfaccion/analytics`
- **Descripción:** Análisis Avanzado
- **Prioridad:** 6
- **Funcionalidades:** Analytics avanzado, predicciones, insights

## 🧩 Componentes del Sistema

### **MainMenuCards.jsx**

**Propósito**: Componente principal que maneja los 4 módulos principales del sistema

**Props**:
```javascript
{
  onBackToSidebar: function,  // Función para volver al sidebar
}
```

**Características**:
- Navegación a los 4 módulos principales
- Diseño de tarjetas con métricas
- Animaciones suaves con Framer Motion
- Diseño responsive
- Estados activos visuales

### **CalidadMenu.jsx**

**Propósito**: Menú específico para el módulo de Calidad

**Props**:
```javascript
{
  onBackToMainMenu: function,  // Función para volver al menú principal
}
```

**Características**:
- 7 submódulos de calidad
- Colores emerald (verde)
- Métricas específicas de calidad
- Navegación intuitiva

### **RRHHMenu.jsx**

**Propósito**: Menú específico para el módulo de RRHH

**Props**:
```javascript
{
  onBackToMainMenu: function,  // Función para volver al menú principal
}
```

**Características**:
- 6 submódulos de RRHH
- Colores blue (azul)
- Métricas específicas de RRHH
- Navegación intuitiva

### **ProcesosMenu.jsx**

**Propósito**: Menú específico para el módulo de Procesos

**Props**:
```javascript
{
  onBackToMainMenu: function,  // Función para volver al menú principal
}
```

**Características**:
- 4 submódulos de procesos
- Colores purple (púrpura)
- Métricas específicas de procesos
- Navegación intuitiva

### **CRMSatisfaccionMenu.jsx**

**Propósito**: Menú específico para el módulo de CRM y Satisfacción

**Props**:
```javascript
{
  onBackToMainMenu: function,  // Función para volver al menú principal
}
```

**Características**:
- 6 submódulos de CRM y satisfacción
- Colores indigo
- Métricas específicas de CRM
- Navegación intuitiva

### **MenuColorConfig.js**

**Propósito**: Configuración centralizada de colores y módulos

**Estructura**:
```javascript
export const menuColorSchemes = {
  calidad: { /* configuración de colores verde */ },
  rrhh: { /* configuración de colores azul */ },
  procesos: { /* configuración de colores púrpura */ },
  'crm-satisfaccion': { /* configuración de colores índigo */ }
};
```

## 🎨 Implementación de Colores

### **Sistema de Clases CSS**

```javascript
// Ejemplo de uso de colores
const colorClasses = {
  primary: `text-${scheme.primary}-600 bg-${scheme.primary}-50`,
  active: `text-white bg-gradient-to-r ${scheme.gradient}`,
  hover: `hover:text-${scheme.primary}-700 hover:bg-${scheme.primary}-100`
};
```

### **Gradientes y Efectos**

```css
/* Gradiente principal */
.bg-gradient-primary {
  background: linear-gradient(to right, var(--primary-600), var(--primary-700));
}

/* Efecto hover */
.hover-effect {
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(8px);
}
```

## 📱 Responsive Design

### **Breakpoints**

```css
/* Móviles */
@media (max-width: 768px) {
  .menu-container {
    width: 100%;
    position: fixed;
    z-index: 1000;
  }
}

/* Tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .menu-container {
    width: 320px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .menu-container {
    width: 320px;
  }
}
```

## 🔄 Funcionalidades

### **Navegación entre Módulos**

```javascript
const handleModuleAccess = (module) => {
  navigate(module.path);
};
```

### **Búsqueda en Tiempo Real**

```javascript
const filteredModules = currentModules.filter(module =>
  module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (module.items && module.items.some(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ))
);
```

### **Expansión de Submenús**

```javascript
const toggleSection = (sectionId) => {
  setExpandedSections(prev => 
    prev.includes(sectionId) 
      ? prev.filter(id => id !== sectionId)
      : [...prev, sectionId]
  );
};
```

## 🎯 Beneficios del Sistema

### **1. Consistencia Visual**
- Todos los menús siguen el mismo patrón de diseño
- Colores consistentes por sistema
- Iconografía unificada

### **2. Usabilidad Mejorada**
- Navegación intuitiva y organizada
- Búsqueda rápida de módulos
- Estados visuales claros

### **3. Mantenibilidad**
- Configuración centralizada
- Fácil adición de nuevos módulos
- Código reutilizable

### **4. Escalabilidad**
- Fácil integración de nuevos sistemas
- Estructura modular
- Configuración flexible

## 🚀 Próximos Pasos

### **Fase 1: Optimización (Semana 1)**
- [ ] Pruebas de rendimiento
- [ ] Optimización de animaciones
- [ ] Mejoras de accesibilidad

### **Fase 2: Expansión (Semana 2)**
- [ ] Integración con Super Admin
- [ ] Menús adicionales
- [ ] Personalización avanzada

### **Fase 3: Automatización (Semana 3)**
- [ ] Generación automática de menús
- [ ] Configuración dinámica
- [ ] Analytics de navegación

## 📊 Métricas de Éxito

### **Objetivos de Usabilidad**
- **Tiempo de navegación:** < 3 segundos
- **Tasa de error:** < 1%
- **Satisfacción del usuario:** > 90%

### **Objetivos Técnicos**
- **Tiempo de carga:** < 100ms
- **Rendimiento:** 60fps en animaciones
- **Compatibilidad:** 100% navegadores modernos

## 📋 Resumen de Implementación

### **Módulos Creados:**
1. ✅ **CalidadMenu.jsx** - 7 submódulos
2. ✅ **RRHHMenu.jsx** - 6 submódulos  
3. ✅ **ProcesosMenu.jsx** - 4 submódulos
4. ✅ **CRMSatisfaccionMenu.jsx** - 6 submódulos
5. ✅ **MainMenuCards.jsx** - Actualizado con 4 módulos principales
6. ✅ **MenuColorConfig.js** - Configuración de colores actualizada

### **Estructura Final:**
```
Menu Principal (MainMenuCards.jsx)
├── Calidad (Verde) - 7 submódulos
├── RRHH (Azul) - 6 submódulos
├── Procesos (Púrpura) - 4 submódulos
└── CRM y Satisfacción (Índigo) - 6 submódulos
```

---

*Este sistema de menús unificado proporciona una base sólida para la navegación del SGC ISO 9001, asegurando una experiencia de usuario consistente y profesional.*
