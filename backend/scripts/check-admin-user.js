const { executeQuery } = require('../lib/tursoClient.js');

async function checkAdminUser() {
  console.log('🔍 Verificando usuario admin...');
  
  try {
    // Buscar usuario admin@demo.com
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
        WHERE email = ?
      `,
      args: ['admin@demo.com']
    });

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario admin@demo.com no encontrado');
      return;
    }

    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Org ID: ${user.organization_id}`);
    console.log(`   Activo: ${user.is_active ? 'Sí' : 'No'}`);
    console.log(`   Creado: ${user.created_at}`);

    // Verificar si la contraseña es admin123
    const passwordResult = await executeQuery({
      sql: `
        SELECT password_hash 
        FROM usuarios 
        WHERE email = ?
      `,
      args: ['admin@demo.com']
    });

    if (passwordResult.rows.length > 0) {
      const passwordHash = passwordResult.rows[0].password_hash;
      console.log(`\n🔐 Hash de contraseña: ${passwordHash.substring(0, 20)}...`);
      
      // Verificar si es el hash correcto para 'admin123'
      const bcrypt = require('bcrypt');
      const isValid = await bcrypt.compare('admin123', passwordHash);
      console.log(`✅ Contraseña 'admin123' es válida: ${isValid}`);
    }

    // Verificar organización
    const orgResult = await executeQuery({
      sql: `
        SELECT id, name, plan, is_active
        FROM organizations 
        WHERE id = ?
      `,
      args: [user.organization_id]
    });

    if (orgResult.rows.length > 0) {
      const org = orgResult.rows[0];
      console.log(`\n🏢 Organización: ${org.name} (ID: ${org.id})`);
      console.log(`   Plan: ${org.plan}`);
      console.log(`   Activa: ${org.is_active ? 'Sí' : 'No'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdminUser();
