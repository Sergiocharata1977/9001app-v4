import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript ES6
export interface IUser extends Document {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  avatar?: string;
  roles: string[];
  organization_id: mongoose.Types.ObjectId;
  activo: boolean;
  ultimo_acceso?: Date;
  // Configuración de usuario
  configuracion: {
    tema: 'light' | 'dark';
    idioma: string;
    notificaciones: boolean;
  };
  // Auditoría
  created_by?: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  // Métodos de instancia
  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): any;
}

// Schema MongoDB
const UserSchema = new Schema<IUser>({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    maxlength: [50, 'El apellido no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  telefono: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  roles: [{
    type: String,
    enum: ['admin', 'manager', 'user', 'viewer'],
    default: ['user']
  }],
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'La organización es obligatoria']
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimo_acceso: {
    type: Date
  },
  configuracion: {
    tema: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    idioma: {
      type: String,
      default: 'es'
    },
    notificaciones: {
      type: Boolean,
      default: true
    }
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ organization_id: 1 });
UserSchema.index({ activo: 1 });
UserSchema.index({ roles: 1 });

// Métodos de instancia
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password || this.password_hash);
};

UserSchema.methods.toPublicJSON = function(): any {
  try {
    return {
      id: this._id,
      nombre: this.nombre || this.name || 'Usuario',
      apellido: this.apellido || 'Sistema',
      email: this.email,
      telefono: this.telefono || '',
      avatar: this.avatar || '',
      roles: this.roles || (this.role ? [this.role] : ['user']),
      organization: this.organization_id ? {
        id: this.organization_id._id || this.organization_id,
        nombre: this.organization_id.nombre || 'Organización',
        codigo: this.organization_id.codigo || 'ORG'
      } : null,
      activo: this.activo !== undefined ? this.activo : (this.is_active !== undefined ? this.is_active : true),
      ultimo_acceso: this.ultimo_acceso,
      configuracion: this.configuracion || {
        tema: 'light',
        idioma: 'es',
        notificaciones: true
      },
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  } catch (error) {
    console.error('Error en toPublicJSON:', error);
    return {
      id: this._id,
      nombre: 'Usuario',
      apellido: 'Sistema',
      email: this.email,
      roles: ['user'],
      organization: null,
      activo: true
    };
  }
};

// Métodos estáticos
UserSchema.statics.findByOrganization = function(organizationId: string) {
  return this.find({ 
    organization_id: organizationId,
    activo: true 
  }).populate('organization_id', 'nombre codigo');
};

UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ 
    email: email.toLowerCase(),
    activo: true 
  }).populate('organization_id', 'nombre codigo');
};

export const User = mongoose.model<IUser>('User', UserSchema);
