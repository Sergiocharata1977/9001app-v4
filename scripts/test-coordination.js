#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE PRUEBA - Sistema de Coordinación
 */

const fs = require('fs').promises;
const axios = require('axios');

async function testCoordination() {
  console.log('🧪 Probando sistema de coordinación...');
  
  try {
    // Probar endpoint
    const response = await axios.get('http://localhost:5000/api/coordinacion-document');
    console.log('✅ Endpoint funciona:', response.status);
    
    // Verificar archivo
    const content = await fs.readFile('COORDINACION-AGENTES.md', 'utf8');
    console.log('✅ Archivo existe:', content.length, 'caracteres');
    
    console.log('🎉 Sistema funcionando correctamente');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCoordination();
