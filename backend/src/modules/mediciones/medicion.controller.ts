import { Request, Response, NextFunction } from 'express';
import medicionService from './medicion.service.js';
import { IMedicion } from './medicion.model.js';

export interface IMedicionController {
  createMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMediciones(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesByIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesByResponsable(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesByEstado(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesByPeriodo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesVencidas(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesNecesitanRevision(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMedicionesConAlertas(req: Request, res: Response, next: NextFunction): Promise<void>;
  aprobarMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  rechazarMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  calcularTendencia(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEstadisticasMediciones(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class MedicionController implements IMedicionController {
  async createMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const medicionData = {
        ...req.body,
        organizacionId
      };

      const medicion = await medicionService.createMedicion(medicionData);
      
      res.status(201).json({
        success: true,
        message: 'Medición creada exitosamente',
        data: medicion
      });
    } catch (error) {
      next(error);
    }
  }

  async getMediciones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const filters = {
        indicadorId: req.query.indicadorId as string,
        estado: req.query.estado as string,
        responsable: req.query.responsable as string,
        fechaInicio: req.query.fechaInicio as string,
        fechaFin: req.query.fechaFin as string,
        evaluacion: req.query.evaluacion as string,
        tendencia: req.query.tendencia as string,
        busqueda: req.query.busqueda as string
      };

      // Eliminar filtros undefined
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const mediciones = await medicionService.getMediciones(organizacionId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const medicion = await medicionService.getMedicionById(id, organizacionId);
      
      if (!medicion) {
        res.status(404).json({
          success: false,
          message: 'Medición no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medición obtenida exitosamente',
        data: medicion
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const medicion = await medicionService.updateMedicion(id, organizacionId, req.body);
      
      if (!medicion) {
        res.status(404).json({
          success: false,
          message: 'Medición no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medición actualizada exitosamente',
        data: medicion
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const deleted = await medicionService.deleteMedicion(id, organizacionId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Medición no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medición eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesByIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { indicadorId } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesByIndicador(indicadorId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones del indicador obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesByResponsable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { responsableId } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesByResponsable(responsableId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones del responsable obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesByEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estado } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesByEstado(estado, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Mediciones en estado ${estado} obtenidas exitosamente`,
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesByPeriodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { inicio, fin } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Fechas inválidas'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesByPeriodo(fechaInicio, fechaFin, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones del período obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesVencidas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesVencidas(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones vencidas obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesNecesitanRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesNecesitanRevision(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones que necesitan revisión obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicionesConAlertas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const mediciones = await medicionService.getMedicionesConAlertas(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Mediciones con alertas obtenidas exitosamente',
        data: mediciones,
        count: mediciones.length
      });
    } catch (error) {
      next(error);
    }
  }

  async aprobarMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { comentarios } = req.body;
      const revisadoPor = req.user?.id;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId || !revisadoPor) {
        res.status(400).json({
          success: false,
          message: 'ID de organización y revisor requeridos'
        });
        return;
      }

      const medicion = await medicionService.aprobarMedicion(id, organizacionId, revisadoPor, comentarios);
      
      if (!medicion) {
        res.status(404).json({
          success: false,
          message: 'Medición no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medición aprobada exitosamente',
        data: medicion
      });
    } catch (error) {
      next(error);
    }
  }

  async rechazarMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { comentarios } = req.body;
      const revisadoPor = req.user?.id;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId || !revisadoPor) {
        res.status(400).json({
          success: false,
          message: 'ID de organización y revisor requeridos'
        });
        return;
      }

      if (!comentarios) {
        res.status(400).json({
          success: false,
          message: 'Comentarios requeridos para rechazar la medición'
        });
        return;
      }

      const medicion = await medicionService.rechazarMedicion(id, organizacionId, revisadoPor, comentarios);
      
      if (!medicion) {
        res.status(404).json({
          success: false,
          message: 'Medición no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Medición rechazada exitosamente',
        data: medicion
      });
    } catch (error) {
      next(error);
    }
  }

  async calcularTendencia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { indicadorId } = req.params;
      const { periodo = 30 } = req.query;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const tendencia = await medicionService.calcularTendencia(
        indicadorId, 
        organizacionId, 
        parseInt(periodo as string)
      );
      
      res.status(200).json({
        success: true,
        message: 'Tendencia calculada exitosamente',
        data: tendencia
      });
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticasMediciones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const estadisticas = await medicionService.getEstadisticasMediciones(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de mediciones obtenidas exitosamente',
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MedicionController();