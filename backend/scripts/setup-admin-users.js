const { createAdminUser } = require('./create-admin-user.js');
const { createOrgAdminUser } = require('./create-org-admin-user.js');

async function setupAdminUsers() {
  console.log('🚀 INICIANDO CONFIGURACIÓN DE USUARIOS ADMINISTRATIVOS');
  console.log('==================================================');
  
  try {
    // Crear Super Admin
    console.log('\n📋 PASO 1: Creando Super Administrador...');
    await createAdminUser();
    
    // Crear Admin de Organización
    console.log('\n📋 PASO 2: Creando Administrador de Organización...');
    await createOrgAdminUser();
    
    console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
    console.log('==================================================');
    console.log('✅ Super Administrador: admin@demo.com / admin123');
    console.log('✅ Admin Organización: orgadmin@demo.com / orgadmin123');
    console.log('');
    console.log('🔗 URLs de acceso:');
    console.log('   - Super Admin: /app/admin/super');
    console.log('   - Admin Organización: /app/admin/organization');
    console.log('');
    console.log('📝 Notas:');
    console.log('   - Ambos usuarios están en la organización ID 21');
    console.log('   - El Super Admin puede gestionar todas las organizaciones');
    console.log('   - El Admin de Organización solo gestiona su organización');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupAdminUsers()
    .then(() => {
      console.log('\n🏁 Script de configuración completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { setupAdminUsers };
