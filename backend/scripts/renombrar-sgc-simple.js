const { tursoClient } = require('../lib/tursoClient.js');

async function renombrarSGC() {
    try {
        console.log('🔍 Verificando tablas SGC actuales...');
        
        // Verificar tablas actuales
        const tablas = await tursoClient.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name",
            args: []
        });
        
        console.log('Tablas SGC encontradas:');
        tablas.rows.forEach(row => console.log(`- ${row.name}`));
        
        // Verificar si sgc_participantes existe
        const existeParticipantes = tablas.rows.some(row => row.name === 'sgc_participantes');
        const existePersonalRelaciones = tablas.rows.some(row => row.name === 'sgc_personal_relaciones');
        
        if (existeParticipantes && !existePersonalRelaciones) {
            console.log('\n🔄 Renombrando sgc_participantes a sgc_personal_relaciones...');
            
            // Ejecutar renombrado
            await tursoClient.execute({
                sql: "ALTER TABLE sgc_participantes RENAME TO sgc_personal_relaciones",
                args: []
            });
            
            console.log('✅ Tabla renombrada exitosamente');
            
            // Verificar el cambio
            const tablasNuevas = await tursoClient.execute({
                sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name",
                args: []
            });
            
            console.log('\nTablas SGC después del cambio:');
            tablasNuevas.rows.forEach(row => console.log(`- ${row.name}`));
            
            // Verificar datos
            const datos = await tursoClient.execute({
                sql: "SELECT COUNT(*) as total FROM sgc_personal_relaciones",
                args: []
            });
            
            console.log(`\n📊 Datos migrados: ${datos.rows[0].total} registros`);
            
        } else if (existePersonalRelaciones) {
            console.log('✅ La tabla ya está renombrada como sgc_personal_relaciones');
        } else {
            console.log('❌ No se encontró la tabla sgc_participantes');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

renombrarSGC();
