const { executeQuery } = require('../lib/tursoClient.js');

async function diagnosticoTurso() {
  try {
    console.log('🔍 DIAGNÓSTICO SIMPLE DE TURSO');
    console.log('================================');
    
    // 1. Verificar conexión básica
    console.log('\n1️⃣ Probando conexión básica...');
    const testResult = await executeQuery('SELECT 1 as test');
    console.log('✅ Conexión exitosa:', testResult);
    
    // 2. Listar todas las tablas
    console.log('\n2️⃣ Listando todas las tablas...');
    const tablesResult = await executeQuery("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    
    console.log('📋 Tablas encontradas:');
    if (tablesResult.rows && tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.name}`);
      });
    } else {
      console.log('   ❌ No se encontraron tablas');
    }
    
    // 3. Verificar tabla organizations específicamente
    console.log('\n3️⃣ Verificando tabla organizations...');
    const orgCheck = await executeQuery("SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'");
    
    if (orgCheck.rows && orgCheck.rows.length > 0) {
      console.log('✅ Tabla organizations existe');
      
      // Contar registros
      const orgCount = await executeQuery('SELECT COUNT(*) as count FROM organizations');
      console.log(`📊 Total organizaciones: ${orgCount.rows[0].count}`);
      
      // Mostrar estructura
      const orgStructure = await executeQuery('PRAGMA table_info(organizations)');
      console.log('📋 Estructura de organizations:');
      orgStructure.rows.forEach(row => {
        console.log(`   - ${row.name} (${row.type})`);
      });
      
    } else {
      console.log('❌ Tabla organizations NO existe');
    }
    
    // 4. Verificar tabla usuarios
    console.log('\n4️⃣ Verificando tabla usuarios...');
    const userCheck = await executeQuery("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'");
    
    if (userCheck.rows && userCheck.rows.length > 0) {
      console.log('✅ Tabla usuarios existe');
      
      // Contar registros
      const userCount = await executeQuery('SELECT COUNT(*) as count FROM usuarios');
      console.log(`📊 Total usuarios: ${userCount.rows[0].count}`);
      
    } else {
      console.log('❌ Tabla usuarios NO existe');
    }
    
    console.log('\n🎉 Diagnóstico completado');
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit(0);
  }
}

diagnosticoTurso();
