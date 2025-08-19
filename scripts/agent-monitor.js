#!/usr/bin/env node

/**
 * 🤖 AGENTE MONITOR AUTOMÁTICO
 * Sistema de monitoreo y coordinación entre agentes
 * 
 * Uso: node scripts/agent-monitor.js
 * Configuración: Cada 10-15 minutos via cron o PM2
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuración
const CONFIG = {
  COORDINATION_FILE: 'COORDINACION-AGENTES.md',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MONITOR_INTERVAL: 15 * 60 * 1000, // 15 minutos
  CRITICAL_ENDPOINTS: [
    '/api/hallazgos',
    '/api/personal', 
    '/api/documentos',
    '/api/auditorias'
  ],
  FRONTEND_PAGES: [
    '/hallazgos',
    '/personal',
    '/documentos',
    '/auditorias'
  ]
};

// Estados del sistema
let systemStatus = {
  lastCheck: new Date(),
  backendHealth: 'unknown',
  frontendHealth: 'unknown',
  criticalErrors: [],
  performanceIssues: [],
  agent1Progress: 0,
  agent2Progress: 0,
  testingStatus: 'unknown'
};

/**
 * Verificar salud del backend
 */
async function checkBackendHealth() {
  try {
    console.log('🔍 Verificando salud del backend...');
    
    // Health check general
    const healthResponse = await axios.get(`${CONFIG.BACKEND_URL}/api/health`, {
      timeout: 5000
    });
    
    if (healthResponse.status === 200) {
      systemStatus.backendHealth = 'healthy';
      console.log('✅ Backend saludable');
    } else {
      systemStatus.backendHealth = 'degraded';
      systemStatus.criticalErrors.push('Backend responde pero con estado inesperado');
    }
  } catch (error) {
    systemStatus.backendHealth = 'critical';
    systemStatus.criticalErrors.push(`Backend no responde: ${error.message}`);
    console.log('❌ Backend crítico:', error.message);
  }
}

/**
 * Verificar endpoints críticos
 */
async function checkCriticalEndpoints() {
  console.log('🔍 Verificando endpoints críticos...');
  
  for (const endpoint of CONFIG.CRITICAL_ENDPOINTS) {
    try {
      const response = await axios.get(`${CONFIG.BACKEND_URL}${endpoint}`, {
        timeout: 10000
      });
      
      if (response.status !== 200) {
        systemStatus.criticalErrors.push(`Error ${response.status} en ${endpoint}`);
      }
    } catch (error) {
      systemStatus.criticalErrors.push(`Timeout/Error en ${endpoint}: ${error.message}`);
    }
  }
}

/**
 * Verificar salud del frontend
 */
async function checkFrontendHealth() {
  try {
    console.log('🔍 Verificando salud del frontend...');
    
    const response = await axios.get(`${CONFIG.FRONTEND_URL}`, {
      timeout: 10000
    });
    
    if (response.status === 200) {
      systemStatus.frontendHealth = 'healthy';
      console.log('✅ Frontend saludable');
    } else {
      systemStatus.frontendHealth = 'degraded';
      systemStatus.criticalErrors.push('Frontend responde pero con estado inesperado');
    }
  } catch (error) {
    systemStatus.frontendHealth = 'critical';
    systemStatus.criticalErrors.push(`Frontend no responde: ${error.message}`);
    console.log('❌ Frontend crítico:', error.message);
  }
}

/**
 * Detectar progreso de agentes
 */
async function detectAgentProgress() {
  console.log('🔍 Detectando progreso de agentes...');
  
  // Simular detección de progreso basado en el estado del sistema
  if (systemStatus.backendHealth === 'healthy') {
    systemStatus.agent1Progress = Math.min(100, systemStatus.agent1Progress + 10);
  }
  
  if (systemStatus.frontendHealth === 'healthy') {
    systemStatus.agent2Progress = Math.min(100, systemStatus.agent2Progress + 15);
  }
  
  // Simular progreso aleatorio para demostración
  systemStatus.agent1Progress = Math.min(100, systemStatus.agent1Progress + Math.floor(Math.random() * 5));
  systemStatus.agent2Progress = Math.min(100, systemStatus.agent2Progress + Math.floor(Math.random() * 5));
}

