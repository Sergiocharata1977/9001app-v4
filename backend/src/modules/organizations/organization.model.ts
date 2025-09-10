import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript ES6
export interface IOrganization extends Document {
  nombre: string;
  codigo: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  website?: string;
  activo: boolean;
  configuracion: {
    timezone: string;
    idioma: string;
    moneda: string;
    formato_fecha: string;
  };
  // Auditoría
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Schema MongoDB
const OrganizationSchema = new Schema<IOrganization>({
  nombre: {
    type: String,
    required: [true, 'El nombre de la organización es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código de la organización es obligatorio'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  direccion: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  website: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  configuracion: {
    timezone: {
      type: String,
      default: 'America/Argentina/Buenos_Aires'
    },
    idioma: {
      type: String,
      default: 'es'
    },
    moneda: {
      type: String,
      default: 'ARS'
    },
    formato_fecha: {
      type: String,
      default: 'DD/MM/YYYY'
    }
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
OrganizationSchema.index({ codigo: 1 }, { unique: true });
OrganizationSchema.index({ activo: 1 });
OrganizationSchema.index({ created_by: 1 });

// Métodos estáticos
OrganizationSchema.statics.findActive = function() {
  return this.find({ activo: true });
};

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
