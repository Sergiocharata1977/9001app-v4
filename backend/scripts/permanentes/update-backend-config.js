const fs = require('fs');
const path = require('path');

// Configuración de isoflow4
const ISOFLOW4_CONFIG = {
  url: 'libsql://isoflow4-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU2OTAwMDYsImlkIjoiYjRjZTU4MWItZjc3Yy00OTY4LTgxODYtNjEwM2E4MmY0NWQxIiwicmlkIjoiMmI4MTUwOWEtYWQ2Yy00NThkLTg2OTMtYjQ3ZDQ1OWFkYWNiIn0.hs83X428FW-ZjxGvLZ1eWE6Gjp4JceY2e88VDSAgaLHOxVe-IntR-S_-bQoyA-UnMnoFYJtP-PiktziqDMOVDw'
};

class BackendConfigUpdater {
  constructor() {
    this.backendRoot = path.join(__dirname, '..', '..');
    this.configFiles = [
      'lib/tursoClient.js',
      'config/env-setup.js',
      'RAG-Backend/config/rag.config.js'
    ];
  }

  async updateAllConfigs() {
    console.log('🔧 Actualizando configuración del backend para isoflow4...\n');
    
    try {
      // 1. Actualizar tursoClient.js
      await this.updateTursoClient();
      
      // 2. Actualizar env-setup.js
      await this.updateEnvSetup();
      
      // 3. Actualizar rag.config.js
      await this.updateRAGConfig();
      
      // 4. Crear archivo de configuración de respaldo
      await this.createBackupConfig();
      
      console.log('\n✅ Configuración del backend actualizada correctamente!');
      console.log('🚀 El sistema ahora usa isoflow4 como base de datos principal');
      
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
      process.exit(1);
    }
  }

  async updateTursoClient() {
    console.log('📝 Actualizando tursoClient.js...');
    
    const tursoClientPath = path.join(this.backendRoot, 'lib', 'tursoClient.js');
    
    if (!fs.existsSync(tursoClientPath)) {
      console.log('⚠️ Archivo tursoClient.js no encontrado, creando...');
    }
    
    const tursoClientContent = `const { createClient } = require('@libsql/client');

// Configuración de la base de datos isoflow4
const tursoClient = createClient({
  url: '${ISOFLOW4_CONFIG.url}',
  authToken: '${ISOFLOW4_CONFIG.authToken}'
});

module.exports = tursoClient;
`;
    
    fs.writeFileSync(tursoClientPath, tursoClientContent);
    console.log('✅ tursoClient.js actualizado');
  }

  async updateEnvSetup() {
    console.log('📝 Actualizando env-setup.js...');
    
    const envSetupPath = path.join(this.backendRoot, 'config', 'env-setup.js');
    
    if (!fs.existsSync(envSetupPath)) {
      console.log('⚠️ Archivo env-setup.js no encontrado, creando...');
    }
    
    const envSetupContent = `// Configuración de variables de entorno para isoflow4
require('dotenv').config();

const loadEnvConfig = () => {
  return {
    // Configuración de base de datos isoflow4
    TURSO_DATABASE_URL: '${ISOFLOW4_CONFIG.url}',
    TURSO_AUTH_TOKEN: '${ISOFLOW4_CONFIG.authToken}',
    
    // Otras configuraciones
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    
    // Configuración RAG
    RAG_ENABLED: process.env.RAG_ENABLED || 'true',
    RAG_MODEL_PROVIDER: process.env.RAG_MODEL_PROVIDER || 'local',
    RAG_MODEL_NAME: process.env.RAG_MODEL_NAME || 'sentence-transformers/all-MiniLM-L6-v2',
    
    // Configuración de archivos
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760, // 10MB
  };
};

module.exports = { loadEnvConfig };
`;
    
    fs.writeFileSync(envSetupPath, envSetupContent);
    console.log('✅ env-setup.js actualizado');
  }

  async updateRAGConfig() {
    console.log('📝 Actualizando rag.config.js...');
    
    const ragConfigPath = path.join(this.backendRoot, 'RAG-Backend', 'config', 'rag.config.js');
    
    if (!fs.existsSync(ragConfigPath)) {
      console.log('⚠️ Archivo rag.config.js no encontrado, creando...');
    }
    
    const ragConfigContent = `// Configuración RAG para isoflow4
const RAG_CONFIG = {
  // Configuración de base de datos
  database: {
    url: '${ISOFLOW4_CONFIG.url}',
    authToken: '${ISOFLOW4_CONFIG.authToken}'
  },
  
  // Configuración de modelos
  models: {
    provider: process.env.RAG_MODEL_PROVIDER || 'local',
    name: process.env.RAG_MODEL_NAME || 'sentence-transformers/all-MiniLM-L6-v2',
    maxTokens: 4096
  },
  
  // Configuración de indexación
  indexing: {
    chunkSize: 1000,
    chunkOverlap: 200,
    maxChunks: 10000
  },
  
  // Configuración de búsqueda
  search: {
    topK: 5,
    similarityThreshold: 0.7,
    maxResults: 10
  },
  
  // Configuración de generación
  generation: {
    temperature: 0.7,
    maxLength: 500,
    includeSources: true
  },
  
  // Configuración de organizaciones
  organizations: {
    enabled: [1, 2], // IDs de organizaciones habilitadas
    globalNorms: true // Incluir normas con organization_id = 0
  }
};

module.exports = RAG_CONFIG;
`;
    
    fs.writeFileSync(ragConfigPath, ragConfigContent);
    console.log('✅ rag.config.js actualizado');
  }

  async createBackupConfig() {
    console.log('📝 Creando archivo de configuración de respaldo...');
    
    const backupPath = path.join(this.backendRoot, 'config', 'isoflow4-config.json');
    
    const backupConfig = {
      timestamp: new Date().toISOString(),
      database: {
        name: 'isoflow4',
        url: ISOFLOW4_CONFIG.url,
        authToken: ISOFLOW4_CONFIG.authToken
      },
      description: 'Configuración de respaldo para isoflow4',
      version: '1.0.0'
    };
    
    fs.writeFileSync(backupPath, JSON.stringify(backupConfig, null, 2));
    console.log('✅ Archivo de respaldo creado');
  }

  async showCurrentConfig() {
    console.log('\n📋 Configuración actual del backend:');
    
    for (const configFile of this.configFiles) {
      const fullPath = path.join(this.backendRoot, configFile);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const hasISOFlow4 = content.includes('isoflow4');
        
        console.log(`📄 ${configFile}: ${hasISOFlow4 ? '✅' : '❌'} ${hasISOFlow4 ? 'Configurado para isoflow4' : 'No configurado para isoflow4'}`);
      } else {
        console.log(`📄 ${configFile}: ❌ No encontrado`);
      }
    }
  }
}

// Funciones de utilidad
async function showHelp() {
  console.log(`
🔧 Backend Config Updater - Actualizar configuración para isoflow4

Uso: node scripts/permanentes/update-backend-config.js [comando]

Comandos disponibles:
  update   - Actualizar toda la configuración del backend
  status   - Mostrar estado actual de la configuración
  help     - Mostrar esta ayuda

Ejemplos:
  node scripts/permanentes/update-backend-config.js update
  node scripts/permanentes/update-backend-config.js status
  `);
}

// Ejecución principal
async function main() {
  const command = process.argv[2] || 'help';
  const updater = new BackendConfigUpdater();
  
  switch (command) {
    case 'update':
      await updater.updateAllConfigs();
      break;
    case 'status':
      await updater.showCurrentConfig();
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

module.exports = { BackendConfigUpdater };
