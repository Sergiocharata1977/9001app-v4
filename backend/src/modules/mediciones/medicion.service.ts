import { Types } from 'mongoose';
import Medicion, { IMedicion } from './medicion.model.js';
import Indicador from '../indicadores/indicador.model.js';

export interface IMedicionService {
  createMedicion(data: Partial<IMedicion>): Promise<IMedicion>;
  getMediciones(organizacionId: string, filters?: any): Promise<IMedicion[]>;
  getMedicionById(id: string, organizacionId: string): Promise<IMedicion | null>;
  updateMedicion(id: string, organizacionId: string, data: Partial<IMedicion>): Promise<IMedicion | null>;
  deleteMedicion(id: string, organizacionId: string): Promise<boolean>;
  getMedicionesByIndicador(indicadorId: string, organizacionId: string): Promise<IMedicion[]>;
  getMedicionesByResponsable(responsableId: string, organizacionId: string): Promise<IMedicion[]>;
  getMedicionesByEstado(estado: string, organizacionId: string): Promise<IMedicion[]>;
  getMedicionesByPeriodo(inicio: Date, fin: Date, organizacionId: string): Promise<IMedicion[]>;
  getMedicionesVencidas(organizacionId: string): Promise<IMedicion[]>;
  getMedicionesNecesitanRevision(organizacionId: string): Promise<IMedicion[]>;
  getMedicionesConAlertas(organizacionId: string): Promise<IMedicion[]>;
  aprobarMedicion(id: string, organizacionId: string, revisadoPor: string, comentarios?: string): Promise<IMedicion | null>;
  rechazarMedicion(id: string, organizacionId: string, revisadoPor: string, comentarios: string): Promise<IMedicion | null>;
  calcularTendencia(indicadorId: string, organizacionId: string, periodo: number): Promise<any>;
  getEstadisticasMediciones(organizacionId: string): Promise<any>;
}