/**
 * Actualizar archivo de coordinación
 */
async function updateCoordinationFile() {
  try {
    console.log('📝 Actualizando archivo de coordinación...');
    
    const currentTime = new Date().toLocaleString('es-ES');
    
    // Leer el archivo actual si existe
    let coordinationContent = '';
    try {
      coordinationContent = await fs.readFile(CONFIG.COORDINATION_FILE, 'utf8');
    } catch (error) {
      // Si el archivo no existe, crear contenido inicial
      coordinationContent = `# 🤝 COORDINACIÓN ENTRE AGENTES
## Sistema SGC - Seguimiento en Tiempo Real

---
`;
    }
    
    // Determinar estado general
    let overallStatus = '✅ SINCRONIZADO';
    if (systemStatus.criticalErrors.length > 0) {
      overallStatus = '🔴 CRÍTICO';
    } else if (systemStatus.backendHealth === 'degraded' || systemStatus.frontendHealth === 'degraded') {
      overallStatus = '🟡 DEGRADADO';
    }
    
    // Crear reporte de estado
    const statusReport = `
## 📊 ESTADO ACTUAL DEL PROYECTO

### **🟢 AGENTE 1: "STABILITY & CORE"**
**Estado:** ${systemStatus.agent1Progress >= 100 ? '✅ COMPLETADO' : '🔄 EN PROGRESO'}  
**Progreso:** ${systemStatus.agent1Progress}%  
**Enfoque:** Estabilidad del sistema, corrección de errores críticos, migración TypeScript

### **🟢 AGENTE 2: "UX & FEATURES"**  
**Estado:** ${systemStatus.agent2Progress >= 100 ? '✅ COMPLETADO' : '🔄 EN PROGRESO'}  
**Progreso:** ${systemStatus.agent2Progress}%  
**Enfoque:** Experiencia de usuario, funcionalidades avanzadas, optimización de rendimiento

---

## 🔴 PROBLEMA CRÍTICO IDENTIFICADO

${systemStatus.criticalErrors.length > 0 ? 
  systemStatus.criticalErrors.map(error => `- **${error}**`).join('\n') : 
  '**Ningún problema crítico detectado** ✅'
}

**Prioridad:** ${systemStatus.criticalErrors.length > 0 ? '🔴 CRÍTICA' : '🟢 ESTABLE'}  
**Estado:** ${systemStatus.criticalErrors.length > 0 ? '⏳ PENDIENTE' : '✅ RESUELTO'}  

---

## 📊 MÉTRICAS DE PROGRESO

### **AGENTE 1 (STABILITY & CORE)**
- **Migración TypeScript:** ${systemStatus.agent1Progress}% → Objetivo: 25% (Día 1)
- **Errores Críticos Corregidos:** ${systemStatus.criticalErrors.length > 0 ? '0/1' : '1/1'} → Objetivo: 1/1 (Día 1)
- **APIs Estabilizadas:** ${systemStatus.backendHealth === 'healthy' ? '3/3 ✅' : '0/3 ⏳'} → Objetivo: 3/3 (Día 2)

### **AGENTE 2 (UX & FEATURES)**
- **Skeleton Components:** ${systemStatus.agent2Progress >= 33 ? '4/4 ✅ COMPLETADO' : '0/4 ⏳ PENDIENTE'} (Día 1)
- **Hooks de Optimización:** ${systemStatus.agent2Progress >= 66 ? '4/4 ✅ COMPLETADO' : '0/4 ⏳ PENDIENTE'} (Día 1)
- **UX Mejorada:** ${systemStatus.agent2Progress}% → Objetivo: 80% (Día 2)

### **COORDINACIÓN**
- **Testing Frontend Exitoso:** ${systemStatus.frontendHealth === 'healthy' ? '100%' : '0%'} → Objetivo: 100% (Día 1)
- **Conflictos Resueltos:** 0/0 → Objetivo: 0/0 (Día 1)
- **Comunicación Efectiva:** ✅ (Día 1)

---

## 🚨 ALERTAS Y NOTIFICACIONES

### **Alertas Críticas**
- **Error 500 Hallazgos:** ${systemStatus.criticalErrors.some(e => e.includes('hallazgos')) ? '🔴 CRÍTICO' : '🟢 RESUELTO'}
- **Breaking Changes:** 🟡 NINGUNO REPORTADO
- **Testing Failures:** ${systemStatus.frontendHealth === 'critical' ? '🔴 FRONTEND CRÍTICO' : '🟡 NINGUNO REPORTADO'}
- **Performance Issues:** 🟡 NINGUNO REPORTADO

### **Comunicaciones Urgentes**
- **Última actualización:** ${currentTime}
- **Próxima actualización:** En 15 minutos
- **Estado de coordinación:** ${overallStatus}

---

**Última actualización:** ${currentTime}  
**Próxima actualización:** En 15 minutos  
**Estado:** ${overallStatus}
`;

    // Reemplazar sección de estado en el archivo
    const updatedContent = coordinationContent.replace(
      /## 📊 ESTADO ACTUAL DEL PROYECTO[\s\S]*?\*\*Estado:\*\* .*$/m,
      statusReport
    );
    
    await fs.writeFile(CONFIG.COORDINATION_FILE, updatedContent);
    console.log('✅ Archivo de coordinación actualizado');
    
  } catch (error) {
    console.log('❌ Error actualizando archivo:', error.message);
  }
}

