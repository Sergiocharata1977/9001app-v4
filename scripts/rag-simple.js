#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración simple
const DOCS_DIR = './docs';
const CACHE_FILE = './.rag-cache.json';

// Función para indexar documentos
function indexDocuments() {
  const documents = [];
  
  if (fs.existsSync(DOCS_DIR)) {
    const files = fs.readdirSync(DOCS_DIR);
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        documents.push({
          file: file,
          content: content,
          words: content.toLowerCase().split(/\s+/)
        });
      }
    });
  }
  
  // Guardar en caché
  fs.writeFileSync(CACHE_FILE, JSON.stringify(documents, null, 2));
  console.log(`✅ ${documents.length} documentos indexados`);
  
  return documents;
}

// Función de búsqueda simple
function searchDocuments(query, documents) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const results = [];
  
  documents.forEach(doc => {
    let score = 0;
    
    queryWords.forEach(word => {
      if (doc.words.includes(word)) {
        score += 1;
      }
    });
    
    if (score > 0) {
      results.push({
        file: doc.file,
        score: score,
        preview: doc.content.substring(0, 200) + '...'
      });
    }
  });
  
  // Ordenar por relevancia
  return results.sort((a, b) => b.score - a.score);
}

// Función para responder consultas
function answerQuery(query) {
  console.log(`🔍 Buscando: "${query}"`);
  
  let documents;
  
  // Cargar documentos desde caché o indexar
  if (fs.existsSync(CACHE_FILE)) {
    documents = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } else {
    documents = indexDocuments();
  }
  
  const results = searchDocuments(query, documents);
  
  if (results.length === 0) {
    console.log('❌ No se encontraron resultados');
    return;
  }
  
  console.log(`\n📋 Resultados encontrados:`);
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.file} (relevancia: ${result.score})`);
    console.log(`   ${result.preview}`);
  });
  
  // Respuesta simple
  const bestResult = results[0];
  console.log(`\n💡 Respuesta basada en: ${bestResult.file}`);
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 RAG Simple - Sistema de Búsqueda de Documentos');
    console.log('\nUso:');
    console.log('  node scripts/rag-simple.js "tu consulta"');
    console.log('  node scripts/rag-simple.js --index (para reindexar)');
    return;
  }
  
  if (args[0] === '--index') {
    indexDocuments();
    return;
  }
  
  const query = args.join(' ');
  answerQuery(query);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { indexDocuments, searchDocuments, answerQuery };
