import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface para relaciones entre procesos
export interface IProcesoRelacion extends Document {
  organization_id: Types.ObjectId;
  proceso_origen_id: Types.ObjectId;
  proceso_destino_id: Types.ObjectId;
  tipo_relacion: 'entrada' | 'salida' | 'control' | 'apoyo' | 'mejora' | 'padre' | 'hijo' | 'hermano';
  descripcion?: string;
  prioridad: 'baja' | 'media' | 'alta';
  activo: boolean;
  
  // Configuración de la relación
  configuracion: {
    es_obligatoria: boolean;
    requiere_aprobacion: boolean;
    tiempo_maximo_dias?: number;
    notificar_cambios: boolean;
  };
  
  // Metadata
  metadata: {
    creado_por: Types.ObjectId;
    fecha_creacion: Date;
    modificado_por?: Types.ObjectId;
    fecha_modificacion?: Date;
  };
  
  // Métodos
  validarRelacion(): boolean;
  obtenerProcesosRelacionados(): Promise<IProcesoRelacion[]>;
}

// Schema de MongoDB
const ProcesoRelacionSchema = new Schema<IProcesoRelacion>({
  // Identificación
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  
  // Procesos relacionados
  proceso_origen_id: {
    type: Schema.Types.ObjectId,
    ref: 'Proceso',
    required: true,
    index: true
  },
  
  proceso_destino_id: {
    type: Schema.Types.ObjectId,
    ref: 'Proceso',
    required: true,
    index: true
  },
  
  // Tipo de relación
  tipo_relacion: {
    type: String,
    enum: ['entrada', 'salida', 'control', 'apoyo', 'mejora', 'padre', 'hijo', 'hermano'],
    required: true,
    index: true
  },
  
  // Descripción
  descripcion: {
    type: String,
    maxlength: 500
  },
  
  // Prioridad
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  
  // Estado
  activo: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Configuración
  configuracion: {
    es_obligatoria: {
      type: Boolean,
      default: false
    },
    requiere_aprobacion: {
      type: Boolean,
      default: false
    },
    tiempo_maximo_dias: {
      type: Number,
      min: 1,
      max: 365
    },
    notificar_cambios: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  metadata: {
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fecha_creacion: {
      type: Date,
      default: Date.now
    },
    modificado_por: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    fecha_modificacion: Date
  }
}, {
  timestamps: true,
  collection: 'proceso_relaciones'
});

// Índices compuestos para optimización
ProcesoRelacionSchema.index({ organization_id: 1, proceso_origen_id: 1 });
ProcesoRelacionSchema.index({ organization_id: 1, proceso_destino_id: 1 });
ProcesoRelacionSchema.index({ organization_id: 1, tipo_relacion: 1 });
ProcesoRelacionSchema.index({ proceso_origen_id: 1, proceso_destino_id: 1 }, { unique: true });

// Middleware pre-save
ProcesoRelacionSchema.pre('save', function(next) {
  this.metadata.fecha_modificacion = new Date();
  next();
});

// Métodos de instancia
ProcesoRelacionSchema.methods.validarRelacion = function(): boolean {
  // No permitir relación consigo mismo
  if (this.proceso_origen_id.equals(this.proceso_destino_id)) {
    return false;
  }
  
  // Validar tipos de relación específicos
  if (this.tipo_relacion === 'padre' && this.tipo_relacion === 'hijo') {
    return false; // No puede ser padre e hijo al mismo tiempo
  }
  
  return true;
};

ProcesoRelacionSchema.methods.obtenerProcesosRelacionados = async function(): Promise<IProcesoRelacion[]> {
  return await ProcesoRelacion.find({
    organization_id: this.organization_id,
    $or: [
      { proceso_origen_id: this.proceso_origen_id },
      { proceso_destino_id: this.proceso_destino_id }
    ],
    activo: true
  }).populate('proceso_origen_id proceso_destino_id');
};

// Métodos estáticos
ProcesoRelacionSchema.statics.crearRelacion = async function(
  organizationId: string,
  procesoOrigenId: string,
  procesoDestinoId: string,
  tipoRelacion: string,
  usuarioId: string,
  descripcion?: string
): Promise<IProcesoRelacion> {
  // Verificar que no existe ya la relación
  const existeRelacion = await this.findOne({
    organization_id: organizationId,
    proceso_origen_id: procesoOrigenId,
    proceso_destino_id: procesoDestinoId,
    tipo_relacion: tipoRelacion
  });
  
  if (existeRelacion) {
    throw new Error('La relación ya existe');
  }
  
  // Crear nueva relación
  const relacion = new this({
    organization_id: organizationId,
    proceso_origen_id: procesoOrigenId,
    proceso_destino_id: procesoDestinoId,
    tipo_relacion: tipoRelacion,
    descripcion,
    metadata: {
      creado_por: usuarioId,
      fecha_creacion: new Date()
    }
  });
  
  // Validar antes de guardar
  if (!relacion.validarRelacion()) {
    throw new Error('Relación inválida');
  }
  
  return await relacion.save();
};

ProcesoRelacionSchema.statics.obtenerRelacionesProceso = async function(
  organizationId: string,
  procesoId: string
): Promise<IProcesoRelacion[]> {
  return await this.find({
    organization_id: organizationId,
    $or: [
      { proceso_origen_id: procesoId },
      { proceso_destino_id: procesoId }
    ],
    activo: true
  }).populate('proceso_origen_id proceso_destino_id');
};

ProcesoRelacionSchema.statics.obtenerJerarquiaProcesos = async function(
  organizationId: string,
  procesoId: string
): Promise<{
  procesos_padre: IProcesoRelacion[];
  procesos_hijo: IProcesoRelacion[];
  procesos_hermano: IProcesoRelacion[];
}> {
  const [procesos_padre, procesos_hijo, procesos_hermano] = await Promise.all([
    this.find({
      organization_id: organizationId,
      proceso_destino_id: procesoId,
      tipo_relacion: 'padre',
      activo: true
    }).populate('proceso_origen_id'),
    
    this.find({
      organization_id: organizationId,
      proceso_origen_id: procesoId,
      tipo_relacion: 'hijo',
      activo: true
    }).populate('proceso_destino_id'),
    
    this.find({
      organization_id: organizationId,
      $or: [
        { proceso_origen_id: procesoId, tipo_relacion: 'hermano' },
        { proceso_destino_id: procesoId, tipo_relacion: 'hermano' }
      ],
      activo: true
    }).populate('proceso_origen_id proceso_destino_id')
  ]);
  
  return {
    procesos_padre,
    procesos_hijo,
    procesos_hermano
  };
};

// Exportar modelo
const ProcesoRelacion = mongoose.model<IProcesoRelacion>('ProcesoRelacion', ProcesoRelacionSchema);
export default ProcesoRelacion;
