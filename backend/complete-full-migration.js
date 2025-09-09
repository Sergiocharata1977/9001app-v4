const { exec } = require('child_process');
const path = require('path');

console.log('🚀 COMPLETANDO MIGRACIÓN COMPLETA A MONGODB Y TYPESCRIPT');
console.log('========================================================');
console.log('');

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📋 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`  ⚠️  Warning: ${stderr}`);
      }
      if (stdout) {
        console.log(`  ✅ ${stdout.trim()}`);
      }
      resolve();
    });
  });
}

async function completeFullMigration() {
  try {
    // PASO 1: Completar migración MongoDB
    console.log('🗄️  PASO 1: COMPLETANDO MIGRACIÓN MONGODB');
    console.log('==========================================');
    
    await runCommand('node complete-migration.js', 'Migrando tablas faltantes a MongoDB');
    
    // PASO 2: Completar migración TypeScript
    console.log('\n🔧 PASO 2: COMPLETANDO MIGRACIÓN TYPESCRIPT');
    console.log('===========================================');
    
    await runCommand('node complete-typescript-migration.js', 'Convirtiendo archivos a TypeScript');
    
    // PASO 3: Instalar dependencias
    console.log('\n📦 PASO 3: INSTALANDO DEPENDENCIAS');
    console.log('===================================');
    
    await runCommand('npm install', 'Instalando dependencias TypeScript');
    
    // PASO 4: Compilar TypeScript
    console.log('\n🔨 PASO 4: COMPILANDO TYPESCRIPT');
    console.log('=================================');
    
    await runCommand('npm run build', 'Compilando código TypeScript');
    
    // PASO 5: Verificar migración
    console.log('\n✅ PASO 5: VERIFICANDO MIGRACIÓN');
    console.log('=================================');
    
    await runCommand('node check-mongodb-collections.js', 'Verificando colecciones MongoDB');
    
    console.log('\n🎉 MIGRACIÓN COMPLETA FINALIZADA EXITOSAMENTE!');
    console.log('==============================================');
    console.log('✅ MongoDB: Todas las tablas migradas');
    console.log('✅ TypeScript: Todos los archivos convertidos');
    console.log('✅ Dependencias: Instaladas y actualizadas');
    console.log('✅ Compilación: Código compilado correctamente');
    console.log('✅ Verificación: Sistema funcionando');
    
    console.log('\n🚀 SISTEMA LISTO PARA PRODUCCIÓN');
    console.log('=================================');
    console.log('Para iniciar el sistema:');
    console.log('  Backend:  npm run dev');
    console.log('  Frontend: cd ../frontend && npm run dev');
    
  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA MIGRACIÓN:', error.message);
    console.log('\n🔧 Para resolver problemas:');
    console.log('  1. Verificar conexión a MongoDB');
    console.log('  2. Verificar dependencias instaladas');
    console.log('  3. Revisar logs de error');
  }
}

// Ejecutar migración completa
completeFullMigration();

