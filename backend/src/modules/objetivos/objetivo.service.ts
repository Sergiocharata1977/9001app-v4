import { Types } from 'mongoose';
import Objetivo, { IObjetivo } from './objetivo.model.js';

export interface IObjetivoService {
  createObjetivo(data: Partial<IObjetivo>): Promise<IObjetivo>;
  getObjetivos(organizacionId: string, filters?: any): Promise<IObjetivo[]>;
  getObjetivoById(id: string, organizacionId: string): Promise<IObjetivo | null>;
  updateObjetivo(id: string, organizacionId: string, data: Partial<IObjetivo>): Promise<IObjetivo | null>;
  deleteObjetivo(id: string, organizacionId: string): Promise<boolean>;
  getObjetivosByDepartamento(departamentoId: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosByProceso(procesoId: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosByResponsable(responsableId: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosByTipo(tipo: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosByEstado(estado: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosByPrioridad(prioridad: string, organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosVencidos(organizacionId: string): Promise<IObjetivo[]>;
  getObjetivosNecesitanAtencion(organizacionId: string): Promise<IObjetivo[]>;
  actualizarProgresoActividad(objetivoId: string, actividadIndex: number, progreso: number, organizacionId: string): Promise<IObjetivo | null>;
  agregarRevision(objetivoId: string, revision: any, organizacionId: string): Promise<IObjetivo | null>;
  getEstadisticasObjetivos(organizacionId: string): Promise<any>;
}

class ObjetivoService implements IObjetivoService {
  async createObjetivo(data: Partial<IObjetivo>): Promise<IObjetivo> {
    try {
      // Validar que el código sea único en la organización
      const objetivoExistente = await Objetivo.findOne({
        organizacionId: data.organizacionId,
        codigo: data.codigo
      });

      if (objetivoExistente) {
        throw new Error(`Ya existe un objetivo con el código ${data.codigo} en esta organización`);
      }

      // Validar fechas
      if (data.fechaInicio && data.fechaFin && data.fechaInicio >= data.fechaFin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      const objetivo = new Objetivo(data);
      return await objetivo.save();
    } catch (error) {
      throw new Error(`Error al crear objetivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivos(organizacionId: string, filters: any = {}): Promise<IObjetivo[]> {
    try {
      const query: any = { organizacionId, isActive: true };

      // Aplicar filtros
      if (filters.tipo) query.tipo = filters.tipo;
      if (filters.categoria) query.categoria = filters.categoria;
      if (filters.estado) query.estado = filters.estado;
      if (filters.prioridad) query.prioridad = filters.prioridad;
      if (filters.departamentoId) query.departamentoId = filters.departamentoId;
      if (filters.procesoId) query.procesoId = filters.procesoId;
      if (filters.responsable) query.responsable = filters.responsable;
      if (filters.busqueda) {
        query.$or = [
          { nombre: { $regex: filters.busqueda, $options: 'i' } },
          { codigo: { $regex: filters.busqueda, $options: 'i' } },
          { descripcion: { $regex: filters.busqueda, $options: 'i' } }
        ];
      }

      return await Objetivo.find(query)
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivoById(id: string, organizacionId: string): Promise<IObjetivo | null> {
    try {
      return await Objetivo.findOne({ id, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido email telefono')
        .populate('departamento', 'nombre codigo descripcion')
        .populate('proceso', 'nombre codigo descripcion')
        .populate('indicadoresInfo', 'nombre codigo descripcion unidad')
        .populate('actividades.responsable', 'nombre apellido')
        .populate('riesgos.responsable', 'nombre apellido')
        .populate('revisiones.responsable', 'nombre apellido');
    } catch (error) {
      throw new Error(`Error al obtener objetivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async updateObjetivo(id: string, organizacionId: string, data: Partial<IObjetivo>): Promise<IObjetivo | null> {
    try {
      // Validar fechas si se proporcionan
      if (data.fechaInicio && data.fechaFin && data.fechaInicio >= data.fechaFin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      const objetivo = await Objetivo.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: data },
        { new: true, runValidators: true }
      ).populate('responsableInfo departamento proceso indicadoresInfo');

      // Actualizar progreso si se modificaron actividades
      if (objetivo && data.actividades) {
        objetivo.actualizarProgreso();
        await objetivo.save();
      }

      return objetivo;
    } catch (error) {
      throw new Error(`Error al actualizar objetivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async deleteObjetivo(id: string, organizacionId: string): Promise<boolean> {
    try {
      const resultado = await Objetivo.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      return !!resultado;
    } catch (error) {
      throw new Error(`Error al eliminar objetivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByDepartamento(departamentoId: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ departamentoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('proceso', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por departamento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByProceso(procesoId: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ procesoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByResponsable(responsableId: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ responsable: responsableId, organizacionId, isActive: true })
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('indicadoresInfo', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por responsable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByTipo(tipo: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ tipo, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por tipo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByEstado(estado: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ estado, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .sort({ prioridad: -1, fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosByPrioridad(prioridad: string, organizacionId: string): Promise<IObjetivo[]> {
    try {
      return await Objetivo.find({ prioridad, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .sort({ fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos por prioridad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosVencidos(organizacionId: string): Promise<IObjetivo[]> {
    try {
      const hoy = new Date();
      return await Objetivo.find({
        organizacionId,
        isActive: true,
        fechaFin: { $lt: hoy },
        estado: { $nin: ['completado', 'cancelado'] }
      })
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .sort({ fechaFin: 1 });
    } catch (error) {
      throw new Error(`Error al obtener objetivos vencidos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getObjetivosNecesitanAtencion(organizacionId: string): Promise<IObjetivo[]> {
    try {
      const objetivos = await Objetivo.find({
        organizacionId,
        isActive: true,
        estado: { $in: ['planificado', 'en_progreso'] }
      })
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo');

      // Filtrar objetivos que necesitan atención
      return objetivos.filter(objetivo => objetivo.necesitaAtencion());
    } catch (error) {
      throw new Error(`Error al obtener objetivos que necesitan atención: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async actualizarProgresoActividad(objetivoId: string, actividadIndex: number, progreso: number, organizacionId: string): Promise<IObjetivo | null> {
    try {
      if (progreso < 0 || progreso > 100) {
        throw new Error('El progreso debe estar entre 0 y 100');
      }

      const objetivo = await Objetivo.findOne({ id: objetivoId, organizacionId, isActive: true });
      if (!objetivo) {
        throw new Error('Objetivo no encontrado');
      }

      if (actividadIndex < 0 || actividadIndex >= objetivo.actividades.length) {
        throw new Error('Índice de actividad inválido');
      }

      // Actualizar progreso de la actividad
      objetivo.actividades[actividadIndex].progreso = progreso;
      
      // Actualizar estado de la actividad basado en progreso
      if (progreso === 100) {
        objetivo.actividades[actividadIndex].estado = 'completada';
      } else if (progreso > 0) {
        objetivo.actividades[actividadIndex].estado = 'en_progreso';
      }

      // Actualizar progreso general del objetivo
      objetivo.actualizarProgreso();
      
      return await objetivo.save();
    } catch (error) {
      throw new Error(`Error al actualizar progreso de actividad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async agregarRevision(objetivoId: string, revision: any, organizacionId: string): Promise<IObjetivo | null> {
    try {
      const objetivo = await Objetivo.findOne({ id: objetivoId, organizacionId, isActive: true });
      if (!objetivo) {
        throw new Error('Objetivo no encontrado');
      }

      // Agregar revisión
      objetivo.revisiones.push({
        fecha: new Date(),
        responsable: revision.responsable,
        comentarios: revision.comentarios,
        progreso: revision.progreso,
        acciones: revision.acciones || []
      });

      // Actualizar progreso general si se proporciona
      if (revision.progreso !== undefined) {
        objetivo.actualizarProgreso();
      }

      return await objetivo.save();
    } catch (error) {
      throw new Error(`Error al agregar revisión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasObjetivos(organizacionId: string): Promise<any> {
    try {
      const estadisticas = await Objetivo.aggregate([
        { $match: { organizacionId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: {
              $push: {
                tipo: '$tipo',
                estado: '$estado',
                prioridad: '$prioridad'
              }
            },
            porEstado: {
              $push: '$estado'
            },
            porPrioridad: {
              $push: '$prioridad'
            },
            vencidos: {
              $sum: {
                $cond: [
                  { $and: [
                    { $lt: ['$fechaFin', new Date()] },
                    { $nin: ['$estado', ['completado', 'cancelado']] }
                  ]},
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
          porTipo: { calidad: 0, ambiental: 0, seguridad: 0, financiero: 0, operacional: 0 },
          porEstado: { planificado: 0, en_progreso: 0, completado: 0, cancelado: 0, vencido: 0 },
          porPrioridad: { baja: 0, media: 0, alta: 0, critica: 0 },
          vencidos: 0
        };
      }

      const stats = estadisticas[0];
      const porTipo = { calidad: 0, ambiental: 0, seguridad: 0, financiero: 0, operacional: 0 };
      const porEstado = { planificado: 0, en_progreso: 0, completado: 0, cancelado: 0, vencido: 0 };
      const porPrioridad = { baja: 0, media: 0, alta: 0, critica: 0 };

      stats.porTipo.forEach((item: any) => {
        porTipo[item.tipo as keyof typeof porTipo]++;
        porEstado[item.estado as keyof typeof porEstado]++;
        porPrioridad[item.prioridad as keyof typeof porPrioridad]++;
      });

      return {
        total: stats.total,
        porTipo,
        porEstado,
        porPrioridad,
        vencidos: stats.vencidos
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

export default new ObjetivoService();