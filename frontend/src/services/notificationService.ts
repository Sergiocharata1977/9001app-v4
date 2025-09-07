import { useNotifications } from '@/context/NotificationContext';

class NotificationService {
  private static instance: NotificationService;
  private notificationContext: any = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public setNotificationContext(context: any) {
    this.notificationContext = context;
  }

  private addNotification(notification: any) {
    if (this.notificationContext) {
      this.notificationContext.addNotification(notification);
    } else {
      console.warn('NotificationContext no está disponible');
    }
  }

  // Notificaciones de éxito
  public success(title: string, message: string, action?: any) {
    this.addNotification({
      type: 'success',
      title,
      message,
      action,
      autoClose: true,
      duration: 5000
    });
  }

  // Notificaciones de error
  public error(title: string, message: string, action?: any) {
    this.addNotification({
      type: 'error',
      title,
      message,
      action,
      autoClose: false // Los errores no se cierran automáticamente
    });
  }

  // Notificaciones de advertencia
  public warning(title: string, message: string, action?: any) {
    this.addNotification({
      type: 'warning',
      title,
      message,
      action,
      autoClose: true,
      duration: 7000
    });
  }

  // Notificaciones informativas
  public info(title: string, message: string, action?: any) {
    this.addNotification({
      type: 'info',
      title,
      message,
      action,
      autoClose: true,
      duration: 5000
    });
  }

  // Notificaciones específicas del SGC

  // Personal
  public personalCreated(nombre: string) {
    this.success(
      'Personal Creado',
      `El empleado ${nombre} ha sido creado exitosamente`,
      {
        label: 'Ver Detalles',
        onClick: () => {
          // Navegar a detalles del personal
          console.log('Navegar a detalles del personal');
        }
      }
    );
  }

  public personalUpdated(nombre: string) {
    this.success(
      'Personal Actualizado',
      `Los datos de ${nombre} han sido actualizados`
    );
  }

  public personalDeleted(nombre: string) {
    this.warning(
      'Personal Eliminado',
      `El empleado ${nombre} ha sido eliminado del sistema`
    );
  }

  // Procesos
  public procesoCreated(nombre: string) {
    this.success(
      'Proceso Creado',
      `El proceso "${nombre}" ha sido creado exitosamente`,
      {
        label: 'Ver Proceso',
        onClick: () => {
          console.log('Navegar a detalles del proceso');
        }
      }
    );
  }

  public procesoUpdated(nombre: string) {
    this.success(
      'Proceso Actualizado',
      `El proceso "${nombre}" ha sido actualizado`
    );
  }

  public procesoDeleted(nombre: string) {
    this.warning(
      'Proceso Eliminado',
      `El proceso "${nombre}" ha sido eliminado del sistema`
    );
  }

  public procesoCriticoSinResponsable(codigo: string) {
    this.error(
      'Proceso Crítico Sin Responsable',
      `El proceso crítico ${codigo} no tiene responsable asignado`,
      {
        label: 'Asignar Responsable',
        onClick: () => {
          console.log('Navegar a asignar responsable');
        }
      }
    );
  }

  // Indicadores
  public indicadorCreated(nombre: string) {
    this.success(
      'Indicador Creado',
      `El indicador "${nombre}" ha sido creado exitosamente`
    );
  }

  public indicadorUpdated(nombre: string) {
    this.success(
      'Indicador Actualizado',
      `El indicador "${nombre}" ha sido actualizado`
    );
  }

  public indicadorDeleted(nombre: string) {
    this.warning(
      'Indicador Eliminado',
      `El indicador "${nombre}" ha sido eliminado del sistema`
    );
  }

  public indicadorSinMediciones(nombre: string, dias: number) {
    this.warning(
      'Indicador Sin Mediciones',
      `El indicador "${nombre}" no tiene mediciones en los últimos ${dias} días`,
      {
        label: 'Programar Medición',
        onClick: () => {
          console.log('Navegar a programar medición');
        }
      }
    );
  }

  // Objetivos
  public objetivoCreated(nombre: string) {
    this.success(
      'Objetivo Creado',
      `El objetivo "${nombre}" ha sido creado exitosamente`
    );
  }

