const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || '9001app';

async function verifyRRHHMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conexión exitosa');
    
    const db = client.db(DB_NAME);
    
    console.log('\n📊 VERIFICACIÓN DE MIGRACIÓN RRHH');
    console.log('=====================================');
    
    // 1. VERIFICAR DEPARTAMENTOS
    console.log('\n📋 DEPARTAMENTOS:');
    const departamentos = await db.collection('departamentos').find({}).toArray();
    departamentos.forEach(dept => {
      console.log(`   - ${dept.nombre} (${dept.id}) - Responsable: ${dept.responsable_id || 'Sin asignar'}`);
    });
    
    // 2. VERIFICAR PERSONAL
    console.log('\n👥 PERSONAL:');
    const personal = await db.collection('personal').find({}).toArray();
    personal.forEach(emp => {
      console.log(`   - ${emp.nombres} ${emp.apellidos} (${emp.id}) - ${emp.tipo_personal} - ${emp.estado}`);
    });
    
    // 3. VERIFICAR PUESTOS
    console.log('\n💼 PUESTOS:');
    const puestos = await db.collection('puestos').find({}).toArray();
    puestos.forEach(puesto => {
      console.log(`   - ${puesto.nombre} (${puesto.id}) - Depto: ${puesto.departamento_id}`);
    });
    
    // 4. VERIFICAR CAPACITACIONES
    console.log('\n🎓 CAPACITACIONES:');
    const capacitaciones = await db.collection('capacitaciones').find({}).toArray();
    capacitaciones.forEach(cap => {
      console.log(`   - ${cap.titulo} (${cap.id}) - Estado: ${cap.estado} - ${cap.duracion_horas}h`);
    });
    
    // 5. VERIFICAR COMPETENCIAS
    console.log('\n🏆 COMPETENCIAS:');
    const competencias = await db.collection('competencias').find({}).toArray();
    competencias.forEach(comp => {
      console.log(`   - ${comp.nombre} (${comp.id}) - ${comp.categoria} - Nivel: ${comp.nivel_requerido}`);
    });
    
    // 6. VERIFICAR RELACIONES
    console.log('\n🔗 VERIFICANDO RELACIONES:');
    
    // Verificar que los departamentos tengan responsables válidos
    const deptConResponsable = await db.collection('departamentos').find({
      responsable_id: { $ne: null }
    }).count();
    console.log(`   - Departamentos con responsable: ${deptConResponsable}/${departamentos.length}`);
    
    // Verificar que el personal tenga supervisor válido
    const personalConSupervisor = await db.collection('personal').find({
      supervisor_id: { $ne: null }
    }).count();
    console.log(`   - Personal con supervisor: ${personalConSupervisor}/${personal.length}`);
    
    // Verificar que los puestos tengan departamento válido
    const puestosConDepto = await db.collection('puestos').find({
      departamento_id: { $ne: null }
    }).count();
    console.log(`   - Puestos con departamento: ${puestosConDepto}/${puestos.length}`);
    
    // 7. VERIFICAR ÍNDICES
    console.log('\n🔍 VERIFICANDO ÍNDICES:');
    const collections = ['departamentos', 'personal', 'puestos', 'capacitaciones', 'competencias'];
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`   - ${collectionName}: ${indexes.length} índices`);
    }
    
    // 8. ESTADÍSTICAS FINALES
    console.log('\n📈 ESTADÍSTICAS FINALES:');
    console.log(`   - Total departamentos: ${departamentos.length}`);
    console.log(`   - Total personal: ${personal.length}`);
    console.log(`   - Total puestos: ${puestos.length}`);
    console.log(`   - Total capacitaciones: ${capacitaciones.length}`);
    console.log(`   - Total competencias: ${competencias.length}`);
    
    console.log('\n✅ Verificación completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar verificación
if (require.main === module) {
  verifyRRHHMigration()
    .then(() => {
      console.log('\n✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la verificación:', error);
      process.exit(1);
    });
}

module.exports = { verifyRRHHMigration };
