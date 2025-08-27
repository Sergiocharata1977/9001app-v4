import { EventEmitter } from 'events';
import * as os from 'os';
import { ResourceUtilization } from '../types/agent.types';
import { Logger } from '../utils/Logger';

interface HealthCheck {
  id: string;
  timestamp: string;
  type: 'agent' | 'system' | 'resource';
  status: 'healthy' | 'warning' | 'critical';
  details: any;
}

interface Alert {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  details?: any;
}

export class HealthMonitor extends EventEmitter {
  private healthChecks: HealthCheck[] = [];
  private alerts: Alert[] = [];
  private logger: Logger;
  private isRunning: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private checkInterval: number = 30000; // 30 segundos
  private maxHealthChecks: number = 1000;
  private maxAlerts: number = 500;

  // Umbrales de alerta
  private thresholds = {
    cpu: 80, // Porcentaje
    memory: 85, // Porcentaje
    disk: 90, // Porcentaje
    responseTime: 5000, // Milisegundos
    errorRate: 10, // Porcentaje
    agentFailures: 3 // Número de fallos consecutivos
  };

  constructor() {
    super();
    this.logger = new Logger('HealthMonitor');
  }

  /**
   * Realizar verificación de salud del sistema
   */
  async performSystemHealthCheck(): Promise<HealthCheck> {
    const check: HealthCheck = {
      id: `sys-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'system',
      status: 'healthy',
      details: {}
    };

    try {
      // Verificar recursos del sistema
      const resources = this.getSystemResources();
      check.details.resources = resources;

      // Verificar si hay problemas de recursos
      if (resources.cpu > this.thresholds.cpu) {
        check.status = 'warning';
        this.createAlert('warning', `CPU usage high: ${resources.cpu.toFixed(1)}%`, 'system');
      }

      if (resources.memory > this.thresholds.memory) {
        check.status = 'warning';
        this.createAlert('warning', `Memory usage high: ${resources.memory.toFixed(1)}%`, 'system');
      }

      if (resources.disk > this.thresholds.disk) {
        check.status = 'critical';
        this.createAlert('critical', `Disk usage critical: ${resources.disk.toFixed(1)}%`, 'system');
      }

      // Verificar conectividad de red
      const networkStatus = await this.checkNetworkConnectivity();
      check.details.network = networkStatus;

      if (!networkStatus.connected) {
        check.status = 'critical';
        this.createAlert('critical', 'Network connectivity issues detected', 'system');
      }

      this.addHealthCheck(check);
      this.logger.debug('System health check completed', { status: check.status });

    } catch (error) {
      check.status = 'critical';
      check.details.error = error instanceof Error ? error.message : 'Unknown error';
      this.createAlert('critical', 'System health check failed', 'system', error);
      this.addHealthCheck(check);
    }

    return check;
  }

  /**
   * Realizar verificación de salud de un agente específico
   */
  async performAgentHealthCheck(agentId: string, agentData: any): Promise<HealthCheck> {
    const check: HealthCheck = {
      id: `agent-${agentId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'agent',
      status: 'healthy',
      details: { agentId, agentData }
    };

    try {
      // Verificar estado del agente
      if (agentData.status === 'failed') {
        check.status = 'critical';
        this.createAlert('critical', `Agent ${agentId} is in failed state`, 'agent', { agentId });
      } else if (agentData.status === 'recovering') {
        check.status = 'warning';
        this.createAlert('warning', `Agent ${agentId} is recovering`, 'agent', { agentId });
      }

      // Verificar métricas del agente
      if (agentData.metrics) {
        const metrics = agentData.metrics;
        
        // Verificar tasa de error
        if (metrics.totalExecutions > 0) {
          const errorRate = (metrics.failedExecutions / metrics.totalExecutions) * 100;
          if (errorRate > this.thresholds.errorRate) {
            check.status = 'warning';
            this.createAlert('warning', `Agent ${agentId} has high error rate: ${errorRate.toFixed(1)}%`, 'agent', { agentId, errorRate });
          }
        }

        // Verificar tiempo de respuesta
        if (metrics.lastExecutionTime > this.thresholds.responseTime) {
          check.status = 'warning';
          this.createAlert('warning', `Agent ${agentId} has slow response time: ${metrics.lastExecutionTime}ms`, 'agent', { agentId, responseTime: metrics.lastExecutionTime });
        }

        // Verificar uso de recursos
        if (metrics.memoryUsage > this.thresholds.memory) {
          check.status = 'warning';
          this.createAlert('warning', `Agent ${agentId} has high memory usage: ${metrics.memoryUsage.toFixed(1)}%`, 'agent', { agentId, memoryUsage: metrics.memoryUsage });
        }

        if (metrics.cpuUsage > this.thresholds.cpu) {
          check.status = 'warning';
          this.createAlert('warning', `Agent ${agentId} has high CPU usage: ${metrics.cpuUsage.toFixed(1)}%`, 'agent', { agentId, cpuUsage: metrics.cpuUsage });
        }
      }

      // Verificar salud del agente
      if (agentData.health && !agentData.health.isHealthy) {
        check.status = 'critical';
        this.createAlert('critical', `Agent ${agentId} is not healthy`, 'agent', { agentId, health: agentData.health });
      }

      this.addHealthCheck(check);
      this.logger.debug(`Agent health check completed for ${agentId}`, { status: check.status });

    } catch (error) {
      check.status = 'critical';
      check.details.error = error instanceof Error ? error.message : 'Unknown error';
      this.createAlert('critical', `Agent health check failed for ${agentId}`, 'agent', error);
      this.addHealthCheck(check);
    }

    return check;
  }

  /**
   * Obtener recursos del sistema
   */
  getSystemResources(): ResourceUtilization {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = (usedMem / totalMem) * 100;

    // Simular métricas de CPU y disco (en un entorno real se usarían librerías específicas)
    const cpuUsage = Math.random() * 100; // Simulado
    const diskUsage = Math.random() * 100; // Simulado
    const networkUsage = Math.random() * 100; // Simulado

    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage,
      network: networkUsage
    };
  }

