import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonnel extends Document {
  id: string;
  numero_legajo?: string;
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  documento_identidad?: string;
  dni?: string;
  fecha_nacimiento?: Date;
  fecha_ingreso?: Date;
  fecha_contratacion?: Date;
  departamento_id?: string;
  puesto_id?: string;
  departamento?: string;
  puesto?: string;
  estado?: string;
  organization_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const PersonnelSchema = new Schema<IPersonnel>({
  numero_legajo: {
    type: String,
    trim: true,
    maxlength: 20
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  apellido: {
    type: String,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: 20
  },
  documento_identidad: {
    type: String,
    trim: true,
    maxlength: 20
  },
  dni: {
    type: String,
    trim: true,
    maxlength: 20
  },
  fecha_nacimiento: {
    type: Date
  },
  fecha_ingreso: {
    type: Date,
    default: Date.now
  },
  fecha_contratacion: {
    type: Date,
    default: Date.now
  },
  departamento_id: {
    type: String,
    ref: 'Department',
    index: true
  },
  puesto_id: {
    type: String,
    ref: 'Position',
    index: true
  },
  departamento: {
    type: String,
    trim: true,
    maxlength: 100
  },
  puesto: {
    type: String,
    trim: true,
    maxlength: 100
  },
  estado: {
    type: String,
    default: 'Activo',
    maxlength: 50
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
PersonnelSchema.index({ organization_id: 1, numero_legajo: 1 });
PersonnelSchema.index({ organization_id: 1, email: 1 });
PersonnelSchema.index({ organization_id: 1, documento_identidad: 1 });
PersonnelSchema.index({ organization_id: 1, departamento_id: 1 });
PersonnelSchema.index({ organization_id: 1, puesto_id: 1 });
PersonnelSchema.index({ organization_id: 1, estado: 1 });
PersonnelSchema.index({ organization_id: 1, is_active: 1 });

// Virtual para nombre completo
PersonnelSchema.virtual('nombre_completo').get(function() {
  return `${this.nombre} ${this.apellido || ''}`.trim();
});

// Virtual para obtener el departamento
PersonnelSchema.virtual('departamento_relacion', {
  ref: 'Department',
  localField: 'departamento_id',
  foreignField: '_id',
  justOne: true
});

// Virtual para obtener el puesto
PersonnelSchema.virtual('puesto_relacion', {
  ref: 'Position',
  localField: 'puesto_id',
  foreignField: '_id',
  justOne: true
});

const Personnel = mongoose.model<IPersonnel>('Personnel', PersonnelSchema);
export default Personnel;