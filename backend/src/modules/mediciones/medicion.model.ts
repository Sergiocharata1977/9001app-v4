import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicion extends Document {
  id: string;
  codigo: string;
  indicadorId: string;
  organizacionId: string;
  responsable: string; // ID del responsable de la medición
  fecha: Date;
  periodo: {
    inicio: Date;
    fin: Date;
    tipo: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  };
  valor: number;
  unidad: string;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'rechazada' | 'aprobada';
  observaciones?: string;
  evidencia: {
    documentos: string[];
    imagenes: string[];
    enlaces: string[];
  };
  analisis: {
    tendencia: 'ascendente' | 'descendente' | 'estable' | 'variable';
    comparacionAnterior: {
      valor: number;
      diferencia: number;
      porcentajeCambio: number;
    };
    comparacionMeta: {
      cumple: boolean;
      diferencia: number;
      porcentajeCumplimiento: number;
    };
    evaluacion: 'excelente' | 'bueno' | 'regular' | 'deficiente' | 'critico';
  };
  acciones: {
    correctivas: string[];
    preventivas: string[];
    mejoras: string[];
  };
  revision: {
    revisadoPor: string;
    fechaRevision: Date;
    comentarios: string;
    aprobado: boolean;
  };
  alertas: {
    generadas: boolean;
    tipo: 'critica' | 'advertencia' | 'info';
    mensaje: string;
    enviada: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicionSchema = new Schema<IMedicion>({
  codigo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 30
  },
  indicadorId: {
    type: String,
    required: true,
    ref: 'Indicador',
    index: true
  },
  organizacionId: {
    type: String,
    required: true,
    index: true
  },
  responsable: {
    type: String,
    required: true,
    ref: 'Personnel'
  },
  fecha: {
    type: Date,
    required: true,
    index: true
  },
  periodo: {
    inicio: {
      type: Date,
      required: true
    },
    fin: {
      type: Date,
      required: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['diario', 'semanal', 'mensual', 'trimestral', 'semestral', 'anual']
    }
  },
  valor: {
    type: Number,
    required: true
  },
  unidad: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'en_progreso', 'completada', 'rechazada', 'aprobada'],
    default: 'pendiente'
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  evidencia: {
    documentos: [{
      type: String,
      trim: true
    }],
    imagenes: [{
      type: String,
      trim: true
    }],
    enlaces: [{
      type: String,
      trim: true
    }]
  },
  analisis: {
    tendencia: {
      type: String,
      enum: ['ascendente', 'descendente', 'estable', 'variable'],
      default: 'estable'
    },
    comparacionAnterior: {
      valor: {
        type: Number,
        default: 0
      },
      diferencia: {
        type: Number,
        default: 0
      },
      porcentajeCambio: {
        type: Number,
        default: 0
      }
    },
    comparacionMeta: {
      cumple: {
        type: Boolean,
        default: false
      },
      diferencia: {
        type: Number,
        default: 0
      },
      porcentajeCumplimiento: {
        type: Number,
        default: 0
      }
    },
    evaluacion: {
      type: String,
      enum: ['excelente', 'bueno', 'regular', 'deficiente', 'critico'],
      default: 'regular'
    }
  },
  acciones: {
    correctivas: [{
      type: String,
      trim: true
    }],
    preventivas: [{
      type: String,
      trim: true
    }],
    mejoras: [{
      type: String,
      trim: true
    }]
  },
  revision: {
    revisadoPor: {
      type: String,
      ref: 'Personnel'
    },
    fechaRevision: {
      type: Date
    },
    comentarios: {
      type: String,
      trim: true,
      maxlength: 500
    },
    aprobado: {
      type: Boolean,
      default: false
    }
  },
  alertas: {
    generadas: {
      type: Boolean,
      default: false
    },
    tipo: {
      type: String,
      enum: ['critica', 'advertencia', 'info'],
      default: 'info'
    },
    mensaje: {
      type: String,
      trim: true,
      maxlength: 200
    },
    enviada: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para multi-tenancy y búsquedas
MedicionSchema.index({ organizacionId: 1, codigo: 1 }, { unique: true });
MedicionSchema.index({ organizacionId: 1, indicadorId: 1, fecha: 1 });
MedicionSchema.index({ organizacionId: 1, fecha: 1 });
MedicionSchema.index({ organizacionId: 1, estado: 1 });
MedicionSchema.index({ organizacionId: 1, responsable: 1 });
MedicionSchema.index({ organizacionId: 1, isActive: 1 });
MedicionSchema.index({ 'periodo.inicio': 1, 'periodo.fin': 1 });
MedicionSchema.index({ 'analisis.evaluacion': 1 });

// Virtual para obtener el indicador
MedicionSchema.virtual('indicador', {
  ref: 'Indicador',
  localField: 'indicadorId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el responsable
MedicionSchema.virtual('responsableInfo', {
  ref: 'Personnel',
  localField: 'responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el revisor
MedicionSchema.virtual('revisorInfo', {
  ref: 'Personnel',
  localField: 'revision.revisadoPor',
  foreignField: 'id',
  justOne: true
});

// Método para calcular el análisis automático
MedicionSchema.methods.calcularAnalisis = function(indicador: any, medicionAnterior?: any) {
  // Comparación con medición anterior
  if (medicionAnterior) {
    const diferencia = this.valor - medicionAnterior.valor;
    const porcentajeCambio = medicionAnterior.valor !== 0 
      ? (diferencia / medicionAnterior.valor) * 100 
      : 0;
    
    this.analisis.comparacionAnterior = {
      valor: medicionAnterior.valor,
      diferencia,
      porcentajeCambio
    };

    // Determinar tendencia
    if (Math.abs(porcentajeCambio) < 5) {
      this.analisis.tendencia = 'estable';
    } else if (porcentajeCambio > 0) {
      this.analisis.tendencia = 'ascendente';
    } else {
      this.analisis.tendencia = 'descendente';
    }
  }

  // Comparación con meta del indicador
  if (indicador && indicador.meta) {
    const cumple = indicador.cumpleMeta(this.valor);
    const diferencia = this.valor - indicador.meta.valor;
    const porcentajeCumplimiento = indicador.meta.valor !== 0 
      ? (this.valor / indicador.meta.valor) * 100 
      : 0;
    
    this.analisis.comparacionMeta = {
      cumple,
      diferencia,
      porcentajeCumplimiento
    };
  }

  // Evaluación basada en umbrales del indicador
  if (indicador && indicador.umbrales) {
    const estado = indicador.evaluarEstado(this.valor);
    switch (estado) {
      case 'satisfactorio':
        this.analisis.evaluacion = 'excelente';
        break;
      case 'regular':
        this.analisis.evaluacion = 'bueno';
        break;
      case 'advertencia':
        this.analisis.evaluacion = 'deficiente';
        break;
      case 'critico':
        this.analisis.evaluacion = 'critico';
        break;
      default:
        this.analisis.evaluacion = 'regular';
    }
  }
};

// Método para generar alertas automáticas
MedicionSchema.methods.generarAlertas = function(indicador: any) {
  if (!indicador || !indicador.alertas?.habilitadas) return;

  const estado = indicador.evaluarEstado(this.valor);
  
  if (estado === 'critico' && indicador.alertas.umbrales.critico) {
    this.alertas = {
      generadas: true,
      tipo: 'critica',
      mensaje: `Valor crítico detectado: ${this.valor} ${this.unidad}. Se requiere atención inmediata.`,
      enviada: false
    };
  } else if (estado === 'advertencia' && indicador.alertas.umbrales.advertencia) {
    this.alertas = {
      generadas: true,
      tipo: 'advertencia',
      mensaje: `Valor en zona de advertencia: ${this.valor} ${this.unidad}. Monitorear de cerca.`,
      enviada: false
    };
  }
};

// Método para verificar si está vencida
MedicionSchema.methods.estaVencida = function() {
  const hoy = new Date();
  return this.periodo.fin < hoy && this.estado === 'pendiente';
};

// Método para verificar si necesita revisión
MedicionSchema.methods.necesitaRevision = function() {
  return this.estado === 'completada' && !this.revision.aprobado;
};

// Método para aprobar medición
MedicionSchema.methods.aprobar = function(revisadoPor: string, comentarios?: string) {
  this.estado = 'aprobada';
  this.revision = {
    revisadoPor,
    fechaRevision: new Date(),
    comentarios: comentarios || '',
    aprobado: true
  };
};

// Método para rechazar medición
MedicionSchema.methods.rechazar = function(revisadoPor: string, comentarios: string) {
  this.estado = 'rechazada';
  this.revision = {
    revisadoPor,
    fechaRevision: new Date(),
    comentarios,
    aprobado: false
  };
};

const Medicion = mongoose.model<IMedicion>('Medicion', MedicionSchema);
export default Medicion;