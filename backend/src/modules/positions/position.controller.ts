import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../shared/utils/logger.js';
import { ApiResponse, AppError } from '../../types/index.js';
import { PositionService } from './position.service.js';

export class PositionController {
  private positionService = new PositionService();

  getAllPositions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const { departamento_id } = req.query;
      
      const positions = await this.positionService.findAll(
        organizationId, 
        departamento_id as string
      );

      const response: ApiResponse = {
        success: true,
        message: 'Puestos obtenidos exitosamente',
        data: positions,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Puestos obtenidos para organización ${organizationId}`, {
        count: positions.length,
        departamento_id: departamento_id || 'all',
        userId: req.user!.id
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPositionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;
      
      const position = await this.positionService.findById(id, organizationId);
      
      if (!position) {
        throw new AppError('Puesto no encontrado', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Puesto obtenido exitosamente',
        data: position,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPositionsByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { departamento_id } = req.params;
      const organizationId = req.user!.organization_id;
      
      const positions = await this.positionService.findByDepartment(
        departamento_id, 
        organizationId
      );

      const response: ApiResponse = {
        success: true,
        message: 'Puestos del departamento obtenidos exitosamente',
        data: positions,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  createPosition = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const positionData = {
        ...req.body,
        organization_id: organizationId
      };

      const position = await this.positionService.create(positionData);

      const response: ApiResponse = {
        success: true,
        message: 'Puesto creado exitosamente',
        data: position,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Puesto creado: ${position.nombre}`, {
        positionId: position.id,
        departamento_id: position.departamento_id,
        organizationId,
        userId: req.user!.id
      });

      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updatePosition = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;
      const updates = req.body;

      const position = await this.positionService.update(id, organizationId, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Puesto actualizado exitosamente',
        data: position,
        timestamp: new Date().toISOString()
      };

      Logger.info(`Puesto actualizado: ${position.nombre}`, {
        positionId: id,
        organizationId,
        userId: req.user!.id,
        updates: Object.keys(updates)
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  deletePosition = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const organizationId = req.user!.organization_id;

      await this.positionService.delete(id, organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Puesto eliminado exitosamente',
        timestamp: new Date().toISOString()
      };

      Logger.info(`Puesto eliminado`, {
        positionId: id,
        organizationId,
        userId: req.user!.id
      });

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getPositionStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const organizationId = req.user!.organization_id;
      const stats = await this.positionService.getStats(organizationId);

      const response: ApiResponse = {
        success: true,
        message: 'Estadísticas de puestos obtenidas exitosamente',
        data: stats,
        timestamp: new Date().toISOString()
      };

      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
}