const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkOrganizationIdProblem() {
  console.log('🔍 ANALIZANDO PROBLEMA DE ORGANIZATION_ID EN TODA LA BASE DE DATOS');
  console.log('=' .repeat(80));
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || '9001app-v2');
    
    // 1. Verificar usuarios y sus organization_id
    console.log('\n📊 1. ANÁLISIS DE USUARIOS:');
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    console.log(`   Total usuarios: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.email}:`);
      console.log(`     ID: ${user._id}`);
      console.log(`     organization_id: ${user.organization_id} (tipo: ${typeof user.organization_id})`);
      console.log(`     organizationId: ${user.organizationId} (tipo: ${typeof user.organizationId})`);
      console.log(`     org_id: ${user.org_id} (tipo: ${typeof user.org_id})`);
    });
    
    // 2. Verificar organizaciones
    console.log('\n📊 2. ANÁLISIS DE ORGANIZACIONES:');
    const organizationsCollection = db.collection('organizations');
    const organizations = await organizationsCollection.find({}).toArray();
    
    console.log(`   Total organizaciones: ${organizations.length}`);
    organizations.forEach(org => {
      console.log(`   - ${org.name}:`);
      console.log(`     _id: ${org._id}`);
      console.log(`     id: ${org.id} (tipo: ${typeof org.id})`);
    });
    
    // 3. Verificar departamentos
    console.log('\n📊 3. ANÁLISIS DE DEPARTAMENTOS:');
    const departamentosCollection = db.collection('departamentos');
    const departamentos = await departamentosCollection.find({}).toArray();
    
    console.log(`   Total departamentos: ${departamentos.length}`);
    departamentos.forEach(dept => {
      console.log(`   - ${dept.nombre}:`);
      console.log(`     _id: ${dept._id}`);
      console.log(`     organization_id: ${dept.organization_id} (tipo: ${typeof dept.organization_id})`);
      console.log(`     organizationId: ${dept.organizationId} (tipo: ${typeof dept.organizationId})`);
    });
    
    // 4. Verificar personal
    console.log('\n📊 4. ANÁLISIS DE PERSONAL:');
    const personalCollection = db.collection('personal');
    const personal = await personalCollection.find({}).toArray();
    
    console.log(`   Total personal: ${personal.length}`);
    personal.forEach(person => {
      console.log(`   - ${person.nombre} ${person.apellido}:`);
      console.log(`     _id: ${person._id}`);
      console.log(`     organization_id: ${person.organization_id} (tipo: ${typeof person.organization_id})`);
      console.log(`     organizationId: ${person.organizationId} (tipo: ${typeof person.organizationId})`);
    });
    
    // 5. Verificar puestos
    console.log('\n📊 5. ANÁLISIS DE PUESTOS:');
    const puestosCollection = db.collection('puestos');
    const puestos = await puestosCollection.find({}).toArray();
    
    console.log(`   Total puestos: ${puestos.length}`);
    puestos.forEach(puesto => {
      console.log(`   - ${puesto.nombre}:`);
      console.log(`     _id: ${puesto._id}`);
      console.log(`     organization_id: ${puesto.organization_id} (tipo: ${typeof puesto.organization_id})`);
      console.log(`     organizationId: ${puesto.organizationId} (tipo: ${typeof puesto.organizationId})`);
    });
    
    // 6. Análisis de consistencia
    console.log('\n🔍 6. ANÁLISIS DE CONSISTENCIA:');
    
    // Verificar si hay usuarios con organization_id como ObjectId
    const usersWithObjectId = users.filter(u => u.organization_id && typeof u.organization_id === 'object');
    console.log(`   Usuarios con organization_id como ObjectId: ${usersWithObjectId.length}`);
    
    // Verificar si hay departamentos con organization_id como número
    const deptsWithNumber = departamentos.filter(d => d.organization_id && typeof d.organization_id === 'number');
    console.log(`   Departamentos con organization_id como número: ${deptsWithNumber.length}`);
    
    // Verificar si hay personal con organization_id como número
    const personalWithNumber = personal.filter(p => p.organization_id && typeof p.organization_id === 'number');
    console.log(`   Personal con organization_id como número: ${personalWithNumber.length}`);
    
    // Verificar si hay puestos con organization_id como número
    const puestosWithNumber = puestos.filter(p => p.organization_id && typeof p.organization_id === 'number');
    console.log(`   Puestos con organization_id como número: ${puestosWithNumber.length}`);
    
    // 7. Mapeo de organization_id
    console.log('\n🗺️ 7. MAPEO DE ORGANIZATION_ID:');
    
    const orgIdMapping = {};
    organizations.forEach(org => {
      if (org.id) {
        orgIdMapping[org.id] = org._id.toString();
        console.log(`   Organización ID ${org.id} → ObjectId ${org._id}`);
      }
    });
    
    // 8. Recomendaciones
    console.log('\n💡 8. RECOMENDACIONES:');
    
    if (usersWithObjectId.length > 0 && (deptsWithNumber.length > 0 || personalWithNumber.length > 0 || puestosWithNumber.length > 0)) {
      console.log('   ❌ PROBLEMA CRÍTICO: Inconsistencia en tipos de organization_id');
      console.log('   🔧 SOLUCIÓN: Normalizar todos los organization_id a ObjectId');
      console.log('   📋 ACCIONES:');
      console.log('      1. Convertir organization_id numéricos a ObjectId');
      console.log('      2. Actualizar todas las consultas para usar ObjectId');
      console.log('      3. Crear índices en organization_id como ObjectId');
    } else {
      console.log('   ✅ No se detectaron problemas críticos de consistencia');
    }
    
  } catch (error) {
    console.error('❌ Error analizando base de datos:', error);
  } finally {
    await client.close();
  }
}

checkOrganizationIdProblem();
