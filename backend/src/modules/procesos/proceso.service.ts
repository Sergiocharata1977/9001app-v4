import { Types } from 'mongoose';
import Proceso, { IProceso } from './proceso.model.js';

export interface IProcesoService {
  createProceso(data: Partial<IProceso>): Promise<IProceso>;
  getProcesos(organizacionId: string, filters?: any): Promise<IProceso[]>;
  getProcesoById(id: string, organizacionId: string): Promise<IProceso | null>;
  updateProceso(id: string, organizacionId: string, data: Partial<IProceso>): Promise<IProceso | null>;
  deleteProceso(id: string, organizacionId: string): Promise<boolean>;
  getProcesosByDepartamento(departamentoId: string, organizacionId: string): Promise<IProceso[]>;
  getProcesosByResponsable(responsableId: string, organizacionId: string): Promise<IProceso[]>;
  getProcesosPendientesRevision(organizacionId: string): Promise<IProceso[]>;
  getProcesosByTipo(tipo: string, organizacionId: string): Promise<IProceso[]>;
  getProcesosByEstado(estado: string, organizacionId: string): Promise<IProceso[]>;
  actualizarVersionProceso(id: string, organizacionId: string, nuevaVersion: string): Promise<IProceso | null>;
  aprobarProceso(id: string, organizacionId: string, fechaAprobacion: Date): Promise<IProceso | null>;
  marcarObsoleto(id: string, organizacionId: string): Promise<IProceso | null>;
  getEstadisticasProcesos(organizacionId: string): Promise<any>;
}

