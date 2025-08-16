const { TursoClient } = require('../lib/tursoClient');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script para generar documentación automática de la base de datos
 * Analiza la estructura de tablas, vistas, índices y triggers
 * Genera documentación en formato Markdown
 */

async function generateDatabaseDocumentation() {
    console.log('🔍 Iniciando generación de documentación de base de datos...');
    
    try {
        const turso = new TursoClient();
        await turso.connect();
        
        // Obtener información de tablas
        const tables = await turso.query(`
            SELECT name, sql 
            FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
            ORDER BY name
        `);
        
        // Obtener información de vistas
        const views = await turso.query(`
            SELECT name, sql 
            FROM sqlite_master 
            WHERE type='view'
            ORDER BY name
        `);
        
        // Obtener información de índices
        const indexes = await turso.query(`
            SELECT name, tbl_name, sql 
            FROM sqlite_master 
            WHERE type='index'
            AND name NOT LIKE 'sqlite_%'
            ORDER BY tbl_name, name
        `);
        
        // Obtener información de triggers
        const triggers = await turso.query(`
            SELECT name, tbl_name, sql 
            FROM sqlite_master 
            WHERE type='trigger'
            ORDER BY tbl_name, name
        `);
        
        // Generar documentación
        let documentation = `# 📊 Documentación de Base de Datos - Sistema SGC

## 📋 Resumen
- **Total de tablas:** ${tables.length}
- **Total de vistas:** ${views.length}
- **Total de índices:** ${indexes.length}
- **Total de triggers:** ${triggers.length}

## 🗂️ Tablas

`;

        // Documentar tablas
        for (const table of tables) {
            documentation += `### 📋 ${table.name}\n\n`;
            documentation += '```sql\n';
            documentation += table.sql;
            documentation += '\n```\n\n';
            
            // Obtener información de columnas
            const columns = await turso.query(`PRAGMA table_info(${table.name})`);
            if (columns.length > 0) {
                documentation += '**Columnas:**\n\n';
                documentation += '| Nombre | Tipo | Not Null | Default | Primary Key |\n';
                documentation += '|--------|------|----------|---------|-------------|\n';
                
                for (const column of columns) {
                    documentation += `| ${column.name} | ${column.type} | ${column.notnull ? 'Sí' : 'No'} | ${column.dflt_value || '-'} | ${column.pk ? 'Sí' : 'No'} |\n`;
                }
                documentation += '\n';
            }
        }
        
        // Documentar vistas
        if (views.length > 0) {
            documentation += `## 👁️ Vistas\n\n`;
            for (const view of views) {
                documentation += `### 👁️ ${view.name}\n\n`;
                documentation += '```sql\n';
                documentation += view.sql;
                documentation += '\n```\n\n';
            }
        }
        
        // Documentar índices
        if (indexes.length > 0) {
            documentation += `## 🔍 Índices\n\n`;
            for (const index of indexes) {
                documentation += `### 🔍 ${index.name}\n`;
                documentation += `**Tabla:** ${index.tbl_name}\n\n`;
                documentation += '```sql\n';
                documentation += index.sql;
                documentation += '\n```\n\n';
            }
        }
        
        // Documentar triggers
        if (triggers.length > 0) {
            documentation += `## ⚡ Triggers\n\n`;
            for (const trigger of triggers) {
                documentation += `### ⚡ ${trigger.name}\n`;
                documentation += `**Tabla:** ${trigger.tbl_name}\n\n`;
                documentation += '```sql\n';
                documentation += trigger.sql;
                documentation += '\n```\n\n';
            }
        }
        
        // Guardar documentación
        const outputPath = path.join(__dirname, '../docs/database-documentation.md');
        await fs.writeFile(outputPath, documentation, 'utf8');
        
        console.log(`✅ Documentación generada exitosamente en: ${outputPath}`);
        console.log(`📊 Resumen:`);
        console.log(`   - Tablas: ${tables.length}`);
        console.log(`   - Vistas: ${views.length}`);
        console.log(`   - Índices: ${indexes.length}`);
        console.log(`   - Triggers: ${triggers.length}`);
        
        await turso.disconnect();
        
    } catch (error) {
        console.error('❌ Error generando documentación:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    generateDatabaseDocumentation();
}

module.exports = { generateDatabaseDocumentation };
