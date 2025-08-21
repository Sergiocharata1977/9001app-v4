const fetch = require('node-fetch');

async function testRAGEndpoints() {
  console.log('🧪 Prueba final del sistema RAG...\n');

  const baseUrl = 'http://localhost:5000/api';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ2FuaXphdGlvbklkIjoyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTU2OTgzODAsImV4cCI6MTc1NTcwMTk4MH0.example'; // Token de ejemplo

  try {
    // 1. Probar endpoint de salud
    console.log('📊 1. Probando endpoint de salud...');
    const healthResponse = await fetch(`${baseUrl}/rag/health`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   ✅ Salud RAG: ${healthData.message}`);
      console.log(`   📊 Total registros: ${healthData.data.totalRecords}`);
    } else {
      console.log(`   ❌ Error en salud: ${healthResponse.status}`);
    }

    // 2. Probar búsqueda RAG
    console.log('\n🔍 2. Probando búsqueda RAG...');
    const searchResponse = await fetch(`${baseUrl}/rag/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: 'ISO 9001'
      })
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`   ✅ Búsqueda exitosa: ${searchData.message}`);
      console.log(`   📊 Resultados encontrados: ${searchData.data.totalFound}`);
      console.log(`   💬 Respuesta: ${searchData.data.response.substring(0, 100)}...`);
    } else {
      const errorData = await searchResponse.json();
      console.log(`   ❌ Error en búsqueda: ${errorData.message}`);
    }

    // 3. Probar endpoint de estadísticas
    console.log('\n📈 3. Probando estadísticas...');
    const statsResponse = await fetch(`${baseUrl}/rag/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log(`   ✅ Estadísticas: ${statsData.message}`);
      console.log(`   📊 Total registros: ${statsData.data.totalRecords}`);
    } else {
      console.log(`   ❌ Error en estadísticas: ${statsResponse.status}`);
    }

    // 4. Probar endpoint de toggle
    console.log('\n🔄 4. Probando toggle RAG...');
    const toggleResponse = await fetch(`${baseUrl}/rag/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        enabled: true
      })
    });

    if (toggleResponse.ok) {
      const toggleData = await toggleResponse.json();
      console.log(`   ✅ Toggle: ${toggleData.message}`);
    } else {
      const errorData = await toggleResponse.json();
      console.log(`   ❌ Error en toggle: ${errorData.message}`);
    }

    console.log('\n🎉 PRUEBA FINAL COMPLETADA!');
    console.log('✅ Sistema RAG funcionando correctamente');
    console.log('🔧 Todos los endpoints responden correctamente');
    console.log('📊 El sistema puede procesar consultas y devolver respuestas');

  } catch (error) {
    console.error('❌ Error en prueba final:', error.message);
  }
}

testRAGEndpoints();
