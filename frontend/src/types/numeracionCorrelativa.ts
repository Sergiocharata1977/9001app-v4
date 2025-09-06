// Tipos para el sistema de numeración correlativa ISO 9001

export type TipoEntidad = 'reunion' | 'auditoria' | 'hallazgo' | 'accion';
export type TipoFlujo = 'reunion_direccion' | 'auditoria_interna' | 'accion_correctiva';

export interface IConfiguracionNumeracion {
  tipo_entidad: TipoEntidad;
  prefijo: string;
  formato?: string;
  reiniciar_anual?: boolean;
  reiniciar_mensual?: boolean;
  configuracion_avanzada?: IConfiguracionAvanzada;
}

export interface IConfiguracionAvanzada {
  longitud_numero?: number;
  incluir_ceros?: boolean;
  separador?: string;
  sufijo?: string;
}

export interface ICodigoGenerado {
  codigo: string;
  numero: number;
  configuracion: INumeracionCorrelativa;
  proximo_codigo: string;
}

export interface INumeracionCorrelativa {
  _id: string;
  organization_id: string;
  tipo_entidad: TipoEntidad;
  prefijo: string;
  ultimo_numero: number;
  año?: number;
  mes?: number;
  formato: string;
  reiniciar_anual: boolean;
  reiniciar_mensual: boolean;
  configuracion_avanzada: IConfiguracionAvanzada;
  metadata: IMetadataNumeracion;
  estadisticas: IEstadisticasNumeracion;
  created_at: string;
  updated_at: string;
}

export interface IMetadataNumeracion {
  creado_por: string;
  fecha_creacion: string;
  modificado_por?: string;
  fecha_modificacion?: string;
  activo: boolean;
}

export interface IEstadisticasNumeracion {
  total_generado: number;
  ultima_generacion?: string;
  errores_consecutivos: number;
  ultimo_error?: string;
}

export interface IEstadisticasGenerales {
  total_configuraciones: number;
  total_codigos_generados: number;
  configuraciones_por_tipo: Record<string, number>;
  ultima_actividad: string;
  errores_recientes: IErrorReciente[];
}

export interface IErrorReciente {
  tipo_entidad: string;
  prefijo: string;
  error: string;
  fecha: string;
}

export interface IInformacionCodigo {
  prefijo: string;
  año: number;
  numero: number;
  valido: boolean;
}

export interface IResultadoReinicio {
  configuraciones_afectadas: number;
  contadores_reiniciados: number;
}

// Tipos para las respuestas de la API
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IApiResponseList<T = any> extends IApiResponse<T[]> {
  total?: number;
  page?: number;
  limit?: number;
}

// Tipos para los formularios
export interface IFormularioGeneracion {
  tipo_entidad: TipoEntidad;
  prefijo: string;
  formato?: string;
  reiniciar_anual: boolean;
  reiniciar_mensual: boolean;
  configuracion_avanzada: IConfiguracionAvanzada;
}

export interface IFormularioSubCodigo {
  codigo_padre: string;
  tipo_sub_entidad: 'hallazgo' | 'accion';
  prefijo: string;
}

export interface IFormularioFlujoCompleto {
  tipo_flujo: TipoFlujo;
}

// Tipos para la configuración por defecto
export interface IConfiguracionPorDefecto {
  reunion: IConfiguracionNumeracion;
  auditoria: IConfiguracionNumeracion;
  hallazgo: IConfiguracionNumeracion;
  accion: IConfiguracionNumeracion;
}

// Constantes para los tipos de entidad
export const TIPOS_ENTIDAD: Record<TipoEntidad, string> = {
  reunion: 'Reunión de Dirección',
  auditoria: 'Auditoría',
  hallazgo: 'Hallazgo',
  accion: 'Acción'
};

// Constantes para los prefijos por defecto
export const PREFIJOS_POR_DEFECTO: Record<TipoEntidad, string> = {
  reunion: 'REV',
  auditoria: 'AUD',
  hallazgo: 'HAL',
  accion: 'ACC'
};

// Constantes para los formatos por defecto
export const FORMATOS_POR_DEFECTO: Record<TipoEntidad, string> = {
  reunion: 'REV-{año}-{numero}',
  auditoria: 'AUD-{año}-{numero}',
  hallazgo: 'HAL-{año}-{numero}',
  accion: 'ACC-{año}-{numero}'
};

// Configuración por defecto
export const CONFIGURACION_POR_DEFECTO: IConfiguracionPorDefecto = {
  reunion: {
    tipo_entidad: 'reunion',
    prefijo: 'REV',
    formato: 'REV-{año}-{numero}',
    reiniciar_anual: true,
    reiniciar_mensual: false,
    configuracion_avanzada: {
      longitud_numero: 5,
      incluir_ceros: true,
      separador: '-'
    }
  },
  auditoria: {
    tipo_entidad: 'auditoria',
    prefijo: 'AUD',
    formato: 'AUD-{año}-{numero}',
    reiniciar_anual: true,
    reiniciar_mensual: false,
    configuracion_avanzada: {
      longitud_numero: 5,
      incluir_ceros: true,
      separador: '-'
    }
  },
  hallazgo: {
    tipo_entidad: 'hallazgo',
    prefijo: 'HAL',
    formato: 'HAL-{año}-{numero}',
    reiniciar_anual: true,
    reiniciar_mensual: false,
    configuracion_avanzada: {
      longitud_numero: 5,
      incluir_ceros: true,
      separador: '-'
    }
  },
  accion: {
    tipo_entidad: 'accion',
    prefijo: 'ACC',
    formato: 'ACC-{año}-{numero}',
    reiniciar_anual: true,
    reiniciar_mensual: false,
    configuracion_avanzada: {
      longitud_numero: 5,
      incluir_ceros: true,
      separador: '-'
    }
  }
};

// Utilidades para validación
export const validarPrefijo = (prefijo: string): boolean => {
  return /^[A-Z]{2,4}$/.test(prefijo);
};

export const validarFormato = (formato: string): boolean => {
  return formato.includes('{prefijo}') && formato.includes('{numero}');
};

export const validarConfiguracion = (configuracion: IConfiguracionNumeracion): string[] => {
  const errores: string[] = [];

  if (!configuracion.prefijo) {
    errores.push('El prefijo es obligatorio');
  } else if (!validarPrefijo(configuracion.prefijo)) {
    errores.push('El prefijo debe tener entre 2 y 4 caracteres en mayúsculas');
  }

  if (configuracion.formato && !validarFormato(configuracion.formato)) {
    errores.push('El formato debe incluir las variables {prefijo} y {numero}');
  }

  if (configuracion.configuracion_avanzada?.longitud_numero) {
    if (configuracion.configuracion_avanzada.longitud_numero < 1 || configuracion.configuracion_avanzada.longitud_numero > 10) {
      errores.push('La longitud del número debe estar entre 1 y 10');
    }
  }

  return errores;
};
