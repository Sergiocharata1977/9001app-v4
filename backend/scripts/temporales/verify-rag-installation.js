
// Script de verificación de instalación del sistema RAG
const verifyInstallation = async () => {
  console.log('🔍 Verificando instalación del sistema RAG...');
  
  const checks = [
    {
      name: 'Verificar archivos del backend',
      check: () => {
        const files = [
          'backend/services/ragService.js',
          'backend/controllers/ragController.js',
          'backend/routes/rag.routes.js'
        ];
        
        for (const file of files) {
          if (!require('fs').existsSync(file)) {
            throw new Error(`Archivo faltante: ${file}`);
          }
        }
        return true;
      }
    },
    {
      name: 'Verificar archivos del frontend',
      check: () => {
        const files = [
          'frontend/src/components/assistant/RAGChat.tsx'
        ];
        
        for (const file of files) {
          if (!require('fs').existsSync(file)) {
            throw new Error(`Archivo faltante: ${file}`);
          }
        }
        return true;
      }
    },
    {
      name: 'Verificar variables de entorno',
      check: () => {
        const required = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
          throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
        }
        return true;
      }
    },
    {
      name: 'Verificar conectividad con Turso',
      check: async () => {
        try {
          const { createClient } = require('@libsql/client');
          const client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN
          });
          
          const result = await client.execute('SELECT COUNT(*) as count FROM rag_data');
          console.log(`✅ Tabla RAG encontrada con ${result.rows[0].count} registros`);
          return true;
        } catch (error) {
          throw new Error(`Error conectando con Turso: ${error.message}`);
        }
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    try {
      console.log(`\n📋 ${check.name}...`);
      await check.check();
      console.log(`✅ ${check.name} - OK`);
      passed++;
    } catch (error) {
      console.log(`❌ ${check.name} - ERROR: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Resultado de verificación:`);
  console.log(`✅ Pasadas: ${passed}`);
  console.log(`❌ Fallidas: ${failed}`);
  
  if (failed === 0) {
    console.log(`\n🎉 ¡Instalación verificada correctamente!`);
    console.log(`El sistema RAG está listo para usar.`);
  } else {
    console.log(`\n⚠️ Hay problemas en la instalación. Revisa los errores arriba.`);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  verifyInstallation();
}

module.exports = { verifyInstallation };
