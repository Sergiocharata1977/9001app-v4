#!/usr/bin/env node

/**
 * 🔍 Diagnóstico Completo del Sistema RAG - SGC ISO 9001
 * Script para identificar y resolver problemas del sistema RAG
 * 
 * @author: Sistema de Coordinación de Agentes
 * @version: 1.0
 * @date: 2025-08-20
 */

const path = require('path');
const fs = require('fs');

// Configuración de rutas
const BACKEND_PATH = path.join(__dirname, '..', '..');
const RAG_SYSTEM_PATH = path.join(BACKEND_PATH, 'RAG-System');
const INDEX_PATH = path.join(BACKEND_PATH, 'index.js');

console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DEL SISTEMA RAG');
console.log('=' .repeat(60));

// 1. Verificar estructura de archivos
console.log('\n📁 1. VERIFICANDO ESTRUCTURA DE ARCHIVOS...');

const requiredFiles = [
  'RAG-System/models/ragDataModel.js',
  'RAG-System/controllers/ragController.js',
  'RAG-System/services/ragService.js',
  'RAG-System/routes/ragRoutes.js'
];

const missingFiles = [];
const existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(BACKEND_PATH, file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - NO ENCONTRADO`);
  }
});

// 2. Verificar integración en index.js
console.log('\n🔗 2. VERIFICANDO INTEGRACIÓN EN INDEX.JS...');

let indexContent = '';
try {
  indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
  console.log('✅ index.js encontrado');
} catch (error) {
  console.log('❌ Error leyendo index.js:', error.message);
}

// Buscar importaciones RAG
const ragImports = [
  'require.*ragRoutes',
  'app.use.*rag',
  'RAG.*routes'
];

let integrationIssues = [];
ragImports.forEach(pattern => {
  if (!indexContent.includes(pattern.replace('.*', ''))) {
    integrationIssues.push(`Falta integración: ${pattern}`);
  }
});

if (integrationIssues.length === 0) {
  console.log('✅ Integración RAG encontrada en index.js');
} else {
  console.log('❌ Problemas de integración:');
  integrationIssues.forEach(issue => console.log(`   - ${issue}`));
}

// 3. Verificar endpoints del frontend
console.log('\n🌐 3. VERIFICANDO ENDPOINTS DEL FRONTEND...');

const frontendEndpoints = [
  '/api/rag/status',
  '/api/rag/query'
];

console.log('Endpoints esperados por el frontend:');
frontendEndpoints.forEach(endpoint => {
  console.log(`   - ${endpoint}`);
});

// 4. Verificar rutas RAG
console.log('\n🛣️ 4. VERIFICANDO RUTAS RAG...');

let ragRoutesContent = '';
try {
  const ragRoutesPath = path.join(RAG_SYSTEM_PATH, 'routes', 'ragRoutes.js');
  ragRoutesContent = fs.readFileSync(ragRoutesPath, 'utf8');
  console.log('✅ ragRoutes.js encontrado');
} catch (error) {
  console.log('❌ Error leyendo ragRoutes.js:', error.message);
}

// Buscar endpoints en las rutas
const expectedEndpoints = [
  '/status',
  '/query',
  '/health',
  '/search',
  '/context',
  '/generate'
];

console.log('Endpoints definidos en ragRoutes.js:');
expectedEndpoints.forEach(endpoint => {
  if (ragRoutesContent.includes(endpoint)) {
    console.log(`✅ ${endpoint}`);
  } else {
    console.log(`❌ ${endpoint} - NO ENCONTRADO`);
  }
});

// 5. Verificar controlador RAG
console.log('\n🎮 5. VERIFICANDO CONTROLADOR RAG...');

let ragControllerContent = '';
try {
  const ragControllerPath = path.join(RAG_SYSTEM_PATH, 'controllers', 'ragController.js');
  ragControllerContent = fs.readFileSync(ragControllerPath, 'utf8');
  console.log('✅ ragController.js encontrado');
} catch (error) {
  console.log('❌ Error leyendo ragController.js:', error.message);
}

// Buscar métodos en el controlador
const expectedMethods = [
  'getRAGHealth',
  'searchRAGData',
  'getRAGContext',
  'generateRAGResponse',
  'getRAGStats',
  'getRAGDataByType',
  'getAllRAGData'
];

console.log('Métodos definidos en ragController.js:');
expectedMethods.forEach(method => {
  if (ragControllerContent.includes(method)) {
    console.log(`✅ ${method}`);
  } else {
    console.log(`❌ ${method} - NO ENCONTRADO`);
  }
});

// 6. Verificar modelo RAG
console.log('\n📊 6. VERIFICANDO MODELO RAG...');

let ragModelContent = '';
try {
  const ragModelPath = path.join(RAG_SYSTEM_PATH, 'models', 'ragDataModel.js');
  ragModelContent = fs.readFileSync(ragModelPath, 'utf8');
  console.log('✅ ragDataModel.js encontrado');
} catch (error) {
  console.log('❌ Error leyendo ragDataModel.js:', error.message);
}

// Buscar métodos en el modelo
const expectedModelMethods = [
  'getAllSystemData',
  'searchData',
  'getDataByType',
  'getNormasInfo',
  'getPersonalInfo',
  'getProcesosInfo'
];

console.log('Métodos definidos en ragDataModel.js:');
expectedModelMethods.forEach(method => {
  if (ragModelContent.includes(method)) {
    console.log(`✅ ${method}`);
  } else {
    console.log(`❌ ${method} - NO ENCONTRADO`);
  }
});

// 7. Verificar servicio RAG
console.log('\n⚙️ 7. VERIFICANDO SERVICIO RAG...');

let ragServiceContent = '';
try {
  const ragServicePath = path.join(RAG_SYSTEM_PATH, 'services', 'ragService.js');
  ragServiceContent = fs.readFileSync(ragServicePath, 'utf8');
  console.log('✅ ragService.js encontrado');
} catch (error) {
  console.log('❌ Error leyendo ragService.js:', error.message);
}

// 8. Resumen de problemas
console.log('\n📋 8. RESUMEN DE PROBLEMAS IDENTIFICADOS...');

const problems = [];

if (missingFiles.length > 0) {
  problems.push(`Archivos faltantes: ${missingFiles.join(', ')}`);
}

if (integrationIssues.length > 0) {
  problems.push(`Problemas de integración: ${integrationIssues.join(', ')}`);
}

if (problems.length === 0) {
  console.log('✅ No se identificaron problemas estructurales');
} else {
  console.log('❌ Problemas encontrados:');
  problems.forEach(problem => console.log(`   - ${problem}`));
}

// 9. Recomendaciones
console.log('\n💡 9. RECOMENDACIONES...');

if (missingFiles.length > 0) {
  console.log('🔧 Crear archivos faltantes del sistema RAG');
}

if (integrationIssues.length > 0) {
  console.log('🔧 Integrar rutas RAG en index.js');
}

console.log('🔧 Verificar conectividad con base de datos');
console.log('🔧 Probar endpoints individualmente');
console.log('🔧 Revisar logs del servidor');

// 10. Scripts de solución
console.log('\n🛠️ 10. SCRIPTS DE SOLUCIÓN DISPONIBLES...');

const solutionScripts = [
  'test-new-rag-system.js',
  'test-rag-connectivity.js',
  'test-rag-complete.js',
  'check-table-structure.js'
];

solutionScripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`✅ ${script} - Disponible`);
  } else {
    console.log(`❌ ${script} - No encontrado`);
  }
});

console.log('\n' + '=' .repeat(60));
console.log('🔍 DIAGNÓSTICO COMPLETADO');
console.log('📊 Archivos verificados:', existingFiles.length + missingFiles.length);
console.log('✅ Archivos existentes:', existingFiles.length);
console.log('❌ Archivos faltantes:', missingFiles.length);
console.log('🔧 Problemas identificados:', problems.length);

if (problems.length > 0) {
  console.log('\n🚨 SE REQUIERE ACCIÓN INMEDIATA');
  console.log('Ejecute los scripts de solución para resolver los problemas identificados.');
} else {
  console.log('\n✅ SISTEMA RAG ESTRUCTURALMENTE CORRECTO');
  console.log('El problema puede estar en la conectividad o configuración.');
}

console.log('\n📝 Para más detalles, ejecute:');
console.log('   node scripts/permanentes/test-new-rag-system.js');
console.log('   node scripts/permanentes/test-rag-connectivity.js');
