// ===============================================
// EJECUTAR RENOMBRADO DE TABLA SGC_PARTICIPANTES
// ===============================================

const fs = require('fs');
const { tursoClient } = require('./backend/lib/tursoClient.js');

async function renombrarTablaSGC() {
    try {
        console.log('🔄 INICIANDO RENOMBRADO DE TABLA SGC...\n');
        
        // 1. Verificar estado actual
        console.log('📋 VERIFICANDO ESTADO ACTUAL:');
        try {
            const tablasActuales = await tursoClient.execute({
                sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgc_%' ORDER BY name",
                args: []
            });
            
            console.log('   Tablas SGC existentes:');
            tablasActuales.rows.forEach(row => {
                console.log(`   └── ${row.name}`);
            });
            
            // Verificar datos en sgc_participantes
            const datosActuales = await tursoClient.execute({
                sql: "SELECT COUNT(*) as total FROM sgc_participantes",
                args: []
            });
            console.log(`   └── Datos en sgc_participantes: ${datosActuales.rows[0].total}`);
            
        } catch (error) {
            console.log('   └── Error verificando estado actual:', error.message);
        }
        
        // 2. Leer y ejecutar script SQL
        console.log('\n🔧 EJECUTANDO RENOMBRADO:');
        const script = fs.readFileSync('./renombrar-sgc-participantes.sql', 'utf8');
        
        // Dividir por comandos
        const comandos = script.split(';').filter(cmd => cmd.trim() && !cmd.trim().startsWith('--'));
        
        let ejecutados = 0;
        for (const comando of comandos) {
            if (comando.trim()) {
                try {
                    await tursoClient.execute(comando.trim());
                    ejecutados++;
                    console.log(`   └── Comando ${ejecutados} ejecutado`);
                } catch (error) {
                    // Ignorar errores de vistas que no existen
                    if (!error.message.includes('no such table') && 
                        !error.message.includes('already exists')) {
                        console.log(`   ⚠️  Error en comando: ${error.message.substring(0, 100)}...`);
                    }
                }
            }
        }
        
        console.log(`✅ Ejecutados ${ejecutados} comandos SQL`);
        
        // 3. Verificar resultado
        console.log('\n📊 VERIFICANDO RESULTADO:');
        
        // Verificar nueva tabla
        const nuevaTabla = await tursoClient.execute({
            sql: "SELECT COUNT(*) as total FROM sgc_personal_relaciones",
            args: []
        });
        console.log(`   📋 Datos en sgc_personal_relaciones: ${nuevaTabla.rows[0].total}`);
        
        // Verificar que la tabla anterior ya no existe
        try {
            await tursoClient.execute({
                sql: "SELECT COUNT(*) as total FROM sgc_participantes",
                args: []
            });
            console.log('   ⚠️  La tabla anterior aún existe (esto no debería pasar)');
        } catch (error) {
            console.log('   ✅ La tabla anterior ya no existe (correcto)');
        }
        
        // Verificar estructura
        const estructura = await tursoClient.execute({
            sql: "PRAGMA table_info(sgc_personal_relaciones)",
            args: []
        });
        console.log(`   └── Estructura: ${estructura.rows.length} columnas`);
        
        // 4. Verificar vistas
        console.log('\n👁️ VERIFICANDO VISTAS:');
        const vistas = await tursoClient.execute({
            sql: "SELECT name FROM sqlite_master WHERE type='view' AND name LIKE '%sgc%' ORDER BY name",
            args: []
        });
        
        if (vistas.rows.length > 0) {
            vistas.rows.forEach(v => console.log(`   └── ${v.name}`));
        } else {
            console.log('   └── No se encontraron vistas SGC');
        }
        
        // 5. Test de funcionalidad
        console.log('\n🔗 TEST DE FUNCIONALIDAD:');
        try {
            const test = await tursoClient.execute({
                sql: "SELECT COUNT(*) as total FROM v_sgc_personal_relaciones_completos",
                args: []
            });
            console.log(`   └── Vista personal relaciones: ${test.rows[0].total} registros`);
        } catch (error) {
            console.log(`   ⚠️  Error en vista: ${error.message}`);
        }
        
        console.log('\n🎉 RENOMBRADO COMPLETADO EXITOSAMENTE!');
        console.log('📝 Próximos pasos:');
        console.log('   1. Actualizar referencias en el código backend');
        console.log('   2. Actualizar referencias en el código frontend');
        console.log('   3. Actualizar documentación');
        console.log('   4. Eliminar vista de compatibilidad temporal');
        
    } catch (error) {
        console.error('❌ Error durante el renombrado:', error);
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    renombrarTablaSGC();
}

module.exports = { renombrarTablaSGC };
