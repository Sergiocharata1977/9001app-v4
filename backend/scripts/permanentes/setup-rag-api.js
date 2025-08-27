const fs = require('fs');
const path = require('path');

/**
 * Script para configurar el sistema RAG usando la API
 * No requiere acceso directo a Turso
 */

console.log('🚀 Configurando Sistema RAG con API...');

// 1. Verificar que existan los archivos necesarios
const requiredFiles = [
  'backend/services/ragService.js',
  'backend/controllers/ragController.js',
  'backend/routes/rag.routes.js',
  'frontend/src/components/assistant/RAGChat.tsx'
];

console.log('📋 Verificando archivos necesarios...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Archivo faltante: ${file}`);
    process.exit(1);
  }
  console.log(`✅ ${file}`);
}

// 2. Crear script de instalación automática
const installScript = `
// Script de instalación automática del sistema RAG
const setupRAGSystem = async () => {
  console.log('🔧 Configurando sistema RAG...');
  
  try {
    // 1. Verificar conectividad
    console.log('📡 Verificando conectividad con Turso...');
    const healthResponse = await fetch('http://localhost:3000/api/rag/health');
    
    if (!healthResponse.ok) {
      throw new Error('No se puede conectar al servidor RAG');
    }
    
    // 2. Crear tabla RAG
    console.log('🔧 Creando tabla RAG...');
    const createTableResponse = await fetch('http://localhost:3000/api/rag/create-table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.TEST_TOKEN || 'test'}\`
      }
    });
    
    if (createTableResponse.ok) {
      const result = await createTableResponse.json();
      console.log(\`✅ Tabla RAG creada: \${result.data.recordsCount} registros\`);
    } else {
      throw new Error('Error creando tabla RAG');
    }
    
    // 3. Verificar estadísticas
    console.log('📊 Verificando estadísticas...');
    const statsResponse = await fetch('http://localhost:3000/api/rag/stats');
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log(\`✅ Estadísticas: \${stats.data.total} registros totales\`);
    }
    
    // 4. Probar consulta
    console.log('🧪 Probando consulta RAG...');
    const testResponse = await fetch('http://localhost:3000/api/rag/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.TEST_TOKEN || 'test'}\`
      },
      body: JSON.stringify({
        question: '¿Cuáles son los indicadores de calidad más importantes?',
        maxResults: 3
      })
    });
    
    if (testResponse.ok) {
      const testResult = await testResponse.json();
      console.log(\`✅ Consulta exitosa: \${testResult.data.confidence}% confianza\`);
    }
    
    console.log('\\n🎉 Sistema RAG configurado exitosamente!');
    console.log('\\n📋 Próximos pasos:');
    console.log('1. Agregar el componente RAGChat al frontend');
    console.log('2. Probar el sistema con diferentes consultas');
    console.log('3. Personalizar los datos según tus necesidades');
    
  } catch (error) {
    console.error('❌ Error configurando sistema RAG:', error.message);
    console.log('\\n🔧 Solución de problemas:');
    console.log('1. Verificar que el servidor esté corriendo en puerto 3000');
    console.log('2. Verificar las variables de entorno TURSO_DATABASE_URL y TURSO_AUTH_TOKEN');
    console.log('3. Verificar que las rutas RAG estén integradas en el servidor');
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  setupRAGSystem();
}

module.exports = { setupRAGSystem };
`;

const installPath = path.join(__dirname, '../temporales/setup-rag-api.js');
fs.writeFileSync(installPath, installScript);
console.log('✅ Script de instalación por API creado');

