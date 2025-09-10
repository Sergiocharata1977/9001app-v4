import { Request, Response, NextFunction } from 'express';
import procesoService from './proceso.service.js';
import { IProceso } from './proceso.model.js';

export interface IProcesoController {
  createProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesos(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesoById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesosPendientesRevision(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesosByTipo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProcesosByEstado(req: Request, res: Response, next: NextFunction): Promise<void>;
  actualizarVersionProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  aprobarProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  marcarObsoleto(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEstadisticasProcesos(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class ProcesoController implements IProcesoController {
  async createProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const procesoData = {
        ...req.body,
        organizacionId
      };

      const proceso = await procesoService.createProceso(procesoData);
      
      res.status(201).json({
        success: true,
        message: 'Proceso creado exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesos(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        estado: req.query.estado as string,
        departamentoId: req.query.departamentoId as string,
        responsable: req.query.responsable as string,
        busqueda: req.query.busqueda as string
      };

      // Eliminar filtros undefined
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const procesos = await procesoService.getProcesos(organizacionId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Procesos obtenidos exitosamente',
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesoById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const proceso = await procesoService.getProcesoById(id, organizacionId);
      
      if (!proceso) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Proceso obtenido exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const proceso = await procesoService.updateProceso(id, organizacionId, req.body);
      
      if (!proceso) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Proceso actualizado exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const deleted = await procesoService.deleteProceso(id, organizacionId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Proceso eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const procesos = await procesoService.getProcesosByDepartamento(departamentoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Procesos del departamento obtenidos exitosamente',
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const procesos = await procesoService.getProcesosByResponsable(responsableId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Procesos del responsable obtenidos exitosamente',
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesosPendientesRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const procesos = await procesoService.getProcesosPendientesRevision(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Procesos pendientes de revisión obtenidos exitosamente',
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesosByTipo(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const procesos = await procesoService.getProcesosByTipo(tipo, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Procesos de tipo ${tipo} obtenidos exitosamente`,
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getProcesosByEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const procesos = await procesoService.getProcesosByEstado(estado, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Procesos en estado ${estado} obtenidos exitosamente`,
        data: procesos,
        count: procesos.length
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizarVersionProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nuevaVersion } = req.body;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      if (!nuevaVersion) {
        res.status(400).json({
          success: false,
          message: 'Nueva versión requerida'
        });
        return;
      }

      const proceso = await procesoService.actualizarVersionProceso(id, organizacionId, nuevaVersion);
      
      if (!proceso) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Versión del proceso actualizada exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async aprobarProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { fechaAprobacion } = req.body;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const proceso = await procesoService.aprobarProceso(
        id, 
        organizacionId, 
        fechaAprobacion ? new Date(fechaAprobacion) : new Date()
      );
      
      if (!proceso) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Proceso aprobado exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async marcarObsoleto(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const proceso = await procesoService.marcarObsoleto(id, organizacionId);
      
      if (!proceso) {
        res.status(404).json({
          success: false,
          message: 'Proceso no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Proceso marcado como obsoleto exitosamente',
        data: proceso
      });
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticasProcesos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const estadisticas = await procesoService.getEstadisticasProcesos(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de procesos obtenidas exitosamente',
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProcesoController();