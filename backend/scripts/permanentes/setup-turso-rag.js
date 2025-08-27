const fs = require('fs');
const path = require('path');

/**
 * Script para configurar el sistema RAG con Turso
 * Este script integra las rutas RAG en el servidor principal
 */

console.log('🚀 Configurando sistema RAG con Turso...');

// 1. Verificar que existan los archivos necesarios
const requiredFiles = [
  'backend/RAG-System/services/tursoRAGService.ts',
  'backend/RAG-System/controllers/tursoRAGController.ts',
  'backend/RAG-System/routes/tursoRAGRoutes.ts'
];

console.log('📋 Verificando archivos necesarios...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Archivo faltante: ${file}`);
    process.exit(1);
  }
  console.log(`✅ ${file}`);
}

// 2. Crear archivo de configuración de variables de entorno
const envConfig = `
# Configuración para Sistema RAG con Turso
TURSO_DATABASE_URL=libsql://isoflow4-sergiocharata1977.turso.io
TURSO_AUTH_TOKEN=tu_token_aqui
OPENAI_API_KEY=tu_openai_api_key_aqui

# Configuración adicional para RAG
RAG_MAX_RESULTS=10
RAG_CONTEXT_SIZE=5
RAG_CONFIDENCE_THRESHOLD=60
`;

const envPath = path.join(__dirname, '../../.env.rag');
fs.writeFileSync(envPath, envConfig);
console.log('✅ Archivo de configuración .env.rag creado');

// 3. Crear script de migración para tabla RAG
const migrationSQL = `
-- Migración para tabla RAG_DATA
-- Ejecutar en Turso para habilitar el sistema RAG

CREATE TABLE IF NOT EXISTS rag_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    codigo TEXT,
    contenido TEXT NOT NULL,
    estado TEXT DEFAULT 'activo',
    organizacion_id TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT,
    relevancia_score REAL DEFAULT 0
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_rag_tipo ON rag_data(tipo);
CREATE INDEX IF NOT EXISTS idx_rag_titulo ON rag_data(titulo);
CREATE INDEX IF NOT EXISTS idx_rag_estado ON rag_data(estado);
CREATE INDEX IF NOT EXISTS idx_rag_organizacion ON rag_data(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_rag_fecha ON rag_data(fecha_actualizacion);

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER IF NOT EXISTS update_rag_timestamp 
    AFTER UPDATE ON rag_data
    FOR EACH ROW
BEGIN
    UPDATE rag_data SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insertar datos de ejemplo
INSERT OR IGNORE INTO rag_data (tipo, titulo, codigo, contenido, organizacion_id) VALUES
('norma', 'ISO 9001:2015 - Requisitos generales', 'ISO-9001-2015', 'La norma ISO 9001:2015 establece los requisitos para un sistema de gestión de calidad que puede ser utilizado para aplicación interna por las organizaciones, para certificación o con fines contractuales.', 'default'),
('proceso', 'Proceso de Gestión de Calidad', 'PROC-001', 'Proceso principal que define cómo la organización gestiona la calidad de sus productos y servicios, incluyendo la planificación, implementación y mejora continua.', 'default'),
('indicador', 'Indicador de Satisfacción del Cliente', 'IND-001', 'Medición de la satisfacción del cliente basada en encuestas y feedback recibido, con objetivo de mantener un nivel superior al 85%.', 'default'),
('auditoria', 'Auditoría Interna de Calidad', 'AUD-001', 'Proceso de auditoría interna que verifica el cumplimiento del sistema de gestión de calidad y la efectividad de los procesos implementados.', 'default'),
('hallazgo', 'No Conformidad en Documentación', 'HAL-001', 'Hallazgo identificado durante auditoría interna relacionado con documentación desactualizada en el proceso de control de calidad.', 'default'),
('accion', 'Acción Correctiva - Actualización de Documentos', 'ACC-001', 'Acción correctiva implementada para actualizar toda la documentación del sistema de gestión de calidad y establecer proceso de revisión periódica.', 'default'),
('documento', 'Manual de Calidad', 'DOC-001', 'Documento principal que describe el sistema de gestión de calidad de la organización, incluyendo políticas, objetivos y estructura organizacional.', 'default'),
('personal', 'Responsable de Calidad', 'PER-001', 'Descripción del puesto y responsabilidades del responsable del sistema de gestión de calidad, incluyendo competencias requeridas.', 'default'),
('capacitacion', 'Capacitación en ISO 9001', 'CAP-001', 'Programa de capacitación para todo el personal sobre los requisitos de la norma ISO 9001:2015 y su aplicación en la organización.', 'default'),
('minuta', 'Reunión de Revisión por la Dirección', 'MIN-001', 'Minuta de la reunión mensual de revisión por la dirección donde se analizan los indicadores de calidad y se toman decisiones de mejora.', 'default');
`;

