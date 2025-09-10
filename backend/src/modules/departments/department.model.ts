import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  id: string;
  name: string;
  description?: string;
  code: string;
  managerId?: string;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 10
  },
  managerId: {
    type: String,
    ref: 'Personnel'
  },
  organizationId: {
    type: String,
    required: true,
    index: true
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

// Índices compuestos para multi-tenancy
DepartmentSchema.index({ organizationId: 1, code: 1 }, { unique: true });
DepartmentSchema.index({ organizationId: 1, name: 1 });
DepartmentSchema.index({ organizationId: 1, isActive: 1 });

// Virtual para obtener el manager
DepartmentSchema.virtual('manager', {
  ref: 'Personnel',
  localField: 'managerId',
  foreignField: 'id',
  justOne: true
});

// Virtual para obtener el personal del departamento
DepartmentSchema.virtual('personnel', {
  ref: 'Personnel',
  localField: 'id',
  foreignField: 'departmentId'
});

const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
export default Department;