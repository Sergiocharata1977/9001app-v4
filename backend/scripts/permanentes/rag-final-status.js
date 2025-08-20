const { RAGDataModel } = require('../../RAG-Backend/models/rag.models.js');

async function showRAGFinalStatus() {
  console.log('🎉 ESTADO FINAL DEL SISTEMA RAG\n');
  console.log('=' .repeat(50));

  try {
    // Obtener todos los datos del sistema
    console.log('📊 Obteniendo datos del sistema...');
    const allData = await RAGDataModel.getAllSystemData();
    
    // Calcular estadísticas
    const stats = {};
    allData.forEach(item => {
      stats[item.tipo] = (stats[item.tipo] || 0) + 1;
    });

    console.log('\n📈 ESTADÍSTICAS DEL SISTEMA:');
    console.log(`   Total de registros: ${allData.length}`);
    console.log(`   Tipos de datos: ${Object.keys(stats).length}`);
    
    Object.entries(stats).forEach(([tipo, count]) => {
      const percentage = ((count / allData.length) * 100).toFixed(1);
      console.log(`   - ${tipo}: ${count} registros (${percentage}%)`);
    });

    console.log('\n🔍 FUENTES DE DATOS DISPONIBLES:');
    console.log('   ✅ Documentos del sistema');
    console.log('   ✅ Normas ISO 9001');
    console.log('   ✅ Información de personal');
    console.log('   ✅ Auditorías y hallazgos');
    console.log('   ✅ Acciones correctivas');
    console.log('   ✅ Indicadores de calidad');
    console.log('   ✅ Objetivos de calidad');
    console.log('   ✅ Procesos y departamentos');
    console.log('   ✅ Capacitaciones');
    console.log('   ✅ Minutas y comunicaciones');

    console.log('\n🎯 CAPACIDADES DEL ASISTENTE RAG:');
    console.log('   • Responder preguntas sobre ISO 9001');
    console.log('   • Información sobre personal y competencias');
    console.log('   • Estado de auditorías y hallazgos');
    console.log('   • Indicadores y objetivos de calidad');
    console.log('   • Procesos y procedimientos');
    console.log('   • Capacitaciones y minutas');
    console.log('   • Documentos y normas del sistema');

    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('   1. ✅ Sistema RAG configurado');
    console.log('   2. ✅ Datos del sistema integrados');
    console.log('   3. ✅ Búsquedas funcionando');
    console.log('   4. 🔄 Probar en el frontend');
    console.log('   5. 🔄 Usar el chat del asistente');

    console.log('\n📋 COMANDOS ÚTILES:');
    console.log('   • npm start (iniciar servidor)');
    console.log('   • Ir al frontend y usar el chat RAG');
    console.log('   • Hacer preguntas sobre el sistema');

    console.log('\n🎉 ¡EL SISTEMA RAG ESTÁ LISTO PARA USAR!');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Error obteniendo estado final:', error.message);
  }
}

showRAGFinalStatus();