const migrationPath = path.join(__dirname, '../migrations/20241222_setup_rag_system.sql');
fs.writeFileSync(migrationPath, migrationSQL);
console.log('✅ Script de migración RAG creado');

// 4. Crear archivo de integración de rutas
const routesIntegration = `
// Integración de rutas RAG en el servidor principal
// Agregar en el archivo principal de rutas (app.js o index.js)

import tursoRAGRoutes from './RAG-System/routes/tursoRAGRoutes.js';

// Agregar las rutas RAG
app.use('/api/rag', tursoRAGRoutes);

console.log('✅ Rutas RAG con Turso integradas en /api/rag');
`;

const integrationPath = path.join(__dirname, '../../routes-integration-rag.js');
fs.writeFileSync(integrationPath, routesIntegration);
console.log('✅ Archivo de integración de rutas creado');

// 5. Crear documentación de uso
const documentation = `
# Sistema RAG con Turso e IA

## Descripción
Sistema de Retrieval Augmented Generation (RAG) que integra OpenAI con la base de datos Turso para proporcionar respuestas inteligentes sobre el Sistema de Gestión de Calidad ISO 9001.

## Características
- ✅ Consulta RAG con IA (OpenAI GPT-4)
- ✅ Búsqueda semántica avanzada
- ✅ Análisis de insights y tendencias
- ✅ Sugerencias de consultas relacionadas
- ✅ Estadísticas en tiempo real
- ✅ Integración con Turso Database

## Configuración

### 1. Variables de Entorno
Agregar al archivo .env:
\`\`\`
TURSO_DATABASE_URL=libsql://isoflow4-sergiocharata1977.turso.io
TURSO_AUTH_TOKEN=tu_token_aqui
OPENAI_API_KEY=tu_openai_api_key_aqui
\`\`\`

### 2. Instalar Dependencias
\`\`\`bash
npm install @libsql/client openai
\`\`\`

### 3. Ejecutar Migración
\`\`\`bash
# Conectar a Turso y ejecutar el script de migración
npx turso db shell isoflow4 < backend/scripts/migrations/20241222_setup_rag_system.sql
\`\`\`

### 4. Integrar Rutas
Agregar en el archivo principal del servidor:
\`\`\`javascript
import tursoRAGRoutes from './RAG-System/routes/tursoRAGRoutes.js';
app.use('/api/rag', tursoRAGRoutes);
\`\`\`

## Endpoints Disponibles

### POST /api/rag/query
Procesa una consulta RAG con IA
\`\`\`json
{
  "question": "¿Cuáles son los indicadores de calidad más importantes?",
  "organizationId": "default",
  "maxResults": 10,
  "includeSources": true,
  "contextSize": 5
}
\`\`\`

### GET /api/rag/stats
Obtiene estadísticas del sistema RAG

### GET /api/rag/test-connection
Prueba la conectividad con Turso

### POST /api/rag/semantic-search
Búsqueda semántica avanzada
\`\`\`json
{
  "query": "auditorías recientes",
  "filters": { "tipo": "auditoria" },
  "limit": 20
}
\`\`\`

### GET /api/rag/insights
Genera insights y análisis de tendencias

### GET /api/rag/suggestions
Obtiene sugerencias de consultas relacionadas

## Uso en Frontend

### Componente React
\`\`\`tsx
import { TursoRAGChat } from './components/assistant/TursoRAGChat';

function App() {
  return (
    <div className="h-screen">
      <TursoRAGChat />
    </div>
  );
}
\`\`\`

### Ejemplo de Consulta
\`\`\`javascript
const response = await fetch('/api/rag/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    question: '¿Cuáles son los procesos principales del SGC?',
    maxResults: 5,
    includeSources: true
  })
});

const data = await response.json();
console.log(data.data.answer);
\`\`\`

## Tipos de Datos Soportados
- normas: Normas ISO y estándares
- procesos: Procesos del SGC
- indicadores: Indicadores de calidad
- auditorias: Auditorías internas y externas
- hallazgos: No conformidades y hallazgos
- acciones: Acciones correctivas y preventivas
- documentos: Documentación del SGC
- personal: Personal y responsabilidades
- capacitaciones: Programas de capacitación
- minutas: Minutas de reuniones

## Monitoreo y Mantenimiento

### Verificar Estado del Sistema
\`\`\`bash
curl -H "Authorization: Bearer \${token}" http://localhost:3000/api/rag/health
\`\`\`

### Estadísticas del Sistema
\`\`\`bash
curl -H "Authorization: Bearer \${token}" http://localhost:3000/api/rag/stats
\`\`\`

### Prueba de Conectividad
\`\`\`bash
curl -H "Authorization: Bearer \${token}" http://localhost:3000/api/rag/test-connection
\`\`\`

## Troubleshooting

### Error de Conexión con Turso
1. Verificar TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
2. Comprobar conectividad de red
3. Verificar permisos de la base de datos

### Error de OpenAI
1. Verificar OPENAI_API_KEY
2. Comprobar límites de uso de la API
3. Verificar conectividad a OpenAI

### Baja Confianza en Respuestas
1. Revisar calidad de datos en Turso
2. Ajustar parámetros de búsqueda
3. Mejorar estructura de datos RAG

## Mejoras Futuras
- [ ] Vectorización de embeddings
- [ ] Cache inteligente de respuestas
- [ ] Análisis de sentimientos
- [ ] Integración con más modelos de IA
- [ ] Dashboard de analytics avanzado
`;

