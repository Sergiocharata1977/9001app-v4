import mongoose, { Document, Schema } from 'mongoose';

export interface IPosition extends Document {
  id: string;
  nombre: string;
  descripcion?: string;
  departamento_id?: string;
  requisitos_experiencia?: string;
  requisitos_formacion?: string;
  organization_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const PositionSchema = new Schema<IPosition>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  departamento_id: {
    type: String,
    ref: 'Department',
    index: true
  },
  requisitos_experiencia: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  requisitos_formacion: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para multi-tenancy
PositionSchema.index({ organization_id: 1, nombre: 1 });
PositionSchema.index({ organization_id: 1, departamento_id: 1 });
PositionSchema.index({ organization_id: 1, is_active: 1 });

// Virtual para obtener el departamento
PositionSchema.virtual('departamento', {
  ref: 'Department',
  localField: 'departamento_id',
  foreignField: '_id',
  justOne: true
});

// Virtual para obtener el personal en este puesto
PositionSchema.virtual('personal', {
  ref: 'Personnel',
  localField: '_id',
  foreignField: 'puesto_id'
});

const Position = mongoose.model<IPosition>('Position', PositionSchema);
export default Position;