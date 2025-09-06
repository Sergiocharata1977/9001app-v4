// Servicio para la API de numeración correlativa ISO 9001

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
  configuracion: any;
  proximo_codigo: string;
}

export interface IEstadisticasNumeracion {
  total_configuraciones: number;
  total_codigos_generados: number;
  configuraciones_por_tipo: Record<string, number>;
  ultima_actividad: string;
  errores_recientes: Array<{
    tipo_entidad: string;
    prefijo: string;
    error: string;
    fecha: string;
  }>;
}

class NumeracionCorrelativaService {
  private baseUrl = '/api/numeracion-correlativa';

  /**
   * Obtiene el token de autenticación
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Genera un código correlativo ISO 9001
   */
  async generarCodigo(configuracion: IConfiguracionNumeracion): Promise<ICodigoGenerado> {
    try {
      const response = await fetch(`${this.baseUrl}/generar`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(configuracion)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar código');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al generar código');
      }

      return data.data;
    } catch (error) {
      console.error('Error generando código correlativo:', error);
      throw error;
    }
  }

  /**
   * Genera un código de sub-numeración
   */
  async generarSubCodigo(
    codigoPadre: string,
    tipoSubEntidad: 'hallazgo' | 'accion',
    prefijo: string
  ): Promise<{ codigo: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sub-codigo`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          codigo_padre: codigoPadre,
          tipo_sub_entidad: tipoSubEntidad,
          prefijo: prefijo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar sub-código');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al generar sub-código');
      }

      return data.data;
    } catch (error) {
      console.error('Error generando sub-código:', error);
      throw error;
    }
  }

  /**
   * Genera un código completo de flujo ISO 9001
   */
  async generarCodigoFlujoCompleto(
    tipoFlujo: 'reunion_direccion' | 'auditoria_interna' | 'accion_correctiva'
  ): Promise<{
    codigo_reunion?: string;
    codigo_hallazgo?: string;
    codigo_accion?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/flujo-completo`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tipo_flujo: tipoFlujo })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar código de flujo');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al generar código de flujo');
      }

      return data.data;
    } catch (error) {
      console.error('Error generando código de flujo:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración de numeración
   */
  async obtenerConfiguracion(tipoEntidad?: string): Promise<any[]> {
    try {
      const url = tipoEntidad 
        ? `${this.baseUrl}/configuracion?tipo_entidad=${tipoEntidad}`
        : `${this.baseUrl}/configuracion`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener configuración');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener configuración');
      }

      return data.data;
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      throw error;
    }
  }

  /**
   * Genera un código de ejemplo
   */
  async generarCodigoEjemplo(tipo: string): Promise<{
    codigo_ejemplo: string;
    proximo_codigo: string;
    configuracion: IConfiguracionNumeracion;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ejemplo/${tipo}`, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al generar código de ejemplo');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al generar código de ejemplo');
      }

      return data.data;
    } catch (error) {
      console.error('Error generando código de ejemplo:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de numeración
   */
  async obtenerEstadisticas(): Promise<IEstadisticasNumeracion> {
    try {
      const response = await fetch(`${this.baseUrl}/estadisticas`, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estadísticas');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al obtener estadísticas');
      }

      return data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Reinicia los contadores anuales
   */
  async reiniciarContadoresAnuales(): Promise<{
    configuraciones_afectadas: number;
    contadores_reiniciados: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/reiniciar-anual`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reiniciar contadores anuales');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al reiniciar contadores anuales');
      }

      return data.data;
    } catch (error) {
      console.error('Error reiniciando contadores anuales:', error);
      throw error;
    }
  }

  /**
   * Reinicia los contadores mensuales
   */
  async reiniciarContadoresMensuales(): Promise<{
    configuraciones_afectadas: number;
    contadores_reiniciados: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/reiniciar-mensual`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reiniciar contadores mensuales');
      }

      if (!data.success) {
        throw new Error(data.message || 'Error al reiniciar contadores mensuales');
      }

      return data.data;
    } catch (error) {
      console.error('Error reiniciando contadores mensuales:', error);
      throw error;
    }
  }

  /**
   * Valida si un código tiene el formato correcto
   */
  validarFormatoCodigo(codigo: string): boolean {
    // Patrón para códigos ISO 9001: PREFIJO-AÑO-NÚMERO
    const patron = /^[A-Z]{2,4}-\d{4}-\d{1,10}$/;
    return patron.test(codigo);
  }

  /**
   * Extrae información de un código
   */
  extraerInformacionCodigo(codigo: string): {
    prefijo: string;
    año: number;
    numero: number;
    valido: boolean;
  } | null {
    if (!this.validarFormatoCodigo(codigo)) {
      return null;
    }

    const partes = codigo.split('-');
    if (partes.length !== 3) {
      return null;
    }

    const [prefijo, año, numero] = partes;

    return {
      prefijo,
      año: parseInt(año),
      numero: parseInt(numero),
      valido: true
    };
  }

  /**
   * Genera un código de ejemplo basado en la configuración
   */
  generarCodigoEjemploLocal(configuracion: IConfiguracionNumeracion): string {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const numero = 1;

    let codigo = configuracion.formato || '{prefijo}-{año}-{numero}';
    
    codigo = codigo.replace('{prefijo}', configuracion.prefijo);
    codigo = codigo.replace('{año}', año.toString());
    codigo = codigo.replace('{mes}', (ahora.getMonth() + 1).toString().padStart(2, '0'));
    
    const longitudNumero = configuracion.configuracion_avanzada?.longitud_numero || 5;
    const numeroFormateado = numero.toString().padStart(longitudNumero, '0');
    codigo = codigo.replace('{numero}', numeroFormateado);

    if (configuracion.configuracion_avanzada?.sufijo) {
      const separador = configuracion.configuracion_avanzada.separador || '-';
      codigo += separador + configuracion.configuracion_avanzada.sufijo;
    }

    return codigo.toUpperCase();
  }
}

// Exportar instancia singleton
export default new NumeracionCorrelativaService();
