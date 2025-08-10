#!/usr/bin/env node

/**
 * Script de utilidad para cambiar rápidamente entre modos de desarrollo y despliegue
 * 
 * Uso:
 *   node scripts/toggle-security-systems.js --mode=development
 *   node scripts/toggle-security-systems.js --mode=deployment
 *   node scripts/toggle-security-systems.js --status
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de configuración
const configPath = path.join(__dirname, '../src/config/securityConfig.js');

// Función para leer el archivo de configuración
function readConfigFile() {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error al leer el archivo de configuración:', error.message);
    process.exit(1);
  }
}

// Función para escribir el archivo de configuración
function writeConfigFile(content) {
  try {
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('✅ Archivo de configuración actualizado correctamente');
  } catch (error) {
    console.error('Error al escribir el archivo de configuración:', error.message);
    process.exit(1);
  }
}

// Función para actualizar la configuración
function updateConfig(mode) {
  const content = readConfigFile();
  
  let newContent;
  
  if (mode === 'development') {
    // Activar todos los sistemas para desarrollo
    newContent = content.replace(
      /ENABLE_ERROR_HANDLER: false/g,
      'ENABLE_ERROR_HANDLER: true'
    ).replace(
      /ENABLE_TOAST_STANDARDIZATION: false/g,
      'ENABLE_TOAST_STANDARDIZATION: true'
    ).replace(
      /ENABLE_REACT_QUERY: false/g,
      'ENABLE_REACT_QUERY: true'
    ).replace(
      /ENABLE_OPTIMIZED_PAGINATION: false/g,
      'ENABLE_OPTIMIZED_PAGINATION: true'
    ).replace(
      /ENABLE_REACT_MEMO: false/g,
      'ENABLE_REACT_MEMO: true'
    ).replace(
      /ENABLE_OPTIMIZATION_HOOKS: false/g,
      'ENABLE_OPTIMIZATION_HOOKS: true'
    ).replace(
      /ENABLE_LOADING_STATES: false/g,
      'ENABLE_LOADING_STATES: true'
    ).replace(
      /ENABLE_FORM_VALIDATION: false/g,
      'ENABLE_FORM_VALIDATION: true'
    );
    
    console.log('🔧 Activando modo DESARROLLO - Todos los sistemas de seguridad habilitados');
    
  } else if (mode === 'deployment') {
    // Desactivar todos los sistemas para despliegue
    newContent = content.replace(
      /ENABLE_ERROR_HANDLER: true/g,
      'ENABLE_ERROR_HANDLER: false'
    ).replace(
      /ENABLE_TOAST_STANDARDIZATION: true/g,
      'ENABLE_TOAST_STANDARDIZATION: false'
    ).replace(
      /ENABLE_REACT_QUERY: true/g,
      'ENABLE_REACT_QUERY: false'
    ).replace(
      /ENABLE_OPTIMIZED_PAGINATION: true/g,
      'ENABLE_OPTIMIZED_PAGINATION: false'
    ).replace(
      /ENABLE_REACT_MEMO: true/g,
      'ENABLE_REACT_MEMO: false'
    ).replace(
      /ENABLE_OPTIMIZATION_HOOKS: true/g,
      'ENABLE_OPTIMIZATION_HOOKS: false'
    ).replace(
      /ENABLE_LOADING_STATES: true/g,
      'ENABLE_LOADING_STATES: false'
    ).replace(
      /ENABLE_FORM_VALIDATION: true/g,
      'ENABLE_FORM_VALIDATION: false'
    );
    
    console.log('🚀 Activando modo DESPLIEGUE - Todos los sistemas de seguridad deshabilitados');
    
  } else {
    console.error('❌ Modo no válido. Usa --mode=development o --mode=deployment');
    process.exit(1);
  }
  
  writeConfigFile(newContent);
}

// Función para mostrar el estado actual
function showStatus() {
  const content = readConfigFile();
  
  console.log('\n📊 Estado actual de los sistemas de seguridad:\n');
  
  const systems = [
    'ENABLE_ERROR_HANDLER',
    'ENABLE_TOAST_STANDARDIZATION', 
    'ENABLE_REACT_QUERY',
    'ENABLE_OPTIMIZED_PAGINATION',
    'ENABLE_REACT_MEMO',
    'ENABLE_OPTIMIZATION_HOOKS',
    'ENABLE_LOADING_STATES',
    'ENABLE_FORM_VALIDATION'
  ];
  
  let enabledCount = 0;
  
  systems.forEach(system => {
    const isEnabled = content.includes(`${system}: true`);
    const status = isEnabled ? '✅ Activado' : '❌ Desactivado';
    const name = system.replace('ENABLE_', '').replace(/_/g, ' ').toLowerCase();
    
    console.log(`${status} - ${name}`);
    
    if (isEnabled) enabledCount++;
  });
  
  console.log(`\n📈 Resumen: ${enabledCount} de ${systems.length} sistemas activos`);
  
  if (enabledCount === 0) {
    console.log('🎯 Listo para despliegue en GitHub y servidor');
  } else if (enabledCount === systems.length) {
    console.log('🔧 Modo desarrollo activo');
  } else {
    console.log('⚠️  Configuración mixta - algunos sistemas activos');
  }
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 Script de Control de Sistemas de Seguridad

Uso:
  node scripts/toggle-security-systems.js --mode=development
  node scripts/toggle-security-systems.js --mode=deployment  
  node scripts/toggle-security-systems.js --status

Modos disponibles:
  development  - Activa todos los sistemas de seguridad
  deployment   - Desactiva todos los sistemas de seguridad
  status       - Muestra el estado actual de los sistemas
    `);
    return;
  }
  
  const modeArg = args.find(arg => arg.startsWith('--mode='));
  const statusArg = args.find(arg => arg === '--status');
  
  if (statusArg) {
    showStatus();
  } else if (modeArg) {
    const mode = modeArg.split('=')[1];
    updateConfig(mode);
  } else {
    console.error('❌ Argumento no válido. Usa --mode=development, --mode=deployment o --status');
    process.exit(1);
  }
}

// Ejecutar el script
main(); 