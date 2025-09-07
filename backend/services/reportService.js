const { MongoClient, ObjectId } = require('mongodb');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const mongoClient = require('../lib/mongoClient.js');

class ReportService {
  constructor() {
    this.transporter = null;
    this.setupEmailTransporter();
    this.scheduleReports();
  }

  /**
   * Configura el transportador de email
   */
  setupEmailTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  /**
   * Programa reportes automáticos
   */
  scheduleReports() {
    // Reporte diario a las 8:00 AM
    cron.schedule('0 8 * * *', () => {
      this.generateDailyReport();
    });

    // Reporte semanal los lunes a las 9:00 AM
    cron.schedule('0 9 * * 1', () => {
      this.generateWeeklyReport();
    });

    // Reporte mensual el día 1 a las 10:00 AM
    cron.schedule('0 10 1 * *', () => {
      this.generateMonthlyReport();
    });

    console.log('📅 Reportes automáticos programados');
  }

  /**
   * Genera reporte diario
   */
  async generateDailyReport() {
    try {
      console.log('📊 Generando reporte diario...');
      
      const reportData = await this.collectDailyData();
      const report = await this.generateReportHTML('daily', reportData);
      
      // Guardar reporte
      await this.saveReport('daily', report, reportData);
      
      // Enviar por email si está configurado
      if (this.transporter) {
        await this.sendReportEmail('Reporte Diario SGC', report, 'daily');
      }
      
      console.log('✅ Reporte diario generado exitosamente');
    } catch (error) {
      console.error('❌ Error generando reporte diario:', error);
    }
  }

  /**
   * Genera reporte semanal
   */
  async generateWeeklyReport() {
    try {
      console.log('📊 Generando reporte semanal...');
      
      const reportData = await this.collectWeeklyData();
      const report = await this.generateReportHTML('weekly', reportData);
      
      // Guardar reporte
      await this.saveReport('weekly', report, reportData);
      
      // Enviar por email si está configurado
      if (this.transporter) {
        await this.sendReportEmail('Reporte Semanal SGC', report, 'weekly');
      }
      
      console.log('✅ Reporte semanal generado exitosamente');
    } catch (error) {
      console.error('❌ Error generando reporte semanal:', error);
    }
  }

  /**
   * Genera reporte mensual
   */
  async generateMonthlyReport() {
    try {
      console.log('📊 Generando reporte mensual...');
      
      const reportData = await this.collectMonthlyData();
      const report = await this.generateReportHTML('monthly', reportData);
      
      // Guardar reporte
      await this.saveReport('monthly', report, reportData);
      
      // Enviar por email si está configurado
      await this.sendReportEmail('Reporte Mensual SGC', report, 'monthly');
      
      console.log('✅ Reporte mensual generado exitosamente');
    } catch (error) {
      console.error('❌ Error generando reporte mensual:', error);
    }
  }

  /**
   * Recopila datos para reporte diario
   */
  async collectDailyData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const data = await mongoClient.execute({
      sql: `
        SELECT 
          'personal' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
          COUNT(CASE WHEN DATE(created_at) = DATE(?) THEN 1 END) as nuevos_hoy
        FROM personal 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'procesos' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
          COUNT(CASE WHEN DATE(created_at) = DATE(?) THEN 1 END) as nuevos_hoy
        FROM procesos 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'indicadores' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as activos,
          COUNT(CASE WHEN DATE(created_at) = DATE(?) THEN 1 END) as nuevos_hoy
        FROM indicadores 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'objetivos' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
          COUNT(CASE WHEN DATE(created_at) = DATE(?) THEN 1 END) as nuevos_hoy
        FROM objetivos_calidad 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'mediciones' as tipo,
          COUNT(*) as total,
          COUNT(*) as activos,
          COUNT(CASE WHEN DATE(fecha_medicion) = DATE(?) THEN 1 END) as nuevos_hoy
        FROM mediciones 
        WHERE is_active = 1
      `,
      args: [today, today, today, today, today]
    });

