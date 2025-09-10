import { Types } from 'mongoose';
import Indicador, { IIndicador } from './indicador.model.js';

export interface IIndicadorService {
  createIndicador(data: Partial<IIndicador>): Promise<IIndicador>;
  getIndicadores(organizacionId: string, filters?: any): Promise<IIndicador[]>;
  getIndicadorById(id: string, organizacionId: string): Promise<IIndicador | null>;
  updateIndicador(id: string, organizacionId: string, data: Partial<IIndicador>): Promise<IIndicador | null>;
  deleteIndicador(id: string, organizacionId: string): Promise<boolean>;
  getIndicadoresByDepartamento(departamentoId: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByProceso(procesoId: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByObjetivo(objetivoId: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByResponsable(responsableId: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByTipo(tipo: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByCategoria(categoria: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresByEstado(estado: string, organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresActivos(organizacionId: string): Promise<IIndicador[]>;
  getIndicadoresNecesitanMedicion(organizacionId: string): Promise<IIndicador[]>;
  activarIndicador(id: string, organizacionId: string): Promise<IIndicador | null>;
  desactivarIndicador(id: string, organizacionId: string): Promise<IIndicador | null>;
  suspenderIndicador(id: string, organizacionId: string, motivo: string): Promise<IIndicador | null>;
  actualizarTendencia(id: string, organizacionId: string, mediciones: any[]): Promise<IIndicador | null>;
  getEstadisticasIndicadores(organizacionId: string): Promise<any>;
}

class IndicadorService implements IIndicadorService {
  async createIndicador(data: Partial<IIndicador>): Promise<IIndicador> {
    try {
      // Validar que el código sea único en la organización
      const indicadorExistente = await Indicador.findOne({
        organizacionId: data.organizacionId,
        codigo: data.codigo
      });

      if (indicadorExistente) {
        throw new Error(`Ya existe un indicador con el código ${data.codigo} en esta organización`);
      }

      // Validar fechas de periodicidad
      if (data.periodicidad?.inicio && data.periodicidad?.fin && 
          data.periodicidad.inicio >= data.periodicidad.fin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      // Validar umbrales
      if (data.umbrales) {
        const { critico, advertencia, satisfactorio } = data.umbrales;
        if (critico >= advertencia || advertencia >= satisfactorio) {
          throw new Error('Los umbrales deben estar en orden: crítico < advertencia < satisfactorio');
        }
      }

      const indicador = new Indicador(data);
      return await indicador.save();
    } catch (error) {
      throw new Error(`Error al crear indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadores(organizacionId: string, filters: any = {}): Promise<IIndicador[]> {
    try {
      const query: any = { organizacionId, isActive: true };

      // Aplicar filtros
      if (filters.tipo) query.tipo = filters.tipo;
      if (filters.categoria) query.categoria = filters.categoria;
      if (filters.estado) query.estado = filters.estado;
      if (filters.departamentoId) query.departamentoId = filters.departamentoId;
      if (filters.procesoId) query.procesoId = filters.procesoId;
      if (filters.objetivoId) query.objetivoId = filters.objetivoId;
      if (filters.responsable) query.responsable = filters.responsable;
      if (filters.activo !== undefined) {
        if (filters.activo) {
          query.estado = 'activo';
          query['periodicidad.activo'] = true;
        } else {
          query.$or = [
            { estado: { $ne: 'activo' } },
            { 'periodicidad.activo': false }
          ];
        }
      }
      if (filters.busqueda) {
        query.$or = [
          { nombre: { $regex: filters.busqueda, $options: 'i' } },
          { codigo: { $regex: filters.busqueda, $options: 'i' } },
          { descripcion: { $regex: filters.busqueda, $options: 'i' } }
        ];
      }

      return await Indicador.find(query)
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadorById(id: string, organizacionId: string): Promise<IIndicador | null> {
    try {
      return await Indicador.findOne({ id, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido email telefono')
        .populate('departamento', 'nombre codigo descripcion')
        .populate('proceso', 'nombre codigo descripcion')
        .populate('objetivo', 'nombre codigo descripcion')
        .populate('medicionesInfo', 'valor fecha estado observaciones')
        .populate('ultimaMedicion', 'valor fecha estado observaciones');
    } catch (error) {
      throw new Error(`Error al obtener indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async updateIndicador(id: string, organizacionId: string, data: Partial<IIndicador>): Promise<IIndicador | null> {
    try {
      // Validar fechas de periodicidad si se proporcionan
      if (data.periodicidad?.inicio && data.periodicidad?.fin && 
          data.periodicidad.inicio >= data.periodicidad.fin) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }

      // Validar umbrales si se proporcionan
      if (data.umbrales) {
        const { critico, advertencia, satisfactorio } = data.umbrales;
        if (critico >= advertencia || advertencia >= satisfactorio) {
          throw new Error('Los umbrales deben estar en orden: crítico < advertencia < satisfactorio');
        }
      }

      return await Indicador.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: data },
        { new: true, runValidators: true }
      ).populate('responsableInfo departamento proceso objetivo ultimaMedicion');
    } catch (error) {
      throw new Error(`Error al actualizar indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async deleteIndicador(id: string, organizacionId: string): Promise<boolean> {
    try {
      const resultado = await Indicador.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      return !!resultado;
    } catch (error) {
      throw new Error(`Error al eliminar indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByDepartamento(departamentoId: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ departamentoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por departamento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByProceso(procesoId: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ procesoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por proceso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByObjetivo(objetivoId: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ objetivoId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por objetivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByResponsable(responsableId: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ responsable: responsableId, organizacionId, isActive: true })
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por responsable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByTipo(tipo: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ tipo, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por tipo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByCategoria(categoria: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ categoria, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresByEstado(estado: string, organizacionId: string): Promise<IIndicador[]> {
    try {
      return await Indicador.find({ estado, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores por estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresActivos(organizacionId: string): Promise<IIndicador[]> {
    try {
      const hoy = new Date();
      return await Indicador.find({
        organizacionId,
        isActive: true,
        estado: 'activo',
        'periodicidad.activo': true,
        'periodicidad.inicio': { $lte: hoy },
        $or: [
          { 'periodicidad.fin': { $exists: false } },
          { 'periodicidad.fin': { $gte: hoy } }
        ]
      })
        .populate('responsableInfo', 'nombre apellido email')
        .populate('departamento', 'nombre codigo')
        .populate('proceso', 'nombre codigo')
        .populate('objetivo', 'nombre codigo')
        .populate('ultimaMedicion', 'valor fecha estado')
        .sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener indicadores activos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getIndicadoresNecesitanMedicion(organizacionId: string): Promise<IIndicador[]> {
    try {
      const indicadores = await this.getIndicadoresActivos(organizacionId);
      
      // Filtrar indicadores que necesitan medición
      return indicadores.filter(indicador => indicador.necesitaMedicion());
    } catch (error) {
      throw new Error(`Error al obtener indicadores que necesitan medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async activarIndicador(id: string, organizacionId: string): Promise<IIndicador | null> {
    try {
      return await Indicador.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            estado: 'activo',
            'periodicidad.activo': true
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al activar indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async desactivarIndicador(id: string, organizacionId: string): Promise<IIndicador | null> {
    try {
      return await Indicador.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            estado: 'inactivo',
            'periodicidad.activo': false
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al desactivar indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async suspenderIndicador(id: string, organizacionId: string, motivo: string): Promise<IIndicador | null> {
    try {
      return await Indicador.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { 
          $set: { 
            estado: 'suspendido',
            'periodicidad.activo': false
          }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error al suspender indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async actualizarTendencia(id: string, organizacionId: string, mediciones: any[]): Promise<IIndicador | null> {
    try {
      if (mediciones.length < 2) {
        throw new Error('Se necesitan al menos 2 mediciones para calcular la tendencia');
      }

      const indicador = await Indicador.findOne({ id, organizacionId, isActive: true });
      if (!indicador) {
        throw new Error('Indicador no encontrado');
      }

      // Ordenar mediciones por fecha
      const medicionesOrdenadas = mediciones.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      // Calcular tendencia
      const primera = medicionesOrdenadas[0].valor;
      const ultima = medicionesOrdenadas[medicionesOrdenadas.length - 1].valor;
      const cambio = ((ultima - primera) / primera) * 100;
      
      let direccion: 'ascendente' | 'descendente' | 'estable' = 'estable';
      if (Math.abs(cambio) > 5) { // Umbral del 5% para considerar cambio significativo
        direccion = cambio > 0 ? 'ascendente' : 'descendente';
      }

      indicador.tendencia = {
        direccion,
        periodo: indicador.tendencia.periodo,
        valor: Math.abs(cambio)
      };

      return await indicador.save();
    } catch (error) {
      throw new Error(`Error al actualizar tendencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasIndicadores(organizacionId: string): Promise<any> {
    try {
      const estadisticas = await Indicador.aggregate([
        { $match: { organizacionId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: {
              $push: {
                tipo: '$tipo',
                estado: '$estado',
                categoria: '$categoria'
              }
            },
            porEstado: {
              $push: '$estado'
            },
            porCategoria: {
              $push: '$categoria'
            },
            activos: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ['$estado', 'activo'] },
                    { $eq: ['$periodicidad.activo', true] }
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
          porTipo: { efectividad: 0, eficiencia: 0, satisfaccion: 0, conformidad: 0, mejora: 0 },
          porEstado: { activo: 0, inactivo: 0, suspendido: 0 },
          porCategoria: { calidad: 0, ambiental: 0, seguridad: 0, financiero: 0, operacional: 0 },
          activos: 0
        };
      }

      const stats = estadisticas[0];
      const porTipo = { efectividad: 0, eficiencia: 0, satisfaccion: 0, conformidad: 0, mejora: 0 };
      const porEstado = { activo: 0, inactivo: 0, suspendido: 0 };
      const porCategoria = { calidad: 0, ambiental: 0, seguridad: 0, financiero: 0, operacional: 0 };

      stats.porTipo.forEach((item: any) => {
        porTipo[item.tipo as keyof typeof porTipo]++;
        porEstado[item.estado as keyof typeof porEstado]++;
        porCategoria[item.categoria as keyof typeof porCategoria]++;
      });

      return {
        total: stats.total,
        porTipo,
        porEstado,
        porCategoria,
        activos: stats.activos
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

export default new IndicadorService();