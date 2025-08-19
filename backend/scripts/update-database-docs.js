const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Configuración directa de Turso
const tursoClient = createClient({
  url: 'libsql://iso-flow-respo-sergiocharata1977.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTIwMDc3MDcsImlkIjoiNGM4NWQwY2UtNTE2OS00NTI4LTgyMmUtYzc5YTMzOTYxMDM3IiwicmlkIjoiZjM0NjI0YWItNzZhYy00N2FiLTkxY2QtYWU4NDk5ZDY5MzczIn0.b2puA6ushwN3ovDQNO4fFvrK3gcU08y59rKgUSPv7KfFNEafGfapWMd5BC2rvbI2QzXCbAcRD66UKLVH4TouBA'
});

async function updateDatabaseDocs() {
  try {
    console.log('🔄 Actualizando documentación de base de datos...');
    
    // Obtener información básica
    const tablesResult = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      args: []
    });

    const viewsResult = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='view' ORDER BY name",
      args: []
    });

    // Crear resumen rápido
    let quickDoc = `# 🗄️ RESUMEN RÁPIDO - BASE DE DATOS ISO FLOW
*Actualizado: ${new Date().toLocaleString('es-ES')}*

## 📊 ESTADÍSTICAS
- **Tablas:** ${tablesResult.rows.length}
- **Vistas:** ${viewsResult.rows.length}

## 📋 TABLAS PRINCIPALES

### 👥 Usuarios y Organizaciones
- \`usuarios\` - Usuarios del sistema
- \`organizations\` - Organizaciones
- \`user_feature_permissions\` - Permisos por feature
- \`organization_features\` - Features por organización

### 📋 Sistema SGC
- \`sgc_personal_relaciones\` - Participantes genéricos SGC
- \`sgc_documentos_relacionados\` - Documentos relacionados SGC
- \`sgc_normas_relacionadas\` - Normas relacionadas SGC

### 🏢 Gestión de Personal
- \`personal\` - Personal de la organización
- \`departamentos\` - Departamentos
- \`puestos\` - Puestos de trabajo

### 📋 Módulos Principales
- \`procesos\` - Procesos de la organización
- \`documentos\` - Documentos del sistema
- \`normas\` - Puntos de la norma ISO
- \`auditorias\` - Auditorías
- \`hallazgos\` - Hallazgos de auditoría
- \`acciones\` - Acciones correctivas
- \`minutas\` - Minutas de reuniones
- \`capacitaciones\` - Capacitaciones
- \`competencias\` - Competencias del personal

### 📊 Indicadores y Mediciones
- \`indicadores\` - Indicadores de calidad
- \`mediciones\` - Mediciones de indicadores
- \`objetivos_calidad\` - Objetivos de calidad

## 🔗 RELACIONES CLAVE
- \`usuarios.organization_id\` → \`organizations.id\`
- \`personal.departamento_id\` → \`departamentos.id\`
- \`personal.puesto_id\` → \`puestos.id\`
- \`sgc_personal_relaciones.user_id\` → \`usuarios.id\`

## 📝 NOTAS IMPORTANTES
- **Organización ID 3:** ISOFlow3 Platform (Super Admin)
- **Organización ID 2:** Organización Demo
- **Tabla de features:** \`organization_features\` (con 's' al final)
- **Tabla de permisos:** \`user_feature_permissions\`

---
*Para documentación completa, ver: DATABASE-DOCUMENTATION.md*
`;

    // Guardar resumen rápido
    const quickDocPath = path.join(__dirname, '..', '..', 'DATABASE-QUICK-REFERENCE.md');
    fs.writeFileSync(quickDocPath, quickDoc, 'utf8');

    console.log(`✅ Resumen rápido actualizado: DATABASE-QUICK-REFERENCE.md`);
    console.log(`📊 Tablas: ${tablesResult.rows.length}, Vistas: ${viewsResult.rows.length}`);

  } catch (error) {
    console.error('❌ Error actualizando documentación:', error);
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  updateDatabaseDocs();
}

module.exports = { updateDatabaseDocs };