  /**
   * Verificar conectividad de red
   */
  private async checkNetworkConnectivity(): Promise<{ connected: boolean; latency?: number }> {
    try {
      // Simular verificación de conectividad
      const latency = Math.random() * 100;
      return {
        connected: latency < 50,
        latency
      };
    } catch (error) {
      return { connected: false };
    }
  }

  /**
   * Crear una alerta
   */
  createAlert(severity: Alert['severity'], message: string, source: string, details?: any): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      severity,
      message,
      source,
      details
    };

    this.alerts.push(alert);
    
    // Mantener límite de alertas
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    this.logger.warn(`Alert created: ${message}`, { severity, source, details });
    this.emit('alert_created', alert);

    // Emitir eventos específicos por severidad
    switch (severity) {
      case 'critical':
        this.emit('critical_alert', alert);
        break;
      case 'error':
        this.emit('error_alert', alert);
        break;
      case 'warning':
        this.emit('warning_alert', alert);
        break;
      case 'info':
        this.emit('info_alert', alert);
        break;
    }
  }

  /**
   * Agregar verificación de salud
   */
  private addHealthCheck(check: HealthCheck): void {
    this.healthChecks.push(check);
    
    // Mantener límite de verificaciones
    if (this.healthChecks.length > this.maxHealthChecks) {
      this.healthChecks = this.healthChecks.slice(-this.maxHealthChecks);
    }

    this.emit('health_check_completed', check);
  }

  /**
   * Obtener salud general del sistema
   */
  getSystemHealth(): number {
    const recentChecks = this.healthChecks.filter(check => {
      const checkTime = new Date(check.timestamp).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return checkTime > oneHourAgo;
    });

    if (recentChecks.length === 0) return 100;

    const healthyChecks = recentChecks.filter(check => check.status === 'healthy').length;
    return (healthyChecks / recentChecks.length) * 100;
  }

  /**
   * Obtener utilización de recursos
   */
  getResourceUtilization(): ResourceUtilization {
    return this.getSystemResources();
  }

  /**
   * Obtener alertas recientes
   */
  getRecentAlerts(hours: number = 24): Alert[] {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    return this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > cutoffTime
    );
  }

  /**
   * Obtener verificaciones de salud recientes
   */
  getRecentHealthChecks(hours: number = 24): HealthCheck[] {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    return this.healthChecks.filter(check => 
      new Date(check.timestamp).getTime() > cutoffTime
    );
  }

  /**
   * Obtener estadísticas de salud
   */
  getHealthStats(): {
    totalChecks: number;
    healthyChecks: number;
    warningChecks: number;
    criticalChecks: number;
    totalAlerts: number;
    criticalAlerts: number;
    systemHealth: number;
  } {
    const totalChecks = this.healthChecks.length;
    const healthyChecks = this.healthChecks.filter(c => c.status === 'healthy').length;
    const warningChecks = this.healthChecks.filter(c => c.status === 'warning').length;
    const criticalChecks = this.healthChecks.filter(c => c.status === 'critical').length;
    
    const totalAlerts = this.alerts.length;
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    
    return {
      totalChecks,
      healthyChecks,
      warningChecks,
      criticalChecks,
      totalAlerts,
      criticalAlerts,
      systemHealth: this.getSystemHealth()
    };
  }

  /**
   * Configurar umbrales de alerta
   */
  setThresholds(newThresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    this.logger.info('Health monitoring thresholds updated', this.thresholds);
  }

  /**
   * Limpiar datos antiguos
   */
  cleanupOldData(maxAge: number = 7 * 24 * 60 * 60 * 1000): void { // 7 días por defecto
    const cutoffTime = Date.now() - maxAge;
    
    const initialHealthChecks = this.healthChecks.length;
    const initialAlerts = this.alerts.length;
    
    this.healthChecks = this.healthChecks.filter(check => 
      new Date(check.timestamp).getTime() > cutoffTime
    );
    
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > cutoffTime
    );
    
    const removedChecks = initialHealthChecks - this.healthChecks.length;
    const removedAlerts = initialAlerts - this.alerts.length;
    
    if (removedChecks > 0 || removedAlerts > 0) {
      this.logger.info(`Cleaned up old data: ${removedChecks} health checks, ${removedAlerts} alerts`);
    }
  }

  /**
   * Iniciar monitoreo
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('HealthMonitor ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    this.logger.info('Iniciando HealthMonitor');
    
    // Realizar verificación inicial
    await this.performSystemHealthCheck();
    
    // Configurar monitoreo periódico
    this.monitoringInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.performSystemHealthCheck();
      }
    }, this.checkInterval);
    
    this.logger.info('HealthMonitor iniciado exitosamente');
  }

  /**
   * Detener monitoreo
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('HealthMonitor no está ejecutándose');
      return;
    }

    this.isRunning = false;
    this.logger.info('Deteniendo HealthMonitor');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.logger.info('HealthMonitor detenido');
  }

  /**
   * Obtener estado del monitor
   */
  getStatus(): {
    isRunning: boolean;
    totalHealthChecks: number;
    totalAlerts: number;
    systemHealth: number;
    lastCheck: string | null;
  } {
    const lastCheck = this.healthChecks.length > 0 
      ? this.healthChecks[this.healthChecks.length - 1].timestamp 
      : null;
    
    return {
      isRunning: this.isRunning,
      totalHealthChecks: this.healthChecks.length,
      totalAlerts: this.alerts.length,
      systemHealth: this.getSystemHealth(),
      lastCheck
    };
  }
}
