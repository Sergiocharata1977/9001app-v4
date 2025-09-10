import { Types } from 'mongoose';
import Registro, { IRegistro } from './registro.model.js';

export interface IRegistroService {
  createRegistro(data: Partial<IRegistro>): Promise<IRegistro>;
  getRegistros(organizacionId: string, filters?: any): Promise<IRegistro[]>;
  getRegistroById(id: string, organizacionId: string): Promise<IRegistro | null>;
  updateRegistro(id: string, organizacionId: string, data: Partial<IRegistro>): Promise<IRegistro | null>;
  deleteRegistro(id: string, organizacionId: string): Promise<boolean>;
  getRegistrosByProceso(procesoId: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByDepartamento(departamentoId: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByResponsable(responsableId: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByTipo(tipo: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByEstado(estado: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByPrioridad(prioridad: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosByCategoria(categoria: string, organizacionId: string): Promise<IRegistro[]>;
  getRegistrosVencidos(organizacionId: string): Promise<IRegistro[]>;
  getRegistrosNecesitanAtencion(organizacionId: string): Promise<IRegistro[]>;
  getRegistrosConAlertas(organizacionId: string): Promise<IRegistro[]>;
  cerrarRegistro(id: string, organizacionId: string, cierreData: any): Promise<IRegistro | null>;
  agregarSeguimiento(id: string, organizacionId: string, seguimientoData: any): Promise<IRegistro | null>;
  actualizarAccion(id: string, organizacionId: string, accionIndex: number, accionData: any): Promise<IRegistro | null>;
  getEstadisticasRegistros(organizacionId: string): Promise<any>;
}

class RegistroService implements IRegistroService {
  async createRegistro(data: Partial<IRegistro>): Promise<IRegistro> {
    try {
      // Validar que el código sea único en la organización
      const registroExistente = await Registro.findOne({
        organizacionId: data.organizacionId,
        codigo: data.codigo
      });

      if (registroExistente) {
        throw new Error(`Ya existe un registro con el código ${data.codigo} en esta organización`);
      }

      // Validar fechas
      if (data.fechaVencimiento && data.fecha && data.fechaVencimiento <= data.fecha) {
        throw new Error('La fecha de vencimiento debe ser posterior a la fecha del registro');
      }

      // Validar fechas de acciones
      if (data.acciones) {
        for (const accion of data.acciones) {
          if (accion.fechaInicio >= accion.fechaFin) {
            throw new Error('La fecha de inicio de la acción debe ser anterior a la fecha de fin');
          }
        }
      }

      const registro = new Registro(data);
      
      // Generar alertas si es necesario
      registro.generarAlertas();
      
      return await registro.save();
    } catch (error) {
      throw new Error(`Error al crear registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistros(organizacionId: string, filters: any = {}): Promise<IRegistro[]> {
    try {
      const query: any = { organizacionId, isActive: true };

      // Aplicar filtros
      if (filters.tipo) query.tipo = filters.tipo;
      if (filters.estado) query.estado = filters.estado;
      if (filters.prioridad) query.prioridad = filters.prioridad;
      if (filters.categoria) query.categoria = filters.categoria;
      if (filters.procesoId) query.procesoId = filters.procesoId;
      if (filters.departamentoId) query.departamentoId = filters.departamentoId;
      if (filters.responsable) query.responsable = filters.responsable;
      if (filters.fechaInicio || filters.fechaFin) {
        query.fecha = {};
        if (filters.fechaInicio) query.fecha.$gte = new Date(filters.fechaInicio);
        if (filters.fechaFin) query.fecha.$lte = new Date(filters.fechaFin);
      }
      if (filters.vencido === 'true') {
        query.fechaVencimiento = { $lt: new Date() };
        query.estado = { $ne: 'cerrado' };
      }
      if (filters.busqueda) {
        query.$or = [
          { titulo: { $regex: filters.busqueda, $options: 'i' } },
          { codigo: { $regex: filters.busqueda, $options: 'i' } },
          { descripcion: { $regex: filters.busqueda, $options: 'i' } }
        ];
      }

      return await Registro.find(query)
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido email')
        .populate('responsablesAcciones', 'nombre apellido')
        .populate('responsablesSeguimiento', 'nombre apellido')
        .populate('responsableCierre', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistroById(id: string, organizacionId: string): Promise<IRegistro | null> {
    try {
      return await Registro.findOne({ id, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo descripcion')
        .populate('departamento', 'nombre codigo descripcion')
        .populate('responsableInfo', 'nombre apellido email telefono')
        .populate('responsablesAcciones', 'nombre apellido email')
        .populate('responsablesSeguimiento', 'nombre apellido email')
        .populate('responsableCierre', 'nombre apellido email')
        .populate('registrosRelacionados', 'codigo titulo estado')
        .populate('objetivosRelacionados', 'codigo nombre estado')
        .populate('indicadoresRelacionados', 'codigo nombre estado');
    } catch (error) {
      throw new Error(`Error al obtener registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async updateRegistro(id: string, organizacionId: string, data: Partial<IRegistro>): Promise<IRegistro | null> {
    try {
      // Validar fechas si se proporcionan
      if (data.fechaVencimiento && data.fecha && data.fechaVencimiento <= data.fecha) {
        throw new Error('La fecha de vencimiento debe ser posterior a la fecha del registro');
      }

      // Validar fechas de acciones si se proporcionan
      if (data.acciones) {
        for (const accion of data.acciones) {
          if (accion.fechaInicio >= accion.fechaFin) {
            throw new Error('La fecha de inicio de la acción debe ser anterior a la fecha de fin');
          }
        }
      }

      const registro = await Registro.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: data },
        { new: true, runValidators: true }
      ).populate('proceso departamento responsableInfo responsablesAcciones responsablesSeguimiento responsableCierre');

      // Regenerar alertas si se actualizó
      if (registro) {
        registro.generarAlertas();
        await registro.save();
      }

      return registro;
    } catch (error) {
      throw new Error(`Error al actualizar registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async deleteRegistro(id: string, organizacionId: string): Promise<boolean> {
    try {
      const resultado = await Registro.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      return !!resultado;
    } catch (error) {
      throw new Error(`Error al eliminar registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByProceso(procesoId: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ procesoId, organizacionId, isActive: true })
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByDepartamento(departamentoId: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ departamentoId, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por departamento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByResponsable(responsableId: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ responsable: responsableId, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por responsable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByTipo(tipo: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ tipo, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por tipo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByEstado(estado: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ estado, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByPrioridad(prioridad: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ prioridad, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por prioridad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosByCategoria(categoria: string, organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({ categoria, organizacionId, isActive: true })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros por categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosVencidos(organizacionId: string): Promise<IRegistro[]> {
    try {
      const hoy = new Date();
      return await Registro.find({
        organizacionId,
        isActive: true,
        fechaVencimiento: { $lt: hoy },
        estado: { $ne: 'cerrado' }
      })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido email')
        .populate('responsablesAcciones', 'nombre apellido')
        .sort({ fechaVencimiento: 1 });
    } catch (error) {
      throw new Error(`Error al obtener registros vencidos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosNecesitanAtencion(organizacionId: string): Promise<IRegistro[]> {
    try {
      const registros = await Registro.find({
        organizacionId,
        isActive: true,
        estado: { $in: ['abierto', 'en_progreso'] }
      })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido email')
        .populate('responsablesAcciones', 'nombre apellido');

      // Filtrar registros que necesitan atención
      return registros.filter(registro => registro.necesitaAtencion());
    } catch (error) {
      throw new Error(`Error al obtener registros que necesitan atención: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getRegistrosConAlertas(organizacionId: string): Promise<IRegistro[]> {
    try {
      return await Registro.find({
        organizacionId,
        isActive: true,
        'alertas.generadas': true
      })
        .populate('proceso', 'nombre codigo')
        .populate('departamento', 'nombre codigo')
        .populate('responsableInfo', 'nombre apellido email')
        .sort({ prioridad: -1, fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener registros con alertas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async cerrarRegistro(id: string, organizacionId: string, cierreData: any): Promise<IRegistro | null> {
    try {
      const registro = await Registro.findOne({ id, organizacionId, isActive: true });
      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      const { responsable, resultado, comentarios, evidencia, leccionesAprendidas } = cierreData;
      
      if (!responsable || !resultado || !comentarios) {
        throw new Error('Responsable, resultado y comentarios son requeridos para cerrar el registro');
      }

      registro.cerrar(responsable, resultado, comentarios, evidencia || [], leccionesAprendidas || []);
      return await registro.save();
    } catch (error) {
      throw new Error(`Error al cerrar registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async agregarSeguimiento(id: string, organizacionId: string, seguimientoData: any): Promise<IRegistro | null> {
    try {
      const registro = await Registro.findOne({ id, organizacionId, isActive: true });
      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      const { responsable, comentarios, progreso, evidencia } = seguimientoData;
      
      if (!responsable || !comentarios || progreso === undefined) {
        throw new Error('Responsable, comentarios y progreso son requeridos');
      }

      if (progreso < 0 || progreso > 100) {
        throw new Error('El progreso debe estar entre 0 y 100');
      }

      registro.agregarSeguimiento(responsable, comentarios, progreso, evidencia);
      return await registro.save();
    } catch (error) {
      throw new Error(`Error al agregar seguimiento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async actualizarAccion(id: string, organizacionId: string, accionIndex: number, accionData: any): Promise<IRegistro | null> {
    try {
      const registro = await Registro.findOne({ id, organizacionId, isActive: true });
      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      if (accionIndex < 0 || accionIndex >= registro.acciones.length) {
        throw new Error('Índice de acción inválido');
      }

      // Actualizar la acción
      Object.assign(registro.acciones[accionIndex], accionData);
      
      return await registro.save();
    } catch (error) {
      throw new Error(`Error al actualizar acción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasRegistros(organizacionId: string): Promise<any> {
    try {
      const estadisticas = await Registro.aggregate([
        { $match: { organizacionId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: {
              $push: {
                tipo: '$tipo',
                estado: '$estado',
                prioridad: '$prioridad',
                categoria: '$categoria'
              }
            },
            porEstado: {
              $push: '$estado'
            },
            porPrioridad: {
              $push: '$prioridad'
            },
            porCategoria: {
              $push: '$categoria'
            },
            vencidos: {
              $sum: {
                $cond: [
                  { $and: [
                    { $lt: ['$fechaVencimiento', new Date()] },
                    { $ne: ['$estado', 'cerrado'] }
                  ]},
                  1,
                  0
                ]
              }
            },
            conAlertas: {
              $sum: {
                $cond: ['$alertas.generadas', 1, 0]
              }
            }
          }
        }
      ]);

      if (estadisticas.length === 0) {
        return {
          total: 0,
          porTipo: { actividad: 0, incidente: 0, no_conformidad: 0, accion_correctiva: 0, accion_preventiva: 0, mejora: 0, auditoria: 0, revision: 0 },
          porEstado: { abierto: 0, en_progreso: 0, cerrado: 0, cancelado: 0, vencido: 0 },
          porPrioridad: { baja: 0, media: 0, alta: 0, critica: 0 },
          porCategoria: { calidad: 0, ambiental: 0, seguridad: 0, operacional: 0, financiero: 0 },
          vencidos: 0,
          conAlertas: 0
        };
      }

      const stats = estadisticas[0];
      const porTipo = { actividad: 0, incidente: 0, no_conformidad: 0, accion_correctiva: 0, accion_preventiva: 0, mejora: 0, auditoria: 0, revision: 0 };
      const porEstado = { abierto: 0, en_progreso: 0, cerrado: 0, cancelado: 0, vencido: 0 };
      const porPrioridad = { baja: 0, media: 0, alta: 0, critica: 0 };
      const porCategoria = { calidad: 0, ambiental: 0, seguridad: 0, operacional: 0, financiero: 0 };

      stats.porTipo.forEach((item: any) => {
        porTipo[item.tipo as keyof typeof porTipo]++;
        porEstado[item.estado as keyof typeof porEstado]++;
        porPrioridad[item.prioridad as keyof typeof porPrioridad]++;
        porCategoria[item.categoria as keyof typeof porCategoria]++;
      });

      return {
        total: stats.total,
        porTipo,
        porEstado,
        porPrioridad,
        porCategoria,
        vencidos: stats.vencidos,
        conAlertas: stats.conAlertas
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

export default new RegistroService();