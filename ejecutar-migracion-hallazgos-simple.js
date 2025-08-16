// ===============================================
// EJECUTAR MIGRACIÓN HALLAZGOS - MÉTODO SIMPLE
// ===============================================

const fs = require('fs');
const { tursoClient } = require('./backend/lib/tursoClient.js');

async function ejecutarMigracionHallazgos() {
    try {
        console.log('🚀 INICIANDO MIGRACIÓN DE HALLAZGOS...\n');
        
        // 1. Verificar estado actual
        console.log('📋 VERIFICANDO ESTADO ACTUAL:');
        try {
            const hallazgosExistentes = await tursoClient.execute('SELECT COUNT(*) as total FROM hallazgos');
            console.log(`   └── Hallazgos existentes: ${hallazgosExistentes.rows[0].total}`);
        } catch (error) {
            console.log('   └── Tabla hallazgos no existe - se creará');
        }
        
        // 2. Leer y ejecutar script SQL por partes
        console.log('\n🔧 EJECUTANDO SCRIPT DE MIGRACIÓN:');
        const script = fs.readFileSync('./migracion-hallazgos-sgc.sql', 'utf8');
        
        // Dividir por secciones principales
        const secciones = [
            'CREATE TABLE IF NOT EXISTS hallazgos',
            'CREATE INDEX',
            'INSERT OR REPLACE INTO hallazgos',
            'INSERT OR REPLACE INTO sgc_participantes',
            'INSERT OR REPLACE INTO sgc_documentos_relacionados', 
            'INSERT OR REPLACE INTO sgc_normas_relacionadas',
            'CREATE VIEW',
            'CREATE TRIGGER'
        ];
        
        let ejecutados = 0;
        const comandos = script.split(';').filter(cmd => cmd.trim() && !cmd.trim().startsWith('--'));
        
        for (const comando of comandos) {
            if (comando.trim()) {
                try {
                    await tursoClient.execute(comando.trim());
                    ejecutados++;
                    
                    // Mostrar progreso cada 10 comandos
                    if (ejecutados % 10 === 0) {
                        console.log(`   └── Ejecutados ${ejecutados} comandos...`);
                    }
                } catch (error) {
                    // Ignorar errores conocidos
                    if (!error.message.includes('already exists') && 
                        !error.message.includes('duplicate') &&
                        !error.message.includes('UNIQUE constraint failed')) {
                        console.log(`   ⚠️  Error en comando: ${error.message.substring(0, 100)}...`);
                    }
                }
            }
        }
        
        console.log(`✅ Ejecutados ${ejecutados} comandos SQL`);
        
        // 3. Verificar resultado
        console.log('\n📊 VERIFICANDO RESULTADO:');
        
        const hallazgos = await tursoClient.execute('SELECT COUNT(*) as total FROM hallazgos');
        console.log(`   📋 Hallazgos totales: ${hallazgos.rows[0].total}`);
        
        const participantes = await tursoClient.execute('SELECT COUNT(*) as total FROM sgc_participantes WHERE entidad_tipo = "hallazgo"');
        console.log(`   👥 Participantes SGC: ${participantes.rows[0].total}`);
        
        const documentos = await tursoClient.execute('SELECT COUNT(*) as total FROM sgc_documentos_relacionados WHERE entidad_tipo = "hallazgo"');
        console.log(`   📄 Documentos SGC: ${documentos.rows[0].total}`);
        
        const normas = await tursoClient.execute('SELECT COUNT(*) as total FROM sgc_normas_relacionadas WHERE entidad_tipo = "hallazgo"');
        console.log(`   📏 Normas SGC: ${normas.rows[0].total}`);
        
        // 4. Verificar vistas y triggers
        console.log('\n👁️ VERIFICANDO VISTAS:');
        const vistas = await tursoClient.execute('SELECT name FROM sqlite_master WHERE type = "view" AND name LIKE "%hallazgo%"');
        if (vistas.rows.length > 0) {
            vistas.rows.forEach(v => console.log(`   └── ${v.name}`));
        } else {
            console.log('   └── No se encontraron vistas específicas');
        }
        
        console.log('\n🔄 VERIFICANDO TRIGGERS:');
        const triggers = await tursoClient.execute('SELECT name FROM sqlite_master WHERE type = "trigger" AND name LIKE "%hallazgo%"');
        if (triggers.rows.length > 0) {
            triggers.rows.forEach(t => console.log(`   └── ${t.name}`));
        } else {
            console.log('   └── No se encontraron triggers específicos');
        }
        
        // 5. Test de integración SGC
        console.log('\n🔗 TEST DE INTEGRACIÓN SGC:');
        try {
            const test = await tursoClient.execute(`
                SELECT 
                    h.id,
                    h.titulo,
                    COUNT(DISTINCT p.id) as participantes,
                    COUNT(DISTINCT d.id) as documentos,
                    COUNT(DISTINCT n.id) as normas
                FROM hallazgos h
                LEFT JOIN sgc_participantes p ON h.id = p.entidad_id AND p.entidad_tipo = 'hallazgo'
                LEFT JOIN sgc_documentos_relacionados d ON h.id = d.entidad_id AND d.entidad_tipo = 'hallazgo'
                LEFT JOIN sgc_normas_relacionadas n ON h.id = n.entidad_id AND n.entidad_tipo = 'hallazgo'
                WHERE h.is_active = 1
                GROUP BY h.id
                LIMIT 3
            `);
            
            if (test.rows.length > 0) {
                test.rows.forEach(h => {
                    console.log(`   ✅ ${h.titulo}: ${h.participantes} participantes, ${h.documentos} docs, ${h.normas} normas`);
                });
            } else {
                console.log('   ⚠️  No se encontraron hallazgos para probar');
            }
        } catch (error) {
            console.log(`   ❌ Error en test: ${error.message}`);
        }
        
        // 6. Resultado final
        const totalHallazgos = hallazgos.rows[0].total;
        const totalSGC = participantes.rows[0].total + documentos.rows[0].total + normas.rows[0].total;
        
        if (totalHallazgos > 0 && totalSGC > 0) {
            console.log('\n🎉 MIGRACIÓN DE HALLAZGOS: ✅ COMPLETADA EXITOSAMENTE');
            console.log(`   📋 ${totalHallazgos} hallazgos con ${totalSGC} relaciones SGC`);
        } else if (totalHallazgos > 0) {
            console.log('\n⚠️  MIGRACIÓN PARCIAL: Hallazgos creados pero faltan relaciones SGC');
        } else {
            console.log('\n❌ MIGRACIÓN FALLIDA: No se crearon hallazgos');
        }
        
    } catch (error) {
        console.error('❌ ERROR CRÍTICO:', error.message);
    }
    
    process.exit(0);
}

ejecutarMigracionHallazgos();