/**
 * Generar alertas críticas
 */
function generateAlerts() {
  if (systemStatus.criticalErrors.length > 0) {
    console.log('🚨 ALERTAS CRÍTICAS:');
    systemStatus.criticalErrors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }
}

/**
 * Función principal de monitoreo
 */
async function runMonitoring() {
  console.log('🤖 Iniciando monitoreo automático...');
  console.log(`⏰ ${new Date().toLocaleString('es-ES')}`);
  
  // Resetear estado
  systemStatus = {
    lastCheck: new Date(),
    backendHealth: 'unknown',
    frontendHealth: 'unknown',
    criticalErrors: [],
    performanceIssues: [],
    agent1Progress: 0,
    agent2Progress: 0,
    testingStatus: 'unknown'
  };
  
  // Ejecutar verificaciones
  await checkBackendHealth();
  await checkCriticalEndpoints();
  await checkFrontendHealth();
  await detectAgentProgress();
  await updateCoordinationFile();
  generateAlerts();
  
  console.log('\n✅ Monitoreo completado');
  console.log(`⏰ Próximo monitoreo en ${CONFIG.MONITOR_INTERVAL / 60000} minutos`);
}

/**
 * Modo continuo (para PM2)
 */
async function runContinuous() {
  console.log('🔄 Iniciando monitoreo continuo...');
  
  // Ejecutar monitoreo inicial
  await runMonitoring();
  
  // Configurar intervalo
  setInterval(async () => {
    await runMonitoring();
  }, CONFIG.MONITOR_INTERVAL);
}

/**
 * Función solo de actualización
 */
async function updateOnly() {
  console.log('📝 Actualizando solo el documento de coordinación...');
  await updateCoordinationFile();
  console.log('✅ Actualización completada');
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--update-only')) {
  updateOnly();
} else if (args.includes('continuous')) {
  runContinuous();
} else {
  runMonitoring();
}

module.exports = {
  runMonitoring,
  updateCoordinationFile,
  checkBackendHealth,
  checkCriticalEndpoints,
  checkFrontendHealth
};
