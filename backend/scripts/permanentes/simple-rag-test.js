const { RAGDataModel } = require('../../RAG-Backend/models/rag.models.js');

async function simpleRAGTest() {
  console.log('🧪 Prueba simple del sistema RAG...\n');

  try {
    // 1. Probar documentos
    console.log('📄 1. Probando documentos...');
    const documentos = await RAGDataModel.getAllDocuments();
    console.log(`   ✅ Documentos: ${documentos.length} registros`);

    // 2. Probar normas
    console.log('\n📚 2. Probando normas...');
    const normas = await RAGDataModel.getAllNormas();
    console.log(`   ✅ Normas: ${normas.length} registros`);

    // 3. Probar personal
    console.log('\n👥 3. Probando personal...');
    const personal = await RAGDataModel.getPersonalInfo();
    console.log(`   ✅ Personal: ${personal.length} registros`);

    // 4. Probar auditorías
    console.log('\n🔍 4. Probando auditorías...');
    const auditorias = await RAGDataModel.getAuditoriasInfo();
    console.log(`   ✅ Auditorías: ${auditorias.length} registros`);

    // 5. Probar búsqueda
    console.log('\n🔍 5. Probando búsqueda...');
    const searchResults = await RAGDataModel.searchInSystemData('ISO 9001');
    console.log(`   ✅ Búsqueda "ISO 9001": ${searchResults.length} resultados`);

    // 6. Resumen
    console.log('\n🎉 RESUMEN:');
    console.log(`   📄 Documentos: ${documentos.length}`);
    console.log(`   📚 Normas: ${normas.length}`);
    console.log(`   👥 Personal: ${personal.length}`);
    console.log(`   🔍 Auditorías: ${auditorias.length}`);
    console.log(`   🔍 Búsquedas: ${searchResults.length} resultados para "ISO 9001"`);

    console.log('\n✅ Sistema RAG funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en prueba RAG:', error.message);
  }
}

simpleRAGTest();
