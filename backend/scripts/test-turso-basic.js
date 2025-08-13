const { executeQuery } = require('../lib/tursoClient.js');

async function testTurso() {
  console.log('🔍 Probando conexión básica con Turso...');
  
  try {
    // Test 1: Conexión simple
    console.log('📡 Test 1: SELECT 1');
    const result1 = await executeQuery('SELECT 1 as test');
    console.log('✅ Test 1 exitoso:', result1);
    
    // Test 2: Listar tablas
    console.log('📡 Test 2: Listar tablas');
    const result2 = await executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('✅ Test 2 exitoso:', result2);
    
    // Test 3: Verificar tabla organizations
    console.log('📡 Test 3: Verificar tabla organizations');
    const result3 = await executeQuery("SELECT COUNT(*) as count FROM organizations");
    console.log('✅ Test 3 exitoso:', result3);
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
    console.error('🔍 Stack:', error.stack);
  }
}

testTurso();
