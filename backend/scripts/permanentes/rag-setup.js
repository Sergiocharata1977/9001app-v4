const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos isoflow4
const mongoClient = createClient({
  url: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU2OTAwMDYsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.hs83X428FW-ZjxGvLZ1eWE6Gjp4JceY2e88VDSAgaLHOxVe-IntR-S_-bQoyA-UnMnoFYJtP-PiktziqDMOVDw'
});

class RAGSetup {
  constructor() {
    this.organizations = [1, 2]; // Organizaciones activas
  }

  async initialize() {
    console.log('🚀 Inicializando sistema RAG...\n');
    
    try {
      // 1. Verificar conexión
      await this.checkConnection();
      
      // 2. Verificar tablas RAG
      await this.checkRAGTables();
      
      // 3. Configurar organizaciones
      await this.setupOrganizations();
      
      // 4. Verificar datos disponibles
      await this.checkAvailableData();
      
      console.log('\n✅ Sistema RAG inicializado correctamente!');
      
    } catch (error) {
      console.error('❌ Error en inicialización RAG:', error);
      process.exit(1);
    }
  }

  async checkConnection() {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    try {
      const result = await mongoClient.execute({
        sql: 'SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"',
        args: []
      });
      
      console.log(`✅ Conexión exitosa. Total de tablas: ${result.rows[0].count}`);
    } catch (error) {
      throw new Error(`Error de conexión: ${error.message}`);
    }
  }

  async checkRAGTables() {
    console.log('\n🔍 Verificando tablas RAG...');
    
    const ragTables = await mongoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'rag_%' ORDER BY name",
      args: []
    });
    
    const expectedTables = ['rag_config', 'rag_embeddings', 'rag_queries', 'rag_sources'];
    const foundTables = ragTables.rows.map(row => row.name);
    
    console.log(`📋 Tablas RAG encontradas: ${foundTables.length}`);
    foundTables.forEach(table => console.log(`  - ${table}`));
    
    const missingTables = expectedTables.filter(table => !foundTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log(`⚠️ Tablas RAG faltantes: ${missingTables.join(', ')}`);
      console.log('💡 Ejecuta el script de creación de tablas RAG primero');
      throw new Error('Tablas RAG incompletas');
    }
    
    console.log('✅ Todas las tablas RAG están presentes');
  }

  async setupOrganizations() {
    console.log('\n⚙️ Configurando organizaciones...');
    
    for (const orgId of this.organizations) {
      try {
        // Verificar si la configuración existe
        const existingConfig = await mongoClient.execute({
          sql: 'SELECT * FROM rag_config WHERE organization_id = ?',
          args: [orgId]
        });
        
        if (existingConfig.rows.length === 0) {
          // Crear configuración por defecto
          await mongoClient.execute({
            sql: `INSERT INTO rag_config (
              organization_id, is_enabled, model_provider, model_name, 
              chunk_size, chunk_overlap, created_at, updated_at
            ) VALUES (?, TRUE, 'local', 'sentence-transformers/all-MiniLM-L6-v2', 1000, 200, datetime('now'), datetime('now'))`,
            args: [orgId]
          });
          console.log(`✅ Configuración RAG creada para organización ${orgId}`);
        } else {
          console.log(`✅ Configuración RAG ya existe para organización ${orgId}`);
        }
      } catch (error) {
        console.error(`❌ Error configurando organización ${orgId}:`, error.message);
      }
    }
  }

  async checkAvailableData() {
    console.log('\n📊 Verificando datos disponibles para indexación...');
    
    const dataChecks = [
      { table: 'normas', name: 'Normas ISO', global: true },
      { table: 'documentos', name: 'Documentos', global: false },
      { table: 'procesos', name: 'Procesos', global: false },
      { table: 'hallazgos', name: 'Hallazgos', global: false },
      { table: 'acciones', name: 'Acciones', global: false },
      { table: 'objetivos_calidad', name: 'Objetivos de Calidad', global: false }
    ];
    
    for (const check of dataChecks) {
      try {
        let sql = `SELECT COUNT(*) as count FROM ${check.table}`;
        let args = [];
        
        if (!check.global) {
          sql += ' WHERE organization_id IN (1, 2)';
        }
        
        const result = await mongoClient.execute({ sql, args });
        const count = result.rows[0].count;
        
        console.log(`📋 ${check.name}: ${count} registros`);
        
        if (check.global && count > 0) {
          const globalCount = await mongoClient.execute({
            sql: `SELECT COUNT(*) as count FROM ${check.table} WHERE organization_id = 0`,
            args: []
          });
          console.log(`  └─ Normas globales (organization_id = 0): ${globalCount.rows[0].count}`);
        }
        
      } catch (error) {
        console.log(`❌ Error verificando ${check.name}: ${error.message}`);
      }
    }
  }

  async getStatus() {
    console.log('\n📈 Estado del sistema RAG:');
    
    try {
      // Estadísticas de configuración
      const configStats = await mongoClient.execute({
        sql: 'SELECT COUNT(*) as total, SUM(CASE WHEN is_enabled THEN 1 ELSE 0 END) as enabled FROM rag_config',
        args: []
      });
      
      console.log(`⚙️ Configuraciones: ${configStats.rows[0].total} total, ${configStats.rows[0].enabled} habilitadas`);
      
      // Estadísticas de embeddings
      const embeddingStats = await mongoClient.execute({
        sql: 'SELECT COUNT(*) as total, COUNT(DISTINCT content_type) as types FROM rag_embeddings',
        args: []
      });
      
      console.log(`🧠 Embeddings: ${embeddingStats.rows[0].total} total, ${embeddingStats.rows[0].types} tipos de contenido`);
      
      // Estadísticas de consultas
      const queryStats = await mongoClient.execute({
        sql: 'SELECT COUNT(*) as total, MAX(created_at) as last_query FROM rag_queries',
        args: []
      });
      
      console.log(`💬 Consultas: ${queryStats.rows[0].total} total, última: ${queryStats.rows[0].last_query || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error.message);
    }
  }
}

// Funciones de utilidad
async function showHelp() {
  console.log(`
🔧 RAG Setup - Sistema de Configuración RAG

Uso: node scripts/permanentes/rag-setup.js [comando]

Comandos disponibles:
  init     - Inicializar sistema RAG completo
  status   - Mostrar estado del sistema RAG
  help     - Mostrar esta ayuda

Ejemplos:
  node scripts/permanentes/rag-setup.js init
  node scripts/permanentes/rag-setup.js status
  `);
}

// Ejecución principal
async function main() {
  const command = process.argv[2] || 'help';
  const ragSetup = new RAGSetup();
  
  switch (command) {
    case 'init':
      await ragSetup.initialize();
      break;
    case 'status':
      await ragSetup.getStatus();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RAGSetup };
