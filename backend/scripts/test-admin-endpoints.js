const { executeQuery } = require('../lib/tursoClient.js');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testAdminEndpoints() {
  console.log(`${colors.cyan}🧪 PRUEBA DE ENDPOINTS DE ADMINISTRACIÓN${colors.reset}`);
  console.log(''.padEnd(50, '='));

  try {
    // 1. Probar conexión básica
    console.log(`${colors.blue}1. Probando conexión básica...${colors.reset}`);
    const testResult = await executeQuery({
      sql: 'SELECT 1 as test'
    });
    console.log(`${colors.green}✅ Conexión exitosa${colors.reset}`);

    // 2. Verificar tabla organizations
    console.log(`\n${colors.blue}2. Verificando tabla organizations...${colors.reset}`);
    const orgResult = await executeQuery({
      sql: 'SELECT COUNT(*) as total FROM organizations'
    });
    const totalOrgs = orgResult.rows[0]?.total || 0;
    console.log(`${colors.green}✅ Organizaciones encontradas: ${totalOrgs}${colors.reset}`);

    // 3. Obtener organizaciones (simulando endpoint)
    console.log(`\n${colors.blue}3. Obteniendo organizaciones...${colors.reset}`);
    const organizations = await executeQuery({
      sql: `
        SELECT 
          id, 
          name, 
          email, 
          plan, 
          is_active,
          created_at
        FROM organizations 
        ORDER BY created_at DESC
      `
    });

    console.log(`${colors.green}✅ ${organizations.rows.length} organizaciones obtenidas${colors.reset}`);
    
    if (organizations.rows.length > 0) {
      console.log(`${colors.yellow}📊 Primera organización:${colors.reset}`);
      const firstOrg = organizations.rows[0];
      console.log(`   ID: ${firstOrg.id}`);
      console.log(`   Nombre: ${firstOrg.name}`);
      console.log(`   Email: ${firstOrg.email}`);
      console.log(`   Plan: ${firstOrg.plan}`);
      console.log(`   Activa: ${firstOrg.is_active ? 'Sí' : 'No'}`);
    }

    // 4. Verificar tabla usuarios
    console.log(`\n${colors.blue}4. Verificando tabla usuarios...${colors.reset}`);
    const userResult = await executeQuery({
      sql: 'SELECT COUNT(*) as total FROM usuarios'
    });
    const totalUsers = userResult.rows[0]?.total || 0;
    console.log(`${colors.green}✅ Usuarios encontrados: ${totalUsers}${colors.reset}`);

    // 5. Obtener usuarios (simulando endpoint)
    console.log(`\n${colors.blue}5. Obteniendo usuarios...${colors.reset}`);
    const users = await executeQuery({
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
        ORDER BY created_at DESC
        LIMIT 10
      `
    });

    console.log(`${colors.green}✅ ${users.rows.length} usuarios obtenidos${colors.reset}`);
    
    if (users.rows.length > 0) {
      console.log(`${colors.yellow}📊 Primer usuario:${colors.reset}`);
      const firstUser = users.rows[0];
      console.log(`   ID: ${firstUser.id}`);
      console.log(`   Nombre: ${firstUser.name}`);
      console.log(`   Email: ${firstUser.email}`);
      console.log(`   Rol: ${firstUser.role}`);
      console.log(`   Org ID: ${firstUser.organization_id}`);
      console.log(`   Activo: ${firstUser.is_active ? 'Sí' : 'No'}`);
    }

    // 6. Verificar estructura de tablas
    console.log(`\n${colors.blue}6. Verificando estructura de tablas...${colors.reset}`);
    
    const orgStructure = await executeQuery({
      sql: "PRAGMA table_info(organizations)"
    });
    console.log(`${colors.green}✅ Tabla organizations tiene ${orgStructure.rows.length} campos${colors.reset}`);

    const userStructure = await executeQuery({
      sql: "PRAGMA table_info(usuarios)"
    });
    console.log(`${colors.green}✅ Tabla usuarios tiene ${userStructure.rows.length} campos${colors.reset}`);

    console.log(`\n${colors.green}${colors.green}🎉 TODAS LAS PRUEBAS EXITOSAS${colors.reset}`);
    console.log(''.padEnd(50, '='));
    console.log(`${colors.cyan}💡 Los endpoints de administración deberían funcionar correctamente${colors.reset}`);
    console.log(`${colors.cyan}🌐 Prueba ahora en el navegador: http://localhost:3000/app/admin/super${colors.reset}`);

  } catch (error) {
    console.error(`${colors.red}❌ Error durante las pruebas:${colors.reset}`, error);
    console.error(`${colors.red}❌ Stack trace:${colors.reset}`, error.stack);
  }
}

// Ejecutar pruebas
testAdminEndpoints();