  public objetivoUpdated(nombre: string) {
    this.success(
      'Objetivo Actualizado',
      `El objetivo "${nombre}" ha sido actualizado`
    );
  }

  public objetivoDeleted(nombre: string) {
    this.warning(
      'Objetivo Eliminado',
      `El objetivo "${nombre}" ha sido eliminado del sistema`
    );
  }

  public objetivoVencido(nombre: string, fechaLimite: string) {
    this.error(
      'Objetivo Vencido',
      `El objetivo "${nombre}" ha vencido el ${fechaLimite}`,
      {
        label: 'Ver Objetivo',
        onClick: () => {
          console.log('Navegar a detalles del objetivo');
        }
      }
    );
  }

  public objetivoPorVencer(nombre: string, dias: number) {
    this.warning(
      'Objetivo Por Vencer',
      `El objetivo "${nombre}" vence en ${dias} días`,
      {
        label: 'Ver Objetivo',
        onClick: () => {
          console.log('Navegar a detalles del objetivo');
        }
      }
    );
  }

  // Mediciones
  public medicionCreated(indicador: string, valor: number) {
    this.success(
      'Medición Registrada',
      `Medición del indicador "${indicador}": ${valor}`
    );
  }

  public medicionUpdated(indicador: string, valor: number) {
    this.success(
      'Medición Actualizada',
      `Medición del indicador "${indicador}" actualizada: ${valor}`
    );
  }

  public medicionDeleted(indicador: string) {
    this.warning(
      'Medición Eliminada',
      `La medición del indicador "${indicador}" ha sido eliminada`
    );
  }

  public medicionFueraDeRango(indicador: string, valor: number, meta: number) {
    this.error(
      'Medición Fuera de Rango',
      `El indicador "${indicador}" está fuera del rango esperado. Valor: ${valor}, Meta: ${meta}`,
      {
        label: 'Ver Detalles',
        onClick: () => {
          console.log('Navegar a detalles de la medición');
        }
      }
    );
  }

  // Sistema
  public sistemaError(mensaje: string) {
    this.error(
      'Error del Sistema',
      mensaje
    );
  }

  public sistemaMantenimiento(fecha: string) {
    this.info(
      'Mantenimiento Programado',
      `El sistema estará en mantenimiento el ${fecha}`,
      {
        label: 'Ver Detalles',
        onClick: () => {
          console.log('Ver detalles del mantenimiento');
        }
      }
    );
  }

  public backupCompletado() {
    this.success(
      'Backup Completado',
      'El respaldo de la base de datos se ha completado exitosamente'
    );
  }

  public backupError() {
    this.error(
      'Error en Backup',
      'Ha ocurrido un error durante el proceso de respaldo'
    );
  }

  // Reportes
  public reporteGenerado(tipo: string) {
    this.success(
      'Reporte Generado',
      `El reporte ${tipo} ha sido generado exitosamente`,
      {
        label: 'Descargar',
        onClick: () => {
          console.log('Descargar reporte');
        }
      }
    );
  }

  public reporteError(tipo: string) {
    this.error(
      'Error Generando Reporte',
      `No se pudo generar el reporte ${tipo}`
    );
  }

  // Validaciones
  public validacionError(campo: string) {
    this.error(
      'Error de Validación',
      `El campo "${campo}" no es válido`
    );
  }

  public datosIncompletos() {
    this.warning(
      'Datos Incompletos',
      'Por favor complete todos los campos obligatorios'
    );
  }

  // Permisos
  public sinPermisos(accion: string) {
    this.error(
      'Sin Permisos',
      `No tiene permisos para realizar la acción: ${accion}`
    );
  }

  // Sesión
  public sesionExpirada() {
    this.warning(
      'Sesión Expirada',
      'Su sesión ha expirado. Por favor inicie sesión nuevamente',
      {
        label: 'Iniciar Sesión',
        onClick: () => {
          console.log('Navegar a login');
        }
      }
    );
  }

  public sesionIniciada(usuario: string) {
    this.success(
      'Sesión Iniciada',
      `Bienvenido, ${usuario}`
    );
  }

  public sesionCerrada() {
    this.info(
      'Sesión Cerrada',
      'Ha cerrado sesión exitosamente'
    );
  }
}

export default NotificationService.getInstance();
