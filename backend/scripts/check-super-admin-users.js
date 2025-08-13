const { executeQuery } = require('../lib/tursoClient.js');

async function checkSuperAdminUsers() {
  console.log('🔍 Verificando usuarios con rol super_admin...');
  
  try {
    // Buscar usuarios con rol super_admin
    const userResult = await executeQuery({
      sql: `
        SELECT 
          id, 
          name, 
          email, 
          role, 
          organization_id,
          is_active,
          created_at
        FROM usuarios 
        WHERE role = 'super_admin'
        ORDER BY created_at DESC
      `
    });

    if (userResult.rows.length === 0) {
      console.log('❌ No hay usuarios con rol super_admin');
      console.log('\n💡 Opciones:');
      console.log('   1. Crear un usuario super_admin');
      console.log('   2. Cambiar el rol de admin@demo.com a super_admin');
      return;
    }

    console.log(`✅ ${userResult.rows.length} usuarios con rol super_admin encontrados:`);
    
    userResult.rows.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Org ID: ${user.organization_id}`);
      console.log(`   Activo: ${user.is_active ? 'Sí' : 'No'}`);
      console.log(`   Creado: ${user.created_at}`);
    });

    // Mostrar todos los usuarios para comparar
    console.log('\n📊 Todos los usuarios en el sistema:');
    const allUsers = await executeQuery({
      sql: `
        SELECT 
          id, 
          name, 
          email, 
          role, 
          organization_id,
          is_active
        FROM usuarios 
        ORDER BY role, name
      `
    });

    allUsers.rows.forEach((user, index) => {
      const roleColor = user.role === 'super_admin' ? '🟢' : 
                       user.role === 'admin' ? '🟡' : 
                       user.role === 'manager' ? '🔵' : '⚪';
      console.log(`${index + 1}. ${roleColor} ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSuperAdminUsers();