const docsPath = path.join(__dirname, '../../docs-esenciales/SISTEMA_RAG_TURSO.md');
fs.writeFileSync(docsPath, documentation);
console.log('✅ Documentación del sistema RAG creada');

// 6. Crear script de prueba
const testScript = `
// Script de prueba para el sistema RAG
const testRAGSystem = async () => {
  console.log('🧪 Probando sistema RAG con Turso...');
  
  const testQueries = [
    '¿Cuáles son los indicadores de calidad más importantes?',
    'Muéstrame los procesos del sistema de gestión de calidad',
    '¿Qué auditorías se han realizado recientemente?',
    'Cuáles son las acciones correctivas pendientes',
    '¿Qué capacitaciones están programadas?'
  ];
  
  for (const query of testQueries) {
    try {
      console.log(\`\\n📝 Probando: "\${query}"\`);
      
      const response = await fetch('http://localhost:3000/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.TEST_TOKEN || 'test'}\`
        },
        body: JSON.stringify({
          question: query,
          maxResults: 5,
          includeSources: true
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(\`✅ Respuesta: \${data.data.answer.substring(0, 100)}...\`);
        console.log(\`📊 Confianza: \${data.data.confidence}%\`);
        console.log(\`⏱️ Tiempo: \${data.data.processingTime}ms\`);
      } else {
        console.log(\`❌ Error: \${response.status}\`);
      }
    } catch (error) {
      console.log(\`❌ Error: \${error.message}\`);
    }
  }
  
  console.log('\\n🎉 Pruebas completadas');
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  testRAGSystem();
}

module.exports = { testRAGSystem };
`;

const testPath = path.join(__dirname, '../temporales/test-rag-system.js');
fs.writeFileSync(testPath, testScript);
console.log('✅ Script de prueba RAG creado');

console.log('\n🎉 Configuración del sistema RAG con Turso completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Configurar variables de entorno en .env');
console.log('2. Instalar dependencias: npm install @libsql/client openai');
console.log('3. Ejecutar migración en Turso');
console.log('4. Integrar rutas en el servidor principal');
console.log('5. Probar el sistema con el script de prueba');
console.log('\n📚 Documentación disponible en: docs-esenciales/SISTEMA_RAG_TURSO.md');
