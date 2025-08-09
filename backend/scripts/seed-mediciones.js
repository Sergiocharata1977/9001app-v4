const { tursoClient } = require('../lib/tursoClient.js');

async function seed() {
  try {
    console.log('🌱 Insertando mediciones de ejemplo para organización 2...');
    const now = new Date().toISOString().slice(0, 10);
    const rows = [
      { indicador_id: 1, valor: 82, fecha: now },
      { indicador_id: 2, valor: 4, fecha: now },
      { indicador_id: 3, valor: 2, fecha: now },
    ];

    for (const r of rows) {
      await tursoClient.execute({
        sql: `INSERT INTO mediciones (indicador_id, valor, fecha_medicion, organization_id) 
              VALUES (?, ?, ?, 2)`,
        args: [r.indicador_id, r.valor, r.fecha]
      });
    }
    console.log('✅ Mediciones insertadas');
  } catch (err) {
    console.error('❌ Error al sembrar mediciones:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();


