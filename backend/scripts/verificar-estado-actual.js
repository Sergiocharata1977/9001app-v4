const { tursoClient } = require('../lib/tursoClient.js');

async function verificarEstado() {
    try {
        console.log('🔍 Verificando estado actual de la base de datos...\n');
        
        // 1. Verificar tablas SGC
        console.log('📋 Tablas SGC:');
        const tablasSGC = await tursoClient.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name",
            args: []
        });
        
        tablasSGC.rows.forEach(row => console.log(`   - ${row.name}`));
        
        // 2. Verificar si existe la tabla sgc_personal_relaciones
        console.log('\n🔍 Verificando tabla sgc_personal_relaciones:');
        try {
            const estructura = await tursoClient.execute({
                sql: "PRAGMA table_info(sgc_personal_relaciones)",
                args: []
            });
            console.log(`   ✅ Tabla existe con ${estructura.rows.length} columnas`);
            
            // Mostrar estructura
            estructura.rows.forEach(col => {
                console.log(`      - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        // 3. Verificar tablas referenciadas en foreign keys
        console.log('\n🔗 Verificando tablas referenciadas:');
        const tablasReferenciadas = ['organizations', 'personal', 'users'];
        
        for (const tabla of tablasReferenciadas) {
            try {
                const count = await tursoClient.execute({
                    sql: `SELECT COUNT(*) as total FROM ${tabla}`,
                    args: []
                });
                console.log(`   ✅ ${tabla}: ${count.rows[0].total} registros`);
            } catch (error) {
                console.log(`   ❌ ${tabla}: ${error.message}`);
            }
        }
        
        // 4. Verificar datos de personal específicos
        console.log('\n👥 Verificando datos de personal:');
        try {
            const personal = await tursoClient.execute({
                sql: "SELECT id, nombre, apellido FROM personal LIMIT 5",
                args: []
            });
            
            if (personal.rows.length > 0) {
                console.log('   Personal disponible:');
                personal.rows.forEach(p => {
                    console.log(`      - ${p.id}: ${p.nombre} ${p.apellido}`);
                });
            } else {
                console.log('   ⚠️ No hay datos de personal');
            }
        } catch (error) {
            console.log(`   ❌ Error verificando personal: ${error.message}`);
        }
        
        // 5. Verificar organizaciones
        console.log('\n🏢 Verificando organizaciones:');
        try {
            const orgs = await tursoClient.execute({
                sql: "SELECT id, name FROM organizations",
                args: []
            });
            
            console.log('   Organizaciones disponibles:');
            orgs.rows.forEach(org => {
                console.log(`      - ID ${org.id}: ${org.name}`);
            });
        } catch (error) {
            console.log(`   ❌ Error verificando organizaciones: ${error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

verificarEstado();
