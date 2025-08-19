// ===============================================
// EJECUTAR CORRECCIÓN DE TABLA SGC_PERSONAL_RELACIONES
// ===============================================

const fs = require('fs');
const { tursoClient } = require('./backend/lib/tursoClient.js');

async function corregirTablaSGC() {
    try {
        console.log('🔧 INICIANDO CORRECCIÓN DE TABLA SGC...\n');
        
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
            
        } catch (error) {
            console.log('   └── Error verificando estado actual:', error.message);
        }
        
        // 2. Leer y ejecutar script SQL
        console.log('\n🔧 EJECUTANDO CORRECCIÓN:');
        const script = fs.readFileSync('./corregir-sgc-personal-relaciones.sql', 'utf8');
        
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
        
        // Verificar estructura
        const estructura = await tursoClient.execute({
            sql: "PRAGMA table_info(sgc_personal_relaciones)",
            args: []
        });
        console.log(`   └── Estructura: ${estructura.rows.length} columnas`);
        
        // Verificar foreign keys
        console.log('\n🔗 VERIFICANDO FOREIGN KEYS:');
        const foreignKeys = await tursoClient.execute({
            sql: "PRAGMA foreign_key_list(sgc_personal_relaciones)",
            args: []
        });
        
        if (foreignKeys.rows.length > 0) {
            console.log('   Foreign keys configuradas:');
            foreignKeys.rows.forEach(fk => {
                console.log(`      - ${fk.from} → ${fk.table}.${fk.to}`);
            });
        } else {
            console.log('   ⚠️ No se encontraron foreign keys');
        }
        
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
        
        // 6. Verificar datos de ejemplo
        console.log('\n📊 VERIFICANDO DATOS DE EJEMPLO:');
        try {
            const datos = await tursoClient.execute({
                sql: "SELECT entidad_tipo, COUNT(*) as total FROM sgc_personal_relaciones GROUP BY entidad_tipo",
                args: []
            });
            
            if (datos.rows.length > 0) {
                console.log('   Datos por tipo de entidad:');
                datos.rows.forEach(row => {
                    console.log(`      - ${row.entidad_tipo}: ${row.total} registros`);
                });
            } else {
                console.log('   ⚠️ No hay datos de ejemplo');
            }
        } catch (error) {
            console.log(`   ⚠️  Error verificando datos: ${error.message}`);
        }
        
        console.log('\n🎉 CORRECCIÓN COMPLETADA EXITOSAMENTE!');
        console.log('📝 Próximos pasos:');
        console.log('   1. Actualizar referencias en el código backend');
        console.log('   2. Actualizar referencias en el código frontend');
        console.log('   3. Actualizar documentación');
        console.log('   4. Probar funcionalidad completa');
        
    } catch (error) {
        console.error('❌ Error durante la corrección:', error);
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    corregirTablaSGC();
}

module.exports = { corregirTablaSGC };