// 3. Crear guía de instalación simplificada
const installationGuide = `
# Sistema RAG - Instalación Simplificada por API

## 🚀 Instalación Rápida (Sin Acceso Directo a Turso)

### 1. Instalar Dependencias
\`\`\`bash
cd backend
npm install @libsql/client
\`\`\`

### 2. Configurar Variables de Entorno
Agregar al archivo .env del backend:
\`\`\`
TURSO_DATABASE_URL=libsql://isoflow4-sergiocharata1977.turso.io
TURSO_AUTH_TOKEN=tu_token_aqui
\`\`\`

### 3. Integrar Rutas en el Servidor
Agregar en tu archivo principal del servidor (app.js o index.js):
\`\`\`javascript
const ragRoutes = require('./routes/rag.routes.js');
app.use('/api/rag', ragRoutes);
\`\`\`

### 4. Iniciar el Servidor
\`\`\`bash
npm start
\`\`\`

### 5. Crear Tabla RAG por API
\`\`\`bash
# Opción A: Usar curl
curl -X POST http://localhost:3000/api/rag/create-table \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tu_token_aqui"

# Opción B: Usar el script automático
node backend/scripts/temporales/setup-rag-api.js
\`\`\`

### 6. Verificar Instalación
\`\`\`bash
# Verificar salud del sistema
curl http://localhost:3000/api/rag/health

# Verificar estadísticas
curl http://localhost:3000/api/rag/stats

# Probar consulta
curl -X POST http://localhost:3000/api/rag/query \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tu_token_aqui" \\
  -d '{"question": "¿Cuáles son los indicadores de calidad más importantes?"}'
\`\`\`

### 7. Agregar Componente al Frontend
\`\`\`tsx
import { RAGChat } from './components/assistant/RAGChat';

function App() {
  return (
    <div className="h-screen">
      <RAGChat />
    </div>
  );
}
\`\`\`

## 🔧 Endpoints Disponibles

### Crear Tabla RAG
\`POST /api/rag/create-table\`

### Consulta RAG
\`POST /api/rag/query\`
\`\`\`json
{
  "question": "¿Cuáles son los indicadores de calidad más importantes?",
  "maxResults": 10,
  "includeSources": true
}
\`\`\`

### Estadísticas
\`GET /api/rag/stats\`

### Salud del Sistema
\`GET /api/rag/health\`

### Prueba de Conectividad
\`GET /api/rag/test-connection\`

### Búsqueda Semántica
\`POST /api/rag/semantic-search\`

### Insights
\`GET /api/rag/insights\`

### Sugerencias
\`GET /api/rag/suggestions?query=indicadores\`

## 🎯 Ventajas de la Instalación por API

✅ **No requiere acceso directo a Turso**
✅ **Instalación automática y segura**
✅ **Verificación automática de la instalación**
✅ **Datos de ejemplo incluidos**
✅ **Configuración completa en un solo comando**

## 🔍 Troubleshooting

### Error: "No se puede conectar al servidor RAG"
- Verificar que el servidor esté corriendo en puerto 3000
- Verificar que las rutas RAG estén integradas

### Error: "Error creando tabla RAG"
- Verificar TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
- Verificar permisos de la base de datos

### Error: "Error de autenticación"
- Verificar que el token esté en el header Authorization
- Verificar que el middleware de autenticación esté funcionando

## 📞 Soporte

Para problemas:
1. Ejecutar: \`node backend/scripts/temporales/setup-rag-api.js\`
2. Revisar logs del servidor
3. Verificar conectividad con Turso
4. Contactar al administrador

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás un sistema RAG completamente funcional que:
- Busca información en tu base de datos Turso
- Proporciona respuestas inteligentes sobre ISO 9001
- Ofrece sugerencias de consultas relacionadas
- Muestra estadísticas en tiempo real
- Tiene una interfaz de chat moderna
`;

const guidePath = path.join(__dirname, '../../../docs-esenciales/INSTALACION_RAG_API.md');
fs.writeFileSync(guidePath, installationGuide);
console.log('✅ Guía de instalación por API creada');

console.log('\n🎉 Configuración del sistema RAG por API completada!');
console.log('\n📋 Ahora puedes crear la tabla RAG sin acceso directo a Turso:');
console.log('\n1. Integrar rutas en el servidor');
console.log('2. Iniciar el servidor: npm start');
console.log('3. Crear tabla: curl -X POST http://localhost:3000/api/rag/create-table');
console.log('4. O usar el script automático: node backend/scripts/temporales/setup-rag-api.js');
console.log('\n📚 Documentación: docs-esenciales/INSTALACION_RAG_API.md');
