const { tursoClient } = require('../lib/tursoClient.js');

async function verificarTablasSGC() {
    try {
        console.log('🔍 Verificando tablas SGC existentes...\n');
        
        // Verificar tablas SGC
        const tablasSGC = await tursoClient.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name",
            args: []
        });
        
        console.log('📋 Tablas SGC encontradas:');
        if (tablasSGC.rows.length === 0) {
            console.log('   ❌ No se encontraron tablas SGC');
        } else {
            tablasSGC.rows.forEach(row => {
                console.log(`   ✅ ${row.name}`);
            });
        }
        
        // Verificar estructura de cada tabla SGC
        for (const tabla of tablasSGC.rows) {
            console.log(`\n🔍 Estructura de ${tabla.name}:`);
            const estructura = await tursoClient.execute({
                sql: `PRAGMA table_info(${tabla.name})`,
                args: []
            });
            
            estructura.rows.forEach(col => {
                console.log(`   - ${col.name} (${col.type})`);
            });
        }
        
        // Verificar datos de ejemplo
        console.log('\n📊 Datos de ejemplo en tablas SGC:');
        for (const tabla of tablasSGC.rows) {
            const count = await tursoClient.execute({
                sql: `SELECT COUNT(*) as total FROM ${tabla.name}`,
                args: []
            });
            console.log(`   ${tabla.name}: ${count.rows[0].total} registros`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verificarTablasSGC();
