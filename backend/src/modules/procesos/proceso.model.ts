import mongoose, { Document, Schema } from 'mongoose';

export interface IProceso extends Document {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: 'principal' | 'soporte' | 'mejora';
  responsable: string; // ID del responsable
  departamentoId: string;
  organizacionId: string;
  version: string;
  fechaAprobacion?: Date;
  fechaVigencia: Date;
  estado: 'borrador' | 'aprobado' | 'vigente' | 'obsoleto';
  documentos: {
    procedimiento?: string;
    instructivo?: string;
    formato?: string;
    registro?: string;
  };
  entradas: string[];
  salidas: string[];
  recursos: string[];
  riesgos: {
    identificado: string;
    probabilidad: 'baja' | 'media' | 'alta';
    impacto: 'bajo' | 'medio' | 'alto';
    mitigacion: string;
  }[];
  indicadores: string[]; // IDs de indicadores asociados
  objetivos: string[]; // IDs de objetivos asociados
  frecuenciaRevision: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  ultimaRevision?: Date;
  proximaRevision: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProcesoSchema = new Schema<IProceso>({
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
    enum: ['principal', 'soporte', 'mejora']
  },
  responsable: {
    type: String,
    required: true,
    ref: 'Personnel'
  },
  departamentoId: {
    type: String,
    required: true,
    ref: 'Department'
  },
  organizacionId: {
    type: String,
    required: true,
    index: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0'
  },
  fechaAprobacion: {
    type: Date
  },
  fechaVigencia: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['borrador', 'aprobado', 'vigente', 'obsoleto'],
    default: 'borrador'
  },
  documentos: {
    procedimiento: String,
    instructivo: String,
    formato: String,
    registro: String
  },
  entradas: [{
    type: String,
    trim: true
  }],
  salidas: [{
    type: String,
    trim: true
  }],
  recursos: [{
    type: String,
    trim: true
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
    }
  }],
  indicadores: [{
    type: String,
    ref: 'Indicador'
  }],
  objetivos: [{
    type: String,
    ref: 'Objetivo'
  }],
  frecuenciaRevision: {
    type: String,
    required: true,
    enum: ['mensual', 'trimestral', 'semestral', 'anual']
  },
  ultimaRevision: {
    type: Date
  },
  proximaRevision: {
    type: Date,
    required: true
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
ProcesoSchema.index({ organizacionId: 1, codigo: 1 }, { unique: true });
ProcesoSchema.index({ organizacionId: 1, nombre: 1 });
ProcesoSchema.index({ organizacionId: 1, tipo: 1 });
ProcesoSchema.index({ organizacionId: 1, estado: 1 });
ProcesoSchema.index({ organizacionId: 1, departamentoId: 1 });
ProcesoSchema.index({ organizacionId: 1, responsable: 1 });
ProcesoSchema.index({ organizacionId: 1, isActive: 1 });
ProcesoSchema.index({ proximaRevision: 1 });

// Virtual para obtener el responsable
ProcesoSchema.virtual('responsableInfo', {
  ref: 'Personnel',
  localField: 'responsable',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el departamento
ProcesoSchema.virtual('departamento', {
  ref: 'Department',
  localField: 'departamentoId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener los indicadores
ProcesoSchema.virtual('indicadoresInfo', {
  ref: 'Indicador',
  localField: 'indicadores',
  foreignField: 'id'
});

// Virtual para obtener los objetivos
ProcesoSchema.virtual('objetivosInfo', {
  ref: 'Objetivo',
  localField: 'objetivos',
  foreignField: 'id'
});

// Método para calcular el nivel de riesgo
ProcesoSchema.methods.calcularNivelRiesgo = function() {
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

// Método para verificar si necesita revisión
ProcesoSchema.methods.necesitaRevision = function() {
  const hoy = new Date();
  return this.proximaRevision <= hoy;
};

const Proceso = mongoose.model<IProceso>('Proceso', ProcesoSchema);
export default Proceso;