    return {
      date: today,
      summary: data.rows,
      alerts: await this.getDailyAlerts()
    };
  }

  /**
   * Recopila datos para reporte semanal
   */
  async collectWeeklyData() {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const data = await mongoClient.execute({
      sql: `
        SELECT 
          'procesos' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN nivel_critico = 'critico' THEN 1 END) as criticos,
          COUNT(CASE WHEN nivel_critico = 'alto' THEN 1 END) as altos
        FROM procesos 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'objetivos' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'completado' THEN 1 END) as completados,
          COUNT(CASE WHEN estado = 'en_progreso' THEN 1 END) as en_progreso
        FROM objetivos_calidad 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'mediciones' as tipo,
          COUNT(*) as total,
          COUNT(CASE WHEN DATE(fecha_medicion) >= DATE(?) THEN 1 END) as esta_semana,
          AVG(valor) as promedio_valor
        FROM mediciones 
        WHERE is_active = 1
      `,
      args: [startDate]
    });

    return {
      startDate,
      endDate,
      summary: data.rows,
      trends: await this.getWeeklyTrends()
    };
  }

  /**
   * Recopila datos para reporte mensual
   */
  async collectMonthlyData() {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 1);

    const data = await mongoClient.execute({
      sql: `
        SELECT 
          'resumen_general' as tipo,
          (SELECT COUNT(*) FROM personal WHERE is_active = 1) as total_personal,
          (SELECT COUNT(*) FROM procesos WHERE is_active = 1) as total_procesos,
          (SELECT COUNT(*) FROM indicadores WHERE is_active = 1) as total_indicadores,
          (SELECT COUNT(*) FROM objetivos_calidad WHERE is_active = 1) as total_objetivos,
          (SELECT COUNT(*) FROM mediciones WHERE is_active = 1) as total_mediciones
      `
    });

    return {
      startDate,
      endDate,
      summary: data.rows,
      performance: await this.getMonthlyPerformance(),
      recommendations: await this.getMonthlyRecommendations()
    };
  }

  /**
   * Obtiene alertas diarias
   */
  async getDailyAlerts() {
    const alerts = [];

    // Verificar objetivos vencidos
    const objetivosVencidos = await mongoClient.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM objetivos_calidad 
        WHERE fecha_limite < CURDATE() 
        AND estado NOT IN ('completado', 'cancelado')
        AND is_active = 1
      `
    });

    if (objetivosVencidos.rows[0].count > 0) {
      alerts.push({
        type: 'warning',
        message: `${objetivosVencidos.rows[0].count} objetivos han vencido`,
        priority: 'high'
      });
    }

    // Verificar mediciones pendientes
    const medicionesPendientes = await mongoClient.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM mediciones 
        WHERE estado = 'pendiente' 
        AND is_active = 1
      `
    });

    if (medicionesPendientes.rows[0].count > 0) {
      alerts.push({
        type: 'info',
        message: `${medicionesPendientes.rows[0].count} mediciones pendientes`,
        priority: 'medium'
      });
    }

    return alerts;
  }

  /**
   * Obtiene tendencias semanales
   */
  async getWeeklyTrends() {
    const trends = await mongoClient.execute({
      sql: `
        SELECT 
          DATE(fecha_medicion) as fecha,
          COUNT(*) as mediciones,
          AVG(valor) as promedio_valor
        FROM mediciones 
        WHERE fecha_medicion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND is_active = 1
        GROUP BY DATE(fecha_medicion)
        ORDER BY fecha
      `
    });

    return trends.rows;
  }

  /**
   * Obtiene rendimiento mensual
   */
  async getMonthlyPerformance() {
    const performance = await mongoClient.execute({
      sql: `
        SELECT 
          'objetivos' as categoria,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'completado' THEN 1 END) as completados,
          ROUND(COUNT(CASE WHEN estado = 'completado' THEN 1 END) * 100.0 / COUNT(*), 2) as porcentaje_cumplimiento
        FROM objetivos_calidad 
        WHERE is_active = 1
        
        UNION ALL
        
        SELECT 
          'mediciones' as categoria,
          COUNT(*) as total,
          COUNT(CASE WHEN estado = 'completada' THEN 1 END) as completadas,
          ROUND(COUNT(CASE WHEN estado = 'completada' THEN 1 END) * 100.0 / COUNT(*), 2) as porcentaje_cumplimiento
        FROM mediciones 
        WHERE is_active = 1
      `
    });

    return performance.rows;
  }

  /**
   * Obtiene recomendaciones mensuales
   */
  async getMonthlyRecommendations() {
    const recommendations = [];

    // Analizar procesos críticos sin responsables
    const procesosSinResponsable = await mongoClient.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM procesos 
        WHERE nivel_critico IN ('critico', 'alto') 
        AND (responsable_id IS NULL OR responsable_id = '')
        AND is_active = 1
      `
    });

    if (procesosSinResponsable.rows[0].count > 0) {
      recommendations.push({
        type: 'critical',
        message: `Asignar responsables a ${procesosSinResponsable.rows[0].count} procesos críticos`,
        action: 'Asignar responsables'
      });
    }

    // Analizar indicadores sin mediciones recientes
    const indicadoresSinMediciones = await mongoClient.execute({
      sql: `
        SELECT COUNT(*) as count 
        FROM indicadores i
        LEFT JOIN mediciones m ON i.id = m.indicador_id 
        AND m.fecha_medicion >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHERE i.is_active = 1 
        AND m.id IS NULL
      `
    });

    if (indicadoresSinMediciones.rows[0].count > 0) {
      recommendations.push({
        type: 'warning',
        message: `${indicadoresSinMediciones.rows[0].count} indicadores sin mediciones recientes`,
        action: 'Programar mediciones'
      });
    }

    return recommendations;
  }

  /**
   * Genera HTML del reporte
   */
  async generateReportHTML(type, data) {
    const template = await this.getReportTemplate(type);
    
    // Reemplazar variables en el template
    let html = template
      .replace('{{DATE}}', new Date().toLocaleDateString('es-ES'))
      .replace('{{TYPE}}', type.toUpperCase())
      .replace('{{DATA}}', JSON.stringify(data));

    return html;
  }

  /**
   * Obtiene template del reporte
   */
  async getReportTemplate(type) {
    const templatePath = path.join(__dirname, '../templates', `${type}-report.html`);
    
    try {
      return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      // Template por defecto si no existe el archivo
      return this.getDefaultTemplate(type);
    }
  }

  /**
   * Template por defecto
   */
  getDefaultTemplate(type) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte {{TYPE}} - SGC</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; }
          .content { margin: 20px 0; }
          .summary { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .alert { padding: 10px; margin: 10px 0; border-radius: 4px; }
          .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
          .alert-info { background: #dbeafe; border-left: 4px solid #3b82f6; }
          .alert-critical { background: #fee2e2; border-left: 4px solid #ef4444; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte {{TYPE}} - Sistema de Gestión de Calidad</h1>
          <p>Fecha: {{DATE}}</p>
        </div>
        <div class="content">
          <h2>Resumen</h2>
          <div class="summary">
            <p>Datos del reporte:</p>
            <pre>{{DATA}}</pre>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Guarda el reporte
   */
  async saveReport(type, html, data) {
    const reportsDir = path.join(__dirname, '../reports');
    
    // Crear directorio si no existe
    try {
      await fs.mkdir(reportsDir, { recursive: true });
    } catch (error) {
      // El directorio ya existe
    }

    const filename = `${type}-${new Date().toISOString().split('T')[0]}.html`;
    const filepath = path.join(reportsDir, filename);
    
    await fs.writeFile(filepath, html);
    
    // También guardar datos JSON
    const jsonFilename = `${type}-${new Date().toISOString().split('T')[0]}.json`;
    const jsonFilepath = path.join(reportsDir, jsonFilename);
    
    await fs.writeFile(jsonFilepath, JSON.stringify(data, null, 2));
    
    console.log(`📁 Reporte guardado: ${filepath}`);
  }

  /**
   * Envía reporte por email
   */
  async sendReportEmail(subject, html, type) {
    if (!this.transporter) {
      console.log('⚠️ Transportador de email no configurado');
      return;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.REPORT_EMAIL_RECIPIENTS || process.env.SMTP_USER,
        subject: subject,
        html: html,
        attachments: [
          {
            filename: `${type}-report.html`,
            content: html,
            contentType: 'text/html'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Reporte enviado por email');
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }
  }

  /**
   * Genera reporte personalizado
   */
  async generateCustomReport(options) {
    const { type, startDate, endDate, organizationId, format = 'html' } = options;
    
    try {
      const data = await this.collectCustomData(type, startDate, endDate, organizationId);
      
      if (format === 'html') {
        const report = await this.generateReportHTML('custom', data);
        await this.saveReport('custom', report, data);
        return report;
      } else if (format === 'json') {
        return JSON.stringify(data, null, 2);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error generando reporte personalizado:', error);
      throw error;
    }
  }

  /**
   * Recopila datos personalizados
   */
  async collectCustomData(type, startDate, endDate, organizationId) {
    // Implementar lógica específica según el tipo de reporte
    const data = await mongoClient.execute({
      sql: `
        SELECT * FROM ${type} 
        WHERE created_at BETWEEN ? AND ? 
        AND organization_id = ?
        AND is_active = 1
        ORDER BY created_at DESC
      `,
      args: [startDate, endDate, organizationId]
    });

    return {
      type,
      startDate,
      endDate,
      organizationId,
      data: data.rows
    };
  }
}

module.exports = new ReportService();
