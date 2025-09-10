import { Request, Response, NextFunction } from 'express';
import indicadorService from './indicador.service.js';
import { IIndicador } from './indicador.model.js';

export interface IIndicadorController {
  createIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadores(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadorById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByProceso(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByObjetivo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByResponsable(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByTipo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByCategoria(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresByEstado(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresActivos(req: Request, res: Response, next: NextFunction): Promise<void>;
  getIndicadoresNecesitanMedicion(req: Request, res: Response, next: NextFunction): Promise<void>;
  activarIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  desactivarIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  suspenderIndicador(req: Request, res: Response, next: NextFunction): Promise<void>;
  actualizarTendencia(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEstadisticasIndicadores(req: Request, res: Response, next: NextFunction): Promise<void>;
}

class IndicadorController implements IIndicadorController {
  async createIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const indicadorData = {
        ...req.body,
        organizacionId
      };

      const indicador = await indicadorService.createIndicador(indicadorData);
      
      res.status(201).json({
        success: true,
        message: 'Indicador creado exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadores(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        departamentoId: req.query.departamentoId as string,
        procesoId: req.query.procesoId as string,
        objetivoId: req.query.objetivoId as string,
        responsable: req.query.responsable as string,
        activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined,
        busqueda: req.query.busqueda as string
      };

      // Eliminar filtros undefined
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const indicadores = await indicadorService.getIndicadores(organizacionId, filters);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadorById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicador = await indicadorService.getIndicadorById(id, organizacionId);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador obtenido exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async updateIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicador = await indicadorService.updateIndicador(id, organizacionId, req.body);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador actualizado exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const deleted = await indicadorService.deleteIndicador(id, organizacionId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByDepartamento(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByDepartamento(departamentoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores del departamento obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByProceso(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByProceso(procesoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores del proceso obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { objetivoId } = req.params;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const indicadores = await indicadorService.getIndicadoresByObjetivo(objetivoId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores del objetivo obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByResponsable(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByResponsable(responsableId, organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores del responsable obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByTipo(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByTipo(tipo, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Indicadores de tipo ${tipo} obtenidos exitosamente`,
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByCategoria(categoria, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Indicadores de categoría ${categoria} obtenidos exitosamente`,
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresByEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicadores = await indicadorService.getIndicadoresByEstado(estado, organizacionId);
      
      res.status(200).json({
        success: true,
        message: `Indicadores en estado ${estado} obtenidos exitosamente`,
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresActivos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const indicadores = await indicadorService.getIndicadoresActivos(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores activos obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndicadoresNecesitanMedicion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const indicadores = await indicadorService.getIndicadoresNecesitanMedicion(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Indicadores que necesitan medición obtenidos exitosamente',
        data: indicadores,
        count: indicadores.length
      });
    } catch (error) {
      next(error);
    }
  }

  async activarIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicador = await indicadorService.activarIndicador(id, organizacionId);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador activado exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async desactivarIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const indicador = await indicadorService.desactivarIndicador(id, organizacionId);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador desactivado exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async suspenderIndicador(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const indicador = await indicadorService.suspenderIndicador(id, organizacionId, motivo);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Indicador suspendido exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizarTendencia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { mediciones } = req.body;
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      if (!mediciones || !Array.isArray(mediciones)) {
        res.status(400).json({
          success: false,
          message: 'Array de mediciones requerido'
        });
        return;
      }

      const indicador = await indicadorService.actualizarTendencia(id, organizacionId, mediciones);
      
      if (!indicador) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Tendencia actualizada exitosamente',
        data: indicador
      });
    } catch (error) {
      next(error);
    }
  }

  async getEstadisticasIndicadores(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizacionId = req.user?.organizacionId;
      
      if (!organizacionId) {
        res.status(400).json({
          success: false,
          message: 'ID de organización requerido'
        });
        return;
      }

      const estadisticas = await indicadorService.getEstadisticasIndicadores(organizacionId);
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas de indicadores obtenidas exitosamente',
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new IndicadorController();