import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistro extends Document {
  id: string;
  codigo: string;
  tipo: 'actividad' | 'incidente' | 'no_conformidad' | 'accion_correctiva' | 'accion_preventiva' | 'mejora' | 'auditoria' | 'revision';
  procesoId: string;
  organizacionId: string;
  departamentoId?: string;
  responsable: string; // ID del responsable
  fecha: Date;
  fechaVencimiento?: Date;
  titulo: string;
  descripcion: string;
  estado: 'abierto' | 'en_progreso' | 'cerrado' | 'cancelado' | 'vencido';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  categoria: 'calidad' | 'ambiental' | 'seguridad' | 'operacional' | 'financiero';
  origen: {
    tipo: 'interno' | 'externo' | 'auditoria' | 'revision' | 'queja' | 'sugerencia';
    fuente: string;
    referencia?: string;
  };
  impacto: {
    nivel: 'bajo' | 'medio' | 'alto' | 'critico';
    descripcion: string;
    areasAfectadas: string[];
  };
  causas: {
    identificadas: string[];
    raiz: string;
    analisis: string;
  };
  acciones: {
    descripcion: string;
    responsable: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
    evidencia?: string[];
  }[];
  seguimiento: {
    fecha: Date;
    responsable: string;
    comentarios: string;
    progreso: number; // porcentaje 0-100
    evidencia?: string[];
  }[];
  cierre: {
    fecha: Date;
    responsable: string;
    resultado: 'exitoso' | 'parcial' | 'no_exitoso';
    comentarios: string;
    evidencia: string[];
    leccionesAprendidas: string[];
  };
  documentos: {
    evidencia: string[];
    informes: string[];
    certificados: string[];
    otros: string[];
  };
  alertas: {
    generadas: boolean;
    tipo: 'vencimiento' | 'escalacion' | 'recordatorio';
    mensaje: string;
    enviada: boolean;
  };
  relacionadoCon: {
    registros: string[]; // IDs de otros registros relacionados
    objetivos: string[]; // IDs de objetivos relacionados
    indicadores: string[]; // IDs de indicadores relacionados
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistroSchema = new Schema<IRegistro>({
  codigo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 30
  },
  tipo: {
    type: String,
    required: true,
    enum: ['actividad', 'incidente', 'no_conformidad', 'accion_correctiva', 'accion_preventiva', 'mejora', 'auditoria', 'revision']
  },
  procesoId: {
    type: String,
    required: true,
    ref: 'Proceso',
    index: true
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
  fechaVencimiento: {
    type: Date,
    index: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  estado: {
    type: String,
    required: true,
    enum: ['abierto', 'en_progreso', 'cerrado', 'cancelado', 'vencido'],
    default: 'abierto'
  },
  prioridad: {
    type: String,
    required: true,
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media'
  },
  categoria: {
    type: String,
    required: true,
    enum: ['calidad', 'ambiental', 'seguridad', 'operacional', 'financiero'],
    default: 'calidad'
  },
  origen: {
    tipo: {
      type: String,
      required: true,
      enum: ['interno', 'externo', 'auditoria', 'revision', 'queja', 'sugerencia']
    },
    fuente: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    referencia: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  impacto: {
    nivel: {
      type: String,
      required: true,
      enum: ['bajo', 'medio', 'alto', 'critico'],
      default: 'medio'
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    areasAfectadas: [{
      type: String,
      trim: true
    }]
  },
  causas: {
    identificadas: [{
      type: String,
      trim: true
    }],
    raiz: {
      type: String,
      trim: true,
      maxlength: 500
    },
    analisis: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  acciones: [{
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
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
    evidencia: [{
      type: String,
      trim: true
    }]
  }],
  seguimiento: [{
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
      trim: true,
      maxlength: 1000
    },
    progreso: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0
    },
    evidencia: [{
      type: String,
      trim: true
    }]
  }],
  cierre: {
    fecha: {
      type: Date
    },
    responsable: {
      type: String,
      ref: 'Personnel'
    },
    resultado: {
      type: String,
      enum: ['exitoso', 'parcial', 'no_exitoso']
    },
    comentarios: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    evidencia: [{
      type: String,
      trim: true
    }],
    leccionesAprendidas: [{
      type: String,
      trim: true
    }]
  },
  documentos: {
    evidencia: [{
      type: String,
      trim: true
    }],
    informes: [{
      type: String,
      trim: true
    }],
    certificados: [{
      type: String,
      trim: true
    }],
    otros: [{
      type: String,
      trim: true
    }]
  },
  alertas: {
    generadas: {
      type: Boolean,
      default: false
    },
    tipo: {
      type: String,
      enum: ['vencimiento', 'escalacion', 'recordatorio'],
      default: 'recordatorio'
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
  relacionadoCon: {
    registros: [{
      type: String,
      ref: 'Registro'
    }],
    objetivos: [{
      type: String,
      ref: 'Objetivo'
    }],
    indicadores: [{
      type: String,
      ref: 'Indicador'
    }]
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
RegistroSchema.index({ organizacionId: 1, codigo: 1 }, { unique: true });
RegistroSchema.index({ organizacionId: 1, procesoId: 1, fecha: 1 });
RegistroSchema.index({ organizacionId: 1, tipo: 1 });
RegistroSchema.index({ organizacionId: 1, estado: 1 });
RegistroSchema.index({ organizacionId: 1, prioridad: 1 });
RegistroSchema.index({ organizacionId: 1, categoria: 1 });
RegistroSchema.index({ organizacionId: 1, responsable: 1 });
RegistroSchema.index({ organizacionId: 1, isActive: 1 });
RegistroSchema.index({ fechaVencimiento: 1 });
RegistroSchema.index({ fecha: 1 });

// Virtual para obtener el proceso
RegistroSchema.virtual('proceso', {
  ref: 'Proceso',
  localField: 'procesoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el departamento
RegistroSchema.virtual('departamento', {
  ref: 'Department',
  localField: 'departamentoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el responsable
RegistroSchema.virtual('responsableInfo', {
  ref: 'Personnel',
  localField: 'responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener los responsables de acciones
RegistroSchema.virtual('responsablesAcciones', {
  ref: 'Personnel',
  localField: 'acciones.responsable',
  foreignField: 'id'
});

// Virtual para obtener los responsables de seguimiento
RegistroSchema.virtual('responsablesSeguimiento', {
  ref: 'Personnel',
  localField: 'seguimiento.responsable',
  foreignField: 'id'
});

// Virtual para obtener el responsable de cierre
RegistroSchema.virtual('responsableCierre', {
  ref: 'Personnel',
  localField: 'cierre.responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener registros relacionados
RegistroSchema.virtual('registrosRelacionados', {
  ref: 'Registro',
  localField: 'relacionadoCon.registros',
  foreignField: 'id'
});

// Virtual para obtener objetivos relacionados
RegistroSchema.virtual('objetivosRelacionados', {
  ref: 'Objetivo',
  localField: 'relacionadoCon.objetivos',
  foreignField: 'id'
});

// Virtual para obtener indicadores relacionados
RegistroSchema.virtual('indicadoresRelacionados', {
  ref: 'Indicador',
  localField: 'relacionadoCon.indicadores',
  foreignField: 'id'
});

// Virtual para calcular el progreso general
RegistroSchema.virtual('progresoGeneral').get(function() {
  if (!this.acciones || this.acciones.length === 0) return 0;
  
  const totalProgreso = this.acciones.reduce((sum: number, accion: any) => {
    return sum + (accion.estado === 'completada' ? 100 : accion.estado === 'en_progreso' ? 50 : 0);
  }, 0);
  
  return Math.round(totalProgreso / this.acciones.length);
});

// Virtual para verificar si está vencido
RegistroSchema.virtual('estaVencido').get(function() {
  return this.fechaVencimiento && new Date() > this.fechaVencimiento && this.estado !== 'cerrado';
});

// Método para verificar si necesita atención
RegistroSchema.methods.necesitaAtencion = function() {
  const hoy = new Date();
  const diasRestantes = this.fechaVencimiento 
    ? Math.ceil((this.fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    : Infinity;
  
  // Necesita atención si:
  // - Está vencido
  // - Le quedan menos de 3 días y tiene prioridad alta o crítica
  // - Tiene prioridad crítica y está abierto
  return (
    this.estaVencido ||
    (diasRestantes <= 3 && ['alta', 'critica'].includes(this.prioridad)) ||
    (this.prioridad === 'critica' && this.estado === 'abierto')
  );
};

// Método para cerrar el registro
RegistroSchema.methods.cerrar = function(responsable: string, resultado: string, comentarios: string, evidencia: string[], leccionesAprendidas: string[]) {
  this.estado = 'cerrado';
  this.cierre = {
    fecha: new Date(),
    responsable,
    resultado,
    comentarios,
    evidencia,
    leccionesAprendidas
  };
};

// Método para agregar seguimiento
RegistroSchema.methods.agregarSeguimiento = function(responsable: string, comentarios: string, progreso: number, evidencia?: string[]) {
  this.seguimiento.push({
    fecha: new Date(),
    responsable,
    comentarios,
    progreso,
    evidencia: evidencia || []
  });
};

// Método para generar alertas
RegistroSchema.methods.generarAlertas = function() {
  const hoy = new Date();
  const diasRestantes = this.fechaVencimiento 
    ? Math.ceil((this.fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    : Infinity;

  if (this.estaVencido) {
    this.alertas = {
      generadas: true,
      tipo: 'vencimiento',
      mensaje: `Registro vencido desde hace ${Math.abs(diasRestantes)} días. Se requiere atención inmediata.`,
      enviada: false
    };
  } else if (diasRestantes <= 1 && this.estado !== 'cerrado') {
    this.alertas = {
      generadas: true,
      tipo: 'vencimiento',
      mensaje: `Registro vence en ${diasRestantes} día(s). Se requiere atención urgente.`,
      enviada: false
    };
  } else if (diasRestantes <= 3 && ['alta', 'critica'].includes(this.prioridad)) {
    this.alertas = {
      generadas: true,
      tipo: 'recordatorio',
      mensaje: `Registro de prioridad ${this.prioridad} vence en ${diasRestantes} días.`,
      enviada: false
    };
  }
};

const Registro = mongoose.model<IRegistro>('Registro', RegistroSchema);
export default Registro;