import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface para el documento de numeración correlativa
export interface INumeracionCorrelativa extends Document {
  organization_id: Types.ObjectId;
  tipo_entidad: 'reunion' | 'auditoria' | 'hallazgo' | 'accion';
  prefijo: string;
  ultimo_numero: number;
  año?: number;
  mes?: number;
  formato: string;
  reiniciar_anual: boolean;
  reiniciar_mensual: boolean;
  configuracion_avanzada: {
    longitud_numero: number;
    incluir_ceros: boolean;
    separador: string;
    sufijo?: string;
  };
  metadata: {
    creado_por: Types.ObjectId;
    fecha_creacion: Date;
    modificado_por?: Types.ObjectId;
    fecha_modificacion?: Date;
    activo: boolean;
  };
  estadisticas: {
    total_generado: number;
    ultima_generacion: Date;
    errores_consecutivos: number;
    ultimo_error?: string;
  };
}

// Schema de MongoDB
const NumeracionCorrelativaSchema = new Schema<INumeracionCorrelativa>({
  // Identificación y organización
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  
  // Tipo de entidad para la numeración
  tipo_entidad: {
    type: String,
    enum: ['reunion', 'auditoria', 'hallazgo', 'accion'],
    required: true,
    index: true
  },
  
  // Prefijo del código (REV, AUD, HAL, ACC)
  prefijo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  
  // Número secuencial actual
  ultimo_numero: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Año para reinicio anual
  año: {
    type: Number,
    index: true
  },
  
  // Mes para reinicio mensual
  mes: {
    type: Number,
    index: true
  },
  
  // Formato del código (ej: {prefijo}-{año}-{numero})
  formato: {
    type: String,
    required: true,
    default: '{prefijo}-{año}-{numero}'
  },
  
  // Configuración de reinicio
  reiniciar_anual: {
    type: Boolean,
    default: true
  },
  
  reiniciar_mensual: {
    type: Boolean,
    default: false
  },
  
  // Configuración avanzada
  configuracion_avanzada: {
    longitud_numero: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    incluir_ceros: {
      type: Boolean,
      default: true
    },
    separador: {
      type: String,
      default: '-'
    },
    sufijo: {
      type: String,
      maxlength: 20
    }
  },
  
  // Metadata del documento
  metadata: {
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fecha_creacion: {
      type: Date,
      default: Date.now
    },
    modificado_por: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    fecha_modificacion: {
      type: Date
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  
  // Estadísticas de uso
  estadisticas: {
    total_generado: {
      type: Number,
      default: 0
    },
    ultima_generacion: {
      type: Date
    },
    errores_consecutivos: {
      type: Number,
      default: 0
    },
    ultimo_error: {
      type: String
    }
  }
}, {
  timestamps: true,
  collection: 'numeracion_correlativa'
});

// Índices compuestos para optimización
NumeracionCorrelativaSchema.index({
  organization_id: 1,
  tipo_entidad: 1,
  año: 1,
  mes: 1
});

NumeracionCorrelativaSchema.index({
  organization_id: 1,
  tipo_entidad: 1,
  prefijo: 1
});

// Índice único para evitar duplicados
NumeracionCorrelativaSchema.index({
  organization_id: 1,
  tipo_entidad: 1,
  año: 1,
  mes: 1,
  prefijo: 1
}, { unique: true });

// Métodos del modelo
NumeracionCorrelativaSchema.methods = {
  // Generar el siguiente código
  generarSiguienteCodigo(): string {
    const ahora = new Date();
    let codigo = this.formato;
    
    // Reemplazar variables en el formato
    codigo = codigo.replace('{prefijo}', this.prefijo);
    
    if (this.reiniciar_anual) {
      codigo = codigo.replace('{año}', ahora.getFullYear().toString());
    }
    
    if (this.reiniciar_mensual) {
      codigo = codigo.replace('{mes}', (ahora.getMonth() + 1).toString().padStart(2, '0'));
    }
    
    // Generar número con ceros a la izquierda si está configurado
    let numero = (this.ultimo_numero + 1).toString();
    if (this.configuracion_avanzada.incluir_ceros) {
      numero = numero.padStart(this.configuracion_avanzada.longitud_numero, '0');
    }
    
    codigo = codigo.replace('{numero}', numero);
    
    if (this.configuracion_avanzada.sufijo) {
      codigo += this.configuracion_avanzada.separador + this.configuracion_avanzada.sufijo;
    }
    
    return codigo.toUpperCase();
  },
  
  // Incrementar contador
  async incrementarContador(): Promise<void> {
    this.ultimo_numero += 1;
    this.estadisticas.total_generado += 1;
    this.estadisticas.ultima_generacion = new Date();
    this.estadisticas.errores_consecutivos = 0;
    this.estadisticas.ultimo_error = undefined;
    
    await this.save();
  },
  
  // Registrar error
  async registrarError(error: string): Promise<void> {
    this.estadisticas.errores_consecutivos += 1;
    this.estadisticas.ultimo_error = error;
    await this.save();
  }
};

// Métodos estáticos del modelo
NumeracionCorrelativaSchema.statics = {
  // Crear o encontrar configuración de numeración
  async crearOEncontrar(
    organizationId: string,
    tipoEntidad: string,
    prefijo: string,
    año?: number,
    mes?: number
  ): Promise<INumeracionCorrelativa> {
    const filtro: any = {
      organization_id: organizationId,
      tipo_entidad: tipoEntidad,
      prefijo: prefijo.toUpperCase()
    };
    
    if (año) filtro.año = año;
    if (mes) filtro.mes = mes;
    
    let numeracion = await this.findOne(filtro);
    
    if (!numeracion) {
      // Crear nueva configuración
      numeracion = new this({
        organization_id: organizationId,
        tipo_entidad: tipoEntidad,
        prefijo: prefijo.toUpperCase(),
        año,
        mes,
        ultimo_numero: 0,
        formato: '{prefijo}-{año}-{numero}',
        reiniciar_anual: true,
        reiniciar_mensual: false,
        configuracion_avanzada: {
          longitud_numero: 5,
          incluir_ceros: true,
          separador: '-'
        },
        metadata: {
          creado_por: organizationId, // Temporal, se debe pasar el usuario real
          fecha_creacion: new Date(),
          activo: true
        },
        estadisticas: {
          total_generado: 0,
          errores_consecutivos: 0
        }
      });
      
      await numeracion.save();
    }
    
    return numeracion;
  },
  
  // Obtener siguiente número disponible
  async obtenerSiguienteNumero(
    organizationId: string,
    tipoEntidad: string,
    prefijo: string,
    año?: number,
    mes?: number
  ): Promise<number> {
    const numeracion = await this.crearOEncontrar(
      organizationId,
      tipoEntidad,
      prefijo,
      año,
      mes
    );
    
    return numeracion.ultimo_numero + 1;
  }
};

// Middleware pre-save para validaciones
NumeracionCorrelativaSchema.pre('save', function(next) {
  // Actualizar fecha de modificación
  if (this.isModified()) {
    this.metadata.fecha_modificacion = new Date();
  }
  
  // Validar que el formato contenga las variables necesarias
  if (!this.formato.includes('{numero}')) {
    return next(new Error('El formato debe incluir la variable {numero}'));
  }
  
  // Validar que el prefijo no esté vacío
  if (!this.prefijo || this.prefijo.trim().length === 0) {
    return next(new Error('El prefijo no puede estar vacío'));
  }
  
  next();
});

// Exportar el modelo
const NumeracionCorrelativa = mongoose.model<INumeracionCorrelativa>('NumeracionCorrelativa', NumeracionCorrelativaSchema);

export default NumeracionCorrelativa;
