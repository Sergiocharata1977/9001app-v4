import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript ES6
export interface IDepartment extends Document {
  codigo: string;
  nombre: string;
  descripcion?: string;
  organization_id: mongoose.Types.ObjectId;
  responsable_id?: mongoose.Types.ObjectId;
  parent_id?: mongoose.Types.ObjectId; // Para departamentos jerárquicos
  nivel: number;
  activo: boolean;
  // Auditoría
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Schema MongoDB
const DepartmentSchema = new Schema<IDepartment>({
  codigo: {
    type: String,
    required: [true, 'El código del departamento es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del departamento es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  responsable_id: {
    type: Schema.Types.ObjectId,
    ref: 'Personnel'
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  nivel: {
    type: Number,
    default: 1
  },
  activo: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Índices para optimización
DepartmentSchema.index({ organization_id: 1, codigo: 1 });
DepartmentSchema.index({ organization_id: 1, activo: 1 });
DepartmentSchema.index({ parent_id: 1 });

// Métodos de instancia
DepartmentSchema.methods.getFullPath = async function(): Promise<string> {
  let path = this.nombre;
  let currentDept = this;
  
  while (currentDept.parent_id) {
    currentDept = await mongoose.model('Department').findById(currentDept.parent_id);
    if (currentDept) {
      path = `${currentDept.nombre} > ${path}`;
    }
  }
  
  return path;
};

// Métodos estáticos
DepartmentSchema.statics.findByOrganization = function(organizationId: string) {
  return this.find({ 
    organization_id: organizationId,
    activo: true 
  }).populate('responsable_id', 'nombre apellido');
};

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);

