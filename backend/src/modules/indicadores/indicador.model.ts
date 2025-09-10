import mongoose, { Document, Schema } from 'mongoose';

export interface IIndicador extends Document {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: 'efectividad' | 'eficiencia' | 'satisfaccion' | 'conformidad' | 'mejora';
  categoria: 'calidad' | 'ambiental' | 'seguridad' | 'financiero' | 'operacional';
  organizacionId: string;
  departamentoId?: string;
  procesoId?: string;
  objetivoId?: string;
  responsable: string; // ID del responsable
  unidad: string;
  formula: string;
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  meta: {
    valor: number;
    tipo: 'mayor_que' | 'menor_que' | 'igual_a' | 'entre';
    valorMinimo?: number;
    valorMaximo?: number;
  };
  umbrales: {
    critico: number;
    advertencia: number;
    satisfactorio: number;
  };
  fuenteDatos: string;
  metodoCalculo: string;
  periodicidad: {
    inicio: Date;
    fin?: Date;
    activo: boolean;
  };
  mediciones: string[]; // IDs de mediciones asociadas
  tendencia: {
    direccion: 'ascendente' | 'descendente' | 'estable';
    periodo: number; // días
    valor: number; // porcentaje de cambio
  };
  estado: 'activo' | 'inactivo' | 'suspendido';
  alertas: {
    habilitadas: boolean;
    email: string[];
    umbrales: {
      critico: boolean;
      advertencia: boolean;
    };
  };
  documentos: {
    procedimiento?: string;
    instructivo?: string;
    formato?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IndicadorSchema = new Schema<IIndicador>({
  codigo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  tipo: {
    type: String,
    required: true,
    enum: ['efectividad', 'eficiencia', 'satisfaccion', 'conformidad', 'mejora']
  },
  categoria: {
    type: String,
    required: true,
    enum: ['calidad', 'ambiental', 'seguridad', 'financiero', 'operacional']
  },
  organizacionId: {
    type: String,
    required: true,
    index: true
  },
  departamentoId: {
    type: String,
    ref: 'Department'
  },
  procesoId: {
    type: String,
    ref: 'Proceso'
  },
  objetivoId: {
    type: String,
    ref: 'Objetivo'
  },
  responsable: {
    type: String,
    required: true,
    ref: 'Personnel'
  },
  unidad: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  formula: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  frecuencia: {
    type: String,
    required: true,
    enum: ['diaria', 'semanal', 'mensual', 'trimestral', 'semestral', 'anual']
  },
  meta: {
    valor: {
      type: Number,
      required: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['mayor_que', 'menor_que', 'igual_a', 'entre']
    },
    valorMinimo: {
      type: Number
    },
    valorMaximo: {
      type: Number
    }
  },
  umbrales: {
    critico: {
      type: Number,
      required: true
    },
    advertencia: {
      type: Number,
      required: true
    },
    satisfactorio: {
      type: Number,
      required: true
    }
  },
  fuenteDatos: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  metodoCalculo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  periodicidad: {
    inicio: {
      type: Date,
      required: true
    },
    fin: {
      type: Date
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  mediciones: [{
    type: String,
    ref: 'Medicion'
  }],
  tendencia: {
    direccion: {
      type: String,
      enum: ['ascendente', 'descendente', 'estable'],
      default: 'estable'
    },
    periodo: {
      type: Number,
      default: 30 // días
    },
    valor: {
      type: Number,
      default: 0 // porcentaje de cambio
    }
  },
  estado: {
    type: String,
    required: true,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  alertas: {
    habilitadas: {
      type: Boolean,
      default: false
    },
    email: [{
      type: String,
      trim: true
    }],
    umbrales: {
      critico: {
        type: Boolean,
        default: true
      },
      advertencia: {
        type: Boolean,
        default: true
      }
    }
  },
  documentos: {
    procedimiento: String,
    instructivo: String,
    formato: String
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
IndicadorSchema.index({ organizacionId: 1, codigo: 1 }, { unique: true });
IndicadorSchema.index({ organizacionId: 1, nombre: 1 });
IndicadorSchema.index({ organizacionId: 1, tipo: 1 });
IndicadorSchema.index({ organizacionId: 1, categoria: 1 });
IndicadorSchema.index({ organizacionId: 1, estado: 1 });
IndicadorSchema.index({ organizacionId: 1, departamentoId: 1 });
IndicadorSchema.index({ organizacionId: 1, procesoId: 1 });
IndicadorSchema.index({ organizacionId: 1, objetivoId: 1 });
IndicadorSchema.index({ organizacionId: 1, responsable: 1 });
IndicadorSchema.index({ organizacionId: 1, isActive: 1 });
IndicadorSchema.index({ 'periodicidad.inicio': 1, 'periodicidad.fin': 1 });

// Virtual para obtener el responsable
IndicadorSchema.virtual('responsableInfo', {
  ref: 'Personnel',
  localField: 'responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el departamento
IndicadorSchema.virtual('departamento', {
  ref: 'Department',
  localField: 'departamentoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el proceso
IndicadorSchema.virtual('proceso', {
  ref: 'Proceso',
  localField: 'procesoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el objetivo
IndicadorSchema.virtual('objetivo', {
  ref: 'Objetivo',
  localField: 'objetivoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener las mediciones
IndicadorSchema.virtual('medicionesInfo', {
  ref: 'Medicion',
  localField: 'mediciones',
  foreignField: 'id'
});

// Virtual para obtener la última medición
IndicadorSchema.virtual('ultimaMedicion', {
  ref: 'Medicion',
  localField: 'id',
  foreignField: 'indicadorId',
  justOne: true,
  options: { sort: { fecha: -1 } }
});

// Método para verificar si está activo
IndicadorSchema.methods.estaActivo = function() {
  const hoy = new Date();
  return (
    this.estado === 'activo' &&
    this.periodicidad.activo &&
    this.periodicidad.inicio <= hoy &&
    (!this.periodicidad.fin || this.periodicidad.fin >= hoy)
  );
};

// Método para evaluar el estado del indicador basado en el valor
IndicadorSchema.methods.evaluarEstado = function(valor: number) {
  if (valor <= this.umbrales.critico) {
    return 'critico';
  } else if (valor <= this.umbrales.advertencia) {
    return 'advertencia';
  } else if (valor >= this.umbrales.satisfactorio) {
    return 'satisfactorio';
  } else {
    return 'regular';
  }
};

// Método para verificar si cumple la meta
IndicadorSchema.methods.cumpleMeta = function(valor: number) {
  switch (this.meta.tipo) {
    case 'mayor_que':
      return valor > this.meta.valor;
    case 'menor_que':
      return valor < this.meta.valor;
    case 'igual_a':
      return valor === this.meta.valor;
    case 'entre':
      return valor >= (this.meta.valorMinimo || 0) && valor <= (this.meta.valorMaximo || Infinity);
    default:
      return false;
  }
};

// Método para calcular la próxima fecha de medición
IndicadorSchema.methods.proximaMedicion = function() {
  const hoy = new Date();
  const proxima = new Date(hoy);
  
  switch (this.frecuencia) {
    case 'diaria':
      proxima.setDate(proxima.getDate() + 1);
      break;
    case 'semanal':
      proxima.setDate(proxima.getDate() + 7);
      break;
    case 'mensual':
      proxima.setMonth(proxima.getMonth() + 1);
      break;
    case 'trimestral':
      proxima.setMonth(proxima.getMonth() + 3);
      break;
    case 'semestral':
      proxima.setMonth(proxima.getMonth() + 6);
      break;
    case 'anual':
      proxima.setFullYear(proxima.getFullYear() + 1);
      break;
  }
  
  return proxima;
};

// Método para verificar si necesita medición
IndicadorSchema.methods.necesitaMedicion = function() {
  if (!this.estaActivo()) return false;
  
  const hoy = new Date();
  const proxima = this.proximaMedicion();
  
  // Verificar si ya pasó el tiempo para la próxima medición
  return hoy >= proxima;
};

const Indicador = mongoose.model<IIndicador>('Indicador', IndicadorSchema);
export default Indicador;