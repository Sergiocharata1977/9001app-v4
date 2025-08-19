const { tursoClient } = require('../lib/tursoClient.js');

async function insertarDatosEjemplo() {
    try {
        console.log('📊 Insertando datos de ejemplo...\n');
        
        // Datos de ejemplo
        const datos = [
            {
                id: 'rel_min_001_1',
                organization_id: 2,
                entidad_tipo: 'minuta',
                entidad_id: 'MIN_2024_001',
                personal_id: 'per_001',
                rol: 'organizador',
                asistio: 1,
                observaciones: 'Organizador de la reunión',
                datos_adicionales: '{"fecha_asignacion": "2024-01-15"}'
            },
            {
                id: 'rel_min_001_2',
                organization_id: 2,
                entidad_tipo: 'minuta',
                entidad_id: 'MIN_2024_001',
                personal_id: 'per_002',
                rol: 'secretario',
                asistio: 1,
                observaciones: 'Secretario de la reunión',
                datos_adicionales: '{"fecha_asignacion": "2024-01-15"}'
            },
            {
                id: 'rel_hal_001_1',
                organization_id: 2,
                entidad_tipo: 'hallazgo',
                entidad_id: 'HAL_2024_001',
                personal_id: 'per_001',
                rol: 'responsable',
                asistio: 1,
                observaciones: 'Responsable de la corrección',
                datos_adicionales: '{"fecha_asignacion": "2024-01-20"}'
            }
        ];
        
        let insertados = 0;
        for (const dato of datos) {
            try {
                await tursoClient.execute({
                    sql: `INSERT INTO sgc_personal_relaciones (
                        id, organization_id, entidad_tipo, entidad_id, personal_id, rol, 
                        asistio, observaciones, datos_adicionales
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        dato.id, dato.organization_id, dato.entidad_tipo, dato.entidad_id,
                        dato.personal_id, dato.rol, dato.asistio, dato.observaciones, dato.datos_adicionales
                    ]
                });
                insertados++;
                console.log(`   ✅ Insertado: ${dato.id} - ${dato.rol} en ${dato.entidad_tipo}`);
            } catch (error) {
                console.log(`   ⚠️ Error insertando ${dato.id}: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Total insertados: ${insertados} de ${datos.length}`);
        
        // Verificar resultado
        const total = await tursoClient.execute({
            sql: "SELECT COUNT(*) as total FROM sgc_personal_relaciones",
            args: []
        });
        
        console.log(`📋 Total en tabla: ${total.rows[0].total} registros`);
        
        // Mostrar datos por tipo
        const porTipo = await tursoClient.execute({
            sql: "SELECT entidad_tipo, COUNT(*) as total FROM sgc_personal_relaciones GROUP BY entidad_tipo",
            args: []
        });
        
        console.log('\n📊 Datos por tipo de entidad:');
        porTipo.rows.forEach(row => {
            console.log(`   - ${row.entidad_tipo}: ${row.total} registros`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

insertarDatosEjemplo();
