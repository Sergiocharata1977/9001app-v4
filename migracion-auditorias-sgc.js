const { tursoClient } = require('./backend/lib/tursoClient.js');

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

/**
 * 🔄 MIGRACIÓN MÓDULO AUDITORÍAS AL SISTEMA SGC ESTANDARIZADO
 * 
 * Este script migra los datos del módulo de auditorías para usar las 3 tablas genéricas SGC:
 * - sgc_participantes (para auditores, auditados, testigos)
 * - sgc_documentos_relacionados (para planes, listas, evidencias, informes)
 * - sgc_normas_relacionadas (para puntos ISO evaluados - migra desde auditoria_aspectos)
 */

async function migrarAuditoriasToSGC(organizationId = '2') {
  try {
    console.log(`${colors.cyan}${colors.bright}🔄 MIGRACIÓN AUDITORÍAS A SISTEMA SGC ESTANDARIZADO${colors.reset}`);
    console.log(`${colors.blue}📅 Fecha: ${new Date().toLocaleString('es-ES')}${colors.reset}`);
    console.log(`${colors.blue}🏢 Organización ID: ${organizationId}${colors.reset}`);
    console.log(''.padEnd(80, '='));

    // FASE 1: VERIFICAR ESTADO ACTUAL
    console.log(`\n${colors.magenta}📊 FASE 1: VERIFICACIÓN DE ESTADO ACTUAL${colors.reset}`);
    
    // Verificar tablas existentes
    console.log(`\n${colors.yellow}🔍 Verificando tablas existentes...${colors.reset}`);
    
    const auditoriasCount = await contarRegistros('auditorias', organizationId);
    const aspectosCount = await contarRegistros('auditoria_aspectos');
    
    console.log(`   ${colors.green}✅ auditorias: ${auditoriasCount} registros${colors.reset}`);
    console.log(`   ${colors.green}✅ auditoria_aspectos: ${aspectosCount} registros${colors.reset}`);

    // Verificar tablas SGC objetivo
    const sgcParticipantesCount = await contarRegistros('sgc_participantes', organizationId);
    const sgcDocumentosCount = await contarRegistros('sgc_documentos_relacionados', organizationId);
    const sgcNormasCount = await contarRegistros('sgc_normas_relacionadas', organizationId);
    
    console.log(`   ${colors.blue}📊 sgc_participantes: ${sgcParticipantesCount} registros${colors.reset}`);
    console.log(`   ${colors.blue}📊 sgc_documentos_relacionados: ${sgcDocumentosCount} registros${colors.reset}`);
    console.log(`   ${colors.blue}📊 sgc_normas_relacionadas: ${sgcNormasCount} registros${colors.reset}`);

    if (aspectosCount === 0) {
      console.log(`\n${colors.yellow}⚠️  No hay aspectos de auditoría para migrar${colors.reset}`);
      return;
    }

    // FASE 2: MIGRACIÓN DE DATOS auditoria_aspectos → sgc_normas_relacionadas
    console.log(`\n${colors.magenta}🔄 FASE 2: MIGRACIÓN DE ASPECTOS A NORMAS SGC${colors.reset}`);
    
    console.log(`\n${colors.yellow}📋 Migrando ${aspectosCount} aspectos de auditoría...${colors.reset}`);
    
    // Obtener todos los aspectos de auditoría
    const aspectosResult = await tursoClient.execute({
      sql: `
        SELECT 
          aa.*,
          a.organization_id,
          a.titulo as auditoria_titulo
        FROM auditoria_aspectos aa
        INNER JOIN auditorias a ON aa.auditoria_id = a.id
        WHERE a.organization_id = ?
      `,
      args: [organizationId]
    });

    let migrados = 0;
    let errores = 0;

    for (const aspecto of aspectosResult.rows) {
      try {
        // Generar ID único para el registro de norma
        const normaId = `NOR_AUD_${aspecto.id}`;
        
        // Determinar nivel de cumplimiento basado en conformidad
        let nivelCumplimiento = 'pendiente';
        if (aspecto.conformidad) {
          switch (aspecto.conformidad.toLowerCase()) {
            case 'conforme':
            case 'cumple':
              nivelCumplimiento = 'cumple';
              break;
            case 'no conforme':
            case 'no cumple':
              nivelCumplimiento = 'no_cumple';
              break;
            case 'observacion':
              nivelCumplimiento = 'oportunidad_mejora';
              break;
            default:
              nivelCumplimiento = 'pendiente';
          }
        }

        // Crear observaciones completas
        let observacionesCompletas = [];
        if (aspecto.proceso_nombre) observacionesCompletas.push(`Proceso: ${aspecto.proceso_nombre}`);
        if (aspecto.documentacion_referenciada) observacionesCompletas.push(`Documentación: ${aspecto.documentacion_referenciada}`);
        if (aspecto.auditor_nombre) observacionesCompletas.push(`Auditor: ${aspecto.auditor_nombre}`);
        if (aspecto.observaciones) observacionesCompletas.push(`Observaciones: ${aspecto.observaciones}`);

        const observacionesFinal = observacionesCompletas.join(' | ');

        // Insertar en sgc_normas_relacionadas
        await tursoClient.execute({
          sql: `
            INSERT INTO sgc_normas_relacionadas (
              id, organization_id, entidad_tipo, entidad_id, norma_id,
              punto_norma, clausula_descripcion, tipo_relacion,
              nivel_cumplimiento, observaciones, evidencias,
              acciones_requeridas, datos_adicionales,
              created_at, updated_at, created_by, updated_by, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            normaId,
            aspecto.organization_id,
            'auditoria',
            aspecto.auditoria_id,
            1, // ISO 9001 por defecto
            aspecto.proceso_nombre || 'Proceso no especificado',
            `Aspecto evaluado en auditoría: ${aspecto.auditoria_titulo}`,
            'evaluado_en_auditoria',
            nivelCumplimiento,
            observacionesFinal,
            aspecto.documentacion_referenciada || null,
            aspecto.conformidad === 'no conforme' ? 'Implementar acciones correctivas' : null,
            JSON.stringify({
              aspecto_original_id: aspecto.id,
              auditor_nombre: aspecto.auditor_nombre,
              conformidad_original: aspecto.conformidad,
              proceso_id: aspecto.proceso_id
            }),
            aspecto.created_at || new Date().toISOString(),
            new Date().toISOString(),
            null,
            null,
            1
          ]
        });

        migrados++;
        console.log(`   ${colors.green}✅ Migrado aspecto ${aspecto.id} → ${normaId}${colors.reset}`);

      } catch (error) {
        errores++;
        console.log(`   ${colors.red}❌ Error migrando aspecto ${aspecto.id}: ${error.message}${colors.reset}`);
      }
    }

    console.log(`\n${colors.green}📊 RESULTADO MIGRACIÓN ASPECTOS:${colors.reset}`);
    console.log(`   ${colors.green}✅ Migrados exitosamente: ${migrados}${colors.reset}`);
    console.log(`   ${colors.red}❌ Errores: ${errores}${colors.reset}`);

    // FASE 3: CREAR PARTICIPANTES DE EJEMPLO PARA AUDITORÍAS
    console.log(`\n${colors.magenta}👥 FASE 3: CREAR PARTICIPANTES DE EJEMPLO${colors.reset}`);
    
    // Obtener auditorías que tienen responsable asignado
    const auditoriasConResponsable = await tursoClient.execute({
      sql: `
        SELECT a.*, p.nombres, p.apellidos 
        FROM auditorias a
        LEFT JOIN personal p ON a.responsable_id = p.id
        WHERE a.organization_id = ? AND a.responsable_id IS NOT NULL
      `,
      args: [organizationId]
    });

    let participantesCreados = 0;
    
    for (const auditoria of auditoriasConResponsable.rows) {
      try {
        // Crear participante como auditor líder
        const participanteId = `PAR_AUD_${auditoria.id}_${auditoria.responsable_id}`;
        
        await tursoClient.execute({
          sql: `
            INSERT OR IGNORE INTO sgc_participantes (
              id, organization_id, entidad_tipo, entidad_id,
              personal_id, rol, asistio, observaciones,
              datos_adicionales, created_at, updated_at, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            participanteId,
            organizationId,
            'auditoria',
            auditoria.id,
            auditoria.responsable_id,
            'auditor_lider',
            1,
            `Responsable asignado de la auditoría: ${auditoria.titulo}`,
            JSON.stringify({
              auditoria_codigo: auditoria.codigo,
              fecha_programada: auditoria.fecha_programada,
              areas: auditoria.area
            }),
            new Date().toISOString(),
            new Date().toISOString(),
            1
          ]
        });

        participantesCreados++;
        console.log(`   ${colors.green}✅ Participante creado para auditoría ${auditoria.codigo}${colors.reset}`);

      } catch (error) {
        if (!error.message.includes('UNIQUE constraint failed')) {
          console.log(`   ${colors.yellow}⚠️  Participante ya existe para auditoría ${auditoria.codigo}${colors.reset}`);
        }
      }
    }

    console.log(`\n${colors.green}📊 PARTICIPANTES CREADOS: ${participantesCreados}${colors.reset}`);

    // FASE 4: VERIFICACIÓN POST-MIGRACIÓN
    console.log(`\n${colors.magenta}🔍 FASE 4: VERIFICACIÓN POST-MIGRACIÓN${colors.reset}`);
    
    const normasMigradas = await tursoClient.execute({
      sql: `
        SELECT COUNT(*) as total FROM sgc_normas_relacionadas 
        WHERE entidad_tipo = 'auditoria' AND organization_id = ?
      `,
      args: [organizationId]
    });

    const participantesAuditorias = await tursoClient.execute({
      sql: `
        SELECT COUNT(*) as total FROM sgc_participantes 
        WHERE entidad_tipo = 'auditoria' AND organization_id = ?
      `,
      args: [organizationId]
    });

    console.log(`\n${colors.blue}📊 ESTADO POST-MIGRACIÓN:${colors.reset}`);
    console.log(`   ${colors.green}🏛️ Normas SGC para auditorías: ${normasMigradas.rows[0].total}${colors.reset}`);
    console.log(`   ${colors.green}👥 Participantes en auditorías: ${participantesAuditorias.rows[0].total}${colors.reset}`);

    // FASE 5: RECOMENDACIONES
    console.log(`\n${colors.magenta}💡 FASE 5: RECOMENDACIONES${colors.reset}`);
    console.log(`\n${colors.cyan}📋 PRÓXIMOS PASOS:${colors.reset}`);
    console.log(`   1. ${colors.yellow}Verificar datos migrados en interfaz${colors.reset}`);
    console.log(`   2. ${colors.yellow}Actualizar backend con endpoints SGC${colors.reset}`);
    console.log(`   3. ${colors.yellow}Expandir frontend con nuevas funcionalidades${colors.reset}`);
    console.log(`   4. ${colors.yellow}Eliminar tabla auditoria_aspectos (DESPUÉS de verificar)${colors.reset}`);

    if (migrados === aspectosCount && errores === 0) {
      console.log(`\n${colors.green}${colors.bright}🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE${colors.reset}`);
      console.log(`${colors.green}✅ Todos los aspectos fueron migrados correctamente${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  MIGRACIÓN COMPLETADA CON ADVERTENCIAS${colors.reset}`);
      console.log(`${colors.yellow}📝 Revisar errores antes de eliminar tabla original${colors.reset}`);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Error durante la migración:${colors.reset}`, error);
    process.exit(1);
  }
}

// Función auxiliar para contar registros
async function contarRegistros(tabla, organizationId = null) {
  try {
    let sql = `SELECT COUNT(*) as total FROM ${tabla}`;
    let args = [];
    
    if (organizationId && tabla !== 'auditoria_aspectos') {
      sql += ` WHERE organization_id = ?`;
      args = [organizationId];
    }
    
    const result = await tursoClient.execute({ sql, args });
    return result.rows[0]?.total || 0;
  } catch (error) {
    console.log(`   ${colors.red}❌ Error contando ${tabla}: ${error.message}${colors.reset}`);
    return 0;
  }
}

// Función para ejecutar migración con parámetros
async function main() {
  const args = process.argv.slice(2);
  const organizationId = args[0] || '2';
  
  console.log(`${colors.cyan}🚀 Iniciando migración de auditorías al sistema SGC...${colors.reset}`);
  
  await migrarAuditoriasToSGC(organizationId);
}

// Manejo de señales para salida limpia
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}👋 Migración interrumpida por el usuario${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}👋 Migración terminada${colors.reset}`);
  process.exit(0);
});

// Exportar función para uso en otros módulos
module.exports = { migrarAuditoriasToSGC };

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}
