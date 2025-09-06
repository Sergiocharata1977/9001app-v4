import mongoose from 'mongoose';
import NumeracionCorrelativa, { INumeracionCorrelativa } from '../models/NumeracionCorrelativa';

// Tipos para el servicio
export interface IConfiguracionNumeracion {
  tipo_entidad: 'reunion' | 'auditoria' | 'hallazgo' | 'accion';
  prefijo: string;
  formato?: string;
  reiniciar_anual?: boolean;
  reiniciar_mensual?: boolean;
  configuracion_avanzada?: {
    longitud_numero?: number;
    incluir_ceros?: boolean;
    separador?: string;
    sufijo?: string;
  };
}

export interface ICodigoGenerado {
  codigo: string;
  numero: number;
  configuracion: INumeracionCorrelativa;
  proximo_codigo: string;
}

export class NumeracionCorrelativaService {
  
  /**
   * Genera un código correlativo ISO 9001
   */
  async generarCodigo(
    organizationId: string,
    configuracion: IConfiguracionNumeracion,
    usuarioId?: string
  ): Promise<ICodigoGenerado> {
    try {
      const ahora = new Date();
      const año = configuracion.reiniciar_anual ? ahora.getFullYear() : undefined;
      const mes = configuracion.reiniciar_mensual ? ahora.getMonth() + 1 : undefined;
      
      // Obtener o crear configuración de numeración
      let numeracion = await NumeracionCorrelativa.crearOEncontrar(
        organizationId,
        configuracion.tipo_entidad,
        configuracion.prefijo,
        año,
        mes
      );
      
      // Aplicar configuración personalizada si se proporciona
      if (configuracion.formato) {
        numeracion.formato = configuracion.formato;
      }
      
      if (configuracion.reiniciar_anual !== undefined) {
        numeracion.reiniciar_anual = configuracion.reiniciar_anual;
      }
      
      if (configuracion.reiniciar_mensual !== undefined) {
        numeracion.reiniciar_mensual = configuracion.reiniciar_mensual;
      }
      
      if (configuracion.configuracion_avanzada) {
        numeracion.configuracion_avanzada = {
          ...numeracion.configuracion_avanzada,
          ...configuracion.configuracion_avanzada
        };
      }
      
      // Actualizar metadata si hay usuario
      if (usuarioId) {
        numeracion.metadata.modificado_por = new mongoose.Types.ObjectId(usuarioId);
      }
      
      // Generar el código actual
      const codigoActual = numeracion.generarSiguienteCodigo();
      const numeroActual = numeracion.ultimo_numero + 1;
      
      // Generar el próximo código para mostrar
      const proximoCodigo = this.generarProximoCodigo(numeracion);
      
      // Incrementar contador
      await numeracion.incrementarContador();
      
      return {
        codigo: codigoActual,
        numero: numeroActual,
        configuracion: numeracion,
        proximo_codigo: proximoCodigo
      };
      
    } catch (error) {
      console.error('Error generando código correlativo:', error);
      
      // Registrar error en la configuración si existe
      if (error instanceof Error) {
        await this.registrarError(
          organizationId,
          configuracion.tipo_entidad,
          configuracion.prefijo,
          error.message
        );
      }
      
      throw new Error(`Error generando código correlativo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  /**
   * Genera un código de sub-numeración (ej: H0001, A001)
   */
  async generarSubCodigo(
    organizationId: string,
    codigoPadre: string,
    tipoSubEntidad: 'hallazgo' | 'accion',
    prefijo: string
  ): Promise<string> {
    try {
      const configuracion: IConfiguracionNumeracion = {
        tipo_entidad: tipoSubEntidad,
        prefijo: prefijo,
        formato: `${codigoPadre}.{prefijo}{numero}`,
        reiniciar_anual: false,
        reiniciar_mensual: false,
        configuracion_avanzada: {
          longitud_numero: 4,
          incluir_ceros: true,
          separador: ''
        }
      };
      
      const resultado = await this.generarCodigo(organizationId, configuracion);
      return resultado.codigo;
      
    } catch (error) {
      console.error('Error generando sub-código:', error);
      throw new Error(`Error generando sub-código: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  /**
   * Genera un código completo de flujo ISO 9001
   */
  async generarCodigoFlujoCompleto(
    organizationId: string,
    tipoFlujo: 'reunion_direccion' | 'auditoria_interna' | 'accion_correctiva'
  ): Promise<{
    codigo_reunion?: string;
    codigo_hallazgo?: string;
    codigo_accion?: string;
  }> {
    try {
      const resultado: any = {};
      
      switch (tipoFlujo) {
        case 'reunion_direccion':
          // Generar código de reunión
          const configReunion: IConfiguracionNumeracion = {
            tipo_entidad: 'reunion',
            prefijo: 'REV',
            formato: 'REV-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          
          const reunion = await this.generarCodigo(organizationId, configReunion);
          resultado.codigo_reunion = reunion.codigo;
          break;
          
        case 'auditoria_interna':
          // Generar código de auditoría
          const configAuditoria: IConfiguracionNumeracion = {
            tipo_entidad: 'auditoria',
            prefijo: 'AUD',
            formato: 'AUD-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          
          const auditoria = await this.generarCodigo(organizationId, configAuditoria);
          resultado.codigo_reunion = auditoria.codigo;
          break;
          
        case 'accion_correctiva':
          // Generar código de acción
          const configAccion: IConfiguracionNumeracion = {
            tipo_entidad: 'accion',
            prefijo: 'ACC',
            formato: 'ACC-{año}-{numero}',
            reiniciar_anual: true,
            reiniciar_mensual: false
          };
          
          const accion = await this.generarCodigo(organizationId, configAccion);
          resultado.codigo_accion = accion.codigo;
          break;
      }
      
      return resultado;
      
    } catch (error) {
      console.error('Error generando código de flujo completo:', error);
      throw new Error(`Error generando código de flujo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  /**
   * Obtiene la configuración de numeración para una organización
   */
  async obtenerConfiguracion(
    organizationId: string,
    tipoEntidad?: string
  ): Promise<INumeracionCorrelativa[]> {
    try {
      const filtro: any = { organization_id: organizationId };
      
      if (tipoEntidad) {
        filtro.tipo_entidad = tipoEntidad;
      }
      
      const configuraciones = await NumeracionCorrelativa.find(filtro)
        .sort({ tipo_entidad: 1, prefijo: 1, año: 1, mes: 1 });
      
      return configuraciones;
      
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      throw new Error(`Error obteniendo configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  /**
   * Genera el próximo código para mostrar
   */
  private generarProximoCodigo(numeracion: INumeracionCorrelativa): string {
    const proximoNumero = numeracion.ultimo_numero + 2; // +2 porque ya incrementamos el contador
    const ahora = new Date();
    
    let codigo = numeracion.formato;
    codigo = codigo.replace('{prefijo}', numeracion.prefijo);
    
    if (numeracion.reiniciar_anual) {
      codigo = codigo.replace('{año}', ahora.getFullYear().toString());
    }
    
    if (numeracion.reiniciar_mensual) {
      codigo = codigo.replace('{mes}', (ahora.getMonth() + 1).toString().padStart(2, '0'));
    }
    
    let numero = proximoNumero.toString();
    if (numeracion.configuracion_avanzada.incluir_ceros) {
      numero = numero.padStart(numeracion.configuracion_avanzada.longitud_numero, '0');
    }
    
    codigo = codigo.replace('{numero}', numero);
    
    if (numeracion.configuracion_avanzada.sufijo) {
      codigo += numeracion.configuracion_avanzada.separador + numeracion.configuracion_avanzada.sufijo;
    }
    
    return codigo.toUpperCase();
  }
  
  /**
   * Registra un error en la configuración de numeración
   */
  private async registrarError(
    organizationId: string,
    tipoEntidad: string,
    prefijo: string,
    error: string
  ): Promise<void> {
    try {
      const numeracion = await NumeracionCorrelativa.findOne({
        organization_id: organizationId,
        tipo_entidad: tipoEntidad,
        prefijo: prefijo
      });
      
      if (numeracion) {
        await numeracion.registrarError(error);
      }
    } catch (error) {
      console.error('Error registrando error en numeración:', error);
    }
  }
}

// Exportar instancia singleton
export default new NumeracionCorrelativaService();
