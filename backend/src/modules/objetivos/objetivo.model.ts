import mongoose, { Document, Schema } from 'mongoose';

export interface IObjetivo extends Document {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: 'calidad' | 'ambiental' | 'seguridad' | 'financiero' | 'operacional';
  categoria: 'estrategico' | 'tactico' | 'operacional';
  organizacionId: string;
  departamentoId?: string;
  procesoId?: string;
  responsable: string; // ID del responsable
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'planificado' | 'en_progreso' | 'completado' | 'cancelado' | 'vencido';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  meta: {
    valor: number;
    unidad: string;
    tipo: 'incremento' | 'decremento' | 'mantenimiento' | 'especifico';
    valorInicial?: number;
    valorActual?: number;
  };
  indicadores: string[]; // IDs de indicadores asociados
  recursos: {
    humanos: string[];
    materiales: string[];
    financieros: number;
    tiempo: number; // en horas
  };
  actividades: {
    descripcion: string;
    responsable: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
    progreso: number; // porcentaje 0-100
  }[];
  riesgos: {
    identificado: string;
    probabilidad: 'baja' | 'media' | 'alta';
    impacto: 'bajo' | 'medio' | 'alto';
    mitigacion: string;
    responsable: string;
  }[];
  revisiones: {
    fecha: Date;
    responsable: string;
    comentarios: string;
    progreso: number;
    acciones: string[];
  }[];
  documentos: {
    planAccion?: string;
    informe?: string;
    evidencia?: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ObjetivoSchema = new Schema<IObjetivo>({
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
    enum: ['calidad', 'ambiental', 'seguridad', 'financiero', 'operacional']
  },
  categoria: {
    type: String,
    required: true,
    enum: ['estrategico', 'tactico', 'operacional']
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
  responsable: {
    type: String,
    required: true,
    ref: 'Personnel'
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['planificado', 'en_progreso', 'completado', 'cancelado', 'vencido'],
    default: 'planificado'
  },
  prioridad: {
    type: String,
    required: true,
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media'
  },
  meta: {
    valor: {
      type: Number,
      required: true
    },
    unidad: {
      type: String,
      required: true,
      trim: true
    },
    tipo: {
      type: String,
      required: true,
      enum: ['incremento', 'decremento', 'mantenimiento', 'especifico']
    },
    valorInicial: {
      type: Number
    },
    valorActual: {
      type: Number
    }
  },
  indicadores: [{
    type: String,
    ref: 'Indicador'
  }],
  recursos: {
    humanos: [{
      type: String,
      ref: 'Personnel'
    }],
    materiales: [{
      type: String,
      trim: true
    }],
    financieros: {
      type: Number,
      default: 0
    },
    tiempo: {
      type: Number,
      default: 0
    }
  },
  actividades: [{
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    responsable: {
      type: String,
      required: true,
      ref: 'Personnel'
    },
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaFin: {
      type: Date,
      required: true
    },
    estado: {
      type: String,
      required: true,
      enum: ['pendiente', 'en_progreso', 'completada', 'cancelada'],
      default: 'pendiente'
    },
    progreso: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  riesgos: [{
    identificado: {
      type: String,
      required: true,
      trim: true
    },
    probabilidad: {
      type: String,
      required: true,
      enum: ['baja', 'media', 'alta']
    },
    impacto: {
      type: String,
      required: true,
      enum: ['bajo', 'medio', 'alto']
    },
    mitigacion: {
      type: String,
      required: true,
      trim: true
    },
    responsable: {
      type: String,
      required: true,
      ref: 'Personnel'
    }
  }],
  revisiones: [{
    fecha: {
      type: Date,
      required: true
    },
    responsable: {
      type: String,
      required: true,
      ref: 'Personnel'
    },
    comentarios: {
      type: String,
      required: true,
      trim: true
    },
    progreso: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    acciones: [{
      type: String,
      trim: true
    }]
  }],
  documentos: {
    planAccion: String,
    informe: String,
    evidencia: [String]
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
ObjetivoSchema.index({ organizacionId: 1, codigo: 1 }, { unique: true });
ObjetivoSchema.index({ organizacionId: 1, nombre: 1 });
ObjetivoSchema.index({ organizacionId: 1, tipo: 1 });
ObjetivoSchema.index({ organizacionId: 1, categoria: 1 });
ObjetivoSchema.index({ organizacionId: 1, estado: 1 });
ObjetivoSchema.index({ organizacionId: 1, prioridad: 1 });
ObjetivoSchema.index({ organizacionId: 1, departamentoId: 1 });
ObjetivoSchema.index({ organizacionId: 1, procesoId: 1 });
ObjetivoSchema.index({ organizacionId: 1, responsable: 1 });
ObjetivoSchema.index({ organizacionId: 1, isActive: 1 });
ObjetivoSchema.index({ fechaFin: 1 });
ObjetivoSchema.index({ fechaInicio: 1, fechaFin: 1 });

// Virtual para obtener el responsable
ObjetivoSchema.virtual('responsableInfo', {
  ref: 'Personnel',
  localField: 'responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el departamento
ObjetivoSchema.virtual('departamento', {
  ref: 'Department',
  localField: 'departamentoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el proceso
ObjetivoSchema.virtual('proceso', {
  ref: 'Proceso',
  localField: 'procesoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener los indicadores
ObjetivoSchema.virtual('indicadoresInfo', {
  ref: 'Indicador',
  localField: 'indicadores',
  foreignField: 'id'
});

// Virtual para obtener el progreso general del objetivo
ObjetivoSchema.virtual('progresoGeneral').get(function() {
  if (!this.actividades || this.actividades.length === 0) return 0;
  
  const totalProgreso = this.actividades.reduce((sum: number, actividad: any) => {
    return sum + (actividad.progreso || 0);
  }, 0);
  
  return Math.round(totalProgreso / this.actividades.length);
});

// Virtual para verificar si está vencido
ObjetivoSchema.virtual('estaVencido').get(function() {
  return new Date() > this.fechaFin && this.estado !== 'completado';
});

// Método para calcular el nivel de riesgo
ObjetivoSchema.methods.calcularNivelRiesgo = function() {
  const riesgos = this.riesgos;
  if (!riesgos || riesgos.length === 0) return 'bajo';
  
  let puntuacionTotal = 0;
  let cantidadRiesgos = riesgos.length;
  
  riesgos.forEach((riesgo: any) => {
    const probabilidad = riesgo.probabilidad === 'baja' ? 1 : riesgo.probabilidad === 'media' ? 2 : 3;
    const impacto = riesgo.impacto === 'bajo' ? 1 : riesgo.impacto === 'medio' ? 2 : 3;
    puntuacionTotal += probabilidad * impacto;
  });
  
  const promedio = puntuacionTotal / cantidadRiesgos;
  
  if (promedio <= 2) return 'bajo';
  if (promedio <= 4) return 'medio';
  return 'alto';
};

// Método para actualizar el progreso basado en actividades
ObjetivoSchema.methods.actualizarProgreso = function() {
  if (!this.actividades || this.actividades.length === 0) return;
  
  const totalProgreso = this.actividades.reduce((sum: number, actividad: any) => {
    return sum + (actividad.progreso || 0);
  }, 0);
  
  const progresoGeneral = Math.round(totalProgreso / this.actividades.length);
  
  // Actualizar estado basado en progreso
  if (progresoGeneral === 100) {
    this.estado = 'completado';
  } else if (progresoGeneral > 0) {
    this.estado = 'en_progreso';
  }
  
  return progresoGeneral;
};

// Método para verificar si necesita atención
ObjetivoSchema.methods.necesitaAtencion = function() {
  const hoy = new Date();
  const diasRestantes = Math.ceil((this.fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  
  // Necesita atención si:
  // - Está vencido
  // - Le quedan menos de 30 días y el progreso es menor al 50%
  // - Tiene prioridad crítica y está en progreso
  return (
    this.estaVencido ||
    (diasRestantes <= 30 && this.progresoGeneral < 50) ||
    (this.prioridad === 'critica' && this.estado === 'en_progreso')
  );
};

const Objetivo = mongoose.model<IObjetivo>('Objetivo', ObjetivoSchema);
export default Objetivo;