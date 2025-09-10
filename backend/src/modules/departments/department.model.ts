import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  id: string;
  nombre: string;
  descripcion?: string;
  objetivos?: string;
  codigo: string;
  responsable_id?: string;
  organization_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: 500
  },
  objetivos: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  codigo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  responsable_id: {
    type: String,
    ref: 'Personnel'
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
DepartmentSchema.index({ organization_id: 1, codigo: 1 }, { unique: true });
DepartmentSchema.index({ organization_id: 1, nombre: 1 });
DepartmentSchema.index({ organization_id: 1, is_active: 1 });

// Virtual para obtener el responsable
DepartmentSchema.virtual('responsable', {
  ref: 'Personnel',
  localField: 'responsable_id',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el personal del departamento
DepartmentSchema.virtual('personal', {
  ref: 'Personnel',
  localField: 'id',
  foreignField: 'departamento_id'
});

const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
export default Department;