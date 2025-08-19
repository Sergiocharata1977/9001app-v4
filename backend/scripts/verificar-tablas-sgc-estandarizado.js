const { tursoClient } = require('../lib/tursoClient.js');

// Configuración de colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Lista de las nuevas tablas SGC estandarizadas
const TABLAS_SGC_ESTANDARIZADO = [
  'sgc_personal_relaciones',
  'sgc_documentos_relacionados', 
  'sgc_normas_relacionadas',
  'procesos_relaciones'
];

// Lista de vistas SGC
const VISTAS_SGC = [
  'v_sgc_personal_relaciones_completos',
  'v_sgc_documentos_completos',
  'v_sgc_normas_completas',
  'v_mapa_procesos'
];

async function verificarSGCEstandarizado(organizationId = '2') {
  try {
    console.log(`${colors.cyan}${colors.bright}🗄️  VERIFICACIÓN SISTEMA SGC ESTANDARIZADO${colors.reset}`);
    console.log(`${colors.blue}📅 Fecha: ${new Date().toLocaleString('es-ES')}${colors.reset}`);
    console.log(`${colors.blue}🏢 Organización ID: ${organizationId}${colors.reset}`);
    console.log(''.padEnd(70, '='));

    const resumenTablas = {};
    
    // 1. Verificar tablas SGC principales
    console.log(`\n${colors.magenta}📊 VERIFICANDO TABLAS SGC PRINCIPALES${colors.reset}`);
    for (const tabla of TABLAS_SGC_ESTANDARIZADO) {
      try {
        console.log(`\n${colors.yellow}📋 Verificando tabla: ${tabla}${colors.reset}`);
        
        // Verificar si la tabla existe
        const existeTabla = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          args: [tabla]
        });

        if (existeTabla.rows.length === 0) {
          console.log(`   ${colors.red}❌ Tabla '${tabla}' no existe${colors.reset}`);
          resumenTablas[tabla] = { existe: false, registros: 0 };
          continue;
        }

        // Contar registros totales
        const totalResult = await tursoClient.execute({
          sql: `SELECT COUNT(*) as total FROM ${tabla}`
        });
        const totalRegistros = totalResult.rows[0]?.total || 0;

        // Contar registros de la organización
        let registrosOrg = 0;
        try {
          const orgResult = await tursoClient.execute({
            sql: `SELECT COUNT(*) as total FROM ${tabla} WHERE organization_id = ?`,
            args: [organizationId]
          });
          registrosOrg = orgResult.rows[0]?.total || 0;
        } catch (error) {
          registrosOrg = totalRegistros;
        }

        console.log(`   ${colors.green}✅ Registros totales: ${totalRegistros}${colors.reset}`);
        console.log(`   ${colors.blue}🏢 Registros org ${organizationId}: ${registrosOrg}${colors.reset}`);

        // Mostrar estructura de la tabla
        const estructura = await tursoClient.execute({
          sql: `PRAGMA table_info(${tabla})`
        });

        console.log(`   ${colors.cyan}📋 Campos (${estructura.rows.length}):${colors.reset}`);
        estructura.rows.slice(0, 5).forEach(campo => {
          console.log(`      ${colors.cyan}${campo.name}${colors.reset} (${campo.type})`);
        });
        if (estructura.rows.length > 5) {
          console.log(`      ${colors.cyan}... y ${estructura.rows.length - 5} campos más${colors.reset}`);
        }

        // Guardar resumen
        resumenTablas[tabla] = {
          existe: true,
          registros: totalRegistros,
          registrosOrg: registrosOrg,
          campos: estructura.rows.length
        };

        // Mostrar ejemplos de entidad_tipo si es una tabla genérica
        if (['sgc_personal_relaciones', 'sgc_documentos_relacionados', 'sgc_normas_relacionadas'].includes(tabla)) {
          try {
            const tiposResult = await tursoClient.execute({
              sql: `SELECT entidad_tipo, COUNT(*) as cantidad FROM ${tabla} WHERE organization_id = ? GROUP BY entidad_tipo ORDER BY cantidad DESC LIMIT 5`,
              args: [organizationId]
            });
            
            if (tiposResult.rows.length > 0) {
              console.log(`   ${colors.magenta}🔍 Tipos de entidad:${colors.reset}`);
              tiposResult.rows.forEach(tipo => {
                console.log(`      ${colors.magenta}${tipo.entidad_tipo}${colors.reset}: ${tipo.cantidad} registros`);
              });
            }
          } catch (error) {
            // Silenciosamente continuar si no hay datos
          }
        }

      } catch (error) {
        console.log(`   ${colors.red}❌ Error verificando '${tabla}': ${error.message}${colors.reset}`);
        resumenTablas[tabla] = { existe: false, registros: 0, error: error.message };
      }
    }

    // 2. Verificar vistas SGC
    console.log(`\n${colors.magenta}👁️  VERIFICANDO VISTAS SGC${colors.reset}`);
    for (const vista of VISTAS_SGC) {
      try {
        console.log(`\n${colors.yellow}🔍 Verificando vista: ${vista}${colors.reset}`);
        
        // Verificar si la vista existe
        const existeVista = await tursoClient.execute({
          sql: `SELECT name FROM sqlite_master WHERE type='view' AND name=?`,
          args: [vista]
        });

        if (existeVista.rows.length === 0) {
          console.log(`   ${colors.red}❌ Vista '${vista}' no existe${colors.reset}`);
          continue;
        }

        // Probar la vista con un SELECT limitado
        const vistaResult = await tursoClient.execute({
          sql: `SELECT COUNT(*) as total FROM ${vista}`
        });
        const totalVista = vistaResult.rows[0]?.total || 0;

        console.log(`   ${colors.green}✅ Vista funcional - ${totalVista} registros${colors.reset}`);

      } catch (error) {
        console.log(`   ${colors.red}❌ Error en vista '${vista}': ${error.message}${colors.reset}`);
      }
    }

    // 3. Verificar datos de ejemplo
    console.log(`\n${colors.magenta}🧪 VERIFICANDO DATOS DE EJEMPLO${colors.reset}`);
    
    // Verificar procesos de ejemplo
    try {
      const procesosEjemplo = await tursoClient.execute({
        sql: `SELECT entidad_id, COUNT(*) as cantidad FROM sgc_personal_relaciones WHERE entidad_tipo = 'proceso' AND organization_id = ? GROUP BY entidad_id`,
        args: [organizationId]
      });
      
      console.log(`\n${colors.cyan}🔄 Procesos con participantes:${colors.reset}`);
      if (procesosEjemplo.rows.length > 0) {
        procesosEjemplo.rows.forEach(proceso => {
          console.log(`   ${colors.cyan}${proceso.entidad_id}${colors.reset}: ${proceso.cantidad} participantes`);
        });
      } else {
        console.log(`   ${colors.yellow}⚠️  No se encontraron procesos con participantes${colors.reset}`);
      }
    } catch (error) {
      console.log(`   ${colors.red}❌ Error verificando procesos: ${error.message}${colors.reset}`);
    }

    // Verificar relaciones de procesos
    try {
      const relacionesProcesos = await tursoClient.execute({
        sql: `SELECT tipo_relacion, COUNT(*) as cantidad FROM procesos_relaciones WHERE organization_id = ? GROUP BY tipo_relacion`,
        args: [organizationId]
      });
      
      console.log(`\n${colors.cyan}🔗 Relaciones de procesos:${colors.reset}`);
      if (relacionesProcesos.rows.length > 0) {
        relacionesProcesos.rows.forEach(relacion => {
          console.log(`   ${colors.cyan}${relacion.tipo_relacion}${colors.reset}: ${relacion.cantidad} relaciones`);
        });
      } else {
        console.log(`   ${colors.yellow}⚠️  No se encontraron relaciones de procesos${colors.reset}`);
      }
    } catch (error) {
      console.log(`   ${colors.red}❌ Error verificando relaciones: ${error.message}${colors.reset}`);
    }

    // 4. Resumen ejecutivo
    console.log(`\n${colors.green}${colors.bright}📊 RESUMEN EJECUTIVO SGC ESTANDARIZADO${colors.reset}`);
    console.log(''.padEnd(70, '='));
    
    const tablasExistentes = Object.values(resumenTablas).filter(t => t.existe).length;
    const totalRegistros = Object.values(resumenTablas).reduce((sum, t) => sum + (t.registros || 0), 0);
    const registrosOrg = Object.values(resumenTablas).reduce((sum, t) => sum + (t.registrosOrg || 0), 0);
    
    console.log(`${colors.blue}📋 Tablas SGC verificadas: ${TABLAS_SGC_ESTANDARIZADO.length}${colors.reset}`);
    console.log(`${colors.green}✅ Tablas existentes: ${tablasExistentes}${colors.reset}`);
    console.log(`${colors.red}❌ Tablas faltantes: ${TABLAS_SGC_ESTANDARIZADO.length - tablasExistentes}${colors.reset}`);
    console.log(`${colors.blue}📊 Total registros: ${totalRegistros}${colors.reset}`);
    console.log(`${colors.blue}🏢 Registros org ${organizationId}: ${registrosOrg}${colors.reset}`);

    // Top tablas con más datos
    const topTablas = Object.entries(resumenTablas)
      .filter(([_, data]) => data.existe && data.registros > 0)
      .sort(([_, a], [__, b]) => b.registros - a.registros)
      .slice(0, 5);

    if (topTablas.length > 0) {
      console.log(`\n${colors.yellow}🏆 TOP TABLAS SGC CON MÁS DATOS:${colors.reset}`);
      topTablas.forEach(([tabla, data], index) => {
        console.log(`   ${index + 1}. ${colors.yellow}${tabla}${colors.reset}: ${data.registros} registros`);
      });
    }

    console.log(`\n${colors.green}${colors.bright}🎉 Verificación SGC Estandarizado completada!${colors.reset}`);
    
    // Recomendaciones
    if (tablasExistentes === TABLAS_SGC_ESTANDARIZADO.length) {
      console.log(`\n${colors.green}✅ SISTEMA SGC ESTANDARIZADO COMPLETAMENTE IMPLEMENTADO${colors.reset}`);
      console.log(`${colors.cyan}🚀 Listo para comenzar migración de módulos existentes${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  FALTAN TABLAS POR IMPLEMENTAR${colors.reset}`);
      console.log(`${colors.blue}📝 Ejecutar comandos de creación de tablas faltantes${colors.reset}`);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Error durante la verificación SGC:${colors.reset}`, error);
  }
}

// Función para ejecutar verificación con parámetros
async function main() {
  const args = process.argv.slice(2);
  const organizationId = args[0] || '2';
  
  console.log(`${colors.cyan}🚀 Iniciando verificación SGC Estandarizado...${colors.reset}`);
  
  await verificarSGCEstandarizado(organizationId);
}

// Manejo de señales para salida limpia
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}👋 Verificación SGC interrumpida por el usuario${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}👋 Verificación SGC terminada${colors.reset}`);
  process.exit(0);
});

// Exportar función para uso en otros módulos
module.exports = { verificarSGCEstandarizado };

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}