class MedicionService implements IMedicionService {
  async createMedicion(data: Partial<IMedicion>): Promise<IMedicion> {
    try {
      // Validar que el código sea único en la organización
      const medicionExistente = await Medicion.findOne({
        organizacionId: data.organizacionId,
        codigo: data.codigo
      });

      if (medicionExistente) {
        throw new Error(`Ya existe una medición con el código ${data.codigo} en esta organización`);
      }

      // Validar fechas del período
      if (data.periodo?.inicio && data.periodo?.fin && 
          data.periodo.inicio >= data.periodo.fin) {
        throw new Error('La fecha de inicio del período debe ser anterior a la fecha de fin');
      }

      // Obtener el indicador para análisis automático
      const indicador = await Indicador.findOne({ 
        id: data.indicadorId, 
        organizacionId: data.organizacionId 
      });

      if (!indicador) {
        throw new Error('Indicador no encontrado');
      }

      // Obtener la medición anterior para comparación
      const medicionAnterior = await Medicion.findOne({
        indicadorId: data.indicadorId,
        organizacionId: data.organizacionId,
        isActive: true
      }).sort({ fecha: -1 });

      const medicion = new Medicion(data);
      
      // Calcular análisis automático
      medicion.calcularAnalisis(indicador, medicionAnterior);
      
      // Generar alertas si es necesario
      medicion.generarAlertas(indicador);
      
      return await medicion.save();
    } catch (error) {
      throw new Error(`Error al crear medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMediciones(organizacionId: string, filters: any = {}): Promise<IMedicion[]> {
    try {
      const query: any = { organizacionId, isActive: true };

      // Aplicar filtros
      if (filters.indicadorId) query.indicadorId = filters.indicadorId;
      if (filters.estado) query.estado = filters.estado;
      if (filters.responsable) query.responsable = filters.responsable;
      if (filters.fechaInicio || filters.fechaFin) {
        query.fecha = {};
        if (filters.fechaInicio) query.fecha.$gte = new Date(filters.fechaInicio);
        if (filters.fechaFin) query.fecha.$lte = new Date(filters.fechaFin);
      }
      if (filters.evaluacion) query['analisis.evaluacion'] = filters.evaluacion;
      if (filters.tendencia) query['analisis.tendencia'] = filters.tendencia;
      if (filters.busqueda) {
        query.$or = [
          { codigo: { $regex: filters.busqueda, $options: 'i' } },
          { observaciones: { $regex: filters.busqueda, $options: 'i' } }
        ];
      }

      return await Medicion.find(query)
        .populate('indicador', 'nombre codigo unidad umbrales meta')
        .populate('responsableInfo', 'nombre apellido email')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionById(id: string, organizacionId: string): Promise<IMedicion | null> {
    try {
      return await Medicion.findOne({ id, organizacionId, isActive: true })
        .populate('indicador', 'nombre codigo descripcion unidad umbrales meta formula')
        .populate('responsableInfo', 'nombre apellido email telefono')
        .populate('revisorInfo', 'nombre apellido email');
    } catch (error) {
      throw new Error(`Error al obtener medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async updateMedicion(id: string, organizacionId: string, data: Partial<IMedicion>): Promise<IMedicion | null> {
    try {
      // Validar fechas del período si se proporcionan
      if (data.periodo?.inicio && data.periodo?.fin && 
          data.periodo.inicio >= data.periodo.fin) {
        throw new Error('La fecha de inicio del período debe ser anterior a la fecha de fin');
      }

      const medicion = await Medicion.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: data },
        { new: true, runValidators: true }
      ).populate('indicador responsableInfo revisorInfo');

      // Recalcular análisis si se actualizó el valor
      if (medicion && data.valor !== undefined) {
        const indicador = await Indicador.findOne({ 
          id: medicion.indicadorId, 
          organizacionId 
        });
        
        if (indicador) {
          medicion.calcularAnalisis(indicador);
          medicion.generarAlertas(indicador);
          await medicion.save();
        }
      }

      return medicion;
    } catch (error) {
      throw new Error(`Error al actualizar medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async deleteMedicion(id: string, organizacionId: string): Promise<boolean> {
    try {
      const resultado = await Medicion.findOneAndUpdate(
        { id, organizacionId, isActive: true },
        { $set: { isActive: false } },
        { new: true }
      );
      return !!resultado;
    } catch (error) {
      throw new Error(`Error al eliminar medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesByIndicador(indicadorId: string, organizacionId: string): Promise<IMedicion[]> {
    try {
      return await Medicion.find({ indicadorId, organizacionId, isActive: true })
        .populate('responsableInfo', 'nombre apellido')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones por indicador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesByResponsable(responsableId: string, organizacionId: string): Promise<IMedicion[]> {
    try {
      return await Medicion.find({ responsable: responsableId, organizacionId, isActive: true })
        .populate('indicador', 'nombre codigo unidad')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones por responsable: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesByEstado(estado: string, organizacionId: string): Promise<IMedicion[]> {
    try {
      return await Medicion.find({ estado, organizacionId, isActive: true })
        .populate('indicador', 'nombre codigo unidad')
        .populate('responsableInfo', 'nombre apellido')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones por estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesByPeriodo(inicio: Date, fin: Date, organizacionId: string): Promise<IMedicion[]> {
    try {
      return await Medicion.find({
        organizacionId,
        isActive: true,
        fecha: { $gte: inicio, $lte: fin }
      })
        .populate('indicador', 'nombre codigo unidad')
        .populate('responsableInfo', 'nombre apellido')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones por período: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesVencidas(organizacionId: string): Promise<IMedicion[]> {
    try {
      const mediciones = await Medicion.find({
        organizacionId,
        isActive: true,
        estado: 'pendiente'
      })
        .populate('indicador', 'nombre codigo unidad')
        .populate('responsableInfo', 'nombre apellido email')
        .sort({ 'periodo.fin': 1 });

      // Filtrar mediciones vencidas
      return mediciones.filter(medicion => medicion.estaVencida());
    } catch (error) {
      throw new Error(`Error al obtener mediciones vencidas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesNecesitanRevision(organizacionId: string): Promise<IMedicion[]> {
    try {
      const mediciones = await Medicion.find({
        organizacionId,
        isActive: true,
        estado: 'completada'
      })
        .populate('indicador', 'nombre codigo unidad')
        .populate('responsableInfo', 'nombre apellido email')
        .populate('revisorInfo', 'nombre apellido')
        .sort({ fecha: -1 });

      // Filtrar mediciones que necesitan revisión
      return mediciones.filter(medicion => medicion.necesitaRevision());
    } catch (error) {
      throw new Error(`Error al obtener mediciones que necesitan revisión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getMedicionesConAlertas(organizacionId: string): Promise<IMedicion[]> {
    try {
      return await Medicion.find({
        organizacionId,
        isActive: true,
        'alertas.generadas': true
      })
        .populate('indicador', 'nombre codigo unidad')
        .populate('responsableInfo', 'nombre apellido email')
        .sort({ fecha: -1 });
    } catch (error) {
      throw new Error(`Error al obtener mediciones con alertas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async aprobarMedicion(id: string, organizacionId: string, revisadoPor: string, comentarios?: string): Promise<IMedicion | null> {
    try {
      const medicion = await Medicion.findOne({ id, organizacionId, isActive: true });
      if (!medicion) {
        throw new Error('Medición no encontrada');
      }

      medicion.aprobar(revisadoPor, comentarios);
      return await medicion.save();
    } catch (error) {
      throw new Error(`Error al aprobar medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async rechazarMedicion(id: string, organizacionId: string, revisadoPor: string, comentarios: string): Promise<IMedicion | null> {
    try {
      const medicion = await Medicion.findOne({ id, organizacionId, isActive: true });
      if (!medicion) {
        throw new Error('Medición no encontrada');
      }

      medicion.rechazar(revisadoPor, comentarios);
      return await medicion.save();
    } catch (error) {
      throw new Error(`Error al rechazar medición: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async calcularTendencia(indicadorId: string, organizacionId: string, periodo: number): Promise<any> {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - periodo);

      const mediciones = await Medicion.find({
        indicadorId,
        organizacionId,
        isActive: true,
        fecha: { $gte: fechaInicio },
        estado: 'aprobada'
      }).sort({ fecha: 1 });

      if (mediciones.length < 2) {
        return {
          tendencia: 'insuficientes_datos',
          cambio: 0,
          porcentajeCambio: 0,
          mediciones: mediciones.length
        };
      }

      const primera = mediciones[0].valor;
      const ultima = mediciones[mediciones.length - 1].valor;
      const cambio = ultima - primera;
      const porcentajeCambio = primera !== 0 ? (cambio / primera) * 100 : 0;

      let tendencia: 'ascendente' | 'descendente' | 'estable' = 'estable';
      if (Math.abs(porcentajeCambio) > 5) {
        tendencia = porcentajeCambio > 0 ? 'ascendente' : 'descendente';
      }

      return {
        tendencia,
        cambio,
        porcentajeCambio: Math.abs(porcentajeCambio),
        mediciones: mediciones.length,
        primera,
        ultima
      };
    } catch (error) {
      throw new Error(`Error al calcular tendencia: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getEstadisticasMediciones(organizacionId: string): Promise<any> {
    try {
      const estadisticas = await Medicion.aggregate([
        { $match: { organizacionId, isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porEstado: {
              $push: '$estado'
            },
            porEvaluacion: {
              $push: '$analisis.evaluacion'
            },
            porTendencia: {
              $push: '$analisis.tendencia'
            },
            conAlertas: {
              $sum: {
                $cond: ['$alertas.generadas', 1, 0]
              }
            },
            vencidas: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ['$estado', 'pendiente'] },
                    { $lt: ['$periodo.fin', new Date()] }
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
          porEstado: { pendiente: 0, en_progreso: 0, completada: 0, rechazada: 0, aprobada: 0 },
          porEvaluacion: { excelente: 0, bueno: 0, regular: 0, deficiente: 0, critico: 0 },
          porTendencia: { ascendente: 0, descendente: 0, estable: 0, variable: 0 },
          conAlertas: 0,
          vencidas: 0
        };
      }

      const stats = estadisticas[0];
      const porEstado = { pendiente: 0, en_progreso: 0, completada: 0, rechazada: 0, aprobada: 0 };
      const porEvaluacion = { excelente: 0, bueno: 0, regular: 0, deficiente: 0, critico: 0 };
      const porTendencia = { ascendente: 0, descendente: 0, estable: 0, variable: 0 };

      stats.porEstado.forEach((estado: string) => {
        if (porEstado[estado as keyof typeof porEstado] !== undefined) {
          porEstado[estado as keyof typeof porEstado]++;
        }
      });

      stats.porEvaluacion.forEach((evaluacion: string) => {
        if (porEvaluacion[evaluacion as keyof typeof porEvaluacion] !== undefined) {
          porEvaluacion[evaluacion as keyof typeof porEvaluacion]++;
        }
      });

      stats.porTendencia.forEach((tendencia: string) => {
        if (porTendencia[tendencia as keyof typeof porTendencia] !== undefined) {
          porTendencia[tendencia as keyof typeof porTendencia]++;
        }
      });

      return {
        total: stats.total,
        porEstado,
        porEvaluacion,
        porTendencia,
        conAlertas: stats.conAlertas,
        vencidas: stats.vencidas
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

export default new MedicionService();