class ProcesoService implements IProcesoService {
  async createProceso(data: Partial<IProceso>): Promise<IProceso> {
    try {
      // Validar que el código sea único en la organización
      const procesoExistente = await Proceso.findOne({
        organizacionId: data.organizacionId,
        codigo: data.codigo
      });

      if (procesoExistente) {
        throw new Error(`Ya existe un proceso con el código ${data.codigo} en esta organización`);
      }

      // Calcular próxima revisión basada en la frecuencia
      const proximaRevision = this.calcularProximaRevision(
        data.frecuenciaRevision || 'anual',
        new Date()
      );

      const procesoData = {
        ...data,
        proximaRevision
      } as IProceso;

      const proceso = new Proceso(procesoData);
      return await proceso.save();
    } catch (error) {
      throw new Error(`Error al crear proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesos(organizacionId: string, filters: any = {}): Promise<IProceso[]> {
    try {
      const query: any = { organizacionId, isActive: true };

      // Aplicar filtros
      if (filters.tipo) query.tipo = filters.tipo;
      if (filters.estado) query.estado = filters.estado;
      if (filters.departamentoId) query.departamentoId = filters.departamentoId;
      if (filters.responsable) query.responsable = filters.responsable;
      if (filters.busqueda) {
        query.$or = [
          { nombre: { $regex: filters.busqueda, $options: 'i' } },
          { codigo: { $regex: filters.busqueda, $options: 'i' } },
          { descripcion: { $regex: filters.busqueda, $options: 'i' } }
        ];
      }

      return await Proceso.find(query)
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .populate('objetivosInfo', 'nombre codigo')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesoById(id: string, organizacionId: string): Promise<IProceso | null> {
    try {
      return await Proceso.findOne({ id, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido email telefono')
        .populate('departamento', 'nombre codigo descripcion')
        .populate('indicadoresInfo', 'nombre codigo descripcion unidad')
        .populate('objetivosInfo', 'nombre codigo descripcion fechaInicio fechaFin');
    } catch (error) {
      throw new Error(`Error al obtener proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async updateProceso(id: string, organizacionId: string, data: Partial<IProceso>): Promise<IProceso | null> {
    try {
      // Si se cambia la frecuencia de revisión, recalcular próxima revisión
      if (data.frecuenciaRevision) {
        data.proximaRevision = this.calcularProximaRevision(
          data.frecuenciaRevision,
          data.ultimaRevision || new Date()
        );
      }

      return await Proceso.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: data },
        { new: true, runValidators: true }
      ).populate('responsableInfo departamento indicadoresInfo objetivosInfo');
    } catch (error) {
      throw new Error(`Error al actualizar proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async deleteProceso(id: string, organizacionId: string): Promise<boolean> {
    try {
      const resultado = await Proceso.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      return !!resultado;
    } catch (error) {
      throw new Error(`Error al eliminar proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesosByDepartamento(departamentoId: string, organizacionId: string): Promise<IProceso[]> {
    try {
      return await Proceso.find({ departamentoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('indicadoresInfo', 'nombre codigo')
        .populate('objetivosInfo', 'nombre codigo')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos por departamento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesosByResponsable(responsableId: string, organizacionId: string): Promise<IProceso[]> {
    try {
      return await Proceso.find({ responsable: responsableId, organizacionId, isActive: true })
        .populate('departamento', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .populate('objetivosInfo', 'nombre codigo')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos por responsable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesosPendientesRevision(organizacionId: string): Promise<IProceso[]> {
    try {
      const hoy = new Date();
      return await Proceso.find({
        organizacionId,
        isActive: true,
        proximaRevision: { $lte: hoy },
        estado: { $in: ['aprobado', 'vigente'] }
      })
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .sort({ proximaRevision: 1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos pendientes de revisión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesosByTipo(tipo: string, organizacionId: string): Promise<IProceso[]> {
    try {
      return await Proceso.find({ tipo, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos por tipo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getProcesosByEstado(estado: string, organizacionId: string): Promise<IProceso[]> {
    try {
      return await Proceso.find({ estado, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener procesos por estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async actualizarVersionProceso(id: string, organizacionId: string, nuevaVersion: string): Promise<IProceso | null> {
    try {
      return await Proceso.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            version: nuevaVersion,
            ultimaRevision: new Date(),
            proximaRevision: this.calcularProximaRevision('anual', new Date())
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al actualizar versión del proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async aprobarProceso(id: string, organizacionId: string, fechaAprobacion: Date): Promise<IProceso | null> {
    try {
      return await Proceso.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            estado: 'aprobado',
            fechaAprobacion
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al aprobar proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async marcarObsoleto(id: string, organizacionId: string): Promise<IProceso | null> {
    try {
      return await Proceso.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            estado: 'obsoleto'
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al marcar proceso como obsoleto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasProcesos(organizacionId: string): Promise<any> {
    try {
      const estadisticas = await Proceso.aggregate([
        { $match: { organizacionId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: {
              $push: {
                tipo: '$tipo',
                estado: '$estado'
              }
            },
            porEstado: {
              $push: '$estado'
            },
            pendientesRevision: {
              $sum: {
                $cond: [
                  { $lte: ['$proximaRevision', new Date()] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      if (estadisticas.length === 0) {
        return {
          total: 0,
          porTipo: { principal: 0, soporte: 0, mejora: 0 },
          porEstado: { borrador: 0, aprobado: 0, vigente: 0, obsoleto: 0 },
          pendientesRevision: 0
        };
      }

      const stats = estadisticas[0];
      const porTipo = { principal: 0, soporte: 0, mejora: 0 };
      const porEstado = { borrador: 0, aprobado: 0, vigente: 0, obsoleto: 0 };

      stats.porTipo.forEach((item: any) => {
        porTipo[item.tipo as keyof typeof porTipo]++;
        porEstado[item.estado as keyof typeof porEstado]++;
      });

      return {
        total: stats.total,
        porTipo,
        porEstado,
        pendientesRevision: stats.pendientesRevision
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private calcularProximaRevision(frecuencia: string, fechaBase: Date): Date {
    const proxima = new Date(fechaBase);
    
    switch (frecuencia) {
      case 'mensual':
        proxima.setMonth(proxima.getMonth() + 1);
        break;
      case 'trimestral':
        proxima.setMonth(proxima.getMonth() + 3);
        break;
      case 'semestral':
        proxima.setMonth(proxima.getMonth() + 6);
        break;
      case 'anual':
      default:
        proxima.setFullYear(proxima.getFullYear() + 1);
        break;
    }
    
    return proxima;
  }
}

export default new ProcesoService();