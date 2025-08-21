const { generarMapaArchivos } = require('./generar-mapa-archivos.js');
const { generarMapaDatabase } = require('./generar-mapa-database.js');
const { sincronizarCoordinacion } = require('./coordinacion-auto-save.js');
const fs = require('fs');
const path = require('path');

class SistemaActualizacionAutomatica {
  constructor() {
    this.logPath = path.join(__dirname, '../../../logs/actualizacion-automatica.log');
    this.intervalo = 30 * 60 * 1000; // 30 minutos
    this.activo = false;
  }

  async iniciar() {
    console.log('🚀 Iniciando sistema de actualización automática...');
    this.activo = true;
    
    // Ejecutar inmediatamente
    await this.ejecutarActualizacion();
    
    // Programar ejecución periódica
    this.timer = setInterval(async () => {
      if (this.activo) {
        await this.ejecutarActualizacion();
      }
    }, this.intervalo);
    
    console.log(`✅ Sistema iniciado. Actualización cada ${this.intervalo / 60000} minutos`);
  }

  async detener() {
    console.log('🛑 Deteniendo sistema de actualización automática...');
    this.activo = false;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    console.log('✅ Sistema detenido');
  }

  async ejecutarActualizacion() {
    const timestamp = new Date().toISOString();
    console.log(`\n🔄 Ejecutando actualización automática: ${timestamp}`);
    
    const resultados = {
      timestamp,
      archivos: false,
      database: false,
      coordinacion: false,
      errores: []
    };

    try {
      // 1. Actualizar mapa de archivos
      console.log('📁 Actualizando mapa de archivos...');
      await generarMapaArchivos();
      resultados.archivos = true;
      console.log('✅ Mapa de archivos actualizado');

    } catch (error) {
      console.error('❌ Error actualizando mapa de archivos:', error.message);
      resultados.errores.push(`Archivos: ${error.message}`);
    }

    try {
      // 2. Actualizar mapa de base de datos
      console.log('🗄️ Actualizando mapa de base de datos...');
      await generarMapaDatabase();
      resultados.database = true;
      console.log('✅ Mapa de base de datos actualizado');

    } catch (error) {
      console.error('❌ Error actualizando mapa de BD:', error.message);
      resultados.errores.push(`Database: ${error.message}`);
    }

    try {
      // 3. Sincronizar coordinación
      console.log('📋 Sincronizando coordinación...');
      await sincronizarCoordinacion();
      resultados.coordinacion = true;
      console.log('✅ Coordinación sincronizada');

    } catch (error) {
      console.error('❌ Error sincronizando coordinación:', error.message);
      resultados.errores.push(`Coordinación: ${error.message}`);
    }

    // 4. Generar resumen ejecutivo
    await this.generarResumenEjecutivo(resultados);

    // 5. Registrar en log
    await this.registrarLog(resultados);

    console.log('🎉 Actualización automática completada');
    return resultados;
  }

  async generarResumenEjecutivo(resultados) {
    const contenido = `# 📊 RESUMEN EJECUTIVO - SISTEMA SGC
**📅 Última Actualización: ${new Date().toLocaleString('es-ES')}**

## 🎯 **ESTADO DEL SISTEMA**
- **Mapa de Archivos:** ${resultados.archivos ? '✅ Actualizado' : '❌ Error'}
- **Mapa de Base de Datos:** ${resultados.database ? '✅ Actualizado' : '❌ Error'}
- **Coordinación:** ${resultados.coordinacion ? '✅ Sincronizada' : '❌ Error'}

## 📈 **ESTADÍSTICAS RÁPIDAS**
- **Total Archivos:** [Ver mapa automático]
- **Total Tablas BD:** [Ver mapa automático]
- **Total Tareas:** [Ver tabla coordinacion_tareas]

## 🔗 **DOCUMENTACIÓN ACTUALIZADA**
1. **📋 Historial:** Tabla \`coordinacion_tareas\` (automática)
2. **🗂️ Archivos:** \`docs-esenciales/02-mapa-archivos-automatico.md\`
3. **🗄️ Base de Datos:** \`docs-esenciales/03-mapa-database-automatico.md\`

## ⚠️ **ERRORES (si los hay)**
${resultados.errores.length > 0 ? resultados.errores.map(error => `- ${error}`).join('\n') : '- No hay errores'}

## 📝 **NOTAS PARA IA**
- **Historial de tareas:** Consultar tabla \`coordinacion_tareas\` directamente
- **Mapa de archivos:** Ver documento automático generado
- **Estructura BD:** Ver documento automático generado
- **Actualización:** Automática cada 30 minutos
`;

    const outputPath = path.join(__dirname, '../../../docs-esenciales/00-resumen-ejecutivo-actual.md');
    fs.writeFileSync(outputPath, contenido);
    console.log('✅ Resumen ejecutivo generado');
  }

  async registrarLog(resultados) {
    const logEntry = {
      timestamp: resultados.timestamp,
      archivos: resultados.archivos,
      database: resultados.database,
      coordinacion: resultados.coordinacion,
      errores: resultados.errores
    };

    // Asegurar que existe el directorio de logs
    const logDir = path.dirname(this.logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Leer log existente
    let logs = [];
    if (fs.existsSync(this.logPath)) {
      try {
        const logContent = fs.readFileSync(this.logPath, 'utf8');
        logs = JSON.parse(logContent);
      } catch (error) {
        console.warn('⚠️ Error leyendo log existente, creando nuevo');
      }
    }

    // Agregar nueva entrada
    logs.push(logEntry);

    // Mantener solo las últimas 100 entradas
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }

    // Guardar log
    fs.writeFileSync(this.logPath, JSON.stringify(logs, null, 2));
  }

  // Método para ejecutar manualmente
  async ejecutarManual() {
    console.log('🔧 Ejecutando actualización manual...');
    return await this.ejecutarActualizacion();
  }

  // Método para cambiar intervalo
  cambiarIntervalo(nuevoIntervaloMinutos) {
    this.intervalo = nuevoIntervaloMinutos * 60 * 1000;
    console.log(`⏰ Intervalo cambiado a ${nuevoIntervaloMinutos} minutos`);
    
    if (this.activo) {
      this.detener();
      this.iniciar();
    }
  }
}

// Instancia global
const sistemaActualizacion = new SistemaActualizacionAutomatica();

// Comandos de línea
if (require.main === module) {
  const comando = process.argv[2];
  
  switch (comando) {
    case 'iniciar':
      sistemaActualizacion.iniciar();
      break;
    case 'detener':
      sistemaActualizacion.detener();
      break;
    case 'manual':
      sistemaActualizacion.ejecutarManual();
      break;
    case 'intervalo':
      const minutos = parseInt(process.argv[3]) || 30;
      sistemaActualizacion.cambiarIntervalo(minutos);
      break;
    default:
      console.log(`
🔧 Sistema de Actualización Automática

Comandos disponibles:
  node sistema-actualizacion-automatica.js iniciar    - Iniciar sistema automático
  node sistema-actualizacion-automatica.js detener    - Detener sistema
  node sistema-actualizacion-automatica.js manual     - Ejecutar actualización manual
  node sistema-actualizacion-automatica.js intervalo 30 - Cambiar intervalo (minutos)
      `);
  }
}

module.exports = { SistemaActualizacionAutomatica, sistemaActualizacion };
