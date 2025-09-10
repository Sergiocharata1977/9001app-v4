import { Request, Response, NextFunction } from 'express';
import registroService from './registro.service.js';
import { IRegistro } from './registro.model.js';

export interface IRegistroController {
  createRegistro(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistros(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistroById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateRegistro(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteRegistro(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByTipo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByEstado(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByPrioridad(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosByCategoria(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosVencidos(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosNecesitanAtencion(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRegistrosConAlertas(req: Request, res: Response, next: NextFunction): Promise<void>;
  cerrarRegistro(req: Request, res: Response, next: NextFunction): Promise<void>;
  agregarSeguimiento(req: Request, res: Response, next: NextFunction): Promise<void>;
  actualizarAccion(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEstadisticasRegistros(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class RegistroController implements IRegistroController {
  async createRegistro(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registroData = {
        ...req.body,
        organizacionId
      };

      const registro = await registroService.createRegistro(registroData);
      
      res.status(201).json({
        success: true,
        message: 'Registro creado exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistros(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        prioridad: req.query.prioridad as string,
        categoria: req.query.categoria as string,
        procesoId: req.query.procesoId as string,
        departamentoId: req.query.departamentoId as string,
        responsable: req.query.responsable as string,
        fechaInicio: req.query.fechaInicio as string,
        fechaFin: req.query.fechaFin as string,
        vencido: req.query.vencido as string,
        busqueda: req.query.busqueda as string
      };

      // Eliminar filtros undefined
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const registros = await registroService.getRegistros(organizacionId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Registros obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistroById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registro = await registroService.getRegistroById(id, organizacionId);
      
      if (!registro) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro obtenido exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRegistro(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registro = await registroService.updateRegistro(id, organizacionId, req.body);
      
      if (!registro) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro actualizado exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRegistro(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const deleted = await registroService.deleteRegistro(id, organizacionId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByProceso(procesoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros del proceso obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByDepartamento(departamentoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros del departamento obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByResponsable(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByResponsable(responsableId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros del responsable obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByTipo(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByTipo(tipo, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Registros de tipo ${tipo} obtenidos exitosamente`,
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByEstado(estado, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Registros en estado ${estado} obtenidos exitosamente`,
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByPrioridad(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const registros = await registroService.getRegistrosByPrioridad(prioridad, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Registros de prioridad ${prioridad} obtenidos exitosamente`,
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosByCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoria } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registros = await registroService.getRegistrosByCategoria(categoria, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Registros de categoría ${categoria} obtenidos exitosamente`,
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosVencidos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registros = await registroService.getRegistrosVencidos(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros vencidos obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosNecesitanAtencion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registros = await registroService.getRegistrosNecesitanAtencion(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros que necesitan atención obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrosConAlertas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registros = await registroService.getRegistrosConAlertas(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Registros con alertas obtenidos exitosamente',
        data: registros,
        count: registros.length
      });
    } catch (error) {
      next(error);
    }
  }

  async cerrarRegistro(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { responsable, resultado, comentarios, evidencia, leccionesAprendidas } = req.body;

      if (!responsable || !resultado || !comentarios) {
        res.status(400).json({
          success: false,
          message: 'Responsable, resultado y comentarios son requeridos'
        });
        return;
      }

      const registro = await registroService.cerrarRegistro(
        id, 
        organizacionId, 
        { responsable, resultado, comentarios, evidencia, leccionesAprendidas }
      );
      
      if (!registro) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Registro cerrado exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async agregarSeguimiento(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { responsable, comentarios, progreso, evidencia } = req.body;

      if (!responsable || !comentarios || progreso === undefined) {
        res.status(400).json({
          success: false,
          message: 'Responsable, comentarios y progreso son requeridos'
        });
        return;
      }

      const registro = await registroService.agregarSeguimiento(
        id, 
        organizacionId, 
        { responsable, comentarios, progreso, evidencia }
      );
      
      if (!registro) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Seguimiento agregado exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizarAccion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, accionIndex } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const registro = await registroService.actualizarAccion(
        id, 
        organizacionId, 
        parseInt(accionIndex), 
        req.body
      );
      
      if (!registro) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Acción actualizada exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticasRegistros(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const estadisticas = await registroService.getEstadisticasRegistros(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de registros obtenidas exitosamente',
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RegistroController();