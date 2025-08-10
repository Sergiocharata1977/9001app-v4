const { tursoClient } = require('../lib/tursoClient.js');

async function run() {
  try {
    console.log('🔍 Diagnóstico de tablas procesos y mediciones');
    const procesosCount = await tursoClient.execute('SELECT COUNT(*) AS count FROM procesos');
    const medicionesCount = await tursoClient.execute('SELECT COUNT(*) AS count FROM mediciones');
    console.log('📊 Total procesos:', procesosCount.rows[0]);
    console.log('📈 Total mediciones:', medicionesCount.rows[0]);

    const procesosByOrg = await tursoClient.execute('SELECT organization_id, COUNT(*) AS count FROM procesos GROUP BY organization_id');
    const medicionesByOrg = await tursoClient.execute('SELECT organization_id, COUNT(*) AS count FROM mediciones GROUP BY organization_id');
    console.log('🏢 Procesos por organización:', procesosByOrg.rows);
    console.log('🏢 Mediciones por organización:', medicionesByOrg.rows);

    // Muestra para org 2
    const sampleProcesos = await tursoClient.execute({
      sql: 'SELECT id, nombre, codigo, organization_id FROM procesos WHERE organization_id = ? LIMIT 5',
      args: [2]
    });
    const sampleMediciones = await tursoClient.execute({
      sql: 'SELECT id, indicador_id, valor, fecha_medicion, organization_id FROM mediciones WHERE organization_id = ? LIMIT 5',
      args: [2]
    });
    console.log('🧪 Muestra procesos (org 2):', sampleProcesos.rows);
    console.log('🧪 Muestra mediciones (org 2):', sampleMediciones.rows);
  } catch (err) {
    console.error('❌ Error diagnóstico:', err.message);
  } finally {
    process.exit(0);
  }
}

run();




