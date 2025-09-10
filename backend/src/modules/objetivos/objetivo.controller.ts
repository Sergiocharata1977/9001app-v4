import { Request, Response, NextFunction } from 'express';
import objetivoService from './objetivo.service.js';
import { IObjetivo } from './objetivo.model.js';

export interface IObjetivoController {
  createObjetivo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivos(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivoById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateObjetivo(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteObjetivo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByTipo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByEstado(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosByPrioridad(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosVencidos(req: Request, res: Response, next: NextFunction): Promise<void>;
  getObjetivosNecesitanAtencion(req: Request, res: Response, next: NextFunction): Promise<void>;
  actualizarProgresoActividad(req: Request, res: Response, next: NextFunction): Promise<void>;
  agregarRevision(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEstadisticasObjetivos(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class ObjetivoController implements IObjetivoController {
  async createObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivoData = {
        ...req.body,
        organizacionId
      };

      const objetivo = await objetivoService.createObjetivo(objetivoData);
      
      res.status(201).json({
        success: true,
        message: 'Objetivo creado exitosamente',
        data: objetivo
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivos(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        tipo: req.query.tipo as string,
        categoria: req.query.categoria as string,
        estado: req.query.estado as string,
        prioridad: req.query.prioridad as string,
        departamentoId: req.query.departamentoId as string,
        procesoId: req.query.procesoId as string,
        responsable: req.query.responsable as string,
        busqueda: req.query.busqueda as string
      };

      // Eliminar filtros undefined
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const objetivos = await objetivoService.getObjetivos(organizacionId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivoById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const objetivo = await objetivoService.getObjetivoById(id, organizacionId);
      
      if (!objetivo) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Objetivo obtenido exitosamente',
        data: objetivo
      });
    } catch (error) {
      next(error);
    }
  }

  async updateObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const objetivo = await objetivoService.updateObjetivo(id, organizacionId, req.body);
      
      if (!objetivo) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Objetivo actualizado exitosamente',
        data: objetivo
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const deleted = await objetivoService.deleteObjetivo(id, organizacionId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Objetivo eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { departamentoId } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosByDepartamento(departamentoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos del departamento obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { procesoId } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosByProceso(procesoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos del proceso obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const objetivos = await objetivoService.getObjetivosByResponsable(responsableId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos del responsable obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByTipo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tipo } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosByTipo(tipo, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Objetivos de tipo ${tipo} obtenidos exitosamente`,
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const objetivos = await objetivoService.getObjetivosByEstado(estado, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Objetivos en estado ${estado} obtenidos exitosamente`,
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosByPrioridad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prioridad } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosByPrioridad(prioridad, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Objetivos de prioridad ${prioridad} obtenidos exitosamente`,
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosVencidos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosVencidos(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos vencidos obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosNecesitanAtencion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const objetivos = await objetivoService.getObjetivosNecesitanAtencion(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Objetivos que necesitan atención obtenidos exitosamente',
        data: objetivos,
        count: objetivos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizarProgresoActividad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, actividadIndex } = req.params;
      const { progreso } = req.body;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      if (progreso === undefined || progreso === null) {
        res.status(400).json({
          success: false,
          message: 'Progreso requerido'
        });
        return;
      }

      const objetivo = await objetivoService.actualizarProgresoActividad(
        id, 
        parseInt(actividadIndex), 
        progreso, 
        organizacionId
      );
      
      if (!objetivo) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Progreso de actividad actualizado exitosamente',
        data: objetivo
      });
    } catch (error) {
      next(error);
    }
  }

  async agregarRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { responsable, comentarios, progreso, acciones } = req.body;

      if (!responsable || !comentarios) {
        res.status(400).json({
          success: false,
          message: 'Responsable y comentarios son requeridos'
        });
        return;
      }

      const objetivo = await objetivoService.agregarRevision(
        id, 
        { responsable, comentarios, progreso, acciones }, 
        organizacionId
      );
      
      if (!objetivo) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Revisión agregada exitosamente',
        data: objetivo
      });
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticasObjetivos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const estadisticas = await objetivoService.getEstadisticasObjetivos(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de objetivos obtenidas exitosamente',
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ObjetivoController();